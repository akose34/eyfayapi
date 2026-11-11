/**
 * Stage 7 SEO helpers: indexing switch, robots, JSON-LD escaping and sharing images.
 */
import { describe, expect, it } from 'vitest';
import { OG_HEIGHT, OG_WIDTH, ogAlt, ogImagePath, ogImages } from '@/data/og';
import { publicImages, publicProjects } from '@/data/projects';
import { hasLegacyImage } from '@/lib/media';
import { canonicalUrl, indexingDisabled, jsonLdString, pageTitle, robotsContent } from '@/lib/seo';
import { aboutImages, serviceFeatureImages } from '@/data/corporate';
import { homeHero } from '@/data/home';

describe('indexing switch', () => {
  it('is indexable by default and only disabled by SITE_INDEXING=off', () => {
    expect(indexingDisabled({})).toBe(false);
    expect(indexingDisabled({ SITE_INDEXING: '' })).toBe(false);
    expect(indexingDisabled({ SITE_INDEXING: 'on' })).toBe(false);
    expect(indexingDisabled({ SITE_INDEXING: 'false' })).toBe(false);
    expect(indexingDisabled({ SITE_INDEXING: 'off' })).toBe(true);
    expect(indexingDisabled({ SITE_INDEXING: 'OFF' })).toBe(true);
  });

  it('noindex pages still let crawlers follow links', () => {
    expect(robotsContent({ noindex: true })).toBe('noindex, follow');
    expect(robotsContent({ noindex: false })).toBeNull();
  });
});

describe('titles and canonical URLs', () => {
  it('suffixes the brand and keeps the legacy homepage title', () => {
    expect(pageTitle('İletişim')).toBe('İletişim | Eyfa Yapı');
    expect(pageTitle()).toBe('Eyfa Yapı | İnşaat & Gayrimenkul Projeleri');
  });

  it('builds absolute, trailing-slash canonicals', () => {
    const site = 'https://eyfayapi.net';
    expect(canonicalUrl('/iletisim', site)).toBe('https://eyfayapi.net/iletisim/');
    expect(canonicalUrl('/projeler/proje-06/', site)).toBe(
      'https://eyfayapi.net/projeler/proje-06/',
    );
    expect(canonicalUrl('/', site)).toBe('https://eyfayapi.net/');
  });
});

describe('JSON-LD serialisation', () => {
  it('cannot be closed early by data containing </script>', () => {
    const out = jsonLdString({ name: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</script');
    expect(JSON.parse(out)).toEqual({ name: '</script><script>alert(1)</script>' });
  });
});

describe('sharing images', () => {
  const publicSrcs = new Set([
    ...publicImages().map((i) => i.src),
    homeHero.src,
    ...Object.values(aboutImages).map((i) => i.src),
    ...Object.values(serviceFeatureImages).map((i) => i.src),
  ]);

  it('are 1200×630', () => {
    expect([OG_WIDTH, OG_HEIGHT]).toEqual([1200, 630]);
  });

  it('use only registered photographs the site already shows publicly', () => {
    for (const [key, entry] of Object.entries(ogImages)) {
      if (!entry.photo) continue;
      expect(hasLegacyImage(entry.photo.src), key).toBe(true);
      expect(publicSrcs.has(entry.photo.src), `${key}: ${entry.photo.src}`).toBe(true);
    }
  });

  it('never use a floor plan or drawing as a photo backdrop', () => {
    const drawings = new Set(
      publicImages()
        .filter((i) => i.kind === 'floor-plan')
        .map((i) => i.src),
    );
    for (const entry of Object.values(ogImages)) {
      if (entry.photo) expect(drawings.has(entry.photo.src)).toBe(false);
    }
  });

  it('exist for every public project and the main pages', () => {
    for (const key of ['home', 'about', 'services', 'projects', 'contact']) {
      expect(ogImages[key], key).toBeDefined();
    }
    for (const project of publicProjects()) expect(ogImages[project.slug]).toBeDefined();
  });

  it('share one file for logo-only entries and describe the image', () => {
    expect(ogImagePath('contact')).toBe('/og/default.jpg');
    expect(ogImagePath('home')).toBe('/og/home.jpg');
    expect(ogAlt('contact')).toBe('Eyfa Yapı logosu');
    expect(ogAlt('home')).toMatch(/^Eyfa Yapı logosu ve fotoğraf: /);
  });
});
