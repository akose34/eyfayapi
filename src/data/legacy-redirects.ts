import type { LegacyRedirect } from '@/types/content';

/**
 * Public URLs of the legacy site (GitHub Pages, eyfayapi.net) mapped to the new
 * routes. Each entry has a matching static redirect document in public/,
 * verified by tests/redirects.test.ts. "/" and "/index.html" need no stub
 * because the new homepage is emitted at dist/index.html.
 */
export const legacyRedirects = [
  { from: '/anaEkran.html', to: '/' },
  { from: '/about.html', to: '/hakkimizda/' },
  { from: '/projeler.html', to: '/projeler/' },
  { from: '/faaliyet.html', to: '/faaliyetlerimiz/' },
] as const satisfies readonly LegacyRedirect[];
