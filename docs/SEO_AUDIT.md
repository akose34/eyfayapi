# SEO Audit (Stage 7)

## 1. Summary

| Area            | State after Stage 7                                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Titles          | Unique per indexable page, "Page \| Eyfa Yapı"; the homepage keeps the legacy title                                              |
| Descriptions    | Unique, 50–170 characters on indexable pages (enforced). Project pages: the neutral intro plus the media count                   |
| Canonicals      | Absolute and self-referencing on every indexable page. **None on 404** (it used to point at a non-existent `/404/`)              |
| Robots meta     | Unconfirmed project pages: `noindex, follow` (was `nofollow`). 404: `noindex, follow`                                            |
| Open Graph / X  | `og:title/description/url/type/locale/site_name/image(+type,width,height,alt)`, `twitter:card/title/description/image/image:alt` |
| Sharing images  | Generated at build time: `/og/*.jpg`, 1200×630 (see §4)                                                                          |
| Language        | `<html lang="tr">`, `og:locale tr_TR`, `inLanguage: tr-TR`                                                                       |
| Sitemap         | Exactly the 6 indexable pages (enforced both ways)                                                                               |
| robots.txt      | Generated: production allows everything and names the sitemap; a staging build disallows everything                              |
| Structured data | `GeneralContractor` + `WebSite` graph, plus `BreadcrumbList`. Verified facts only (§5)                                           |
| Legacy URLs     | Static redirect documents, tested in the browser (§6)                                                                            |
| Lighthouse SEO  | 100 on every indexable page; 69 on project pages because of the intentional `noindex`                                            |

## 2. Page inventory

| URL                           | Indexed | In sitemap | Title                                       | Share image                  |
| ----------------------------- | ------- | ---------- | ------------------------------------------- | ---------------------------- |
| `/`                           | yes     | yes        | Eyfa Yapı \| İnşaat & Gayrimenkul Projeleri | `og/home.jpg`                |
| `/hakkimizda/`                | yes     | yes        | Hakkımızda \| Eyfa Yapı                     | `og/about.jpg`               |
| `/hizmetler/`                 | yes     | yes        | Hizmetlerimiz \| Eyfa Yapı                  | `og/services.jpg`            |
| `/projeler/`                  | yes     | yes        | Projelerimiz \| Eyfa Yapı                   | `og/projects.jpg`            |
| `/faaliyetlerimiz/`           | yes     | yes        | Faaliyetlerimiz \| Eyfa Yapı                | `og/default.jpg`             |
| `/iletisim/`                  | yes     | yes        | İletişim \| Eyfa Yapı                       | `og/default.jpg`             |
| `/projeler/proje-01…11/` (10) | **no**  | **no**     | Proje NN \| Eyfa Yapı                       | `og/proje-NN.jpg` or default |
| `/projeler/proje-08/`         | no      | no         | redirect document → `/projeler/` (withheld) | –                            |
| `/404.html`                   | no      | no         | Sayfa bulunamadı \| Eyfa Yapı               | `og/default.jpg`             |
| `/about.html` etc. (4)        | no      | no         | redirect documents                          | –                            |

## 3. Placeholder project pages

The ten project pages use temporary public labels ("Proje 06") because no project name, location
or date is confirmed. Decision: **keep them navigable, keep them out of the index.**

- They stay linked from `/projeler/` and from the homepage, so the portfolio can be reviewed and
  visitors can see the authentic photographs.
- They carry `noindex, follow` and are excluded from the sitemap. Search engines therefore never
  present "Proje 06" as a finished case study, while their links to real pages still count.
- **To publish a project:** set `name.status: 'VERIFIED'` in `src/data/projects.ts`. The page then
  loses `noindex` automatically. Also remove the `/projeler/proje-` filter in `astro.config.ts`
  (sitemap). `verify-dist` fails if the two disagree.

## 4. Sharing images

- Built by `src/pages/og/[key].jpg.ts` with sharp, from:
  - an **authentic, public** photo that the page itself already shows, cropped the same way as on
    the site (letterbox bands removed);
  - a charcoal gradient;
  - the **authentic logo**, trimmed but not redrawn.
- **No text is rendered into the images.** Titles live in the meta tags, so a picture can never
  carry an unapproved claim or drift from the page.
- Pages without a suitable photo (contact, activities, 404) share `og/default.jpg`: the logo on
  charcoal.
- Tests check that each photo is registered and public and never a floor plan (`tests/seo-stage7.test.ts`).
  `verify-dist` checks that every file exists and is a 1200×630 JPEG.

## 5. Structured data

`BaseLayout` emits one `@graph`:

- **`GeneralContractor`** (a `LocalBusiness` subtype) with `@id https://eyfayapi.net/#organization`.
  The registered legal name is "EYFA MÜTEAHHİTLİK YAPI İNŞAAT…"; _müteahhitlik_ means construction
  contracting. Properties, all from verified data:
  - `name`, `legalName`, `url`, `logo`, `image`, `email`, `telephone`;
  - `foundingDate` 2004 and `founder` Fatih Yılmaz;
  - `address` (`PostalAddress`), `hasMap` (directions URL) and `sameAs` (Instagram);
  - two `ContactPoint`s.
- **`WebSite`** with `inLanguage: tr-TR` and `publisher` → the organisation.
- **`BreadcrumbList`** on every page with breadcrumbs.

**Deliberately absent** (no verified source): `openingHours`, `geo`, `areaServed`, `aggregateRating`,
`review`, `award`, `hasCredential`, `priceRange`, project dates. `verify-dist` fails if any appears.

**Validation:**

- Every JSON-LD block parses, and the banned-property scan runs in `verify-dist`.
- `jsonLdString` escapes `<`, so data cannot close the script tag. A unit test covers this, and
  breadcrumbs now use the same helper (they were unescaped).
- Google's Rich Results Test was **not** used: it is an external service. Run it on the preview
  URL in Stage 8 (it needs a public URL).

## 6. Legacy URLs and hosting

| Legacy URL       | Target              | Mechanism (works on GitHub Pages)                                                            | Browser-tested |
| ---------------- | ------------------- | -------------------------------------------------------------------------------------------- | -------------- |
| `/index.html`    | `/`                 | The new homepage is `dist/index.html`                                                        | yes            |
| `/anaEkran.html` | `/`                 | `public/anaEkran.html`: meta refresh, canonical and `location.replace` (query and hash kept) | yes            |
| `/about.html`    | `/hakkimizda/`      | same                                                                                         | yes            |
| `/projeler.html` | `/projeler/`        | same                                                                                         | yes            |
| `/faaliyet.html` | `/faaliyetlerimiz/` | same                                                                                         | yes            |

**Hosting-dependent: verify on the Stage 8 preview, not just locally.**

1. GitHub Pages serves `/projeler` (no extension) as `projeler.html`, the stub, which then
   redirects. Locally `astro preview` behaves differently. Check all extension-less variants.
2. Directory URLs without a trailing slash (`/hakkimizda`) should get a 301 to `/hakkimizda/` from
   Pages. Verify.
3. `/404.html` must be served for unknown paths with HTTP 404. Pages does this automatically for a
   root `404.html`.
4. Meta-refresh redirects are not HTTP 301s. Google treats an instant refresh plus canonical as
   permanent, but Search Console should be watched for "Page with redirect" reports after launch.

## 7. Staging indexing policy

- **Production** (default, any build without the variable): indexable, and robots.txt allows
  crawling. Nothing has to be remembered to keep the real domain crawlable.
- **Staging / preview deployments:** build with `SITE_INDEXING=off`:
  - every page gets `noindex, follow`;
  - `robots.txt` becomes `Disallow: /`;
  - `SITE_INDEXING=off npm run verify:dist` confirms both.

  A staging build checked without the variable **fails** `verify-dist` (robots blocks the site), so a
  staging build cannot pass the production pipeline by accident.

- robots.txt is a crawl hint, not access control. Nothing private is published: withheld media
  never reaches `dist/` (Stage 4 checks).

## 8. Search Console handover (Stage 8, owner's account)

1. Verify the domain property `eyfayapi.net` (DNS TXT, done by the owner).
2. Submit `https://eyfayapi.net/sitemap-index.xml`.
3. Inspect `/`, `/projeler/` and one legacy URL. Watch Coverage for "Page with redirect" and
   "Excluded by noindex" (expected for project pages).
4. Run the Rich Results Test on `/` once live.
