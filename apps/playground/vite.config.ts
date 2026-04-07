import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@akds/reactkit': path.resolve(__dirname, '../../packages/reactkit/src/index.ts'),
    },
  },
  server: {
    port: 3000,
  },
});
