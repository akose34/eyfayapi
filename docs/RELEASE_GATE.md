# Release Gate (after GitHub upload)

**Date:** 2026-11-10

**State:**

- Branch `redesign/eyfa-professional` is pushed.
- PR [#1](https://github.com/akose34/eyfayapi/pull/1) is open against `main`.
- **`main` is unchanged** (`5da2426`). The live site is byte-identical to the legacy `index.html`
  (checked with `cmp` against `https://eyfayapi.net/`).
- Nothing has been merged or deployed, and no setting has been changed.

**Decision: production cut-over is NOT authorized yet.** Twelve blocking content items are
unanswered, and the deployment approval gate still needs one owner setting (§3).

## 1. Content classification

The owner authorized the GitHub upload. That is **not** approval of any content. Material from the
old website counts as "stated on the old site", not as approved for republication.

| Class                                    | Items (`FINAL_OWNER_APPROVAL.md` numbering)                                                                                                                                                           |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Approved by the owner**                | None recorded yet                                                                                                                                                                                     |
| **Unconfirmed facts** (blocking)         | 2.1 project names; 2.4 Proje 04/06 the same building?; 2.8–2.11 phone, landline, e-mail, address/pin; 2.13 Müteahhitlik; 2.18 slogan; 2.19 founder/2004; 2.21 SUGİAD attribution; 2.26 editorial copy |
| **Unconfirmed facts** (not blocking)     | 2.2 locations/types/years (not shown); 2.5 construction status (only labelled "İnşaat sürecinden"); 2.7 gallery relations; 2.12 Instagram; 2.23 hours (not shown)                                     |
| **Media with unresolved rights**         | 4.1 all published photos (photographer/licence undocumented); 2.6 / 4.3 floor plans (authorship unknown); 4.4 logo (no vector). The founder portrait (4.2) is **not** published                       |
| **Content that can be safely excluded**  | Drawings-only projects 07, 09, 10, 11 (§2.1); one of Proje 04/06 (§2.2)                                                                                                                               |
| **Content that must not be excluded**    | Contact details and project photographs (the site's purpose); SUGİAD (excluding it empties the Activities page, §2.3)                                                                                 |
| **Must be corrected before publication** | Nothing is known to be wrong. Recommended softening of unsupported legacy claims: 2.14 "başarıyla", 2.15 "öne çıkmıştır", 2.16 "güvenilir çözümler", 2.17 "uzman / yetkin"                            |

## 2. Safe exclusions: prepared and measured, NOT applied

Each exclusion uses the existing data model (`visibility: 'withheld'` + `withheldReason`), the
same mechanism already used for Proje 08. A local dry run (reverted, never pushed) produced the
results below.

### 2.1 Withhold the drawings-only projects (resolves blocker 2.6 / 4.3)

- **Change:** `visibility: 'withheld'` on projects 7, 9, 10 and 11 in `src/data/projects.ts`.
- **Result of the dry run:** their pages became redirect documents to `/projeler/` (URLs never
  404), and the build shrank from 31.2 MB to 27.3 MB. Four existing tests failed **by design**,
  flagging follow-up work that must be done in the same change:
  1. The homepage "Mimarlık" thumbnail uses a floor plan from Proje 10 (`7795_4-7.webp`). It must
     be swapped for a public photograph, or the row shown without an image.
  2. The images must be removed from the registration allowlist in `src/lib/media.ts`, so their
     originals are not shipped.
  3. `PORTFOLIO_ORDER` must drop the four slugs.
  4. Test expectations for the public portfolio must be updated.
- **Consequences:**
  - The portfolio goes from 10 to 6 projects, all photographic, and the "Proje çizimleri" section
    disappears.
  - The Mimarlık service loses its only architectural illustration.
- **Recommendation:** apply **only if** the owner cannot confirm the drawings' authorship before
  launch. Otherwise keep them.

### 2.2 Show only one of Proje 04 / 06 (resolves blocker 2.4)

- **Change:** withhold one slug (the same mechanism). The URL becomes a redirect.
- **Consequences:** one fewer project; no risk of presenting one building as two projects.
- **Recommendation:** ask the owner first. A merge into one gallery is better if they are the same
  building.

### 2.3 Withhold SUGİAD (would resolve 2.21): not recommended

- **Dry run:** the Activities page renders with **no items**.
- Excluding it would also require removing the page from the header and footer, and re-pointing
  `/faaliyetlerimiz/` and the legacy `/faaliyet.html` redirect.
- That damages structure for one sentence. Ask the owner instead.

## 3. GitHub configuration (read via the API, unchanged)

| Setting                    | Current                                              | Needed before cut-over                                                                                                                         |
| -------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Pages build                | legacy, branch `main`, `/`                           | switch to **GitHub Actions** at cut-over (`RELEASE_RUNBOOK.md` §4.2), not before                                                               |
| Custom domain              | `eyfayapi.net` (root `CNAME` file present)           | keep; re-check after the switch                                                                                                                |
| Certificate                | approved, `eyfayapi.net` + `www`, expires 2027-01-21 | none                                                                                                                                           |
| Enforce HTTPS              | **off**                                              | turn on after the first successful deploy                                                                                                      |
| `github-pages` environment | exists; deployment branches: `main` only             | **add a required reviewer (the owner)**. Without it, `deploy.yml` is protected only by manual dispatch, `main`-only and the typed confirmation |
| `main` branch protection   | none                                                 | recommended: require the "Validate, test, build" check before merge; block force-pushes                                                        |
| Default workflow token     | read-only                                            | keep                                                                                                                                           |

## 4. Workflow review

- **`ci.yml`:** verification only (`contents: read`).
  - Builds the production and staging outputs.
  - Runs validate, typecheck and Playwright.
  - Uploads build artifacts, which are visible to repository members.
- **`deploy.yml`:**
  - manual dispatch, `main` only, typed confirmation `eyfayapi.net`;
  - refuses `SITE_INDEXING=off`; the full gate runs again;
  - uploads `dist/` with `upload-pages-artifact`, then `deploy-pages` in the `github-pages`
    environment;
  - `permissions: {}` by default; `pages: write` + `id-token: write` only on `deploy`.
- **Output served at the domain root:** `site: https://eyfayapi.net` and root-relative URLs. A
  project-path Pages URL would break links, which is why the custom domain is required.
- **Redirects, sitemap and robots:** generated in `dist/` and verified by `verify-dist` in both
  workflows. Production robots allow crawling and name the sitemap. Indexing starts the moment the
  production deployment is live.
- **Rollback:** switch the Pages source back to "Deploy from a branch: `main` /". The legacy root
  files stay on `main`, and `.nojekyll` serves them verbatim (`ROLLBACK_RUNBOOK.md`).

## 5. Owner actions required before release (in order)

1. Answer `FINAL_OWNER_APPROVAL.md` §2 (the 12 blocking items), §3 design and §4 image rights. Or
   choose the exclusions in §2 above.
2. Developer applies the answers on `redesign/eyfa-professional` → CI green on PR #1.
3. Owner: Settings → Environments → `github-pages` → add yourself as **required reviewer**.
4. Owner (recommended): Settings → Branches → protect `main` (require the CI check).
5. Owner authorizes the release explicitly. Then follow `RELEASE_RUNBOOK.md` §3.3–§5:
   1. tag `legacy-site-final`;
   2. merge PR #1;
   3. switch the Pages source to GitHub Actions;
   4. run "Deploy to GitHub Pages" with `eyfayapi.net` and approve it;
   5. check the domain;
   6. enable Enforce HTTPS;
   7. run the smoke tests.

## 6. Update 2026-11-11 (pre-launch cleanup)

- The owner's confirmations are incorporated: phones, e-mail and address; project photos genuine,
  taken by the owner, authorized; project metadata unavailable.
- **Exclusion §2.1 applied:** all 21 unverified drawings are withheld. Proje 07, 09, 10 and 11 are
  redirect documents, and the homepage Mimarlık thumbnail is now an owner photo.
- **Exclusion §2.2 not applied:** the photos indicate two buildings, so both are kept with no claim
  either way.
- **Exclusion §2.3 not applied:** SUGİAD becomes confirmation C2 in the final authorization.
- **Rewritten:** the unsupported claims (`src/data/published-copy.ts`).
- **Navigation:** Activities moved to the footer.
- **Blocker count:** 12 → **0 hard blockers**. Classification: **READY FOR FINAL PUBLICATION
  AUTHORIZATION** (`PRELAUNCH_FINAL_STATUS.md`).
- **GitHub settings** (still unchanged): the `github-pages` environment has no reviewer. Add
  `akose34` and leave "Prevent self-review" off (sole collaborator). For `main` protection, require
  the CI check but not approvals.

## 7. Final update (2026-11-11): content approvals complete

- **C1 approved** (founding statement kept). **C3 approved** (slogan kept).
- **C2:** the SUGİAD membership is personal. The corporate attribution is removed, and Activities
  is retired.
  - `/faaliyetlerimiz/` and `/faaliyetler/` are `noindex` redirect documents to `/hakkimizda/`.
  - `/faaliyet.html` now goes straight to `/hakkimizda/`.
  - The footer link is removed, and the sitemap has 5 pages.
- **CI fix:** CI failed on `6954bbf`. The cause was a timeout, not an assertion: the
  pixel-measurement test took 5.26 s against Vitest's 5 s default. It now has an explicit 60 s
  budget, with the assertion unchanged.
- **Content blockers: 0.** Remaining: deployment actions only (`RELEASE_RUNBOOK.md` §0), starting
  with the owner's explicit production release authorization.
