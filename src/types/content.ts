/**
 * Typed content model for the Eyfa Yapı website.
 *
 * Every value in src/data/ must come from the existing website or from the
 * owner. Anything that could not be verified is represented explicitly with
 * the Unverified wrapper below instead of an invented value.
 */

/** Marker used for any value that is not yet known or confirmed by the owner. */
export type ConfirmationStatus = 'VERIFIED' | 'NEEDS_CONFIRMATION' | 'UNKNOWN';

/**
 * A value together with its verification status and source.
 * - VERIFIED: present verbatim on the existing public website.
 * - NEEDS_CONFIRMATION: a lead exists (e.g. text visible in a photo) but the
 *   owner must confirm before it is shown publicly.
 * - UNKNOWN: no information available.
 */
export type Unverified<T> =
  | { status: 'VERIFIED'; value: T; source: string }
  | { status: 'NEEDS_CONFIRMATION'; value: T; source: string; note?: string }
  | { status: 'UNKNOWN'; value: null; note?: string };

export interface PostalAddress {
  street: string;
  postalCode: string;
  district: string;
  city: string;
  country: string;
}

export interface CompanyInfo {
  /** Short brand name used in titles and the logo alt text. */
  brandName: string;
  /** Registered trade name exactly as it appears in the legacy footer. */
  legalName: string;
  foundedYear: Unverified<number>;
  founder: Unverified<string>;
  phones: readonly PhoneNumber[];
  whatsapp: PhoneNumber;
  email: string;
  address: PostalAddress;
  social: readonly SocialLink[];
  /** Google Maps embed URL from the legacy footer. */
  mapEmbedUrl: string;
}

export interface PhoneNumber {
  /** Human readable form, as shown on the legacy site. */
  display: string;
  /** E.164 form without spaces, e.g. +905326868829. */
  e164: string;
  kind: 'mobile' | 'landline';
}

export interface SocialLink {
  platform: 'instagram';
  handle: string;
  url: string;
}

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Where a piece of public copy comes from (Stage 5).
 * - `legacy`: verbatim on the legacy site.
 * - `editorial`: a rewrite for clarity; `basis` lists the VERBATIM legacy
 *   excerpts it is built from. It may not add facts, numbers or credentials
 *   (enforced by tests/corporate.test.ts).
 */
export type Provenance = 'legacy' | 'editorial';

export interface Service {
  id: 'muteahhitlik' | 'mimarlik' | 'muhendislik' | 'emlak';
  title: string;
  description: string;
  provenance: Provenance;
  /** Verbatim legacy excerpts supporting an editorial service/description. */
  basis?: readonly string[];
  /** Path of the legacy icon, relative to the repository root. */
  legacyIcon?: string;
}

export type ProjectMediaKind = 'photo' | 'aerial' | 'construction' | 'render' | 'floor-plan';

export interface ProjectImage {
  /** Path relative to the repository root, e.g. "projects-img/7.webp". */
  src: string;
  kind: ProjectMediaKind;
  /** Turkish alt text. Descriptive only; never claims a project name. */
  alt: string;
}

export type ProjectStatus = 'completed' | 'under-construction' | 'planned';

/** Why a legacy image is not shown in the public UI (kept in the repo, recoverable). */
export type ExclusionReason =
  | 'near-duplicate' // same angle/moment as a shown image
  | 'third-party-branding' // visible logo/URL of another company
  | 'educational-watermark' // "PRODUCED BY AN AUTODESK EDUCATIONAL PRODUCT"
  | 'other-company-signage'; // building signage naming another company

export interface ExcludedImage {
  src: string;
  reason: ExclusionReason;
  /** Which shown image it duplicates, or what branding is visible. */
  note: string;
}

/**
 * Editorial selection for the public portfolio. Every path must come from the
 * project's legacy `gallery`; hero + photos + plans + excluded must account
 * for every legacy image exactly once (tests/projects.test.ts).
 */
export interface ProjectCuration {
  /** Wide photograph for the detail-page hero and cards; null for drawing-only projects. */
  hero: string | null;
  /** Additional photographs, in display order. */
  photos: readonly string[];
  /** Plan drawings, shown uncropped (`object-fit: contain`). */
  plans: readonly string[];
  excluded: readonly ExcludedImage[];
  /** Per-image alt text overrides (descriptive only, never names/claims). */
  alt?: Readonly<Record<string, string>>;
}

export interface Project {
  /** Stable provisional identifier used for routing until names are confirmed. */
  slug: string;
  /** Order in which the gallery appeared on the legacy projeler.html. */
  legacyOrder: number;
  /**
   * `withheld`: no publishable media (rights unclear) — excluded from listings,
   * homepage and sitemap; its route redirects to /projeler/.
   */
  visibility: 'public' | 'withheld';
  withheldReason?: string;
  name: Unverified<string>;
  /** e.g. "Konut", "Karma kullanım" — only when confirmed. */
  type: Unverified<string>;
  description: Unverified<string>;
  location: Unverified<string>;
  status: Unverified<ProjectStatus>;
  completionYear: Unverified<number>;
  /** Ada/parsel-like code inferred from image file names (e.g. "7109_4"). */
  fileCode: Unverified<string>;
  /** Slugs of projects with a CONFIRMED relationship (e.g. same development). */
  related: readonly string[];
  /** Legacy gallery exactly as on projeler.html (source of truth, all files). */
  gallery: readonly ProjectImage[];
  curation: ProjectCuration;
  /** Image used for cards and social previews (curation hero or first plan). */
  cover: ProjectImage;
  /** Free-form notes for the owner confirmation checklist. */
  ownerQuestions: readonly string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  /** `withheld`: attribution or rights unclear — not shown publicly. */
  visibility: 'public' | 'withheld';
  withheldReason?: string;
  /** Verified date (ISO) — none known yet. */
  date: Unverified<string>;
  image: string;
  alt: string;
  /** Whether the image may be published (independent of the text). */
  imagePublic: boolean;
  imageWithheldReason?: string;
}

export interface LegacyRedirect {
  /** Legacy path served by the current site, e.g. "/projeler.html". */
  from: string;
  /** New canonical path, e.g. "/projeler/". */
  to: string;
}
