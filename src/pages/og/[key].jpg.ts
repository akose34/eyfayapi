/**
 * Build-time social sharing images: /og/<key>.jpg, 1200×630 JPEG (Stage 7).
 *
 * Composition (no rendered text, see src/data/og.ts):
 *   photo variant  authentic photo, cover-cropped (letterbox bands removed
 *                  first, as on the site) → charcoal gradient from the left →
 *                  trimmed authentic logo + champagne rule on the dark side
 *   brand variant  charcoal field → centred logo + champagne rule
 *
 * Only registered (allowlisted, non-withheld) legacy images can be used:
 * hasLegacyImage() fails the build otherwise. Originals are read, never written.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import crops from '@/data/image-crops.json';
import { OG_HEIGHT, OG_WIDTH, ogFiles, type OgEntry } from '@/data/og';
import { hasLegacyImage } from '@/lib/media';

const CHARCOAL = '#151c1e';
const CHAMPAGNE = '#c5a46d';
const root = process.cwd();
const read = (path: string) => readFile(join(root, path));

export const getStaticPaths = (() =>
  ogFiles().map(([key, entry]) => ({
    params: { key },
    props: { entry },
  }))) satisfies GetStaticPaths;

/** The logo artwork without its transparent padding, at the given height. */
async function logo(height: number) {
  const trimmed = await sharp(await read('logos/logo.png'))
    .trim()
    .toBuffer();
  return sharp(trimmed).resize({ height }).png().toBuffer({ resolveWithObject: true });
}

const rule = (width: number) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="3"><rect width="${width}" height="3" fill="${CHAMPAGNE}"/></svg>`,
  );

/** "50% 40%" → sharp gravity is coarse, so crop manually around the focal point. */
async function coverCrop(path: string, position = '50% 50%') {
  const crop = (
    crops as Record<string, { width: number; height: number; top: number; bottom: number }>
  )[path];
  let image = sharp(await read(path)).rotate();
  const meta = await image.metadata();
  const width = meta.width;
  let height = meta.height;
  if (crop) {
    image = sharp(
      await image
        .extract({ left: 0, top: crop.top, width, height: height - crop.top - crop.bottom })
        .toBuffer(),
    );
    height -= crop.top + crop.bottom;
  }
  const scale = Math.max(OG_WIDTH / width, OG_HEIGHT / height);
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const [px, py] = position.split(/\s+/).map((v) => Number.parseFloat(v) / 100);
  const left = Math.round((w - OG_WIDTH) * (px ?? 0.5));
  const top = Math.round((h - OG_HEIGHT) * (py ?? 0.5));
  return image.resize(w, h).extract({ left, top, width: OG_WIDTH, height: OG_HEIGHT }).toBuffer();
}

async function render(entry: OgEntry): Promise<Buffer> {
  if (!entry.photo) {
    const mark = await logo(250);
    const left = Math.round((OG_WIDTH - mark.info.width) / 2);
    const top = Math.round((OG_HEIGHT - mark.info.height) / 2) - 20;
    return sharp({
      create: { width: OG_WIDTH, height: OG_HEIGHT, channels: 3, background: CHARCOAL },
    })
      .composite([
        { input: mark.data, left, top },
        {
          input: rule(96),
          left: Math.round((OG_WIDTH - 96) / 2),
          top: top + mark.info.height + 36,
        },
      ])
      .jpeg({ quality: 84, mozjpeg: true })
      .toBuffer();
  }

  const { src, position } = entry.photo;
  if (!hasLegacyImage(src)) throw new Error(`[og] ${src} is not a registered public image`);
  const photo = await coverCrop(src, position);
  const shade = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}">
      <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="${CHARCOAL}" stop-opacity="0.94"/>
        <stop offset="0.38" stop-color="${CHARCOAL}" stop-opacity="0.82"/>
        <stop offset="0.7" stop-color="${CHARCOAL}" stop-opacity="0.12"/>
        <stop offset="1" stop-color="${CHARCOAL}" stop-opacity="0"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`,
  );
  const mark = await logo(170);
  const left = 88;
  const top = Math.round((OG_HEIGHT - mark.info.height) / 2) - 16;
  return sharp(photo)
    .composite([
      { input: shade },
      { input: mark.data, left, top },
      { input: rule(80), left, top: top + mark.info.height + 30 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

export const GET: APIRoute = async ({ props }) => {
  const body = await render((props as { entry: OgEntry }).entry);
  return new Response(new Uint8Array(body), { headers: { 'Content-Type': 'image/jpeg' } });
};
