/**
 * Corporate copy (Stage 5): editorial rewrites must stay grounded in the
 * legacy text — no new facts, numbers, credentials or biography details.
 */
import { describe, expect, it } from 'vitest';
import { activities, publicActivities } from '@/data/activities';
import { about, aboutImages, serviceFeatureImages, type CopyBlock } from '@/data/corporate';
import { publicImages } from '@/data/projects';
import { services } from '@/data/services';
import { hasLegacyImage } from '@/lib/media';
import { normaliseText, readRoot } from './helpers';

const legacy = ['about.html', 'index.html', 'faaliyet.html']
  .map((f) => normaliseText(readRoot(f)))
  .join(' ');

/** Every CopyBlock in the about module, found recursively. */
function blocks(value: unknown, out: CopyBlock[] = []): CopyBlock[] {
  if (value && typeof value === 'object') {
    if ('provenance' in value && 'text' in value && 'basis' in value) out.push(value as CopyBlock);
    else for (const v of Object.values(value)) blocks(v, out);
  }
  return out;
}

const allBlocks = blocks(about);
const numbers = (s: string) => s.match(/\d+/g) ?? [];

/** Vocabulary that would signal an unverified credential, award or metric. */
const BANNED =
  /(ödül|sertifika|\bISO\b|belgeli|lider\b|en büyük|en iyi|garanti|anahtar teslim|%|yıllık deneyim|binlerce|yüzlerce|\d+\s*(proje|daire|konut|m²|metrekare|yıl))/i;

/** Founder-biography details that must not be republished without confirmation. */
const BIOGRAPHY =
  /(44 yaşında|sosyoloji|gümüşhane|kelkit|üç çocuk|evli|müsiad|ahisiad|6\. dönem|GSG)/i;

describe('about copy provenance', () => {
  it('finds the expected number of copy blocks', () => {
    expect(allBlocks.length).toBeGreaterThanOrEqual(12);
  });

  it.each(allBlocks.map((b) => [b.text.slice(0, 48), b]))('%s…', (_, block) => {
    expect(block.basis.length).toBeGreaterThan(0);
    for (const excerpt of block.basis) expect(legacy).toContain(excerpt);

    // No number that the basis does not already contain.
    const basisNumbers = new Set(block.basis.flatMap(numbers));
    for (const n of numbers(block.text)) expect(basisNumbers.has(n), `number ${n}`).toBe(true);

    // No credential/award/metric vocabulary unless the basis has it verbatim.
    const hit = block.text.match(BANNED)?.[0];
    if (hit) expect(block.basis.join(' ').toLowerCase()).toContain(hit.toLowerCase());

    expect(block.text).not.toMatch(BIOGRAPHY);
  });

  it('the only date in the story is the verified founding year', () => {
    expect(about.story.founded).toBe(2004);
    expect(legacy).toContain('2004 yılında Fatih Yılmaz tarafından İstanbul’da kurulmuş');
  });

  it('the banned-vocabulary rule catches invented claims (self-check)', () => {
    for (const claim of [
      'ISO 9001 sertifikalı',
      '500 daire teslim ettik',
      'sektörün lider firması',
      '%100 müşteri memnuniyeti',
      'anahtar teslim projeler',
    ]) {
      expect(claim).toMatch(BANNED);
    }
  });
});

describe('services', () => {
  it('keeps the homepage/footer anchor ids', () => {
    expect(services.map((s) => s.id)).toEqual(['muteahhitlik', 'mimarlik', 'muhendislik', 'emlak']);
  });

  it('editorial service descriptions add no numbers or credentials', () => {
    for (const s of services.filter((x) => x.provenance === 'editorial')) {
      expect(numbers(s.description)).toEqual([]);
      expect(s.description).not.toMatch(BANNED);
    }
  });

  it('each service has its own registered, public photograph', () => {
    const srcs = services.map((s) => serviceFeatureImages[s.id].src);
    expect(new Set(srcs).size).toBe(srcs.length);
    const publicSrcs = new Set(publicImages().map((i) => i.src));
    for (const src of srcs) {
      expect(hasLegacyImage(src), src).toBe(true);
      expect(publicSrcs.has(src), `${src} must be a public curated photo`).toBe(true);
    }
  });
});

describe('about imagery', () => {
  it('uses registered, public, non-drawing photographs', () => {
    const publicPhotos = new Set(
      publicImages()
        .filter((i) => i.kind !== 'floor-plan')
        .map((i) => i.src),
    );
    for (const { src } of Object.values(aboutImages)) expect(publicPhotos.has(src), src).toBe(true);
  });
});

describe('activities attribution', () => {
  it('shows only clearly attributable activities (none since owner decision C2)', () => {
    // SUGİAD is the founder's personal membership (owner, 2026-11-11): never public.
    expect(publicActivities()).toEqual([]);
    expect(activities.find((a) => a.id === 'sugiad')?.visibility).toBe('withheld');
  });

  it('withheld items and images explain why', () => {
    for (const a of activities) {
      if (a.visibility === 'withheld') expect(a.withheldReason?.length).toBeGreaterThan(10);
      if (!a.imagePublic) {
        expect(a.imageWithheldReason?.length).toBeGreaterThan(10);
        expect(hasLegacyImage(a.image)).toBe(false);
      }
    }
  });

  it('no activity claims a date that is not verified', () => {
    for (const a of activities) expect(a.date.status).not.toBe('VERIFIED');
  });
});
