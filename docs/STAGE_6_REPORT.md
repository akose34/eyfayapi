# Stage 6 Report: Contact Experience and Conversion

- **Branch:** `redesign/eyfa-professional`
- **Base:** Stage 5 commit `df83435`
- **Date:** 2026-11-10
- **Status:** complete. The commit is local only: not pushed, not merged, not deployed.

## 1. Contact page structure (`/iletisim/`)

| Section            | Content                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A. Hero            | Dark `PageHeader`: "Bize ulaşın", with a one-sentence invitation and breadcrumbs.                                                                            |
| B. Contact methods | Two primary tiles: WhatsApp (with the default message) and the mobile number. A secondary ruled row: landline, e-mail (mailto with a subject) and Instagram. |
| C. Office location | Legal name, the verified address, a "Google Haritalar’da yol tarifi" link and the `MapConsent` panel.                                                        |
| D. Closing choice  | `ContactCTA`: "Size en uygun kanalı seçin", with WhatsApp (primary), phone and e-mail.                                                                       |

There is **no contact form**. The site is static and has no backend, so a form would look functional
but could not deliver messages.

## 2. Verified contact sources

All values come from the legacy site (page footers and buttons) and live in one typed record,
`company` in `src/data/company.ts`. A derived `contact` object builds every link:

| Channel   | Display                                                                       | Link                                                                       |
| --------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Mobile    | 0 (532) 686 88 29                                                             | `tel:+905326868829`                                                        |
| Landline  | 0 216 419 57 81 ("Sabit hat")                                                 | `tel:+902164195781`                                                        |
| WhatsApp  | +90 (532) 686 88 29 (same number)                                             | `https://wa.me/905326868829?text=…`                                        |
| E-mail    | info@eyfayapi.net                                                             | `mailto:` (plain, or with the subject "Web sitesi üzerinden bilgi talebi") |
| Instagram | @eyfa.yapi                                                                    | `https://www.instagram.com/eyfa.yapi/`                                     |
| Address   | Abdurrahmangazi Mahallesi Dağıstan Sokak No: 4/14, 34920 Sultanbeyli/İstanbul | Google Maps directions (keyless URLs API)                                  |

Inconsistencies found and resolved:

- The landline was labelled "Telefon" in one place and "Sabit hat" elsewhere. It is now "Sabit hat"
  everywhere. Calling it the office line would be an assumption.
- The WhatsApp number is shown as "+90 (532) …" and the mobile as "0 (532) …". This is the same
  verified number, formatted for each channel's convention, and is documented rather than changed.

A source-scan test fails if a phone number or e-mail address is hard-coded anywhere outside
`company.ts`, `contact.ts` and the type definitions.

## 3. WhatsApp implementation

- **Default message:** "Merhaba, web siteniz üzerinden ulaşıyorum. Bilgi almak istiyorum." Used by
  the header menu, the footer, the contact page, closing CTAs and the About page.
- **Project message:** "Merhaba, web sitenizdeki Proje 06 hakkında bilgi almak istiyorum."
  - It uses only the public label.
  - It includes no internal notes and no sale or availability wording (a test checks every public
    project).
  - An empty label falls back to the default message.
- **Safety:**
  - `sanitizeMessage` replaces Unicode control (`Cc`) and format (`Cf`) characters with spaces.
    These include newlines, zero-width characters and bidi overrides.
  - It then collapses whitespace and caps the length (300 characters, or 60 for a label).
  - `whatsappHref` encodes with `encodeURIComponent`, so the URL only ever has a `text` parameter.
  - A test confirms that an injection attempt (`&phone=`, `../`, `#`, newlines) stays inside the
    message.
- All WhatsApp links open in a new tab with `rel="noopener noreferrer"` and an sr-only
  "(yeni sekmede açılır)".

## 4. Site-wide CTA integration

| Location                  | Change                                                                                                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header (mobile menu)      | Phone, WhatsApp (default message) and e-mail, taken from `contact`                                                                                                                      |
| Footer (`ContactLinks`)   | The landline label is now "Sabit hat". The address links to Google Maps directions.                                                                                                     |
| `ContactCTA`              | New props: `whatsappHref` and `showContactPageLink`                                                                                                                                     |
| Project detail pages (11) | Header: a "Bu proje hakkında sorun" WhatsApp button (project message) and a "Tüm iletişim kanalları" link. Closing CTA: "Proje NN hakkında bilgi alın", which uses the project message. |
| About page                | Uses `contact` for the phone and WhatsApp links                                                                                                                                         |
| JSON-LD (`BaseLayout`)    | Adds `founder`, `hasMap` and two `ContactPoint`s (Turkish, customer service). There are no hours, geo, `areaServed`, ratings or certifications.                                         |

## 5. Map and privacy decisions

- **Click-to-load map:**
  - The Google Maps iframe sits inside a `<template>`, which is inert, so the page makes **zero**
    requests to Google before consent.
  - "Haritayı yükle" creates the iframe, announces "Google Haritalar yüklendi." in a polite live
    region and moves focus to the map.
  - A note under the button says that loading connects to Google.
- **Always available:** the "Yol tarifi al" and "Google Haritalar’da yol tarifi" links use the
  keyless Maps URLs API and need no script. Without JavaScript the load button is hidden.
- **Not added:** a static map image (nothing licensed exists), coordinates and opening hours. There
  is no source for any of them.
- **Floating WhatsApp button: not built.**
  - On phones it would overlap the lightbox's bottom controls and the mobile menu, and cover the last
    line of content.
  - WhatsApp is already one tap away in context: the header menu, the footer, every closing band,
    and each project header.
  - It can be revisited in Stage 7 with real usage data, if the owner wants it.
- **Network (production preview, Chromium):**
  - `/iletisim/` before consent: no third-party requests and no iframes.
  - After the click: one `google.com/maps/embed` document request and Google's own sub-resources.
  - No analytics, tag managers, pixels or third-party fonts anywhere. `verify-dist` enforces this.

## 6. Accessibility results

- **axe-core** (WCAG 2.0/2.1/2.2 A and AA plus best-practice) on the production build:
  - **Final run:** 0 violations and 0 incomplete results on `/iletisim/` at 375 and 1280.
  - **Earlier 24-run sweep** across pages and widths: clean, except one "incomplete" on the map
    panel, caused by a decorative gradient. That was fixed, and `/iletisim/` was rechecked at 320,
    375, 1280 and 1920.
  - Also clean: the map-loaded state and the gallery lightbox open state.
- **Contact tile names:**
  - An `aria-label` on the tiles tripped the experimental `label-content-name-mismatch` rule.
  - They now use visually hidden `": "` and `", "` separators. Names read, for example, "WhatsApp: +90
    (532) 686 88 29, WhatsApp’ta mesaj yazın (yeni sekmede açılır)", and contain the visible text.
- **Experimental `p-as-heading`:** it flags the "Eyfa Yapı" name in the map panel and the footer
  statement. Both are intentionally paragraphs (a label and a tagline, not document structure).
- **Keyboard:** the tab order on `/iletisim/` is logical, every stop shows the focus ring, and the
  map button is reachable and announced with its privacy note (`aria-describedby`).
- **Fixes during QA:**
  - Removed a decorative gradient grid behind the panel text (it caused an axe "incomplete").
  - Fixed a missing space between the postal code and district.

## 7. Responsive QA

The production build was checked at 320, 375, 390, 768, 1024, 1280, 1440 and 1920 px: 39
overflow runs with no horizontal overflow.

- WhatsApp and mobile numbers no longer wrap at 320 px (`text-2xl whitespace-nowrap`, `sm:text-4xl`;
  tile padding `p-6 sm:p-8 lg:p-10`).
- On phones the map panel has a minimum height of 24 rem instead of a short landscape ratio. From
  `sm` up it uses the photo ratio.
- The secondary channels stack on phones and sit in three ruled columns from `sm`.
- Project headers wrap the enquiry button and the contact link cleanly at 320 px.

## 8. Tests

`npm run validate` passes: format, ESLint (jsx-a11y strict), `astro check` with 0 errors and 0
warnings, 13 test files with **199 tests**, build (18 pages), and `verify-dist`.

New or extended tests:

- **`tests/contact.test.ts`:**
  - Message sanitising: control and bidi characters are removed; Turkish, emoji and punctuation are
    kept; length is capped.
  - WhatsApp encoding: special characters round-trip, and only a `text` parameter is ever produced.
  - Label injection is contained.
  - The verified number carries the default message.
  - Project messages are checked for every public project; an empty label falls back to the default.
  - The maps directions URL needs no key.
  - Exact contact values, including the encoded mailto subject.
  - The hard-coded-contact source scan.
- **`tests/components.test.ts`:** the `ContactLinks` WhatsApp assertion now expects the exact href
  with the encoded default message. This is stricter than the previous bare number.
- **`scripts/verify-dist.mjs`**, on every built page:
  - no live iframe and no `<form>`;
  - no third-party media or scripts;
  - no third-party stylesheet, preload, preconnect or dns-prefetch;
  - `tel:`, `wa.me` and `mailto:` match the verified data.

  On the contact page it also requires the load button, the templated iframe and the directions
  link. Mutation tests confirm that a planted iframe, form, unverified `tel:` link or tag-manager
  script each make the build fail.

- **Unchanged and still passing:** routes, legacy redirects (`about.html`, `faaliyet.html`,
  `projeler.html`, `anaEkran.html`), 11 project routes (08 as a redirect) and gallery and lightbox
  behaviour.

## 9. Performance and network findings

Built HTML, `srcset` resolved, gzip text:

| Page                  | HTML (gzip) | CSS (gzip) | Inline JS | Initial transfer | Full page |
| --------------------- | ----------- | ---------- | --------- | ---------------- | --------- |
| `/iletisim/`          | 8.0 KB      | 12.6 KB    | 1.2 KB    | ≈ 134 KB         | ≈ 144 KB  |
| `/projeler/proje-06/` | 10.0 KB     | 12.6 KB    | 2.7 KB    | ≈ 331 KB         | ≈ 984 KB  |
| `/` (reference)       | 10.4 KB     | 12.6 KB    | –         | ≈ 199 KB         | ≈ 841 KB  |

- No external JavaScript files. The map script and the menu and lightbox scripts are small inline
  modules.
- Fonts (108.7 KB, 4 files) are the largest part of the contact page and are self-hosted.
- The Google map (several hundred KB) loads only on request.
- The built site is 34.2 MB, 387 files.

## 10. Remaining owner confirmations

- [ ] Are the phone numbers, e-mail, address and Google Maps pin still current?
- [ ] Is 0 216 419 57 81 the office line? (The site says "Sabit hat".)
- [ ] Approve the WhatsApp default message and the project enquiry wording.
- [ ] Should opening hours be published? If so, provide them (they will be added to the page and to
      JSON-LD).
- [ ] Is a contact form wanted? It would need a separately reviewed delivery provider and a privacy
      notice (DEPLOYMENT_PLAN §6).
- [ ] Is a floating WhatsApp button wanted despite the trade-offs in §5?

Earlier open items (project names, logo vector, media licensing, Pages deploy model) are unchanged;
see `ROADMAP.md`.

## 11. Stage 7 preparation notes

- **SEO** (moved from the original Stage 6 plan):
  - per-page OG images;
  - review the `Organization` → `GeneralContractor` / `LocalBusiness` subtype;
  - `openingHoursSpecification` only once hours are confirmed;
  - sitemap and robots review;
  - a Search Console handover plan.
  - Keep `noindex` on project pages until names are confirmed.
- **Quality:**
  - Playwright smoke tests: routes, the mobile menu, legacy redirects, map consent (assert no Google
    request before the click), and the WhatsApp hrefs.
  - axe on every route in CI.
  - Lighthouse budgets from real runs.
  - Safari iOS and Chrome Android checks, especially `wa.me` hand-off and `tel:` behaviour.
- **Manual screen-reader pass:** VoiceOver on `/iletisim/`, covering the tile names and the map
  load announcement.
