# Architecture

## 1. Summary

| Concern                   | Choice                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework                 | **Astro 7.4.10**, `output: 'static'` (pure static site generation)                                                                         |
| Language                  | TypeScript 6.0.3, `astro/tsconfigs/strictest` (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, …)                        |
| Styling                   | **Tailwind CSS 4.3.5** through the official `@tailwindcss/vite` plugin. Tokens are in a CSS `@theme`                                       |
| Fonts                     | Self-hosted `@fontsource-variable/manrope` and `cormorant-garamond` (OFL)                                                                  |
| Images                    | `astro:assets` (sharp) at build time: resized WebP with `srcset`, originals never shipped                                                  |
| SEO                       | Per-page title/description/canonical, Open Graph, JSON-LD `GeneralContractor`, `@astrojs/sitemap`, `robots.txt`                            |
| Runtime JS                | One small module (mobile `<dialog>` menu wiring + header scroll shadow, ~1 KB) and a one-line inline `js` class flag. No framework runtime |
| Backend / DB / CMS / auth | **None**                                                                                                                                   |
| Runtime                   | Node ≥ 22.23.4 (`.nvmrc` → 24) for development and build only                                                                              |

Dependencies are pinned to exact versions (`--save-exact`) and a lockfile is committed.

## 2. Directory layout

```
.
├── astro.config.ts          Static output, site URL, sitemap, Tailwind Vite plugin, dev-only showcase integration
├── src/
│   ├── layouts/             BaseLayout.astro: <head> SEO, skip link, header, main, footer
│   ├── components/          Design-system components (21) — catalogue in DESIGN_SYSTEM.md §8
│   ├── dev/                 DesignSystem.astro — showcase, injected ONLY for `astro dev` (§9)
│   ├── pages/               File-based routes (see §3)
│   ├── data/                Typed content: company, navigation, services, projects, activities, legacy-redirects, home (S3 curation)
│   ├── types/content.ts     Content model, incl. Unverified<T> (VERIFIED | NEEDS_CONFIRMATION | UNKNOWN)
│   ├── lib/                 media.ts (image/video registry), contact.ts (tel/mailto/WhatsApp), seo.ts
│   └── styles/global.css    Tailwind import, @theme design tokens, base layer
├── public/                  Copied verbatim: legacy redirect stubs, robots.txt
├── tests/                   Vitest: content, redirects, navigation, components, media, letterbox, tokens, showcase
├── scripts/verify-dist.mjs  Post-build static output verification
├── docs/                    This documentation
└── (legacy site, unchanged) index.html, anaEkran.html, about.html, projeler.html, faaliyet.html,
                             *.css, img/, projects-img/, slider-photos/, logos/, mini-videos/,
                             Faaliyetler-img/, CNAME
```

The legacy site stays at the repository root, untouched, until its retirement is approved
(ROADMAP, Stage 8). Astro ignores it: routes come only from `src/pages/`, and root files are not
public assets. Prettier and ESLint are configured to ignore it.

## 3. Routes

Turkish, lowercase, ASCII-only, hyphenated slugs with trailing slashes. They are stable and readable
in Turkish and avoid percent-encoded characters in shared links.

| Route               | File                                | Status in Stage 1                                                  |
| ------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| `/`                 | `pages/index.astro`                 | Working homepage with real legacy copy and an optimised hero photo |
| `/hakkimizda/`      | `pages/hakkimizda.astro`            | Legacy company text, mission and vision. Founder bio pending       |
| `/hizmetler/`       | `pages/hizmetler.astro`             | Three legacy services                                              |
| `/projeler/`        | `pages/projeler/index.astro`        | 11 legacy galleries with provisional numbering                     |
| `/projeler/[slug]/` | `pages/projeler/[slug].astro`       | One page per gallery (`noindex` until names are confirmed)         |
| `/faaliyetlerimiz/` | `pages/faaliyetlerimiz.astro`       | Two legacy activities                                              |
| `/iletisim/`        | `pages/iletisim.astro`              | Phone, WhatsApp, e-mail, Instagram, address, map                   |
| 404                 | `pages/404.astro` → `dist/404.html` | GitHub Pages serves this automatically                             |

Project slugs are provisional (`proje-01` … `proje-11`). When names are confirmed they become
name-based (for example `/projeler/ferah-evler/`), with a redirect stub from the provisional slug
if it has ever been public.

### Future English localisation (planned, not implemented)

- Use Astro's built-in i18n routing (`i18n: { defaultLocale: 'tr', locales: ['tr', 'en'],
routing: { prefixDefaultLocale: false } }`). Turkish stays at `/` and English lives under `/en/`
  (`/en/about/`, `/en/projects/`, …).
- `src/data/*` gains per-locale string fields (`{ tr: string; en?: string }`) only for content that
  is actually translated. Untranslated pages are not generated rather than shown half-translated.
- `hreflang` alternates are added in `BaseLayout`.
- No i18n library is needed. This keeps Stage 1 free of a localisation framework.

## 4. Legacy URL compatibility

The live site exposes `/`, `/index.html`, `/anaEkran.html`, `/about.html`, `/projeler.html` and
`/faaliyet.html`. GitHub Pages cannot send HTTP 301s, so each legacy file is preserved as a static
redirect document in `public/`:

| Legacy URL            | New URL             | Mechanism                                                                  |
| --------------------- | ------------------- | -------------------------------------------------------------------------- |
| `/` and `/index.html` | `/`                 | The new homepage is emitted at `dist/index.html`, so no redirect is needed |
| `/anaEkran.html`      | `/`                 | `public/anaEkran.html`                                                     |
| `/about.html`         | `/hakkimizda/`      | `public/about.html`                                                        |
| `/projeler.html`      | `/projeler/`        | `public/projeler.html`                                                     |
| `/faaliyet.html`      | `/faaliyetlerimiz/` | `public/faaliyet.html`                                                     |

Each stub combines `<meta http-equiv="refresh" content="0; url=…">`, `<link rel="canonical">` to
the new absolute URL, a `location.replace()` that preserves query and hash, and a visible fallback
link. Google treats an instant meta refresh plus canonical as a permanent redirect. Coverage is
enforced by `tests/redirects.test.ts`: every legacy `*.html` at the repo root must have a stub, and
every target route must exist. On a host that supports real redirects (Netlify, Cloudflare Pages),
the same table in `src/data/legacy-redirects.ts` can generate a `_redirects` file instead.

Legacy media URLs (for example `/img/Eyfa-yapi-resim2.png`) are not preserved, because only the
site embedded them. If inbound links to media are discovered, add those specific files to `public/`.

## 5. Content model and the no-invention rule

- All content is build-time TypeScript data in `src/data/`, typed by `src/types/content.ts`.
- Uncertain values use `Unverified<T>`:
  `VERIFIED` (with `source`), `NEEDS_CONFIRMATION` (with `source` and `note`), or `UNKNOWN`.
- UI helpers (for example `projectDisplayName`) show only VERIFIED values and fall back to neutral
  labels ("Proje 01").
- `StageNotice` marks pending content visibly. It must be replaced by confirmed content, never by
  invented copy.
- `tests/content.test.ts` asserts that company facts, services, activities and corporate copy are
  verbatim from the legacy HTML. It also asserts that the project galleries match `projeler.html`
  image for image, in order, and that no project name is marked VERIFIED.

An Astro Content Collection (Markdown/MDX per project) is the planned upgrade once real
per-project descriptions exist (Stage 4). Stage 1 uses plain TS modules because there is no prose
to author yet.

## 6. Media pipeline

`src/lib/media.ts` registers the legacy files through `import.meta.glob` with an **explicit
allowlist**. Astro copies the original of every imported-but-untransformed image into `dist/`, so a
broad glob would ship unused 2 MB PNGs. That happened during development (71 MB build) and was fixed.
`legacyImage(path)` throws at build time for unknown paths, so typos fail the build.
`tests/media.test.ts` fails if a registered image is not used anywhere. Pages use `<Image>` with
`widths` and `sizes` and a capped `width` for the fallback `src`.

`logos/emlakçi-logo.png` is deliberately not registered (Unicode duplicate, see PROJECT_AUDIT §6).

## 7. Backend-free design

| Need               | Static solution                                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project content    | Build-time data in `src/data/projects.ts` (Content Collection later)                                                                                                 |
| Galleries          | Pre-generated responsive images. A lightbox (Stage 4) will be a small vanilla island                                                                                 |
| Category filtering | Build-time categories plus a client-side filter over `data-*` attributes. No API                                                                                     |
| Contact            | `tel:`, `mailto:` and WhatsApp click-to-chat (`https://wa.me/905326868829?text=…`) built by `src/lib/contact.ts`, which validates E.164 and URL-encodes Turkish text |
| Map                | Google Maps embed on `/iletisim/` only (lazy, titled). A static map image or consent gate is an option for Stage 6                                                   |
| SEO                | Static meta, JSON-LD, sitemap, robots                                                                                                                                |

There is no fake contact form. If a form is ever required, see DEPLOYMENT_PLAN §6 for a separately
reviewed option.

## 8. Quality gates

| Command                | What it checks                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format:check` | Prettier (with Astro and Tailwind class-sorting plugins)                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `npm run lint`         | ESLint 10 flat config: `@eslint/js`, `typescript-eslint` strict, `eslint-plugin-astro` + **jsx-a11y strict** (S2)                                                                                                                                                                                                                                                                                                                                                                                                       |
| `npm run check`        | `astro check`: type-checks `.astro` and `.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `npm run typecheck`    | `astro check` + `tsc --noEmit`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `npm test`             | Vitest (113 tests): content integrity, redirects, navigation destinations, components via Astro Container API, media registry, letterbox pixels, token contrast (light + dark tone), showcase exclusion, helpers                                                                                                                                                                                                                                                                                                        |
| `npm run build`        | Static production build                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `npm run verify:dist`  | Required routes, `lang="tr"`, title, description, exactly one `<h1>`, `<main>`, no broken internal links or `srcset`s, size budgets; (S2) skip link, header, primary nav, menu trigger ARIA → existing `<dialog>`, footer nav, unique ids, `alt` on every image, `rel=noopener` on new-tab links, no dev showcase in output or sitemap; (S3) no skipped heading levels, width/height on every `<img>`, no external scripts and ≤ 2 KB inline JS per page, homepage: one eager high-priority hero, all other images lazy |
| `npm run validate`     | All of the above in sequence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

Browser checks are not yet part of `npm run validate`. In Stage 2, axe-core (devDependency) was run
manually in a real browser against every production route at 320/768/1280 px (results in
`docs/STAGE_2_REPORT.md`). Automating that (Playwright + axe + Lighthouse CI) is Stage 7.

## 9. Shared UI architecture (Stage 2)

- **Tokens → semantic tokens → tones.** `@theme static` emits every token as a CSS custom
  property; components use semantic names (`text-ink`, `border-line`, `text-accent-text`); the
  `.tone-dark` class remaps them, so one component works on light and dark surfaces.
- **Layout primitives.** `Section` (tone + rhythm + container), `PageHeader` (inner-page intro),
  `SectionHeading`; pages compose these instead of ad-hoc wrappers.
- **Header menu = native `<dialog>.showModal()`**: focus containment, inert background, Escape and
  top-layer stacking come from the browser; ~40 lines of script handle `aria-expanded`, closing on
  link selection/resize and focus restoration. Progressive enhancement: without JS the trigger is
  hidden (`html.js` flag set inline before paint) and a "Menü" link targets the footer navigation.
- **Media.** `MediaFrame` wraps `astro:assets` `<Image>` in a fixed-ratio box (no CLS), trims baked-in
  letterbox bars from a measured table, and renders a neutral placeholder for `src={null}`; unknown
  paths still fail the build.
- **Design showcase.** `src/dev/DesignSystem.astro` is outside `src/pages`; the
  `eyfa-dev-showcase` integration in `astro.config.ts` calls `injectRoute('/dev/tasarim-sistemi')`
  only when `command === 'dev'`. Production exclusion is enforced twice (unit test + dist check).

## 10. Homepage architecture (Stage 3)

- `src/pages/index.astro` composes Stage 2 components only, plus three backwards-compatible
  props: `MediaFrame aspect="feature"|"fill"` and `quality`; `ProjectCard image/aspect/size/pendingNote`;
  `ContactCTA image`.
- **Content vs curation.** Verified copy lives in `src/data/company.ts` (`legacyCopy.*`, with an
  excerpt-provenance test). Editorial choices (which photo and which galleries) live in
  `src/data/home.ts`, which holds no facts.
- **Performance model.** Only the hero and header logo load eagerly. Everything else is lazy, with
  fixed-ratio boxes. Measured values are in `STAGE_3_REPORT.md` §6, computed from the built HTML
  by resolving each `srcset` for a given viewport and DPR.

## 11. Portfolio architecture (Stage 4)

- **Data model** (`src/types/content.ts`, `src/data/projects.ts`):
  - `gallery` is the immutable legacy mirror.
  - `curation` holds hero, photos, plans, excluded-with-reason, and alt overrides.
  - `visibility` is public or withheld.
  - Optional `Unverified<T>` facts render only when `VERIFIED`.
  - Helpers: `portfolio()` (editorial order), `projectPhotos`, `projectPlans`, `publicImages`,
    `showsConstruction`, `otherProjects`.
  - **To update a project:** edit `src/data/projects.ts` only. No page markup changes are needed.
- **Routes:** `/projeler/` and `/projeler/proje-NN/` (11 generated). Withheld projects render a
  `lang="tr"` meta-refresh document to `/projeler/`. Detail pages stay `noindex` and out of the
  sitemap until names are confirmed.
- **Build-time image crop** (`src/lib/image-service.ts`):
  - It wraps `astro/assets/services/sharp`.
  - It adds a `data-letterbox="<top>,<bottom>"` option, applied with `sharp.extract()` (lossless
    intermediate) before the stock resize and encode.
  - `getHTMLAttributes` strips the option. `propertiesToHash` includes it, _plus Astro's defaults_:
    the stock sharp service defines none, which caused filename collisions during development.
  - `croppedImage(path)` in `src/lib/media.ts` returns the source, the cropped intrinsic size and
    the option, so `width`, `height` and `srcset` describe the trimmed picture.
  - Crop data comes from `scripts/measure-letterbox.mjs` (with `--check` to detect staleness), and
    `tests/letterbox.test.ts` re-measures the pixels.
- **Viewer:** `Lightbox.astro` is one native `<dialog>` per page plus about 2 KB of script.
  `ProjectGallery.astro` renders thumbnail links to 1280/2048 px derivatives, so the images still
  open without JS.
- **JS budget:** `verify-dist` allows first-party `/_astro/*.js` modules or inline scripts, at most
  8 KB per page. Measured: 812 B on most pages, 2,709 B on project pages.
- **Withheld media guard:** `src/data/withheld-media.json`, with negative globs in `media.ts`, a
  unit test and a `dist/` filename scan.

## 12. Corporate content architecture (Stage 5)

- `src/data/corporate.ts` holds About-page copy as `CopyBlock`s (`text`, `provenance`, `basis`) and
  the curated images for About and Services. `src/data/services.ts` has `provenance` and `basis` per
  service. `src/data/activities.ts` has `visibility`, `imagePublic` and the reasons.
- **Grounding tests** (`tests/corporate.test.ts`):
  - Every basis excerpt must exist verbatim in about, index or faaliyet.
  - Editorial text may not contain a number missing from its basis.
  - Credential, award and metric vocabulary is banned, with a self-check that this rule catches
    invented claims.
  - Biography details are banned.
  - Service and About images are distinct, registered and public.
- **`verify-dist` (built HTML):**
  - No founder-biography detail and no award or credential wording on any page.
  - The withheld theatre activity is absent.
  - All four service anchors exist.
- To publish a confirmed fact later: add it to the data with `provenance: 'legacy'` or a written
  source, and update the corresponding test expectation in the same change.

## 13. Contact architecture (Stage 6)

- **Single source:** `contact` in `src/data/company.ts` derives every channel (mobile, landline,
  e-mail and enquiry mailto, WhatsApp with default and per-project messages, Instagram, address,
  directions URL, map embed) from the verified `company` record. Components and pages import
  `contact`. `tests/contact.test.ts` fails if a phone number or e-mail is hard-coded elsewhere.
- **Helpers** (`src/lib/contact.ts`):
  - `telHref` and `mailtoHref`.
  - `whatsappHref`: always uses `encodeURIComponent`.
  - `sanitizeMessage`: strips Unicode `Cc`/`Cf` characters (newlines, zero-width, bidi overrides),
    collapses whitespace and caps the length.
  - `projectEnquiryMessage`: uses the public label only, and falls back to the default message.
  - `mapsDirectionsHref`: the keyless Google Maps URLs API.
- **Map consent** (`MapConsent.astro`): the iframe lives inside a `<template>`, whose contents are
  inert, so nothing contacts Google until the visitor clicks "Haritayı yükle". A small inline
  script then:
  - clones the iframe into place;
  - announces "Google Haritalar yüklendi." through a polite live region;
  - moves focus to the map.
    Without JavaScript the button stays hidden and the directions link remains.
- **Structured data** (`BaseLayout`): `founder`, `hasMap` and two `ContactPoint`s added. Opening
  hours, geo coordinates, `areaServed`, ratings and certifications are deliberately absent.
- **`verify-dist` (built HTML).** On every page:
  - no live `<iframe>` (template contents excluded) and no `<form>`;
  - no third-party `img`, `script`, `source`, `video` or `audio`;
  - no third-party stylesheet, preload, preconnect or dns-prefetch;
  - every `tel:`, `wa.me` and `mailto:` link matches the verified data.

  On `/iletisim/` it also requires the load button, the templated iframe and the directions link.
  Mutation tests confirm that a planted iframe, form, unverified number or tag-manager script each
  make it fail.

## 14. SEO, security and quality gates (Stage 7)

- **Metadata** (`BaseLayout`): `og` (key into `src/data/og.ts`), `noindex` (→ `noindex, follow`)
  and `canonical={false}` (404). `SITE_INDEXING=off` at build time makes every page `noindex` and
  makes `robots.txt` (`src/pages/robots.txt.ts`) disallow crawling (`src/lib/seo.ts`).
- **Share images:** `src/pages/og/[key].jpg.ts` composes the images with sharp at build time from
  registered public photos + the trimmed logo. Logo-only pages share `og/default.jpg`.
- **CSP** (`astro.config.ts` → `security.csp`): Astro hashes every emitted script and `<style>`
  into a `<meta http-equiv="content-security-policy">`. Other directives:
  - `default-src 'self'`, `frame-src https://www.google.com` (click-to-load map only);
  - `object-src 'none'`, `form-action 'none'`, `base-uri 'self'`;
  - `style-src-attr 'unsafe-inline'`, for two style attributes: image focal point and logo size.

  Adding an inline script needs no manual hash: Astro computes it. Adding a third-party script
  requires a directive change and fails the browser tests until then.

- **Fonts:** latin files from fontsource plus Turkish subsets in `src/assets/fonts/`, regenerated
  with `npm run fonts:subset`. Metric-matched fallback faces sit in `global.css`. Fonts are always
  emitted as files (`vite.build.assetsInlineLimit`).
- **Styles:** inlined into each page (`build.inlineStylesheets: 'always'`).
- **Gates:**

  | Command              | What it runs                                                                               |
  | -------------------- | ------------------------------------------------------------------------------------------ |
  | `npm run validate`   | format, lint, types, unit tests, build, `verify-dist` (with S7 SEO/CSP/hygiene checks)     |
  | `npm run test:e2e`   | build, then Playwright desktop + mobile: routes, interactions, network isolation, CSP, axe |
  | `npm run lighthouse` | local Lighthouse, 3 runs per page, median (needs a running preview)                        |

## 15. Delivery pipeline (Stage 8)

- `.github/workflows/ci.yml` runs on PRs to `main`, pushes to `redesign/**` and on demand:
  - validate, typecheck and Playwright;
  - uploads the production `dist/` and a `SITE_INDEXING=off` staging build as private artifacts.

  It never publishes.

- `.github/workflows/deploy.yml` runs on manual dispatch only:
  - `main` only, with the typed confirmation `eyfayapi.net`;
  - the same gate as CI, then `upload-pages-artifact` → `deploy-pages` behind the `github-pages`
    environment (required reviewer).
- Permissions: the workflow-level default is none in deploy and `contents: read` in CI. `deploy`
  holds `pages: write` + `id-token: write` only.
- Actions are pinned to commit SHAs (the version is in a comment).
- `scripts/verify-dist.mjs --dist <dir>` verifies any output folder (used for the staging build).
- `.nojekyll` at the root: branch-based Pages builds serve files verbatim. This keeps the legacy
  site safe between merge and source switch, and makes rollback work.
