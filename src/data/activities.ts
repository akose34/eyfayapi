import type { Activity } from '@/types/content';

/** Corporate activities exactly as listed on legacy faaliyet.html. */
export const activities = [
  {
    id: 'sugiad',
    title: 'SUGİAD Üyeliği',
    description: 'SUGİAD ile iş dünyasına katkı sağlıyor, sektörel iş birliklerine önem veriyoruz.',
    image: 'Faaliyetler-img/sugiad-resim.webp',
    alt: 'SUGİAD ödül töreninde plaket takdimi',
  },
  {
    id: 'tiyatro',
    title: 'Tiyatro Gecesi',
    description:
      'Çalışanlarımızla kültürel bağ kurmak için organize ettiğimiz yıllık tiyatro etkinliği.',
    image: 'Faaliyetler-img/tiyatro_resim.webp',
    alt: '“Fetih İstanbul” tiyatro gösterimi afişi',
  },
] as const satisfies readonly Activity[];
