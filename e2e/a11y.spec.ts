/**
 * axe-core on every route of the production build (Stage 7), desktop and
 * mobile. Automated checks catch only part of WCAG; see
 * docs/ACCESSIBILITY_AUDIT.md for the manual checklist.
 */
import { createRequire } from 'node:module';
import type { Page } from '@playwright/test';
import { expect, pageRoutes, scrollThrough, test } from './fixtures';

const axePath = createRequire(import.meta.url).resolve('axe-core/axe.min.js');
// axe is injected as an inline script; the site's CSP (correctly) blocks that, so
// this file bypasses CSP. CSP itself is asserted in smoke.spec.ts.
test.use({ bypassCSP: true });

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

interface AxeResult {
  violations: { id: string; nodes: { target: string[] }[] }[];
  incomplete: { id: string; nodes: { target: string[] }[] }[];
}

async function axe(page: Page): Promise<AxeResult> {
  await page.addScriptTag({ path: axePath });
  return page.evaluate(
    (tags) =>
      (
        window as unknown as {
          axe: { run: (ctx: Document, opts: object) => Promise<AxeResult> };
        }
      ).axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] }),
    TAGS,
  );
}

const summary = (r: AxeResult['violations']) =>
  r.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);

for (const route of [...pageRoutes, '/boyle-bir-sayfa-yok/']) {
  test(`axe: ${route}`, async ({ page }) => {
    await page.goto(route);
    await scrollThrough(page);
    const result = await axe(page);
    expect(summary(result.violations)).toEqual([]);
  });
}

test('axe: open mobile menu / lightbox / loaded map', async ({ page, isMobile }) => {
  if (isMobile) {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menüyü aç' }).click();
    expect(summary((await axe(page)).violations)).toEqual([]);
  }
  await page.goto('/projeler/proje-06/');
  await page.locator('a[data-lightbox]').first().click();
  await expect(page.locator('dialog[data-lightbox-dialog]')).toBeVisible();
  expect(summary((await axe(page)).violations)).toEqual([]);

  await page.goto('/iletisim/');
  await page.getByRole('button', { name: 'Haritayı yükle' }).click();
  await expect(page.locator('iframe')).toHaveCount(1);
  expect(summary((await axe(page)).violations)).toEqual([]);
});

test.describe('reflow and text spacing', () => {
  test.skip(({ isMobile }) => isMobile, 'viewport is set explicitly');

  for (const route of [...pageRoutes.filter((r) => !/proje-(0[2-5]|0[7-9]|1\d)/.test(r))]) {
    test(`320 px reflow without horizontal scrolling: ${route}`, async ({ page }) => {
      // WCAG 1.4.10: 1280 px at 400 % zoom ≈ a 320 CSS px viewport.
      await page.setViewportSize({ width: 320, height: 720 });
      await page.goto(route);
      await scrollThrough(page);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('WCAG 1.4.12 text spacing does not clip or overlap content', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    for (const route of ['/', '/iletisim/', '/projeler/proje-06/']) {
      await page.goto(route);
      await page.addStyleTag({
        content:
          '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }',
      });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, route).toBeLessThanOrEqual(0);
    }
  });
});
