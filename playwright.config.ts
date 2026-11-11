import { defineConfig, devices } from '@playwright/test';

/**
 * Browser smoke tests (Stage 7) against the LOCAL production build.
 *
 *   npm run test:e2e          # builds, then serves dist/ via `astro preview`
 *
 * Every request that does not go to the local preview is intercepted in
 * e2e/fixtures.ts: nothing reaches Google, WhatsApp or any other service, and
 * no message is ever sent.
 */
const PORT = 4324;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // --ignore-lock: runs alongside a developer's own preview server.
    command: `npx astro preview --port ${PORT} --host 127.0.0.1 --ignore-lock`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env['CI'],
    timeout: 60_000,
  },
});
