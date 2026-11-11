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

---

## 5. Stage 4 updates (portfolio)

- **Public presentation.** Provisional names ("Proje 01"…) stay. Visitor-facing pending warnings
  were removed; uncertainty lives in `src/data/projects.ts` (`UNKNOWN` / `NEEDS_CONFIRMATION`) and
  in this checklist.
- **New optional fields** per project: `type`, `location`, `status`, `completionYear`,
  `description`, `related`. Each renders only when `VERIFIED`. `tests/projects.test.ts` currently
  asserts that none is verified, so confirming a fact means updating data and test together.
- **Construction honesty.** Galleries 1 and 3 show only construction-phase photos. Their cards and
  pages say "İnşaat sürecinden" / "İnşaat süreci" and never imply completion.
- **Gallery 8 is withheld** (educational-watermark drawings), and `/projeler/proje-08/` redirects
  to `/projeler/`.

### Additional owner questions (Stage 4)

- [ ] Galleries 4 and 6: same building, or two buildings of the same design? Signage differs
      ("≡EYFA" logo band vs. "EYFA YAPI" lettering).
- [ ] Who drew the plans in galleries 7, 9, 10 and 11 (7109_4, 158_8, 7795_4, 2–6), and may we
      publish them?
- [ ] Gallery 8: can you provide drawings without the Autodesk educational watermark?
- [ ] Are galleries 1 and 3 completed now? If so, are there photos of the finished buildings?
- [ ] Which projects should the homepage feature? It currently shows 06, 02 and 03, chosen on
      photo quality only.

---

## 6. Stage 5 updates (corporate pages)

### Classification of corporate content

| Content                                                                                                            | Classification                                                                 | Where used                                      |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ----------------------------------------------- |
| Founding 2004, İstanbul, founder Fatih Yılmaz, "konut ve taahhüt projeleri"                                        | Verified                                                                       | About hero, intro, story                        |
| Districts (Sultanbeyli, Pendik, Kartal, Çekmeköy)                                                                  | Verified                                                                       | About intro                                     |
| Fields of work (housing, metro stations / Telekom buildings, Türk Telekom stores, roads and bridges)               | Verified (verbatim)                                                            | About story, Müteahhitlik service               |
| Mission and vision                                                                                                 | Editorial shortening of verified text                                          | About                                           |
| Approach themes (önce insan, depreme dayanıklılık, mühendislik, estetik ve işlev)                                  | Editorial, one verified sentence each                                          | About                                           |
| "Müteahhitlik" service                                                                                             | Editorial, based on the registered name, the homepage intro and about.html     | Services, homepage, footer                      |
| "köklü", "başarıyla tamamlanmıştır", "bu anlayışıyla öne çıkmıştır"                                                | Self-praise                                                                    | **Dropped or softened** ("sunmayı amaçlar")     |
| Founder biography (age 44, student status, hometown, family, SUGİAD presidency, MÜSİAD, AHİSİAD, GSG with 6 plays) | Time-sensitive or personal, unconfirmed                                        | **Withheld** (tests and `verify-dist` block it) |
| SUGİAD membership statement                                                                                        | Verified (company voice on faaliyet.html)                                      | Activities, text only                           |
| SUGİAD photo (award to a third-party artist)                                                                       | Would imply an award                                                           | **Withheld**                                    |
| Theatre evening and poster                                                                                         | Attribution conflict (municipal event or founder's group vs. "employee event") | **Withheld**                                    |

### Owner confirmations (Stage 5)

- [ ] Approve **Müteahhitlik** as a listed service, and its description.
- [ ] Approve the editorial headline "Güvenli yapılar, huzurlu yaşam alanları." and the shortened
      mission and vision.
- [ ] Founder biography: provide current wording to publish (or confirm it should stay off the site).
- [ ] SUGİAD: is the membership the company's or the founder's? Since when (date)? Any photo
      without third-party award context?
- [ ] Theatre evening: was it a company event? If so, a date and a photo without municipal or
      third-party branding.

## 7. Stage 6 updates (contact)

| Item                                                                            | Source                    | Status                                  |
| ------------------------------------------------------------------------------- | ------------------------- | --------------------------------------- |
| Mobile and WhatsApp: 0 (532) 686 88 29 / +905326868829                          | Legacy footer and buttons | Verified (legacy); used                 |
| Landline: 0 216 419 57 81                                                       | Legacy footer             | Verified (legacy); labelled "Sabit hat" |
| E-mail: info@eyfayapi.net                                                       | Legacy footer             | Verified (legacy); used                 |
| Address: Abdurrahmangazi Mah. Dağıstan Sk. No: 4/14, 34920 Sultanbeyli/İstanbul | Legacy footer             | Verified (legacy); used                 |
| Google Maps embed URL                                                           | Legacy page footers       | Verified (legacy); loaded only on click |
| Instagram @eyfa.yapi                                                            | Legacy footer             | Verified (legacy); used                 |
| Opening hours, geo coordinates, service area                                    | None                      | **Not published** (no source)           |
| WhatsApp default and project messages                                           | Editorial                 | New wording; contains no claims         |

### Owner confirmations (Stage 6)

- [ ] Are all phone numbers, the e-mail, the address and the map pin still current?
- [ ] Is the landline the office line? (The site says "Sabit hat" rather than assume.)
- [ ] Approve the WhatsApp default message and the project enquiry wording.
- [ ] Should opening hours be published? If so, provide them.
- [ ] Is a contact form wanted? It would need a separately reviewed delivery provider.

## 8. Stage 7 updates (editorial audit)

**Ready for publication** (verified or editorially grounded, no new facts):

- company facts (2004, founder, legal name, districts, fields of work);
- Stage 5 About/Services copy;
- contact data (pending reconfirmation, B2);
- the neutral project intros;
- the shortened Projects meta description (from the legacy intro, without "başarıyla");
- per-project meta descriptions (intro + media count).

**Requires owner approval** (`OWNER_REVIEW_CHECKLIST.md` §3):

- legacy claims "başarıyla tamamladığı" (Projects lead) and "öne çıkmıştır" (homepage principle 3);
- "güvenilir çözümler" (default meta description);
- "Uzman mimarlarla", "Alanında yetkin" and "Doğru projeleri, doğru yatırımcılarla" (services);
- brand casing "Eyfa Yapı" vs "EYFA Yapı";
- temporary project labels;
- WhatsApp messages;
- whether Activities stays in the header.

**Must remain withheld:**

- founder biography details;
- the SUGİAD award photo;
- the theatre evening;
- watermarked or third-party-branded media;
- opening hours, coordinates and service area (no source).

Checked and consistent: phone numbers, address, e-mail and Instagram (single source, tested); the
year 2004 (only verified date); no ratings, awards or certifications anywhere (JSON-LD and text
scans).

## 9. Pre-launch update (2026-11-11)

**Owner-confirmed:**

- phones (mobile/WhatsApp, landline), e-mail and office address;
- project photographs: genuine projects, taken by the owner, authorized for website use;
- project names, locations, years and specifications are **unavailable**.

**Rewritten** (claims removed, nothing added; `src/data/published-copy.ts`, tested):

- the hero and Services lead ("güçlü birikim");
- the Projects lead ("başarıyla tamamladığı");
- the default meta description ("güvenilir çözümler");
- principles 2 and 3 ("güçlü mühendislik altyapısı, deneyimli kadrosu", "öne çıkmıştır");
- the About closing and the approach item;
- Mimarlık and Mühendislik ("Uzman", "Alanında yetkin");
- headings "Uzmanlık alanlarımız" → "Hizmet alanlarımız";
- a homepage alt text that said "Tamamlanmış".

**Retained, to confirm in the final authorization:**

- C1 founder Fatih Yılmaz / 2004;
- C2 SUGİAD as a company activity;
- C3 the slogan.

**Withheld:** all architectural drawings (author and permission unverified). See
`PRELAUNCH_FINAL_STATUS.md`.
