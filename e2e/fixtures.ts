import { readFileSync, readdirSync } from 'node:fs';
import { test as base, expect, type Page } from '@playwright/test';

const projectDirs = readdirSync('dist/projeler', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();
const isRedirectStub = (dir: string) =>
  /<meta http-equiv="refresh"/.test(readFileSync(`dist/projeler/${dir}/index.html`, 'utf8'));

/** Every published project detail page in the build. */
export const projectRoutes = projectDirs
  .filter((d) => !isRedirectStub(d))
  .map((d) => `/projeler/${d}/`);

/** Withheld projects: redirect documents to /projeler/ (rights or editorial hold). */
export const withheldProjectRoutes = projectDirs
  .filter(isRedirectStub)
  .map((d) => `/projeler/${d}/`);

export const pageRoutes = [
  '/',
  '/hakkimizda/',
  '/hizmetler/',
  '/projeler/',
  '/iletisim/',
  ...projectRoutes,
];

export interface Guard {
  /** Requests to anything other than the local preview (all were blocked). */
  external: string[];
  cspViolations: () => Promise<string[]>;
  consoleErrors: string[];
}

/**
 * - Blocks every non-local request (recorded in `external`). The Google Maps
 *   embed is answered with a local stub so the consent flow can be exercised
 *   without contacting Google.
 * - Records CSP violations and console errors.
 */
export const test = base.extend<{ guard: Guard }>({
  guard: async ({ page }, use) => {
    const external: string[] = [];
    const consoleErrors: string[] = [];
    await page.route(/^(?!http:\/\/127\.0\.0\.1:4324\/).*/, (route) => {
      const url = route.request().url();
      external.push(url);
      if (url.startsWith('https://www.google.com/maps/embed')) {
        return route.fulfill({
          contentType: 'text/html',
          body: '<!doctype html><title>map stub</title><p>map</p>',
        });
      }
      return route.abort('blockedbyclient');
    });
    await page.addInitScript(() => {
      const w = window as unknown as { __csp: string[] };
      w.__csp = [];
      document.addEventListener('securitypolicyviolation', (e) => {
        w.__csp.push(`${e.violatedDirective} ${e.blockedURI}`);
      });
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));
    await use({
      external,
      consoleErrors,
      cspViolations: () =>
        page.evaluate(() => (window as unknown as { __csp: string[] }).__csp ?? []),
    });
  },
});

export { expect };

/** Scrolls through the page so lazy images and reveal animations run. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
}
