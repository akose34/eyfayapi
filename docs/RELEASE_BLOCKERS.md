# Release Blockers (Stage 7)

**Stage 8 classification: READY FOR OWNER APPROVAL, publication BLOCKED BY CONTENT.** The
technical work is complete, and the deployment workflow and runbooks are prepared. Every open
content question is now a numbered row in `FINAL_OWNER_APPROVAL.md` §2.

**Stage 7 classification (historical): BLOCKED PENDING CONTENT APPROVAL.**

The site is technically complete:

- validation, browser tests, Lighthouse and accessibility scans all pass;
- no technical blocker remains.

Public release is blocked by unverified content and by the owner decisions below. This status is
**not** permission to deploy. Deployment needs the owner's explicit approval (Stage 8).

## Content blockers (release cannot proceed without a decision)

### B1. Project names and facts are unconfirmed

- **Severity:** High.
- **Evidence:** all 10 public projects use temporary labels ("Proje 01…11"). `name`, `location`,
  `type` and `completionYear` are `UNKNOWN` in `src/data/projects.ts`. The pages are `noindex`
  (Lighthouse SEO 69 on project detail, by design).
- **Required decision:** the owner supplies a name (and optionally location, type and year) for
  each project, or approves launching with neutral labels.
- **Proposed resolution:** fill the confirmed fields as `VERIFIED`. Each such page then becomes
  indexable automatically; remove the sitemap filter at the same time (`SEO_AUDIT.md` §3).
  Alternatively, launch with the labels and keep the pages `noindex`.
- **Release impact:** without this the portfolio, the main proof of work, reads as a placeholder.

### B2. Contact details verified only against the legacy site

- **Severity:** High.
- **Evidence:** phones, e-mail, address and the Maps embed come from the legacy footer
  (`CONTENT_INVENTORY.md` §7). Nothing confirms they are current.
- **Required decision:** the owner confirms each value, and that 0 216 419 57 81 is the office line.
- **Proposed resolution:** owner sign-off in `OWNER_REVIEW_CHECKLIST.md`. Any change is a one-line
  edit in `src/data/company.ts`, and the tests follow.
- **Release impact:** a wrong number or address loses enquiries.

### B3. Legacy marketing copy needs approval

- **Severity:** Medium.
- **Evidence:** these legacy sentences are still shown verbatim and make claims the site cannot
  substantiate:
  - "başarıyla tamamladığı" (Projects page lead);
  - "bugüne dek teslim ettiği her projede … öne çıkmıştır" (homepage principle 3);
  - "güvenilir çözümler" (default meta description: homepage and 404);
  - "Uzman mimarlarla", "Alanında yetkin mühendislerle" and "Doğru projeleri, doğru yatırımcılarla"
    (service descriptions).
- **Required decision:** keep, soften (as Stage 5 did on the About page), or replace.
- **Proposed resolution:** the owner approves the wording, or picks the softened versions listed in
  `OWNER_REVIEW_CHECKLIST.md` §3.
- **Release impact:** reputational/legal (unsupported claims), not functional.

### B4. Media rights

- **Severity:** Medium.
- **Evidence:**
  - Withheld files (Autodesk educational watermark, THERMOsiding, third-party signage) stay
    unpublished (`PROJECT_MEDIA_REVIEW.md`).
  - Published photos are the company's own legacy media, but their photographer/licence is not
    documented.
- **Required decision:** the owner confirms the company holds the rights to the published photos
  and drawings.
- **Proposed resolution:** written confirmation in the checklist.
- **Release impact:** low likelihood, but a takedown would remove portfolio images.

## Deployment prerequisites (Stage 8 work, needs the owner's approval)

### D1. GitHub Pages must switch to Actions-based deployment (Stage 8: workflow prepared)

- **Severity:** High (for the release step only).
- **Evidence:** `DEPLOYMENT_PLAN.md` §2. Merging to `main` without this would keep serving the
  legacy HTML.
- **Required decision:** the owner approves the workflow and changes Pages → Source → "GitHub
  Actions".
- **Proposed resolution:**
  1. Add `.github/workflows/deploy.yml`, running `npm ci && npm run validate`, plus
     `npx playwright install chromium && npx playwright test` if CI browsers are wanted.
  2. Run it on a preview first.
- **Release impact:** this is the release mechanism.

### D2. Hosting-dependent behaviour is unverified

- **Severity:** Medium.
- **Evidence:** redirects, extension-less URLs, the 404 status and the trailing-slash 301 were
  tested on `astro preview`, not on GitHub Pages (`SEO_AUDIT.md` §6).
- **Proposed resolution:**
  1. Deploy a preview built with `SITE_INDEXING=off`.
  2. Repeat the legacy-URL checks against it.
  3. Run the Rich Results Test.
- **Release impact:** broken inbound links if a redirect behaves differently.

### D3. Security headers cannot be set on GitHub Pages

- **Severity:** Medium.
- **Evidence:** Pages does not allow custom headers. The CSP is delivered as a `<meta>` (hashes for
  every script and style, verified with zero violations). A meta CSP cannot express
  `frame-ancestors`, HSTS, `X-Content-Type-Options` or `Referrer-Policy`.
- **Required decision:** accept the Pages limits, or move hosting (Cloudflare Pages / Netlify)
  later.
- **Proposed resolution:**
  - Enable "Enforce HTTPS" in Pages (Stage 8).
  - If headers become a requirement, a `_headers` file is ready to write for those hosts (values
    in `STAGE_7_REPORT.md` §6).
- **Release impact:** acceptable for a brochure site with no forms, logins or cookies.

### D4. HTTPS is not enforced on the live domain today

- **Severity:** Medium.
- **Evidence:** `DEPLOYMENT_PLAN.md` §1.
- **Proposed resolution:** the owner ticks "Enforce HTTPS" after cut-over.

## Not blockers (documented, accepted)

- **Dev-only advisories:** 12 moderate `npm audit` findings, all in lint tooling (`minimatch` via
  ESLint / typescript-eslint). Production dependencies: 0. The fix requires major downgrades; the
  tools never run in production.
- **Opening hours:** not published, because there is no source.
- **Activities page:** sparse (one item); see `OWNER_REVIEW_CHECKLIST.md` §4.
- **Logo:** no vector master. The PNG works on dark surfaces.

## Stage 8 status of the deployment prerequisites

- **D1:** `.github/workflows/deploy.yml` is ready (manual, approval-gated). The owner still has to
  switch the Pages source (`RELEASE_RUNBOOK.md` §4.2).
- **D2:** a staging procedure is prepared (`RELEASE_RUNBOOK.md` §2). Option B needs a repository
  and DNS authorization.
- **D3:** unchanged (a Pages limitation).
- **D4:** a step in the release runbook (§4.4).
- **New, B5:** possible duplicate galleries (Proje 04 / 06) and floor-plan authorship are listed as
  blocking rows 2.4 and 2.6 in `FINAL_OWNER_APPROVAL.md`.
