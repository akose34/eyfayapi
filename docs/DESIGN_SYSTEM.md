# Design System — Foundation (Stage 1)

Direction: **Premium Hybrid**. Charcoal, champagne gold, warm off-white, elegant serif display type
and authentic architectural photography. The aim is restraint: an architecture practice's calm, not
a real-estate portal's noise. Tokens live in `src/styles/global.css` as a Tailwind CSS v4 `@theme`,
so every token is both a CSS custom property and a utility class (`bg-charcoal`, `text-ink-muted`,
`max-w-(--container-content)`, …).

Stage 1 defines the foundation only. Components and page compositions are designed from Stage 2.

---

## 1. Colour

### Brand palette (approved)

| Token               | Hex       | Role                                                  |
| ------------------- | --------- | ----------------------------------------------------- |
| `--color-charcoal`  | `#151C1E` | Primary dark: header, footer, hero, primary text      |
| `--color-champagne` | `#C5A46D` | Accent: primary button, highlights, focus ring, rules |
| `--color-ivory`     | `#F5F2EB` | Page background (warm off-white)                      |
| `--color-white`     | `#FFFFFF` | Raised surfaces (cards), image mats for floor plans   |

### Supporting tints

| Token                  | Hex                               | Why it exists                                                                                              |
| ---------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `charcoal-800/700/600` | `#1F2729` / `#2B3437` / `#444D50` | Layering on dark sections without pure black                                                               |
| `champagne-300`        | `#DCC49A`                         | Hover state of the gold button; text selection                                                             |
| `champagne-700`        | `#7D6233`                         | **Text-safe gold.** Champagne itself is only 2.1:1 on ivory and must never carry text on light backgrounds |
| `ivory-200`            | `#EBE6DA`                         | Alternate section band, notices                                                                            |

### Semantic aliases (use these in components)

`surface`, `surface-raised`, `surface-inverse`, `ink`, `ink-muted` (`#4A5356`), `ink-inverse`,
`ink-inverse-muted` (`#C9C4B8`), `accent`, `accent-strong`, `line`, `line-inverse`, `focus`,
`whatsapp`.

### Verified contrast (WCAG 2.2, automated in `tests/design-tokens.test.ts`)

| Foreground / background                 | Ratio               | Allowed use                                         |
| --------------------------------------- | ------------------- | --------------------------------------------------- |
| charcoal / ivory                        | 15.4 : 1            | All text                                            |
| ink-muted / ivory                       | 7.1 : 1             | Body and secondary text                             |
| ink-muted / ivory-200                   | ≥ 4.5 : 1           | Body text in alternate bands                        |
| ink-inverse-muted / charcoal            | 9.9 : 1             | Secondary text on dark                              |
| champagne / charcoal                    | 7.3 : 1             | Gold text, eyebrows and active nav on dark          |
| charcoal / champagne                    | 7.3 : 1             | Primary button label                                |
| champagne-700 / ivory, ivory-200, white | 5.1 / 4.6 / 5.7 : 1 | Gold text on light backgrounds (eyebrows, links)    |
| champagne / ivory                       | 2.1 : 1             | **Decorative only** (rules, icons with text labels) |

My first value for `champagne-700` was `#8A6D3B`. The contrast test measured 4.34:1 on
ivory (below AA), so the token was darkened to `#7D6233`.

## 2. Typography

| Role                              | Family                          | Licence     | Weight range              |
| --------------------------------- | ------------------------------- | ----------- | ------------------------- |
| Display (h1–h3, numerals in hero) | **Cormorant Garamond Variable** | SIL OFL 1.1 | 300–700 (use 500)         |
| Text and UI                       | **Manrope Variable**            | SIL OFL 1.1 | 200–800 (use 400/500/600) |

Why: Cormorant gives the high-contrast, architectural elegance the brief asks for at large sizes.
Manrope is a geometric-humanist sans with excellent small-size legibility and full Turkish support
(ğ, ı, İ, ş, ç, ö, ü are all in the `latin-ext` subset). Both fonts are self-hosted from npm
(`@fontsource-variable/*`), with no Google Fonts request, no cookies and no third-party
dependency at runtime. Variable fonts deliver every weight from one file per subset. A Turkish page
downloads only the `latin` + `latin-ext` subsets thanks to `unicode-range` (~44 KB Manrope + ~76 KB
Cormorant, WOFF2). Fallback stacks are system-ui and Georgia-class serifs.

Rules:

- Cormorant only at ≥ 24 px (`text-2xl` and up); it is too delicate for body copy.
- Body: Manrope 16–19 px, line-height 1.65, measure ≤ 68ch (`--container-prose`).
- Eyebrow labels: Manrope 600, 12 px, uppercase, tracking `0.18em`, `accent-strong` on light and
  `champagne` on dark.
- Turkish casing: never rely on CSS `text-transform: uppercase` for words containing `i` unless
  `lang="tr"` is set (it is, on `<html>`), so "i" → "İ" is correct.

### Fluid type scale (≈1.25 ratio, 360 → 1440 px)

| Token            | Min → max              |
| ---------------- | ---------------------- |
| `--text-xs`      | 12 px                  |
| `--text-sm`      | 14 px                  |
| `--text-base`    | 16 px                  |
| `--text-lg`      | 17 → 19 px             |
| `--text-xl`      | 20 → 23 px             |
| `--text-2xl`     | 24 → 30 px             |
| `--text-3xl`     | 30 → 40 px             |
| `--text-4xl`     | 36 → 52 px             |
| `--text-5xl`     | 44 → 70 px             |
| `--text-display` | 52 → 92 px (hero only) |

## 3. Layout

| Token                 | Value                      | Use                                       |
| --------------------- | -------------------------- | ----------------------------------------- |
| `--breakpoint-sm`     | 640 px                     | Large phones / small tablets              |
| `--breakpoint-md`     | 768 px                     | Tablets                                   |
| `--breakpoint-lg`     | 1024 px                    | Desktop nav appears                       |
| `--breakpoint-xl`     | 1280 px                    |                                           |
| `--breakpoint-2xl`    | 1536 px                    |                                           |
| `--container-prose`   | 42 rem (672 px)            | Long-form text                            |
| `--container-content` | 72 rem (1152 px)           | Default page width                        |
| `--container-wide`    | 86 rem (1376 px)           | Galleries, header, footer                 |
| `px-gutter`           | `clamp(1rem, …, 2.5rem)`   | Horizontal page padding (16 px on phones) |
| `py-section`          | `clamp(4rem, …, 8rem)`     | Vertical rhythm between sections          |
| `py-section-sm`       | `clamp(2.5rem, …, 4.5rem)` | Compact sections, footer                  |

Spacing inside components uses Tailwind's default 4 px scale (`gap-4`, `p-8`, …). There is no
separate spacing token set, deliberately, to avoid two competing systems.

## 4. Shape and elevation

| Token           | Value                          | Use                                           |
| --------------- | ------------------------------ | --------------------------------------------- |
| `--radius-sm`   | 2 px                           | Focus ring rounding, tags                     |
| `--radius-md`   | 4 px                           | Buttons, inputs, notices                      |
| `--radius-lg`   | 8 px                           | Cards, images                                 |
| `--shadow-card` | soft two-layer charcoal shadow | Raised cards only. Prefer 1 px `line` borders |

Architecture favours crisp edges, so the radii are deliberately small.

## 5. Buttons (`src/components/Button.astro`)

| Variant     | Look                                                  | Use                                |
| ----------- | ----------------------------------------------------- | ---------------------------------- |
| `primary`   | Champagne fill, charcoal label; hover `champagne-300` | One main action per view           |
| `secondary` | 1 px charcoal outline; hover fills charcoal           | Secondary actions on light         |
| `inverse`   | Ivory outline on dark; hover gold                     | Secondary actions on dark sections |
| `ghost`     | Text link in `accent-strong`, underline on hover      | Tertiary actions                   |

Sizes: `md` (min-height 44 px) and `lg` (48 px). Both meet WCAG 2.5.8 target size. The component
renders `<a>` when `href` is set and otherwise `<button type="button">`. External links get
`target="_blank" rel="noopener noreferrer"`.

## 6. Focus states

A single global `:focus-visible` style: a 2 px champagne outline with a 3 px offset. It is visible
on both charcoal and ivory (≥ 3:1 against adjacent colours on dark). It appears only for
keyboard focus and never for mouse clicks. Components must not remove outlines without providing an
equivalent replacement.

## 7. Accessibility requirements (definition of done for every component)

- WCAG 2.2 AA minimum. Contrast pairs come only from the verified table above.
- One `<h1>` per page, with a logical heading order (checked by `verify-dist`).
- `lang="tr"`, landmarks (`header`, `nav[aria-label]`, `main#main`, `footer`), and a skip link
  ("İçeriğe geç").
- Every `<img>` has an `alt`. Decorative images get `alt=""`. Alt text describes what is visible
  and never asserts unconfirmed facts (such as project names).
- Icon-only controls have an accessible name. External links announce "(yeni sekmede açılır)".
- Interactive targets ≥ 44×44 px. The mobile menu has `aria-expanded`, `aria-controls` and closes
  on Escape, returning focus to the toggle.
- No auto-advancing carousels without a pause control. No autoplay video with sound.
- Content works without JavaScript (navigation is repeated in the footer).

## 8. Motion

| Token              | Value                            | Use                                     |
| ------------------ | -------------------------------- | --------------------------------------- |
| `--duration-fast`  | 150 ms                           | Colour and hover changes                |
| `--duration-base`  | 250 ms                           | Menus, button states                    |
| `--duration-slow`  | 600 ms                           | Section reveals, image fades (Stage 3+) |
| `--ease-out-quiet` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default easing                          |

Conventions: animate only `opacity` and `transform`. Reveal distances are ≤ 16 px. Nothing loops
except an optional muted hero video. Under `prefers-reduced-motion: reduce`, all transitions and
animations collapse to ~0 ms globally, smooth scrolling is disabled, and video should fall back to
its poster image (Stage 3).

## 9. Imagery

- Authentic Eyfa Yapı photography only (see MEDIA_INVENTORY §7). No stock imagery.
- Crop baked-in letterbox bars. Use consistent 4:3 cards and 3:2 / 16:9 heroes.
- Show floor plans with `object-contain` on white so drawings are never cropped.
- Text is never placed over a photo without a charcoal overlay that keeps it at ≥ 4.5:1.
