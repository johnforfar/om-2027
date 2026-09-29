import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  compressHTML: false,
  server: { host: '0.0.0.0', port: 3000 },
});
