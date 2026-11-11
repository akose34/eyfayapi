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
  // Activities retired (owner decision C2, 2026-11-11): straight to About, no double hop.
  { from: '/faaliyet.html', to: '/hakkimizda/' },
] as const satisfies readonly LegacyRedirect[];

/**
 * Retired routes of the redesign. Each is generated as a static redirect document
 * (noindex, canonical to the target, instant meta refresh) — the only redirect
 * GitHub Pages can serve — and is excluded from the sitemap (astro.config.ts).
 */
export const retiredRoutes = [
  { from: '/faaliyetlerimiz/', to: '/hakkimizda/' },
  { from: '/faaliyetler/', to: '/hakkimizda/' },
] as const satisfies readonly LegacyRedirect[];
