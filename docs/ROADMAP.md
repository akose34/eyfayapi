# Roadmap

Eight stages. Each one ends with a commit on `redesign/eyfa-professional`, a written report and
the owner's go-ahead. Nothing is pushed, merged or deployed without explicit approval.

| Stage | Title                                                | Status                                           |
| ----- | ---------------------------------------------------- | ------------------------------------------------ |
| 1     | Project foundation and migration audit               | **Done (this commit)**                           |
| 2     | Shared UI system                                     | Not started                                      |
| 3     | Homepage                                             | Not started                                      |
| 4     | Projects: listing, detail, galleries                 | Not started (blocked on owner content for names) |
| 5     | Corporate pages: About, Services, Activities         | Not started                                      |
| 6     | Contact, conversion and SEO                          | Not started                                      |
| 7     | Quality: accessibility, performance, browser testing | Not started                                      |
| 8     | Release: deployment cut-over and legacy retirement   | Not started (needs owner approval)               |

---

## Stage 1 — Foundation and audit ✅

Astro + TS strict + Tailwind v4 static scaffold. Typed data containing only verified legacy
content. Design tokens. Shared layout. Route placeholders. Legacy redirect stubs. Tooling (Prettier,
ESLint, astro check, Vitest, dist verification). Full documentation set.

## Stage 2 — Shared UI system

- Final header: transparent-over-hero variant, scroll state, accessible mobile menu panel with
  focus trap.
- Footer composition, a contact strip and a floating WhatsApp button (with a respectful position and
  a reduced-motion variant).
- Section primitives: `Section`, `SectionHeading` (eyebrow + title + lead), `Divider`, `Stat`
  (only with verified numbers).
- Media primitives: `ResponsiveImage` (letterbox crop, art direction), `Figure`, `Lightbox`
  (vanilla, keyboard and swipe, `aria-modal`).
- Card patterns: project card, service card, activity card.
- An icon set (inline SVG, single stroke weight) to replace the inconsistent PNG service icons.
- Logo: request an SVG/transparent master from the owner and create a monochrome variant.
- A component catalogue page (`/_styleguide`, excluded from build output in production).
- Exit criteria: every component passes keyboard and screen-reader checks and is documented in
  `DESIGN_SYSTEM.md`.

## Stage 3 — Homepage

- Hero: authentic photo (`img/Eyfa-yapi-resim17.png`, cropped) or one short muted loop with a
  poster image. Reduced motion shows the poster only.
- Sections: introduction (legacy copy), services, featured projects (only confirmed ones), a
  corporate band, and a contact CTA.
- No auto-advancing carousels without pause controls.
- Performance budget: LCP image ≤ 200 KB, total homepage weight ≤ 1.5 MB without video.

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

## Pre-Stage-2 blockers and risks

1. **Project names and facts are unknown.** Stage 4 cannot publish real project pages until the
   owner answers the checklist.
2. **The logo exists only as a 1024 px PNG on black.** A vector or transparent master is needed for
   a premium header.
3. **Media licensing** (Autodesk educational watermark, THERMOsiding, ARTRIA/GOKTUG branding,
   YILMAZ İNŞAAT signage) must be cleared before those files are used.
4. **Node ≥ 22.23.4 is required.** On this Mac use `/opt/homebrew/opt/node@24/bin` (keg-only) or
   upgrade the default Node.
5. **Deployment model change.** Pages must switch to an Actions-based deploy. Until then, merging to
   `main` would publish source files instead of the built site.
