/**
 * Project registry & curation (Stage 4).
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { featuredProjects } from '@/data/home';
import {
  PORTFOLIO_ORDER,
  otherProjects,
  portfolio,
  projectPhotos,
  projectPlans,
  projects,
  publicImages,
  publicProjects,
  showsConstruction,
} from '@/data/projects';
import { hasLegacyImage } from '@/lib/media';

const withheldManifest = (
  JSON.parse(readFileSync(new URL('../src/data/withheld-media.json', import.meta.url), 'utf8')) as {
    files: string[];
  }
).files;

describe('curation accounts for every legacy image', () => {
  it.each(projects.map((p) => [p.slug, p]))('%s', (_, project) => {
    const { hero, photos, plans, excluded, alt } = project.curation;
    const shown = [...(hero ? [hero] : []), ...photos, ...plans];
    const all = [...shown, ...excluded.map((e) => e.src)];
    // Exactly once each, and nothing outside the legacy gallery.
    expect(new Set(all).size).toBe(all.length);
    expect([...all].sort()).toEqual(project.gallery.map((g) => g.src).sort());

    const kind = (src: string) => project.gallery.find((g) => g.src === src)?.kind;
    for (const src of [...(hero ? [hero] : []), ...photos])
      expect(kind(src)).not.toBe('floor-plan');
    for (const src of plans) expect(kind(src)).toBe('floor-plan');
    for (const e of excluded) expect(e.note.length).toBeGreaterThan(5);
    for (const src of Object.keys(alt ?? {})) expect(shown).toContain(src);
  });
});

describe('rights and publication', () => {
  it('withholds every educational-watermark drawing and the THERMOsiding render', () => {
    const excluded = projects.flatMap((p) => p.curation.excluded);
    const reason = (src: string) => excluded.find((e) => e.src === src)?.reason;
    for (let n = 2; n <= 8; n++) {
      expect(reason(`projects-img/6078_11-${n}.webp`)).toBe('educational-watermark');
    }
    expect(reason('projects-img/1.webp')).toBe('third-party-branding');
  });

  it('withheld projects expose nothing and explain why', () => {
    for (const p of projects.filter((x) => x.visibility === 'withheld')) {
      expect(p.withheldReason?.length).toBeGreaterThan(10);
      expect(projectPhotos(p)).toEqual([]);
      expect(projectPlans(p)).toEqual([]);
      expect(portfolio()).not.toContain(p);
      expect(featuredProjects.map((f) => f.slug)).not.toContain(p.slug);
    }
  });

  it('the withheld-media manifest matches the registry exclusions', () => {
    const excluded = projects.flatMap((p) => p.curation.excluded.map((e) => e.src));
    const extra = [
      ...Array.from({ length: 6 }, (_, i) => `projects-img/184_1-${i + 1}.webp`),
      'projects-img/6078_11-1.webp',
    ];
    expect([...withheldManifest].sort()).toEqual([...excluded, ...extra].sort());
  });

  it('withheld media is not registered for the build (cannot reach dist/)', () => {
    for (const src of withheldManifest) expect(hasLegacyImage(src), src).toBe(false);
  });

  it('every publicly shown image is registered', () => {
    for (const image of publicImages()) expect(hasLegacyImage(image.src), image.src).toBe(true);
  });
});

describe('no unsupported project facts', () => {
  it('no project fact is marked VERIFIED without owner confirmation', () => {
    // Nothing has been confirmed yet (docs/CONTENT_INVENTORY.md §4). When the
    // owner confirms a fact, update this expectation together with the data.
    for (const p of projects) {
      for (const fact of [p.name, p.type, p.description, p.location, p.status, p.completionYear]) {
        expect(fact.status).not.toBe('VERIFIED');
      }
    }
  });

  it('relations are empty unless confirmed', () => {
    for (const p of projects) expect(p.related).toEqual([]);
  });

  it('construction photographs are labelled, never shown as completed', () => {
    const construction = publicProjects()
      .filter(showsConstruction)
      .map((p) => p.slug)
      .sort();
    expect(construction).toEqual(['proje-01', 'proje-03']);
  });
});

describe('portfolio composition', () => {
  it('lists every public project exactly once', () => {
    expect([...PORTFOLIO_ORDER].sort()).toEqual(
      publicProjects()
        .map((p) => p.slug)
        .sort(),
    );
    expect(portfolio()).toHaveLength(publicProjects().length);
  });

  it('"Diğer projelerimiz" shows other public, photographed projects only', () => {
    for (const p of publicProjects()) {
      const others = otherProjects(p, 3);
      expect(others.length).toBeLessThanOrEqual(3);
      for (const o of others) {
        expect(o.slug).not.toBe(p.slug);
        expect(o.visibility).toBe('public');
        expect(o.curation.hero).not.toBeNull();
      }
    }
  });

  it('homepage features curated public photos of public projects', () => {
    for (const { slug, image } of featuredProjects) {
      const p = portfolio().find((x) => x.slug === slug);
      if (!p) throw new Error(`${slug} is not in the public portfolio`);
      expect(projectPhotos(p).map((i) => i.src)).toContain(image);
    }
  });
});
