# Final Owner Approval

**Status (2026-11-11): READY FOR FINAL PUBLICATION AUTHORIZATION.** The owner's confirmations of
2026-11-11 are incorporated (`PRELAUNCH_FINAL_STATUS.md`). No hard content blocker remains.

What is left:

- the final authorization in §5, which includes confirming three retained legacy statements
  (C1–C3);
- three release-time settings.

The site is not live; the legacy site on `main` is unchanged.

Boxes ticked below record what the owner **explicitly** confirmed on 2026-11-11. Nothing else is
ticked on the owner's behalf.

---

## 1. Technical status (no owner action needed)

| Gate                                                               | Result (2026-11-11, local)                                                                                                                                   |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run validate` (format, lint, types, unit, build, dist checks) | pass: 220 unit tests (15 files); verify-dist all checks incl. pre-launch claim/status/drawing guards; build 22.5 MB                                          |
| `npm run typecheck`                                                | pass: 0 errors, 0 warnings                                                                                                                                   |
| Browser tests, desktop + mobile, incl. axe on every route          | 97 passed, 13 skipped (other form factor), 0 failed (4 withheld project pages are now redirects)                                                             |
| Lighthouse (3-run median)                                          | Stage 8 run: Performance 98–100; Accessibility, Best Practices 100; SEO 100 (69 on `noindex` project pages). Not re-run after the pre-launch content changes |
| Mobile LCP / CLS                                                   | ≤ 2.41 s / 0 on every page                                                                                                                                   |
| Third-party requests before consent                                | none                                                                                                                                                         |
| Withheld media in the build                                        | none, including the 21 withheld drawings (checked)                                                                                                           |
| Deploy workflow                                                    | prepared, manual, approval-gated, **not run**                                                                                                                |
| Not performed                                                      | real-device tests, VoiceOver/NVDA, tests on GitHub Pages hosting                                                                                             |

---

## 2. Content approvals

Legacy-site information is treated as "stated on the old site", not as confirmed current fact,
unless the owner confirmed it.

| #    | Item                                                                      | Status (2026-11-11)                                                                                                                                                                               | Blocks publication    |
| ---- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 2.1  | Project names                                                             | **Resolved:** unavailable (owner); the site shows neutral identifiers and implies no name                                                                                                         | No                    |
| 2.2  | Locations / types / years                                                 | **Resolved:** unavailable (owner); not displayed                                                                                                                                                  | No                    |
| 2.3  | Project descriptions                                                      | Neutral, factual ("Eyfa Yapı arşivinden, projeye ait fotoğraflar.")                                                                                                                               | No                    |
| 2.4  | Proje 04 / 06 possibly the same building                                  | **Resolved (conservative):** the photos indicate two buildings with the same façade design (different ground floors and surroundings); no text claims either way (`PRELAUNCH_FINAL_STATUS.md` §3) | No                    |
| 2.5  | Construction status                                                       | Only "İnşaat sürecinden" where the photos show construction; completion and sale wording is blocked by a build check                                                                              | No                    |
| 2.6  | Floor-plan ownership                                                      | **Resolved by exclusion:** all 21 drawings withheld; Proje 07, 09, 10, 11 removed from the public site (originals kept)                                                                           | No                    |
| 2.7  | Gallery 1 ↔ 10 relation                                                   | Moot: Proje 10 is withheld                                                                                                                                                                        | No                    |
| 2.8  | Mobile / WhatsApp 0 (532) 686 88 29                                       | **Owner-confirmed**                                                                                                                                                                               | No                    |
| 2.9  | Landline 0 216 419 57 81                                                  | **Owner-confirmed** (labelled "Sabit hat")                                                                                                                                                        | No                    |
| 2.10 | E-mail info@eyfayapi.net                                                  | **Owner-confirmed**                                                                                                                                                                               | No                    |
| 2.11 | Address                                                                   | **Owner-confirmed**. The map embed is the company's own legacy embed (loaded only on click)                                                                                                       | No                    |
| 2.12 | Instagram @eyfa.yapi                                                      | Legacy; low risk                                                                                                                                                                                  | No                    |
| 2.13 | Müteahhitlik as a service                                                 | **Resolved by evidence:** registered name "EYFA MÜTEAHHİTLİK…" plus "konut ve taahhüt projeleri"                                                                                                  | No                    |
| 2.14 | "başarıyla tamamladığı"                                                   | **Rewritten** (removed)                                                                                                                                                                           | No                    |
| 2.15 | "öne çıkmıştır"                                                           | **Rewritten** ("Müşteri memnuniyetini her zaman öncelik kabul ederiz.")                                                                                                                           | No                    |
| 2.16 | "güvenilir çözümler" (meta)                                               | **Rewritten**                                                                                                                                                                                     | No                    |
| 2.17 | "Uzman mimarlarla", "Alanında yetkin", "güçlü birikim", "deneyimli kadro" | **Rewritten** (claims removed); "Doğru projeleri, doğru yatırımcılarla" kept (no measurable claim)                                                                                                | No                    |
| 2.18 | Slogan                                                                    | **Confirm in §5 (C3)**; fallback documented                                                                                                                                                       | Part of authorization |
| 2.19 | Founder Fatih Yılmaz / 2004                                               | **Confirm in §5 (C1)**; fallback documented                                                                                                                                                       | Part of authorization |
| 2.20 | Founder biography                                                         | Withheld                                                                                                                                                                                          | No                    |
| 2.21 | SUGİAD as a company activity                                              | **Confirm in §5 (C2)**; fallback documented                                                                                                                                                       | Part of authorization |
| 2.22 | Theatre evening                                                           | Withheld                                                                                                                                                                                          | No                    |
| 2.23 | Opening hours                                                             | Not published                                                                                                                                                                                     | No                    |
| 2.24 | Brand casing                                                              | Optional consistency pass after launch                                                                                                                                                            | No                    |
| 2.25 | WhatsApp messages                                                         | Neutral, information-only wording                                                                                                                                                                 | No                    |
| 2.26 | Editorial About/Services copy                                             | Grounded in legacy text (tested); claims removed                                                                                                                                                  | No                    |

**Recalculated: 0 hard blockers** (was 12).

- **Resolved by owner confirmation:** 2.8–2.11.
- **Resolved because the information is unavailable and isn't displayed:** 2.1.
- **Resolved by exclusion:** 2.6.
- **Resolved by evidence:** 2.4 and 2.13.
- **Rewritten:** 2.14–2.17 and 2.26.
- **Moved into the final authorization:** 2.18, 2.19 and 2.21 (C1–C3).

### Navigation (implemented)

Activities ("Faaliyetlerimiz") moved from the header to the footer. The page, its route, the
sitemap entry and the `/faaliyet.html` redirect are unchanged, and tests cover reachability.

## 3. Design approvals

| #   | Proposal                                                      | Evidence                                              | Decision |
| --- | ------------------------------------------------------------- | ----------------------------------------------------- | -------- |
| 3.1 | Approve the current design as a whole                         | `FINAL_DESIGN_REVIEW.md`, local preview               | [ ]      |
| 3.2 | Hero photo: keep `19.webp` / switch to `23.webp` / video loop | `FINAL_DESIGN_REVIEW.md` §3.1                         | [ ]      |
| 3.3 | Founder section on About (needs 4.2)                          | `docs/proposals/founder-section-{desktop,mobile}.jpg` | [ ]      |
| 3.4 | Services header: replace the repeated hero sentence           | `FINAL_DESIGN_REVIEW.md` §3.3                         | [ ]      |
| 3.5 | Footer: keep tagline + positioning, or positioning only       | `FINAL_DESIGN_REVIEW.md` §2                           | [ ]      |
| 3.6 | Sharing images (logo over authentic photo, no text)           | `dist/og/*.jpg` after `npm run build`                 | [ ]      |

---

## 4. Image rights

| #   | Item                                                                                  | Status (2026-11-11)                                                                                 |
| --- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 4.1 | Project photographs (`projects-img/`, `img/`)                                         | [x] **Owner-confirmed:** genuine Eyfa Yapı projects, taken by the owner, authorized for website use |
| 4.2 | Founder portrait `img/boss-photo.jpg`                                                 | [ ] Not published; consent not given (optional, post-launch)                                        |
| 4.3 | Architectural drawings (21 files)                                                     | Not covered by the photo authorization → **withheld**; restore only with author/permission          |
| 4.4 | Logo `logos/logo.png`                                                                 | The company's own mark (in use on the live site); vector master optional                            |
| 4.5 | Withheld media (watermarks, third-party branding, SUGİAD award photo, theatre poster) | Stays withheld                                                                                      |

## 5. External publishing authorization

### 5.0 Final authorization (owner)

Tick all four to authorize publication. If C1, C2 or C3 can't be confirmed, say which: the
documented fallback (`PRELAUNCH_FINAL_STATUS.md` §5) is applied first and re-verified.

- [ ] **C1** "EYFA Yapı was founded in 2004 in İstanbul by Fatih Yılmaz" may stay on the site.
- [ ] **C2** The SUGİAD membership statement is the **company's** activity.
- [ ] **C3** "Eyfa Yapı ile Geleceği İnşa Ediyoruz." is still the company slogan.
- [ ] I authorize merging PR #1 and the production deployment of eyfayapi.net following
      `RELEASE_RUNBOOK.md`.

### 5.1 Steps (each needs that authorization)

Each step below changes something outside this computer. **None has been done.** Each needs a
separate, explicit "yes" from the owner (or an account holder the owner names).

| #    | Action                                                                                                                                                                       | Who               | Authorized                       |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------- |
| 5.1  | Push `redesign/eyfa-professional` to GitHub (this runs `ci.yml`: verification only, no publishing)                                                                           | owner / developer | [x] done 2026-11-10 (authorized) |
| 5.2  | Open a pull request `redesign/eyfa-professional → main`                                                                                                                      | developer         | [x] PR #1                        |
| 5.3  | Settings → Environments → `github-pages`: add `akose34` as required reviewer (already `main`-only). **Leave "Prevent self-review" off**: you are the only collaborator       | owner             | [ ]                              |
| 5.4  | Optional staging (`RELEASE_RUNBOOK.md` §2, option B): new repository + DNS record `staging.eyfayapi.net`                                                                     | owner             | [ ]                              |
| 5.5  | Tag the rollback point `legacy-site-final` at `5da2426` and push the tag                                                                                                     | owner / developer | [ ]                              |
| 5.6  | Merge the pull request into `main`                                                                                                                                           | owner             | [ ]                              |
| 5.7  | Settings → Pages → Source: "GitHub Actions" (do it immediately before 5.8; a short gap between the switch and the first deployment is possible, see `RELEASE_RUNBOOK.md` §4) | owner             | [ ]                              |
| 5.8  | Run "Deploy to GitHub Pages" with confirmation `eyfayapi.net`, and approve the environment                                                                                   | owner             | [ ]                              |
| 5.9  | Settings → Pages: confirm custom domain `eyfayapi.net`; enable **Enforce HTTPS**                                                                                             | owner             | [ ]                              |
| 5.10 | Search Console: verify the domain and submit the sitemap                                                                                                                     | owner             | [ ]                              |

Approved by: ____________________ Date: ____________
