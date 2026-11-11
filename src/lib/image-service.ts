/**
 * Build-time letterbox crop (Stage 4).
 *
 * A thin wrapper around Astro's own sharp service. When an image is requested
 * with a `data-letterbox="<top>,<bottom>"` option (pixel rows to remove from
 * the ORIGINAL file, taken from src/data/image-crops.json), the source is cut
 * with `sharp.extract()` — losslessly re-encoded as PNG — *before* Astro's
 * normal resize/encode pipeline runs. Originals are never modified.
 *
 * Callers (src/lib/media.ts → `croppedImage`) also pass the cropped
 * width/height, so the HTML width/height, `srcset` heights and aspect ratio
 * all describe the trimmed picture; the subsequent resize therefore never
 * crops again.
 *
 * Everything else (formats, quality, dev endpoint) is the stock service.
 */
import type { ImageTransform, LocalImageService } from 'astro';
import sharpService from 'astro/assets/services/sharp';
import sharp from 'sharp';

import { LETTERBOX_OPTION } from './image-crop-option';

export { LETTERBOX_OPTION };

type Transform = ImageTransform & { [LETTERBOX_OPTION]?: string };

/** Parses "170,96" → { top: 170, bottom: 96 }; rejects anything else. */
export function parseLetterbox(value: unknown): { top: number; bottom: number } | undefined {
  if (typeof value !== 'string' || !/^\d+,\d+$/.test(value)) return undefined;
  const [top, bottom] = value.split(',').map(Number) as [number, number];
  return top > 0 || bottom > 0 ? { top, bottom } : undefined;
}

/** Mirrors astro/dist/assets/consts.js DEFAULT_HASH_PROPS (Astro 7.4). */
export const DEFAULT_HASH_PROPS = [
  'src',
  'width',
  'height',
  'format',
  'quality',
  'fit',
  'position',
  'background',
] as const;

const base = sharpService as LocalImageService;

const service: LocalImageService = {
  ...base,
  // Different crops must produce different output files. NOTE: the stock sharp
  // service does not define propertiesToHash (Astro falls back to its internal
  // defaults), so the defaults must be listed explicitly — otherwise every
  // variant of a source would hash to the same file name (found in Stage 4 QA).
  propertiesToHash: [...(base.propertiesToHash ?? DEFAULT_HASH_PROPS), LETTERBOX_OPTION],

  getHTMLAttributes(options, imageConfig, ...args) {
    const rest = Object.fromEntries(
      Object.entries(options).filter(([key]) => key !== LETTERBOX_OPTION),
    ) as typeof options;
    return base.getHTMLAttributes ? base.getHTMLAttributes(rest, imageConfig, ...args) : rest;
  },

  // Dev server: carry the crop through the /_image endpoint URL.
  getURL(options, imageConfig, ...args) {
    const url = base.getURL(options, imageConfig, ...args);
    const letterbox = (options as Transform)[LETTERBOX_OPTION];
    if (!letterbox || typeof url !== 'string' || !url.includes('?')) return url;
    return `${url}&lb=${encodeURIComponent(letterbox)}`;
  },

  parseURL(url, imageConfig, ...args) {
    const transform = base.parseURL(url, imageConfig, ...args);
    // The stock implementation is synchronous; pass any async result through untouched.
    if (!transform || transform instanceof Promise) return transform;
    const lb = url.searchParams.get('lb');
    if (lb) (transform as Transform)[LETTERBOX_OPTION] = lb;
    return transform;
  },

  async transform(inputBuffer, transformOptions, imageConfig, ...rest) {
    const crop = parseLetterbox((transformOptions as Transform)[LETTERBOX_OPTION]);
    if (!crop) return base.transform(inputBuffer, transformOptions, imageConfig, ...rest);

    const image = sharp(inputBuffer, { failOn: 'none' });
    const { width, height } = await image.metadata();
    if (!width || !height || crop.top + crop.bottom >= height) {
      throw new Error(
        `[image-service] invalid letterbox ${crop.top},${crop.bottom} for ${width}x${height}`,
      );
    }
    const cropped = await image
      .extract({ left: 0, top: crop.top, width, height: height - crop.top - crop.bottom })
      .png({ compressionLevel: 1 }) // lossless intermediate; final encode happens below
      .toBuffer();
    return base.transform(cropped, transformOptions, imageConfig, ...rest);
  },
};

export default service;
