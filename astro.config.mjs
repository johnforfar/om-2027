import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  compressHTML: false,
  server: { host: '0.0.0.0', port: 3000 },
  env: {
    schema: {
      EC_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
