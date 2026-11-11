#!/usr/bin/env node
/**
 * Favicons from the official logo (logos/logo.png, unmodified artwork).
 *
 *   node scripts/generate-favicons.mjs          # writes public/ (commit the result)
 *   node scripts/generate-favicons.mjs --check  # fails if public/ is out of date
 *
 * The logo is gold artwork on a transparent 1024² canvas: a winged emblem
 * (rows 215–446) above the "EYFA" and "YAPI" wordmarks. At favicon sizes the
 * whole lockup turns into an unreadable smudge (and pale gold on white), so:
 *
 *   favicon.ico (16/32/48), favicon-{48,96,192}.png   emblem only
 *   apple-touch-icon.png (180)                         full lockup
 *
 * Both sit on the brand charcoal (#151C1E) as a square, with even padding.
 * The artwork itself is only trimmed and scaled, never redrawn or recoloured.
 * Root URLs are stable across builds (Google recommends a stable favicon URL),
 * and multiples of 48 px follow Google's favicon guidance.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LOGO = `${ROOT}logos/logo.png`;
const OUT = `${ROOT}public/`;
const CHARCOAL = { r: 0x15, g: 0x1c, b: 0x1e, alpha: 1 };
/** Emblem band of logos/logo.png (measured: rows 215–446, columns 273–748). */
const EMBLEM = { left: 273, top: 215, width: 476, height: 232 };

/** Artwork (emblem or full lockup), trimmed, centred on a charcoal square. */
async function icon(size, part, padding) {
  const source =
    part === 'emblem' ? sharp(LOGO).extract(EMBLEM) : sharp(await sharp(LOGO).trim().toBuffer());
  const inner = Math.round(size * (1 - 2 * padding));
  const art = await source
    .resize({ width: inner, height: inner, fit: 'inside', kernel: 'lanczos3' })
    .png()
    .toBuffer({ resolveWithObject: true });
  return sharp({ create: { width: size, height: size, channels: 4, background: CHARCOAL } })
    .composite([
      {
        input: art.data,
        left: Math.round((size - art.info.width) / 2),
        top: Math.round((size - art.info.height) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** ICO container with PNG-compressed entries (supported by all current browsers). */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;
  entries.forEach(({ size, png }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2); // palette
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4); // planes
    dir.writeUInt16LE(32, o + 6); // bpp
    dir.writeUInt32LE(png.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += png.length;
  });
  return Buffer.concat([header, dir, ...entries.map((e) => e.png)]);
}

export async function buildFavicons() {
  const files = {};
  const icoSizes = [16, 32, 48];
  const icoEntries = [];
  for (const size of icoSizes) {
    // Smaller icons get less padding so the emblem stays as large as possible.
    icoEntries.push({ size, png: await icon(size, 'emblem', size <= 16 ? 0.04 : 0.1) });
  }
  files['favicon.ico'] = ico(icoEntries);
  for (const size of [48, 96, 192])
    files[`favicon-${size}x${size}.png`] = await icon(size, 'emblem', 0.12);
  files['apple-touch-icon.png'] = await icon(180, 'lockup', 0.14);
  return files;
}

const files = await buildFavicons();
/** PNG images inside a file: the file itself, or each entry of an ICO. */
function pngsOf(buf) {
  if (buf.readUInt16LE(0) === 0 && buf.readUInt16LE(2) === 1) {
    return Array.from({ length: buf.readUInt16LE(4) }, (_, i) => {
      const o = 6 + i * 16;
      return buf.subarray(
        buf.readUInt32LE(o + 12),
        buf.readUInt32LE(o + 12) + buf.readUInt32LE(o + 8),
      );
    });
  }
  return [buf];
}

/**
 * Same pixels (±2 per channel)? Byte equality is too strict: PNG compression
 * output can differ between platforms (macOS vs the Linux CI runner).
 */
async function samePixels(a, b) {
  const pa = pngsOf(a);
  const pb = pngsOf(b);
  if (pa.length !== pb.length) return false;
  for (let i = 0; i < pa.length; i++) {
    const [x, y] = await Promise.all(
      [pa[i], pb[i]].map((p) => sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true })),
    );
    if (x.info.width !== y.info.width || x.info.height !== y.info.height) return false;
    for (let j = 0; j < x.data.length; j++) if (Math.abs(x.data[j] - y.data[j]) > 2) return false;
  }
  return true;
}

if (process.argv.includes('--check')) {
  const stale = [];
  for (const [name, data] of Object.entries(files)) {
    let current;
    try {
      current = readFileSync(OUT + name);
    } catch {
      stale.push([name]);
      continue;
    }
    if (!(await samePixels(current, data))) stale.push([name]);
  }
  if (stale.length) {
    console.error(`favicons out of date: ${stale.map(([n]) => n).join(', ')}`);
    process.exit(1);
  }
  console.log('favicons up to date');
} else {
  for (const [name, data] of Object.entries(files)) {
    writeFileSync(OUT + name, data);
    console.log(`public/${name} ${data.length} B`);
  }
}
