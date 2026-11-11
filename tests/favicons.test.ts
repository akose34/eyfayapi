/**
 * Favicons (public/) are generated from the official logo by
 * scripts/generate-favicons.mjs and must stay in sync with it.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ROOT } from './helpers';

const png = (name: string) => readFileSync(`${ROOT}public/${name}`);
const size = (buf: Buffer) => [buf.readUInt32BE(16), buf.readUInt32BE(20)];

describe('favicons', () => {
  it(
    'match the official logo (regenerate with scripts/generate-favicons.mjs)',
    { timeout: 60_000 },
    () => {
      const out = execFileSync(process.execPath, ['scripts/generate-favicons.mjs', '--check'], {
        cwd: ROOT,
        encoding: 'utf8',
      });
      expect(out).toContain('up to date');
    },
  );

  it('are square PNGs in multiples of 48 px, plus a 180 px touch icon', () => {
    for (const n of [48, 96, 192]) expect(size(png(`favicon-${n}x${n}.png`))).toEqual([n, n]);
    expect(size(png('apple-touch-icon.png'))).toEqual([180, 180]);
  });

  it('ship an ICO with 16, 32 and 48 px entries', () => {
    const ico = png('favicon.ico');
    expect(ico.readUInt16LE(2)).toBe(1);
    const count = ico.readUInt16LE(4);
    expect([...Array(count).keys()].map((i) => ico.readUInt8(6 + i * 16))).toEqual([16, 32, 48]);
  });
});
