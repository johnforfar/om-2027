import SNAP from "../data/ec-snapshot.json";
const GROUPS = [
  { name: "Cloud Compute", items: [
    { key: "cpu",       tag: "VCPU", name: "CPU",     sub: "Compute · per vCPU · month",  price: 42.05 },
    { key: "gpu",       tag: "GPU",  name: "GPU",     sub: "Accelerator · per GPU · hour", price: 0.982 },
    { key: "cloud-ram", tag: "CLOU", name: "RAM",     sub: "per GB · month",              price: 3.04 },
    { key: "storage",   tag: "BLK",  name: "Storage", sub: "SSD · per TB · month",        price: 50.10 },
    { key: "bw",        tag: "BW",   name: "Network", sub: "Egress · per TB",             price: 5.00 },
  ]},
  { name: "Physical Hardware", items: [
    { key: "ref-cpu",        tag: "REF",  name: "CPU",        sub: "USD per physical core",             delta: -82.3 },
    { key: "ref-gpu",        tag: "REF",  name: "GPU",        sub: "USD per FP32 TFLOPS at launch MSRP", delta: -98.9 },
    { key: "ram",            tag: "RAM",  name: "RAM",        sub: "Memory · DRAM spot · per GB",       price: 9.12 },
    { key: "ssd",            tag: "HWSS", name: "SSD",        sub: "per GB",                            price: 0.090 },
    { key: "ref-hdd",        tag: "REF",  name: "HDD",        sub: "USD per TB",                        delta: -97.9 },
    { key: "ref-networking", tag: "REF",  name: "Networking", sub: "USD per Gbps of port capacity",     delta: -99.3 },
  ]},
  { name: "AI Models", items: [
    { key: "inf",            tag: "INF", name: "Text",       sub: "Tokens · per million",     price: 0.370 },
    { key: "ref-image",      tag: "REF", name: "Image",      sub: "USD per 1,000 images",     delta: 0 },
    { key: "ref-video",      tag: "REF", name: "Video",      sub: "USD per minute generated", delta: 0 },
    { key: "ref-audio",      tag: "REF", name: "Audio",      sub: "USD per hour of audio",    delta: -98.3 },
    { key: "ref-embeddings", tag: "REF", name: "Embeddings", sub: "USD per million tokens",   delta: 0 },
    { key: "ref-agents",     tag: "REF", name: "Agents",     sub: "USD per multi-step task",  delta: -95 },
  ]},
  { name: "Performance Economics", items: [
    { key: "inf-token",     tag: "INF", name: "Cost per Token",               sub: "Tokens · per million",                price: 0.370 },
    { key: "ref-task",      tag: "REF", name: "Cost per Task",                sub: "USD per benchmark task",              delta: -96.7 },
    { key: "ref-benchmark", tag: "REF", name: "Cost per Benchmark",           sub: "USD per 1% MMLU point",               delta: -99.6 },
    { key: "ref-watt",      tag: "REF", name: "Cost per Watt",                sub: "BF16 TFLOPS per Watt of TDP",         delta: 80.8 },
    { key: "ref-perf",      tag: "REF", name: "Cost per Unit of Performance", sub: "USD per FP32 TFLOPS at launch MSRP",  delta: -98.9 },
  ]},
  { name: "Data Centres", items: [
    { key: "pwr",         tag: "PWR", name: "Power",      sub: "Electricity · per kWh",     price: 0.190 },
    { key: "ref-cooling", tag: "REF", name: "Cooling",    sub: "PUE (overhead factor)",     delta: -42.5 },
    { key: "ref-colo",    tag: "REF", name: "Colocation", sub: "USD per kW per month",      delta: 52.9 },
    { key: "ref-network", tag: "REF", name: "Network",    sub: "USD per Mbps per month",    delta: -99 },
    { key: "ref-space",   tag: "REF", name: "Space",      sub: "USD per sq ft per month",   delta: 86.4 },
  ]},
];
const INSTRUMENTS = {};
GROUPS.forEach(g => g.items.forEach(it => { INSTRUMENTS[it.key] = { ...it, group: g.name }; }));
const LIVE_COUNT = Object.keys(INSTRUMENTS).length;

const CONTEXT = {
  cpu:       { capacity: "48.2M vCPU", energyTWh: 78,  datacenters: 1240, physicalServers: 6120000, virtualUnits: "48.2M vCPUs",        description: "Blended on-demand price of a general-purpose virtual CPU across hyperscale clouds." },
  gpu:       { capacity: "5,335 G/F",  energyTWh: 142, datacenters: 320,  physicalServers: 980000,  virtualUnits: "12.4M GPU-hours/day", description: "Blended price of one GPU-hour across H100/B200-class accelerators." },
  "cloud-ram": { capacity: "892 PB",   energyTWh: 22,  datacenters: 1240, physicalServers: 6120000, virtualUnits: "892 PB DRAM pool",    description: "Average reserved cost of 1 GB of cloud RAM for one month." },
  storage:   { capacity: "4.1 EB",     energyTWh: 18,  datacenters: 1240, physicalServers: 3400000, virtualUnits: "4.1 EB block volumes", description: "Price of one TB of provisioned SSD block storage per month." },
  bw:        { capacity: "1.2 Pbps",   energyTWh: 9,   datacenters: 980,  physicalServers: 320000,  virtualUnits: "1.2 Pbps capacity",   description: "Average cost of 1 TB of cross-region egress bandwidth." },
  inf:       { capacity: "9.8B tok/s", energyTWh: 64,  datacenters: 220,  physicalServers: 410000,  virtualUnits: "9.8B tokens/sec",     description: "Blended frontier-model price per million inference tokens." },
  "inf-token": { capacity: "9.8B tok/s", energyTWh: 64, datacenters: 220, physicalServers: 410000,  virtualUnits: "9.8B tokens/sec",     description: "Blended frontier-model price per million inference tokens." },
  pwr:       { capacity: "62 GW",      energyTWh: 400, datacenters: 1240, physicalServers: 6120000, virtualUnits: "62 GW contracted PPA", description: "Blended datacenter PPA price per kilowatt-hour." },
};

const isRef = (it) => it.price === undefined;
const headline = (it) => isRef(it) ? Math.max(0.5, 100 + it.delta) : it.price;

function mulberry32(seed) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

const TF_POINTS = { "1D": 96, "1W": 168, "1M": 120, "1Y": 260, "5Y": 260 };
const TF_LABEL = { "1D": "24 hours", "1W": "7 days", "1M": "30 days", "1Y": "1 year", "5Y": "5 years" };
const TF_STEP = { "1D": 15*60e3, "1W": 60*60e3, "1M": 6*60*60e3, "1Y": 24*60*60e3, "5Y": 7*24*60*60e3 };
function buildSeries(key, tf, basePrice) {
  const n = TF_POINTS[tf];
  const rand = mulberry32(hashStr(key + "|" + tf));
  const trend = (tf === "5Y" || tf === "1Y") ? -0.00035 : 0.00002;
  const vol = tf === "1D" ? 0.004 : tf === "1W" ? 0.008 : tf === "1M" ? 0.014 : 0.025;
  const now = Date.now(), stepMs = TF_STEP[tf];
  let price = basePrice;
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    out.unshift({ t: now - (n - 1 - i) * stepMs, price, vol: Math.round(50000 + rand() * 200000) });
    const shock = (rand() - 0.5) * 2 * vol;
    price = price / (1 + shock + trend);
    if (price < basePrice * 0.2) price = basePrice * 0.2;
  }
  out[out.length - 1].price = basePrice;
  return out;
}

const OPERATORS = ["AWS", "Azure", "GCP", "Oracle", "CoreWeave", "Lambda", "Equinix Metal"];
const REGIONS = ["us-east-1 · Ashburn","us-west-2 · Oregon","eu-west-1 · Dublin","eu-central-1 · Frankfurt","ap-northeast-1 · Tokyo","ap-southeast-1 · Singapore","ap-south-1 · Mumbai","sa-east-1 · São Paulo"];
const DC_NAMES = ["IAD-12","PDX-04","DUB-02","FRA-08","NRT-05","SIN-03","BOM-01","GRU-02","CDG-06","LHR-11","AMS-09","SYD-04","ICN-02","HKG-03"];
function buildOfferings(key, base, count = 24) {
  const rand = mulberry32(hashStr(key));
  return Array.from({ length: count }, (_, i) => {
    const op = OPERATORS[Math.floor(rand() * OPERATORS.length)];
    const region = REGIONS[Math.floor(rand() * REGIONS.length)];
    const dc = DC_NAMES[Math.floor(rand() * DC_NAMES.length)];
    const factor = 0.7 + rand() * 0.9;
    const price = base * factor;
    const change = +(rand() * 6 - 3).toFixed(2);
    return { sku: `${key.toUpperCase()}-${1000 + i}`, operator: op, region, dc, capacity: Math.round(50 + rand() * 450), price, change, sla: ["99.9%","99.95%","99.99%"][Math.floor(rand() * 3)] };
  });
}

function fmtPrice(v, prefix = "$") {
  if (v >= 1000) return prefix + v.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (v >= 100) return prefix + v.toFixed(0);
  if (v >= 1) return prefix + v.toFixed(2);
  return prefix + v.toFixed(3);
}
function fmtDelta(d) { return (d > 0 ? "+" : d < 0 ? "−" : "+") + Math.abs(d).toFixed(1).replace(/\.0$/, "") + "%"; }
function fmtTime(ts, tf) {
  const d = new Date(ts);
  if (tf === "1D") return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (tf === "1W") return d.toLocaleDateString([], { weekday: "short", hour: "2-digit" });
  if (tf === "1M" || tf === "1Y") return d.toLocaleDateString([], { month: "short", day: "numeric" });
  return d.toLocaleDateString([], { month: "short", year: "2-digit" });
}
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

const state = { key: "cpu", tf: "1M", sortKey: "price", sortDir: "asc", series: [], offerings: [] };
const $ = (id) => document.getElementById(id);

function keyFromHash() {
  const k = (location.hash || "").replace(/^#/, "").replace(/^instrument\//, "");
  return INSTRUMENTS[k] ? k : "cpu";
}

const API_METRIC = { cpu: "cpu", gpu: "gpu" };
const MIN_OBS = 50;
const TF_DAYS = { "1D": 1, "1W": 7, "1M": 30, "1Y": 365, "5Y": 1825 };
const LIVE = { series: {}, capture: null, stale: false, health: "pending", flat: {} };
const toPts = (arr) => arr.map(([d, v]) => ({ t: Date.parse(d + "T00:00:00Z"), price: +v, vol: 0 })).filter(p => !isNaN(p.t) && isFinite(p.price));
function setLive(key, pts) {
  if (pts.length === 1) { LIVE.flat[key] = true; pts = [{ ...pts[0], t: pts[0].t - 864e5 }, pts[0]]; } else delete LIVE.flat[key];
  LIVE.series[key] = pts;
  const it = INSTRUMENTS[key], last = pts[pts.length - 1].price;
  GROUPS.forEach(g => g.items.forEach(m => { if (m.key === key && !isRef(m)) m.price = last; }));
  if (!isRef(it)) it.price = last;
}
Object.entries(SNAP.series).forEach(([key, arr]) => INSTRUMENTS[key] && setLive(key, toPts(arr)));
Object.entries(SNAP.ref).forEach(([key, r]) => {
  if (!INSTRUMENTS[key]) return;
  delete INSTRUMENTS[key].price;
  INSTRUMENTS[key].delta = r.delta;
  GROUPS.forEach(g => g.items.forEach(m => { if (m.key === key) { delete m.price; m.delta = r.delta; } }));
  setLive(key, toPts(r.series));
});

function liveSeries(key, tf) {
  const all = LIVE.series[key];
  if (!all || all.length < 2) return null;
  const from = all[all.length - 1].t - TF_DAYS[tf] * 864e5;
  let pts = all.filter(p => p.t >= from);
  if (pts.length < 2) pts = all;
  return pts.map(p => ({ t: p.t, price: p.price, vol: p.vol }));
}

const fmtDay = (t) => new Date(t).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
function renderFoot() {
  if (LIVE.health === "pending") return;
  if (LIVE.health === "failed") { $("footDate").textContent = "data date unknown"; return; }
  const s = LIVE.series[state.key];
  const shown = s ? Math.min(LIVE.capture, s[s.length - 1].t) : LIVE.capture;
  $("footDate").textContent = fmtDay(shown) + (LIVE.stale ? " · data may be stale" : "");
}

function renderAll() {
  const key = state.key, it = INSTRUMENTS[key], ctx = CONTEXT[key] || {}, ref = isRef(it), base = headline(it);
  const rb = SNAP.ref[key];
  const meta = { symbol: it.tag, name: it.name, asset: it.sub, description: ctx.description || (ref ? (rb && rb.brand ? `Reference index · ${it.sub}. Median brand: ${rb.brand}, rebased to 100 at ${rb.since.slice(0, 7)}; ${fmtDelta(it.delta)} since.` : `Reference index · ${it.sub}. Baseline = 100; current level reflects ${fmtDelta(it.delta)} vs baseline.`) : `${it.group} · ${it.sub}.`) };
  const P = ref ? (v) => fmtPrice(v, "") : fmtPrice;
  state.series = liveSeries(key, state.tf) || buildSeries(key, state.tf, base);
  state.offerings = ref ? [] : buildOfferings(key.replace(/[^a-z]/g, "").slice(0, 3) || key, base);
  document.title = `${it.name} · ${ref ? fmtDelta(it.delta) : fmtPrice(base)} — Earth Compute`;

  const s = state.series;
  const first = s[0].price, last = s[s.length - 1].price;
  const change = last - first, changePct = (change / first) * 100, up = change >= 0;
  const coverage = !!LIVE.flat[key] || (!!LIVE.series[key] && s[0].vol > 0 && Math.abs(s[s.length - 1].vol / s[0].vol - 1) > 0.1);
  const high = Math.max(...s.map(p => p.price)), low = Math.min(...s.map(p => p.price));

  $("hSym").textContent = meta.symbol;
  $("hName").textContent = meta.name;
  $("hAsset").textContent = "· " + meta.asset;
  $("heroGroup").textContent = `${it.group} · ${it.sub}`;
  $("heroName").textContent = it.name;
  $("hPrice").textContent = ref ? fmtDelta(it.delta) : fmtPrice(last);
  const chg = $("hChange");
  chg.className = "price-chg " + (up ? "up" : "down");
  chg.title = coverage ? "Change hidden: the number of products behind this price changed by more than 10% in this window" : "";
  if (coverage) chg.className = "price-chg";
  chg.innerHTML = coverage ? "—" : (up
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17 13.5 8.5 8.5 13.5 2 7"/><path d="M16 17h6v-6"/></svg>')
    + `${up ? "+" : ""}${change.toFixed(3)} (${up ? "+" : ""}${changePct.toFixed(2)}%)`;
  $("hTf").textContent = ref ? `vs baseline · index ${P(last)} · ${TF_LABEL[state.tf]}` : TF_LABEL[state.tf];

  $("menuHead").textContent = `Switch instrument · ${Object.keys(LIVE.series).length} of ${LIVE_COUNT} live`;
  $("menuList").innerHTML = GROUPS.map(g => `
    <li class="grp">
      <div class="grp-head"><span>${esc(g.name)}</span><a href="https://earth.ownx.co/" target="_blank" rel="noopener">view all →</a></div>
      <ul>${g.items.map(m => {
        const act = m.key === key, r = isRef(m);
        const val = r
          ? `<span class="m-price ${m.delta > 0 ? "up" : m.delta < 0 ? "down" : "flat"}">${fmtDelta(m.delta)}</span>`
          : `<span class="m-price">${fmtPrice(m.price)}</span>`;
        return `<li><a href="#${m.key}" data-key="${m.key}" role="option" class="${act ? "active" : ""}" aria-selected="${act}">
          <span class="sym">${m.tag}</span>
          <span class="m-mid"><span class="m-name">${esc(m.name)}</span><span class="m-asset">${esc(m.sub)}</span></span>
          ${val}
          ${act ? '<svg class="m-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' : '<span class="m-check"></span>'}
        </a></li>`; }).join("")}</ul>
    </li>`).join("");

  const cells = [];
  if (ctx.capacity) cells.push(["Total Capacity", ctx.capacity]);
  if (ctx.energyTWh) cells.push(["Energy / yr", `${ctx.energyTWh} TWh`]);
  if (ctx.datacenters) cells.push(["Datacenters", ctx.datacenters.toLocaleString()]);
  if (ctx.physicalServers) cells.push(["Physical Servers", ctx.physicalServers.toLocaleString()]);
  if (ctx.virtualUnits) cells.push(["Virtual Pool", ctx.virtualUnits]);
  if (!ctx.capacity) { cells.push(["Category", it.group]); cells.push(["Unit", it.sub]); }
  if (ref) cells.push(["Vs Baseline", fmtDelta(it.delta)]);
  cells.push([ref ? "Index Range" : "24h Range", `${P(low)} – ${P(high)}`]);
  $("strip").innerHTML = cells.map(([l, v]) => `<div class="stat"><div class="l">${l}</div><div class="v">${esc(v)}</div></div>`).join("");

  $("tfBar").innerHTML = Object.keys(TF_POINTS).map(t => `<button type="button" data-tf="${t}" aria-pressed="${t === state.tf}">${t}</button>`).join("");
  const accentBg = up ? "rgba(61,255,160,0.10)" : "rgba(255,107,138,0.12)";
  $("ohlc").innerHTML = `
    <span><span class="k">Open</span> <span class="mono">${P(first)}</span></span>
    <span><span class="k">High</span> <span class="mono hi">${P(high)}</span></span>
    <span><span class="k">Low</span> <span class="mono lo">${P(low)}</span></span>
    <span><span class="k">Last</span> <span class="mono">${P(last)}</span></span>
    <span class="delta" style="background:${accentBg}"><span>Δ</span> <span class="mono ${coverage ? "" : up ? "hi" : "lo"}">${coverage ? "—" : (up ? "+" : "") + changePct.toFixed(2) + "%"}</span></span>`;
  $("desc").textContent = meta.description;
  renderFoot();

  state.fmt = P;
  drawChart({ first, high, low, up });
  $("tableSec").hidden = ref;
  $("refNote").hidden = !ref;
  if (!ref) renderTable();
}

const chartGeom = { pts: [] };
function drawChart({ first, high, low, up }) {
  const svg = $("chart"), wrap = $("chartWrap");
  const W = Math.max(320, wrap.clientWidth), H = Math.max(200, wrap.clientHeight);
  const m = { top: 10, right: 56, bottom: 30, left: 8 };
  const iw = W - m.left - m.right, ih = H - m.top - m.bottom;
  const s = state.series, tf = state.tf;
  const t0 = s[0].t, t1 = s[s.length - 1].t;
  const accent = up ? "#34D399" : "#FB7185";
  const x = (t) => m.left + ((t - t0) / (t1 - t0)) * iw;
  const y = (p) => m.top + (1 - (p - low) / ((high - low) || 1)) * ih;

  const P = s.map(d => [x(d.t), y(d.price)]);
  chartGeom.pts = P; chartGeom.m = m; chartGeom.W = W; chartGeom.H = H;
  const n = P.length, dx = [], dy = [], sl = [], mt = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) { dx[i] = P[i+1][0]-P[i][0]; dy[i] = P[i+1][1]-P[i][1]; sl[i] = dx[i] ? dy[i]/dx[i] : 0; }
  mt[0] = sl[0]; mt[n-1] = sl[n-2];
  for (let i = 1; i < n - 1; i++) mt[i] = (sl[i-1]*sl[i] <= 0) ? 0 : (sl[i-1]+sl[i])/2;
  for (let i = 0; i < n - 1; i++) {
    if (sl[i] === 0) { mt[i] = 0; mt[i+1] = 0; continue; }
    const a = mt[i]/sl[i], b = mt[i+1]/sl[i], h = Math.hypot(a, b);
    if (h > 3) { const t = 3/h; mt[i] = t*a*sl[i]; mt[i+1] = t*b*sl[i]; }
  }
  let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i];
    d += ` C${(P[i][0]+h/3).toFixed(1)},${(P[i][1]+mt[i]*h/3).toFixed(1)} ${(P[i+1][0]-h/3).toFixed(1)},${(P[i+1][1]-mt[i+1]*h/3).toFixed(1)} ${P[i+1][0].toFixed(1)},${P[i+1][1].toFixed(1)}`;
  }
  const area = d + ` L${P[n-1][0].toFixed(1)},${(m.top+ih).toFixed(1)} L${P[0][0].toFixed(1)},${(m.top+ih).toFixed(1)} Z`;

  const yT = [0, .25, .5, .75, 1].map(f => low + (high - low) * f);
  const grid = yT.map(v => `<line x1="${m.left}" x2="${m.left+iw}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="rgba(255,255,255,.07)" stroke-dasharray="2 5"/>`).join("");
  const yLabels = yT.map(v => `<text x="${m.left+iw+8}" y="${(y(v)+3.5).toFixed(1)}">${(state.fmt||fmtPrice)(v)}</text>`).join("");
  const xTicks = []; let lastX = -Infinity;
  const step = Math.max(1, Math.ceil(n / Math.floor(iw / 60)));
  for (let i = 0; i < n; i += step) { const px = P[i][0]; if (px - lastX >= 60) { xTicks.push([px, s[i].t]); lastX = px; } }
  const xLabels = xTicks.map(([px, t]) => `<text x="${px.toFixed(1)}" y="${H - 8}" text-anchor="middle">${LIVE.series[state.key] ? fmtDay(t).replace(/, \d{4}$/, "") : fmtTime(t, tf)}</text>`).join("");

  const yo = y(first).toFixed(1);
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.innerHTML = `
    <defs>
      <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
        ${up ? '<stop offset="0%" stop-color="#34D399"/><stop offset="50%" stop-color="#22D3EE"/><stop offset="100%" stop-color="#8B5CF6"/>'
             : '<stop offset="0%" stop-color="#FB7185"/><stop offset="50%" stop-color="#F472B6"/><stop offset="100%" stop-color="#8B5CF6"/>'}
      </linearGradient>
      <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${up ? "#22D3EE" : "#F472B6"}" stop-opacity=".22"/><stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"/>
      </linearGradient>
      <filter id="glow" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    ${grid}
    <line x1="${m.left}" x2="${m.left+iw}" y1="${m.top+ih}" y2="${m.top+ih}" stroke="rgba(255,255,255,.15)"/>
    ${yLabels}${xLabels}
    <path d="${area}" fill="url(#fill)"/>
    <path d="${d}" fill="none" stroke="url(#line)" stroke-width="2.2" stroke-linejoin="round" filter="url(#glow)" opacity=".5"/>
    <path d="${d}" fill="none" stroke="url(#line)" stroke-width="2" stroke-linejoin="round"/>
    <line x1="${m.left}" x2="${m.left+iw}" y1="${yo}" y2="${yo}" stroke="rgba(255,255,255,.28)" stroke-dasharray="4 4"/>
    <text class="ref-label" x="${m.left+iw-6}" y="${(+yo+12).toFixed(1)}" text-anchor="end">Open ${(state.fmt||fmtPrice)(first)}</text>
    <g id="hover" style="display:none">
      <line id="hvLine" y1="${m.top}" y2="${m.top+ih}" stroke="rgba(255,255,255,.35)" stroke-dasharray="3 3"/>
      <circle id="hvDot" r="4.5" fill="${accent}" stroke="#000" stroke-width="2"/>
    </g>`;
}

(function () {
  const wrap = $("chartWrap"), tip = $("tip");
  function move(clientX) {
    const P = chartGeom.pts; if (!P.length) return;
    const r = wrap.getBoundingClientRect();
    const px = (clientX - r.left) * (chartGeom.W / r.width);
    let lo = 0, hi = P.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; (P[mid][0] < px) ? lo = mid : hi = mid; }
    const i = (px - P[lo][0] < P[hi][0] - px) ? lo : hi;
    const d = state.series[i], [cx, cy] = P[i];
    const g = $("hover"); g.style.display = "";
    $("hvLine").setAttribute("x1", cx); $("hvLine").setAttribute("x2", cx);
    $("hvDot").setAttribute("cx", cx); $("hvDot").setAttribute("cy", cy);
    tip.hidden = false;
    tip.innerHTML = `<div class="t">${LIVE.series[state.key] ? fmtDay(d.t) : new Date(d.t).toLocaleString()}</div><div class="p"><span class="mono">${(state.fmt||fmtPrice)(d.price)}</span> <span style="color:#6B6B72">${INSTRUMENTS[state.key].tag}</span></div>`;
    const sx = cx * (r.width / chartGeom.W), sy = cy * (r.height / chartGeom.H);
    const tw = tip.offsetWidth;
    let left = sx; if (left - tw/2 < 4) left = tw/2 + 4; if (left + tw/2 > r.width - 4) left = r.width - tw/2 - 4;
    tip.style.left = left + "px";
    tip.style.top = Math.max(4, sy - tip.offsetHeight - 14) + "px";
  }
  function leave() { tip.hidden = true; const g = $("hover"); if (g) g.style.display = "none"; }
  wrap.addEventListener("mousemove", e => move(e.clientX));
  wrap.addEventListener("mouseleave", leave);
  wrap.addEventListener("touchstart", e => move(e.touches[0].clientX), { passive: true });
  wrap.addEventListener("touchmove", e => move(e.touches[0].clientX), { passive: true });
  wrap.addEventListener("touchend", leave);
})();

const COLS = [
  { k: "sku", label: "SKU" }, { k: "operator", label: "Operator" }, { k: "region", label: "Region" }, { k: "dc", label: "DC" },
  { k: "capacity", label: "Capacity", r: true }, { k: "sla", label: "SLA" }, { k: "price", label: "Price", r: true }, { k: "change", label: "24h", r: true },
];
function renderTable() {
  const { sortKey, sortDir } = state;
  $("invTitle").textContent = `Available inventory · ${state.offerings.length} SKUs`;
  $("sortName").textContent = sortKey; $("sortDirTxt").textContent = sortDir === "asc" ? "↑" : "↓";
  $("thRow").innerHTML = COLS.map(c => `<th data-k="${c.k}" class="${c.r ? "r" : ""}" ${sortKey === c.k ? `aria-sort="${sortDir}ending"` : ""}>${c.label}<span class="arr">${sortKey === c.k ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span></th>`).join("");
  const rows = [...state.offerings].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    const cmp = (typeof av === "number" && typeof bv === "number") ? av - bv : String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });
  $("tbody").innerHTML = rows.map(r => {
    const u = r.change >= 0;
    return `<tr>
      <td class="sku">${r.sku}</td><td>${esc(r.operator)}</td><td class="reg">${esc(r.region)}</td><td class="dc">${r.dc}</td>
      <td class="r cap">${r.capacity.toLocaleString()}</td><td class="reg">${r.sla}</td>
      <td class="r pr">${fmtPrice(r.price)}</td>
      <td class="r chg ${u ? "up" : "down"}">${u ? "▲" : "▼"} ${u ? "+" : ""}${r.change.toFixed(2)}%</td></tr>`;
  }).join("");
}

$("pickerBtn").addEventListener("click", () => {
  const open = $("menu").hidden; $("menu").hidden = !open; $("pickerBtn").setAttribute("aria-expanded", String(open));
  if (open && window.innerWidth < 640) $("menu").style.top = (document.querySelector("header").getBoundingClientRect().bottom + 6) + "px";
});
document.addEventListener("mousedown", e => { if (!$("picker").contains(e.target)) closeMenu(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
function closeMenu() { $("menu").hidden = true; $("pickerBtn").setAttribute("aria-expanded", "false"); }
$("menuList").addEventListener("click", e => {
  const a = e.target.closest("a[data-key]"); if (!a) return;
  e.preventDefault(); closeMenu();
  if (a.dataset.key !== state.key) { state.key = a.dataset.key; history.replaceState(null, "", "#" + state.key); renderAll(); }
});
$("tfBar").addEventListener("click", e => {
  const b = e.target.closest("button[data-tf]"); if (!b || b.dataset.tf === state.tf) return;
  state.tf = b.dataset.tf; renderAll();
});
$("thRow").addEventListener("click", e => {
  const th = e.target.closest("th[data-k]"); if (!th) return;
  const k = th.dataset.k;
  if (k === state.sortKey) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
  else { state.sortKey = k; state.sortDir = (k === "price" || k === "capacity" || k === "change") ? "desc" : "asc"; }
  renderTable();
});
window.addEventListener("hashchange", () => { const k = keyFromHash(); if (k !== state.key) { state.key = k; renderAll(); } });
let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { const s = state.series; if (!s.length) return;
  const first = s[0].price, last = s[s.length-1].price; drawChart({ first, high: Math.max(...s.map(p=>p.price)), low: Math.min(...s.map(p=>p.price)), up: last >= first }); }, 80); });

state.key = keyFromHash();
$("footDate").textContent = new Date().toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
renderAll();

const getJSON = (url) => fetch(url, { headers: { Accept: "application/json" } })
  .then(r => r.ok ? r.json() : Promise.reject(new Error(url + " " + r.status)));

getJSON("/api/v1/health")
  .then(h => {
    const d = Date.parse(h.latest_capture + "T00:00:00Z");
    if (isNaN(d)) throw new Error("health: bad latest_capture " + h.latest_capture);
    LIVE.capture = d; LIVE.stale = !!h.stale; LIVE.health = "ok";
  })
  .catch(err => { console.warn("health check failed", err); LIVE.health = "failed"; })
  .then(renderFoot);

Promise.all(Object.entries(API_METRIC).map(([key, metric]) =>
  getJSON("/api/v1/instruments/" + metric)
    .then(d => {
      const pts = (d.series || [])
        .map(p => ({ t: Date.parse((p.date || p.month) + "T00:00:00Z"), price: +p.usd, vol: p.observations || 0 }))
        .filter(p => !isNaN(p.t) && isFinite(p.price) && p.price > 0 && p.vol >= MIN_OBS)
        .sort((a, b) => a.t - b.t);
      if (pts.length < 2) throw new Error(metric + ": unusable series");
      const cur = LIVE.series[key];
      if (cur && cur[cur.length - 1].t > pts[pts.length - 1].t) return;
      setLive(key, pts);
    })
    .catch(err => console.warn("api series unavailable, keeping snapshot", key, err))
)).then(renderAll);
