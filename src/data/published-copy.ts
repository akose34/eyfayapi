import type { CopyBlock } from './corporate';

/**
 * Published wording for places that used to render legacy copy verbatim
 * (pre-launch cleanup, 2026-11-11).
 *
 * `legacyCopy` in src/data/company.ts stays an untouched archive of the old site
 * (tests/content.test.ts proves it is verbatim). Where that text makes claims the
 * site cannot substantiate (expertise, "başarıyla", "öne çıkmıştır", "güvenilir
 * çözümler"), the pages render these restrained versions instead. Each block
 * keeps the verbatim legacy excerpts it is built from (`basis`); the same
 * grounding rules as the About copy apply (tests/published-copy.test.ts):
 * excerpts must exist in the legacy pages, no new numbers, no claim vocabulary.
 *
 * Removing words is allowed; adding facts is not.
 */
const editorial = (text: string, basis: string[]): CopyBlock => ({
  text,
  provenance: 'editorial',
  basis,
});

export const publishedCopy = {
  /** Homepage hero lead and Services header (legacy: "…güçlü birikimimizle…"). */
  heroLead: editorial(
    'Mimarlık, mühendislik ve müteahhitlik alanlarında modern ve güvenli yapılar inşa ediyoruz.',
    [
      'Mimarlık, mühendislik ve müteahhitlik alanlarında',
      'modern ve güvenli yapılar inşa ediyoruz',
    ],
  ),

  /** Projects page lead (legacy second sentence: "…başarıyla tamamladığı…"). */
  projectsIntro: editorial(
    'Konut projelerinden ticari yapılara, altyapı çalışmalarından kentsel dönüşüm projelerine kadar geniş bir yelpazede hizmet veriyoruz. Aşağıda projelerimizden fotoğraflar yer alıyor.',
    [
      'Konut projelerinden ticari yapılara, altyapı çalışmalarından kentsel dönüşüm projelerine kadar geniş bir yelpazede hizmet veriyoruz.',
    ],
  ),

  /** Default (homepage) meta description (legacy: "…güvenilir çözümler sunar…"). */
  metaDescription: editorial(
    'Eyfa Yapı: 2004’ten bu yana İstanbul’da konut ve taahhüt projeleri. Projelerimiz, hizmetlerimiz ve iletişim bilgilerimiz.',
    [
      'EYFA Yapı, 2004 yılında Fatih Yılmaz tarafından İstanbul’da kurulmuş',
      'konut ve taahhüt projeleri',
    ],
  ),

  /** Homepage approach principles. */
  principles: [
    {
      title: 'Güvenli yapılar',
      body: editorial(
        'Depreme dayanıklı, kaliteli ve estetik yapılar inşa ederek, müşterilerimizin güvenle yaşayabileceği huzurlu yaşam alanları üretmeyi hedefliyoruz.',
        [
          'depreme dayanıklı, kaliteli ve estetik yapılar inşa ederek, müşterilerimizin güvenle yaşayabileceği huzurlu yaşam alanları üretmeyi hedefliyoruz.',
        ],
      ),
    },
    {
      // Legacy: "Güçlü mühendislik altyapısı, deneyimli kadrosu ve …"
      title: 'Kalite odaklı çalışma',
      body: editorial(
        'Kalite odaklı bir iş anlayışıyla, projelerimizde estetik, fonksiyonellik ve güvenliği bir arada sunmayı amaçlıyoruz.',
        [
          'kalite odaklı iş anlayışıyla',
          'projelerinde estetik, fonksiyonellik ve güvenliği bir arada sunmaktadır',
        ],
      ),
    },
    {
      // Legacy: "…bugüne dek teslim ettiği her projede bu anlayışıyla öne çıkmıştır."
      title: 'Müşteri memnuniyeti',
      body: editorial('Müşteri memnuniyetini her zaman öncelik kabul ederiz.', [
        'Müşteri memnuniyetini her zaman öncelik kabul eden firma',
      ]),
    },
  ],
} as const;

/** Every published block, for the grounding tests. */
export const publishedBlocks = (): CopyBlock[] => [
  publishedCopy.heroLead,
  publishedCopy.projectsIntro,
  publishedCopy.metaDescription,
  ...publishedCopy.principles.map((p) => p.body),
];
