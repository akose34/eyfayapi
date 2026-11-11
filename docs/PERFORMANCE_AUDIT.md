# Performance Audit (Stage 7)

All numbers below are **measured**, from the local production build. None are estimated.

## 1. Measurement conditions

| Item    | Value                                                                                              |
| ------- | -------------------------------------------------------------------------------------------------- |
| Tool    | Lighthouse 13.6.0 (navigation mode), via `scripts/lighthouse.mjs`                                  |
| Browser | Google Chrome 157.0.8103.39, headless (`--headless=new`), macOS 27.2, Apple silicon                |
| Server  | `astro preview` on `http://127.0.0.1:4323` (local, HTTP/1.1, **no compression**)                   |
| Mobile  | Lighthouse default: Moto G Power emulation (412×823, DPR 1.75), simulated slow 4G, 4× CPU slowdown |
| Desktop | Lighthouse desktop preset (1350×940, DPR 1, simulated cable)                                       |
| Runs    | Baseline 1 run per page; final **3 runs per page, median by performance score**                    |
| Date    | 2026-11-10                                                                                         |

Caveats:

- LCP is a **simulated** value (Lantern), not a field measurement.
- The local server sends uncompressed HTML. GitHub Pages compresses with gzip, so real transfers are
  smaller than the "transfer" column.
- **INP is not reported.** Lighthouse navigation mode cannot measure INP. Total Blocking Time (TBT)
  is the lab proxy: at most 15 ms on every page. The site ships at most 2.7 KB of inline JavaScript
  per page, and every interaction (menu, lightbox, map button) runs a small synchronous handler. A
  representative INP needs field data (Search Console / CrUX) after launch.

Reproduce:

```bash
export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
npm run build
npx astro preview --port 4323 --host 127.0.0.1
npm run lighthouse            # 3 runs/page → lighthouse/summary.json + raw reports
```

## 2. Results

### Mobile

| Page            | Baseline P / LCP / CLS | **Final** P / A / BP / SEO | **Final LCP** | CLS   | TBT   | Transfer (baseline → final) |
| --------------- | ---------------------- | -------------------------- | ------------- | ----- | ----- | --------------------------- |
| Home            | 98 / 2.41 s / 0        | **99 / 100 / 100 / 100**   | **1.96 s**    | 0     | 5 ms  | 405 → 275 KB                |
| Projects        | 90 / 3.69 s / 0        | **98 / 100 / 100 / 100**   | **2.40 s**    | 0     | 3 ms  | 700 → 423 KB                |
| Project detail¹ | 90 / 3.61 s / 0        | **98 / 100 / 100 / 69¹**   | **2.40 s**    | 0     | 0 ms  | 973 → 573 KB                |
| About           | 97 / 2.63 s / 0.037    | **99 / 100 / 100 / 100**   | **2.18 s**    | **0** | 14 ms | 522 → 308 KB                |
| Services        | 100 / 0.80 s / 0.001   | **100 / 100 / 100 / 100**  | 0.78 s        | 0     | 0 ms  | 575 → 332 KB                |
| Activities      | 100 / 0.76 s / 0.001   | **100 / 100 / 100 / 100**  | 0.75 s        | 0     | 0 ms  | 144 → 101 KB                |
| Contact         | 100 / 0.76 s / 0       | **100 / 100 / 100 / 100**  | 0.77 s        | 0     | 0 ms  | 146 → 102 KB                |

### Desktop

| Page            | Final P / A / BP / SEO | LCP    | CLS | Transfer |
| --------------- | ---------------------- | ------ | --- | -------- |
| Home            | 100 / 100 / 100 / 100  | 0.44 s | 0   | 359 KB   |
| Projects        | 100 / 100 / 100 / 100  | 0.62 s | 0   | 454 KB   |
| Project detail¹ | 100 / 100 / 100 / 69¹  | 0.56 s | 0   | 683 KB   |
| About           | 100 / 100 / 100 / 100  | 0.62 s | 0   | 448 KB   |
| Services        | 100 / 100 / 100 / 100  | 0.54 s | 0   | 332 KB   |
| Activities      | 100 / 100 / 100 / 100  | 0.21 s | 0   | 101 KB   |
| Contact         | 100 / 100 / 100 / 100  | 0.39 s | 0   | 102 KB   |

¹ **Project detail SEO 69 is intentional.** The only failing audit is `is-crawlable`: project pages
carry `noindex, follow` until the owner confirms project names (see `SEO_AUDIT.md` §3). The score
becomes 100 once a project is confirmed and its `noindex` is removed.

**Targets:**

- Mobile performance ≥ 90, accessibility, best practices and SEO ≥ 95: met on every page, except the
  intentional project-detail SEO score.
- LCP ≤ 2.5 s: met on every page (worst: 2.40 s).
- CLS ≤ 0.1: met everywhere (0 on all pages).

## 3. What changed and what it bought

| Change                                                                                         | Evidence                                                                                                   |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Photo quality 72** by default in `MediaFrame` (`cover` only; drawings keep 80)               | Lighthouse "increase compression" savings of 40–50 KB per card image. Same setting the heroes already used |
| **750 px width step** in card, gallery, feature and hero ladders                               | Phones (375@2x, 412@1.75) used to pick 809–960 px files for ~660 px slots                                  |
| **Only the first portfolio card is high priority**                                             | Two equal-priority images were competing on phones, where the second sits below the fold                   |
| **Metric-matched fallback fonts** (`Manrope Fallback` = Arial, `Cormorant Fallback` = Georgia) | About CLS 0.037 → 0; Lighthouse named the web-font swap as the cause                                       |
| **Turkish font subsets** (`scripts/subset-fonts.py`)                                           | The latin-ext downloads (15 KB + 33 KB) became 2.4 KB + 3.0 KB. Only Ğ ğ İ Ş ş were used from those files  |
| **Inline stylesheet** (`build.inlineStylesheets: 'always'`)                                    | Removed the only render-blocking request: −150…230 ms simulated mobile LCP                                 |
| Old default share image unregistered                                                           | Stopped a 2 MB original PNG from being emitted                                                             |

Fallback-font values were measured from the font files' `hmtx`/`hhea` tables on a Turkish sample
string:

| Font      | Fallback | size-adjust | ascent   | descent |
| --------- | -------- | ----------- | -------- | ------- |
| Manrope   | Arial    | 100.12 %    | 106.47 % | 29.96 % |
| Cormorant | Georgia  | 88.32 %     | 104.62 % | 32.5 %  |

Trade-off of inlining CSS: about 12.6 KB gzip is repeated in every HTML page instead of being
cached once. For a small site where most visits see one to three pages, the faster first render is
worth more. To revert, remove `inlineStylesheets` from `astro.config.ts`.

## 4. Images and media

- Formats: WebP for all photos, JPEG for share images, PNG only for the favicon, touch icon and
  structured-data logo.
- Every `<img>` has width and height (enforced by `verify-dist`), so nothing causes layout shift.
  Images below the fold are lazy.
- Exactly one high-priority image per page (the hero or first card). The homepage rule is
  enforced in `verify-dist`.
- Floor plans use `fit="contain"` (never cropped) at encoder quality 80, enforced by the Stage 4
  crop tests.
- No withheld image appears in any form (Stage 4 `verify-dist` check, unchanged).
- **Build output: 34.2 MB → 31.2 MB** (370 files, budget 40 MB, unchanged). The extra 750 px
  derivatives are more than offset by the lower photo quality and the unregistered PNG.

## 5. JavaScript and fonts

- JavaScript: inline modules only, with no external scripts and no framework. Per page: contact
  1.2 KB, project detail 2.7 KB. The 8 KB budget is enforced.
- Fonts: 4 self-hosted WOFF2 files totalling 67.9 KB (latin 24.8 + 37.6, Turkish 2.4 + 3.0), all
  `font-display: swap` with metric-matched fallbacks.

## 6. Remaining opportunities (not done, by choice)

- **AVIF:** smaller files but slower encoding and a larger build. Measure once project media is
  final.
- **Preloading the latin font files:** would compete with the LCP image on mobile; not needed at
  the current scores.
- **Field data:** enable Search Console after launch to observe real LCP/INP/CLS.
