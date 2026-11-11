#!/usr/bin/env node
/**
 * Post-build verification of the static output in dist/.
 * Run after `npm run build`:  npm run verify:dist
 *
 * Checks (no browser required):
 *  - every essential route and legacy redirect document was generated
 *  - each HTML page has lang="tr", a <title>, a meta description and one <h1>
 *  - every internal href/src in generated pages resolves to a file in dist/
 *  - asset size budgets (single file and total)
 *  - shared chrome on every page: skip link → #main, site header, primary nav,
 *    mobile-menu trigger whose aria-controls points at an existing <dialog>,
 *    footer; unique ids; alt on every <img>; rel="noopener" on target=_blank
 *  - the development-only design showcase is NOT in the production output
 *  - (S3) heading levels never skip (h1→h3); every <img> has width/height
 *    (no layout shift); no external <script src> and ≤ 2 KB of inline JS;
 *    homepage: exactly one eager, high-priority hero image, all others lazy
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const MAX_FILE_BYTES = 1024 * 1024; // 1 MB per file
const MAX_TOTAL_BYTES = 40 * 1024 * 1024; // 40 MB total

const REQUIRED = [
  'index.html',
  '404.html',
  'hakkimizda/index.html',
  'hizmetler/index.html',
  'projeler/index.html',
  'projeler/proje-01/index.html',
  'faaliyetlerimiz/index.html',
  'iletisim/index.html',
  // legacy URL redirect documents
  'about.html',
  'anaEkran.html',
  'faaliyet.html',
  'projeler.html',
  'robots.txt',
  'sitemap-index.xml',
];

const errors = [];
const fail = (msg) => errors.push(msg);

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const files = walk(DIST);
const rel = (f) => relative(DIST, f).split('\\').join('/');

for (const r of REQUIRED) if (!existsSync(join(DIST, r))) fail(`missing required output: ${r}`);

let total = 0;
for (const f of files) {
  const size = statSync(f).size;
  total += size;
  if (size > MAX_FILE_BYTES) fail(`file over ${MAX_FILE_BYTES} bytes: ${rel(f)} (${size})`);
}
if (total > MAX_TOTAL_BYTES) fail(`dist/ total ${total} bytes exceeds budget ${MAX_TOTAL_BYTES}`);

const resolveInternal = (url, fromFile) => {
  const clean = decodeURI(url.split(/[?#]/)[0]);
  if (!clean) return true;
  const base = clean.startsWith('/') ? DIST : join(DIST, rel(fromFile), '..');
  const target = join(base, clean);
  return existsSync(target) && statSync(target).isFile()
    ? true
    : existsSync(join(target, 'index.html'));
};

// The design showcase is injected only for `astro dev` (astro.config.ts).
for (const f of files) {
  if (rel(f).startsWith('dev/') || /tasarim-sistemi/.test(rel(f))) {
    fail(`development-only showcase leaked into production output: ${rel(f)}`);
  }
}
if (existsSync(join(DIST, 'sitemap-0.xml'))) {
  const sitemap = readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8');
  if (/tasarim-sistemi|\/dev\//.test(sitemap)) fail('sitemap lists the development showcase');
}

const redirectStubs = new Set(['about.html', 'anaEkran.html', 'faaliyet.html', 'projeler.html']);

for (const f of files.filter((x) => x.endsWith('.html'))) {
  const name = rel(f);
  const html = readFileSync(f, 'utf8');
  if (!/<html lang="tr"/.test(html)) fail(`${name}: missing <html lang="tr">`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${name}: missing <title>`);
  if (!redirectStubs.has(name)) {
    if (!/<meta name="description" content="[^"]+"/.test(html))
      fail(`${name}: missing meta description`);
    const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
    if (h1 !== 1) fail(`${name}: expected exactly one <h1>, found ${h1}`);
    if (!/<main id="main"/.test(html)) fail(`${name}: missing <main id="main">`);

    // Shared chrome
    if (!/<a href="#main"[^>]*>\s*İçeriğe geç/.test(html))
      fail(`${name}: missing skip link to #main`);
    if (!/<header[^>]+data-site-header/.test(html)) fail(`${name}: missing site header`);
    if (!/<nav aria-label="Ana menü"/.test(html)) fail(`${name}: missing primary navigation`);
    if (!/<footer[^>]*>/.test(html) || !/id="footer-nav"/.test(html))
      fail(`${name}: missing footer navigation`);
    const trigger = html.match(/<button[^>]*data-menu-open[^>]*>/)?.[0] ?? '';
    const controls = trigger.match(/aria-controls="([^"]+)"/)?.[1];
    if (
      !controls ||
      !/aria-expanded="false"/.test(trigger) ||
      !/aria-label="[^"]+"/.test(trigger)
    ) {
      fail(`${name}: mobile menu trigger lacks aria-controls / aria-expanded / aria-label`);
    } else if (!new RegExp(`<dialog[^>]+id="${controls}"`).test(html)) {
      fail(`${name}: aria-controls="${controls}" does not reference a <dialog>`);
    }

    // Unique ids
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length) fail(`${name}: duplicate id(s): ${[...new Set(dupes)].join(', ')}`);

    // Images need alt; new-tab links need rel=noopener
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
      // `alt` may be serialised bare (= alt="", decorative) — both are valid.
      if (!/\salt(=|[\s/>])/.test(tag)) fail(`${name}: <img> without alt → ${tag.slice(0, 80)}`);
    }
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
      if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) {
        fail(`${name}: <img> without width/height (layout shift risk) → ${tag.slice(0, 80)}`);
      }
    }

    // Heading outline: levels may go up by at most one at a time.
    const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    levels.forEach((level, i) => {
      const prev = levels[i - 1] ?? 0;
      if (level > prev + 1) fail(`${name}: heading level skips from h${prev} to h${level}`);
    });

    // Client JavaScript budget: no external scripts, tiny inline modules only.
    if (/<script\b[^>]*\ssrc=/.test(html)) fail(`${name}: external <script src> found`);
    const inlineJs = [
      ...html.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g),
    ]
      .map((m) => m[1].length)
      .reduce((a, b) => a + b, 0);
    if (inlineJs > 2048) fail(`${name}: ${inlineJs} bytes of inline JS exceeds the 2 KB budget`);

    for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
      if (!/rel="[^"]*noopener/.test(tag)) fail(`${name}: target=_blank without rel=noopener`);
    }
  }
  for (const [, attr, url] of html.matchAll(/\s(href|src|srcset)="([^"]+)"/g)) {
    const urls = attr === 'srcset' ? url.split(',').map((s) => s.trim().split(/\s+/)[0]) : [url];
    for (const u of urls) {
      if (!u || /^(https?:|mailto:|tel:|data:|#|\/\/)/.test(u)) continue;
      if (!resolveInternal(u, f)) fail(`${name}: broken internal ${attr} → ${u}`);
    }
  }
}

// Homepage image loading strategy (Stage 3).
{
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  const imgs = [...home.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const hero = imgs.filter((t) => /fetchpriority="high"/.test(t));
  if (hero.length !== 1)
    fail(`index.html: expected exactly 1 high-priority hero image, found ${hero.length}`);
  if (hero[0] && /loading="lazy"/.test(hero[0])) fail('index.html: hero image must not be lazy');
  const eager = imgs.filter((t) => !/loading="lazy"/.test(t));
  // hero + header logo are the only above-the-fold images
  if (eager.length > 2)
    fail(`index.html: ${eager.length} eager images (expected hero + header logo)`);
}

const pages = files.filter((x) => x.endsWith('.html')).length;
console.log(
  `verify-dist: ${pages} HTML files, ${files.length} files, ${(total / 1048576).toFixed(1)} MB`,
);
if (errors.length) {
  console.error(`verify-dist: ${errors.length} problem(s):\n - ${errors.join('\n - ')}`);
  process.exit(1);
}
console.log('verify-dist: all checks passed');
