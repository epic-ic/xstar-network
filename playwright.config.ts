import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const BASE_PATH = '/xstar-network/';

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  use: {
    baseURL: `http://localhost:${PORT}${BASE_PATH}`,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run preview -- --port ${PORT}`,
    url: `http://localhost:${PORT}${BASE_PATH}`,
    reuseExistingServer: !process.env.CI,
  },
});
