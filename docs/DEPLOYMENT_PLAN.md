# Deployment Plan

**Status: plan only. Nothing has been deployed, pushed or reconfigured.** Every step below that
touches GitHub settings, `main`, DNS or the live site requires the owner's explicit approval.

## 1. Current production (read-only inspection, 2026-11-10)

| Item           | Value                                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Host           | GitHub Pages, repository `akose34/eyfayapi` (public)                                                                    |
| Build          | **Legacy** "Deploy from a branch": `main`, folder `/` (Jekyll processing of the repo root)                              |
| Domain         | `eyfayapi.net` via the `CNAME` file. HTTPS certificate valid for `eyfayapi.net` and `www.eyfayapi.net` until 2027-01-21 |
| HTTPS enforced | **No**                                                                                                                  |
| Live parity    | Live `index.html` is identical to `origin/main:index.html`                                                              |
| CI             | None                                                                                                                    |

## 2. Why the current setup cannot serve the new site as is

The legacy Pages build publishes the repository root. The new site's deployable output is the
generated `dist/` folder, which is not committed (`.gitignore`). If `redesign/eyfa-professional`
were merged into `main` without changing Pages settings, GitHub would keep serving the legacy root
HTML. That is harmless but wrong. If the legacy HTML were later removed, the site would break.
**The redesign must not be merged into `main` until step 4 is in place.**

## 3. Target setup (recommended): GitHub Pages via GitHub Actions

It costs nothing, needs no new service and no secrets, keeps the domain and certificate, and is
fully static.

Workflow to be added in Stage 8 (`.github/workflows/deploy.yml`), shown here for review:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run validate # format, lint, types, tests, build, dist verification
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Pin the action versions to the current majors (or commit SHAs) when the file is actually added,
and verify them at that time.

Notes:

- With Actions-based Pages, the custom domain is stored in the repository settings, so a `CNAME`
  file is not required in `dist/`. The root `CNAME` stays as part of the legacy site until
  retirement. Adding `public/CNAME` is harmless if wanted.
- `404.html` is emitted at the root of `dist/`, and Pages serves it automatically.
- `trailingSlash: 'always'` and `build.format: 'directory'` match GitHub Pages' directory-index
  behaviour.

## 4. Cut-over procedure (Stage 8, each step approved)

1. **Preview.** Run the workflow on a non-production target first: `workflow_dispatch` on a fork, or
   a temporary separate repository with Pages. Check every route and every legacy redirect against
   the preview URL.
2. **Freeze.** Record the current `main` SHA (`5da2426` at the time of the audit) as the rollback
   point and tag it, for example `legacy-site-final` (owner approval needed to push tags).
3. **Settings.** Owner switches _Settings → Pages → Build and deployment → Source_ to "GitHub
   Actions". This takes effect on the next deploy.
4. **Merge.** Open a PR `redesign/eyfa-professional → main`. The owner reviews and merges. The
   workflow builds and deploys `dist/`.
5. **Verify.** Check `https://eyfayapi.net/`, every route, `/projeler.html` (and the other
   legacy URLs) redirecting, `/404`, `robots.txt` and `sitemap-index.xml`, on mobile and desktop.
6. **HTTPS.** Owner enables "Enforce HTTPS".
7. **Search.** Submit `https://eyfayapi.net/sitemap-index.xml` in Google Search Console (owner's
   account).

## 5. Rollback

- Fast: revert the merge commit on `main` (`git revert -m 1 <merge>`). The workflow redeploys the
  previous build. Before legacy retirement, the reverted tree still contains the legacy HTML.
- Full: switch Pages source back to "Deploy from a branch → main /" and revert. The legacy site is
  live again within minutes. Domain and certificate are unaffected.

## 6. Optional form integration (not part of v1)

The site ships no form. If a form is ever needed:

- Prefer a provider that accepts plain HTML `POST` with no client-side API keys (for example
  Formspree, Basin, or Netlify Forms if hosting moves to Netlify). Review data processing for
  KVKK compliance, spam protection (honeypot plus provider-side filtering) and where data is stored.
- Add an explicit KVKK consent text and a privacy notice page.
- Never put secrets in the client bundle. Any provider key that must be secret disqualifies a
  purely static setup.
- This requires owner approval and a separate review. Until then contact remains `tel:`, `mailto:`
  and WhatsApp.

## 7. Alternatives considered

| Option                                   | Pros                                        | Cons                                              |
| ---------------------------------------- | ------------------------------------------- | ------------------------------------------------- |
| **GitHub Pages + Actions** (recommended) | Free, same domain and cert, no new accounts | No server-side 301s (handled by redirect stubs)   |
| Commit `dist/` to a `gh-pages` branch    | No Actions needed                           | Generated files in Git, manual and error-prone    |
| Cloudflare Pages / Netlify               | Real 301s, headers, previews                | New account and DNS change, third-party processor |
