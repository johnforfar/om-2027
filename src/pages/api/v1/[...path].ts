import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';

export const prerender = false;

const UPSTREAM = 'https://api.deploy.openmesh.cloud/api/v1/';
const OPEN = new Set(['health']);
const ROUTES = [/^health$/, /^instruments$/, /^instruments\/[a-z0-9_-]{1,40}$/, /^site\/instruments$/, /^offers$/];
const PARAMS = new Set(['basis', 'metric', 'tier', 'provider', 'gpu', 'cat', 'sort', 'limit', 'cursor']);
const MAX_LIMIT = 100;
const TIMEOUT_MS = 10000;

const NO_STORE = { 'Cache-Control': 'no-store' };
const CACHED = {
  'Cache-Control': 'public, max-age=300',
  'CDN-Cache-Control': 'max-age=3600, stale-while-revalidate=86400',
};

function fail(status: number, error: string) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json', ...NO_STORE },
  });
}

function sameOrigin(request: Request, url: URL) {
  const site = request.headers.get('sec-fetch-site');
  if (site) return site === 'same-origin';
  const referer = request.headers.get('referer');
  if (!referer) return false;
  try {
    return new URL(referer).origin === url.origin;
  } catch (err) {
    console.warn('api: unparseable referer', referer, err);
    return false;
  }
}

function upstreamQuery(url: URL) {
  const out = new URLSearchParams();
  for (const [k, v] of url.searchParams) {
    if (!PARAMS.has(k)) continue;
    if (k === 'limit') {
      const n = Number.parseInt(v, 10);
      if (!Number.isFinite(n) || n < 1) continue;
      out.set(k, String(Math.min(n, MAX_LIMIT)));
    } else {
      out.set(k, v.slice(0, 80));
    }
  }
  out.sort();
  const s = out.toString();
  return s ? '?' + s : '';
}

export const GET: APIRoute = async ({ params, request, url }) => {
  const path = params.path ?? '';
  if (!ROUTES.some((r) => r.test(path))) return fail(404, 'not found');
  if (!sameOrigin(request, url)) return fail(403, 'forbidden');

  const query = upstreamQuery(url);
  if (url.search !== query) {
    return new Response(null, {
      status: 308,
      headers: { Location: url.pathname + query, 'Cache-Control': 'public, max-age=3600' },
    });
  }

  const key = getSecret('EC_API_KEY');
  if (!key && !OPEN.has(path)) return fail(503, 'api key not configured');

  const target = UPSTREAM + path + query;
  let res: Response;
  try {
    res = await fetch(target, {
      headers: { Accept: 'application/json', ...(key ? { 'x-api-key': key } : {}) },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    console.error('api: upstream fetch failed', path, err);
    return fail(502, 'upstream unreachable');
  }

  if (res.status === 401 || res.status === 403) {
    console.error('api: upstream rejected key', path, res.status);
    return fail(502, 'upstream rejected credentials');
  }
  if (res.status === 429) return fail(429, 'upstream rate limit');
  if (res.status === 404) return fail(404, 'not found upstream');
  if (!res.ok) {
    console.error('api: upstream error', path, res.status);
    return fail(502, 'upstream error ' + res.status);
  }

  const headers: Record<string, string> = {
    'Content-Type': res.headers.get('content-type') ?? 'application/json',
    ...CACHED,
  };
  const licence = res.headers.get('x-data-licence');
  if (licence) headers['x-data-licence'] = licence;
  return new Response(await res.text(), { status: 200, headers });
};

export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ error: 'method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', Allow: 'GET', ...NO_STORE },
  });
