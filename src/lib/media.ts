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
    // Homepage hero + default social preview image.
    '/img/Eyfa-yapi-resim17.png',
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
