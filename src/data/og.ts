/**
 * Social sharing images (Stage 7).
 *
 * Each entry becomes /og/<key>.jpg (1200×630), generated at build time by
 * src/pages/og/[key].jpg.ts from:
 *   - an AUTHENTIC, PUBLIC photograph (one the page itself already shows), and
 *   - the authentic logo (logos/logo.png, trimmed, never redrawn).
 * `photo: null` renders the logo on the brand charcoal instead.
 *
 * No text is rendered into the image: titles and descriptions travel in the
 * og:/twitter: tags, so nothing in the picture can drift from the page or
 * imply an unapproved claim. tests/seo.test.ts checks that every photo is
 * public and registered.
 */
import { aboutImages, serviceFeatureImages } from './corporate';
import { homeHero } from './home';
import { portfolio, projectPhotos, publicProjects } from './projects';

export interface OgEntry {
  photo: { src: string; alt: string; position?: string } | null;
}

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** The logo alone; used for pages without a suitable photograph. */
const brand: OgEntry = { photo: null };

const [firstProject] = portfolio();
const firstPortfolioPhoto = firstProject ? projectPhotos(firstProject)[0] : undefined;
if (!firstPortfolioPhoto) throw new Error('[og] the portfolio has no photograph');

export const ogImages: Record<string, OgEntry> = {
  home: { photo: { src: homeHero.src, alt: homeHero.alt, position: '50% 40%' } },
  about: { photo: aboutImages.hero },
  services: { photo: serviceFeatureImages.muteahhitlik },
  projects: { photo: firstPortfolioPhoto },
  contact: brand,
  default: brand,
  ...Object.fromEntries(
    publicProjects().map((project) => {
      const photo = projectPhotos(project)[0];
      return [project.slug, photo ? { photo } : brand];
    }),
  ),
};

export type OgKey = keyof typeof ogImages;

/** Site-relative URL of a page's sharing image. Logo-only entries share one file. */
export const ogImagePath = (key: OgKey): string =>
  `/og/${ogImages[key]?.photo ? key : 'default'}.jpg`;

/** Entries that need their own file (every photo composition + the logo-only default). */
export const ogFiles = (): [string, OgEntry][] =>
  Object.entries(ogImages).filter(([key, entry]) => key === 'default' || entry.photo);

/** Alt text for og:image:alt / twitter:image:alt. */
export const ogAlt = (key: OgKey): string => {
  const photo = ogImages[key]?.photo;
  return photo ? `Eyfa Yapı logosu ve fotoğraf: ${photo.alt}` : 'Eyfa Yapı logosu';
};
