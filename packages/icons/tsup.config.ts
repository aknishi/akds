import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/components/*.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react'],
  splitting: false,
  treeshake: true,
});