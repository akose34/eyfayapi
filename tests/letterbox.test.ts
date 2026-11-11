/**
 * Re-measures the black letterbox bars of every project/corporate image with
 * sharp, so the LETTERBOX table in src/lib/media.ts can never drift from the
 * pixels: every listed image must really have bars within the trimmed range,
 * and every image with bars must be listed (or be a floor plan, which is shown
 * with object-fit: contain and never trimmed).
 */
import { readdirSync } from 'node:fs';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { projects } from '@/data/projects';
import { LETTERBOX } from '@/lib/media';
import { ROOT } from './helpers';

async function measureBars(path: string): Promise<{ top: number; bottom: number }> {
  const { data, info } = await sharp(`${ROOT}${path}`)
    .greyscale()
    .resize(64, 400, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rowMean = (y: number) => {
    let sum = 0;
    for (let x = 0; x < info.width; x++) sum += data[y * info.width + x] ?? 0;
    return sum / info.width;
  };
  const rows = Array.from({ length: info.height }, (_, y) => rowMean(y));
  const top = rows.findIndex((v) => v > 14);
  const bottom = [...rows].reverse().findIndex((v) => v > 14);
  return { top: top / info.height, bottom: bottom / info.height };
}

const plans = new Set(
  projects.flatMap((p) => p.gallery.filter((g) => g.kind === 'floor-plan').map((g) => g.src)),
);

describe('letterbox table', () => {
  it.each(Object.entries(LETTERBOX))('%s trim covers the measured bars', async (path, trim) => {
    const bars = await measureBars(path);
    expect(bars.top).toBeGreaterThan(0.03);
    expect(bars.top).toBeLessThanOrEqual(trim.top);
    expect(bars.bottom).toBeLessThanOrEqual(trim.bottom);
    // Never trim more than ~1% of real picture.
    expect(trim.top - bars.top).toBeLessThan(0.012);
    expect(trim.bottom - bars.bottom).toBeLessThan(0.012);
  });

  it('lists every used photo that has bars', { timeout: 60_000 }, async () => {
    const used = projects.flatMap((p) => p.gallery.map((g) => g.src)).filter((p) => !plans.has(p));
    const missing: string[] = [];
    for (const path of used) {
      const bars = await measureBars(path);
      if ((bars.top > 0.02 || bars.bottom > 0.02) && !(path in LETTERBOX)) missing.push(path);
    }
    expect(missing).toEqual([]);
    expect(readdirSync(`${ROOT}projects-img`).length).toBeGreaterThan(0);
  });
});
