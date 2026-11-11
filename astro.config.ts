// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import type { AstroIntegration } from 'astro';

/**
 * Injects the design-system showcase ONLY for `astro dev`. Production builds
 * never contain the route (verified by scripts/verify-dist.mjs).
 */
export const DEV_SHOWCASE_ROUTE = '/dev/tasarim-sistemi';
const devShowcase = (): AstroIntegration => ({
  name: 'eyfa-dev-showcase',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command !== 'dev') return;
      injectRoute({ pattern: DEV_SHOWCASE_ROUTE, entrypoint: './src/dev/DesignSystem.astro' });
    },
  },
});

/**
 * Eyfa Yapı — static site configuration.
 *
 * - Output is fully static (no server, no adapter) so the build can be hosted
 *   on GitHub Pages or any static host. See docs/DEPLOYMENT_PLAN.md.
 * - Legacy media folders (img/, projects-img/, logos/, mini-videos/,
 *   Faaliyetler-img/) are NOT moved in Stage 1. They are imported at build time
 *   through src/lib/media.ts so Astro can optimise them; see docs/ARCHITECTURE.md.
 * - Legacy URLs such as /projeler.html are kept alive by static redirect
 *   documents in public/ (see src/data/legacy-redirects.ts and
 *   docs/ARCHITECTURE.md#legacy-url-compatibility).
 */
export default defineConfig({
  site: 'https://eyfayapi.net',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Stage 7: inline the (single, ~13 KB gzip) stylesheet. Removes the only
    // render-blocking request; measured −150…230 ms simulated mobile LCP
    // (docs/PERFORMANCE_AUDIT.md). Trade-off: not cached across pages.
    inlineStylesheets: 'always',
  },
  // Static redirect documents in public/ must stay as-is (e.g. /projeler.html).
  publicDir: './public',
  // Stock sharp pipeline + build-time letterbox crop (src/lib/image-service.ts).
  image: {
    service: { entrypoint: './src/lib/image-service.ts' },
  },
  /**
   * Stage 7 — Content Security Policy as a <meta> element (GitHub Pages cannot
   * send headers). Astro hashes every script and style it emits into
   * script-src / style-src; everything else is same-origin only, except the
   * Google Maps embed that /iletisim/ loads after an explicit click.
   * style-src-attr allows the two inline style ATTRIBUTES (image focal point,
   * logo size); attributes cannot carry script. Verified by tests/e2e (no CSP
   * violations on any route) — see docs/SEO_AUDIT.md §Security.
   */
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self'",
        "font-src 'self'",
        "connect-src 'self'",
        'frame-src https://www.google.com',
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
      // 'self' + Astro's hashes for <style> elements; 'unsafe-inline' only for
      // style ATTRIBUTES (style-src-attr).
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  // No Markdown content; disabling Shiki also removes its CSP warning.
  markdown: { syntaxHighlight: false },
  integrations: [
    devShowcase(),
    sitemap({
      // Placeholder project detail pages are excluded until names are confirmed;
      // retired routes are redirect documents (src/data/legacy-redirects.ts).
      filter: (page) =>
        !page.includes('/projeler/proje-') &&
        !page.endsWith('/faaliyetlerimiz/') &&
        !page.endsWith('/faaliyetler/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Fonts are always emitted as files: cacheable, and a future CSP can keep
      // font-src 'self' (no data: URIs). Other small assets use Vite's default.
      assetsInlineLimit: (file) => (file.endsWith('.woff2') ? false : undefined),
    },
  },
});
