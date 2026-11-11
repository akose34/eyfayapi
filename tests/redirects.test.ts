import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { legacyRedirects } from '@/data/legacy-redirects';
import { ROOT, readRoot } from './helpers';

/** Map a route ("/projeler/") to the Astro page file that generates it. */
const pageFileFor = (route: string): string =>
  route === '/' ? 'src/pages/index.astro' : `src/pages${route.replace(/\/$/, '')}.astro`;

const routeExists = (route: string): boolean =>
  existsSync(join(ROOT, pageFileFor(route))) ||
  existsSync(join(ROOT, `src/pages${route}index.astro`));

describe('legacy URL compatibility', () => {
  it('covers every legacy HTML page of the current site', () => {
    const legacyPages = readdirSync(ROOT).filter((f) => f.endsWith('.html') && f !== 'index.html');
    expect(legacyRedirects.map((r) => r.from.slice(1)).sort()).toEqual(legacyPages.sort());
  });

  for (const { from, to } of legacyRedirects) {
    it(`${from} → ${to}`, () => {
      const stub = readRoot(`public${from}`);
      expect(stub).toContain(`<meta http-equiv="refresh" content="0; url=${to}" />`);
      expect(stub).toContain(`<link rel="canonical" href="https://eyfayapi.net${to}" />`);
      expect(stub).toContain(`location.replace('${to}'`);
      expect(stub).toContain(`<a href="${to}">`);
      expect(routeExists(to), `route ${to} must exist`).toBe(true);
    });
  }
});
