import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { legacyRedirects } from '@/data/legacy-redirects';
import { ROOT, readRoot, routeExists } from './helpers';

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
