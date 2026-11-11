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

export interface Service {
  id: 'mimarlik' | 'muhendislik' | 'emlak';
  title: string;
  description: string;
  /** Path of the legacy icon, relative to the repository root. */
  legacyIcon: string;
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

export interface Project {
  /** Stable provisional identifier used for routing until names are confirmed. */
  slug: string;
  /** Order in which the gallery appeared on the legacy projeler.html. */
  legacyOrder: number;
  name: Unverified<string>;
  description: Unverified<string>;
  location: Unverified<string>;
  status: Unverified<ProjectStatus>;
  /** Ada/parsel-like code inferred from image file names (e.g. "7109_4"). */
  fileCode: Unverified<string>;
  cover: ProjectImage;
  gallery: readonly ProjectImage[];
  /** Free-form notes for the owner confirmation checklist. */
  ownerQuestions: readonly string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

export interface LegacyRedirect {
  /** Legacy path served by the current site, e.g. "/projeler.html". */
  from: string;
  /** New canonical path, e.g. "/projeler/". */
  to: string;
}
