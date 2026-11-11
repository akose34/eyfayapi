# Final Owner Approval

**Status: READY FOR OWNER APPROVAL — publication blocked by content until the items below are
answered.** Nothing here is approved yet: every box is empty on purpose. The site is not live; the
legacy site on `main` is unchanged.

Fill in the boxes, or reply with a list such as "1.3 yes, 2.1 corrected to …". Answers are applied
in a follow-up change, re-validated, then released through `RELEASE_RUNBOOK.md`.

---

## 1. Technical status (no owner action needed)

| Gate                                                               | Result (2026-11-10, local)                                                                                    |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `npm run validate` (format, lint, types, unit, build, dist checks) | pass: 209 unit tests; verify-dist all checks                                                                  |
| `npm run typecheck`                                                | pass: 0 errors, 0 warnings                                                                                    |
| Browser tests, desktop + mobile, incl. axe on every route          | 111 passed, 13 skipped (other form factor), 0 failed                                                          |
| Lighthouse (3-run median)                                          | Performance 98–100; Accessibility 100; Best Practices 100; SEO 100 (69 on project pages by design: `noindex`) |
| Mobile LCP / CLS                                                   | ≤ 2.41 s / 0 on every page                                                                                    |
| Third-party requests before consent                                | none                                                                                                          |
| Withheld media in the build                                        | none (checked)                                                                                                |
| Deploy workflow                                                    | prepared, manual, approval-gated, **not run**                                                                 |
| Not performed                                                      | real-device tests, VoiceOver/NVDA, tests on GitHub Pages hosting                                              |

---

## 2. Content approvals

Legacy-site information is treated as **"stated on the old site", not as confirmed current fact**.

| #    | Item                                                                           | Source                                                       | Current public presentation                                              | Status                      | Recommended action                                        | Blocks publication |
| ---- | ------------------------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------ | --------------------------- | --------------------------------------------------------- | ------------------ |
| 2.1  | Project names                                                                  | none (legacy gallery numbers)                                | "Proje 01…11", pages `noindex`                                           | Unknown                     | Supply names, or approve neutral labels                   | **Yes**            |
| 2.2  | Project locations / types / years                                              | none                                                         | not shown                                                                | Unknown                     | Supply if wanted; otherwise stays hidden                  | No                 |
| 2.3  | Project descriptions                                                           | none                                                         | neutral: "Eyfa Yapı arşivinden, projeye ait fotoğraflar."                | Editorial, factual          | Approve or supply text                                    | No                 |
| 2.4  | Possible duplicate galleries                                                   | Stage 4 media review                                         | Proje 04 and 06 shown separately (green roof, yellow stripes, EYFA sign) | Possibly one building       | Confirm: same building → merge; different → keep          | **Yes**            |
| 2.5  | Construction status                                                            | photos only                                                  | "İnşaat sürecinden" on 01 and 03; nothing claims completion              | Inferred from photos        | Confirm status (completed / under construction)           | No                 |
| 2.6  | Floor-plan ownership                                                           | legacy files 7109_4, 158_8, 7795_4 + gallery 11 colour plans | Proje 07, 09, 10, 11 (drawings only)                                     | Unknown authorship          | Confirm the drawings are Eyfa Yapı's and may be published | **Yes**            |
| 2.7  | Gallery 1 ↔ 10 relation                                                        | street names on the plans                                    | not shown                                                                | Unconfirmed                 | Confirm or ignore                                         | No                 |
| 2.8  | Mobile / WhatsApp 0 (532) 686 88 29                                            | legacy footer                                                | header, footer, contact, CTAs, JSON-LD                                   | Legacy only                 | Confirm current                                           | **Yes**            |
| 2.9  | Landline 0 216 419 57 81                                                       | legacy footer                                                | "Sabit hat" everywhere                                                   | Legacy only                 | Confirm current; office line?                             | **Yes**            |
| 2.10 | E-mail info@eyfayapi.net                                                       | legacy footer                                                | everywhere                                                               | Legacy only                 | Confirm monitored                                         | **Yes**            |
| 2.11 | Address and Maps pin                                                           | legacy footer + embed                                        | contact, footer, JSON-LD, map after consent                              | Legacy only                 | Confirm address and pin                                   | **Yes**            |
| 2.12 | Instagram @eyfa.yapi                                                           | legacy footer                                                | contact, footer, JSON-LD `sameAs`                                        | Legacy only                 | Confirm official account                                  | No                 |
| 2.13 | Müteahhitlik as a service                                                      | legal name + about.html                                      | first of four services (home, services, footer)                          | Editorial (Stage 5)         | Approve, or remove (three services)                       | **Yes**            |
| 2.14 | "başarıyla tamamladığı"                                                        | legacy projeler.html                                         | Projects page lead                                                       | Unsubstantiated claim       | Approve, or drop "başarıyla"                              | No (recommended)   |
| 2.15 | "öne çıkmıştır"                                                                | legacy about.html                                            | homepage principle 3                                                     | Unsubstantiated claim       | Approve, or "her projede bu anlayışla çalışır"            | No (recommended)   |
| 2.16 | "güvenilir çözümler"                                                           | legacy meta description                                      | homepage and 404 meta description                                        | Marketing phrase            | Approve or soften                                         | No                 |
| 2.17 | "Uzman mimarlarla", "Alanında yetkin", "Doğru projeleri, doğru yatırımcılarla" | legacy index.html                                            | service descriptions                                                     | Unsubstantiated             | Approve or soften                                         | No (recommended)   |
| 2.18 | Slogan "Eyfa Yapı ile Geleceği İnşa Ediyoruz."                                 | legacy homepage                                              | hero h1, footer, home title                                              | Legacy slogan               | Approve as current slogan                                 | **Yes**            |
| 2.19 | Founder: Fatih Yılmaz, 2004                                                    | about.html                                                   | About text, JSON-LD `founder`                                            | Legacy only                 | Confirm                                                   | **Yes**            |
| 2.20 | Founder biography                                                              | about.html                                                   | **withheld** (age, education, hometown, family, association roles)       | Outdated/private            | Keep withheld, or supply current wording                  | No                 |
| 2.21 | SUGİAD membership                                                              | faaliyet.html                                                | Activities: company-voice membership statement, no photo                 | Company vs founder unclear  | Confirm: the company's membership? since when?            | **Yes**            |
| 2.22 | Theatre evening                                                                | faaliyet.html                                                | **withheld**                                                             | Attribution conflict        | Keep withheld, or clarify                                 | No                 |
| 2.23 | Opening hours                                                                  | none                                                         | not published                                                            | No source                   | Supply, or keep omitted                                   | No                 |
| 2.24 | Brand casing                                                                   | mixed legacy                                                 | "Eyfa Yapı" (brand) and "EYFA Yapı" (legacy text)                        | Inconsistent                | Choose one                                                | No                 |
| 2.25 | WhatsApp messages (Stage 6)                                                    | editorial                                                    | default and per-project pre-filled texts                                 | New wording, no claims      | Approve                                                   | No                 |
| 2.26 | Editorial About/Services copy (Stage 5)                                        | grounded in legacy text                                      | About page, service rows                                                 | Tested against legacy basis | Approve                                                   | **Yes**            |

### Navigation (decision)

The Activities page has **one** verified item. Recommended architecture:

- **Header:** Ana Sayfa · Hakkımızda · Projeler · Hizmetler · [İletişim button]
- **Footer:** unchanged; still lists "Faaliyetlerimiz".

| Option                           | Effect                                                                                                                                                                             |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. **Footer only (recommended)** | The page stays live, indexable and in the sitemap; the footer link and `/faaliyet.html` redirect keep working. One-line change in `src/data/navigation.ts` + a browser-test update |
| B. Keep in header                | No change; the one-item page stays prominent                                                                                                                                       |
| C. Remove the page               | Not recommended: it loses the verified SUGİAD statement and the legacy URL target                                                                                                  |

Not changed in Stage 8: this alters the established navigation and needs your decision.

- [ ] Navigation: A / B / C

### Content checklist

- [ ] 2.1 names supplied, or labels approved
- [ ] 2.4 Proje 04 / 06 resolved
- [ ] 2.6 drawings may be published
- [ ] 2.8–2.11 contact details confirmed
- [ ] 2.13 Müteahhitlik approved
- [ ] 2.14–2.17 wording decided
- [ ] 2.18 slogan approved
- [ ] 2.19 founder fact confirmed
- [ ] 2.21 SUGİAD attribution confirmed
- [ ] 2.26 editorial copy approved

---

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

| #   | Item                                                                                  | Status                                                          | Decision                             |
| --- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------ |
| 4.1 | All published project photographs (`projects-img/`, `img/`)                           | Company's legacy media; photographer and licence not documented | [ ] company holds the rights         |
| 4.2 | Founder portrait `img/boss-photo.jpg`                                                 | **Not published.** Personal image; needs the founder's consent  | [ ] consent given / [ ] new portrait |
| 4.3 | Floor plans (Proje 07, 09, 10, 11)                                                    | Authorship unknown (see 2.6)                                    | [ ] may be published                 |
| 4.4 | Logo `logos/logo.png`                                                                 | Brand asset; no vector master                                   | [ ] approved; vector supplied later  |
| 4.5 | Withheld media (watermarks, third-party branding, SUGİAD award photo, theatre poster) | Stays unpublished                                               | [ ] keep withheld                    |

---

## 5. External publishing authorization

Each step below changes something outside this computer. **None has been done.** Each needs a
separate, explicit "yes" from the owner (or an account holder the owner names).

| #    | Action                                                                                                                                                                       | Who               | Authorized |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------- |
| 5.1  | Push `redesign/eyfa-professional` to GitHub (this runs `ci.yml`: verification only, no publishing)                                                                           | owner / developer | [ ]        |
| 5.2  | Open a pull request `redesign/eyfa-professional → main`                                                                                                                      | developer         | [ ]        |
| 5.3  | Settings → Environments → `github-pages`: add a required reviewer, restrict to `main`                                                                                        | owner             | [ ]        |
| 5.4  | Optional staging (`RELEASE_RUNBOOK.md` §2, option B): new repository + DNS record `staging.eyfayapi.net`                                                                     | owner             | [ ]        |
| 5.5  | Tag the rollback point `legacy-site-final` at `5da2426` and push the tag                                                                                                     | owner / developer | [ ]        |
| 5.6  | Merge the pull request into `main`                                                                                                                                           | owner             | [ ]        |
| 5.7  | Settings → Pages → Source: "GitHub Actions" (do it immediately before 5.8; a short gap between the switch and the first deployment is possible, see `RELEASE_RUNBOOK.md` §4) | owner             | [ ]        |
| 5.8  | Run "Deploy to GitHub Pages" with confirmation `eyfayapi.net`, and approve the environment                                                                                   | owner             | [ ]        |
| 5.9  | Settings → Pages: confirm custom domain `eyfayapi.net`; enable **Enforce HTTPS**                                                                                             | owner             | [ ]        |
| 5.10 | Search Console: verify the domain and submit the sitemap                                                                                                                     | owner             | [ ]        |

Approved by: ____________________ Date: ____________
