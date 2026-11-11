# Project Audit — Legacy Eyfa Yapı Website

Stage 1 audit of `akose34/eyfayapi`, branch `redesign/eyfa-professional`. The audit ran on 2026-11-10 against commit `5da2426`.

Method: I read every tracked file, inspected the Git index byte by byte and fetched the
public site read-only. I also queried the GitHub Pages API read-only and generated contact sheets
of every image and video. Nothing in the legacy site was modified.

---

## 1. Repository and Git state

| Item                       | Finding                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------- |
| Remote                     | `https://github.com/akose34/eyfayapi.git`                                           |
| Default branch             | `main`                                                                              |
| Working branch             | `redesign/eyfa-professional`, created from `main` (0 commits ahead/behind at start) |
| History                    | 27 commits (2025-10-27 → 2026-03-21), mostly GitHub web uploads                     |
| Tracked files              | 123 index entries / 122 files on disk (see §6 — one Unicode duplicate)              |
| Repository size (worktree) | ~173 MB, of which ~76 MB is media                                                   |
| Tracked junk               | `.DS_Store`, `mini-videos/.DS_Store`                                                |
| Build tooling              | None. Hand-written HTML/CSS/inline JS, no package manager                           |

## 2. Pages and their relationships

| File            | `<html lang>` | `<title>`                                   | Stylesheets                         | Purpose                                 |
| --------------- | ------------- | ------------------------------------------- | ----------------------------------- | --------------------------------------- |
| `index.html`    | `tr`          | Eyfa Yapı \| İnşaat & Gayrimenkul Projeleri | `style.css`, `main-style.css`       | Homepage (served at `/`)                |
| `anaEkran.html` | `en` ⚠        | Eyfa Yapı                                   | same as index                       | **Near-duplicate of `index.html`**      |
| `projeler.html` | `en` ⚠        | Projelerimiz                                | `main-style.css`, `projects.css`    | 11 image-slider galleries, no text      |
| `faaliyet.html` | `en` ⚠        | Faaliyetlerimiz                             | `deneme.css`, `main-style.css`      | 2 activity cards                        |
| `about.html`    | `en` ⚠        | Hakkımızda                                  | `main-style.css`, `style-about.css` | Company and founder text, founder photo |

The only differences between `anaEkran.html` and `index.html` are `lang="en"`, the shorter title, and
the missing meta description. The menu on `index.html` and `anaEkran.html` points "Ana Sayfa" to
`anaEkran.html`. The other pages point it to the absolute `https://eyfayapi.net/`. So the same
homepage is reachable under two URLs (duplicate content).

## 3. CSS and JavaScript

**CSS (2,916 lines across 5 files, no build step):**

- `main-style.css`: shared navbar, contact dropdown, footer grid and font classes. Used by every page.
- `style.css`: homepage layout (video slider, services grid, image slider).
- `projects.css`, `style-about.css`, `deneme.css`: page-specific. `deneme.css` ("test") is
  production CSS for `faaliyet.html` despite its name.
- Breakpoints are inconsistent: `max-width: 397px`, `398–768px`, and `768px`.
- Colours: navbar `#06202b`, active-menu gold `#dda853`, text `#f0ece6`, footer `#eceff2`.
- Fonts: `font-family: "Open Sans"` and `"Lato"` are declared but **never loaded**, so every
  visitor sees a system fallback font.
- Layout relies on fixed pixel heights (`body { margin-top: 112px }`, footer `height: 30rem`) and
  10×10 CSS grids with `<br>` spacing.

**JavaScript (inline, no modules):**

- `index.html`: (1) a video "slider" that plays 8 MP4 files in sequence with arrow buttons and
  advances on `ended`; (2) an infinite image carousel (`.slides2`) with clone-based looping, dots
  and a 5-second `setInterval` auto-advance.
- `projeler.html`: one generic carousel per gallery (11 instances), each with its own auto-advance
  timer. The code is effectively duplicated from the homepage carousel.
- No pause control for auto-advancing content, no `prefers-reduced-motion` handling, and no
  keyboard or touch swipe handling.

## 4. Navigation and footer

- Navigation is copy-pasted into every page: Ana Sayfa, Projelerimiz, Faaliyetlerimiz, Hakkımızda,
  İletişim. "İletişim" is `href="#"` with `pointer-events: none`. Its dropdown (WhatsApp,
  Instagram, e-mail) opens **only on mouse hover**, so it is unreachable by keyboard and unreliable
  on touch devices.
- The footer is also copy-pasted into every page. It contains the legal name, two phone numbers,
  e-mail, address, social icons and a Google Maps iframe.
- Mislabelled icons: the e-mail links use `aria-label="Instagram"` and the footer Instagram link
  uses `aria-label="Gmail"`.

## 5. Company information found

All of it is recorded verbatim in `docs/CONTENT_INVENTORY.md` and `src/data/company.ts`.

## 6. Unicode filename collision — `logos/emlakçi-logo.png`

**Finding (verified byte-level with `git ls-files -s` and `xxd`):** the Git index contains two
entries whose names differ only by Unicode normalisation:

| Index path (bytes)               | Normalisation                        | Blob      | Added in                                                         |
| -------------------------------- | ------------------------------------ | --------- | ---------------------------------------------------------------- |
| `logos/emlakc\314\247i-logo.png` | NFD (`c` + U+0327 combining cedilla) | `3abdf0e` | `2a89e15` (2025-10-27, "Add files via upload")                   |
| `logos/emlak\303\247i-logo.png`  | NFC (precomposed `ç`, U+00E7)        | `3abdf0e` | `63a6ef0` (2025-10-29, "Finalize responsive design adjustments") |

- **Both entries point to the same blob (`3abdf0e`, 4,520 bytes).** They are byte-identical, so no
  asset can be lost by keeping only one of them.
- macOS (APFS, `core.precomposeunicode=true`) can hold only one of them on disk. That produces the
  reported checkout collision, or a perpetually "modified/deleted" file. Linux (GitHub Pages
  builder, CI runners) checks out **both** files.
- The legacy `index.html` / `anaEkran.html` reference the **NFD** form (`emlakçi`). Live
  GitHub Pages serves the NFD file, so the live site works today.

**Safe resolution (documented, not yet applied).** It needs the owner's approval, and it must happen
only on the redesign branch after the legacy HTML stops referencing the file:

```bash
# 1. Preserve the asset under an ASCII name (same blob, nothing re-encoded)
git show 3abdf0e > logos/emlak-logo.png
git add logos/emlak-logo.png
# 2. Remove BOTH Unicode variants from the index only (history keeps them forever)
git rm --cached "logos/emlakc$(printf '\314\247')i-logo.png" "logos/emlak$(printf '\303\247')i-logo.png"
# 3. Update any reference to logos/emlak-logo.png, then commit on the redesign branch.
```

Why it was not applied in Stage 1: the legacy pages on this branch still reference the NFD path.
Stage 1 rules forbid renaming media, and the current checkout is clean. As a precaution the new
code never globs `logos/`, so Linux checkouts with both files cannot produce duplicate imports
(`src/lib/media.ts`). The recovery copy is always available as `git show 3abdf0e`.

No other case-insensitive or Unicode collisions exist: I checked `git ls-files | tr A-Z a-z | uniq -d`
and searched the index for non-ASCII bytes.

## 7. Duplicated, obsolete and unused files

| Item                                                  | Evidence                                                                                                                              | Recommendation                                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `anaEkran.html`                                       | Near-duplicate of `index.html`                                                                                                        | Redirect to `/` (done via `public/anaEkran.html`)                                    |
| `slider-photos/photo-1…11.jpg` (3.0 MB)               | Referenced by **no** page. A perceptual-hash comparison shows each one is a JPG twin of a `projects-img/6078_11-*` or `7109_4-*` WebP | Keep until the owner confirms. Candidate for archival in a later stage               |
| `img/Eyfa-yapi-resim1,4,5,6,7,9,11,13,14,16` (~18 MB) | Not referenced by any page                                                                                                            | Authentic aerial photography. Candidates for the new galleries (see MEDIA_INVENTORY) |
| `img/boss-photo.jpg`                                  | Used only by `about.html`                                                                                                             | Keep. Reuse is pending owner confirmation                                            |
| `projects-img/184_1-1…6.webp`                         | Not referenced. Third-party architect branding (ARTRIA Mimarlık, GOKTUG Mimarlık title block)                                         | Owner must confirm before publishing                                                 |
| `projects-img/6078_11-1.webp`                         | Not referenced. Render shows "YEKFA YAPI" / "YILMAZ İNŞAAT" signage                                                                   | Owner must confirm                                                                   |
| Carousel JS                                           | Duplicated between `index.html` and `projeler.html`                                                                                   | Replaced by one component in a later stage                                           |
| `.DS_Store` ×2                                        | macOS metadata, tracked                                                                                                               | Now ignored. Untracking needs a separate approved change                             |

Nothing was deleted or renamed in Stage 1.

## 8. Broken internal links and paths

- Every local `src`/`href` in the five pages resolves to an existing file. This was checked
  programmatically; there are no missing files.
- Functional link problems: "İletişim" is `href="#"` (no destination). "Ana Sayfa" points to the
  duplicate `anaEkran.html` from two pages. The WhatsApp/e-mail links use `target="_blank"` without
  `rel="noopener"`, which is harmless for `mailto:` but inconsistent.
- The legacy pages use relative paths, so they only work from the domain root.

## 9. Deployment configuration (read-only GitHub API query)

| Setting           | Value                                                                            |
| ----------------- | -------------------------------------------------------------------------------- |
| GitHub Pages      | Enabled, **legacy build** (`build_type: legacy`) from `main` at `/`              |
| Custom domain     | `eyfayapi.net` (`CNAME` file at repo root)                                       |
| HTTPS certificate | Approved for `eyfayapi.net`, `www.eyfayapi.net`; expires 2027-01-21              |
| HTTPS enforced    | **No** (`https_enforced: false`)                                                 |
| Custom 404        | No                                                                               |
| Live parity       | `https://eyfayapi.net/` is byte-identical (same MD5) to `origin/main:index.html` |
| Workflows         | None (`.github/` does not exist)                                                 |

Consequence: merging this branch into `main` **as is** would make the legacy Pages builder publish
the repository root. That root contains the source files and not the Astro `dist/` output. See
`docs/DEPLOYMENT_PLAN.md`.

## 10. SEO

- A meta description exists only on `index.html`. Four pages declare `lang="en"` for Turkish content.
- No canonical URLs, no Open Graph/Twitter tags, no structured data, no `robots.txt`, no
  `sitemap.xml` and no favicon.
- Duplicate homepage (`/` and `/anaEkran.html`).
- Headings: there are no real `<h1>` elements. Text sizes come from `.header-text` spans, and the
  activities page uses `<h2>`/`<h3>` without an `<h1>`.
- Project galleries contain no text at all, so search engines get no indexable project content.

## 11. Accessibility problems (WCAG 2.2)

| Issue                                                                                                                                    | WCAG                       |
| ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 74 of 88 `<img>` elements have no `alt` attribute. The rest use empty or duplicated alt text (both activity images say "SUGİAD Üyeliği") | 1.1.1                      |
| Carousels auto-advance every 5 s with no pause/stop control. The video slider autoplays                                                  | 2.2.2                      |
| Contact menu works on hover only; keyboard and touch users cannot open it                                                                | 2.1.1                      |
| Carousel arrows are `❮`/`❯` characters with no accessible name                                                                           | 4.1.2                      |
| Wrong `aria-label`s on icon links (Instagram ↔ Gmail ↔ e-mail)                                                                           | 2.5.3, 4.1.2               |
| Wrong document language on 4 pages                                                                                                       | 3.1.1                      |
| No skip link, no `<main>`/landmarks, and headings faked with spans                                                                       | 1.3.1, 2.4.1               |
| Google Maps iframe has no `title`                                                                                                        | 4.1.2                      |
| No focus styles defined; menu gold `#dda853` on `#06202b` is used decoratively only                                                      | 2.4.7                      |
| No reduced-motion support for videos or carousels                                                                                        | 2.3.3 (AAA), best practice |

## 12. Performance risks

- The **homepage loads ~35 MB** of local media: 8 auto-sequenced MP4s (~20 MB, up to 7.7 Mbit/s)
  plus 8 PNG slider photos at 1.7–2 MB each (2,700–3,000 px wide), with no `srcset`, no lazy
  loading and no explicit dimensions (layout shift).
- **`projeler.html` loads ~19 MB** (59 images, all eager). Several WebPs are 4,000–5,400 px wide.
- No caching strategy beyond GitHub Pages defaults (`max-age=600`).
- The Google Maps iframe on every page adds third-party requests and cookies.

The new build addresses these: responsive WebP `srcset`s are generated at build time and a size budget is
enforced by `scripts/verify-dist.mjs`. The heaviest generated file is about 0.3 MB.

## 13. Content, licensing and privacy risks

- **Autodesk educational watermark.** `projects-img/6078_11-*` and `slider-photos/photo-1…5`
  display "PRODUCED BY AN AUTODESK EDUCATIONAL PRODUCT". Publishing student-licence output in a
  commercial context may breach the licence terms. Owner must confirm or supply clean drawings.
- **Third-party branding.** `projects-img/1.webp` carries a THERMOsiding logo and URL.
  `184_1-*` carry ARTRIA Mimarlık and GOKTUG Mimarlık branding, including an address and phone
  numbers.
- **Other company names.** `6078_11-1.webp` shows "YILMAZ İNŞAAT" signage.
- **Personal data.** The founder biography states age, education status, hometown and family
  status. It is time-sensitive and personal, so it must be re-confirmed before reuse.
- **Mismatch.** `faaliyet.html` describes the theatre evening as an employee event. `about.html`
  says the founder established the GSG theatre group. The owner should clarify.

## 14. Dependency and environment notes (new stack)

- This Mac had Node 22.16, which is below Astro 7's `>=22.23.4`. Astro 6.4.8 (the last line that
  supports 22.16) carries **critical** advisories, including RCE through AVIF optimisation and
  several XSS issues, all fixed only in Astro ≥7.3.2. With the owner's approval, Node 24 was
  installed keg-only through Homebrew (`/opt/homebrew/opt/node@24`, v24.22.2). The system default
  Node was not changed. Homebrew also upgraded its `zstd` dependency (1.5.7 → 1.5.7_1).
- `npm audit --omit=dev`: **0 vulnerabilities**. `npm audit` including dev tooling: 11 moderate
  findings, all via `minimatch` in the ESLint toolchain (glob-pattern denial of service, GHSA-g3hv-75wg-m249). They do not ship to the site.
