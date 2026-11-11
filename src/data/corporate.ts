import type { Provenance } from '@/types/content';

/**
 * Corporate copy for /hakkimizda/ (Stage 5).
 *
 * The legacy about.html is one long paragraph mixing company history,
 * self-praise ("köklü", "başarıyla tamamlanmıştır", "öne çıkmıştır") and a
 * time-sensitive founder biography. This module restructures it into short,
 * readable blocks:
 *
 *   provenance 'legacy'    → verbatim legacy sentence
 *   provenance 'editorial' → rewrite for clarity; `basis` holds the VERBATIM
 *                            legacy excerpts it is built from
 *
 * tests/corporate.test.ts enforces: every basis excerpt exists in the legacy
 * pages; editorial text contains no number absent from its basis; no
 * credential/award/metric vocabulary; no founder-biography details.
 */

export interface CopyBlock {
  text: string;
  provenance: Provenance;
  basis: readonly string[];
}

const editorial = (text: string, basis: string[]): CopyBlock => ({
  text,
  provenance: 'editorial',
  basis,
});

export const about = {
  hero: {
    eyebrow: 'Hakkımızda · 2004’ten bu yana',
    title: editorial('Güvenli yapılar, huzurlu yaşam alanları.', [
      'depreme dayanıklı, kaliteli, güvenli ve huzurlu yaşam alanları inşa etmeyi temel ilke edinmiştir',
    ]),
    lead: editorial(
      '2004 yılında İstanbul’da kurulan EYFA Yapı, konut ve taahhüt projeleri alanında faaliyet gösteren bir inşaat firmasıdır.',
      [
        'EYFA Yapı, 2004 yılında Fatih Yılmaz tarafından İstanbul’da kurulmuş, konut ve taahhüt projeleri alanında faaliyet gösteren köklü bir inşaat firmasıdır.',
      ],
    ),
  },

  introduction: {
    statement: editorial('İnsan hayatını önceleyen bir yaklaşımla inşa ediyoruz.', [
      'Firma, insan hayatını önceleyen bir yaklaşımla;',
    ]),
    paragraphs: [
      editorial(
        'EYFA Yapı, 2004 yılında Fatih Yılmaz tarafından İstanbul’da kuruldu. Kuruluşundan bu yana başta Sultanbeyli, Pendik, Kartal ve Çekmeköy olmak üzere İstanbul’un birçok bölgesinde projeler hayata geçirdi.',
        [
          'EYFA Yapı, 2004 yılında Fatih Yılmaz tarafından İstanbul’da kurulmuş',
          'Kuruluşundan bu yana İstanbul’un başta Sultanbeyli, Pendik, Kartal ve Çekmeköy ilçeleri olmak üzere birçok farklı bölgesinde projeler hayata geçirmiştir.',
        ],
      ),
      editorial(
        'Firmanın temel ilkesi; depreme dayanıklı, kaliteli, güvenli ve huzurlu yaşam alanları inşa etmektir.',
        [
          'depreme dayanıklı, kaliteli, güvenli ve huzurlu yaşam alanları inşa etmeyi temel ilke edinmiştir',
        ],
      ),
    ],
  },

  story: {
    /** The only verified date in the company history. */
    founded: 2004,
    lead: editorial(
      'Konut inşaatı ana faaliyet alanımızdır. Bunun yanı sıra kamu ve özel sektör için farklı ölçeklerde projeler yürüttük.',
      [
        'Ana faaliyet alanı olan konut inşaatlarının yanı sıra',
        'gibi birçok farklı kamu ve özel sektör projesi başarıyla tamamlanmıştır.',
      ],
    ),
    closing: editorial(
      'Kalite odaklı bir iş anlayışıyla EYFA Yapı; projelerinde estetik, fonksiyonellik ve güvenliği bir arada sunmayı amaçlar.',
      [
        'EYFA Yapı; güçlü mühendislik altyapısı, deneyimli kadrosu ve kalite odaklı iş anlayışıyla, projelerinde estetik, fonksiyonellik ve güvenliği bir arada sunmaktadır.',
      ],
    ),
  },

  mission: editorial(
    'Depreme dayanıklı, kaliteli ve estetik yapılar inşa ederek müşterilerimizin güvenle yaşayabileceği huzurlu yaşam alanları üretmek. Her projede kalite, güven ve müşteri memnuniyetini önceliğimiz olarak benimsiyoruz.',
    [
      'EYFA Yapı olarak, depreme dayanıklı, kaliteli ve estetik yapılar inşa ederek, müşterilerimizin güvenle yaşayabileceği huzurlu yaşam alanları üretmeyi hedefliyoruz.',
      'kalite, güven ve müşteri memnuniyetini önceliğimiz olarak benimsiyoruz.',
    ],
  ),

  vision: editorial(
    'Türkiye’nin en saygın ve güvenilir inşaat firmalarından biri olmak; güven, kalite ve estetikten ödün vermeden kalıcı eserler bırakmak.',
    [
      'Türkiye’nin en saygın ve güvenilir inşaat firmalarından biri olmak;',
      'güven, kalite ve estetikten ödün vermeden kalıcı eserler bırakmak',
    ],
  ),

  /** Approach themes — each line is a short rewrite of one verified sentence. */
  approach: [
    {
      title: 'Önce insan',
      body: editorial(
        'Her yapıyı, içinde yaşayacak insanların güvenliğini önceleyerek tasarlar ve inşa ederiz.',
        ['Firma, insan hayatını önceleyen bir yaklaşımla;'],
      ),
    },
    {
      title: 'Depreme dayanıklılık',
      body: editorial('Depreme dayanıklı, kaliteli ve güvenli yapılar temel ilkemizdir.', [
        'depreme dayanıklı, kaliteli, güvenli ve huzurlu yaşam alanları inşa etmeyi temel ilke edinmiştir',
      ]),
    },
    {
      title: 'Kalite odaklı çalışma',
      body: editorial('Kalite odaklı bir iş anlayışıyla çalışırız.', [
        'kalite odaklı iş anlayışıyla',
      ]),
    },
    {
      title: 'Estetik ve işlev',
      body: editorial('Projelerimizde estetik, fonksiyonellik ve güvenliği bir arada ele alırız.', [
        'projelerinde estetik, fonksiyonellik ve güvenliği bir arada sunmaktadır',
      ]),
    },
  ],
} as const;

/** About-page imagery (authentic, public, non-withheld project photographs). */
export const aboutImages = {
  hero: {
    src: 'projects-img/23.webp',
    alt: 'Konut binası, şehir dokusu ve uzaktaki tepeler',
    position: '50% 55%',
  },
  storyFrame: {
    src: 'projects-img/32.webp',
    alt: 'Kaba inşaat aşamasındaki tuğla dolgulu betonarme bina',
  },
  storyFinished: {
    src: 'projects-img/15.webp',
    alt: 'Yeşil çatılı, sarı cephe şeritli konut binası ve çevresindeki yollar',
  },
  projects: {
    src: 'projects-img/28.webp',
    alt: 'Konut binası ve önündeki caddenin havadan görünümü',
    position: '50% 45%',
  },
} as const;

/** Services-page imagery: one distinct authentic photo per service. */
export const serviceFeatureImages = {
  muteahhitlik: {
    src: 'projects-img/33.webp',
    alt: 'İskele ile çevrili, cephe çalışmaları süren bina',
  },
  mimarlik: {
    src: 'projects-img/24.webp',
    alt: 'Zemin katında dükkânlar bulunan konut binasının ön cephesi',
  },
  muhendislik: {
    src: 'projects-img/14.webp',
    alt: 'İskele kurulu, kaba inşaat aşamasındaki çok katlı bina',
  },
  emlak: {
    src: 'projects-img/26.webp',
    alt: 'Köşe parseldeki konut binasının havadan görünümü',
  },
} as const;
