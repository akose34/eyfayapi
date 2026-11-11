import type { Project, ProjectImage, ProjectMediaKind } from '@/types/content';

/**
 * Project portfolio.
 *
 * IMPORTANT: The legacy projeler.html shows 11 image galleries WITHOUT any
 * project names, descriptions, locations or dates. Nothing below may be shown
 * publicly as fact until the owner confirms it. Names are UNKNOWN; leads found
 * in the photographs themselves are recorded as NEEDS_CONFIRMATION with the
 * exact evidence. Order and image lists mirror projeler.html exactly.
 *
 * Slugs are provisional ("proje-01" …) and will be replaced by name-based
 * slugs once names are confirmed (see docs/ROADMAP.md, Stage 4).
 */

const ALT: Record<ProjectMediaKind, string> = {
  photo: 'Eyfa Yapı projesinden fotoğraf',
  aerial: 'Eyfa Yapı projesinin havadan görünümü',
  construction: 'Eyfa Yapı şantiyesinden inşaat süreci fotoğrafı',
  render: 'Proje cephe görselleştirmesi',
  'floor-plan': 'Proje kat planı çizimi',
};

const imgs = (kind: ProjectMediaKind, files: readonly string[]): ProjectImage[] =>
  files.map((file) => ({ src: `projects-img/${file}`, kind, alt: ALT[kind] }));

const range = (from: number, to: number, ext = 'webp'): string[] =>
  Array.from({ length: to - from + 1 }, (_, i) => `${from + i}.${ext}`);

const series = (code: string, from: number, to: number): string[] =>
  Array.from({ length: to - from + 1 }, (_, i) => `${code}-${from + i}.webp`);

const unknown = { status: 'UNKNOWN', value: null } as const;

function project(
  legacyOrder: number,
  gallery: ProjectImage[],
  extra: Partial<Pick<Project, 'name' | 'location' | 'status' | 'fileCode' | 'description'>> & {
    ownerQuestions?: string[];
    coverIndex?: number;
  } = {},
): Project {
  const cover = gallery[extra.coverIndex ?? 0];
  if (!cover) throw new Error(`Project ${legacyOrder} has no images`);
  return {
    slug: `proje-${String(legacyOrder).padStart(2, '0')}`,
    legacyOrder,
    name: extra.name ?? unknown,
    description: extra.description ?? unknown,
    location: extra.location ?? unknown,
    status: extra.status ?? unknown,
    fileCode: extra.fileCode ?? unknown,
    cover,
    gallery,
    ownerQuestions: [
      'Proje adı nedir?',
      'Konumu (ilçe / mahalle) yayınlanabilir mi?',
      'Durumu: tamamlandı mı, devam mı ediyor?',
      'Teslim yılı, blok/daire sayısı gibi yayınlanabilir bilgiler var mı?',
      ...(extra.ownerQuestions ?? []),
    ],
  };
}

export const projects: readonly Project[] = [
  project(
    1,
    [
      ...imgs('aerial', ['31.webp']),
      ...imgs('construction', ['32.webp', '35.webp', '33.webp', '34.webp']),
    ],
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
  project(2, imgs('aerial', ['7.webp', '8.webp', '9.webp'])),
  project(3, imgs('aerial', range(10, 14)), {
    ownerQuestions: ['14.webp kaba inşaat aşamasını gösteriyor. Proje tamamlandı mı?'],
  }),
  project(4, imgs('aerial', range(15, 20)), {
    ownerQuestions: [
      'Bu galeri ile 6. galeri (23–30) aynı binayı mı gösteriyor? İkisinde de yeşil çatı ve sarı cephe şeritleri var.',
    ],
  }),
  project(5, imgs('aerial', range(21, 22))),
  project(6, imgs('aerial', range(23, 30)), {
    ownerQuestions: [
      'Çatıda "EYFA YAPI" yazısı görünüyor. img/ klasöründeki Eyfa-yapi-resim*.png havadan fotoğrafları da bu projeye mi ait?',
    ],
  }),
  project(7, imgs('floor-plan', series('7109_4', 1, 6)), {
    fileCode: {
      status: 'NEEDS_CONFIRMATION',
      value: '7109/4',
      source: 'dosya adı: projects-img/7109_4-*.webp',
      note: 'Dosya önekinin ada/parsel numarası olduğu tahmin ediliyor.',
    },
  }),
  project(8, imgs('floor-plan', series('6078_11', 2, 8)), {
    fileCode: {
      status: 'NEEDS_CONFIRMATION',
      value: '6078/11',
      source: 'dosya adı: projects-img/6078_11-*.webp',
      note: 'Dosya önekinin ada/parsel numarası olduğu tahmin ediliyor.',
    },
    ownerQuestions: [
      'Planlarda "PRODUCED BY AN AUTODESK EDUCATIONAL PRODUCT" filigranı var. Yayın için filigransız çizim var mı?',
      'Kullanılmayan 6078_11-1.webp cephe görselinde "YEKFA YAPI" ve "YILMAZ İNŞAAT" tabelaları var. Bu görsel yayınlanabilir mi?',
    ],
  }),
  project(9, imgs('floor-plan', series('158_8', 1, 3)), {
    fileCode: {
      status: 'NEEDS_CONFIRMATION',
      value: '158/8',
      source: 'dosya adı: projects-img/158_8-*.webp',
      note: 'Dosya önekinin ada/parsel numarası olduğu tahmin ediliyor.',
    },
  }),
  project(10, imgs('floor-plan', series('7795_4', 1, 7)), {
    fileCode: {
      status: 'NEEDS_CONFIRMATION',
      value: '7795/4',
      source: 'dosya adı: projects-img/7795_4-*.webp',
      note: 'Vaziyet planlarında "FERAH CADDE" ve "HAYAT CADDE" yazıyor.',
    },
  }),
  project(11, [...imgs('render', ['1.webp']), ...imgs('floor-plan', range(2, 6))], {
    ownerQuestions: [
      '1.webp cephe görselinde üçüncü taraf "THERMOsiding" logosu ve web adresi var. Yayınlanabilir mi?',
      '4.webp ve 5.webp planlarında "DÜKKAN" (ticari birim) yazıyor. Proje karma kullanımlı mı?',
    ],
  }),
];

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

/** Label shown in the UI for a project whose name is not yet confirmed. */
export const projectDisplayName = (p: Project): string =>
  p.name.status === 'VERIFIED' ? p.name.value : `Proje ${String(p.legacyOrder).padStart(2, '0')}`;
