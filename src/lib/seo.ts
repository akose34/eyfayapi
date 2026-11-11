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

/**
 * Staging switch: build with SITE_INDEXING=off to add "noindex" to every page and
 * disallow crawling in robots.txt (e.g. for a preview deployment). Any other
 * value — including unset — is the production default: indexable.
 */
export const indexingDisabled = (env: Record<string, string | undefined> = process.env): boolean =>
  (env['SITE_INDEXING'] ?? '').toLowerCase() === 'off';

/**
 * Robots meta for a page. Unconfirmed pages use "noindex, follow": kept out of
 * the index while crawlers still follow their links to the real pages.
 */
export const robotsContent = ({ noindex }: { noindex: boolean }): string | null =>
  noindex ? 'noindex, follow' : null;

/** JSON for an inline JSON-LD <script>; escapes "<" so data can never close the tag. */
export const jsonLdString = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, '\\u003c');
