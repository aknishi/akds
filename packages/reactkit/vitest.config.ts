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
        'src/main.tsx',
        'src/**/index.ts',
        'src/test/**',
        'src/utils/LiveEditStory.ts',
      ],
    },
  },
});
