import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = ['./'];
const STANDARDS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const path of PAGES) {
  test(`${path} has no WCAG 2.2 AA violations`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    const results = await new AxeBuilder({ page }).withTags(STANDARDS).analyze();
    expect(results.violations).toEqual([]);
  });
}
