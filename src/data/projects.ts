import type {
  ExcludedImage,
  Project,
  ProjectCuration,
  ProjectImage,
  ProjectMediaKind,
} from '@/types/content';

/**
 * Project portfolio.
 *
 * IMPORTANT: The legacy projeler.html shows 11 image galleries WITHOUT any
 * project names, descriptions, locations or dates. Nothing below may be shown
 * publicly as fact until the owner confirms it. Names are UNKNOWN; leads found
 * in the photographs themselves are recorded as NEEDS_CONFIRMATION with the
 * exact evidence.
 *
 * `gallery` mirrors projeler.html exactly (tests/content.test.ts). `curation`
 * is the Stage 4 editorial selection for the public portfolio — every legacy
 * image is either shown or excluded with a reason (docs/PROJECT_MEDIA_REVIEW.md).
 *
 * Slugs are provisional ("proje-01" …) and will be replaced by name-based
 * slugs once names are confirmed.
 */

const ALT: Record<ProjectMediaKind, string> = {
  photo: 'Eyfa Yapı projesinden fotoğraf',
  aerial: 'Konut binasının havadan görünümü',
  construction: 'İnşaat sürecinden fotoğraf',
  render: 'Proje cephe görselleştirmesi',
  'floor-plan': 'Proje kat planı çizimi',
};

const imgs = (kind: ProjectMediaKind, files: readonly string[]): ProjectImage[] =>
  files.map((file) => ({ src: `projects-img/${file}`, kind, alt: ALT[kind] }));

const range = (from: number, to: number, ext = 'webp'): string[] =>
  Array.from({ length: to - from + 1 }, (_, i) => `${from + i}.${ext}`);

const series = (code: string, from: number, to: number): string[] =>
  Array.from({ length: to - from + 1 }, (_, i) => `${code}-${from + i}.webp`);

const p = (file: string) => `projects-img/${file}`;
const dup = (file: string, of: string): ExcludedImage => ({
  src: p(file),
  reason: 'near-duplicate',
  note: `Aynı açı/an: ${of} gösteriliyor`,
});

const unknown = { status: 'UNKNOWN', value: null } as const;

type Extra = Partial<
  Pick<
    Project,
    'name' | 'type' | 'location' | 'status' | 'completionYear' | 'fileCode' | 'description'
  >
> & {
  ownerQuestions?: string[];
  visibility?: Project['visibility'];
  withheldReason?: string;
};

function project(
  legacyOrder: number,
  gallery: ProjectImage[],
  curation: ProjectCuration,
  extra: Extra = {},
): Project {
  const bySrc = (src: string) => {
    const image = gallery.find((g) => g.src === src);
    if (!image) throw new Error(`Project ${legacyOrder}: ${src} is not in its legacy gallery`);
    const alt = curation.alt?.[src];
    return alt ? { ...image, alt } : image;
  };
  const coverSrc = curation.hero ?? curation.plans[0] ?? gallery[0]?.src;
  if (!coverSrc) throw new Error(`Project ${legacyOrder} has no images`);
  return {
    slug: `proje-${String(legacyOrder).padStart(2, '0')}`,
    legacyOrder,
    visibility: extra.visibility ?? 'public',
    ...(extra.withheldReason ? { withheldReason: extra.withheldReason } : {}),
    name: extra.name ?? unknown,
    type: extra.type ?? unknown,
    description: extra.description ?? unknown,
    location: extra.location ?? unknown,
    status: extra.status ?? unknown,
    completionYear: extra.completionYear ?? unknown,
    fileCode: extra.fileCode ?? unknown,
    related: [],
    gallery,
    curation,
    cover: bySrc(coverSrc),
    ownerQuestions: [
      'Proje adı nedir?',
      'Konumu (ilçe / mahalle) yayınlanabilir mi?',
      'Durumu: tamamlandı mı, devam mı ediyor?',
      'Teslim yılı, blok/daire sayısı gibi yayınlanabilir bilgiler var mı?',
      ...(extra.ownerQuestions ?? []),
    ],
  };
}

const parcel = (code: string, files: string, note?: string) =>
  ({
    status: 'NEEDS_CONFIRMATION',
    value: code,
    source: `dosya adı: projects-img/${files}`,
    note: note ?? 'Dosya önekinin ada/parsel numarası olduğu tahmin ediliyor.',
  }) as const;

export const projects: readonly Project[] = [
  project(
    1,
    [...imgs('construction', ['31.webp', '32.webp', '35.webp', '33.webp', '34.webp'])],
    {
      hero: p('31.webp'),
      photos: [p('33.webp'), p('32.webp'), p('35.webp'), p('34.webp')],
      plans: [],
      excluded: [],
      alt: {
        [p('31.webp')]: 'İnşaat alanının havadan görünümü; temel ve kaba inşaat aşaması',
        [p('32.webp')]: 'Kaba inşaat aşamasındaki tuğla dolgulu betonarme bina',
        [p('33.webp')]: 'İskele ile çevrili, cephe çalışmaları süren bina',
        [p('35.webp')]: 'Kaba inşaat aşamasında bina iç mekânı',
        [p('34.webp')]: 'Şantiye girişinde EYFA YAPI panosu ve inşaat demirleri',
      },
    },
    {
      name: {
        status: 'NEEDS_CONFIRMATION',
        value: 'Ferah Evler',
        source: 'projects-img/34.webp',
        note: 'Şantiye panosunda "Ferah Evler" yazısı ve EYFA YAPI logosu görünüyor.',
      },
      status: {
        status: 'NEEDS_CONFIRMATION',
        value: 'under-construction',
        source: 'projects-img/32.webp, 33.webp, 35.webp',
        note: 'Fotoğraflar kaba inşaat aşamasını gösteriyor; güncel durum bilinmiyor.',
      },
      location: {
        status: 'NEEDS_CONFIRMATION',
        value: 'Sultanbeyli, İstanbul',
        source: 'projects-img/34.webp',
        note: 'Şantiyede Sultanbeyli Belediyesi tabelası ve "HAYAT" sokak levhası görünüyor.',
      },
      ownerQuestions: [
        '7795_4 kodlu planlarda "FERAH CADDE" ve "HAYAT CADDE" yazıyor. Bu planlar aynı projeye mi ait?',
      ],
    },
  ),
  project(2, imgs('aerial', ['7.webp', '8.webp', '9.webp']), {
    hero: p('7.webp'),
    photos: [p('9.webp')],
    plans: [],
    excluded: [dup('8.webp', '7.webp')],
    alt: {
      [p('7.webp')]: 'Turuncu cephe detaylı, çok katlı konut binasının havadan görünümü',
      [p('9.webp')]: 'Konut binası ve çevresinin yukarıdan görünümü',
    },
  }),
  project(
    3,
    imgs('construction', range(10, 14)),
    {
      hero: p('14.webp'),
      photos: [p('10.webp'), p('12.webp'), p('13.webp')],
      plans: [],
      excluded: [dup('11.webp', '12.webp')],
      alt: {
        [p('14.webp')]: 'İskele kurulu, kaba inşaat aşamasındaki çok katlı bina',
        [p('10.webp')]: 'İnşaat süren binanın yukarıdan cephe görünümü',
        [p('12.webp')]: 'İnşaat süren binanın havadan görünümü',
        [p('13.webp')]: 'İnşaat alanı ve çevre yapıların havadan görünümü',
      },
    },
    {
      ownerQuestions: ['Fotoğraflar kaba inşaat aşamasını gösteriyor. Proje tamamlandı mı?'],
    },
  ),
  project(
    4,
    imgs('aerial', range(15, 20)),
    {
      hero: p('19.webp'),
      photos: [p('15.webp'), p('18.webp'), p('17.webp'), p('20.webp')],
      plans: [],
      excluded: [dup('16.webp', '15.webp')],
      alt: {
        [p('19.webp')]:
          'Çatısında EYFA yazısı bulunan, sarı cephe şeritli konut binası; arkasında şehir ve tepeler',
        [p('15.webp')]: 'Yeşil çatılı, sarı cephe şeritli konut binası ve çevresindeki yollar',
        [p('18.webp')]: 'Yeşil çatılı konut binasının yukarıdan görünümü',
        [p('17.webp')]: 'Yeşil çatılı konut binası ve komşu yapılar',
        [p('20.webp')]: 'Yeşil çatılı konut binasının mahalle dokusu içindeki görünümü',
      },
    },
    {
      ownerQuestions: [
        'Bu galeri ile 6. galeri (23–30) aynı binayı mı gösteriyor? İkisinde de yeşil çatı ve sarı cephe şeritleri var; çatı tabelaları farklı ("≡EYFA" ve "EYFA YAPI").',
      ],
    },
  ),
  project(5, imgs('aerial', range(21, 22)), {
    hero: p('21.webp'),
    photos: [p('22.webp')],
    plans: [],
    excluded: [],
    alt: {
      [p('21.webp')]: 'Kahverengi çatılı konut binasının havadan görünümü',
      [p('22.webp')]: 'Konut binası ve yeşil alanın havadan görünümü',
    },
  }),
  project(
    6,
    imgs('aerial', range(23, 30)),
    {
      hero: p('27.webp'),
      photos: [p('24.webp'), p('23.webp'), p('26.webp'), p('25.webp'), p('28.webp')],
      plans: [],
      excluded: [dup('29.webp', '25.webp'), dup('30.webp', '26.webp')],
      alt: {
        [p('27.webp')]: 'Çatı katında EYFA YAPI yazısı bulunan, sarı cephe şeritli konut binası',
        [p('24.webp')]: 'Zemin katında dükkânlar bulunan konut binasının ön cephesi',
        [p('23.webp')]: 'Konut binası, şehir dokusu ve uzaktaki tepeler',
        [p('26.webp')]: 'Köşe parseldeki konut binasının havadan görünümü',
        [p('25.webp')]: 'Yeşil çatılı konut binası ve çevresindeki ağaçlar',
        [p('28.webp')]: 'Konut binası ve önündeki caddenin havadan görünümü',
      },
    },
    {
      ownerQuestions: [
        'img/ klasöründeki Eyfa-yapi-resim*.png havadan fotoğrafları bu projeye mi, 4. galeriye mi ait?',
      ],
    },
  ),
  project(
    7,
    imgs('floor-plan', series('7109_4', 1, 6)),
    { hero: null, photos: [], plans: series('7109_4', 1, 6).map(p), excluded: [] },
    { fileCode: parcel('7109/4', '7109_4-*.webp') },
  ),
  project(
    8,
    imgs('floor-plan', series('6078_11', 2, 8)),
    {
      hero: null,
      photos: [],
      plans: [],
      excluded: series('6078_11', 2, 8).map((file) => ({
        src: p(file),
        reason: 'educational-watermark' as const,
        note: '"PRODUCED BY AN AUTODESK EDUCATIONAL PRODUCT" filigranı',
      })),
    },
    {
      visibility: 'withheld',
      withheldReason:
        'Tüm çizimlerde Autodesk eğitim lisansı filigranı var; ticari yayın hakkı belirsiz.',
      fileCode: parcel('6078/11', '6078_11-*.webp'),
      ownerQuestions: [
        'Planlarda "PRODUCED BY AN AUTODESK EDUCATIONAL PRODUCT" filigranı var. Yayın için filigransız çizim var mı?',
        'Kullanılmayan 6078_11-1.webp cephe görselinde "YEKFA YAPI" ve "YILMAZ İNŞAAT" tabelaları var. Bu görsel yayınlanabilir mi?',
      ],
    },
  ),
  project(
    9,
    imgs('floor-plan', series('158_8', 1, 3)),
    { hero: null, photos: [], plans: series('158_8', 1, 3).map(p), excluded: [] },
    { fileCode: parcel('158/8', '158_8-*.webp') },
  ),
  project(
    10,
    imgs('floor-plan', series('7795_4', 1, 7)),
    { hero: null, photos: [], plans: series('7795_4', 1, 7).map(p), excluded: [] },
    {
      fileCode: parcel(
        '7795/4',
        '7795_4-*.webp',
        'Vaziyet planlarında "FERAH CADDE" ve "HAYAT CADDE" yazıyor.',
      ),
    },
  ),
  project(
    11,
    [...imgs('render', ['1.webp']), ...imgs('floor-plan', range(2, 6))],
    {
      hero: null,
      photos: [],
      // Order: residential floors first, then the ground-floor shop plans.
      plans: [p('3.webp'), p('6.webp'), p('2.webp'), p('4.webp'), p('5.webp')],
      excluded: [
        {
          src: p('1.webp'),
          reason: 'third-party-branding',
          note: 'Görselde THERMOsiding logosu ve web adresi var',
        },
      ],
      alt: {
        [p('3.webp')]: 'Mobilyalı, renklendirilmiş normal kat planı',
        [p('6.webp')]: 'Mobilyalı, renklendirilmiş normal kat planı (varyant)',
        [p('2.webp')]: 'Teraslı çatı katı planı',
        [p('4.webp')]: 'Zemin kat dükkân ve depo planı',
        [p('5.webp')]: 'Zemin kat dükkân planı',
      },
    },
    {
      ownerQuestions: [
        '1.webp cephe görselinde üçüncü taraf "THERMOsiding" logosu ve web adresi var. Yayınlanabilir mi?',
        '4.webp ve 5.webp planlarında "DÜKKAN" (ticari birim) yazıyor. Proje karma kullanımlı mı?',
      ],
    },
  ),
];

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

/** Label shown in the UI for a project whose name is not yet confirmed. */
export const projectDisplayName = (p: Project): string =>
  p.name.status === 'VERIFIED' ? p.name.value : `Proje ${String(p.legacyOrder).padStart(2, '0')}`;

/** Projects shown in listings, the homepage and the sitemap. */
export const publicProjects = (): Project[] => projects.filter((p) => p.visibility === 'public');

/**
 * Portfolio order (editorial): photographed projects first — completed-looking
 * blocks, then construction stories — then drawing-only projects.
 */
export const PORTFOLIO_ORDER = [
  'proje-06',
  'proje-02',
  'proje-05',
  // 04 is kept a row away from 06: they may show the same building (open question).
  'proje-04',
  'proje-03',
  'proje-01',
  'proje-11',
  'proje-10',
  'proje-07',
  'proje-09',
] as const;

export const portfolio = (): Project[] =>
  PORTFOLIO_ORDER.map((slug) => getProjectBySlug(slug)).filter(
    (p): p is Project => !!p && p.visibility === 'public',
  );

const resolve = (project: Project, src: string): ProjectImage => {
  const image = project.gallery.find((g) => g.src === src);
  if (!image) throw new Error(`${src} not in ${project.slug}`);
  const alt = project.curation.alt?.[src];
  return alt ? { ...image, alt } : image;
};

/** Hero + photos, in display order (resolved images with curated alt text). */
export const projectPhotos = (project: Project): ProjectImage[] =>
  [project.curation.hero, ...project.curation.photos]
    .filter((s): s is string => !!s)
    .map((s) => resolve(project, s));

export const projectPlans = (project: Project): ProjectImage[] =>
  project.curation.plans.map((s) => resolve(project, s));

/** Every image the public UI may show (used by crop/rights tests). */
export const publicImages = (): ProjectImage[] =>
  publicProjects().flatMap((project) => [...projectPhotos(project), ...projectPlans(project)]);

/** True when the photographs show work in progress (never claim completion). */
export const showsConstruction = (project: Project): boolean =>
  projectPhotos(project).some((image) => image.kind === 'construction');

/**
 * "Diğer projelerimiz": confirmed relations first (none yet), then the next
 * public projects in portfolio order — never presented as "similar".
 */
export function otherProjects(project: Project, count = 3): Project[] {
  const list = portfolio();
  const related = project.related
    .map((slug) => getProjectBySlug(slug))
    .filter((p): p is Project => !!p && p.visibility === 'public');
  const index = list.findIndex((p) => p.slug === project.slug);
  const rotated = [...list.slice(index + 1), ...list.slice(0, Math.max(index, 0))];
  const withPhotos = rotated.filter((p) => p.curation.hero);
  return [...related, ...withPhotos]
    .filter((p, i, arr) => p.slug !== project.slug && arr.indexOf(p) === i)
    .slice(0, count);
}
