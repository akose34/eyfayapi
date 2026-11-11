import type { CompanyInfo } from '@/types/content';
import {
  DEFAULT_WHATSAPP_MESSAGE,
  mailtoHref,
  mapsDirectionsHref,
  projectEnquiryMessage,
  telHref,
  whatsappHref,
} from '@/lib/contact';

/**
 * Company facts. Every VERIFIED value below is copied verbatim from the legacy
 * website (footer, navigation dropdown, about.html). Do not add facts that are
 * not on the legacy site or confirmed in writing by the owner.
 * See docs/CONTENT_INVENTORY.md for sources and the confirmation checklist.
 */
export const company = {
  brandName: 'Eyfa Yapı',
  legalName: 'EYFA MÜTEAHHİTLİK YAPI İNŞAAT SAN. TİC. LTD. ŞTİ.',
  foundedYear: { status: 'VERIFIED', value: 2004, source: 'about.html' },
  founder: { status: 'VERIFIED', value: 'Fatih Yılmaz', source: 'about.html' },
  phones: [
    { display: '0 (532) 686 88 29', e164: '+905326868829', kind: 'mobile' },
    { display: '0 216 419 57 81', e164: '+902164195781', kind: 'landline' },
  ],
  whatsapp: { display: '+90 (532) 686 88 29', e164: '+905326868829', kind: 'mobile' },
  email: 'info@eyfayapi.net',
  address: {
    street: 'Abdurrahmangazi Mahallesi Dağıstan Sokak No: 4/14',
    postalCode: '34920',
    district: 'Sultanbeyli',
    city: 'İstanbul',
    country: 'TR',
  },
  social: [
    { platform: 'instagram', handle: '@eyfa.yapi', url: 'https://www.instagram.com/eyfa.yapi/' },
  ],
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3012.509946218092!2d29.259706500000004!3d40.9703132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cad06bcaa04bf7%3A0xa4978ffad8f26023!2sEYFA%20YAPI!5e0!3m2!1str!2str!4v1751462853057!5m2!1str!2str',
} as const satisfies CompanyInfo;

/** Corporate copy taken verbatim from the legacy website. */
export const legacyCopy = {
  homeHeadline: 'Eyfa Yapı ile Geleceği İnşa Ediyoruz.',
  homeIntro:
    'Mimarlık, mühendislik ve müteahhitlik alanlarında güçlü birikimimizle, modern ve güvenli yapılar inşa ediyoruz. Her projede kalite, estetik ve müşteri memnuniyetini ön planda tutarak, hayallerinizi gerçeğe dönüştürüyoruz.',
  projectsIntro:
    "Konut projelerinden ticari yapılara, altyapı çalışmalarından kentsel dönüşüm projelerine kadar geniş bir yelpazede hizmet veriyoruz. İşte Eyfa Yapı'nın başarıyla tamamladığı ve sürdürdüğü projelerden bazıları.",
  /**
   * One-line positioning for the footer. Condensed from aboutCompany[0]
   * (about.html) without adding any fact: founding year, city and field of
   * activity are unchanged. Verified by tests/content.test.ts.
   */
  positioning:
    '2004 yılında İstanbul’da kurulan EYFA Yapı, konut ve taahhüt projeleri alanında faaliyet göstermektedir.',
  metaDescription:
    'Eyfa Yapı; inşaat, gayrimenkul ve mimari projelerde güvenilir çözümler sunar. Modern yapılar ve kaliteli yaşam alanları için bizimle iletişime geçin.',
  /** about.html — company paragraph (verbatim). */
  aboutCompany: [
    'EYFA Yapı, 2004 yılında Fatih Yılmaz tarafından İstanbul’da kurulmuş, konut ve taahhüt projeleri alanında faaliyet gösteren köklü bir inşaat firmasıdır. Kuruluşundan bu yana İstanbul’un başta Sultanbeyli, Pendik, Kartal ve Çekmeköy ilçeleri olmak üzere birçok farklı bölgesinde projeler hayata geçirmiştir. Firma, insan hayatını önceleyen bir yaklaşımla; depreme dayanıklı, kaliteli, güvenli ve huzurlu yaşam alanları inşa etmeyi temel ilke edinmiştir.',
    'Ana faaliyet alanı olan konut inşaatlarının yanı sıra:',
  ],
  aboutCompanyList: [
    'İstanbul’un çeşitli semtlerinde metro istasyonları ve Telekom binaları,',
    'Türkiye genelinde Türk Telekom mağazalarının yeni konseptlerine uygun olarak yeniden inşası ve tadilatı,',
    'Yol ve köprü inşaatları',
  ],
  aboutCompanyClosing: [
    'gibi birçok farklı kamu ve özel sektör projesi başarıyla tamamlanmıştır. EYFA Yapı; güçlü mühendislik altyapısı, deneyimli kadrosu ve kalite odaklı iş anlayışıyla, projelerinde estetik, fonksiyonellik ve güvenliği bir arada sunmaktadır. Müşteri memnuniyetini her zaman öncelik kabul eden firma, bugüne dek teslim ettiği her projede bu anlayışıyla öne çıkmıştır. Geçmişten gelen değerlerle, geleceğe güvenli yapılar inşa etmeye devam eden EYFA Yapı, şehirlerin gelişimine katkı sunarken insanların huzurla yaşayabileceği alanlar oluşturmaya kararlıdır.',
  ],
  /**
   * Founder biography (about.html). Contains time-sensitive statements
   * ("44 yaşında", "4. sınıf öğrencisi") — NEEDS_CONFIRMATION before reuse.
   */
  founderBio: {
    status: 'NEEDS_CONFIRMATION',
    source: 'about.html',
    note: 'Contains age and student status that change over time; confirm current wording with the owner.',
  },
  mission:
    'EYFA Yapı olarak, depreme dayanıklı, kaliteli ve estetik yapılar inşa ederek, müşterilerimizin güvenle yaşayabileceği huzurlu yaşam alanları üretmeyi hedefliyoruz. Faaliyet gösterdiğimiz her projede; sürdürülebilirlik, yenilikçi mühendislik çözümleri ve insan odaklı tasarım ilkeleri doğrultusunda hareket ediyor; kalite, güven ve müşteri memnuniyetini önceliğimiz olarak benimsiyoruz. Aynı zamanda topluma ve çevreye duyarlı projeler geliştirerek, bölgemizin sosyal ve ekonomik gelişimine katkıda bulunmayı misyon ediniyoruz.',
  vision:
    'Türkiye’nin en saygın ve güvenilir inşaat firmalarından biri olmak; şehirlerin geleceğine değer katan, yenilikçi ve sürdürülebilir yapıların öncüsü olmaktır. İnsana ve doğaya saygılı, modern yaşam standartlarını yansıtan projelerle sektörde liderliği hedeflerken; sosyal sorumluluk bilinciyle toplumun her kesimine dokunan yapılar inşa etmeyi amaçlıyoruz. Geleceğin şehirlerini bugünden tasarlayarak, güven, kalite ve estetikten ödün vermeden kalıcı eserler bırakmak vizyonumuzun temel taşlarıdır.',

  /**
   * Homepage (S3) — every string below is a VERBATIM excerpt of about.html
   * (tests/content.test.ts asserts each one). Short labels (`title`) are
   * navigation aids written for the layout; they summarise, never add facts.
   */
  homeIntroLead:
    'İnsan hayatını önceleyen bir yaklaşımla; depreme dayanıklı, kaliteli, güvenli ve huzurlu yaşam alanları inşa etmeyi temel ilke edinmiştir.',
  /** Districts named in about.html ("başta … olmak üzere birçok farklı bölgesinde"). */
  districts: ['Sultanbeyli', 'Pendik', 'Kartal', 'Çekmeköy'],
  /** Fields of activity named in about.html. `text` is verbatim. */
  activityAreas: [
    { title: 'Konut', text: 'Ana faaliyet alanı olan konut inşaatları' },
    {
      title: 'Kamu altyapısı',
      text: 'İstanbul’un çeşitli semtlerinde metro istasyonları ve Telekom binaları',
    },
    {
      title: 'Mağaza konseptleri',
      text: 'Türkiye genelinde Türk Telekom mağazalarının yeni konseptlerine uygun olarak yeniden inşası ve tadilatı',
    },
    { title: 'Yol ve köprü', text: 'Yol ve köprü inşaatları' },
  ],
  /** Working principles (approach section). `text` is verbatim from about.html. */
  principles: [
    {
      title: 'Güvenli yapılar',
      text: 'Depreme dayanıklı, kaliteli ve estetik yapılar inşa ederek, müşterilerimizin güvenle yaşayabileceği huzurlu yaşam alanları üretmeyi hedefliyoruz.',
    },
    {
      title: 'Mühendislik disiplini',
      text: 'Güçlü mühendislik altyapısı, deneyimli kadrosu ve kalite odaklı iş anlayışıyla, projelerinde estetik, fonksiyonellik ve güvenliği bir arada sunmaktadır.',
    },
    {
      title: 'Müşteri memnuniyeti',
      text: 'Müşteri memnuniyetini her zaman öncelik kabul eden firma, bugüne dek teslim ettiği her projede bu anlayışıyla öne çıkmıştır.',
    },
  ],
  /** Excerpt of the vision statement (about.html, "Vizyonumuz"). */
  visionQuote:
    'Geleceğin şehirlerini bugünden tasarlayarak, güven, kalite ve estetikten ödün vermeden kalıcı eserler bırakmak',
} as const;

/* ------------------------------------------------------------------------ */
/* Stage 6 — the single typed source for every contact link on the site.    */
/* Components must use these instead of building tel:/mailto:/wa.me URLs.   */
/* ------------------------------------------------------------------------ */

const { street, postalCode, district, city } = company.address;

/** One-line postal address, exactly as published (legacy footer wording). */
export const addressLine = `${street}, ${postalCode} ${district}/${city}`;

const [mobilePhone, landlinePhone] = company.phones;

export const contact = {
  mobile: { ...mobilePhone, label: 'Cep telefonu', href: telHref(mobilePhone.e164) },
  landline: { ...landlinePhone, label: 'Sabit hat', href: telHref(landlinePhone.e164) },
  email: {
    value: company.email,
    href: mailtoHref(company.email),
    /** Subject for the contact page's email action. */
    enquiryHref: mailtoHref(company.email, 'Web sitesi üzerinden bilgi talebi'),
  },
  whatsapp: {
    display: company.whatsapp.display,
    /** General enquiry with a polite default message. */
    href: whatsappHref(company.whatsapp.e164, DEFAULT_WHATSAPP_MESSAGE),
    /** Enquiry about one project, by its PUBLIC label only. */
    forProject: (publicLabel: string) =>
      whatsappHref(company.whatsapp.e164, projectEnquiryMessage(publicLabel)),
  },
  instagram: company.social[0],
  address: {
    line: addressLine,
    /** Google Maps directions (Maps URLs API — keyless, nothing loads until clicked). */
    directionsHref: mapsDirectionsHref(`${company.brandName}, ${addressLine}`),
    /** Third-party embed: loaded ONLY after an explicit click (MapConsent). */
    embedSrc: company.mapEmbedUrl,
  },
} as const;
