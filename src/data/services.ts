import type { Service } from '@/types/content';

/**
 * Services.
 *
 * - mimarlik / muhendislik / emlak: verbatim from the legacy homepage
 *   ("Hizmetlerimiz").
 * - muteahhitlik (Stage 5, editorial): the legacy service list omitted it, but
 *   contracting is the company's documented core activity — its registered
 *   name is "EYFA MÜTEAHHİTLİK…", the homepage names "müteahhitlik" and
 *   about.html describes a firm active in "konut ve taahhüt projeleri". Added
 *   with that verbatim basis; owner sign-off requested (CONTENT_INVENTORY §6).
 *
 * Order: core activity first, then the legacy order. Anchor ids are used by
 * the homepage index and the footer (/hizmetler/#<id>).
 */
export const services = [
  {
    id: 'muteahhitlik',
    title: 'Müteahhitlik',
    description:
      'Ana faaliyet alanımız olan konut inşaatlarının yanı sıra kamu ve özel sektör için taahhüt projeleri yürütüyoruz.',
    provenance: 'editorial',
    basis: [
      'EYFA MÜTEAHHİTLİK YAPI İNŞAAT SAN. TİC. LTD. ŞTİ.',
      'konut ve taahhüt projeleri alanında faaliyet gösteren',
      'Ana faaliyet alanı olan konut inşaatlarının yanı sıra',
      'kamu ve özel sektör projesi',
    ],
  },
  {
    id: 'mimarlik',
    title: 'Mimarlık',
    // Pre-launch: "Uzman mimarlarla birlikte" (unsupported expertise claim) removed.
    description: 'Estetik ve işlevsel yapılar tasarlıyoruz.',
    provenance: 'editorial',
    basis: ['estetik ve işlevsel yapılar tasarlıyoruz.'],
    legacyIcon: 'logos/mimarlik-logo.png',
  },
  {
    id: 'muhendislik',
    title: 'Mühendislik',
    // Pre-launch: "Alanında yetkin mühendislerle" (unsupported expertise claim) removed.
    description: 'Sağlam ve güvenli yapılar inşa ediyoruz.',
    provenance: 'editorial',
    basis: ['sağlam ve güvenli yapılar inşa ediyoruz.'],
    legacyIcon: 'logos/muhendislik-logo.png',
  },
  {
    id: 'emlak',
    title: 'Emlak',
    description: 'Doğru projeleri, doğru yatırımcılarla buluşturuyoruz.',
    provenance: 'legacy',
    // Unicode-normalisation collision — see docs/PROJECT_AUDIT.md §6.
    legacyIcon: 'logos/emlakçi-logo.png',
  },
] as const satisfies readonly Service[];
