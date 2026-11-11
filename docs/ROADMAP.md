# Roadmap

Eight stages. Each one ends with a commit on `redesign/eyfa-professional`, a written report and
the owner's go-ahead. Nothing is pushed, merged or deployed without explicit approval.

| Stage | Title                                                | Status                                    |
| ----- | ---------------------------------------------------- | ----------------------------------------- |
| 1     | Project foundation and migration audit               | **Done** (`06f997d`)                      |
| 2     | Premium design system and shared UI                  | **Done** (see `STAGE_2_REPORT.md`)        |
| 3     | Homepage                                             | **Done** (see `STAGE_3_REPORT.md`)        |
| 4     | Projects: listing, detail, galleries                 | **Next** (names still need owner content) |
| 5     | Corporate pages: About, Services, Activities         | Not started                               |
| 6     | Contact, conversion and SEO                          | Not started                               |
| 7     | Quality: accessibility, performance, browser testing | Not started                               |
| 8     | Release: deployment cut-over and legacy retirement   | Not started (needs owner approval)        |

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

## Stage 4 — Projects

- Owner content collected through the checklist in `CONTENT_INVENTORY.md`.
- Move projects to an Astro Content Collection (one Markdown file per project, Zod schema mirroring
  `Unverified<T>`).
- Name-based slugs, with redirect stubs from provisional slugs if those were ever public.
- Listing with client-side category/status filters (no backend). Detail pages with gallery,
  lightbox, facts table (verified only) and plans section.
- Remove `noindex` per project once it is confirmed.
- Resolve media licensing items (Autodesk watermark, third-party logos).

## Stage 5 — Corporate pages

- About: company text, mission and vision, confirmed founder biography, and an optional timeline of
  verified dates only.
- Services: expanded copy approved by the owner. Optional fourth service (Müteahhitlik/Taahhüt) if
  confirmed.
- Activities: SUGİAD and theatre, with permission for identifiable people.

## Stage 6 — Contact, conversion and SEO

- Contact page: click-to-call, WhatsApp with a prefilled Turkish message, mailto with subject, and
  opening hours if provided.
- Map: either a privacy-friendly static map image linking to Google Maps, or the iframe behind a
  click-to-load consent.
- SEO: per-page copy, JSON-LD refinements (`LocalBusiness` hours, `Project`/`Residence` for
  confirmed projects), OG images per page, sitemap review, Search Console handover plan.
- Optional: a contact form only if the owner requests one, via a separately reviewed provider (see
  DEPLOYMENT_PLAN §6).

## Stage 7 — Quality

- Playwright smoke tests (routes, navigation, mobile menu, legacy redirects).
- axe-core accessibility scans on every route, plus manual keyboard and VoiceOver passes.
- Lighthouse CI budgets (Performance ≥ 90 mobile, Accessibility 100, Best Practices ≥ 95,
  SEO 100). Results are recorded only from real runs.
- Cross-browser checks: Safari iOS, Chrome Android, desktop Chrome, Firefox and Safari.
- Optional re-encode of hero video and removal of audio tracks.
- English localisation groundwork (route scaffolding only) if requested.

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

## Open blockers and risks (updated after Stage 3)

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
