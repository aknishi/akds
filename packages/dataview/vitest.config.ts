import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'istanbul',
      reportsDirectory: './coverage',
      reporter: ['text'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.types.ts',
        'src/**/*.d.ts',
        'src/**/*.stories.tsx',
        'src/index.ts',
        'src/**/index.ts',
        'src/test/**',
        'src/__tests__/**',
        'src/demo/**',
      ],
      thresholds: {
        perFile: true,
        // There is no src/components/ folder here, so reactkit's per-file
        // threshold applies to every source file instead.
        'src/**': { statements: 80 },
      },
    },
  },
});
