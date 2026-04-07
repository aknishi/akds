import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { 'akds-reactkit': 'src/index.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  injectStyle: true,
});
