/**
 * Lighthouse audit of the LOCAL production build (Stage 7).
 *
 *   npm run build && npx astro preview --port 4323 --host 127.0.0.1
 *   node scripts/lighthouse.mjs [--runs 3] [--base http://127.0.0.1:4323] [--out lighthouse]
 *
 * Runs every page in PAGES under Lighthouse's default mobile profile (Moto G
 * Power emulation, simulated slow 4G, 4x CPU slowdown) and the desktop preset,
 * and reports the MEDIAN run per page (by performance score). Raw JSON reports
 * are written to ./lighthouse/ (git-ignored). Nothing here contacts the live
 * site; the base URL must be a local preview.
 *
 * Uses the installed Google Chrome (or CHROME_PATH).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const BASE = arg('base', 'http://127.0.0.1:4323');
const RUNS = Number(arg('runs', '1'));
const OUT = arg('out', 'lighthouse');
const ONLY = arg('only', '');

if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(BASE)) {
  throw new Error(`Refusing to audit a non-local URL: ${BASE}`);
}

export const PAGES = [
  ['home', '/'],
  ['projects', '/projeler/'],
  ['project-detail', '/projeler/proje-06/'],
  ['about', '/hakkimizda/'],
  ['services', '/hizmetler/'],
  ['activities', '/faaliyetlerimiz/'],
  ['contact', '/iletisim/'],
];

const FORM_FACTORS = { mobile: undefined, desktop: desktopConfig };

const median = (runs) => {
  const sorted = [...runs].sort(
    (a, b) => a.categories.performance.score - b.categories.performance.score,
  );
  return sorted[Math.floor(sorted.length / 2)];
};

const summarise = (lhr) => {
  const a = lhr.audits;
  const num = (id) => a[id]?.numericValue;
  return {
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
    seo: Math.round(lhr.categories.seo.score * 100),
    fcpMs: Math.round(num('first-contentful-paint')),
    lcpMs: Math.round(num('largest-contentful-paint')),
    tbtMs: Math.round(num('total-blocking-time')),
    cls: Number(num('cumulative-layout-shift').toFixed(3)),
    siMs: Math.round(num('speed-index')),
    transferKB: Math.round(num('total-byte-weight') / 1024),
    lcpElement:
      a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet?.slice(
        0,
        120,
      ) ?? null,
    failing: Object.values(lhr.categories)
      .flatMap((c) => c.auditRefs)
      .filter((r) => r.weight > 0 && a[r.id].score !== null && a[r.id].score < 0.9)
      .map((r) => r.id),
  };
};

mkdirSync(OUT, { recursive: true });
const chrome = await launch({ chromeFlags: ['--headless=new', '--no-first-run'] });
const results = {};
try {
  for (const [name, path] of PAGES) {
    if (ONLY && !ONLY.split(',').includes(name)) continue;
    for (const [ff, config] of Object.entries(FORM_FACTORS)) {
      const runs = [];
      for (let i = 0; i < RUNS; i++) {
        const { lhr } = await lighthouse(
          `${BASE}${path}`,
          { port: chrome.port, output: 'json', logLevel: 'error' },
          config,
        );
        if (lhr.runtimeError) throw new Error(`${name} ${ff}: ${lhr.runtimeError.message}`);
        runs.push(lhr);
      }
      const lhr = median(runs);
      writeFileSync(`${OUT}/${name}.${ff}.json`, JSON.stringify(lhr));
      results[`${name} (${ff})`] = summarise(lhr);
      const r = results[`${name} (${ff})`];
      console.log(
        `${`${name} ${ff}`.padEnd(24)} P${r.performance} A${r.accessibility} BP${r.bestPractices} SEO${r.seo}` +
          `  LCP ${r.lcpMs}ms  CLS ${r.cls}  TBT ${r.tbtMs}ms  ${r.transferKB} KB` +
          (r.failing.length ? `  ⚠ ${r.failing.join(', ')}` : ''),
      );
    }
  }
} finally {
  await chrome.kill();
}
writeFileSync(
  `${OUT}/summary.json`,
  JSON.stringify(
    {
      base: BASE,
      runsPerPage: RUNS,
      lighthouse: (await import('lighthouse/package.json', { with: { type: 'json' } })).default
        .version,
      results,
    },
    null,
    2,
  ),
);
