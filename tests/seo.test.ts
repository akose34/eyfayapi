import { describe, expect, it } from 'vitest';
import { DEFAULT_TITLE, canonicalUrl, pageTitle } from '@/lib/seo';

describe('seo helpers', () => {
  it('keeps the legacy homepage title as default', () => {
    expect(pageTitle()).toBe(DEFAULT_TITLE);
    expect(DEFAULT_TITLE).toBe('Eyfa Yapı | İnşaat & Gayrimenkul Projeleri');
  });

  it('suffixes page titles with the brand', () => {
    expect(pageTitle('Projelerimiz')).toBe('Projelerimiz | Eyfa Yapı');
  });

  it('produces trailing-slash canonical URLs for pages only', () => {
    const site = 'https://eyfayapi.net';
    expect(canonicalUrl('/', site)).toBe('https://eyfayapi.net/');
    expect(canonicalUrl('/projeler', site)).toBe('https://eyfayapi.net/projeler/');
    expect(canonicalUrl('/projeler/', site)).toBe('https://eyfayapi.net/projeler/');
    expect(canonicalUrl('/404.html', site)).toBe('https://eyfayapi.net/404.html');
  });
});
