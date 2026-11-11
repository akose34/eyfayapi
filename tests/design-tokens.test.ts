import { describe, expect, it } from 'vitest';
import { readRoot } from './helpers';

const css = readRoot('src/styles/global.css');

/** Resolves a --color-* token to hex, following var(--color-x) aliases. */
const token = (name: string): string => {
  const match = css.match(new RegExp(`--color-${name}:\\s*([^;]+);`));
  const value = match?.[1]?.trim();
  if (!value) throw new Error(`token --color-${name} not found`);
  const alias = value.match(/^var\(--color-([a-z0-9-]+)\)/);
  if (alias?.[1]) return token(alias[1]);
  if (!/^#[0-9a-fA-F]{6}/.test(value))
    throw new Error(`token --color-${name} is not hex: ${value}`);
  return value.slice(0, 7);
};

/** Reads a token value inside the `.tone-dark { … }` block. */
const darkToken = (name: string): string => {
  const block = css.slice(
    css.indexOf('.tone-dark {'),
    css.indexOf('}', css.indexOf('.tone-dark {')),
  );
  const value = block.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1]?.trim();
  if (!value) throw new Error(`dark token --color-${name} not found`);
  const alias = value.match(/^var\(--color-([a-z0-9-]+)\)/);
  return alias?.[1] ? token(alias[1]) : value.slice(0, 7);
};

const luminance = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

describe('design tokens', () => {
  it('keeps the approved brand colours', () => {
    expect(token('charcoal').toUpperCase()).toBe('#151C1E');
    expect(token('champagne').toUpperCase()).toBe('#C5A46D');
    expect(token('ivory').toUpperCase()).toBe('#F5F2EB');
    expect(token('white').toUpperCase()).toBe('#FFFFFF');
  });

  // WCAG 2.2 AA: 4.5:1 for body text, 3:1 for large text and UI components.
  const pairs: [string, string, number][] = [
    ['charcoal', 'ivory', 4.5],
    ['charcoal', 'white', 4.5],
    ['ink-muted', 'ivory', 4.5],
    ['ink-muted', 'ivory-200', 4.5],
    ['ink-inverse-muted', 'charcoal', 4.5],
    ['champagne', 'charcoal', 4.5],
    ['champagne-700', 'ivory', 4.5],
    ['champagne-700', 'ivory-200', 4.5],
    ['champagne-700', 'white', 4.5],
    ['charcoal', 'champagne', 4.5], // primary button label
    ['champagne', 'ivory', 1], // decorative only — documented, never text
    // Stage 2 — non-text contrast (WCAG 1.4.11, 3:1): focus ring and meaningful outlines
    ['focus', 'ivory', 3], // light-tone focus ring = champagne-700
    ['focus', 'ivory-200', 3],
    ['focus', 'white', 3],
    ['line-strong', 'ivory', 3],
    ['champagne', 'charcoal-800', 3], // dark-tone focus ring on raised dark surfaces
  ];

  for (const [fg, bg, min] of pairs) {
    it(`${fg} on ${bg} ≥ ${min}:1`, () => {
      expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(min);
    });
  }

  describe('dark tone (.tone-dark) semantic tokens', () => {
    const bg = () => darkToken('surface');
    const darkPairs: [string, number][] = [
      ['ink', 4.5],
      ['ink-muted', 4.5],
      ['accent-text', 4.5],
      ['focus', 3],
      ['line-strong', 3],
    ];
    for (const [fg, min] of darkPairs) {
      it(`${fg} on dark surface ≥ ${min}:1`, () => {
        expect(contrast(darkToken(fg), bg())).toBeGreaterThanOrEqual(min);
      });
    }
  });
});
