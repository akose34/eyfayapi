import type { Service } from '@/types/content';

/** Services exactly as listed on the legacy homepage ("Hizmetlerimiz"). */
export const services = [
  {
    id: 'mimarlik',
    title: 'Mimarlık',
    description: 'Uzman mimarlarla birlikte estetik ve işlevsel yapılar tasarlıyoruz.',
    legacyIcon: 'logos/mimarlik-logo.png',
  },
  {
    id: 'muhendislik',
    title: 'Mühendislik',
    description: 'Alanında yetkin mühendislerle sağlam ve güvenli yapılar inşa ediyoruz.',
    legacyIcon: 'logos/muhendislik-logo.png',
  },
  {
    id: 'emlak',
    title: 'Emlak',
    description: 'Doğru projeleri, doğru yatırımcılarla buluşturuyoruz.',
    // Unicode-normalisation collision — see docs/PROJECT_AUDIT.md §6.
    legacyIcon: 'logos/emlakçi-logo.png',
  },
] as const satisfies readonly Service[];
