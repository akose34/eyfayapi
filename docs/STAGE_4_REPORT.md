# Stage 4 Report: Premium Project Portfolio and Detail Pages

- **Branch:** `redesign/eyfa-professional`
- **Base:** Stage 3 commit `70588c0`
- **Date:** 2026-11-10
- **Status:** complete. The commit is local only: not pushed, not merged, not deployed.

## 1. Project inventory findings

All 11 legacy galleries were re-reviewed image by image. The full review is in
`docs/PROJECT_MEDIA_REVIEW.md`.

- **6 photographed projects** (galleries 1–6): galleries 2, 4, 5 and 6 show completed-looking
  blocks; galleries 1 and 3 show only construction-phase photos.
- **4 drawing-only projects** (galleries 7, 9, 10, 11).
- **1 withheld project** (gallery 8): every drawing carries an Autodesk educational-licence
  watermark.
- No legacy gallery contains a name, location, date or description. All such fields remain
  `UNKNOWN` or `NEEDS_CONFIRMATION`.

## 2. Selected and excluded imagery

|                                           | Count | Detail                                                       |
| ----------------------------------------- | ----- | ------------------------------------------------------------ |
| Shown photographs                         | 24    | Heroes: 31, 7, 14, 19, 21, 27                                |
| Shown drawings                            | 21    | 7109_4 ×6, 158_8 ×3, 7795_4 ×7, colour plans 2–6             |
| Excluded near-duplicates                  | 5     | 8 (of 7), 11 (of 12), 16 (of 15), 29 (of 25), 30 (of 26)     |
| Excluded for rights                       | 8     | 6078_11-2…8 (educational watermark), 1.webp (THERMOsiding)   |
| Never published (not in legacy galleries) | 7     | 184_1-* (ARTRIA / GOKTUG), 6078_11-1 (YILMAZ İNŞAAT signage) |

Excluded files remain in the repository, untouched. They are not registered for the build, and
`verify-dist` proves no derivative reaches `dist/`. I verified that by planting a fake derivative,
which the check reported.

## 3. Potential duplicate galleries

- **Galleries 4 and 6** show the same design: green hipped roof, yellow stripes, 7 storeys, the same
  hills. But the signage differs ("≡EYFA" logo band vs. "EYFA YAPI" lettering, plus shops in 24).
  They were **not merged**. The portfolio keeps them a row apart, and the owner is asked.
- **Galleries 1 and 10** may be the same development: the "Ferah Evler" hoarding and "HAYAT" sign
  match the FERAH/HAYAT CADDE site plan. No relation is shown until confirmed.

## 4. Content verification requirements

The new owner questions are in CONTENT_INVENTORY §5:

- whether galleries 4 and 6 are the same building;
- who drew the plans, and whether they may be published;
- clean drawings for gallery 8;
- whether galleries 1 and 3 are now completed;
- which projects to feature on the homepage.

Every optional fact (`type`, `location`, `status`, `completionYear`, `description`, `related`)
renders only when VERIFIED, and a test asserts that none is verified yet.

## 5. Portfolio, detail pages and viewer

**`/projeler/`**

- A dark header with the verified intro and the counts "6 fotoğraflı proje · 4 proje çizimi".
- An editorial grid in reading order (7+5, 5+7, 6+6; no masonry).
- A white "Proje çizimleri" archive with drawings on white.
- A contact band at the end.
- **No filters**: there is no verified type, status or year to filter by, and inventing
  categories would be fabrication.

**`/projeler/proje-NN/`**

- Breadcrumbs, the title, an "İnşaat süreci" eyebrow when applicable, a neutral factual sentence,
  photo/drawing counts, and a "Proje hakkında bilgi alın" link.
- A cinematic hero (16:9, 21:9 from 1024 px; eager and high priority).
- A "Proje hakkında" section that renders only when a verified description or facts exist (none
  yet), so no empty filler appears.
- Photos in 2-up grids with portraits paired; plans uncropped on white.
- "Diğer projelerimiz": 3 other public photographed projects. It is not called "similar".
- A contact band with no sale or availability claims.
- Withheld gallery 8 renders a `lang="tr"` redirect document to `/projeler/` with no images.

**Viewer (`Lightbox.astro`, about 2 KB of JS)**

- Built on a native `<dialog>` with `showModal()`: focus trap, inert background, Escape.
- Previous/next buttons (side on tablet and up, bottom on phones, 44 px). ←/→ wrap around; Home and
  End jump to the ends.
- Swipe at 50 px or more (touch and pen).
- A polite live counter ("Fotoğraf 2 / 5", "Çizim 4 / 5") and a caption equal to the alt text.
- Focus restored to the thumbnail on close. Page scroll locked while open.
- A white sheet for drawings. No animation.
- **No-JS:** thumbnails are real links to 1280/2048 px derivatives.

## 6. Accessibility

- **axe-core 4.14.0 on the production build:**
  - Homepage, `/projeler/` and project pages 01, 03, 05, 06, 10 and 11 at 375, 1280 and 1920 px:
    **0 violations, 0 incomplete.**
  - All other routes at 375 and 1280 px: clean.
  - Viewer **open** (photos at 375 and 1280, plans at 1280): clean.
  - **The Stage 3 "incomplete" results on the homepage at 1280–1920 px are resolved** by the
    build-time crop.
- **Keyboard and real browser:**
  - Enter on a thumbnail opens the viewer with focus on Close.
  - → gives 2/4, ←← gives 4/4 (wrap), Home gives 1/4.
  - Tab ×6 stays inside the dialog.
  - Escape closes it and restores focus to the thumbnail. The scroll lock toggles.
  - Re-verified after the final refactor.
- **Swipe** via synthetic touch pointer events: left → next, right → previous, a 20 px move is
  ignored.
- **Structure:**
  - Viewer links carry descriptive labels ("<alt> — büyüt (n/N)"), and the thumbnail images are
    `alt=""` to avoid duplicate announcements.
  - Each page has one viewer.
  - Heading outline is enforced.
- **Not done:** screen readers (VoiceOver, NVDA), real touch devices, and reduced-motion emulation.
  The viewer has no animation by design. Full WCAG conformance is not claimed.

## 7. Responsive visual QA

- **Widths:** 64 page-and-width combinations (8 routes × 320, 375, 390, 768, 1024, 1280, 1440,
  1920): **0 overflow**, checked by `scrollWidth` and per-element bounding boxes.
- **Visual checks:**
  - Projects index at 1440 and 375.
  - Detail with many images (06), few (05), construction portraits (01), and plans only (11).
  - Viewer open in photo and plan modes at 1440 and 375.
  - Homepage featured section, withheld redirect (08), mobile menu and footer.
- **Fixed during QA:**
  1. Galleries 06 and 04 sat side by side (possibly one building twice), so the order was changed.
  2. The detail summary section was an empty band with no verified facts. Its content moved into
     the header, and the section now appears only with verified content.
  3. The desktop viewer arrows had the class conflict from Stage 2 again, so they got wrappers.
  4. **Image-service hash bug:** the stock sharp service has no `propertiesToHash`, so all
     un-cropped variants of one source shared a file name (favicon PNG vs. logo WebP). Defaults are
     now listed explicitly.
  5. `verify-dist` false positives: the dialog count matched the script's selector string, and the
     redirect detection was hard-coded. Both are fixed, and both checks were then mutation-tested.

## 8. Image optimisation (build-time crop)

- `src/lib/image-service.ts` wraps Astro's sharp service. It removes measured letterbox rows with
  `extract()` (lossless PNG intermediate) before the normal resize and encode, so the HTML
  `width`/`height` and `srcset` describe the trimmed picture.
- Crop metadata: `src/data/image-crops.json` (34 files: drone stills 170/96 px; plans 2–6 bottom
  bands of 315–342 px). It is generated by `scripts/measure-letterbox.mjs`; `--check` fails if the
  file is stale.
- Rules:
  - Bands thinner than 0.5% of height (drawing frames) are never cropped.
  - The crop never exceeds the measured band plus 2 px.
  - On each cropped side the first kept row must be picture.
  - Every removed row must be black.
- Verified in the output: the hero derivative is 1280 × 719 (3024 × 1698 ratio), its first row is
  sky (mean 190), and no `data-letterbox` attribute appears in HTML.
- Tests: pixel re-measurement for all 34 entries, the staleness check, an end-to-end service crop on
  a synthetic image, HTML-attribute stripping, and the rule that every publicly shown image with a
  band must be listed. Mutation (top 170 → 200) was caught by three assertions.

## 9. Performance (measured from built HTML and `srcset` resolution, gzip text)

| Page                             | Viewport           | Hero                         | Initial transfer | Fully scrolled |
| -------------------------------- | ------------------ | ---------------------------- | ---------------- | -------------- |
| `/`                              | 390 @2x / 1440 @2x | 62 / 95 KB                   | 198 / 230 KB     | 710 / 885 KB   |
| `/projeler/`                     | 390 @2x / 1440 @2x | 102 / 164 KB (+1 eager card) | 322 / 383 KB     | 872 / 970 KB   |
| `/projeler/proje-06/` (6 photos) | 390 @2x / 1440 @2x | 83 / 134 KB                  | 218 / 269 KB     | 974 / 1,297 KB |
| `/projeler/proje-05/` (2 photos) | 390 @2x / 1440 @2x | 84 / 124 KB                  | 219 / 259 KB     | 568 / 665 KB   |

- **JS:** 812 B on most pages and 2,709 B on project pages (menu plus viewer), all inline. Budget is
  8 KB.
- "Fully scrolled" excludes the viewer's large images, which load only when opened (largest file
  502 KB).
- **CLS:** every `<img>` has width and height (enforced), and all media sits in fixed-ratio boxes.
- **Build output** (not transfer): `dist/` is 33.1 MB, up from 19.6 MB, because of the
  viewer-quality derivatives. I trimmed viewer widths to 1280 and 2048 after a 37 MB first build.
  The 40 MB budget holds, and the largest file is 0.5 MB.
- No Lighthouse score or field data was measured (Stage 7).

## 10. Automated validation

| Check                    | Result                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `npm run validate`       | pass                                                                                 |
| ESLint (jsx-a11y strict) | 0 problems. Ten non-null assertions were replaced with real guards, no rule disabled |
| `astro check`            | 65 files, 0 errors                                                                   |
| `tsc`                    | pass                                                                                 |
| Vitest                   | **12 files, 164 tests** (Stage 3: 131)                                               |
| Build                    | 18 pages, including 11 project routes                                                |
| `verify-dist`            | all checks passed                                                                    |

New and changed tests:

- `tests/projects.test.ts` (new):
  - curation partitions every legacy gallery;
  - rights exclusions;
  - withheld projects expose nothing;
  - the manifest equals the exclusions;
  - withheld media is unregistered;
  - no VERIFIED facts and no unconfirmed relations;
  - construction labelling;
  - portfolio completeness, "Diğer projelerimiz" rules, homepage features.
- `tests/letterbox.test.ts` (rewritten): pixel re-measurement, staleness, the service crop, and
  attribute stripping.
- `tests/media.test.ts`: now iterates _publicly shown_ images. Withheld images are intentionally
  unregistered and asserted separately, so the test is stricter, not weaker.
- `verify-dist`:
  - withheld-media scan;
  - all 11 project pages present, with withheld ones as image-free redirects to `/projeler/`;
  - exactly one viewer per page, with labelled viewer links;
  - plan thumbnails never cover-cropped;
  - generic redirect detection with a target check;
  - JS budget redefined: first-party only, ≤ 8 KB.
- The viewer's keyboard and swipe behaviour was verified in a real browser, not in CI (no headless
  browser dependency yet; Stage 7).

## 11. Files

- **New:**
  - `src/components/{ProjectGallery,Lightbox}.astro`
  - `src/lib/image-service.ts`, `src/lib/image-crop-option.ts`
  - `src/data/{image-crops,withheld-media}.json`
  - `scripts/measure-letterbox.mjs`
  - `tests/projects.test.ts`
  - `docs/{PROJECT_MEDIA_REVIEW,STAGE_4_REPORT}.md`
- **Modified:**
  - `src/types/content.ts`, `src/data/{projects,home}.ts`, `src/lib/media.ts`
  - `src/components/{MediaFrame,ProjectCard}.astro`, `src/layouts/BaseLayout.astro`
  - `src/pages/projeler/{index,[slug]}.astro`, `src/pages/index.astro`
  - `astro.config.ts`: `image.service` entrypoint only. Hosting, output and site settings are
    unchanged
  - `scripts/verify-dist.mjs`
  - `tests/{letterbox,media,home}.test.ts`
  - `package.json` and lock: `sharp@0.35.5` added as an exact devDependency, the same version Astro
    already ships, now imported directly
  - `docs/{CONTENT_INVENTORY,MEDIA_INVENTORY,ARCHITECTURE,DESIGN_SYSTEM,ROADMAP}.md`
- **Untouched:** all legacy HTML, CSS and media, `public/` redirects, `CNAME`, `main`, and hosting.

## 12. Remaining issues for Stage 5

1. Owner answers are needed for names, facts, galleries 4/6, drawing rights and the gallery 8
   drawings. When names arrive, introduce name-based slugs, remove `noindex` and add them to the
   sitemap.
2. The homepage may show one building twice (hero from gallery 4, featured card from gallery 6).
3. The viewer is not yet covered by automated browser tests (Playwright plus axe in Stage 7).
4. Build output is 33 MB of 40 MB. Future galleries should reuse the viewer widths rather than add
   more.
5. Stage 5 (corporate pages) should reuse `PageHeader`, `Section`, `MediaFrame` (crops apply
   automatically), and the "only verified facts" pattern from the project facts list.
