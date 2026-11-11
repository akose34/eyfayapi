// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
  },
  // Static redirect documents in public/ must stay as-is (e.g. /projeler.html).
  publicDir: './public',
  integrations: [
    sitemap({
      // Placeholder project detail pages are excluded until names are confirmed.
      filter: (page) => !page.includes('/projeler/proje-'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
