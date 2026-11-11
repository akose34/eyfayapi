# Accessibility Audit (Stage 7)

**Scope and honesty note:** automated tools detect only part of the WCAG success criteria. The
results below support, but do **not** establish, WCAG 2.2 AA conformance. A manual screen-reader
pass (§4) is still required before any conformance statement is made.

## 1. Automated results (production build)

| Check                                                | Tool                       | Coverage                                       | Result                                                                            |
| ---------------------------------------------------- | -------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| axe-core 4.14, WCAG 2.0/2.1/2.2 A+AA + best-practice | `e2e/a11y.spec.ts`         | 16 page routes + 404, desktop 1280 and Pixel 7 | **0 violations**                                                                  |
| axe in interactive states                            | `e2e/a11y.spec.ts`         | open mobile menu, open lightbox, loaded map    | **0 violations**                                                                  |
| Reflow (WCAG 1.4.10)                                 | `e2e/a11y.spec.ts`         | every page type at 320 CSS px                  | no horizontal scrolling                                                           |
| Text spacing (WCAG 1.4.12)                           | `e2e/a11y.spec.ts`         | home, contact, project detail                  | no overflow                                                                       |
| Lighthouse accessibility                             | `scripts/lighthouse.mjs`   | 7 pages × mobile/desktop                       | **100 everywhere**                                                                |
| Static template linting                              | ESLint `jsx-a11y` (strict) | all `.astro` files                             | 0 problems                                                                        |
| Build-time structure                                 | `verify-dist`              | all pages                                      | one h1; no skipped levels; alt on every img; unique ids; skip link; dialog wiring |

Run: `npm run test:e2e` (builds, then runs every browser test).

## 2. Keyboard and interaction (automated in `e2e/smoke.spec.ts`)

- **Skip link:** the first Tab stop; becomes visible and moves to `#main`.
- **Desktop navigation:** every link reachable; `aria-current="page"` on the current section.
- **Mobile menu:** native modal `<dialog>`.
  - `aria-expanded` is kept in sync with the dialog's state.
  - Escape closes it and focus returns to the toggle.
  - Following a link closes it.
- **Lightbox:** opens with Enter.
  - Arrow keys, Home and End move between images, with wrap-around.
  - The status "Fotoğraf N / M" is announced politely, and the image has alt text.
  - Escape closes it and focus returns to the thumbnail.
  - Touch: a ≥ 50 px swipe changes the image; a short move doesn't.
- **Map consent:** the button is described by the privacy note (`aria-describedby`).
  - After loading, focus moves to the iframe, which has a title.
  - The live region says "Google Haritalar yüklendi.".
- **No keyboard traps.** The native dialogs handle focus containment; nothing hand-written traps
  focus.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, every `.reveal` element is fully
  visible (opacity 1).
- **No forms anywhere.** This is intentional: the site has no backend (asserted in the tests).

## 3. Other checks

| Topic              | Finding                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Colour contrast    | Token pairs tested in `tests/design-tokens.test.ts`; axe colour-contrast passes on every route                                          |
| Focus visibility   | 2 px champagne-700 / champagne outline on every interactive element (Stage 2 tokens); verified by keyboard walk-through on `/iletisim/` |
| Touch targets      | axe `target-size` (WCAG 2.5.8) passes; buttons and menu links ≥ 44 px on phones                                                         |
| Zoom               | 320 px reflow passes (equivalent to 400 % at 1280 px). No `maximum-scale` / `user-scalable=no`                                          |
| Language           | `lang="tr"` on every document, including redirect stubs                                                                                 |
| Alt text           | Descriptive Turkish alt text from curated data; decorative images use `alt=""`; withheld photos never appear                            |
| Turkish characters | Ğ ğ İ Ş ş render from the Turkish font subset (visually checked on headings and body text)                                              |
| Layout shift       | CLS 0 on all pages (helps users of magnifiers and screen readers)                                                                       |

Intentional patterns that axe's _experimental_ rules flag (not part of the standard run):

- `p-as-heading` on the "Eyfa Yapı" label in the map panel and the footer statement. These are a
  label and a tagline, not document sections.

## 4. Manual checks for the owner (screen reader)

VoiceOver could not be automated safely: enabling it changes system accessibility settings. Please
run these on macOS Safari (VoiceOver: ⌘F5) and iPhone Safari (Settings → Accessibility →
VoiceOver):

1. **Home:** the rotor lists headings: one h1 ("Eyfa Yapı ile Geleceği İnşa Ediyoruz."), then
   section h2s in order.
2. **Menu (phone):** "Menüyü aç" is announced as a button, collapsed. After opening, the menu
   links are read and swiping does not leave the dialog. "Menüyü kapat" returns to the button.
3. **Project gallery:** each thumbnail reads like "… — büyüt (2/6)". In the viewer, "Fotoğraf
   2 / 6" is announced after swiping or arrowing.
4. **Contact tiles:** a tile reads as one phrase, e.g. "WhatsApp: +90 (532) 686 88 29, WhatsApp’ta
   mesaj yazın (yeni sekmede açılır)".
5. **Map:** after "Haritayı yükle", VoiceOver says "Google Haritalar yüklendi." and lands on the
   map frame.
6. **Text size:** set the largest Dynamic Type size on iPhone. Text should grow and nothing should
   overlap.
7. **Windows (optional):** NVDA + Firefox on the same flows.

Record the results in `OWNER_REVIEW_CHECKLIST.md`.
