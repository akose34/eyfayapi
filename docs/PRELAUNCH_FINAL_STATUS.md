# Pre-launch Final Status

**Date:** 2026-11-11

**Context:**

- Branch `redesign/eyfa-professional`, PR [#1](https://github.com/akose34/eyfayapi/pull/1).
- `main` is unchanged (`5da2426`), and the live site still serves the legacy pages.
- Nothing has been merged or deployed, and no GitHub setting has been changed.

**Readiness: READY FOR FINAL PUBLICATION AUTHORIZATION.** No hard release blocker remains. The
final authorization (`FINAL_OWNER_APPROVAL.md` §5) includes three explicit confirmations of
retained legacy statements (§5 below). Each has a documented fallback if the owner declines.

---

## 1. Owner-confirmed information (2026-11-11, authoritative)

Recorded in code as `ownerConfirmations` (`src/data/company.ts`) and tested in
`tests/contact.test.ts`.

| Item                                                | Value on the site                                                             |
| --------------------------------------------------- | ----------------------------------------------------------------------------- |
| Telephone numbers (all current)                     | Mobile/WhatsApp 0 (532) 686 88 29 · Landline ("Sabit hat") 0 216 419 57 81    |
| E-mail                                              | info@eyfayapi.net                                                             |
| Office address                                      | Abdurrahmangazi Mahallesi Dağıstan Sokak No: 4/14, 34920 Sultanbeyli/İstanbul |
| Project photographs show genuine Eyfa Yapı projects | yes                                                                           |
| Photographs taken personally by the owner           | yes                                                                           |
| Website use of those photographs                    | authorized                                                                    |
| Project names, locations, years, specifications     | **unavailable**; the site does not display or imply them                      |

**Not covered by these confirmations** (and handled below):

- third-party or unverified architectural drawings;
- educational-licence material;
- independently owned artwork or graphics;
- unverified project metadata;
- the founder portrait;
- corporate claims.

## 2. Approved photographs (published)

All public images are the owner's own project photographs, of the kinds `photo`, `aerial` and
`construction`. A test fails if any other kind is published.

| Public project | Photos | Shown as                                    |
| -------------- | ------ | ------------------------------------------- |
| Proje 06       | 6      | photo gallery                               |
| Proje 02       | 2      | photo gallery                               |
| Proje 05       | 2      | photo gallery                               |
| Proje 04       | 5      | photo gallery                               |
| Proje 03       | 4      | photo gallery, labelled "İnşaat sürecinden" |
| Proje 01       | 5      | photo gallery, labelled "İnşaat sürecinden" |

The same photographs also appear in the homepage hero, the About and Services imagery, and the
share images.

Near-duplicates (8, 11, 16, 29, 30) stay unpublished for curation reasons, not rights. They are
kept in the repository for later editorial changes.

## 3. Unknown project details that can safely remain omitted

The portfolio is photography-led. It shows neutral identifiers ("Proje 06") and the photo count,
and nothing else:

- no names, addresses, years, unit counts, sizes or specifications;
- no completion claims. A build check rejects "tamamlanmış / tamamlandı / teslim edildi", including
  in alt text. One homepage alt text that said "Tamamlanmış" was corrected.
- no sale or availability claims. "satılık / satışta" are rejected by the same check, and the
  WhatsApp enquiry asks only for information.

Project pages stay `noindex, follow` and out of the sitemap, because they are untitled.
Indexing them is an optional post-launch step once names exist.

**Proje 04 vs Proje 06.** Visual comparison of all photographs:

- **04:** a "≡EYFA" logo band on the roof edge, empty lots and a wide road opposite, no shop at
  street level.
- **06:** "EYFA YAPI" lettering, a BİM store on the ground floor, a dense street beside orange-roofed
  school buildings.

The evidence points to **two buildings with the same façade design**. Identity is still
unconfirmed, so the presentation stays conservative:

- neutral labels;
- no location or name implying where either is;
- the two are not placed next to each other in the portfolio order;
- no text claims they are different properties (or the same one).

Not a release blocker.

## 4. Withheld third-party and unverified materials (originals preserved)

| Material                                                                                  | Where it was                                      | Reason                                                                                       | Result                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 21 architectural drawings: `7109_4-1…6`, `158_8-1…3`, `7795_4-1…7`, gallery 11 `2–6.webp` | Proje 07, 09, 10, 11; homepage Mimarlık thumbnail | Author and publication permission unverified. The photo authorization doesn't cover drawings | **Withheld** (`unverified-drawing-rights`). The four drawing-only projects become redirect documents to `/projeler/`; they are absent from navigation, links and the sitemap. The Mimarlık thumbnail is now an owner photo (`26.webp`) |
| `6078_11-2…8` drawings                                                                    | Proje 08                                          | Autodesk educational-licence watermark                                                       | withheld (since Stage 4)                                                                                                                                                                                                               |
| `1.webp` (THERMOsiding logo)                                                              | gallery 11                                        | third-party branding                                                                         | withheld (since Stage 4)                                                                                                                                                                                                               |
| `184_1-1…6`, `6078_11-1`                                                                  | not in any legacy gallery                         | other-company branding / signage                                                             | withheld (since Stage 4)                                                                                                                                                                                                               |
| SUGİAD award photo, theatre poster                                                        | Activities                                        | third-party artwork / attribution                                                            | withheld (since Stage 5)                                                                                                                                                                                                               |
| Founder portrait `img/boss-photo.jpg`                                                     | –                                                 | personal image; consent not given                                                            | not published (proposal only)                                                                                                                                                                                                          |

No file was deleted. Every withheld file is listed in `src/data/withheld-media.json`, excluded
from the image registry, and checked absent from `dist/` by `verify-dist`. The build went from
31.2 MB to 22.5 MB.

## 5. Outstanding corporate-content decisions

**Rewritten** (restrained, nothing added):

| Before (legacy)                                                                     | Now                                                                             | Where                          |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------ |
| "…alanlarında **güçlü birikimimizle**, modern ve güvenli yapılar inşa ediyoruz."    | "…alanlarında modern ve güvenli yapılar inşa ediyoruz."                         | homepage hero, Services header |
| "…İşte Eyfa Yapı'nın **başarıyla tamamladığı** ve sürdürdüğü projelerden bazıları." | "…Aşağıda projelerimizden fotoğraflar yer alıyor."                              | Projects lead                  |
| "…projelerde **güvenilir çözümler** sunar…" (meta)                                  | "Eyfa Yapı: 2004’ten bu yana İstanbul’da konut ve taahhüt projeleri. …"         | homepage meta description      |
| "**Güçlü mühendislik altyapısı, deneyimli kadrosu** ve kalite odaklı…"              | "Kalite odaklı bir iş anlayışıyla…" (principle renamed "Kalite odaklı çalışma") | homepage, About                |
| "…teslim ettiği her projede bu anlayışıyla **öne çıkmıştır**."                      | "Müşteri memnuniyetini her zaman öncelik kabul ederiz."                         | homepage                       |
| "**Uzman mimarlarla** birlikte estetik ve işlevsel yapılar tasarlıyoruz."           | "Estetik ve işlevsel yapılar tasarlıyoruz."                                     | Mimarlık service               |
| "**Alanında yetkin mühendislerle** sağlam ve güvenli yapılar inşa ediyoruz."        | "Sağlam ve güvenli yapılar inşa ediyoruz."                                      | Mühendislik service            |
| "Uzmanlık alanlarımız" (heading)                                                    | "Hizmet alanlarımız"                                                            | homepage, Services             |

How the rewrites are kept honest:

- Each rewrite keeps its verbatim legacy basis (`src/data/published-copy.ts`), and
  `tests/published-copy.test.ts` checks it.
- `verify-dist` rejects the removed claims anywhere in the built pages (mutation-tested).
- The legacy archive (`legacyCopy`) is untouched.

**Reviewed and kept:**

- **Müteahhitlik as a service:** supported by the registered legal name "EYFA **MÜTEAHHİTLİK** YAPI
  İNŞAAT…" and the legacy description "konut ve taahhüt projeleri alanında faaliyet gösteren". It
  is the company's documented core activity, so it is not a blocker.
- **Vision statement** "Türkiye’nin en saygın ve güvenilir inşaat firmalarından biri olmak": an
  aspiration ("to be"), clearly marked as the vision, not a claim.
- **Emlak:** "Doğru projeleri, doğru yatırımcılarla buluşturuyoruz." A service description with no
  measurable claim. Low risk; the owner may rewrite it after launch.

**To confirm in the final authorization** (retained statements from the company's own current
website; not covered by the photo/contact confirmations):

| #   | Statement                                                                               | Where                               | Fallback if not confirmed                                                                                                                                     |
| --- | --------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | Founded in **2004** in İstanbul by **Fatih Yılmaz**                                     | About, homepage, footer, JSON-LD    | Remove the founder name (About text, JSON-LD `founder`). If the year is also unconfirmed, drop "2004" from the eyebrow, positioning line and meta description |
| C2  | SUGİAD membership as a **company** activity ("SUGİAD ile iş dünyasına katkı sağlıyor…") | Activities page                     | Withhold the item. The Activities page would then be empty: remove it from the footer and redirect `/faaliyetlerimiz/` and `/faaliyet.html` to `/hakkimizda/` |
| C3  | Slogan "Eyfa Yapı ile Geleceği İnşa Ediyoruz."                                          | homepage h1, footer, homepage title | Use the positioning line as the h1 (no new slogan is invented)                                                                                                |

The fallbacks are documented, not applied. Each is a small, testable change.

## 6. Navigation

Activities moved from the header to the footer only ("Faaliyetlerimiz" under Kurumsal).

- **Why:** the page has one verified item.
- **What stays the same:** the route, the sitemap entry, the `/faaliyet.html` redirect and the
  footer link on every page.
- **Tests:**
  - `tests/navigation.test.ts`: every main route is still reachable from the site chrome.
  - `e2e/smoke.spec.ts`: a browser test follows the footer link to `/faaliyetlerimiz/`.

No activity entries were added, and none of the founder's personal roles are attributed to the
company.

## 7. Actual release blockers

| Kind                  | Count | Items                                                                                                                             |
| --------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------- |
| Content (hard)        | **0** | All 12 earlier blocking items are resolved by confirmation, exclusion or evidence (`FINAL_OWNER_APPROVAL.md` §2)                  |
| Technical             | **0** | validate, typecheck and browser tests pass; CI green (see the PR)                                                                 |
| Authorization         | 1     | The owner's final publication authorization, including C1–C3 above                                                                |
| Release-time settings | 3     | Add a required reviewer to `github-pages`; switch the Pages source at cut-over; Enforce HTTPS after deploy (`RELEASE_RUNBOOK.md`) |

## 8. Deployment protection (read via the API; nothing changed)

| Setting                    | State                                                                                                                     | Note                                                                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository                 | public, personal account, sole collaborator `akose34` (admin)                                                             | Required reviewers on environments **are available** for public repositories on every plan                                                                                                                        |
| `github-pages` environment | deployment branches: `main` only; **no required reviewer**                                                                | Add `akose34` as required reviewer. **Do not enable "Prevent self-review"**: as the only collaborator, the owner must approve their own deployment, and with that option on, no deployment could ever be approved |
| Admin bypass               | allowed (`can_admins_bypass: true`)                                                                                       | Acceptable for a single-owner repository; the typed confirmation and `main`-only rule still apply                                                                                                                 |
| `main` protection          | none; no rulesets                                                                                                         | Recommended: require the "Validate, test, build" status check, block force pushes and deletions. **Do not require PR approvals**: the sole owner cannot approve their own PR                                      |
| Pages                      | legacy build from `main` `/`; custom domain `eyfayapi.net`; certificate approved (expires 2027-01-21); HTTPS not enforced | Switch the source only at cut-over                                                                                                                                                                                |
| Custom domain with Actions | The domain is stored in Pages settings (the API reports it); the root `CNAME` file stays for the legacy build             | Re-check after the source switch; DNS never changes                                                                                                                                                               |
| Deploy workflow            | manual only, `main` only, typed confirmation `eyfayapi.net`, full gate, least privilege, SHA-pinned                       | Unchanged and ready                                                                                                                                                                                               |

## 9. Optional post-launch improvements

- Add project names, locations and years when available. Each confirmed project then becomes
  indexable, and the sitemap filter needs updating.
- Restore drawings project by project once their author or permission is confirmed (the data and
  alt texts are kept).
- Founder section with consent and a neutral-background portrait (`FINAL_DESIGN_REVIEW.md` §4).
- Logo vector master.
- Hero alternatives (`FINAL_DESIGN_REVIEW.md` §3).
- Search Console field data (INP).
- Real-device and screen-reader passes.
- Legacy-file retirement two weeks after a stable release.
