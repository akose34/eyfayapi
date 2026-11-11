export const SITE_NAME = 'Eyfa Yapı';
/** Title of the legacy homepage, kept as the default title. */
export const DEFAULT_TITLE = 'Eyfa Yapı | İnşaat & Gayrimenkul Projeleri';

/** "Projelerimiz" → "Projelerimiz | Eyfa Yapı"; no argument → default title. */
export const pageTitle = (title?: string): string =>
  title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

/** Absolute canonical URL for a pathname, always with a trailing slash for pages. */
export function canonicalUrl(pathname: string, site: URL | string): string {
  const withSlash =
    /\.[a-z0-9]+$/i.test(pathname) || pathname.endsWith('/') ? pathname : `${pathname}/`;
  return new URL(withSlash, site).toString();
}
