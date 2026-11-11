# Stage 2 Report: Premium Design System and Shared UI

- **Branch:** `redesign/eyfa-professional`
- **Base:** Stage 1 commit `06f997d`
- **Date:** 2026-11-10
- **Status:** complete. The commit is local only: not pushed, not merged, not deployed.

## 1. Summary

The Stage 1 foundation is now a coherent design system. It adds tone-aware tokens, a sticky header
with an accessible `<dialog>` mobile menu, a redesigned footer, 21 documented components and a
development-only showcase. Every existing route was migrated to the shared system. Content is
unchanged apart from one footer positioning line, which is condensed from `about.html` and
test-guarded. Project slugs and legacy redirects are unchanged.

## 2. What was built

### Tokens (`src/styles/global.css`)

- **Colour.** The brand palette is unchanged. New semantic tokens: `surface*`, `ink*`, `accent*`,
  `on-accent`, `accent-text`, `line`, `line-strong`, `focus`. The **`.tone-dark`** scope remaps
  them for charcoal surfaces.
- **Type.** Every size now carries a paired line-height. Tracking tokens were added.
- **Layout.** Header-height spacing tokens and a fluid grid gap.
- **Aspect ratios.** landscape, photo, wide, cinema and portrait.
- **Shadows.** card, raised and header.
- **Layering.** A z-index scale (`--z-raised/header/overlay/skip-link`).
- **Motion.** Easing tokens, a CSS-only `.reveal`, and a transform-based `.link-underline`.
- `@theme static` emits every token, because `.tone-dark` reads them through `var()`.

### Components (`src/components/`)

| New                                                                                                                                                                                                   | Rewritten                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Icon`, `IconButton`, `TextLink`, `BrandLogo`, `Section`, `Eyebrow`, `SectionHeading`, `PageHeader`, `Breadcrumbs`, `MediaFrame`, `ProjectCard`, `ServiceCard`, `ContactCTA`, `Divider`, `EmptyState` | `Button` (3 variants, 3 sizes, icons, disabled, ARIA pass-through), `SiteHeader`, `SiteFooter`, `ContactLinks`, `StageNotice`, `Container` (types) |

The catalogue with props and usage is in `DESIGN_SYSTEM.md` §8.

### Pages migrated

These pages now use `PageHeader`/`Section` and the shared components: `/`, `/hakkimizda/`,
`/hizmetler/`, `/projeler/`, `/projeler/[slug]/` (11 pages), `/faaliyetlerimiz/`, `/iletisim/`
and `404`. The homepage keeps its Stage 1 structure; its full composition is Stage 3.

### Showcase

`src/dev/DesignSystem.astro` is injected as `/dev/tasarim-sistemi/` only under `astro dev`.

### Tooling

- **New devDependencies (exact versions):**
  - `axe-core@4.14.0` (MPL-2.0), used for in-browser audits.
  - `eslint-plugin-jsx-a11y-x@0.2.0`, which is the ESLint 10-compatible jsx-a11y used by
    `eslint-plugin-astro`'s `jsx-a11y-strict` config.
- No runtime dependencies were added.

## 3. Navigation behaviour

| Width        | Behaviour                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| ≥ 1280 px    | Logo · 5 links · phone link · gold "İletişim" button                                                                      |
| 1024–1279 px | Same, without the phone link (it is in the footer and the mobile menu)                                                    |
| < 1024 px    | Logo · 44 px menu button → full-screen modal `<dialog>`: numbered links (current one in gold), phone, WhatsApp and e-mail |

**Keyboard and ARIA, tested manually in the browser:**

- Enter on the trigger opens the menu, and focus lands on the close button.
- Tab cycles inside the dialog, because the background is inert.
- Escape closes it, `aria-expanded` returns to `false`, and focus returns to the trigger.
- Page scroll is locked while the menu is open (`html` gets `overflow: hidden`).
- Selecting a link closes the dialog. Resizing to desktop width closes it too.
- Without JS, the trigger is hidden and a "Menü" link points to the footer navigation.

## 4. Footer structure

The footer has three columns (5 / 3 / 4 of 12):

- **Brand:** logo, the verified headline and the positioning line.
- **Links:** Kurumsal and Çalışmalarımız (includes anchors to the three services).
- **İletişim:** both phones, WhatsApp, e-mail, Instagram and address.

Below them sit the legal line and "Başa dön". On mobile the columns stack and the link groups sit
two-up. There are no certifications, figures or legal claims.

## 5. Responsive QA (browser pane, Chromium)

Widths checked: **320, 375, 390, 768, 1024, 1280, 1440 and 1920 px**.

- **Horizontal overflow:** 0 px at 320 px on all 10 routes, including the showcase and the 404.
  This was checked through both `scrollWidth` and per-element bounding boxes.
- **Navigation fit:** the desktop nav fits from 1024 px. The phone link appears from 1280 px.
- **Images:** letterbox bars are trimmed on the hero and cards. Floor plans are contained on white.
- **Console:** no errors on production routes. The only 404s in the dev session came from my own
  deliberate requests to non-existent URLs, made to test the 404 page.

## 6. Problems found during QA and fixed

| #   | Problem                                                                               | Fix                                                                                                 |
| --- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | Headings had body line-height (1.65). `text-(length:--…)` sets the size only          | Switched to token utilities (`text-5xl` …) with paired line-heights, plus a heading fallback of 1.1 |
| 2   | Menu button visible at 1024 px, because the component's `inline-flex` beat `hidden`   | Visibility moved to a wrapper element                                                               |
| 3   | Two logos rendered on mobile (same class conflict)                                    | `BrandLogo` became one element with a responsive height (`lgHeight`)                                |
| 4   | Mobile dialog's computed opacity stuck at 0 (`@starting-style` fade never progressed) | Open animation removed; robustness wins                                                             |
| 5   | CTA band and footer merged visually, and a decorative rule hugged the viewport edge   | Footer hairline added, rule removed                                                                 |
| 6   | About page prose centred while the header was left-aligned (visible at 1920 px)       | Prose aligned to the content grid                                                                   |
| 7   | axe could not determine contrast for underlined links (gradient background)           | Underline reimplemented as a transformed `::after`. Contrast is now fully machine-verifiable        |
| 8   | Stage 1 focus ring (champagne) was 2.1:1 on ivory, below the 3:1 non-text minimum     | Tone-aware `--color-focus`: champagne-700 on light, champagne on dark. Tested                       |
| 9   | Baked-in black letterbox bars on 27 drone stills                                      | Measured trim table plus automatic trimming in `MediaFrame`, verified by a pixel test               |
| 10  | Duplicate breadcrumb landmark label in the showcase                                   | `Breadcrumbs` `label` prop                                                                          |
| 11  | axe "incomplete" on `aria-controls` with `aria-haspopup`                              | `aria-haspopup` removed. `aria-controls` validity is enforced by `verify-dist`                      |
| 12  | Stage 1 media inventory said the logo has a black background                          | Corrected: the PNG is transparent                                                                   |

## 7. Accessibility results

- **axe-core 4.14.0** ran in the browser against the **production build** (`astro preview`).
  - Rule sets: wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa and best-practice.
  - Routes: `/`, `/hakkimizda/`, `/hizmetler/`, `/projeler/`, `/projeler/proje-01/`,
    `/projeler/proje-11/`, `/faaliyetlerimiz/`, `/iletisim/`, `/404.html` and `/projeler.html`
    (which followed its redirect).
  - Widths: 320, 768 and 1280 px.
  - Result: **0 violations and 0 incomplete in all 30 runs.** The only exclusion was `frame-tested`
    for the third-party Google Maps iframe, whose contents axe cannot inspect.
- The dev showcase was also scanned at 375 and 1280 px, with 0 violations after fix #10.
- **Manual keyboard checks:**
  - The skip link is the first tab stop.
  - Menu open, cycle, Escape and focus restore work as in §3.
  - Project cards are a single tab stop each, with a visible whole-card focus ring.
  - The footer focus ring is visible on dark.
- **Static:** jsx-a11y strict lint passes. I confirmed the rules are active with a deliberately
  broken probe file, which raised 4 errors.
- **Not done:** no screen-reader testing (VoiceOver or NVDA), no real-device touch testing, and
  reduced-motion behaviour was checked by code review only, because the browser tool cannot
  emulate the media query. **Full WCAG conformance is therefore not claimed.**

## 8. Automated validation (final run)

| Check                              | Result                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| `prettier --check .`               | pass                                                                                  |
| `eslint .` (incl. jsx-a11y strict) | pass, 0 problems                                                                      |
| `astro check`                      | 57 files, 0 errors, 0 warnings, 0 hints                                               |
| `tsc --noEmit`                     | pass                                                                                  |
| `vitest run`                       | **10 files, 113 tests passed**                                                        |
| `astro build`                      | 18 pages                                                                              |
| `verify-dist`                      | 22 HTML files, 303 files, 18.8 MB, all checks passed                                  |
| `npm audit --omit=dev`             | 0 vulnerabilities                                                                     |
| `npm audit` (all)                  | 11 moderate in the ESLint toolchain via `minimatch`. Unchanged from Stage 1, dev-only |

New tests:

- `navigation.test.ts`: every header and footer destination is a real route; service anchors
  exist; `isCurrentPath`.
- `components.test.ts`: Astro Container API checks of semantics (link vs button, disabled,
  external `rel` and announcement, ARIA pass-through, breadcrumb `aria-current` and JSON-LD,
  heading levels, verified contact hrefs).
- `showcase.test.ts`: the showcase is injected for `dev` and never for `build` or `preview`.
- `letterbox.test.ts`: sharp re-measures the bars of every used photo.
- `design-tokens.test.ts`: added focus-ring and line-strong non-text contrast, plus 5 dark-tone
  pairs.
- `content.test.ts`: the footer positioning line adds no fact.

`verify-dist` additions: skip link, header, primary nav, menu trigger ARIA pointing to a real
`<dialog>`, footer nav, unique ids, `alt` on all images, `rel=noopener` on new-tab links, and the
showcase being absent from `dist` and the sitemap.

**Test quality checks:**

- A mutation (breaking `rel="noopener"` in `Button`) was caught.
- A planted `dist/dev/tasarim-sistemi/index.html` was caught by `verify-dist`.
- A type probe confirmed the `.astro` module shim is not `any`.
- One new `verify-dist` rule initially flagged valid bare `alt` (empty alt) attributes. I corrected
  the rule, which still catches a missing `alt`. No existing test was weakened.

## 9. Files

Created:

- `src/components/{Icon,IconButton,TextLink,BrandLogo,Section,Eyebrow,SectionHeading,PageHeader,Breadcrumbs,MediaFrame,ProjectCard,ServiceCard,ContactCTA,Divider,EmptyState}.astro`
- `src/dev/DesignSystem.astro`
- `tests/{navigation,components,showcase,letterbox}.test.ts`, `tests/astro-modules.d.ts`
- `docs/STAGE_2_REPORT.md`

Modified:

- `src/styles/global.css`, `src/layouts/BaseLayout.astro`
- `src/components/{Button,Container,ContactLinks,SiteHeader,SiteFooter,StageNotice}.astro`
- all pages in `src/pages/`
- `src/data/{navigation,company}.ts`, `src/lib/media.ts`
- `astro.config.ts` (dev-only showcase integration)
- `eslint.config.js` (jsx-a11y), `package.json` and `package-lock.json` (2 devDependencies)
- `scripts/verify-dist.mjs`
- `tests/{helpers,redirects,content,design-tokens}.test.ts`
- `docs/{DESIGN_SYSTEM,ARCHITECTURE,ROADMAP,MEDIA_INVENTORY}.md`

Untouched: every legacy file (HTML, CSS, media, `CNAME`), the `public/` redirect stubs, `main`,
GitHub Pages settings and DNS.

## 10. Outstanding issues

1. The logo exists only as a PNG. A vector master is needed (DESIGN_SYSTEM §14).
2. Floor plans `projects-img/2–6.webp` keep a black bottom bar (contain fit, not trimmed).
3. Project names and facts are still unconfirmed. Cards show "Proje 01 …" and a pending marker.
4. The Google Maps iframe loads on page view on `/iletisim/`.
5. No screen-reader or real-device testing yet (Stage 7).
6. Dev-only image generation makes first loads slow in `astro dev`. Production is unaffected,
   because images are pre-generated.
7. `dist` grew from 18.4 to 18.8 MB, from extra card-image widths. The budget (40 MB, 1 MB per
   file) holds, and no file exceeds 500 KB.

## 11. Recommendation for Stage 3 (homepage)

- Build the homepage from `Section`, `SectionHeading`, `MediaFrame`, `ServiceCard`, `ProjectCard`,
  `ContactCTA` and `TextLink`/`Button`. Avoid one-off styles.
- Decide the hero: the `resim17` still (letterbox already trimmed) or a short muted `mini-videos`
  loop with a poster image and reduced-motion fallback. Consider a transparent-over-hero header
  variant.
- Add a "featured projects" section only for owner-confirmed projects. Until then, use
  `EmptyState` or a neutral gallery teaser, never invented names.
- Add a corporate band built from verified about-copy, using authentic imagery (MEDIA_INVENTORY §7).
- Budget: LCP image ≤ 200 KB, homepage ≤ 1.5 MB without video. Verify with Lighthouse.
