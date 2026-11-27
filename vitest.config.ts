/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/**/*.ts', 'scripts/**/*.ts'],
      exclude: ['src/content.config.ts', 'scripts/check-references.ts'],
      thresholds: { 100: true },
    },
  },
});
