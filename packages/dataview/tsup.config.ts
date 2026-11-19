import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/headless/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: true,
  external: ['react', 'react-dom'],
  injectStyle: true,
});
