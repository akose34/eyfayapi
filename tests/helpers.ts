import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const readRoot = (path: string): string =>
  readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

/** Collapse whitespace / HTML entities used in the legacy markup for comparisons. */
export const normaliseText = (html: string): string =>
  html
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Map a route ("/projeler/") to the Astro page file that generates it. */
const pageFileFor = (route: string): string =>
  route === '/' ? 'src/pages/index.astro' : `src/pages${route.replace(/\/$/, '')}.astro`;

/** True when a static page file exists for the given route (hash ignored). */
export const routeExists = (href: string): boolean => {
  const route = href.split('#')[0] ?? href;
  return (
    existsSync(join(ROOT, pageFileFor(route))) ||
    existsSync(join(ROOT, `src/pages${route}index.astro`))
  );
};
