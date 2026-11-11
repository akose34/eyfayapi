# Stage 8 Report: Final Design Review, Content Readiness and Release Preparation

- **Branch:** `redesign/eyfa-professional`
- **Base:** Stage 7 commit `79d7950`
- **Date:** 2026-11-10
- **Status:** release preparation complete. **Nothing was pushed, merged or deployed.** `main`
  is unchanged at `5da2426`, the live legacy site. No GitHub, Pages, DNS or domain setting was
  touched.
- **Final status: READY FOR OWNER APPROVAL.** Publication stays blocked by content until
  `FINAL_OWNER_APPROVAL.md` is answered.

Release package:

- `FINAL_OWNER_APPROVAL.md`
- `RELEASE_RUNBOOK.md`
- `ROLLBACK_RUNBOOK.md`
- `FINAL_DESIGN_REVIEW.md`
- `docs/proposals/founder-section-{desktop,mobile}.jpg`

## 1. Development status

All technical work is done. The site builds deterministically, passes every gate (§6–§7), and
ships no withheld media, no tracking and no third-party requests before consent. The remaining
work is owner decisions and the authorized cut-over.

## 2. Design adjustments (Stage 8)

| Change                                     | Why                                                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Hero: wide eased gradient, overlay +1 px   | Removed a hard seam: linear-ramp banding plus a 1 px light anti-aliasing line at a fractional x (633.6 px) |
| Hero on phones: 5:4 instead of square      | "Projelerimiz" is now visible in the first screen at 375×812. The building and roof sign stay in frame     |
| Dark image placeholder inside `.tone-dark` | No light flash before photos load on dark sections (hero, project hero, contact band)                      |

Proposals that need the owner (not implemented): hero alternative, headline, Services header
repetition, footer tagline, Activities navigation. See `FINAL_DESIGN_REVIEW.md` §3.

## 3. Founder section

**Recommendation:** an understated note on About ("Kurucumuz · Fatih Yılmaz · Kurucu · EYFA Yapı’yı
2004 yılında İstanbul’da kurdu."), with a 4:5 portrait, below the company story. **Not published**,
pending two things:

- the founder's consent;
- preferably a re-shoot on a neutral background. The current photo is 1080×1080 and well lit, but
  a large framed historical photograph dominates its background.

The legacy biography (age, student status, hometown, family, association roles) stays withheld.
Mockups are in `docs/proposals/`. They were built on a temporary page that was deleted; the build
contains no founder files (checked).

## 4. Remaining content uncertainties

26 numbered items in `FINAL_OWNER_APPROVAL.md` §2. **12 block publication**:

- project names;
- Proje 04/06 possibly the same building;
- floor-plan authorship;
- the mobile, landline, e-mail and address/pin;
- Müteahhitlik as a service;
- the slogan;
- the founder fact;
- SUGİAD attribution;
- the Stage 5 editorial copy.

Old-site information is treated as "stated on the old site", not as confirmed current fact.

**Navigation:** recommended header = Ana Sayfa · Hakkımızda · Projeler · Hizmetler · [İletişim],
with Activities in the footer only. Not changed: it needs the owner's decision (option A/B/C). No
route is orphaned under any option.

## 5. Image-rights blockers

`FINAL_OWNER_APPROVAL.md` §4:

- the photographer/licence for the published photos is undocumented;
- the founder portrait needs consent;
- floor-plan authorship is unknown;
- the logo has no vector master;
- withheld media stays withheld.

## 6. Automated test results (final run on the committed tree)

| Gate                           | Result                                                                                                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run validate`             | pass: format, lint, `astro check` 0/0, **209** unit tests, build, verify-dist (31.2 MB / 40 MB)                                                                                                 |
| `npm run typecheck`            | pass: 0 errors, 0 warnings                                                                                                                                                                      |
| Playwright (desktop + Pixel 7) | **111 passed**, 13 skipped (device-specific), 0 failed. Includes axe on 17 routes, routes, redirects, menu, lightbox keyboard + swipe, contact links, map consent, CSP, no third-party requests |
| Staging build                  | `SITE_INDEXING=off` build verified (all `noindex`, robots `Disallow: /`). The same build checked as production fails, as designed                                                               |
| Image publication guards       | Withheld media and founder portrait absent from `dist/`                                                                                                                                         |
| Workflow files                 | parse as YAML. **Not executed** (they run only on GitHub after an authorized push)                                                                                                              |

## 7. Browser and Lighthouse results

Lighthouse 13.6.0, Chrome 157 headless, local production build, 3-run median:

| Page           | Mobile P / LCP | Desktop P | A / BP / SEO     |
| -------------- | -------------- | --------- | ---------------- |
| Home           | 99 / 2.03 s    | 100       | 100 / 100 / 100  |
| Projects       | 98 / 2.41 s    | 100       | 100 / 100 / 100  |
| Project detail | 98 / 2.41 s    | 100       | 100 / 100 / 69\* |
| About          | 99 / 2.18 s    | 100       | 100 / 100 / 100  |
| Services       | 100 / 0.79 s   | 100       | 100 / 100 / 100  |
| Activities     | 100 / 0.78 s   | 100       | 100 / 100 / 100  |
| Contact        | 99 / 0.89 s    | 100       | 100 / 100 / 100  |

\* Intentional `noindex` on unconfirmed projects. CLS is 0 everywhere.

- Home mobile LCP rose from 1.96 s to 2.03 s because the shorter phone hero brings more content
  into the first screen. It is still well under the 2.5 s target.
- Contact mobile TBT varied (139 ms in one median). That is measurement noise on a page with
  1.2 KB of script.

**Performed:**

- Playwright Chromium (desktop and Pixel 7 emulation);
- the Chromium browser pane at 1440, 1024 and 375 px, including the mobile menu;
- full-page captures at 390 and 1440.

**Not performed (must not be claimed):**

- real iPhone or Android devices;
- Safari and Firefox;
- VoiceOver or NVDA;
- tests on GitHub Pages hosting.

## 8. GitHub Actions preparation

- **`ci.yml`** (verification only):
  - triggers: PRs to `main`, pushes to `redesign/**`, manual;
  - Node from `.nvmrc` (24), `npm ci`, validate, typecheck, Playwright with Chromium;
  - uploads the production build, a staging build (`SITE_INDEXING=off`, verified with
    `verify-dist --dist`) and, on failure, the Playwright report;
  - `contents: read` only.
- **`deploy.yml`** (production):
  - manual dispatch only, `main` only, typed confirmation `eyfayapi.net`;
  - refuses a staging configuration; the same full gate;
  - `upload-pages-artifact` → `deploy-pages` behind the `github-pages` environment, which needs a
    required reviewer.
- **Permissions:** default `{}`; `verify` has `contents: read`; `deploy` has `pages: write` +
  `id-token: write`.
- **Actions pinned to commit SHAs:**

  | Action                          | Version |
  | ------------------------------- | ------- |
  | `actions/checkout`              | 7.0.1   |
  | `actions/setup-node`            | 7.1.0   |
  | `actions/upload-artifact`       | 7.0.2   |
  | `actions/upload-pages-artifact` | 5.0.0   |
  | `actions/deploy-pages`          | 5.0.1   |

- **`.nojekyll`** added so that merging into `main` before the source switch keeps the legacy site
  serving verbatim. Checked: the legacy site uses no Jekyll features.
- **Repository settings the owner changes at cut-over:** `RELEASE_RUNBOOK.md` §3.4–§4.4 (the
  `github-pages` environment reviewers and branch rule, Pages source → GitHub Actions, the custom
  domain check, Enforce HTTPS).

## 9. Staging proposal

`RELEASE_RUNBOOK.md` §2:

- **A: local / LAN review.** No authorization needed. Works on phones on the same Wi-Fi, and is
  also available as a downloadable CI artifact.
- **B: separate staging repository + `staging.eyfayapi.net`.** Needs authorization for the
  repository and DNS. It's the only way to test GitHub Pages' own URL handling before release.
  Not indexable: robots blocks crawling, every page is `noindex`, and canonicals point to
  production.
- **Never published by the main repository.**

## 10. Production cut-over procedure

`RELEASE_RUNBOOK.md`:

1. Preflight.
2. Push and PR. CI green.
3. Rollback tag `legacy-site-final` → `5da2426`.
4. Environment protection.
5. **Merge** (legacy still served).
6. **Switch the Pages source to Actions.**
7. **Run deploy + approve.**
8. Custom domain check, then Enforce HTTPS.
9. Production smoke tests: routes, redirects, 404 status, robots/sitemap, phone links (no
   sending), map consent, share preview, caching.
10. Search Console.

Expected disruption: at most a few minutes between steps 6 and 7.

## 11. Rollback readiness

`ROLLBACK_RUNBOOK.md`:

- **Fastest path (about 1–10 minutes):** switch the Pages source back to "Deploy from a branch:
  `main` /". The legacy root files stay on `main` until a separate retirement PR, and `.nojekyll`
  serves them unchanged.
- **Alternatives:** fix forward, or revert the merge and redeploy.
- Recovery steps are given for a failure at each point of the first deployment.
- No DNS change is ever needed.

## 12. Remaining owner approvals

`FINAL_OWNER_APPROVAL.md`:

- **§2 content:** 26 items, 12 blocking, plus the navigation decision.
- **§3 design:** 6 items.
- **§4 image rights:** 5 items.
- **§5 publishing authorizations:** 10 steps.

All boxes are unticked. Nothing was approved on the owner's behalf.

## 13. Files

- **New:**
  - `.github/workflows/ci.yml` and `.github/workflows/deploy.yml`;
  - `.nojekyll`;
  - the five release-package docs and `docs/proposals/*.jpg`.
- **Changed:**
  - `src/pages/index.astro`: hero gradient, phone crop;
  - `src/components/MediaFrame.astro`: dark placeholder;
  - `scripts/verify-dist.mjs`: `--dist`;
  - `.gitignore` / `.prettierignore`: `dist-staging/`;
  - docs: `DEPLOYMENT_PLAN`, `RELEASE_BLOCKERS`, `OWNER_REVIEW_CHECKLIST`, `ROADMAP`,
    `ARCHITECTURE`.
- **No original media deleted.** The temporary mockup page and image were removed before commit.

## 14. Actions that still require authorization

Exactly these; none was done:

1. Push the branch (runs CI only).
2. Open the PR to `main`.
3. Create and push the tag `legacy-site-final`.
4. Configure the `github-pages` environment (required reviewer, `main` only).
5. Optional staging: a new repository plus the DNS record `staging.eyfayapi.net`.
6. Merge the PR into `main`.
7. Switch Pages source → GitHub Actions.
8. Run "Deploy to GitHub Pages" and approve the environment.
9. Confirm the custom domain; enable Enforce HTTPS.
10. Search Console verification and sitemap submission.
11. Any rollback step.
