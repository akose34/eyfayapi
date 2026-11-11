import type { Activity } from '@/types/content';

/**
 * Corporate activities (legacy faaliyet.html, text verbatim).
 *
 * Stage 5 attribution review (docs/STAGE_5_REPORT.md §4):
 * - SUGİAD: the membership statement is published in the company's own voice
 *   → shown. Its photo is an award ceremony ("SUGİAD En İyiler Ödül Töreni
 *   2024") honouring a third-party artist; showing it would imply an award to
 *   Eyfa Yapı → image withheld.
 * - Tiyatro Gecesi: the poster is a Sultanbeyli Belediyesi event (mayor's
 *   branding) directed by the founder, matching about.html's description of
 *   the founder's own theatre group (GSG) — this contradicts the legacy
 *   caption "çalışanlarımızla … organize ettiğimiz". Attribution unclear →
 *   activity withheld until the owner confirms.
 */
export const activities: readonly Activity[] = [
  {
    id: 'sugiad',
    title: 'SUGİAD Üyeliği',
    description: 'SUGİAD ile iş dünyasına katkı sağlıyor, sektörel iş birliklerine önem veriyoruz.',
    visibility: 'public',
    date: { status: 'UNKNOWN', value: null },
    image: 'Faaliyetler-img/sugiad-resim.webp',
    alt: 'SUGİAD ödül töreninden fotoğraf',
    imagePublic: false,
    imageWithheldReason:
      'Ödül töreni fotoğrafı üçüncü kişiye verilen bir ödülü gösteriyor; Eyfa Yapı’ya ödül verilmiş izlenimi yaratır.',
  },
  {
    id: 'tiyatro',
    title: 'Tiyatro Gecesi',
    description:
      'Çalışanlarımızla kültürel bağ kurmak için organize ettiğimiz yıllık tiyatro etkinliği.',
    visibility: 'withheld',
    withheldReason:
      'Afiş Sultanbeyli Belediyesi etkinliğini ve kurucunun kendi tiyatro topluluğunu gösteriyor; "çalışan etkinliği" açıklamasıyla çelişiyor.',
    date: { status: 'UNKNOWN', value: null },
    image: 'Faaliyetler-img/tiyatro_resim.webp',
    alt: '“Fetih İstanbul” tiyatro gösterimi afişi',
    imagePublic: false,
    imageWithheldReason: 'Belediye markası ve üçüncü kişilerin adları içeren afiş.',
  },
];

export const publicActivities = () => activities.filter((a) => a.visibility === 'public');
