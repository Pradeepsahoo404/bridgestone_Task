import { defineConfig, devices } from'@playwright/test';

export default defineConfig({
  testDir:'./tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL:'http://localhost:3000',
    trace:'on-first-retry',
  },
  projects: [
    {
      name:'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command:'npm run dev:backend',
      url:'http://localhost:5000/api/health',
      reuseExistingServer: true,
      cwd:'../',
    },
    {
      command:'npm run dev:frontend',
      url:'http://localhost:3000',
      reuseExistingServer: true,
      cwd:'../',
    },
  ],
});
