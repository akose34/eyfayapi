import type { ImageMetadata } from 'astro';

/**
 * Build-time registry of the legacy media folders.
 *
 * Stage 1 keeps every original file in place (no renames, no moves). Astro
 * imports them from their original paths so that <Image>/<Picture> can emit
 * optimised, responsive variants into dist/_astro/ at build time.
 *
 * The glob patterns are an explicit allowlist. Astro emits the ORIGINAL file of
 * every imported image that is never transformed, so a broad glob would ship
 * unused multi-megabyte originals (e.g. the 2 MB PNGs in img/). Add a file here
 * only when a page or src/data/ actually uses it; tests/media.test.ts enforces
 * that every registered image is referenced.
 *
 * Deliberately NOT globbed: logos/emlakçi-logo.png. Git tracks it twice under
 * two Unicode normalisations (NFC and NFD); on Linux checkouts both files
 * exist, which would register duplicate keys. See docs/PROJECT_AUDIT.md §6.
 */
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  [
    // Default social preview image (BaseLayout) + Stage 3 homepage photography
    // (src/data/home.ts).
    '/img/Eyfa-yapi-resim17.png',
    '/img/Eyfa-yapi-resim12.png',
    '/img/Eyfa-yapi-resim18.png',
    // Project galleries (src/data/projects.ts). Excluded: files not shown on the
    // legacy projeler.html and pending owner review (docs/MEDIA_INVENTORY.md).
    '/projects-img/*.webp',
    '!/projects-img/184_1-*.webp',
    '!/projects-img/6078_11-1.webp',
    // Corporate activities (src/data/activities.ts).
    '/Faaliyetler-img/*.webp',
    // Brand mark (header, favicon).
    '/logos/logo.png',
  ],
  { eager: true },
);

const videoModules = import.meta.glob<string>('/mini-videos/*.mp4', {
  eager: true,
  query: '?url',
  import: 'default',
});

const normalise = (path: string): string => `/${path.replace(/^\/+/, '')}`;

/** Paths (relative to the repository root) of every registered image. */
export const registeredImagePaths = (): string[] =>
  Object.keys(imageModules).map((key) => key.slice(1));

export const hasLegacyImage = (path: string): boolean => normalise(path) in imageModules;

/**
 * Resolve a legacy image path such as "projects-img/7.webp" to Astro image
 * metadata. Throws at build time if the file does not exist, so a typo in
 * src/data/ fails the build instead of shipping a broken image.
 */
export function legacyImage(path: string): ImageMetadata {
  const mod = imageModules[normalise(path)];
  if (!mod) {
    throw new Error(
      `[media] Unknown legacy image "${path}". Check src/data/ against the media folders.`,
    );
  }
  return mod.default;
}

/** Resolve a legacy video path such as "mini-videos/logo-video.mp4" to a hashed URL. */
export function legacyVideo(path: string): string {
  const url = videoModules[normalise(path)];
  if (!url) throw new Error(`[media] Unknown legacy video "${path}".`);
  return url;
}

/**
 * Black letterbox bars baked into drone stills (exported video frames), as a
 * fraction of image height. Measured from the pixels; re-verified by
 * tests/letterbox.test.ts. MediaFrame trims them for cover-fit images so the
 * authentic files never need to be edited. Values are rounded UP slightly.
 */
const DRONE_STILL = { top: 0.09, bottom: 0.05 } as const;
const DRONE_STILLS = [
  'img/Eyfa-yapi-resim12.png',
  'img/Eyfa-yapi-resim17.png',
  'img/Eyfa-yapi-resim18.png',
  ...[
    7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    34,
  ].map((n) => `projects-img/${n}.webp`),
];

export interface Letterbox {
  top: number;
  bottom: number;
}

export const LETTERBOX: Readonly<Record<string, Letterbox>> = Object.fromEntries(
  DRONE_STILLS.map((path) => [path, DRONE_STILL]),
);

export const letterboxOf = (path: string): Letterbox | undefined =>
  LETTERBOX[path.replace(/^\/+/, '')];
