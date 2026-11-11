/**
 * robots.txt (Stage 7). Production default: crawl everything, point to the
 * sitemap. A staging build (SITE_INDEXING=off) disallows everything instead —
 * see docs/SEO_AUDIT.md. robots.txt is a crawl hint, not access control:
 * nothing private is ever published (withheld media never reaches dist/).
 */
import type { APIRoute } from 'astro';
import { indexingDisabled } from '@/lib/seo';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://eyfayapi.net');
  const body = indexingDisabled()
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', origin).toString()}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
