/**
 * Pre-launch published copy (src/data/published-copy.ts): restrained rewrites of
 * legacy sentences. Same grounding rules as the About copy — every basis excerpt
 * is verbatim legacy text, no new numbers, and none of the removed claims.
 */
import { describe, expect, it } from 'vitest';
import { publishedBlocks, publishedCopy } from '@/data/published-copy';
import { legacyCopy } from '@/data/company';
import { normaliseText, readRoot } from './helpers';

const legacy = ['index.html', 'about.html', 'projeler.html', 'faaliyet.html']
  .map((f) => normaliseText(readRoot(f)))
  .join(' ');

/** Claims removed before launch; they must not come back in published copy. */
const REMOVED_CLAIMS =
  /(güçlü|deneyimli|uzman|yetkin|başarıyla|öne çıkmış|köklü|güvenilir çözüm|ödül|sertifika|garanti|lider|en iyi)/i;

const numbers = (s: string) => s.match(/\d+/g) ?? [];

describe('published copy', () => {
  it.each(publishedBlocks().map((b) => [b.text.slice(0, 48), b]))('%s…', (_, block) => {
    expect(block.basis.length).toBeGreaterThan(0);
    for (const excerpt of block.basis) expect(legacy).toContain(normaliseText(excerpt));
    const basisNumbers = new Set(block.basis.flatMap(numbers));
    for (const n of numbers(block.text)) expect(basisNumbers.has(n), `number ${n}`).toBe(true);
    expect(block.text).not.toMatch(REMOVED_CLAIMS);
  });

  it('the removed-claims rule catches the legacy wording it replaces (self-check)', () => {
    expect(legacyCopy.homeIntro).toMatch(REMOVED_CLAIMS);
    expect(legacyCopy.projectsIntro).toMatch(REMOVED_CLAIMS);
    expect(legacyCopy.metaDescription).toMatch(REMOVED_CLAIMS);
    expect(legacyCopy.principles.map((p) => p.text).join(' ')).toMatch(REMOVED_CLAIMS);
  });

  it('keeps the three principles in the legacy order', () => {
    expect(publishedCopy.principles).toHaveLength(legacyCopy.principles.length);
    expect(publishedCopy.principles[0]?.body.text).toBe(legacyCopy.principles[0]?.text);
  });
});
