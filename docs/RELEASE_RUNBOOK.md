# Release Runbook (eyfayapi.net)

**Nothing in this runbook has been executed.** Each step marked 🔒 changes something outside the
local machine and needs the owner's explicit authorization (`FINAL_OWNER_APPROVAL.md` §5). Do not
start §3 until every content blocker in `FINAL_OWNER_APPROVAL.md` §2 is answered.

Facts this runbook relies on:

- The live site is GitHub Pages, "Deploy from a branch", `main` `/`, serving the legacy root HTML.
  `main` = `5da2426`. The domain `eyfayapi.net` comes from the root `CNAME` file. HTTPS is not
  enforced.
- The new site is the Astro build in `dist/`. It is produced by
  `.github/workflows/deploy.yml`, which is manual, `main` only, needs the typed confirmation
  `eyfayapi.net`, and is gated by the `github-pages` environment approval.
- The legacy root files (`index.html`, `about.html`, CSS, media) **stay in the repository** after the
  merge. That is what makes rollback a single settings change (`ROLLBACK_RUNBOOK.md`).
- `.nojekyll` (added in Stage 8) makes any branch build serve root files verbatim. Without it,
  merging would let Jekyll process `docs/*.md` (which contain `${{ }}` workflow syntax).
  The legacy site uses no Jekyll features (checked: no `_config.yml`, no Liquid, no `_` files).

---

## 1. Preflight (local, no authorization needed)

```bash
cd eyfayapi-redesign
export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
git switch redesign/eyfa-professional && git status          # clean, except .DS_Store noise
npm ci
npm run validate                                             # must pass
npm run typecheck                                            # must pass
npx playwright test                                          # must pass (builds from dist/)
npx astro preview --port 4323 --host 127.0.0.1 --background
npm run lighthouse                                           # mobile perf ≥ 90 on all pages
npx astro preview stop
```

Checklist:

- [ ] `FINAL_OWNER_APPROVAL.md` §2–§4 answered, and the changes applied in a commit.
- [ ] `RELEASE_BLOCKERS.md` content items closed or explicitly accepted.
- [ ] `dist/robots.txt` says `Allow: /`, and no page carries an unintended `noindex`
      (`verify-dist` enforces both).
- [ ] `git diff 5da2426 -- CNAME` is empty (domain file untouched).

## 2. Staging (review before release)

Rules for any staging copy: don't touch the live site; not indexable; no internal documents;
reviewable on desktop and phone.

### Option A — local / LAN review (recommended first; no authorization needed)

```bash
SITE_INDEXING=off npm run build && SITE_INDEXING=off node scripts/verify-dist.mjs
npx astro preview --host --port 4321     # prints a LAN URL such as http://192.168.1.20:4321
```

- Open the LAN URL on the owner's phone on the same Wi-Fi network. Stop the server afterwards
  (Ctrl-C).
- Old URLs can be tested here (`/about.html`, `/projeler.html`, …) with Astro's server.
- Only `dist/` is served. `docs/` is never in the build (`verify-dist` checks).
- **Alternative after 🔒 push:** the CI workflow uploads `eyfayapi-staging-dist` as a build artifact
  (Actions run → Artifacts). Download it, unzip, and serve the folder locally the same way.

### Option B — hosted staging on GitHub Pages (🔒 needs authorization: new repository + DNS)

Use this to test **GitHub Pages behaviour** before cut-over: extension-less URLs, the trailing-slash
301, and the 404 status.

1. 🔒 The owner creates a separate repository, e.g. `akose34/eyfayapi-staging` (public, because
   Pages on private repositories needs a paid plan). It contains only a copy of
   `.github/workflows/deploy.yml`, adapted to:
   - check out `akose34/eyfayapi` at the release branch;
   - build with `SITE_INDEXING: 'off'`;
   - drop the `main` and confirmation guards (the environment approval stays).
2. 🔒 DNS: add `CNAME staging → akose34.github.io`. In the staging repository → Settings → Pages,
   set the custom domain `staging.eyfayapi.net`.
   - A custom domain is required because the site uses root-relative URLs; a project path like
     `/eyfayapi-staging/` would break every link.
3. 🔒 Run the staging workflow. Review on desktop and phones.
4. Check that `https://staging.eyfayapi.net/robots.txt` says `Disallow: /` and every page has
   `noindex`.
   - Canonical URLs point to `https://eyfayapi.net/…`, so even an accidental crawl attributes
     content to production.
5. Delete the staging Pages site and the DNS record after the release.

Option C (Netlify / Cloudflare preview) would add a third-party processor and account. It's not
recommended unless the owner wants real HTTP headers.

## 3. Repository preparation (🔒)

1. 🔒 Push the branch: `git push -u origin redesign/eyfa-professional`. This triggers `ci.yml`,
   which verifies but does not publish. Wait for green.
2. 🔒 Open a PR `redesign/eyfa-professional → main`. The owner reviews the diff. CI runs again.
3. 🔒 Tag the rollback point (the current production commit):

   ```bash
   git tag -a legacy-site-final 5da2426 -m "Legacy site served before the Astro release"
   git push origin legacy-site-final
   ```

4. 🔒 Owner → Settings → Environments → `github-pages`. The environment is created by GitHub the
   first time Pages uses Actions; if it isn't listed yet, do this right after §4.2.
   - **Required reviewers:** the owner.
   - **Deployment branches and tags:** "Selected branches" → `main` only.
   - Optional: "Prevent self-review".
5. Owner → Settings → Actions → General → Workflow permissions: **Read repository contents**. Each
   workflow requests only what it needs.

## 4. Cut-over (🔒, owner present, low-traffic time; expect about 15 minutes)

1. 🔒 **Merge** the PR into `main`. The legacy branch build (still active) serves the root files
   verbatim (`.nojekyll`); the legacy site stays up.
   - Side effect for the minutes until step 3: repository files such as `/docs/…` become
     reachable on the domain. This is not sensitive: the repository is public anyway.
2. 🔒 Owner → Settings → **Pages → Build and deployment → Source: "GitHub Actions"**.
   - Expected: the previous deployment keeps serving until a new one replaces it. Treat a short
     gap as possible and go straight to step 3.
3. 🔒 Actions → **Deploy to GitHub Pages** → Run workflow on `main`, input `eyfayapi.net`.
   - `verify` runs the full gate (about 5–8 minutes).
   - 🔒 Owner approves the `deploy` job in the environment prompt.
4. 🔒 Settings → Pages:
   - **Custom domain** shows `eyfayapi.net` with a green DNS check. With Actions deployments, the
     domain lives in this setting, not in a `CNAME` file in the artifact. Re-enter it if it's
     empty.
   - When the certificate is ready, tick **Enforce HTTPS**.

## 5. Post-release verification (production smoke tests)

Run on desktop and on a phone (mobile data, not office Wi-Fi):

- [ ] `https://eyfayapi.net/` shows the new homepage; `http://` redirects to `https://` (after
      Enforce HTTPS).
- [ ] `https://www.eyfayapi.net/` redirects to the apex.
- [ ] Routes: `/hakkimizda/`, `/hizmetler/`, `/projeler/`, `/projeler/proje-06/`,
      `/faaliyetlerimiz/`, `/iletisim/`.
- [ ] Legacy URLs redirect: `/about.html` → `/hakkimizda/`, `/projeler.html` → `/projeler/`,
      `/faaliyet.html` → `/faaliyetlerimiz/`, `/anaEkran.html` → `/`, `/index.html` → home.
- [ ] Extension-less variants (`/about`, `/projeler`) and trailing-slash-less directories
      (`/hakkimizda`) land on the right page.
- [ ] An unknown path (`/yok/`) shows the Turkish 404 page with HTTP 404:
      `curl -sI https://eyfayapi.net/yok/ | head -1`.
- [ ] `https://eyfayapi.net/robots.txt` → `Allow: /` + Sitemap line. **Indexing is active from this
      moment**; there is no separate switch.
- [ ] `https://eyfayapi.net/sitemap-index.xml` lists the 6 pages (plus any projects confirmed
      before release).
- [ ] Phone: tap the call, WhatsApp, e-mail and directions links. The right app opens with the
      right number and message. **Do not send.**
- [ ] Contact page: no Google request before "Haritayı yükle"; the map loads after it.
- [ ] Share preview: paste the URL into a messaging app draft; the logo + photo image appears.
- [ ] Cache: GitHub Pages serves with `Cache-Control: max-age=600`. Hashed `/_astro/` assets
      change names on every build, so stale pages clear within about 10 minutes. Hard-refresh
      when checking.
- [ ] Optional: run the Playwright suite against production (read-only):
      `PLAYWRIGHT_BASE_URL=https://eyfayapi.net npx playwright test e2e/smoke.spec.ts`.
      This needs a small config change, since tests currently assume the local preview. The
      local suite is the gate.

## 6. After release

1. 🔒 Search Console (owner's Google account): verify `eyfayapi.net` (DNS TXT), submit
   `sitemap-index.xml`, inspect `/` and `/about.html`.
2. Run the Rich Results Test on `https://eyfayapi.net/`.
3. Monitor for two weeks: 404 reports, "Page with redirect" (expected for legacy URLs), and field
   Core Web Vitals including INP.
4. Legacy retirement: a separate, approved PR that moves the root legacy HTML/CSS into `legacy/`
   (keeping media). Do it **only after** the release has been stable for two weeks, because the
   root files are the fast rollback path.

## 7. Downtime and failure risks

| Risk                                                           | Likelihood | Effect                                           | Mitigation                                                                  |
| -------------------------------------------------------------- | ---------- | ------------------------------------------------ | --------------------------------------------------------------------------- |
| Gap between the source switch (4.2) and the first deploy (4.3) | Low–medium | Possible 404 or the old site for a few minutes   | Do 4.2 and 4.3 back to back. Rollback = switch the source back              |
| `verify` fails in CI (e.g. a flaky browser test)               | Low        | Nothing published; the legacy site keeps serving | Fix, or re-run. The live site is unaffected                                 |
| Custom domain lost after the switch                            | Low        | `eyfayapi.net` 404 / certificate warning         | Re-enter the domain in Settings → Pages; DNS is unchanged so it re-verifies |
| Certificate re-issuance delay                                  | Low        | HTTPS warning for minutes to hours               | Keep Enforce HTTPS off until the certificate shows as ready                 |
| Legacy URL behaves differently on Pages                        | Low        | Inbound links land on 404                        | Option B staging tests it beforehand. Fix by adding a stub in `public/`     |
| Content error found after release                              | Medium     | Wrong fact visible                               | Fix in a PR → re-run deploy (about 10 minutes), or roll back                |
