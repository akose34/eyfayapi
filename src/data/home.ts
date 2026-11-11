import type { Service } from '@/types/content';

/**
 * Homepage curation (Stage 3). Editorial choices only — which authentic image
 * goes where and which galleries are shown first. Nothing here is a company
 * fact; selection is based on photographic quality (docs/STAGE_3_REPORT.md §3).
 * Every path must exist in src/lib/media.ts; tests/home.test.ts enforces that
 * featured images are public, curated photos of their own project.
 */

export const homeHero = {
  /** Gallery 4 drone still: overcast sky over the hills, "EYFA" roof sign. */
  src: 'projects-img/19.webp',
  alt: 'Çatısında EYFA yazısı bulunan, sarı cephe şeritli konut binası; arkasında şehir ve tepeler',
  /** Keeps the building and its roof sign in frame on every crop. */
  position: '50% 62%',
} as const;

export const homeIntroImage = {
  /** Forested hills behind a completed block — calm, low-contrast. */
  src: 'img/Eyfa-yapi-resim12.png',
  alt: 'Ormanlık tepelerin önünde yükselen konut binaları',
  position: '30% 50%',
} as const;

export const homeClosingImage = {
  /** Wide city context — the closing contact band. */
  src: 'img/Eyfa-yapi-resim18.png',
  alt: 'Şehir dokusu içinde yeşil çatılı konut binası ve uzakta tepeler',
  position: '45% 55%',
} as const;

/**
 * Featured galleries, in display order. The first is shown large.
 * `image` must be a non-plan image from that project's gallery.
 */
export const featuredProjects = [
  { slug: 'proje-06', image: 'projects-img/27.webp' },
  { slug: 'proje-02', image: 'projects-img/7.webp' },
  // Stage 4: replaces proje-01/31.webp (busy top-down site shot); 14.webp is a
  // stronger composition and is labelled as construction on the card.
  { slug: 'proje-03', image: 'projects-img/14.webp' },
] as const;

/** One authentic image per verified service (MEDIA_INVENTORY §7). */
export const serviceImages: Record<Service['id'], { src: string; alt: string }> = {
  muteahhitlik: {
    src: 'projects-img/34.webp',
    alt: 'Şantiye girişinde EYFA YAPI panosu ve inşaat demirleri',
  },
  // Pre-launch: was a floor plan (7795_4-7), withheld for drawing rights.
  mimarlik: {
    src: 'projects-img/26.webp',
    alt: 'Köşe parseldeki konut binasının havadan görünümü',
  },
  muhendislik: {
    src: 'projects-img/32.webp',
    alt: 'Kaba inşaat aşamasındaki betonarme karkas bina',
  },
  // Alt text no longer says "tamamlanmış": completion is not confirmed.
  emlak: {
    src: 'projects-img/24.webp',
    alt: 'Zemin katında dükkânlar bulunan konut binasının ön cephesi',
  },
};
