import type { NavItem } from '@/types/content';

/**
 * Primary navigation (header, mobile menu, footer). Every href must be an
 * existing route — enforced by tests/navigation.test.ts.
 *
 * Labels are the short forms requested for Stage 2; the legacy site used
 * "Projelerimiz", "Faaliyetlerimiz" (page headings keep those forms).
 */
export const primaryNav = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hakkımızda', href: '/hakkimizda/' },
  { label: 'Projeler', href: '/projeler/' },
  { label: 'Hizmetler', href: '/hizmetler/' },
  { label: 'Faaliyetler', href: '/faaliyetlerimiz/' },
] as const satisfies readonly NavItem[];

/** The contact route is presented as the header's call-to-action button. */
export const contactNav = { label: 'İletişim', href: '/iletisim/' } as const satisfies NavItem;

/** Footer link groups. */
export const footerNav = {
  corporate: {
    title: 'Kurumsal',
    links: [
      { label: 'Hakkımızda', href: '/hakkimizda/' },
      { label: 'Faaliyetlerimiz', href: '/faaliyetlerimiz/' },
      { label: 'İletişim', href: '/iletisim/' },
    ],
  },
  work: {
    title: 'Çalışmalarımız',
    links: [
      { label: 'Projelerimiz', href: '/projeler/' },
      { label: 'Müteahhitlik', href: '/hizmetler/#muteahhitlik' },
      { label: 'Mimarlık', href: '/hizmetler/#mimarlik' },
      { label: 'Mühendislik', href: '/hizmetler/#muhendislik' },
      { label: 'Emlak', href: '/hizmetler/#emlak' },
    ],
  },
} as const satisfies Record<string, { title: string; links: readonly NavItem[] }>;

/** True when `href` is the current page or a section that contains it. */
export function isCurrentPath(href: string, pathname: string): boolean {
  const clean = href.split('#')[0] ?? href;
  if (clean === '/') return pathname === '/';
  return pathname === clean || pathname.startsWith(clean);
}
