# Content Inventory

Every piece of meaningful text on the legacy site, with its source and verification status.
The typed source of truth is `src/data/`. `tests/content.test.ts` fails the build if company facts
or copy drift from the legacy HTML.

Status values:

- **VERIFIED**: published verbatim on the current public site.
- **NEEDS_CONFIRMATION**: there is a lead (for example text visible inside a photo), but the owner
  must confirm it before publication.
- **UNKNOWN**: no information exists anywhere in the repository.

---

## 1. Company facts

| Field                                                        | Value                                                                                                                                      | Source        | Status                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ------------------------------------------------------ |
| Brand                                                        | Eyfa Yapı (also written "EYFA Yapı")                                                                                                       | all pages     | VERIFIED                                               |
| Legal name                                                   | EYFA MÜTEAHHİTLİK YAPI İNŞAAT SAN. TİC. LTD. ŞTİ.                                                                                          | footer        | VERIFIED                                               |
| Founded                                                      | 2004, İstanbul                                                                                                                             | about.html    | VERIFIED                                               |
| Founder                                                      | Fatih Yılmaz                                                                                                                               | about.html    | VERIFIED                                               |
| Mobile / WhatsApp                                            | 0 (532) 686 88 29 → `+905326868829`, `https://wa.me/905326868829`                                                                          | footer, nav   | VERIFIED                                               |
| Landline                                                     | 0 216 419 57 81 → `+902164195781`                                                                                                          | footer        | VERIFIED                                               |
| E-mail                                                       | info@eyfayapi.net                                                                                                                          | footer, nav   | VERIFIED                                               |
| Address                                                      | Abdurrahmangazi Mahallesi Dağıstan Sokak No: 4/14 34920 Sultanbeyli/İstanbul                                                               | footer        | VERIFIED                                               |
| Instagram                                                    | @eyfa.yapi, https://www.instagram.com/eyfa.yapi/                                                                                           | footer, nav   | VERIFIED                                               |
| Map                                                          | Google Maps embed for the place "EYFA YAPI" (40.9703, 29.2597)                                                                             | footer iframe | VERIFIED                                               |
| Districts active in                                          | Sultanbeyli, Pendik, Kartal, Çekmeköy "and many others"                                                                                    | about.html    | VERIFIED                                               |
| Other work types                                             | Metro stations and Telekom buildings in İstanbul; Türk Telekom store rebuilds and renovations across Türkiye; road and bridge construction | about.html    | VERIFIED (as wording). Specific project names: UNKNOWN |
| Tax number, MERSİS, trade registry                           | —                                                                                                                                          | —             | UNKNOWN                                                |
| Opening hours                                                | —                                                                                                                                          | —             | UNKNOWN                                                |
| LinkedIn / Facebook / YouTube                                | —                                                                                                                                          | —             | UNKNOWN                                                |
| Certifications, awards, metrics (m², units delivered, staff) | —                                                                                                                                          | —             | UNKNOWN. **Do not invent**                             |

## 2. Page copy (verbatim, Turkish)

| Key (`src/data/company.ts`)                                        | Where on legacy site                         |
| ------------------------------------------------------------------ | -------------------------------------------- |
| `legacyCopy.homeHeadline`: "Eyfa Yapı ile Geleceği İnşa Ediyoruz." | index.html hero                              |
| `legacyCopy.homeIntro`                                             | index.html hero                              |
| `legacyCopy.projectsIntro`                                         | index.html "Projelerimiz" block              |
| `legacyCopy.metaDescription`                                       | index.html `<meta name="description">`       |
| `legacyCopy.aboutCompany*`                                         | about.html, first part                       |
| `legacyCopy.mission` ("Misyonumuz…")                               | about.html                                   |
| `legacyCopy.vision` ("Vizyonumuz…")                                | about.html                                   |
| Founder biography                                                  | about.html (**not migrated**, see checklist) |

### Services (`src/data/services.ts`)

| Service     | Description (verbatim)                                                 | Legacy icon                             |
| ----------- | ---------------------------------------------------------------------- | --------------------------------------- |
| Mimarlık    | Uzman mimarlarla birlikte estetik ve işlevsel yapılar tasarlıyoruz.    | `logos/mimarlik-logo.png`               |
| Mühendislik | Alanında yetkin mühendislerle sağlam ve güvenli yapılar inşa ediyoruz. | `logos/muhendislik-logo.png`            |
| Emlak       | Doğru projeleri, doğru yatırımcılarla buluşturuyoruz.                  | `logos/emlakçi-logo.png` (see audit §6) |

Note: the hero copy mentions "müteahhitlik" (contracting), but there is no contracting service card.
The owner should confirm whether "Müteahhitlik / Taahhüt" becomes a fourth service.

### Corporate activities (`src/data/activities.ts`)

| Title          | Description (verbatim)                                                                 | Image                                |
| -------------- | -------------------------------------------------------------------------------------- | ------------------------------------ |
| SUGİAD Üyeliği | SUGİAD ile iş dünyasına katkı sağlıyor, sektörel iş birliklerine önem veriyoruz.       | `Faaliyetler-img/sugiad-resim.webp`  |
| Tiyatro Gecesi | Çalışanlarımızla kültürel bağ kurmak için organize ettiğimiz yıllık tiyatro etkinliği. | `Faaliyetler-img/tiyatro_resim.webp` |

Founder memberships listed in about.html: SUGİAD 6th-term presidency, MÜSİAD membership,
AHİSİAD board membership, founder of the Girişimci Sanat Gönüllüleri (GSG) theatre group
(6 plays). These are VERIFIED as published text but personal, so they need confirmation before reuse.

## 3. Projects

The legacy `projeler.html` contains **11 untitled image galleries and no text at all**. Names,
locations, dates and descriptions are therefore UNKNOWN unless a photo itself carries evidence.
Provisional slugs `proje-01` … `proje-11` follow the legacy order. Project detail pages are
`noindex` and excluded from the sitemap until confirmed.

| #   | Provisional slug | Images (legacy order) | Type                                 | Name                                  | Location                                                                   | Status                                 | Evidence / notes                                                                                                                                                                                                                                                            |
| --- | ---------------- | --------------------- | ------------------------------------ | ------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | proje-01         | 31, 32, 35, 33, 34    | Aerial + construction-site photos    | **"Ferah Evler"**: NEEDS_CONFIRMATION | Sultanbeyli: NEEDS_CONFIRMATION                                            | Under construction: NEEDS_CONFIRMATION | 34.webp: site hoarding reads "Ferah Evler" with the EYFA YAPI logo and both company phone numbers. A Sultanbeyli Belediyesi permit board and a "HAYAT" street sign are visible                                                                                              |
| 2   | proje-02         | 7, 8, 9               | Aerial photos                        | UNKNOWN                               | UNKNOWN                                                                    | UNKNOWN                                | Completed mid-rise residential block with dark/grey façade and orange accents                                                                                                                                                                                               |
| 3   | proje-03         | 10–14                 | Aerial photos                        | UNKNOWN                               | UNKNOWN                                                                    | UNKNOWN                                | 14.webp shows the structural frame with scaffolding. Other frames show a finished roof                                                                                                                                                                                      |
| 4   | proje-04         | 15–20                 | Aerial photos                        | UNKNOWN                               | UNKNOWN                                                                    | UNKNOWN                                | Green roof, yellow façade stripes. Possibly the same building as #6                                                                                                                                                                                                         |
| 5   | proje-05         | 21, 22                | Aerial photos                        | UNKNOWN                               | UNKNOWN                                                                    | UNKNOWN                                | —                                                                                                                                                                                                                                                                           |
| 6   | proje-06         | 23–30                 | Aerial photos                        | UNKNOWN                               | UNKNOWN                                                                    | UNKNOWN                                | "EYFA YAPI" lettering on the roof (26, 27, 30). Same building family as `img/Eyfa-yapi-resim*.png`                                                                                                                                                                          |
| 7   | proje-07         | 7109_4-1…6            | Floor plans                          | UNKNOWN                               | UNKNOWN                                                                    | UNKNOWN                                | Prefix looks like ada 7109 / parsel 4: NEEDS_CONFIRMATION. JPG twins in `slider-photos/`                                                                                                                                                                                    |
| 8   | proje-08         | 6078_11-2…8           | Floor plans                          | UNKNOWN                               | UNKNOWN                                                                    | UNKNOWN                                | Ada 6078 / parsel 11 (?). **Autodesk educational watermark.** Unused render 6078_11-1 shows "YEKFA YAPI" / "YILMAZ İNŞAAT"                                                                                                                                                  |
| 9   | proje-09         | 158_8-1…3             | Floor plans                          | UNKNOWN                               | UNKNOWN                                                                    | UNKNOWN                                | Ada 158 / parsel 8 (?)                                                                                                                                                                                                                                                      |
| 10  | proje-10         | 7795_4-1…7            | Site and floor plans                 | UNKNOWN                               | UNKNOWN                                                                    | UNKNOWN                                | Ada 7795 / parsel 4 (?). The site plan names "FERAH CADDE" and "HAYAT CADDE", which may be the same project as #1                                                                                                                                                           |
| 11  | proje-11         | 1, 2–6                | 1 façade render + colour floor plans | UNKNOWN                               | UNKNOWN                                                                    | UNKNOWN                                | Render carries a THERMOsiding watermark. Plans 4 and 5 show "DÜKKAN" (shops), so possibly mixed-use                                                                                                                                                                         |
| —   | (not on site)    | 184_1-1…6             | Floor plans + unit schedule          | UNKNOWN                               | Drawing says "NECİP FAZIL MAHALLESİ 184/1 (666.00 m²)": NEEDS_CONFIRMATION | UNKNOWN                                | ARTRIA Mimarlık and GOKTUG Mimarlık (Sultanbeyli) branding. The unit schedule (184_1-2) shows 15 independent units: 3 on the ground floor (60 m²) and 12 on floors 1–4 (95 m²), plus 60 m² roof-duplex and basement areas and a shelter. **Not published and not imported** |

Project attributes that are currently UNKNOWN for every project: name, address, start and
completion year, number of blocks, floors, units, m², unit types, current sale status and
architect/engineer credits.

---

## 4. Owner confirmation checklist

Please answer or approve each item. Nothing marked here will be published as fact until it is
confirmed in writing.

### Company

- [ ] Is the legal name still exactly "EYFA MÜTEAHHİTLİK YAPI İNŞAAT SAN. TİC. LTD. ŞTİ."?
- [ ] Are both phone numbers current? Is 0 (532) 686 88 29 the right WhatsApp business number?
- [ ] Is the address (Dağıstan Sokak No: 4/14, 34920 Sultanbeyli) current and the right one to publish?
- [ ] Opening hours to publish (optional)?
- [ ] Other social accounts (LinkedIn, YouTube, Facebook)?
- [ ] Should "Müteahhitlik / Taahhüt" become its own service next to Mimarlık, Mühendislik, Emlak?
- [ ] May we name public-sector work (metro stations, Türk Telekom stores, roads/bridges)? If so,
      which project names and years?
- [ ] Any certifications, memberships or figures (years, units, m²) you want shown? Please provide
      the source; we will not estimate.

### Founder biography (about.html)

- [ ] Current wording. The legacy text says "44 yaşında" and "4. sınıf öğrencisi", which are
      time-sensitive.
- [ ] May we publish hometown, marital status and number of children?
- [ ] Current roles: SUGİAD (6th-term president), MÜSİAD, AHİSİAD board. Still correct?
- [ ] May `img/boss-photo.jpg` be reused? Do you have a higher-resolution portrait (current: 1080×1080)?

### Activities

- [ ] Theatre: is it an employee event (faaliyet.html) or the founder's GSG theatre group
      (about.html), or both?
- [ ] Photo credits and permission for the people shown in `sugiad-resim.webp` (award ceremony).

### Projects (per gallery)

For each of galleries 1–11 and the unpublished 184/1 set:

- [ ] Project name
- [ ] District / neighbourhood that may be published
- [ ] Status (completed / under construction / planned) and year
- [ ] Basic facts you are happy to publish (blocks, floors, units, unit types)
- [ ] Short description (2–3 sentences)

Specific questions:

- [ ] Gallery 1: is the project "Ferah Evler"? Are galleries 1 and 10 (FERAH / HAYAT CADDE) the same project?
- [ ] Galleries 4 and 6: same building?
- [ ] Do the `img/Eyfa-yapi-resim*.png` aerial photos belong to gallery 6?
- [ ] Do file prefixes such as 7109_4 mean ada/parsel? May they be published?
- [ ] Gallery 8 drawings carry an Autodesk **educational** watermark. Can you supply commercially
      licensed exports?
- [ ] Gallery 11 render has a THERMOsiding logo. Do we have permission, or is there a clean version?
- [ ] 184/1 (Necip Fazıl Mah.) drawings with ARTRIA / GOKTUG branding: publish, and with what credit?
- [ ] `6078_11-1.webp` render with "YILMAZ İNŞAAT" signage: what is the relationship, and may it be published?
- [ ] `slider-photos/` duplicates: may they be archived once the new site is live?
