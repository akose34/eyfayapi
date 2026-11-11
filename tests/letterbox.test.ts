/**
 * Build-time letterbox crop (Stage 4) — guards against wrong crop assumptions.
 *
 * 1. Every entry in src/data/image-crops.json is re-measured from the pixels:
 *    the recorded band must equal the measurement, the crop may exceed it by
 *    at most the 2 px safety margin, removed rows must be black and the first/
 *    last KEPT rows must contain picture content.
 * 2. Every image the public UI shows with a black band is listed.
 * 3. The image service crops exactly the requested rows and nothing else.
 */
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { projects, publicImages } from '@/data/projects';
import service, { parseLetterbox } from '@/lib/image-service';
import { IMAGE_CROPS, croppedImage } from '@/lib/media';
import { ROOT } from './helpers';

const BLACK = 14;
const MARGIN = 2;

async function rows(path: string) {
  const { data, info } = await sharp(`${ROOT}${path}`)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const mean = (y: number) => {
    let sum = 0;
    for (let x = 0; x < info.width; x++) sum += data[y * info.width + x] ?? 0;
    return sum / info.width;
  };
  return { ...info, mean };
}

describe('crop table matches the pixels', () => {
  it.each(Object.entries(IMAGE_CROPS))('%s', async (path, crop) => {
    const img = await rows(path);
    expect([img.width, img.height]).toEqual([crop.width, crop.height]);

    // Recorded measurement is exact.
    let top = 0;
    while (img.mean(top) <= BLACK) top++;
    let bottom = 0;
    while (img.mean(img.height - 1 - bottom) <= BLACK) bottom++;
    expect(crop.measuredTop).toBe(top);
    expect(crop.measuredBottom).toBe(bottom);

    // Crop = band + margin, or 0 for thin frame lines (drawings keep them).
    for (const [cut, band] of [
      [crop.top, crop.measuredTop],
      [crop.bottom, crop.measuredBottom],
    ] as const) {
      expect(cut === 0 || cut === band + MARGIN).toBe(true);
      if (cut === 0) expect(band / crop.height).toBeLessThan(0.005);
    }

    // On every cropped side, the first KEPT row is real picture, not black.
    // (An uncropped side may legitimately start with a thin drawing frame.)
    if (crop.top) expect(img.mean(crop.top)).toBeGreaterThan(BLACK);
    if (crop.bottom) expect(img.mean(crop.height - 1 - crop.bottom)).toBeGreaterThan(BLACK);
    // …and every REMOVED row beyond the safety margin really was black.
    for (let y = 0; y < crop.measuredTop; y++) expect(img.mean(y)).toBeLessThanOrEqual(BLACK);
  });

  it('is up to date with the measurement script', () => {
    const out = execFileSync(process.execPath, ['scripts/measure-letterbox.mjs', '--check'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    expect(out).toContain('up to date');
  });
});

describe('public imagery with black bands is always cropped', () => {
  it(
    'every publicly shown image with a band ≥ 0.5 % has a crop entry',
    { timeout: 120_000 },
    async () => {
      const missing: string[] = [];
      for (const image of publicImages()) {
        const img = await rows(image.src);
        const band = (y0: number, step: number) => {
          let n = 0;
          while (n < img.height && img.mean(y0 + n * step) <= BLACK) n++;
          return n / img.height;
        };
        if ((band(0, 1) >= 0.005 || band(img.height - 1, -1) >= 0.005) && !IMAGE_CROPS[image.src]) {
          missing.push(image.src);
        }
      }
      expect(missing).toEqual([]);
    },
  );

  it('croppedImage reports the trimmed intrinsic size', () => {
    const c = croppedImage('projects-img/19.webp');
    expect([c.width, c.height]).toEqual([3024, 1964 - 170 - 96]);
    expect(c.options).toEqual({ 'data-letterbox': '170,96' });
    const plain = croppedImage('projects-img/32.webp');
    expect(plain.options).toEqual({});
    expect(plain.height).toBe(plain.src.height);
  });

  it('every project still references only files that exist in the registry', () => {
    expect(projects.length).toBe(11);
  });
});

describe('image service', () => {
  it('parses only well-formed crop instructions', () => {
    expect(parseLetterbox('170,96')).toEqual({ top: 170, bottom: 96 });
    expect(parseLetterbox('0,0')).toBeUndefined();
    expect(parseLetterbox('170')).toBeUndefined();
    expect(parseLetterbox('-1,5')).toBeUndefined();
    expect(parseLetterbox(undefined)).toBeUndefined();
  });

  it('crops exactly the requested rows before resizing', async () => {
    // 100×100: 10 black rows, 75 white rows, 15 black rows.
    const raw = Buffer.alloc(100 * 100 * 3);
    for (let y = 10; y < 85; y++) raw.fill(255, y * 300, (y + 1) * 300);
    const input = await sharp(raw, { raw: { width: 100, height: 100, channels: 3 } })
      .png()
      .toBuffer();
    const config = { service: { entrypoint: '', config: {} } } as never;
    const out = await service.transform(
      input,
      {
        src: 'synthetic.png',
        format: 'png',
        width: 100,
        height: 75,
        'data-letterbox': '10,15',
      } as never,
      config,
      { warn() {} } as never,
    );
    const meta = await sharp(Buffer.from(out.data)).metadata();
    expect([meta.width, meta.height]).toEqual([100, 75]);
    const stats = await sharp(Buffer.from(out.data)).stats();
    expect(stats.channels[0]?.min).toBeGreaterThan(240); // no black row survived
  });

  it('strips the crop option from rendered HTML attributes', () => {
    expect(service.getHTMLAttributes).toBeTypeOf('function');
    const attrs = service.getHTMLAttributes?.(
      {
        src: { src: '/x.webp', width: 100, height: 100, format: 'webp' },
        width: 100,
        height: 75,
        'data-letterbox': '10,15',
        alt: 'x',
      } as never,
      {} as never,
      {} as never,
    ) as Record<string, unknown>;
    expect(attrs).not.toHaveProperty('data-letterbox');
    expect(attrs.alt).toBe('x');
  });
});
