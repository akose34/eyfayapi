# Stage 5 Report: Corporate Identity, Services and Activities

- **Branch:** `redesign/eyfa-professional`
- **Base:** Stage 4 commit `20fa7ba`
- **Date:** 2026-11-10
- **Status:** complete. The commit is local only: not pushed, not merged, not deployed.

## 1. Final page structures

**`/hakkimizda/`**

|     | Section             | Tone  | Content                                                                                                                                                                                                                          |
| --- | ------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A   | Editorial hero      | dark  | Breadcrumbs; eyebrow "Hakkımızda · 2004’ten bu yana"; H1 "Güvenli yapılar, huzurlu yaşam alanları."; verified lead; cinematic photo (23.webp)                                                                                    |
| B   | Introduction        | ivory | Cormorant statement "İnsan hayatını önceleyen bir yaklaşımla inşa ediyoruz." with two short paragraphs (founding, districts, principle)                                                                                          |
| C   | Story               | white | "2004" as the only date (decorative numeral, labelled "Kuruluş yılı · İstanbul"); a narrative lead; the four verified fields of work as a ruled list; closing line; photo pair (32 frame, 15 finished). **No invented timeline** |
| D   | Mission             | dark  | Statement band                                                                                                                                                                                                                   |
| D   | Vision              | ivory | Gold-ruled statement (a deliberately different composition)                                                                                                                                                                      |
| E   | Approach            | sand  | Four numbered principles, each a one-line rewrite of a verified sentence                                                                                                                                                         |
| F   | Projects transition | dark  | `FeatureRow`: photo 28 + "Projelerimizi yakından görün" + CTA                                                                                                                                                                    |
| G   | Contact transition  | ivory | A quiet row: mobile number, WhatsApp, link to the contact page (not a full CTA band)                                                                                                                                             |

**`/hizmetler/`**

- A dark header with the verified lead (first sentence of the legacy homepage intro) and a numbered
  in-page nav: 01 Müteahhitlik · 02 Mimarlık · 03 Mühendislik · 04 Emlak.
- Four editorial rows alternating sides and backgrounds (ivory and white). Each has an "0n / 04"
  counter, a Cormorant H2, the verified description and its own photo (33, 24, 14, 26):
  - Müteahhitlik adds the verified fields of work.
  - Mimarlık links to the drawing archive.
  - Emlak links to the portfolio.
- A sand "projects" band and the standard `ContactCTA`.
- **Anchors preserved:** `#mimarlik`, `#muhendislik`, `#emlak`, plus the new `#muteahhitlik`. The
  homepage index and footer links resolve, and anchors land below the sticky header (tested).

**`/faaliyetlerimiz/`**

- A dark header, then **one** activity: SUGİAD Üyeliği. A typographic dark panel takes the place
  of the withheld photo. Alongside it: the H2, the full association name verbatim from about.html,
  and the verbatim statement.
- A sand transition to About and Projects.
- Deliberately sparse: no dates (none verified), no news feed, no filler. The layout already
  supports more entries (optional verified date, optional public image).

## 2. Editorial revisions

- The single long legacy paragraph was split into short blocks:
  - the founding and districts;
  - the principle;
  - the fields of work;
  - engineering and quality.
- **Self-praise** removed or softened:
  - "köklü" was dropped;
  - "başarıyla tamamlanmıştır" became "projeler yürüttük";
  - "sunmaktadır" became "sunmayı amaçlar";
  - "bu anlayışıyla öne çıkmıştır" is not used.
- **Mission** was shortened to its two core sentences. The broader sustainability and
  social-contribution sentences remain in the source but are not repeated. **Vision** was shortened
  to its first and last clauses.
- The **Müteahhitlik** description is new wording built only from verified phrases.
- Every rewrite stores its verbatim basis (`src/data/corporate.ts`, `src/data/services.ts`).

## 3. Verified facts used

These are the facts the pages rely on:

- founding year 2004, İstanbul, founder name;
- "konut ve taahhüt projeleri";
- the four districts;
- the four fields of work;
- the mission and vision content;
- the three legacy service descriptions;
- the SUGİAD statement and the association's full name.

No metrics, awards, certifications, team members or dates beyond 2004 appear anywhere.

## 4. Excluded or uncertain content

| Item                                                                                                                                                       | Decision             | Reason                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Founder biography (age 44, sociology student, Gümüşhane/Kelkit, married with three children, SUGİAD 6th-term president, MÜSİAD, AHİSİAD, GSG with 6 plays) | Withheld             | Time-sensitive and personal. A test and `verify-dist` block these strings                                                                                                                                   |
| Founder photo `img/boss-photo.jpg`                                                                                                                         | Not used             | Personal; unconfirmed                                                                                                                                                                                       |
| SUGİAD photo                                                                                                                                               | Withheld (text kept) | It shows "SUGİAD En İyiler Ödül Töreni 2024" honouring a third-party artist (Şentürk Dündar), which would imply an award to Eyfa Yapı                                                                       |
| Theatre evening (text and poster)                                                                                                                          | Withheld             | The poster is a Sultanbeyli Belediyesi event branded with the mayor's name, directed by the founder (matching about.html's founder theatre group). That contradicts "çalışanlarımızla … organize ettiğimiz" |
| Müteahhitlik as a service                                                                                                                                  | **Added, flagged**   | Well grounded (registered name, homepage intro, about.html), but it was not in the legacy service list. Owner sign-off requested                                                                            |

Both activity images are unregistered for the build and listed in `src/data/withheld-media.json`.
`verify-dist` confirms they are not in `dist/`.

## 5. Responsive design decisions

- About hero: 16:9 on phones and 21:9 from 1024 px. The "2004" numeral scales with `clamp()`. The
  photo pair stacks on phones and becomes 5/7 columns from 640 px.
- Services rows: text first in DOM, image second. On phones the image follows the text; on desktop
  the sides alternate. The Müteahhitlik photo is 4:5 portrait (the source is portrait); the others
  are 3:2. The in-page nav wraps to two lines with 44 px targets.
- Activities: the typographic panel is 4:3 on phones and square on desktop.
- Mission dropped from `text-4xl` to `text-3xl` after QA (it set in about six heavy lines at 1440 px).

## 6. Responsive QA (production build, Chromium browser pane)

- **Programmatic sweep:** `/hakkimizda/`, `/hizmetler/`, `/faaliyetlerimiz/` and `/` at 320, 375,
  390, 768, 1024, 1280, 1440 and 1920 px (32 combinations): 0 overflow and exactly one H1 each.
- **Visual:** About at 1440 (every section) and 375 (hero and story); Services at 1440 (header and
  first two rows) and 375 (header); Activities at 1440; the homepage services index at 1440 (new
  fourth row). Header, footer and mobile menu are shared and unchanged.
- **Fixed during QA:**
  - the story lead was set in Manrope 2xl and read heavy, so it moved to Cormorant 3xl;
  - the mission was too heavy;
  - an unverified project-status phrase was removed from the About projects CTA;
  - an internal meta-note was removed from the vision;
  - the duplicated association name on Activities was removed;
  - a dark projects band sat against the dark contact band, so it was switched to sand;
  - the in-page nav underline caused axe "incomplete" results (see §7).

## 7. Accessibility

- **axe-core 4.14.0 on the production build:**
  - About, Services, Activities and the homepage at 375, 1280 and 1920 px.
  - Projects index, project pages 06 and 11, Contact and 404 at 375 and 1280 px.
  - **0 violations and 0 incomplete in all runs.** Services initially showed 3 "incomplete"
    results because the link-underline `::after` overlapped the number span. The underline moved to
    the label span and the results cleared.
- **Keyboard on `/hizmetler/`:** 16 Tab stops in logical order with a visible focus ring each.
  Activating the in-page "Emlak" link scrolls to `#emlak`, which lands 104 px from the top, clear of
  the sticky header.
- **Structure:**
  - one H1 per page;
  - sections labelled by headings, with visually hidden H2s where an eyebrow is the visual heading;
  - decorative numerals and panels `aria-hidden`;
  - all photographs have descriptive Turkish alt text.
- **Not done:** screen readers, real devices, and reduced-motion emulation (verified by CSS review
  only). Full WCAG conformance is not claimed.

## 8. Tests

| Check              | Result                                 |
| ------------------ | -------------------------------------- |
| `npm run validate` | pass                                   |
| `astro check`      | 68 files, 0 errors                     |
| `tsc`              | pass                                   |
| Vitest             | **13 files, 188 tests** (Stage 4: 164) |
| `verify-dist`      | 22 HTML files, all checks passed       |

- **New `tests/corporate.test.ts`** (23 tests):
  - basis excerpts are verbatim legacy text;
  - no new numbers;
  - banned credential, award and metric vocabulary, with a self-check against five invented
    claims;
  - no biography details;
  - founding year;
  - service anchors and order;
  - distinct, public, registered images;
  - activity attribution and withheld reasons;
  - no unverified dates.
- **Updated tests (stricter rule, not weaker):**
  - `content.test`: legacy services stay verbatim, the editorial service is checked against its
    basis, and all three legacy services are asserted present.
  - `projects.test`: the manifest now includes withheld activity images.
  - `media.test`: only publicly shown activity images may be registered.
- **`verify-dist` additions:** no biography or award wording in any built page; theatre absent
  from Activities; four service anchors present.
- **Mutations:**
  - "ISO 9001 belgeli, 20 yıllık…" injected into the About copy was caught.
  - "44 yaşında" planted in the built About page was caught.
  - Both files were restored.
- Routes and redirects:
  - all 11 project routes still generated (08 as a redirect);
  - legacy `about.html` → `/hakkimizda/` and `faaliyet.html` → `/faaliyetlerimiz/` intact;
  - no internal docs in `dist/`.

## 9. Performance (built HTML, `srcset` resolved, gzip text)

| Page                | 390 @2x initial | 1440 @2x initial | Hero               | Fully scrolled (1440 @2x) |
| ------------------- | --------------- | ---------------- | ------------------ | ------------------------- |
| `/hakkimizda/`      | 212 KB          | 252 KB           | 78 / 117 KB        | 891 KB                    |
| `/hizmetler/`       | 134 KB          | 134 KB           | none (text header) | 811 KB                    |
| `/faaliyetlerimiz/` | 132 KB          | 132 KB           | none               | 142 KB                    |
| `/`                 | 199 KB          | 231 KB           | 62 / 95 KB         | 919 KB                    |

- **JS:** 812 B per page (header only).
- **Build output:** 34.1 MB (+1.0 MB, budget 40 MB). `FeatureRow` and the About photos reuse the
  gallery thumbnail widths, so most derivatives already existed.
- No Lighthouse or field data was measured.

## 10. Remaining owner confirmations

See CONTENT_INVENTORY §6:

- Müteahhitlik service approval;
- the editorial headline and the shortened mission and vision;
- founder biography wording;
- SUGİAD (company or founder; date; a usable photo);
- the theatre evening's attribution;
- carried over: project names and facts, galleries 4 and 6, drawing rights.

## 11. Files

- **New:**
  - `src/data/corporate.ts`
  - `src/components/FeatureRow.astro`
  - `tests/corporate.test.ts`
  - `docs/STAGE_5_REPORT.md`
- **Modified:**
  - `src/pages/{hakkimizda,hizmetler,faaliyetlerimiz}.astro`
  - `src/data/{services,activities,home,navigation,withheld-media.json}`
  - `src/types/content.ts`, `src/lib/media.ts` (activity images unregistered)
  - `scripts/verify-dist.mjs`
  - `tests/{content,projects,media}.test.ts`
  - `docs/{CONTENT_INVENTORY,MEDIA_INVENTORY,DESIGN_SYSTEM,ARCHITECTURE,ROADMAP}.md`
- **Untouched:** legacy files, `public/` redirects, `CNAME`, `astro.config.ts`, `package.json`,
  `main`, hosting.

## 12. Stage 6 preparation

- **Contact page:**
  - Reuse `ContactLinks` and `ContactCTA`.
  - Decide on the Google Maps embed (click-to-load or static map).
  - Consider a WhatsApp message prefill (`whatsappHref` already supports it).
- **SEO:**
  - Per-page descriptions now exist.
  - Refine JSON-LD (`LocalBusiness`/`GeneralContractor` with `areaServed` from the verified
    districts).
  - Breadcrumb JSON-LD is already present.
  - Revisit `noindex` on project pages once names exist.
- The services anchors are a good basis for `hasOfferCatalog` structured data, once the owner
  approves Müteahhitlik.
