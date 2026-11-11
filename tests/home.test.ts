/**
 * Homepage (Stage 3) data integrity: curation points at real, registered
 * media; featured galleries use their own images; every sentence of new
 * homepage copy is a verbatim excerpt of the legacy about.html.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { legacyCopy } from '@/data/company';
import {
  featuredProjects,
  homeClosingImage,
  homeHero,
  homeIntroImage,
  serviceImages,
} from '@/data/home';
import { getProjectBySlug } from '@/data/projects';
import { services } from '@/data/services';
import { hasLegacyImage, letterboxOf } from '@/lib/media';
import { ROOT, normaliseText, readRoot } from './helpers';

const about = normaliseText(readRoot('about.html'));
const aboutLower = about.toLocaleLowerCase('tr-TR');

/**
 * Excerpts may capitalise their first letter (they start a sentence on the
 * homepage); everything else must match the source exactly.
 */
const isVerbatimExcerpt = (excerpt: string): boolean => {
  if (about.includes(excerpt)) return true;
  const first = excerpt.slice(0, 1).toLocaleLowerCase('tr-TR');
  return (
    about.includes(first + excerpt.slice(1)) &&
    aboutLower.includes(excerpt.toLocaleLowerCase('tr-TR'))
  );
};

describe('homepage curation', () => {
  it('uses registered images for hero, introduction and closing', () => {
    for (const img of [homeHero, homeIntroImage, homeClosingImage]) {
      expect(hasLegacyImage(img.src), img.src).toBe(true);
      expect(img.alt.length).toBeGreaterThan(10);
      // Drone stills must be trimmed — the letterbox table must know them.
      expect(letterboxOf(img.src), img.src).toBeDefined();
    }
  });

  it('features existing galleries with photos from their own gallery', () => {
    expect(featuredProjects.length).toBeGreaterThanOrEqual(3);
    for (const { slug, image } of featuredProjects) {
      const project = getProjectBySlug(slug);
      expect(project, slug).toBeDefined();
      const picked = project?.gallery.find((g) => g.src === image);
      expect(picked, `${image} must belong to ${slug}`).toBeDefined();
      expect(picked?.kind).not.toBe('floor-plan');
      // Detail pages come from the dynamic route src/pages/projeler/[slug].astro,
      // which generates one page per project slug (link resolution in the built
      // output is additionally checked by scripts/verify-dist.mjs).
      expect(existsSync(join(ROOT, 'src/pages/projeler/[slug].astro'))).toBe(true);
    }
  });

  it('has exactly one registered image per verified service', () => {
    expect(Object.keys(serviceImages).sort()).toEqual(services.map((s) => s.id).sort());
    for (const { src } of Object.values(serviceImages)) expect(hasLegacyImage(src), src).toBe(true);
  });

  it('never presents a featured project name as verified', () => {
    for (const { slug } of featuredProjects) {
      expect(getProjectBySlug(slug)?.name.status).not.toBe('VERIFIED');
    }
  });
});

describe('homepage copy is verbatim legacy content', () => {
  it('introduction lead and vision excerpt', () => {
    expect(isVerbatimExcerpt(legacyCopy.homeIntroLead)).toBe(true);
    expect(isVerbatimExcerpt(legacyCopy.visionQuote)).toBe(true);
  });

  it.each(legacyCopy.activityAreas.map((a) => [a.title, a.text]))(
    'activity area "%s" text is an excerpt of about.html',
    (_, text) => {
      expect(isVerbatimExcerpt(text)).toBe(true);
    },
  );

  it.each(legacyCopy.principles.map((p) => [p.title, p.text]))(
    'principle "%s" text is an excerpt of about.html',
    (_, text) => {
      expect(isVerbatimExcerpt(text)).toBe(true);
    },
  );

  it('districts are the ones named in about.html', () => {
    for (const d of legacyCopy.districts) expect(about).toContain(d);
    expect(about).toContain(
      `başta ${legacyCopy.districts.slice(0, -1).join(', ')} ve ${legacyCopy.districts.at(-1)} ilçeleri`,
    );
  });

  it('hero and projects leads are the first sentences of verified copy', () => {
    const home = normaliseText(readRoot('index.html'));
    expect(home).toContain(legacyCopy.homeIntro.split('. ')[0]);
    expect(home).toContain(legacyCopy.projectsIntro.split('. ')[0]);
  });

  it('rejects an invented sentence (self-check of the excerpt matcher)', () => {
    expect(isVerbatimExcerpt('Türkiye’nin en büyük 10 inşaat firmasından biriyiz.')).toBe(false);
    expect(isVerbatimExcerpt('Yol ve köprü inşaatları ile ödüller')).toBe(false);
  });
});

describe('production dependencies stay minimal', () => {
  it('ships no unexpected runtime dependency', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
      dependencies: Record<string, string>;
    };
    expect(Object.keys(pkg.dependencies).sort()).toEqual([
      '@astrojs/sitemap',
      '@fontsource-variable/cormorant-garamond',
      '@fontsource-variable/manrope',
      '@tailwindcss/vite',
      'astro',
      'tailwindcss',
    ]);
  });
});
