import { describe, expect, it } from 'vitest';
import { contactNav, footerNav, isCurrentPath, primaryNav } from '@/data/navigation';
import { services } from '@/data/services';
import { routeExists } from './helpers';

const allLinks = [...primaryNav, contactNav, ...footerNav.corporate.links, ...footerNav.work.links];

describe('navigation destinations', () => {
  it.each(allLinks.map((l) => [l.label, l.href]))('%s → %s is an existing route', (_, href) => {
    expect(routeExists(href)).toBe(true);
  });

  it('uses trailing-slash internal paths only (matches trailingSlash: "always")', () => {
    for (const { href } of allLinks) {
      const path = href.split('#')[0] ?? href;
      expect(path).toMatch(/^\/([a-z0-9-]+\/)*$/);
    }
  });

  it('service anchors in the footer point at real service ids', () => {
    const ids = new Set(services.map((s) => s.id));
    for (const { href } of footerNav.work.links) {
      const hash = href.split('#')[1];
      if (hash) expect(ids.has(hash as (typeof services)[number]['id'])).toBe(true);
    }
  });

  it('every main route is reachable from the site chrome on every page (no orphan pages)', () => {
    // Header and footer are on every page; a route may live in either.
    const chromeHrefs = new Set<string>(
      [...primaryNav, contactNav, ...footerNav.corporate.links, ...footerNav.work.links].map(
        (l) => l.href,
      ),
    );
    for (const route of [
      '/',
      '/hakkimizda/',
      '/projeler/',
      '/hizmetler/',
      '/faaliyetlerimiz/',
      '/iletisim/',
    ]) {
      expect(chromeHrefs.has(route), route).toBe(true);
    }
  });

  it('keeps the primary destinations in the header and Activities in the footer', () => {
    const headerHrefs = [...primaryNav, contactNav].map((l) => l.href);
    for (const route of ['/', '/hakkimizda/', '/projeler/', '/hizmetler/', '/iletisim/']) {
      expect(headerHrefs).toContain(route);
    }
    expect(footerNav.corporate.links.map((l) => l.href)).toContain('/faaliyetlerimiz/');
  });
});

describe('isCurrentPath', () => {
  it('matches the homepage only exactly', () => {
    expect(isCurrentPath('/', '/')).toBe(true);
    expect(isCurrentPath('/', '/projeler/')).toBe(false);
  });

  it('marks a section as current on its child pages', () => {
    expect(isCurrentPath('/projeler/', '/projeler/')).toBe(true);
    expect(isCurrentPath('/projeler/', '/projeler/proje-01/')).toBe(true);
    expect(isCurrentPath('/hizmetler/', '/projeler/')).toBe(false);
  });

  it('ignores hash fragments', () => {
    expect(isCurrentPath('/hizmetler/#emlak', '/hizmetler/')).toBe(true);
  });
});
