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
  }
  for (const [, attr, url] of html.matchAll(/\s(href|src|srcset)="([^"]+)"/g)) {
    const urls = attr === 'srcset' ? url.split(',').map((s) => s.trim().split(/\s+/)[0]) : [url];
    for (const u of urls) {
      if (!u || /^(https?:|mailto:|tel:|data:|#|\/\/)/.test(u)) continue;
      if (!resolveInternal(u, f)) fail(`${name}: broken internal ${attr} → ${u}`);
    }
  }
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
