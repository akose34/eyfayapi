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
 *  - (S4) no withheld legacy media (src/data/withheld-media.json) in any form;
 *    every public project page exists and has exactly one image viewer;
 *    withheld project pages are redirect documents; drawings stay uncropped
 *  - (S5) no unconfirmed founder-biography details or award wording on any
 *    page; withheld activities absent; service anchors present on /hizmetler/
 *  - (S6) no live <iframe> (only inert <template>), no <form>, no third-party
 *    src/stylesheet; every tel:/mailto:/wa.me link uses the verified values
 *    from src/data/company.ts; contact page offers click-to-load map +
 *    directions link
 *  - (S3) heading levels never skip (h1→h3); every <img> has width/height
 *    (no layout shift); (S4) JS only from first-party /_astro/*.js or inline,
 *    ≤ 8 KB per page;
 *    homepage: exactly one eager, high-priority hero image, all others lazy
 *  - (pre-launch) no unsupported legacy claims, no completion/sale wording (text
 *    and alt/meta), no drawings section, drawing-only projects are redirects
 *  - (S7) SEO: indexable pages have a unique title and description, a
 *    self-referencing absolute canonical, complete og:/twitter: tags whose
 *    image exists at 1200×630; noindex pages use "noindex, follow"; the sitemap
 *    lists exactly the indexable pages; robots.txt allows crawling and names
 *    the sitemap; JSON-LD parses and carries no unverifiable properties; every
 *    full page has a CSP <meta>; public output contains only web file types
 *    (no source maps, docs, sources or dotfiles); total budget unchanged
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// `--dist <dir>` verifies another output folder (CI staging build); default dist/.
const distArg = process.argv.indexOf('--dist');
const DIST =
  distArg > -1
    ? join(process.cwd(), process.argv[distArg + 1] ?? '', '/')
    : fileURLToPath(new URL('../dist/', import.meta.url));
const MAX_FILE_BYTES = 1024 * 1024; // 1 MB per file
const MAX_TOTAL_BYTES = 40 * 1024 * 1024; // 40 MB total

const REQUIRED = [
  'index.html',
  '404.html',
  'hakkimizda/index.html',
  'hizmetler/index.html',
  'projeler/index.html',
  'projeler/proje-01/index.html',
  'faaliyetlerimiz/index.html', // retired → redirect document (owner decision C2)
  'faaliyetler/index.html', // retired short form → redirect document
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

// Redirect documents (legacy URLs, withheld projects): any page whose only job
// is an instant meta refresh. They must still be lang="tr" and point somewhere real.
const isRedirectStub = (html) => /<meta http-equiv="refresh" content="0; url=([^"]+)"/.test(html);

for (const f of files.filter((x) => x.endsWith('.html'))) {
  const name = rel(f);
  const html = readFileSync(f, 'utf8');
  if (!/<html lang="tr"/.test(html)) fail(`${name}: missing <html lang="tr">`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${name}: missing <title>`);
  const refresh = html.match(/<meta http-equiv="refresh" content="0; url=([^"]+)"/)?.[1];
  if (refresh && !resolveInternal(refresh, f))
    fail(`${name}: redirect target missing → ${refresh}`);
  if (!isRedirectStub(html)) {
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

    // Client JavaScript budget (S4): only first-party modules bundled by Astro
    // (/_astro/*.js) or inline; no third-party scripts; ≤ 8 KB total per page.
    let jsBytes = [
      ...html.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g),
    ]
      .map((m) => m[1].length)
      .reduce((a, b) => a + b, 0);
    for (const [, src] of html.matchAll(/<script\b[^>]*\ssrc="([^"]+)"/g)) {
      if (!/^\/_astro\/[^/]+\.js$/.test(src)) {
        fail(`${name}: script from outside /_astro/ → ${src}`);
      } else if (existsSync(join(DIST, src))) {
        jsBytes += statSync(join(DIST, src)).size;
      }
    }
    if (jsBytes > 8192) fail(`${name}: ${jsBytes} bytes of JavaScript exceeds the 8 KB budget`);

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

// Stage 4 — withheld media must never be published (originals or derivatives).
{
  const withheld = JSON.parse(
    readFileSync(
      fileURLToPath(new URL('../src/data/withheld-media.json', import.meta.url)),
      'utf8',
    ),
  ).files;
  // Astro names derivatives "<basename>.<hash>[_<variant>].<ext>".
  const names = files.map((f) => rel(f).split('/').pop());
  for (const path of withheld) {
    const base = path
      .split('/')
      .pop()
      .replace(/\.[a-z]+$/i, '');
    const leaked = names.filter((n) => n.startsWith(`${base}.`));
    if (leaked.length) fail(`withheld media leaked: ${path} → ${leaked.slice(0, 2).join(', ')}`);
  }
}

// Stage 4 — project pages.
for (let n = 1; n <= 11; n++) {
  const page = `projeler/proje-${String(n).padStart(2, '0')}/index.html`;
  if (!existsSync(join(DIST, page))) {
    fail(`missing project page: ${page}`);
    continue;
  }
  const html = readFileSync(join(DIST, page), 'utf8');
  if (isRedirectStub(html)) {
    if (!/url=\/projeler\/"/.test(html))
      fail(`${page}: withheld redirect must point to /projeler/`);
    if (/<img\b/.test(html)) fail(`${page}: withheld redirect must not contain images`);
    continue;
  }
  const dialogs = (html.match(/<dialog\b[^>]*data-lightbox-dialog/g) ?? []).length;
  const links = [...html.matchAll(/<a\b[^>]*data-lightbox="[^"]+"[^>]*>/g)].map((m) => m[0]);
  if (links.length && dialogs !== 1)
    fail(`${page}: expected 1 image viewer dialog, found ${dialogs}`);
  for (const link of links) {
    if (!/aria-label="[^"]+ — büyüt \(\d+\/\d+\)"/.test(link))
      fail(`${page}: viewer link without a descriptive label`);
  }
  // Drawings: every plan thumbnail is contained, never cover-cropped.
  for (const [, block] of html.matchAll(/data-lightbox-kind="plans"[^>]*>([\s\S]*?)<\/a>/g)) {
    if (!/object-contain/.test(block) || /object-cover/.test(block))
      fail(`${page}: plan thumbnail is cropped`);
  }
}

// Stage 5 — corporate content guards (built HTML, visible text only).
{
  const visible = (html) =>
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ');
  const BIOGRAPHY = /(44 yaşında|Sosyoloji|Gümüşhane|Kelkit|üç çocuk|MÜSİAD|AHİSİAD|6\. dönem)/i;
  const AWARD = /(ödül|sertifika|\bISO\b|Şentürk)/i;
  for (const f of files.filter((x) => x.endsWith('.html'))) {
    const text = visible(readFileSync(f, 'utf8'));
    const bio = text.match(BIOGRAPHY)?.[0];
    if (bio) fail(`${rel(f)}: unconfirmed founder-biography detail "${bio}"`);
    const award = text.match(AWARD)?.[0];
    if (award) fail(`${rel(f)}: unverified award/credential wording "${award}"`);
  }
  const activitiesPage = visible(readFileSync(join(DIST, 'faaliyetlerimiz/index.html'), 'utf8'));
  if (/Tiyatro/i.test(activitiesPage))
    fail('faaliyetlerimiz: withheld theatre activity is visible');
  const servicesPage = readFileSync(join(DIST, 'hizmetler/index.html'), 'utf8');
  for (const id of ['muteahhitlik', 'mimarlik', 'muhendislik', 'emlak']) {
    if (!new RegExp(`\\sid="${id}"`).test(servicesPage)) fail(`hizmetler: missing #${id} anchor`);
  }
}

// Stage 6 — contact, privacy and honesty guards.
{
  const companySrc = readFileSync(
    fileURLToPath(new URL('../src/data/company.ts', import.meta.url)),
    'utf8',
  );
  const phones = new Set([...companySrc.matchAll(/e164: '(\+\d+)'/g)].map((m) => m[1]));
  const email = companySrc.match(/email: '([^']+)'/)?.[1];
  if (phones.size < 2 || !email) fail('verify-dist: could not read verified contact data');

  for (const f of files.filter((x) => x.endsWith('.html'))) {
    const name = rel(f);
    const raw = readFileSync(f, 'utf8');
    const html = raw.replace(/<template[\s\S]*?<\/template>/g, ''); // inert content
    if (/<iframe\b/i.test(html))
      fail(`${name}: live <iframe> (third-party embeds must load on demand)`);
    if (/<form\b/i.test(raw))
      fail(`${name}: <form> found — the static site has no backend to receive it`);
    for (const [, url] of html.matchAll(
      /<(?:img|script|source|video|audio)\b[^>]*\ssrc="(https?:[^"]+)"/g,
    )) {
      fail(`${name}: third-party resource loaded on page view → ${url}`);
    }
    for (const [tag] of html.matchAll(
      /<link\b[^>]*rel="(?:stylesheet|preload|preconnect|dns-prefetch)"[^>]*>/g,
    )) {
      if (/href="https?:/.test(tag)) fail(`${name}: third-party <link> → ${tag.slice(0, 80)}`);
    }
    for (const [, num] of raw.matchAll(/href="tel:([^"]+)"/g)) {
      if (!phones.has(num)) fail(`${name}: unverified phone link tel:${num}`);
    }
    for (const [, digits] of raw.matchAll(/href="https:\/\/wa\.me\/(\d+)/g)) {
      if (![...phones].some((p) => p.slice(1) === digits))
        fail(`${name}: unverified WhatsApp number ${digits}`);
    }
    for (const [, addr] of raw.matchAll(/href="mailto:([^"?]+)/g)) {
      if (addr !== email) fail(`${name}: unverified e-mail link ${addr}`);
    }
  }

  const contactPage = readFileSync(join(DIST, 'iletisim/index.html'), 'utf8');
  if (!/data-map-load/.test(contactPage)) fail('iletisim: missing click-to-load map control');
  if (!/<template[^>]*data-map-template[\s\S]*?<iframe/.test(contactPage)) {
    fail('iletisim: map embed must live inside an inert <template>');
  }
  if (!/href="https:\/\/www\.google\.com\/maps\/dir\/\?api=1&amp;destination=/.test(contactPage)) {
    fail('iletisim: missing Google Maps directions link');
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

// Pre-launch (2026-11-11) — removed claims, project-status honesty, drawings.
{
  const text = (html) =>
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      // keep alt/title/description/og texts: they are published too
      .replace(/<[^>]*?\s(?:alt|title|content|aria-label)="([^"]*)"[^>]*>/g, ' $1 ')
      .replace(/<[^>]+>/g, ' ');
  // Unsupported legacy claims rewritten before launch (src/data/published-copy.ts).
  const CLAIMS =
    /(güçlü birikim|güçlü mühendislik|deneyimli kadro|uzman mimar|yetkin mühendis|başarıyla|öne çıkmış|köklü|güvenilir çözüm)/i;
  // Completion / sale are unconfirmed for every project.
  const STATUS = /(tamamlanmış|tamamlandı|teslim edildi|satılık|satışta|satışa)/i;
  for (const f of files.filter((x) => x.endsWith('.html'))) {
    const t = text(readFileSync(f, 'utf8'));
    const claim = t.match(CLAIMS)?.[0];
    if (claim) fail(`${rel(f)}: unsupported claim "${claim}"`);
    const status = t.match(STATUS)?.[0];
    if (status) fail(`${rel(f)}: unconfirmed project status wording "${status}"`);
  }
  // Architectural drawings are withheld (rights unverified): no drawing section or
  // drawing-only project page may be published.
  const projectsIndex = readFileSync(join(DIST, 'projeler/index.html'), 'utf8');
  if (/id="proje-cizimleri"/.test(projectsIndex))
    fail('projeler: drawings section published while drawing rights are unverified');
  for (const slug of ['proje-07', 'proje-09', 'proje-10', 'proje-11']) {
    const html = readFileSync(join(DIST, `projeler/${slug}/index.html`), 'utf8');
    if (!isRedirectStub(html)) fail(`${slug}: drawing-only project must be a redirect document`);
  }

  // Owner decision C2 (2026-11-11): SUGİAD is the founder's personal membership.
  // It must not appear anywhere on the site (text, alt, meta, JSON-LD), and the
  // retired Activities routes must be noindex redirect documents to About that
  // nothing links to.
  for (const f of files.filter((x) => x.endsWith('.html'))) {
    const raw = readFileSync(f, 'utf8');
    if (/SUG[İI]AD/i.test(raw))
      fail(`${rel(f)}: mentions SUGİAD (personal membership, not corporate)`);
  }
  const RETIRED = {
    'faaliyetlerimiz/index.html': '/hakkimizda/',
    'faaliyetler/index.html': '/hakkimizda/',
  };
  for (const [file, to] of Object.entries(RETIRED)) {
    const html = readFileSync(join(DIST, file), 'utf8');
    if (!html.includes(`<meta http-equiv="refresh" content="0; url=${to}">`))
      fail(`${file}: retired route must redirect to ${to}`);
    if (!html.includes('<meta name="robots" content="noindex">'))
      fail(`${file}: retired route must be noindex`);
    if (!html.includes(`<link rel="canonical" href="https://eyfayapi.net${to}">`))
      fail(`${file}: canonical must point to ${to}`);
  }
  const legacyActivities = readFileSync(join(DIST, 'faaliyet.html'), 'utf8');
  if (!legacyActivities.includes('url=/hakkimizda/'))
    fail('faaliyet.html must redirect to /hakkimizda/');
  for (const f of files.filter((x) => x.endsWith('.html'))) {
    const name = rel(f);
    if (Object.hasOwn(RETIRED, name)) continue;
    if (/href="\/faaliyetler(imiz)?\/?"/.test(readFileSync(f, 'utf8')))
      fail(`${name}: links to a retired Activities route`);
  }
}

// Stage 7 — SEO metadata, sitemap, robots, structured data, CSP, output hygiene.
{
  const SITE = 'https://eyfayapi.net';
  const attr = (html, re) => html.match(re)?.[1];
  const meta = (html, key) =>
    attr(html, new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`));
  const urlFor = (name) =>
    `${SITE}/${name.replace(/index\.html$/, '').replace(/^404\.html$/, '404')}`;
  const indexable = [];
  const titles = new Map();
  const descriptions = new Map();

  for (const f of files.filter((x) => x.endsWith('.html'))) {
    const name = rel(f);
    const html = readFileSync(f, 'utf8');
    if (isRedirectStub(html)) {
      if (!/<link rel="canonical" href="https:\/\/eyfayapi\.net\//.test(html))
        fail(`${name}: redirect document without an absolute canonical`);
      continue;
    }
    if (!/<meta http-equiv="content-security-policy" content="[^"]*default-src 'self'/.test(html))
      fail(`${name}: missing Content-Security-Policy <meta>`);
    const robots = meta(html, 'robots');
    const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
    if (robots) {
      if (!/^noindex, follow$/.test(robots) && name !== '404.html')
        fail(`${name}: unexpected robots "${robots}" (use "noindex, follow")`);
      if (name === '404.html' && canonical) fail('404.html: must not declare a canonical URL');
      continue;
    }
    indexable.push(urlFor(name));
    if (canonical !== urlFor(name)) fail(`${name}: canonical ${canonical} ≠ ${urlFor(name)}`);
    const title = attr(html, /<title>([^<]+)<\/title>/) ?? '';
    const description = meta(html, 'description') ?? '';
    if (titles.has(title)) fail(`${name}: duplicate title (also ${titles.get(title)})`);
    titles.set(title, name);
    if (descriptions.has(description))
      fail(`${name}: duplicate description (also ${descriptions.get(description)})`);
    descriptions.set(description, name);
    if (description.length < 50 || description.length > 170)
      fail(`${name}: description length ${description.length} (expected 50–170)`);
    for (const key of [
      'og:title',
      'og:description',
      'og:url',
      'og:image',
      'og:image:alt',
      'og:locale',
      'twitter:card',
      'twitter:image',
    ]) {
      if (!meta(html, key)) fail(`${name}: missing ${key}`);
    }
    if (meta(html, 'og:url') !== canonical) fail(`${name}: og:url ≠ canonical`);
    const image = meta(html, 'og:image') ?? '';
    if (!image.startsWith(`${SITE}/og/`)) fail(`${name}: og:image must be a generated /og/ image`);
    else if (!existsSync(join(DIST, image.slice(SITE.length))))
      fail(`${name}: og:image file missing → ${image}`);
    if (meta(html, 'og:image:width') !== '1200' || meta(html, 'og:image:height') !== '630')
      fail(`${name}: og:image dimensions must be declared as 1200×630`);

    for (const [, json] of html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    )) {
      let data;
      try {
        data = JSON.parse(json);
      } catch {
        fail(`${name}: invalid JSON-LD`);
        continue;
      }
      const text = JSON.stringify(data);
      for (const key of [
        'aggregateRating',
        'review',
        'openingHours',
        'openingHoursSpecification',
        'geo',
        'areaServed',
        'award',
        'hasCredential',
        'priceRange',
      ]) {
        if (text.includes(`"${key}"`)) fail(`${name}: JSON-LD contains unverified "${key}"`);
      }
    }
  }

  // og images: real JPEGs at exactly 1200×630 (SOF0/SOF2 marker).
  for (const f of files.filter((x) => rel(x).startsWith('og/'))) {
    const buf = readFileSync(f);
    let i = 2;
    let size = null;
    while (i < buf.length) {
      const marker = buf[i + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        size = [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
        break;
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
    if (!size || size[0] !== 1200 || size[1] !== 630)
      fail(`${rel(f)}: expected a 1200×630 JPEG, got ${size?.join('×') ?? 'unknown'}`);
  }

  const staging = process.env.SITE_INDEXING?.toLowerCase() === 'off';
  if (staging && indexable.length)
    fail(`staging build (SITE_INDEXING=off) has indexable page(s): ${indexable.join(', ')}`);

  // Sitemap = exactly the indexable pages (production build).
  const sitemapFiles = files.filter((x) => /sitemap-\d+\.xml$/.test(x));
  const listed = sitemapFiles.flatMap((f) =>
    [...readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
  );
  const missing = indexable.filter((u) => !listed.includes(u));
  const extra = listed.filter((u) => !indexable.includes(u));
  if (!staging && missing.length) fail(`sitemap misses indexable page(s): ${missing.join(', ')}`);
  if (!staging && extra.length) fail(`sitemap lists non-indexable URL(s): ${extra.join(', ')}`);

  // robots.txt: the production default must never block the site.
  const robotsTxt = readFileSync(join(DIST, 'robots.txt'), 'utf8');
  if (staging) {
    if (!/Disallow: \/\s*$/m.test(robotsTxt)) fail('robots.txt: staging build must disallow /');
  } else {
    if (/^Disallow:\s*\/\s*$/m.test(robotsTxt)) fail('robots.txt blocks the whole site');
    if (!robotsTxt.includes(`Sitemap: ${SITE}/sitemap-index.xml`))
      fail('robots.txt: missing Sitemap line');
  }

  // Public output hygiene: only web file types; nothing internal.
  const allowed = /\.(html|css|js|webp|jpe?g|png|svg|avif|woff2|mp4|xml|txt|ico)$/;
  for (const f of files) {
    const name = rel(f);
    if (!allowed.test(name)) fail(`unexpected file type in public output: ${name}`);
    if (/(^|\/)\.|\.map$|\.md$|\.ts$|(^|\/)(docs|src|scripts|tests|e2e)\//.test(name))
      fail(`internal file in public output: ${name}`);
  }
}

// Favicons (stable root URLs, square, multiples of 48 px for PNG; ICO 16/32/48).
{
  const pngSize = (buf) => [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  const expected = {
    'favicon-48x48.png': 48,
    'favicon-96x96.png': 96,
    'favicon-192x192.png': 192,
    'apple-touch-icon.png': 180,
  };
  for (const [name, size] of Object.entries(expected)) {
    const path = join(DIST, name);
    if (!existsSync(path)) {
      fail(`missing favicon ${name}`);
      continue;
    }
    const [w, h] = pngSize(readFileSync(path));
    if (w !== size || h !== size) fail(`${name}: expected ${size}×${size}, got ${w}×${h}`);
  }
  const icoPath = join(DIST, 'favicon.ico');
  if (!existsSync(icoPath)) fail('missing /favicon.ico (crawler fallback)');
  else {
    const ico = readFileSync(icoPath);
    const count = ico.readUInt16LE(4);
    const sizes = Array.from({ length: count }, (_, i) => ico.readUInt8(6 + i * 16) || 256);
    if (
      ico.readUInt16LE(2) !== 1 ||
      !sizes.includes(16) ||
      !sizes.includes(32) ||
      !sizes.includes(48)
    )
      fail(`favicon.ico: expected 16/32/48 icon entries, got ${sizes.join('/')}`);
  }
  for (const f of files.filter((x) => x.endsWith('.html'))) {
    const html = readFileSync(f, 'utf8');
    if (isRedirectStub(html)) continue;
    if (
      !/<link rel="icon" href="\/favicon\.ico"/.test(html) ||
      !/href="\/favicon-192x192\.png"/.test(html)
    )
      fail(`${rel(f)}: missing favicon declarations`);
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
