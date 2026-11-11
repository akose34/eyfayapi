import type { NavItem } from '@/types/content';

/**
 * Primary navigation. Labels follow the legacy menu wording
 * ("Ana Sayfa", "Projelerimiz", "Faaliyetlerimiz", "Hakkımızda", "İletişim");
 * "Hizmetlerimiz" was a homepage section on the legacy site and gets its own route.
 */
export const primaryNav = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hakkımızda', href: '/hakkimizda/' },
  { label: 'Hizmetlerimiz', href: '/hizmetler/' },
  { label: 'Projelerimiz', href: '/projeler/' },
  { label: 'Faaliyetlerimiz', href: '/faaliyetlerimiz/' },
  { label: 'İletişim', href: '/iletisim/' },
] as const satisfies readonly NavItem[];
