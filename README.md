# Eyfa Yapı — Website

Corporate website of **EYFA MÜTEAHHİTLİK YAPI İNŞAAT SAN. TİC. LTD. ŞTİ.** (eyfayapi.net),
being rebuilt as a static Astro site on the `redesign/eyfa-professional` branch.

> **Status:** Stage 1 of 8 (foundation). The live site is still the legacy static HTML on `main`.
> Nothing from this branch is deployed. See [docs/ROADMAP.md](docs/ROADMAP.md).

## Stack

Astro 7 (static output) · TypeScript (strictest) · Tailwind CSS 4 · self-hosted OFL fonts ·
no backend, database, CMS or API keys.

## Requirements

- **Node.js ≥ 22.23.4** (`.nvmrc` pins 24). npm 10+.
  - On the current development Mac, Node 24 is installed keg-only through Homebrew:
    `export PATH="/opt/homebrew/opt/node@24/bin:$PATH"`

## Getting started

```bash
npm ci            # install exact locked dependencies
npm run dev       # http://localhost:4321
```

## Scripts

| Command                           | Purpose                                                         |
| --------------------------------- | --------------------------------------------------------------- |
| `npm run dev`                     | Development server                                              |
| `npm run build`                   | Production build into `dist/`                                   |
| `npm run preview`                 | Serve `dist/` locally                                           |
| `npm run check`                   | Astro and TypeScript diagnostics                                |
| `npm run typecheck`               | `astro check` + `tsc --noEmit`                                  |
| `npm run lint`                    | ESLint                                                          |
| `npm run format` / `format:check` | Prettier write / verify                                         |
| `npm test`                        | Vitest unit and content-integrity tests                         |
| `npm run verify:dist`             | Verify the built output (routes, headings, links, size budgets) |
| `npm run validate`                | Everything above, in CI order                                   |

## Project layout

```
src/
  layouts/      BaseLayout (SEO head, skip link, header, footer)
  components/   Shared UI (Button, Container, SiteHeader, SiteFooter, …)
  pages/        Routes: /, /hakkimizda/, /hizmetler/, /projeler/, /projeler/[slug]/,
                /faaliyetlerimiz/, /iletisim/, 404
  data/         Typed content (company, projects, services, activities, redirects)
  lib/          media registry, contact link builders, SEO helpers
  styles/       Tailwind import + design tokens
public/         Legacy URL redirect stubs, robots.txt
tests/          Vitest suites
scripts/        verify-dist.mjs
docs/           Audit, inventories, design system, architecture, roadmap, deployment plan
```

The legacy site (`*.html`, `*.css`, `img/`, `projects-img/`, `logos/`, `mini-videos/`,
`Faaliyetler-img/`, `slider-photos/`, `CNAME`) stays at the repository root, unchanged, until its
retirement is approved. The new site imports media from those folders at build time.

## Content rules

- Company facts and copy come **only** from the existing site or written owner confirmation.
- Unknown values are typed as `UNKNOWN` / `NEEDS_CONFIRMATION` (`src/types/content.ts`) and are
  never shown as fact.
- The owner checklist is in [docs/CONTENT_INVENTORY.md](docs/CONTENT_INVENTORY.md#4-owner-confirmation-checklist).

## Documentation

- [Project audit](docs/PROJECT_AUDIT.md)
- [Content inventory](docs/CONTENT_INVENTORY.md)
- [Media inventory](docs/MEDIA_INVENTORY.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Deployment plan](docs/DEPLOYMENT_PLAN.md)

## Branch policy

Work happens on `redesign/eyfa-professional`. Never commit to, force-push or merge into `main`
without explicit owner approval. No deployment until Stage 8.
