import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { activities } from '@/data/activities';
import { publicImages } from '@/data/projects';
import { hasLegacyImage, legacyImage, legacyVideo, registeredImagePaths } from '@/lib/media';
import { ROOT } from './helpers';

const sourceFiles = (dir: string): string[] =>
  readdirSync(join(ROOT, dir)).flatMap((entry) => {
    const rel = `${dir}/${entry}`;
    return statSync(join(ROOT, rel)).isDirectory() ? sourceFiles(rel) : [rel];
  });

const allSource = sourceFiles('src')
  .filter((f) => /\.(astro|ts)$/.test(f))
  .map((f) => readFileSync(join(ROOT, f), 'utf8'))
  .join('\n');

describe('media registry', () => {
  // Stage 4: withheld legacy images are intentionally NOT registered (see
  // tests/projects.test.ts); every image the public UI shows must be.
  it('resolves every image the public UI shows', () => {
    const used = [
      ...publicImages().map((g) => g.src),
      ...activities.filter((a) => a.imagePublic).map((a) => a.image),
    ];
    for (const path of used) {
      expect(hasLegacyImage(path), path).toBe(true);
      expect(legacyImage(path).width).toBeGreaterThan(0);
    }
  });

  it('registers no image that nothing uses (avoids shipping unused originals)', () => {
    const usedByData = new Set([
      ...publicImages().map((g) => g.src),
      ...activities.filter((a) => a.imagePublic).map((a) => a.image),
    ]);
    for (const path of registeredImagePaths()) {
      const used = usedByData.has(path) || allSource.includes(`'${path}'`);
      expect(used, `${path} is registered in src/lib/media.ts but never used`).toBe(true);
    }
  });

  it('fails loudly on unknown files', () => {
    expect(() => legacyImage('projects-img/does-not-exist.webp')).toThrow(/Unknown legacy image/);
    expect(() => legacyVideo('mini-videos/nope.mp4')).toThrow(/Unknown legacy video/);
  });

  it('resolves the legacy hero videos', () => {
    expect(legacyVideo('mini-videos/logo-video.mp4')).toMatch(/logo-video/);
  });
});
