import { defineConfig } from 'vite';

export default defineConfig({
  base: '/TsParticle-demo/',
  server: { port: 5173, open: true },
  build: { target: 'es2020' },
});
