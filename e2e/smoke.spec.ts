/**
 * Route, navigation, project and contact smoke tests (Stage 7).
 * Runs on desktop (1280×800) and mobile (Pixel 7) Chromium.
 */
import { expect, pageRoutes, projectRoutes, scrollThrough, test } from './fixtures';
import { contact } from '../src/data/company';

test.describe('every public route', () => {
  for (const route of pageRoutes) {
    test(`${route} renders cleanly`, async ({ page, guard }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/Eyfa Yapı/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'tr');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('main#main')).toBeVisible();
      await scrollThrough(page);
      // Every image that started loading finished without error.
      const broken = await page.$$eval('img', (imgs) =>
        imgs
          .filter((i) => i.complete && i.currentSrc && i.naturalWidth === 0)
          .map((i) => i.currentSrc),
      );
      expect(broken).toEqual([]);
      expect(guard.external, 'no third-party requests on load').toEqual([]);
      expect(await guard.cspViolations(), 'no CSP violations').toEqual([]);
      expect(guard.consoleErrors).toEqual([]);
    });
  }
});

test('skip link is the first focus stop and moves focus to main', async ({ page, guard }) => {
  await page.goto('/hizmetler/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'İçeriğe geç' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  expect(await guard.cspViolations()).toEqual([]);
});

test.describe('desktop header', () => {
  test.skip(({ isMobile }) => isMobile, 'desktop only');

  test('primary navigation reaches every section and marks the current page', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Ana menü' });
    for (const [name, path] of [
      ['Hakkımızda', '/hakkimizda/'],
      ['Projeler', '/projeler/'],
      ['Hizmetler', '/hizmetler/'],
      ['Faaliyetler', '/faaliyetlerimiz/'],
      ['Ana Sayfa', '/'],
    ] as const) {
      await nav.getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(path);
      await expect(nav.getByRole('link', { name, exact: true })).toHaveAttribute(
        'aria-current',
        'page',
      );
    }
    // Contact is the header's call-to-action button.
    await page.getByRole('banner').getByRole('link', { name: 'İletişim' }).click();
    await expect(page).toHaveURL('/iletisim/');
  });
});

test.describe('mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile only');

  test('opens as a modal dialog, closes with Escape and restores focus', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menüyü aç' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    const menu = page.locator('dialog#mobile-menu');
    await expect(menu).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    // Contact shortcuts inside the menu use the verified data.
    await expect(menu.locator(`a[href="${contact.mobile.href}"]`)).toHaveCount(1);
    await expect(menu.locator(`a[href="${contact.whatsapp.href}"]`)).toHaveCount(1);
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('menu links navigate and close the menu', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menüyü aç' }).click();
    await page
      .locator('dialog#mobile-menu')
      .getByRole('link', { name: /Projeler/ })
      .click();
    await expect(page).toHaveURL('/projeler/');
    await expect(page.locator('dialog#mobile-menu')).toBeHidden();
  });
});

test.describe('projects', () => {
  test('index lists every published project and opens a detail page', async ({ page }) => {
    await page.goto('/projeler/');
    for (const route of projectRoutes) {
      await expect(page.locator(`main a[href="${route}"]`).first()).toBeAttached();
    }
    await expect(page.locator('main a[href="/projeler/proje-08/"]')).toHaveCount(0);
    await page.locator('main a[href="/projeler/proje-06/"]').first().click();
    await expect(page).toHaveURL('/projeler/proje-06/');
    await expect(page.locator('h1')).toHaveText('Proje 06');
  });

  test('withheld project 08 redirects to the portfolio', async ({ page }) => {
    await page.goto('/projeler/proje-08/');
    await expect(page).toHaveURL('/projeler/');
  });

  test('project enquiry uses the public label only', async ({ page }) => {
    await page.goto('/projeler/proje-06/');
    const enquiry = page.getByRole('link', { name: /Bu proje hakkında sorun/ });
    const href = await enquiry.getAttribute('href');
    const url = new URL(href ?? '');
    expect(url.origin + url.pathname).toBe('https://wa.me/905326868829');
    expect([...url.searchParams.keys()]).toEqual(['text']);
    expect(url.searchParams.get('text')).toBe(
      'Merhaba, web sitenizdeki Proje 06 hakkında bilgi almak istiyorum.',
    );
    await expect(enquiry).toHaveAttribute('target', '_blank');
    await expect(enquiry).toHaveAttribute('rel', /noopener/);
  });
});

test.describe('lightbox', () => {
  test('keyboard: opens, arrows move, Escape closes and restores focus', async ({
    page,
    guard,
  }) => {
    await page.goto('/projeler/proje-06/');
    const first = page.locator('a[data-lightbox]').first();
    await first.focus();
    await page.keyboard.press('Enter');
    const dialog = page.locator('dialog[data-lightbox-dialog]');
    await expect(dialog).toBeVisible();
    const status = dialog.locator('[data-lightbox-status]');
    await expect(status).toHaveText(/^Fotoğraf 1 \/ \d+$/);
    const total = Number((await status.textContent())?.split('/')[1]);
    await page.keyboard.press('ArrowRight');
    await expect(status).toHaveText(`Fotoğraf 2 / ${total}`);
    await page.keyboard.press('End');
    await expect(status).toHaveText(`Fotoğraf ${total} / ${total}`);
    await page.keyboard.press('ArrowRight');
    await expect(status).toHaveText(`Fotoğraf 1 / ${total}`);
    await page.keyboard.press('ArrowLeft');
    await expect(status).toHaveText(`Fotoğraf ${total} / ${total}`);
    const image = dialog.locator('[data-lightbox-image]');
    await expect(image).not.toHaveAttribute('alt', '');
    await expect
      .poll(() => image.evaluate((i: HTMLImageElement) => i.naturalWidth))
      .toBeGreaterThan(0);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(first).toBeFocused();
    expect(await guard.cspViolations()).toEqual([]);
  });

  test('touch: a horizontal swipe changes the image', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'touch only');
    await page.goto('/projeler/proje-06/');
    await page.locator('a[data-lightbox]').first().click();
    const dialog = page.locator('dialog[data-lightbox-dialog]');
    const status = dialog.locator('[data-lightbox-status]');
    await expect(status).toHaveText(/^Fotoğraf 1 \//);
    const stage = dialog.locator('[data-lightbox-stage]');
    const box = await stage.boundingBox();
    if (!box) throw new Error('no stage');
    const y = box.y + box.height / 2;
    const swipe = async (from: number, to: number) => {
      await stage.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: from, clientY: y });
      await stage.dispatchEvent('pointerup', { pointerType: 'touch', clientX: to, clientY: y });
    };
    await swipe(box.x + box.width * 0.8, box.x + box.width * 0.2); // swipe left → next
    await expect(status).toHaveText(/^Fotoğraf 2 \//);
    await swipe(box.x + box.width * 0.2, box.x + box.width * 0.8); // swipe right → previous
    await expect(status).toHaveText(/^Fotoğraf 1 \//);
    await swipe(box.x + 100, box.x + 120); // too short → no change
    await expect(status).toHaveText(/^Fotoğraf 1 \//);
  });
});

test.describe('contact', () => {
  test('channels link to the verified numbers and address', async ({ page }) => {
    await page.goto('/iletisim/');
    const main = page.locator('main');
    await expect(main.locator(`a[href="${contact.mobile.href}"]`).first()).toBeVisible();
    await expect(main.locator(`a[href="${contact.landline.href}"]`).first()).toBeVisible();
    await expect(main.locator(`a[href="${contact.email.enquiryHref}"]`)).toBeVisible();
    const wa = main.locator(`a[href="${contact.whatsapp.href}"]`).first();
    await expect(wa).toBeVisible();
    await expect(wa).toHaveAttribute('rel', /noopener/);
    // tel:/mailto: values are exact (no stray spaces or formatting).
    expect(contact.mobile.href).toBe('tel:+905326868829');
    expect(contact.landline.href).toBe('tel:+902164195781');
    expect(contact.email.href).toBe('mailto:info@eyfayapi.net');
    // No form on the contact page (the site has no backend to deliver it).
    await expect(page.locator('form')).toHaveCount(0);
  });

  test('map: nothing from Google before consent; iframe only after the click', async ({
    page,
    guard,
  }) => {
    await page.goto('/iletisim/');
    await scrollThrough(page);
    await expect(page.locator('iframe')).toHaveCount(0);
    expect(guard.external).toEqual([]);

    const load = page.getByRole('button', { name: 'Haritayı yükle' });
    await expect(load).toHaveAttribute('aria-describedby', 'map-consent-note');
    await load.click();
    const frame = page.locator('iframe[title*="Google Haritalar"]');
    await expect(frame).toHaveCount(1);
    await expect(frame).toBeFocused();
    await expect(page.locator('[data-map-status]')).toHaveText('Google Haritalar yüklendi.');
    await expect.poll(() => guard.external.length).toBeGreaterThan(0);
    expect(guard.external.every((u) => u.startsWith('https://www.google.com/maps/embed'))).toBe(
      true,
    );
    expect(await guard.cspViolations()).toEqual([]);
  });

  test('directions link is a plain new-tab link to Google Maps', async ({ page }) => {
    await page.goto('/iletisim/');
    const directions = page.getByRole('link', { name: /Yol tarifi al/ });
    await expect(directions).toHaveAttribute('href', contact.address.directionsHref);
    await expect(directions).toHaveAttribute('target', '_blank');
  });
});

test.describe('legacy URLs and errors', () => {
  for (const [from, to] of [
    ['/about.html', '/hakkimizda/'],
    ['/faaliyet.html', '/faaliyetlerimiz/'],
    ['/projeler.html', '/projeler/'],
    ['/anaEkran.html', '/'],
    ['/index.html', '/index.html'],
  ] as const) {
    test(`${from} → ${to}`, async ({ page }) => {
      await page.goto(`${from}?ref=x#top`);
      await expect(page).toHaveURL(new RegExp(`${to.replace(/\./g, '\\.')}(\\?ref=x)?(#top)?$`));
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }

  test('unknown URL serves the 404 page', async ({ page, guard }) => {
    const response = await page.goto('/boyle-bir-sayfa-yok/');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('Sayfa bulunamadı');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await page.getByRole('link', { name: 'Ana sayfaya dön' }).click();
    await expect(page).toHaveURL('/');
    expect(await guard.cspViolations()).toEqual([]);
  });
});

test('reduced motion: content is visible without animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projeler/');
  const hidden = await page.$$eval(
    '.reveal',
    (els) => els.filter((el) => Number(getComputedStyle(el).opacity) < 1).length,
  );
  expect(hidden).toBe(0);
});
