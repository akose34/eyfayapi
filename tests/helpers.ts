import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const readRoot = (path: string): string =>
  readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

/** Collapse whitespace / HTML entities used in the legacy markup for comparisons. */
export const normaliseText = (html: string): string =>
  html
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
