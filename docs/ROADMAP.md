# Roadmap

Eight stages. Each one ends with a commit on `redesign/eyfa-professional`, a written report and
the owner's go-ahead. Nothing is pushed, merged or deployed without explicit approval.

| Stage | Title                                                | Status                             |
| ----- | ---------------------------------------------------- | ---------------------------------- |
| 1     | Project foundation and migration audit               | **Done** (`06f997d`)               |
| 2     | Premium design system and shared UI                  | **Done** (see `STAGE_2_REPORT.md`) |
| 3     | Homepage                                             | **Done** (see `STAGE_3_REPORT.md`) |
| 4     | Projects: listing, detail, galleries                 | **Done** (see `STAGE_4_REPORT.md`) |
| 5     | Corporate pages: About, Services, Activities         | **Done** (see `STAGE_5_REPORT.md`) |
| 6     | Contact and conversion                               | **Done** (see `STAGE_6_REPORT.md`) |
| 7     | SEO and quality: accessibility, performance, testing | **Done** (see `STAGE_7_REPORT.md`) |
| 8     | Release: deployment cut-over and legacy retirement   | **Next**: blocked on owner review  |

---

## Stage 1 — Foundation and audit ✅

Astro + TS strict + Tailwind v4 static scaffold. Typed data containing only verified legacy
content. Design tokens. Shared layout. Route placeholders. Legacy redirect stubs. Tooling (Prettier,
ESLint, astro check, Vitest, dist verification). Full documentation set.

## Stage 2 — Premium design system and shared UI ✅

Delivered (details: `DESIGN_SYSTEM.md`, `STAGE_2_REPORT.md`):

- Tone-aware semantic tokens, a fluid type scale with paired line-heights, aspect, z-index and
  motion tokens.
- Sticky header with desktop nav, a phone link and a contact CTA. Accessible full-screen `<dialog>`
  mobile menu.
- Redesigned footer. A component library of 21 components. Letterbox trimming for drone stills.
- All routes migrated to `PageHeader`, `Section` and the shared components.
- Dev-only design showcase at `/dev/tasarim-sistemi/`, excluded from production.
- jsx-a11y lint. Component, navigation, letterbox, showcase and dark-tone contrast tests.
  Extended dist verification.

Deferred from the original Stage 2 sketch, deliberately:

- **Lightbox**: built in Stage 4, where the gallery needs it.
- **Floating WhatsApp button**: decide in Stage 6. It covers content on small screens.
- **Stat component**: there are no verified figures.
- **Transparent-over-hero header variant**: Stage 3, together with the hero.

## Stage 3 — Homepage ✅

Delivered (details: `STAGE_3_REPORT.md`):

- A split cinematic hero: verified headline on charcoal, with `projects-img/19.webp` bleeding to the
  right edge (stacked on phones). No transparent header was needed.
- An editorial introduction with verified activity areas and districts.
- Featured galleries: one large and two stacked, neutral labels, no pending markers.
- A services index rendered as rows.
- An approach section: vision excerpt plus three verified principles.
- A split closing contact band.
- Initial transfer of about 194–266 KB, hero 59–130 KB, CLS 0, 812 B of inline JS.

Deferred: a hero video loop (optional, documented), "featured" selection by the owner, and
build-time letterbox cropping (removes an axe heuristic false positive).

## Stage 4 — Projects ✅

Delivered (details: `STAGE_4_REPORT.md`, `PROJECT_MEDIA_REVIEW.md`):

- A per-gallery media review. Every legacy image is shown or excluded with a reason. Gallery 8
  (educational watermark) is withheld, and its URL redirects.
- The registry gains curation, visibility and optional verified fields (type, location, status,
  year, description, related), all still `UNKNOWN` or `NEEDS_CONFIRMATION`.
- An editorial portfolio index (photographed projects plus a drawing archive). No filters, because
  there is no verified categorisation.
- Detail pages: header summary, cinematic hero, photo gallery, uncropped plans, other projects,
  contact.
- An accessible `<dialog>` viewer: keyboard, swipe, live counter, focus restoration, no-JS fallback.
- **Build-time letterbox crop** through a custom image service. The Stage 3 axe "incomplete"
  results are resolved.

Still blocked on the owner: names, facts, the gallery 4/6 question, drawing rights, and name-based
slugs (planned with redirect stubs from `proje-NN`; never published so far).

## Stage 5 — Corporate pages ✅

Delivered (details: `STAGE_5_REPORT.md`):

- `/hakkimizda/`: editorial hero, introduction, a story anchored on the only verified date (2004,
  with no invented timeline), mission and vision in two distinct compositions, approach, projects
  transition and a quiet contact row.
- `/hizmetler/`: four editorial rows. **Müteahhitlik** was added as an editorial service grounded
  in the company's registered name and about-text, pending owner sign-off. Anchors are preserved.
- `/faaliyetlerimiz/`: only the SUGİAD membership is public (text only). The theatre activity and
  both photos are withheld for attribution and rights reasons.
- A corporate copy layer (`src/data/corporate.ts`) with provenance: every rewrite lists its
  verbatim basis, and tests forbid new numbers, credentials and biography details.

## Stage 6 — Contact and conversion ✅

- `/iletisim/` redesigned: WhatsApp and mobile as primary tiles; landline, e-mail (with subject)
  and Instagram as secondary rows; verified office address; closing channel choice.
- **No form.** There is no backend, and a form that cannot deliver messages would be dishonest.
- WhatsApp links carry a polite default message. Project pages carry a project-specific message
  that uses only the public label ("Proje 06").
- Map: a local panel; the Google iframe is created only after "Haritayı yükle". A keyless directions
  link always works. No static map image, coordinates or hours were invented.
- One typed contact source (`contact` in `src/data/company.ts`) feeds every page.
- Floating WhatsApp button: **not built** (see `STAGE_6_REPORT.md` §5).
- Moved to Stage 7: the full SEO pass (OG images, `LocalBusiness` refinements, sitemap review).
  Opening hours remain unpublished until the owner provides them.

## Stage 7 — SEO and quality ✅

- SEO: full OG/X metadata; generated 1200×630 share images (authentic photo + logo, no text);
  404 canonical removed; placeholders `noindex, follow`; sitemap = indexable pages (enforced);
  generated robots.txt with a staging switch (`SITE_INDEXING=off`); `GeneralContractor` +
  `WebSite` JSON-LD with verified facts only.
- Performance: mobile LCP ≤ 2.40 s and CLS 0 on every page. Photo quality 72, a 750 px width step,
  metric-matched fallback fonts, Turkish font subsets, inline CSS.
- Security: hashed meta CSP; JSON-LD escaping; public-output hygiene gate; production dependencies
  have 0 advisories.
- Quality gates: Playwright smoke + axe suite (`npm run test:e2e`), Lighthouse runner
  (`npm run lighthouse`), extended `verify-dist`. All new checks were mutation-tested.
- Visual: homepage approach band and services density, footer presence.
- Readiness: **BLOCKED PENDING CONTENT APPROVAL** (`RELEASE_BLOCKERS.md`).
- Not done (manual or owner): VoiceOver pass, real-device Safari iOS / Chrome Android checks,
  creative proposals (`OWNER_REVIEW_CHECKLIST.md`).

## Stage 8 — Release

- Owner approval of the deployment plan (`DEPLOYMENT_PLAN.md`).
- Add a GitHub Actions Pages workflow. The owner switches Pages source from "Deploy from a branch"
  to "GitHub Actions".
- Pre-launch: preview deploy, link check against the live URLs, rollback rehearsal.
- Cut-over and enable "Enforce HTTPS".
- Post-launch: Search Console, sitemap submission, 404 monitoring.
- Legacy retirement (separate, approved commit): move legacy HTML/CSS into `legacy/` or remove it.
  Resolve the `emlakçi-logo.png` Unicode duplicate (PROJECT_AUDIT §6). Untrack `.DS_Store`. Archive
  `slider-photos/` duplicates. Never delete without a recoverable copy in Git history.

## Open blockers and risks (updated after Stage 7; full list in `RELEASE_BLOCKERS.md`)

1. **Project names and facts are unknown.** Stage 4 cannot publish real project pages until the
   owner answers the checklist.
2. **The logo exists only as a 1024 px transparent PNG.** It works on dark surfaces through a CSS
   crop. A vector master is still needed for sharpness, a monochrome variant and any light-surface use.
3. **Media licensing** (Autodesk educational watermark, THERMOsiding, ARTRIA/GOKTUG branding,
   YILMAZ İNŞAAT signage) must be cleared before those files are used.
4. **Node ≥ 22.23.4 is required.** On this Mac use `/opt/homebrew/opt/node@24/bin` (keg-only) or
   upgrade the default Node.
5. **Deployment model change.** Pages must switch to an Actions-based deploy. Until then, merging to
   `main` would publish source files instead of the built site.
6. **Contact details are verified only against the legacy site.** The owner should confirm the
   numbers, e-mail, address and Google Maps embed are still current before release, and supply
   opening hours if they should be published.
