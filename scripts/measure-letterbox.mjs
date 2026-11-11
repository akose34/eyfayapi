#!/usr/bin/env node
/**
 * Measures baked-in black letterbox bands and writes src/data/image-crops.json.
 *
 *   node scripts/measure-letterbox.mjs            # rewrite the JSON
 *   node scripts/measure-letterbox.mjs --check    # exit 1 if the JSON is stale
 *
 * A row counts as letterbox when its mean luminance is ≤ 14/255 across the
 * full width. The crop removes the measured band plus a 2 px safety margin
 * (anti-aliased edge rows) — never more. Dark bands thinner than 0.5 % of the
 * height (e.g. a plan's 1 px frame line) are ignored, so drawings keep them. Only the files listed in SOURCES are
 * considered; originals are never modified (crops happen in the image service
 * at build time, see src/lib/image-service.ts).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = `${ROOT}src/data/image-crops.json`;
const THRESHOLD = 14;
const MARGIN = 2;
/** Bands thinner than this share of the height are drawing frames, not letterbox. */
const MIN_BAND = 0.005;

/** Candidates: drone stills (video frames) and the colour plans with a bottom band. */
const SOURCES = [
  'img/Eyfa-yapi-resim12.png',
  'img/Eyfa-yapi-resim17.png',
  'img/Eyfa-yapi-resim18.png',
  ...[
    7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    34,
  ].map((n) => `projects-img/${n}.webp`),
  ...[2, 3, 4, 5, 6].map((n) => `projects-img/${n}.webp`),
];

export async function measure(path) {
  const { data, info } = await sharp(`${ROOT}${path}`)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const rowMean = (y) => {
    let sum = 0;
    for (let x = 0; x < width; x++) sum += data[y * width + x];
    return sum / width;
  };
  let top = 0;
  while (top < height && rowMean(top) <= THRESHOLD) top++;
  let bottom = 0;
  while (bottom < height && rowMean(height - 1 - bottom) <= THRESHOLD) bottom++;
  return { width, height, measuredTop: top, measuredBottom: bottom };
}

async function build() {
  const crops = {};
  for (const path of SOURCES) {
    const m = await measure(path);
    const band = (px) => (px / m.height >= MIN_BAND ? px + MARGIN : 0);
    const top = band(m.measuredTop);
    const bottom = band(m.measuredBottom);
    if (top === 0 && bottom === 0) continue;
    crops[path] = { ...m, top, bottom };
  }
  return crops;
}

const crops = await build();
const json = `${JSON.stringify(crops, null, 2)}\n`;
if (process.argv.includes('--check')) {
  const current = readFileSync(OUT, 'utf8');
  if (current !== json) {
    console.error('image-crops.json is stale — run: node scripts/measure-letterbox.mjs');
    process.exit(1);
  }
  console.log(`image-crops.json up to date (${Object.keys(crops).length} entries)`);
} else {
  writeFileSync(OUT, json);
  console.log(`wrote ${Object.keys(crops).length} crop entries → src/data/image-crops.json`);
}
