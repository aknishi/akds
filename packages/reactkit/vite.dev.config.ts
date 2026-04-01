import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  // Serve dev/index.html as the entry point
  publicDir: false,
  build: {
    outDir: 'dev-dist',
  },
  server: {
    port: 3000,
    open: '/dev/index.html',
  },
});
