# Stage 7 Report: Production Quality, SEO, Performance and Visual Polish

- **Branch:** `redesign/eyfa-professional`
- **Base:** Stage 6 commit `d77b856`
- **Date:** 2026-11-10
- **Status:** complete. The commit is local only: not pushed, not merged, not deployed.
- **Readiness: BLOCKED PENDING CONTENT APPROVAL.** The site is technically complete; release waits
  on the owner (`RELEASE_BLOCKERS.md`).

Companion documents: `SEO_AUDIT.md`, `PERFORMANCE_AUDIT.md`, `ACCESSIBILITY_AUDIT.md`,
`RELEASE_BLOCKERS.md`, `OWNER_REVIEW_CHECKLIST.md`.

## 1. Issue log (site-wide audit)

| #   | Severity | Area         | Issue                                                                     | Status                                                    |
| --- | -------- | ------------ | ------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | High     | Performance  | Mobile LCP 3.6–3.7 s on Projects and project detail (target 2.5 s)        | **Fixed:** 2.40 s                                         |
| 2   | High     | Security     | No Content Security Policy                                                | **Fixed:** hashed meta CSP, 0 violations in browser tests |
| 3   | High     | Content      | Project names unconfirmed ("Proje 01…")                                   | **Owner:** blocker B1                                     |
| 4   | High     | Content      | Contact details verified only against the legacy site                     | **Owner:** blocker B2                                     |
| 5   | Medium   | SEO          | 404 declared canonical `https://eyfayapi.net/404/` (does not exist)       | **Fixed:** no canonical                                   |
| 6   | Medium   | SEO          | Placeholder project pages used `noindex, nofollow`                        | **Fixed:** `noindex, follow`                              |
| 7   | Medium   | SEO          | 10 project pages shared one generic description                           | **Fixed:** neutral per-project description                |
| 8   | Medium   | SEO          | One legacy photo as the share image for 5 pages; no size or alt declared  | **Fixed:** generated 1200×630 images; full OG/X tags      |
| 9   | Medium   | SEO          | Static robots.txt; no way to keep a staging deployment out of the index   | **Fixed:** generated robots.txt + `SITE_INDEXING=off`     |
| 10  | Medium   | SEO          | Projects description 236 characters and containing a self-praise claim    | **Fixed:** 123-character factual description              |
| 11  | Medium   | Performance  | Web-font swap shifted About (CLS 0.037)                                   | **Fixed:** metric-matched fallbacks, CLS 0                |
| 12  | Medium   | Content      | Legacy marketing claims ("başarıyla", "öne çıkmıştır", "uzman", "yetkin") | **Owner:** blocker B3                                     |
| 13  | Medium   | Hosting      | Pages cannot send security headers; redirects are untested on Pages       | **Stage 8:** D2, D3                                       |
| 14  | Medium   | Visual       | Homepage approach band: tall empty column before the button               | **Fixed**                                                 |
| 15  | Medium   | Visual       | Homepage services rows about 320 px tall each                             | **Fixed:** about 220 px                                   |
| 16  | Low      | Security     | Breadcrumb JSON-LD not escaped (`</script>` in data would break out)      | **Fixed:** shared `jsonLdString`                          |
| 17  | Low      | Performance  | 2 MB legacy PNG would be emitted once unused                              | **Fixed:** unregistered (original kept in the repo)       |
| 18  | Low      | Visual       | Footer lacked presence                                                    | **Fixed:** larger logo and statement on desktop           |
| 19  | Low      | Dependencies | 12 moderate advisories in dev-only lint tooling                           | Accepted: production has 0 (§6)                           |
| 20  | Low      | Navigation   | Activities page has one item but sits in the primary nav                  | **Owner:** recommendation in the checklist §4             |
| 21  | Low      | Content      | Brand casing "Eyfa Yapı" vs "EYFA Yapı"                                   | **Owner:** checklist §3                                   |

No Critical issues were found.

## 2. Technical and design improvements

**SEO.** For details see `SEO_AUDIT.md`.

- Full Open Graph and X/Twitter metadata, with image size and alt text.
- Generated share images, built from authentic photos and the logo, with no text rendered in.
- Corrected canonical and robots handling (404 canonical removed; placeholders `noindex, follow`).
- A sitemap that `verify-dist` keeps equal to the indexable pages.
- Generated robots.txt with a staging switch.
- A `GeneralContractor` + `WebSite` JSON-LD graph containing verified properties only.

**Performance.** See `PERFORMANCE_AUDIT.md`.

- Photo quality 72 by default, and a 750 px width step for phones.
- High priority on the first portfolio card only.
- Metric-matched fallback fonts.
- Turkish font subsets: −42 KB per first visit.
- An inline stylesheet, and fonts always emitted as files.

**Security.**

- Meta CSP: script and style hashes, `default-src 'self'`, Google only in `frame-src`,
  `object-src 'none'`, `form-action 'none'`, `base-uri 'self'`.
- JSON-LD escaping.
- The public-output hygiene gate.

**Visual.** Approach band layout, services row density, footer presence. See §9.

**Tooling.** All of these are dev dependencies only:

- Playwright 1.65.0 browser suite (`e2e/`), with network isolation;
- Lighthouse 13.6.0 runner (`scripts/lighthouse.mjs`);
- font subset script;
- `test:e2e`, `validate:full` and `lighthouse` npm scripts.

## 3. Lighthouse scores

Conditions: Lighthouse 13.6.0, Chrome 157 headless, local `astro preview`, 3 runs per page, median.
Mobile uses the default emulation (Moto G Power, slow 4G, 4× CPU); desktop uses the desktop preset.

| Page           | Mobile P/A/BP/SEO | Desktop P/A/BP/SEO |
| -------------- | ----------------- | ------------------ |
| Home           | 99/100/100/100    | 100/100/100/100    |
| Projects       | 98/100/100/100    | 100/100/100/100    |
| Project detail | 98/100/100/69\*   | 100/100/100/69\*   |
| About          | 99/100/100/100    | 100/100/100/100    |
| Services       | 100/100/100/100   | 100/100/100/100    |
| Activities     | 100/100/100/100   | 100/100/100/100    |
| Contact        | 100/100/100/100   | 100/100/100/100    |

\* Intentional `noindex` on unconfirmed projects (`is-crawlable` is the only failing audit).

## 4. Core Web Vitals (lab)

| Page           | Mobile LCP (before → after) | CLS (before → after) | TBT   |
| -------------- | --------------------------- | -------------------- | ----- |
| Home           | 2.41 → **1.96 s**           | 0 → 0                | 5 ms  |
| Projects       | 3.69 → **2.40 s**           | 0 → 0                | 3 ms  |
| Project detail | 3.61 → **2.40 s**           | 0 → 0                | 0 ms  |
| About          | 2.63 → **2.18 s**           | 0.037 → **0**        | 14 ms |
| Services       | 0.80 → 0.78 s               | 0.001 → 0            | 0 ms  |
| Activities     | 0.76 → 0.75 s               | 0.001 → 0            | 0 ms  |
| Contact        | 0.76 → 0.77 s               | 0 → 0                | 0 ms  |

**INP was not measured.** Lighthouse navigation mode cannot measure it, and no representative field
interaction exists yet. TBT ≤ 15 ms and ≤ 2.7 KB of JavaScript per page are the lab indicators.

## 5. SEO findings

See `SEO_AUDIT.md`.

- 6 indexable pages, each with a unique title and description, a self-canonical, and full OG/X
  tags.
- 10 placeholder project pages are deliberately `noindex, follow` and absent from the sitemap.
- Legacy redirect documents work in the browser.
- Hosting-dependent behaviour (extension-less URLs, trailing-slash 301, 404 status on Pages) must
  be re-checked on the Stage 8 preview.
- Structured data contains verified facts only, enforced by a banned-property scan.

## 6. Security findings

| Topic                    | Finding                                                                                                                                                               |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Production dependencies  | `npm audit --omit=dev`: **0 vulnerabilities**                                                                                                                         |
| Development dependencies | 12 moderate, all `minimatch` (ReDoS on glob patterns) via ESLint / typescript-eslint. Lint-time only, on patterns we write. The fix needs major downgrades → accepted |
| Outdated                 | `globals` 17.0 → 17.14, `typescript` 6.0 → 7.0 (major). Not needed for release                                                                                        |
| External links           | All `target="_blank"` links have `rel="noopener noreferrer"` (`verify-dist`)                                                                                          |
| URL encoding / WhatsApp  | `sanitizeMessage` strips Unicode Cc/Cf; `encodeURIComponent`; injection test (Stage 6) + browser test that the project message has only a `text` parameter            |
| Third-party requests     | None on any page load (browser test blocks and records every non-local request). Google only after "Haritayı yükle"                                                   |
| CSP                      | Meta CSP with hashes. Mutation-tested: an unhashed inline script is reported as a violation and fails the test                                                        |
| Public output            | Only web file types; no source maps, `.md`, `.ts`, dotfiles, `docs/`, `src/` or `tests/` (`verify-dist`, mutation-tested). Dev showcase absent (Stage 2 check)        |
| Unsafe HTML              | `set:html` only for JSON-LD via `jsonLdString` (escapes `<`)                                                                                                          |
| Secrets                  | None exist or are needed                                                                                                                                              |
| Cookies / tracking       | None                                                                                                                                                                  |

Hosting-level headers that GitHub Pages cannot send (for a future host with header support):

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: frame-ancestors 'none'   (in addition to the meta policy)
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 7. Accessibility

See `ACCESSIBILITY_AUDIT.md`.

- axe-core: 0 violations on 17 routes × 2 devices and in three interactive states.
- Lighthouse accessibility 100 everywhere.
- Reflow at 320 px and WCAG text spacing both pass.
- Keyboard flows are automated.
- VoiceOver was not automated (it would change system settings); the manual checklist is provided.
- No WCAG conformance claim is made from the automated results.

## 8. Browser smoke tests

`npm run test:e2e`: Playwright, local production build, Chromium desktop (1280×800) and Pixel 7.
Every non-local request is blocked, and the Maps embed is stubbed.

- **Result: 111 passed, 13 skipped** (device-specific tests skipped on the other form factor),
  **0 failed**.
- **Coverage:**
  - every route renders cleanly, with no third-party requests, CSP violations or console errors,
    and no broken images;
  - skip link; desktop navigation and `aria-current`; mobile menu (open, Escape, focus return, link
    navigation, contact shortcuts);
  - project index → detail; withheld 08 redirect; project enquiry message;
  - lightbox keyboard (arrows, Home/End, wrap, Escape, focus return) and touch swipe;
  - contact links (tel, mailto with subject, WhatsApp); no form;
  - map: no Google before consent, iframe only after the click, focus and announcement;
  - directions link; legacy redirects (query and hash kept); 404 status and page; reduced motion;
  - axe on every route.
- **Mutation tests:** each planted fault made the suite fail:
  - an unhashed inline script;
  - a third-party image;
  - a map iframe live on load;
  - a `<form>`;
  - a wrong project in the WhatsApp text.

No message was sent, and no WhatsApp/phone/e-mail link was followed.

## 9. Visual QA

Captured on the production build, with reduced motion so that scroll-reveal sections render in
full-page captures:

- **Widths:** 320–1920 for layout checks (no overflow at any page type at 320 is automated);
  full-page review at 390 and 1440 for all pages; earlier stages covered 768, 1024 and 1920.
- **Representative screenshots** are in the session scratchpad. They are not committed: the build
  is deterministic and the screenshots can be regenerated.

**Completed fixes:**

1. **Homepage approach band:** the button moved under the quote on desktop (DOM order unchanged).
   This removes a tall empty column; the homepage is 556 px shorter at 1440.
2. **Homepage services index:** row padding reduced (`lg:py-12` → `lg:py-9`) and thumbnails
   narrowed (3 → 2 columns). Rows are about a third shorter and descriptions sit on one line.
3. **Footer:** logo 56 → 72 px and statement `text-3xl` → `text-4xl` on desktop.
4. **Turkish glyphs** checked after the font subsetting (Ğ ğ İ Ş ş in headings and body).

**Needs the owner's creative approval** (`OWNER_REVIEW_CHECKLIST.md` §5; not implemented):

- **Hero image:** a stronger alternative (aerial `23.webp`, or a muted video loop).
- **Headline:** the legacy tagline. Shortening it is a brand decision.
- **Heavy corporate copy:** trim the hero intro to its first sentence.
- **Project presentation:** improves once names are confirmed.
- **Activities:** remove it from the primary nav (recommended).

## 10. Remaining owner decisions

See `OWNER_REVIEW_CHECKLIST.md`:

- confirm the contact facts;
- name the projects;
- approve or soften the legacy claims;
- choose the brand casing;
- decide on the Activities navigation;
- creative proposals;
- media rights;
- opening hours;
- run the manual screen-reader and real-phone checks.

## 11. Release blockers

See `RELEASE_BLOCKERS.md`.

- **Content:** B1 project names; B2 contact confirmation; B3 legacy claims; B4 media rights.
- **Stage 8 prerequisites:** D1 Actions-based Pages; D2 hosting-dependent checks; D3 header limits;
  D4 enforce HTTPS.

## 12. Final validation

| Gate                                    | Result                                                                                                                             |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `npm run validate`                      | **pass**: format, lint, `astro check` 0/0, 14 files / 209 unit tests, build (18 pages + 11 share images + robots.txt), verify-dist |
| `npm run typecheck`                     | **pass**: 0 errors, 0 warnings                                                                                                     |
| `npx playwright test`                   | **111 passed**, 13 skipped, 0 failed                                                                                               |
| `node scripts/lighthouse.mjs --runs 3`  | §3                                                                                                                                 |
| `SITE_INDEXING=off` build + verify-dist | pass (all pages `noindex`, robots `Disallow: /`)                                                                                   |
| Build size                              | 31.2 MB / 370 files (budget 40 MB, unchanged; was 34.2 MB)                                                                         |

No existing test was weakened. One test file was briefly overwritten during the work and restored
verbatim from Git; the new tests are in `tests/seo-stage7.test.ts`. The new `verify-dist` checks
were each mutation-tested: missing CSP, duplicate title, `nofollow`, sitemap leak, robots block,
fake rating, missing `og:image:alt`, wrong canonical, source map.

## 13. Files

- **New:**
  - code: `src/data/og.ts`, `src/pages/og/[key].jpg.ts`, `src/pages/robots.txt.ts`,
    `src/assets/fonts/*-turkish-wght-normal.woff2`;
  - scripts: `scripts/subset-fonts.py`, `scripts/lighthouse.mjs`;
  - tests: `playwright.config.ts`, `e2e/{fixtures.ts,smoke.spec.ts,a11y.spec.ts}`,
    `tests/seo-stage7.test.ts`;
  - docs: the six `docs/*` audits and reports.
- **Changed:**
  - config: `astro.config.ts` (CSP, inline styles, font inlining, markdown highlight off);
  - layout and components: `BaseLayout`, `Breadcrumbs`, `MediaFrame`, `ProjectCard`,
    `ProjectGallery`, `FeatureRow`, `SiteFooter`;
  - pages: `index`, `404`, `projeler/index`, `projeler/[slug]`, `hakkimizda`, `hizmetler`,
    `iletisim`, `faaliyetlerimiz`;
  - library and data: `src/lib/seo.ts`, `src/lib/media.ts`, `src/styles/global.css`;
  - tooling: `scripts/verify-dist.mjs`, `package.json` (dev dependencies and scripts),
    `tsconfig.json`, `eslint.config.js`, `.gitignore`, `.prettierignore`.
- **Removed:** `public/robots.txt`, replaced by the generated endpoint. It was a Stage 1 file, not
  company media. No original asset was deleted.

## 14. Stage 8 recommendations

1. **Owner review first.** Work through `OWNER_REVIEW_CHECKLIST.md`, apply the confirmed facts and
   wording, and re-run `npm run validate:full`.
2. **Workflow:** add `.github/workflows/deploy.yml` (`DEPLOYMENT_PLAN.md` §3).
   - Steps: `npm ci`, `npm run validate`, then
     `npx playwright install --with-deps chromium && npx playwright test`; upload `dist/`.
   - Pin actions to commit SHAs.
3. **Preview:** deploy a `SITE_INDEXING=off` build to a non-production Pages target. On it:
   - repeat the legacy-URL, extension-less-URL, trailing-slash and 404 checks (D2);
   - run the Rich Results Test;
   - run Lighthouse against the real host, now with compression.
4. **Cut-over** per `DEPLOYMENT_PLAN.md` §4: tag the rollback point, switch Pages to Actions, merge
   via PR (owner), verify, then enforce HTTPS.
5. **After launch:**
   - Search Console: sitemap, coverage, field CWV including INP;
   - watch 404s;
   - consider moving to a host with headers if HSTS and `frame-ancestors` become requirements.
6. **Legacy retirement:** a separate approved commit that moves the legacy HTML/CSS into
   `legacy/`, keeping media originals.
