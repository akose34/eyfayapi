import type { Service } from '@/types/content';

/**
 * Homepage curation (Stage 3). Editorial choices only — which authentic image
 * goes where and which galleries are shown first. Nothing here is a company
 * fact; selection is based on photographic quality (docs/STAGE_3_REPORT.md §3).
 * Every path must exist in src/lib/media.ts; tests/home.test.ts enforces that
 * featured images belong to their own project's gallery.
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
  { slug: 'proje-01', image: 'projects-img/31.webp' },
] as const;

/** One authentic image per verified service (MEDIA_INVENTORY §7). */
export const serviceImages: Record<Service['id'], { src: string; alt: string }> = {
  mimarlik: { src: 'projects-img/7795_4-7.webp', alt: 'Renklendirilmiş kat planı çizimi' },
  muhendislik: {
    src: 'projects-img/32.webp',
    alt: 'Kaba inşaat aşamasındaki betonarme karkas bina',
  },
  emlak: { src: 'projects-img/24.webp', alt: 'Tamamlanmış konut binasının ön cephesi' },
};
