# Rollback Runbook (eyfayapi.net)

Prepared in Stage 8. **Never executed.** Every step changes the live site and needs the owner's
authorization at the time.

**Rollback point:** tag `legacy-site-final` → `5da2426` (to be created and pushed during release,
`RELEASE_RUNBOOK.md` §3.3). Until legacy retirement, the legacy root HTML, CSS and media also stay
on `main`. That is what makes option 1 work.

## Decision guide

| Situation after release                                 | Use                                                   | Time to recover |
| ------------------------------------------------------- | ----------------------------------------------------- | --------------- |
| New site broken or wrong, need the old site back now    | **1. Switch the Pages source back**                   | ~1–10 min       |
| One content error or bug, new site otherwise fine       | **2. Fix forward** (or 3. redeploy an earlier commit) | ~10–15 min      |
| A bad commit merged; want the previous new-site version | **3. Redeploy a previous build**                      | ~10–15 min      |
| Domain or certificate problem                           | **4. Domain recovery**                                | minutes–hours   |

## 1. Restore the legacy site (fastest)

1. 🔒 Owner → Settings → Pages → Build and deployment → Source: **"Deploy from a branch"** →
   branch `main`, folder `/ (root)` → Save.
2. GitHub builds the root as a static site. `.nojekyll` means files are served as-is: the legacy
   `index.html`, `about.html`, etc. The root `CNAME` keeps the domain.
3. Check `https://eyfayapi.net/`: the legacy homepage (hard-refresh; about 10 minutes of caching).
4. If `main` no longer has the legacy root files (only after legacy retirement), first restore
   them in a PR:

   ```bash
   git switch -c rollback/legacy main
   git checkout legacy-site-final -- index.html about.html anaEkran.html faaliyet.html projeler.html \
     style.css main-style.css style-about.css projects.css deneme.css CNAME
   git commit -m "revert: restore legacy site files"
   ```

   🔒 Push, PR, merge, then step 1.

**Expected effects:** the new URLs (`/hakkimizda/`, `/projeler/proje-06/`, …) 404 while rolled back,
because the legacy site never had them. Search engines may have started indexing them; the
rollback should therefore be short. Inform the owner.

## 2. Fix forward

1. Fix on a branch → PR → CI green → 🔒 merge.
2. 🔒 Run "Deploy to GitHub Pages" (confirmation `eyfayapi.net`) → 🔒 approve the environment.

## 3. Redeploy a previous build

1. 🔒 `git revert -m 1 <merge-commit>` on a branch → PR → merge. This keeps history; never force-push.
2. 🔒 Run "Deploy to GitHub Pages". It builds the reverted `main`.
   - Pages keeps no deploy history to "promote" back, so a rebuild is the mechanism. Builds are
     deterministic from the lockfile.

## 4. Domain or certificate recovery

- **Custom domain empty** after a source change: Settings → Pages → Custom domain → `eyfayapi.net` →
  Save. DNS records are untouched in every procedure here, so verification succeeds again.
- **Certificate pending:** untick Enforce HTTPS, wait until the certificate shows as active
  (minutes to a few hours), then tick it again.
- **Never change DNS** as part of a rollback; it isn't needed.

## 5. Recovery if the first deployment fails

| Failure point                          | State of the live site                                                       | Action                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `verify` job fails                     | Unchanged (legacy) if the source isn't switched yet; possibly a gap if it is | If the source was switched: do §1 now. Then debug from the CI logs |
| `deploy` job fails / approval rejected | Same as above                                                                | Same                                                               |
| Deployed, but smoke tests fail         | New site live with a defect                                                  | Minor: §2. Major: §1                                               |

## 6. After any rollback

- [ ] Record what happened, when and why (in the PR or an issue).
- [ ] Check `https://eyfayapi.net/`, `/about.html` and the contact links on a phone.
- [ ] In Search Console, request re-indexing of `/` once the site is stable again.
- [ ] Re-run the release only after the cause is fixed and CI passes.
