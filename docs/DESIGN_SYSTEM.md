# Design System

The direction is **Premium Hybrid**. It pairs a charcoal and champagne-gold palette with warm
ivory, editorial serif headlines, and authentic architectural photography. The aim is calm and
restraint, closer to an architecture monograph than a property portal.

- Source of truth: `src/styles/global.css` (Tailwind CSS v4 `@theme static`) and `src/components/`.
- Visual reference: run `npm run dev` and open **`/dev/tasarim-sistemi/`**. The showcase is
  development-only and never part of a production build (§12).
- Stage history: Stage 1 created the foundation and Stage 2 built the full system. Changes from
  Stage 1 are marked **(S2)**.

---

## 1. Principles

1. **Quiet confidence.** One accent colour (champagne) used sparingly: a primary button, a short
   rule and the current page. Gold never decorates for its own sake.
2. **Editorial hierarchy.** Cormorant Garamond carries headlines and Manrope carries everything
   functional. Eyebrow labels with a short gold rule introduce sections.
3. **Architecture first.** Real Eyfa Yapı photography and drawings, crisp 1 px lines and small radii.
   No stock imagery, glassmorphism, large gradients or illustration.
4. **Truthful content.** Components render only verified data. Unconfirmed content shows a neutral
   label or a `StageNotice`, never invented copy.
5. **Accessible by construction.** Tone-aware tokens keep contrast valid on both light and dark
   surfaces. Every interactive pattern is keyboard-first.

## 2. Colour tokens

### Brand palette (approved, unchanged)

| Token                  | Hex                               | Role                                                                      |
| ---------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| `charcoal`             | `#151C1E`                         | Dark surfaces (header, footer, hero, page headers), primary text on light |
| `champagne`            | `#C5A46D`                         | Accent fill (primary button, rules, markers). Gold text **on dark only**  |
| `ivory`                | `#F5F2EB`                         | Default page surface                                                      |
| `white`                | `#FFFFFF`                         | Raised cards and the floor-plan mat                                       |
| `champagne-700`        | `#7D6233`                         | Accessible dark gold for small text on light surfaces (≥4.5:1)            |
| `champagne-300`        | `#DCC49A`                         | Hover of gold fills, text selection                                       |
| `ivory-200`            | `#EBE6DA`                         | "Sand" alternate band                                                     |
| `charcoal-800/700/600` | `#1F2729` / `#2B3437` / `#444D50` | Layering on dark                                                          |

### Semantic tokens (S2): use these in components

| Token                     | Light tone (default)      | Dark tone (`.tone-dark`) | Use                                                   |
| ------------------------- | ------------------------- | ------------------------ | ----------------------------------------------------- |
| `surface`                 | ivory                     | charcoal                 | Section background                                    |
| `surface-raised`          | white                     | charcoal-800             | Cards                                                 |
| `surface-sunken`          | ivory-200                 | `#101618`                | Notices, wells                                        |
| `ink`                     | charcoal                  | ivory                    | Primary text, outlines of secondary buttons           |
| `ink-muted`               | `#4A5356`                 | `#C9C4B8`                | Secondary text                                        |
| `accent` / `accent-hover` | champagne / champagne-300 | same                     | Fills                                                 |
| `on-accent`               | charcoal                  | charcoal                 | Text on gold fills                                    |
| `accent-text`             | champagne-700             | champagne                | **Gold text**: eyebrows, current nav item, text links |
| `line`                    | `#D9D2C3`                 | `#3A4447`                | Decorative hairlines, card borders                    |
| `line-strong`             | `#8C8473`                 | `#6F787B`                | Outlines that carry meaning (≥3:1)                    |
| `focus`                   | champagne-700             | champagne                | Focus ring (≥3:1 on its surface)                      |

**How tones work.** `.tone-dark` (applied by `Section tone="dark"`, the header, the footer,
`PageHeader` and `ContactCTA`) redefines the semantic custom properties. The same component, for
example `Button variant="secondary"`, `TextLink` or `ContactLinks`, is therefore correct on ivory
and on charcoal without a variant prop. **(S2)** This fixed a Stage 1 defect: the champagne focus
ring was only 2.1:1 on ivory, below the 3:1 non-text contrast requirement (WCAG 1.4.11).

### Verified contrast (automated in `tests/design-tokens.test.ts`)

| Pair                                              | Ratio             | Requirement                     |
| ------------------------------------------------- | ----------------- | ------------------------------- |
| charcoal / ivory                                  | 15.4:1            | text 4.5:1                      |
| ink-muted / ivory · ivory-200                     | 7.1 · ≥4.5:1      | text                            |
| champagne-700 / ivory · ivory-200 · white         | 5.1 · 4.6 · 5.7:1 | text                            |
| champagne / charcoal                              | 7.3:1             | text                            |
| charcoal / champagne (button label)               | 7.3:1             | text                            |
| ink-inverse-muted / charcoal                      | 9.9:1             | text                            |
| focus / ivory · ivory-200 · white                 | ≥3:1              | non-text                        |
| line-strong / ivory                               | ≥3:1              | non-text                        |
| dark tone: ink, ink-muted, accent-text / charcoal | ≥4.5:1            | text                            |
| dark tone: focus, line-strong / charcoal          | ≥3:1              | non-text                        |
| champagne / ivory                                 | 2.1:1             | **decorative only, never text** |

axe-core found **no** contrast issues on any production route (§11).

## 3. Typography

| Role                                                | Family                            | Weights used    |
| --------------------------------------------------- | --------------------------------- | --------------- |
| Editorial headlines (h1–h3, menu items, statements) | Cormorant Garamond Variable (OFL) | 500             |
| Body, UI, navigation, labels                        | Manrope Variable (OFL)            | 400 / 500 / 600 |

Both are self-hosted (`@fontsource-variable/*`). A Turkish page downloads only the `latin` and
`latin-ext` WOFF2 subsets, about 44 KB for Manrope and 76 KB for Cormorant. Turkish glyphs
(ğ ü ş ı İ ö ç) are covered and shown in the showcase.

### Scale (S2: each size now carries its own line-height)

Use the utilities `text-xs … text-5xl` and `text-display`. **Never** use
`text-(length:--text-…)`, which sets only the size and loses the paired line-height (a bug found
in Stage 2 QA).

| Utility        | Size (360 → 1440 px) | Line-height | Typical use                                          |
| -------------- | -------------------- | ----------- | ---------------------------------------------------- |
| `text-display` | 48 → 92 px           | 1.0         | Homepage hero headline only                          |
| `text-5xl`     | 40 → 70 px           | 1.04        | Page `<h1>` (PageHeader), CTA headline               |
| `text-4xl`     | 36 → 52 px           | 1.08        | Section `<h2>`                                       |
| `text-3xl`     | 30 → 40 px           | 1.12        | Sub-sections, card titles on large cards, menu items |
| `text-2xl`     | 24 → 30 px           | 1.2         | Project-card titles, empty-state titles              |
| `text-xl`      | 20 → 23 px           | 1.4         | Lead paragraphs (sparingly)                          |
| `text-lg`      | 17 → 19 px           | 1.65        | Lead/intro and long-form prose                       |
| `text-base`    | 16 px                | 1.65        | Body                                                 |
| `text-sm`      | 14 px                | 1.55        | UI, nav, meta                                        |
| `text-xs`      | 12 px                | 1.5         | Eyebrows, captions, legal                            |

Rules:

- Cormorant only at `text-2xl` or larger. Headlines use `tracking-display` (−0.015em) and
  `text-wrap: balance`.
- Long-form text uses `.prose-eyfa` (17–19 px, line-height 1.7, ≤ 68ch, gold-rule list markers).
- Eyebrows: Manrope 600, 12 px, uppercase, tracking 0.18em, `accent-text`. `lang="tr"` makes
  uppercase "i" become "İ".
- Numbers in UI (phones, indices) use `tabular-nums`.

## 4. Layout

| Token / utility                           | Value                                                                      | Use                                                      |
| ----------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------- |
| Breakpoints                               | `sm` 640 · `md` 768 · **`lg` 1024 (desktop nav)** · `xl` 1280 · `2xl` 1536 |                                                          |
| `--container-prose`                       | 672 px                                                                     | Reading width (inside a content container, left-aligned) |
| `--container-content`                     | 1152 px                                                                    | Default page width                                       |
| `--container-wide`                        | 1376 px                                                                    | Header, footer, galleries, wide sections                 |
| `px-gutter`                               | 16 → 40 px                                                                 | Horizontal page padding (16 px at 320–375 px)            |
| `py-section` / `py-section-sm`            | 64 → 128 px / 40 → 72 px                                                   | Vertical rhythm between sections                         |
| `--spacing-grid` (`gap-(--spacing-grid)`) | 16 → 32 px                                                                 | Grid gaps                                                |
| `h-header` / `h-header-lg`                | 72 px / 88 px                                                              | Header heights (fixed, so no layout shift)               |

Grids are 12 columns on large screens (`lg:grid-cols-12`). Lists of cards use 1 / 2 / 3 columns
at base / `sm` / `lg`. Inner pages align prose to the content container's left edge, not
centred, so the PageHeader and body share one edge **(S2)**.

## 5. Shape, borders, elevation, layering

| Token                                                                     | Value                      | Use                                                                                         |
| ------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------- |
| `rounded-sm` / `md` / `lg`                                                | 2 / 4 / 8 px               | Focus rounding / buttons and notices / cards and media                                      |
| `border-line` (1 px)                                                      |                            | Default for cards and dividers. Prefer lines to shadows                                     |
| `shadow-card` / `shadow-raised`                                           | soft charcoal              | Optional raised cards                                                                       |
| `shadow-header`                                                           | gold hairline + soft shade | Header after scrolling (S2)                                                                 |
| `--z-raised` 10 · `--z-header` 40 · `--z-overlay` 50 · `--z-skip-link` 60 |                            | **The only z-index values allowed** (`z-(--z-header)` …). Dialogs use the browser top layer |

## 6. Image aspect ratios (S2)

| Utility            | Ratio | Use                                          |
| ------------------ | ----- | -------------------------------------------- |
| `aspect-landscape` | 4:3   | Project cards and gallery tiles              |
| `aspect-photo`     | 3:2   | Editorial and hero images                    |
| `aspect-wide`      | 16:9  | Banners, video                               |
| `aspect-cinema`    | 21:9  | Full-bleed heroes on large screens (Stage 3) |
| `aspect-portrait`  | 4:5   | People, vertical construction shots          |
| `aspect-square`    | 1:1   | Activities, posters                          |

All media sits in a fixed-ratio box (`MediaFrame`), so images never cause layout shift.

**Letterbox trimming (S2).** 27 authentic drone stills have black bars baked into the files: 8.5%
at the top and about 4.8% at the bottom. `MediaFrame` trims them automatically for `fit="cover"`
using the measured table in `src/lib/media.ts`, without editing the original files.
`tests/letterbox.test.ts` re-measures the pixels with sharp to keep the table honest. Floor plans
(`fit="contain"`) are never cropped.

## 7. Motion

| Token                               | Value                            | Use                                        |
| ----------------------------------- | -------------------------------- | ------------------------------------------ |
| `--duration-fast` / `base` / `slow` | 150 / 250 / 600 ms               | Colour / UI state / image zoom and reveals |
| `--ease-out-quiet`                  | `cubic-bezier(0.22, 1, 0.36, 1)` | Default                                    |
| `--ease-in-out-quiet`               | `cubic-bezier(0.65, 0, 0.35, 1)` | Symmetric moves                            |

Conventions:

- Animate only `transform`, `opacity` and colours.
- Allowed effects: link underline grow (`.link-underline`, a transformed `::after` line); arrow
  nudge on hover (Button, TextLink, ProjectCard); 3% image scale on card hover; gold rule widening
  on ServiceCard hover; header shadow after scroll.
- **Section reveal** (`.reveal`) is pure CSS scroll-driven animation (`animation-timeline: view()`)
  inside `@supports` and `prefers-reduced-motion: no-preference`. Content is fully visible without
  JavaScript, without support, and with reduced motion.
- The mobile menu has **no open or close animation**, deliberately. In QA a `@starting-style` fade
  left the dialog's computed opacity at 0 in a throttled rendering context. A menu that can stay
  invisible is unacceptable, so the robust choice wins.
- `prefers-reduced-motion: reduce` collapses all transitions and animations site-wide and disables
  smooth scrolling.
- No parallax, scroll hijacking or animation libraries.

## 8. Components

All components live in `src/components/`. Every `class` prop accepts `undefined` (strict TS).

| Component        | Purpose                                                                                 | Key props                                                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`         | Primary actions; `<a>` with `href`, else `<button>`                                     | `variant` primary · secondary · light; `size` sm (44) · md (48) · lg (56 px); `icon`, `leadingIcon`, `external`, `disabled`, `fullWidth`; passes ARIA/data attributes |
| `TextLink`       | Tertiary action with animated underline and arrow                                       | `tone` accent · ink; `arrow`; `external`                                                                                                                              |
| `IconButton`     | Icon-only control (menu, close, future lightbox)                                        | `icon`, **`label` (required)**; always 44×44 px                                                                                                                       |
| `Icon`           | Inline SVG set (12 icons, 1.5 px stroke); brand glyphs from the legacy site             | decorative by default; `label` makes it `role="img"`                                                                                                                  |
| `BrandLogo`      | Authentic logo, cropped via `object-fit` (asset unmodified)                             | `height`, `lgHeight`, `alt`                                                                                                                                           |
| `SiteHeader`     | Global header and mobile `<dialog>` menu                                                | none                                                                                                                                                                  |
| `SiteFooter`     | Global footer                                                                           | none                                                                                                                                                                  |
| `Container`      | Width wrapper                                                                           | `width` prose · content · wide                                                                                                                                        |
| `Section`        | Tone + rhythm + container                                                               | `tone` ivory · white · sand · dark; `spacing`; `width`; `labelledby`                                                                                                  |
| `Eyebrow`        | Uppercase label with gold rule                                                          | `rule`                                                                                                                                                                |
| `SectionHeading` | Eyebrow · title · lead · `action` slot                                                  | `level` h1–h3; `size` page · section · sub; `align`                                                                                                                   |
| `PageHeader`     | Inner-page intro on a dark band: breadcrumbs · eyebrow · `<h1>` · lead                  | `breadcrumbs` (required), `width`, default slot                                                                                                                       |
| `Breadcrumbs`    | WAI-ARIA breadcrumb + BreadcrumbList JSON-LD                                            | `items`, `label`                                                                                                                                                      |
| `MediaFrame`     | Fixed-ratio responsive image, figure/caption, letterbox trim, missing-image placeholder | `src` (path or `null`), `aspect`, `fit`, `position`, `widths`, `sizes`, `priority`, `zoom`, `caption`                                                                 |
| `ProjectCard`    | Whole-card link (single tab stop), verified facts only                                  | `project`, `headingLevel`, `priority`                                                                                                                                 |
| `ServiceCard`    | Numbered service tile                                                                   | `service`, `index`, `headingLevel`                                                                                                                                    |
| `ContactLinks`   | Verified channels with icons (tone-aware)                                               | `address`                                                                                                                                                             |
| `ContactCTA`     | Dark contact band: WhatsApp, phone and e-mail                                           | `title`, `lead`, `headingId`                                                                                                                                          |
| `Divider`        | `<hr>`: hairline or short gold rule                                                     | `variant` line · accent                                                                                                                                               |
| `EmptyState`     | Calm placeholder for absent content (filters, pending sections)                         | `title`, `description`, `icon`, slot                                                                                                                                  |
| `StageNotice`    | Visible "awaiting owner confirmation" note                                              | `title`, slot                                                                                                                                                         |

### Buttons

| Variant     | On light                          | On dark                          | Use                                         |
| ----------- | --------------------------------- | -------------------------------- | ------------------------------------------- |
| `primary`   | gold fill, charcoal label         | same                             | One main action per view                    |
| `secondary` | 1 px ink outline; hover fills ink | ivory outline; hover fills ivory | Secondary actions on any tone               |
| `light`     | —                                 | ivory fill, charcoal label       | Main action on dark when gold would compete |

States: hover (colour), active (1 px press), `:focus-visible` (global ring), disabled (45%
opacity, `cursor: not-allowed`, `<button>` only, since links are never "disabled").

### Card link pattern

`ProjectCard` makes the title link cover the card through `::after`. The card is one tab stop with
a meaningful accessible name, and the focus ring is drawn on the overlay around the whole card.

## 9. Navigation

- **Desktop (≥ 1024 px):** logo · Ana Sayfa · Hakkımızda · Projeler · Hizmetler · Faaliyetler ·
  phone number (≥ 1280 px) · gold "İletişim" button. The current page uses `aria-current="page"`,
  gold text and a persistent underline. Hover and focus grow the underline.
- **Below 1024 px:** logo and a 44 px menu button open a full-screen modal `<dialog>`. The menu
  has numbered Cormorant links (the current one in gold) and a contact block (phone, WhatsApp,
  e-mail).
  - The browser handles focus containment, inert background and Escape.
  - The script sets `aria-expanded`, closes on link selection, the close button or a desktop
    resize, and restores focus to the trigger. Page scroll is locked while open (`html:has(dialog[open])`).
- **Without JavaScript:** the menu button is hidden and a "Menü" link jumps to the footer
  navigation (`#footer-nav`).
- **Sticky:** the header is always sticky, with fixed height and no layout shift. Visual testing
  confirmed it reads well over light and dark sections. After 8 px of scroll only a shadow is added.

## 10. Footer

Dark band in three columns (5 / 3 / 4 of 12):

1. Logo, the verified headline "Eyfa Yapı ile Geleceği İnşa Ediyoruz.", and a one-line positioning
   condensed from `about.html`. A test proves it adds no fact.
2. Kurumsal (Hakkımızda, Faaliyetlerimiz, İletişim) and Çalışmalarımız (Projelerimiz, Mimarlık,
   Mühendislik, Emlak).
3. İletişim: both phones, WhatsApp, e-mail, Instagram, address.

A legal line (© year + registered name) and "Başa dön" sit at the bottom. On mobile the columns
stack and the link groups sit side by side, with 44 px targets. There are no certifications,
awards, figures or legal statements, because none are verified.

## 11. Accessibility decisions

- Skip link "İçeriğe geç" → `main#main`, and `scroll-padding-top` keeps anchors clear of the sticky
  header.
- Landmarks are named: "Ana menü", "Mobil menü", "Alt menü", "Sayfa konumu", and the footer region.
- One `<h1>` per page. Sections are labelled by their headings, and visually hidden headings are
  added where a visual heading is absent.
- Focus: one global `:focus-visible` ring with a tone-aware colour (≥ 3:1).
- Targets: buttons 44–56 px, icon buttons 44 px, footer links 44 px on touch widths.
- External links announce "(yeni sekmede açılır)".
- Icons are `aria-hidden`. Icon-only controls need a `label`.
- Static analysis: `eslint-plugin-astro` jsx-a11y **strict** rules (S2) run in `npm run lint`.
- Verification performed in Stage 2 (details in `STAGE_2_REPORT.md`):
  - axe-core 4.14 (WCAG 2.0/2.1/2.2 A/AA plus best practices) on every production route at
    320, 768 and 1280 px: 0 violations, 0 incomplete.
  - Manual keyboard tests of the menu and cards.
- Automated checks do **not** prove full WCAG conformance. A manual screen-reader pass (VoiceOver,
  NVDA) is still required (Stage 7).

## 12. Design showcase (development only)

`src/dev/DesignSystem.astro`, outside `src/pages`, is injected as `/dev/tasarim-sistemi/` by the
`eyfa-dev-showcase` integration **only when `command === 'dev'`**. It shows colours, type scale,
buttons on light and dark, links, icon buttons, navigation states, breadcrumbs, icons, section
headings, dividers, project and service cards, media ratios (including contain and a missing image),
empty state, notice, contact links, the spacing scale and the contact CTA. The live header and
footer frame the page.

Guards: `tests/showcase.test.ts` (no injection for build or preview, file not in `src/pages`) and
`scripts/verify-dist.mjs` (fails if any `dev/` or `tasarim-sistemi` file, or sitemap entry, appears
in `dist`).

## 13. How later stages should use the system

- Build every page from `Section`, `SectionHeading`/`PageHeader`, `MediaFrame` and the buttons and
  links. Don't hand-roll colours, z-indices, radii or font sizes.
- Dark sections: `Section tone="dark"`. Never hard-code `text-ivory` inside them; use `text-ink`.
- Gold text: `text-accent-text`, never `text-champagne` on light surfaces.
- New icons: add to `Icon.astro` (24 px grid, 1.5 px stroke).
- New images: register the path in `src/lib/media.ts`. If it has letterbox bars, the letterbox test
  will demand a table entry.
- New interactive widgets (lightbox, filters): start from `IconButton` and native elements
  (`<dialog>`, `<button>`, `<fieldset>`); verify with axe and the keyboard.

## 14. Outstanding design decisions

1. **Logo master.** Only a 1024 px PNG exists (gold artwork, transparent). A vector or SVG master
   is needed for crisp rendering, a monochrome variant, and any light-background use.
2. **Hero treatment (Stage 3).** Still photo (current) or a short muted loop from `mini-videos/`
   with a poster image.
3. **Service imagery.** Typographic tiles are used now. The owner may prefer photos per service
   (MEDIA_INVENTORY §7).
4. **Floor plans with black bottom bars** (`projects-img/2–6.webp`). These are not trimmed (contain
   fit). Decide in Stage 4 whether to request clean exports.
5. **Map embed** on `/iletisim/` loads Google on page view. A click-to-load or static-map decision is
   due in Stage 6.
6. **Footer/CTA copy.** "Projeniz hakkında konuşalım" is neutral UI copy. The owner may want their
   own wording.
