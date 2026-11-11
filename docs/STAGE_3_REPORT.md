# Stage 3 Report: Premium Homepage

- **Branch:** `redesign/eyfa-professional`
- **Base:** Stage 2 commit `5980283`
- **Date:** 2026-11-10
- **Status:** complete. The commit is local only: not pushed, not merged, not deployed.

## 1. Homepage structure

| #   | Section                | Tone  | Composition                                                                                                                                                                             | Content source                                                                                                                                                                           |
| --- | ---------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A   | Cinematic hero         | dark  | Desktop: text column (42%) on charcoal; the photo bleeds to the right edge (56%) with a soft charcoal seam. Phones: square photo on top, fading into the text. Tablet: 3:2 photo on top | Eyebrow "2004’ten bu yana · İstanbul" (verified year and city), H1 = legacy headline, lead = first sentence of the legacy intro, CTAs Projelerimiz / Bize ulaşın, verified service names |
| B   | Corporate introduction | ivory | Large Cormorant statement (positioning) with a verified lead; below it, a photo (7 cols) beside a ruled "Faaliyet alanlarımız" list (5 cols) and the districts                          | `legacyCopy.positioning`, `homeIntroLead`, `activityAreas`, `districts` (verbatim excerpts of about.html)                                                                                |
| C   | Featured projects      | dark  | One large 4:5 card (4:3 on phones) and two stacked cards. This deliberately breaks the uniform grid                                                                                     | Existing galleries 6, 2 and 1 with neutral labels "Proje 06/02/01", photo counts, and links to the real detail routes                                                                    |
| D   | Services               | white | Editorial index: number · Cormorant title · description · authentic thumbnail · arrow. Whole-row links                                                                                  | `services.ts` (verbatim), links to `/hizmetler/#id`                                                                                                                                      |
| E   | Approach               | sand  | Vision excerpt as a large quote (6 cols) and three numbered principles (5 cols)                                                                                                         | `visionQuote`, `principles[].text` (verbatim)                                                                                                                                            |
| F   | Closing contact        | dark  | Split: photo bleeding left; WhatsApp, mobile, landline, e-mail and contact page                                                                                                         | Verified channels only                                                                                                                                                                   |

The heading outline is h1 (hero) → h2 per section (the approach h2 is visually hidden behind its
eyebrow) → h3 for cards, services, principles and the activity list → footer h2 and h3.
`verify-dist` enforces that no heading level is skipped.

## 2. Creative decisions

- **Split hero instead of full-bleed text-over-image.**
  - Text never sits on the photo, so contrast is deterministic (ivory on charcoal, 15.4:1) and
    fully machine-checkable.
  - It continues the charcoal header seamlessly, so **no transparent-header variant was needed**,
    and other routes are unaffected.
  - It gives the photograph real architectural scale on desktop.
- **Rhythm:** dark → ivory → dark → white → sand → dark. No two adjacent sections share a tone.
- **No uniform card grids.**
  - Projects use an asymmetric feature layout.
  - Services use a typographic index (publication style).
  - The approach section uses a quote and numbered principles.
  - The activity areas use a ruled definition list.
- **One alignment edge.** Every section uses the wide container. A QA pass found the intro and
  services were misaligned on the content container, which I fixed.
- **Gold is used sparingly:** primary buttons, eyebrow rules, index numbers, hover states.
- **Restrained motion.** CSS-only scroll reveal (fixed in this stage; see §5), gentle image zoom on
  hover, and arrow nudges. Everything is off under reduced motion, and no content depends on JS.
- **Honest labels.** Featured galleries keep their provisional names. The "Bilgiler onay bekliyor"
  marker is turned off on the homepage only (`pendingNote={false}`); uncertainty stays in the
  typed data, the project pages and the docs.

## 3. Media used

I evaluated eight candidates for the hero (contact sheet of wide and 4:5 crops with the letterbox
removed): `img/resim17, 18, 12, 2, 9` and `projects-img/27, 24, 19`.

**Chosen: `projects-img/19.webp`** (3024 × 1689 after trim).

- It has calm sky as negative space, hills on the horizon and the authentic "EYFA" roof sign.
- The building sits low in the frame, so square, 3:2 and tall crops all keep it intact.
- `resim17` and `24` are frontal but busy edge to edge. `27` is too close for a hero (it is used as
  the featured card). `12` is moody but lacks signage.

| Slot            | File                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------ |
| Hero            | `projects-img/19.webp` (gallery 4)                                                         |
| Introduction    | `img/Eyfa-yapi-resim12.png` (newly registered and letterbox-trimmed)                       |
| Featured        | `27.webp` (gallery 6), `7.webp` (gallery 2), `31.webp` (gallery 1)                         |
| Services        | `7795_4-7.webp` (rendered plan), `32.webp` (structural frame), `24.webp` (finished facade) |
| Closing contact | `img/Eyfa-yapi-resim18.png` (newly registered and letterbox-trimmed)                       |

No stock imagery. No watermarked or third-party-branded files. No originals were modified. Every
image passes the letterbox pixel test and the own-gallery check (`tests/home.test.ts`).

## 4. Responsive QA (production build via `astro preview`, Chromium browser pane)

| Width           | Result                                                                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 320 / 375 / 390 | Square hero photo above the text; H1 ends at 618 / 674 / 690 px, inside the first viewport. Stacked buttons. Feature card 4:3. Services rows use a compact 88 px thumbnail beside the text. No overflow |
| 768             | 3:2 hero photo, then text. Featured: large card above two side by side                                                                                                                                  |
| 1024            | Split hero activates and the desktop nav fits. Approach quote at 4 lines                                                                                                                                |
| 1280 / 1440     | Split hero is exactly one viewport tall (min(100svh − header, 56rem)). Feature card baselines align with the stacked pair                                                                               |
| 1920            | Content capped at 1376 px. The hero photo starts where the text column ends                                                                                                                             |

Programmatic sweep at all 8 widths: **0 px horizontal overflow** (checked by `scrollWidth` and
per-element bounding boxes).

## 5. Issues found during QA and fixed

| #   | Problem                                                                                                                                        | Fix                                                                                                                                                                                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Intro and services used the content container, so their left edge differed from the hero and projects                                          | All homepage sections use `width="wide"`                                                                                                                                                               |
| 2   | Missing space: "bölgeler:Sultanbeyli" (JSX whitespace)                                                                                         | Explicit `{' '}`                                                                                                                                                                                       |
| 3   | Approach quote set at 7 lines (too heavy)                                                                                                      | `text-3xl`, 6 columns, `max-w-xl`                                                                                                                                                                      |
| 4   | On phones the services index stacked full-width images, so floor plans dominated                                                               | Two-column mobile row with a compact thumbnail                                                                                                                                                         |
| 5   | Feature card 4:5 was about 470 px tall on phones                                                                                               | New `aspect="feature"`: 4:3 below 1024 px, 4:5 above                                                                                                                                                   |
| 6   | **The scroll-reveal never ran.** The CSS minifier merged `animation` + `animation-timeline` into `animation: … view()`, which Chromium rejects | Timeline passed through `--reveal-timeline`. Verified in the browser: off-screen opacity 0 → 1 in view. Range tightened to 20% so tall elements are never semi-transparent for long. Print is excluded |
| 7   | `ContactCTA` would have combined `grid` and `flex` classes without an image                                                                    | Mutually exclusive class sets                                                                                                                                                                          |
| 8   | Test bug: `routeExists` doesn't understand the dynamic `[slug]` route                                                                          | The test asserts the generator file; `verify-dist` checks the real links                                                                                                                               |
| 9   | `verify-dist`'s new external-script regex missed `<script src>`                                                                                | Regex fixed; mutation test now caught directly                                                                                                                                                         |

## 6. Performance (measured, not estimated)

Method: `dist/index.html` parsed; for each viewport and DPR, every `<img>`'s `srcset`/`sizes` is
resolved exactly as a browser would. Totals add HTML, CSS and JS (gzip, as GitHub Pages serves
them) plus the four WOFF2 subsets that Turkish text needs (latin and latin-ext of both families).
"Initial" counts only non-lazy images. Script: an ad-hoc Node script, not committed; the method is
described here.

| Viewport | Hero file | Initial transfer | Fully scrolled |
| -------- | --------- | ---------------- | -------------- |
| 375 @3x  | 88 KB     | **223 KB**       | 888 KB         |
| 390 @2x  | 59 KB     | **194 KB**       | 722 KB         |
| 768 @2x  | 130 KB    | **266 KB**       | 931 KB         |
| 1440 @2x | 130 KB    | **266 KB**       | 996 KB         |
| 1440 @1x | 59 KB     | **194 KB**       | 645 KB         |
| 1920 @1x | 59 KB     | **194 KB**       | 815 KB         |

Breakdown: HTML 55 KB (9.8 KB gzip) · CSS 45 KB (12 KB gzip) · fonts 109 KB · **JS: no files;
812 bytes inline** (a 57 B JS flag and the 755 B header menu module).

**Targets:** hero ≤ 200 KB ✅ (max 130 KB) and initial ≤ 1.5 MB ✅ (max 266 KB). Even the full
page stays under 1 MB.

**CLS:** 0.0000 measured with a `layout-shift` PerformanceObserver in the browser. All media sits in
fixed-ratio or parent-sized boxes, and `verify-dist` now fails any `<img>` without width/height.

**Build output** (not transfer): `dist/` is 19.6 MB, because every image has several widths. The
largest file is under 500 KB.

**Not measured:** Lighthouse scores and real-device LCP. Lighthouse is not installed (it would
need a Chrome download). In-browser LCP observation in an off-screen frame was unreliable, so I
report no number. Lighthouse CI is planned for Stage 7.

## 7. Accessibility

- **axe-core 4.14.0** on the **production build** (WCAG 2.0/2.1/2.2 A and AA plus best practices):
  - **Homepage at 320, 375, 390, 768, 1024, 1280, 1440 and 1920 px: 0 violations.**
  - All other routes (`/hizmetler/`, `/projeler/`, `/projeler/proje-06/`, `/iletisim/`,
    `/hakkimizda/`, `/faaliyetlerimiz/`, `/404.html`) at 375 and 1280 px: 0 violations and
    0 incomplete. No regression in the shared components.
  - **Known heuristic false positive.** At 1280, 1440 and 1920 px, axe reports `color-contrast`
    as _incomplete_ (not a violation) for the "Proje 06" title and the projects lead paragraph:
    "overlapped by another element".
    - Cause: the letterbox-trimmed feature image's inner box is intentionally taller than its frame
      and clipped by `overflow: hidden`. axe's overlap heuristic uses the unclipped box.
    - Evidence: `elementsFromPoint` at the title returns the link itself as topmost, so clicks and
      rendering are correct. The colours are tested tokens (ivory on charcoal, 15.4:1).
    - I tried `contain: paint` (not honoured by axe) and reverted it.
    - A pixel-exact fix needs build-time cropping (§9).
- **Manual keyboard:** 26 Tab stops, recorded in order:
  - skip link → logo → nav → CTA → hero CTAs → intro link → "Tüm projeler" → 3 project cards →
    services link → 3 service rows → approach button → 5 contact links → footer.
  - Every stop had a visible focus ring.
- **Static:** jsx-a11y strict lint passes.
- **Images:** descriptive Turkish alt text with no claimed names. The decorative seams are
  `aria-hidden`.
- **Not done:** no screen reader (VoiceOver or NVDA), no real devices, and no reduced-motion
  emulation (the browser tool can't emulate it; verified by CSS review: `.reveal` exists only
  inside `prefers-reduced-motion: no-preference`). **Full WCAG conformance is not claimed.**

## 8. Automated validation (final run)

| Check                                       | Result                                        |
| ------------------------------------------- | --------------------------------------------- |
| `npm run validate`                          | pass (exit 0)                                 |
| Prettier and ESLint (jsx-a11y strict)       | pass                                          |
| `astro check`                               | 59 files, 0 errors, 0 warnings                |
| `npm run typecheck` (`astro check` + `tsc`) | pass                                          |
| Vitest                                      | **11 files, 131 tests passed** (Stage 2: 113) |
| Build                                       | 18 pages                                      |
| `verify-dist`                               | 22 HTML files, all checks passed              |
| `npm audit --omit=dev`                      | 0 vulnerabilities. No new dependencies        |

New tests (`tests/home.test.ts`, 16 tests):

- Curation uses registered, letterbox-known images.
- Featured images belong to their own galleries and are not floor plans.
- One image per service.
- No featured name is marked verified.
- Every new homepage sentence is a verbatim excerpt of about.html. The matcher only permits a
  capitalised first letter, and a self-check rejects invented sentences.
- Production dependencies are pinned to the expected list.

New `verify-dist` rules (all pages):

- No skipped heading levels.
- Width and height on every `<img>`.
- No external scripts, and at most 2 KB of inline JS.
- Homepage: exactly one eager, high-priority hero and lazy loading for everything else.

All new rules were mutation-tested: a planted heading skip, an external script and a lazy hero
were each reported.

## 9. Known limitations and optional enhancements

1. **Letterbox trimming via an oversized box** causes the axe "incomplete" above. A build-time crop
   (a sharp `extract` step in a tiny image wrapper) would produce clean derivatives; I recommend it
   for Stage 4 or 7.
2. **Optional hero video.** A ≤ 2 MB re-encoded muted loop of `mini-video-4` (drone orbit) with
   `poster` = the current still, `preload="none"`, autoplay only when motion is allowed and on
   desktop. Not added by default (weight, motion, owner choice).
3. **Featured selection** (galleries 6, 2, 1) was chosen on photo quality, not business priority.
   The owner should confirm which projects to feature once names exist.
4. Galleries 4 and 6 may show the same building (open question since Stage 1). The hero (gallery 4)
   and the featured card (gallery 6) could depict one building twice.
5. The hero eyebrow uses "2004’ten bu yana · İstanbul": founding year and city are verified, but
   the owner may prefer other wording.

## 10. Content uncertainties (unchanged and still open)

- Project names, locations, status and year for all galleries. "Ferah Evler" (gallery 1) is still
  unconfirmed, so it is not shown.
- Whether galleries 4 and 6 are the same project.
- The founder biography, and whether "Müteahhitlik/Taahhüt" becomes a fourth service.
- Owner approval of the neutral CTA copy ("Bir sonraki projeniz için bize ulaşın").

## 11. Files

- **Created:**
  - `src/data/home.ts`
  - `tests/home.test.ts`
  - `docs/STAGE_3_REPORT.md`
- **Modified:**
  - `src/pages/index.astro` (rewritten)
  - `src/components/{MediaFrame,ProjectCard,ContactCTA}.astro`, with backwards-compatible props
  - `src/data/company.ts` (verified excerpts)
  - `src/lib/media.ts` (two images registered and letterbox-listed)
  - `src/styles/global.css` (reveal fix)
  - `scripts/verify-dist.mjs`
  - `docs/{ROADMAP,DESIGN_SYSTEM,ARCHITECTURE,MEDIA_INVENTORY}.md`
- **Untouched:** legacy files, `public/` redirects, project slugs, `main`, hosting configuration.

## 12. Remaining work for Stage 4 (projects)

- Collect owner answers (CONTENT_INVENTORY §4) and move projects to a Content Collection with
  name-based slugs, plus redirect stubs from `proje-NN` if those were ever public.
- Detail pages: hero image, verified facts table, gallery with an accessible `<dialog>` lightbox,
  and a plans section with `fit="contain"`.
- Listing: optional client-side status/type filter (no backend), with `EmptyState` for no results.
- Resolve media licensing (Autodesk watermark, THERMOsiding, ARTRIA/GOKTUG).
- Implement build-time letterbox cropping (§9.1).
- Update `featuredProjects` in `src/data/home.ts` once the owner names priorities.
