# Final Design Review (Stage 8)

Reviewed on the production build in a real browser:

- Claude's Chromium browser pane at 1440, 1024 and 375 px, including the open mobile menu;
- Playwright Chromium full-page captures at 390 and 1440 for every page type.

Earlier stages covered 320, 768 and 1920. Overflow at 320 is automated.

The creative direction is unchanged: charcoal / ivory / champagne, Cormorant + Manrope, authentic
project photography, editorial rows instead of card grids.

## 1. Refinements made in Stage 8 (safe, no copy or identity change)

| #   | Where                       | Problem observed                                                                                                                               | Change                                                                                                                        |
| --- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1   | Homepage hero (≥ 1024 px)   | A hard vertical seam where the text panel met the photo: a 160 px linear ramp (banding) plus a 1 px light anti-aliasing line at a fractional x | A 42 %-wide eased gradient (5 stops), with the overlay extended 1 px left. The photo now melts into the panel                 |
| 2   | Homepage hero (phones)      | The square photo pushed both buttons below the first screen at 375×812                                                                         | 5:4 crop on phones (the focal point keeps the building and "EYFA" roof sign). "Projelerimiz" is now visible without scrolling |
| 3   | All photos on dark sections | Light ivory placeholder flashed before the image loaded (hero, project hero, contact band)                                                     | Placeholder becomes charcoal-800 inside `.tone-dark`. Drawings keep white                                                     |

Stage 7 refinements, kept: the homepage approach band (no empty column), denser services rows,
and a stronger footer.

## 2. Page-by-page assessment

| Page           | Verdict                                                                                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home           | Strong: clear hierarchy, authentic hero, editorial services index. The legacy copy is still dense (see §3)                                                            |
| About          | Strong: a verified 2004 anchor, mission/vision statement bands, approach grid. A founder section is proposed (§4)                                                     |
| Services       | Strong: zigzag feature rows with distinct authentic photos. Three closing bands in a row (results band → contact → footer) are acceptable but long                    |
| Activities     | Visually fine, **content thin** (one item). See the navigation recommendation in `FINAL_OWNER_APPROVAL.md` §2                                                         |
| Projects       | Good editorial grid. Temporary labels ("Proje 06") are the biggest remaining weakness, and only the owner can fix them                                                |
| Project detail | Good. A 5-photo gallery leaves one empty grid cell on desktop (standard editorial grid; not changed, as stretching it would distort the photo)                        |
| Contact        | Clear and conversion-focused. Map consent is understated and honest                                                                                                   |
| Header / menu  | Clean. The mobile menu is a full-screen dialog with large numbered links and phone/WhatsApp shortcuts                                                                 |
| Footer         | Adequate presence after Stage 7. It repeats the hero tagline on every page; that is intentional brand repetition, and the owner may prefer the positioning line alone |

## 3. Proposals requiring owner approval (not implemented)

1. **Hero photograph:** the current `projects-img/19.webp` (calm sky, EYFA roof sign) works.
   Stronger options, all authentic:
   - `projects-img/23.webp`: wider aerial with more city context (used on About);
   - a muted 6–8 s loop from `mini-videos/` (needs re-encoding without audio; adds ~1–2 MB, so
     LCP must be re-measured).
2. **Headline length:** "Eyfa Yapı ile Geleceği İnşa Ediyoruz." is the legacy corporate tagline.
   It's short enough typographically (3 lines at 1440 px). Changing it is a brand decision.
   Inventing a new tagline is out of scope.
3. **Copy density and repetition:**
   - The Services header repeats the homepage hero sentence word for word ("Mimarlık, mühendislik
     ve müteahhitlik alanlarında güçlü birikimimizle…"). A distinct, verified one-liner would read
     better.
   - The footer repeats the tagline on every page.
   - Soften the legacy claims listed in `FINAL_OWNER_APPROVAL.md` §2.
4. **Founder section** on About (§4).
5. **Activities** out of the header (keep the page and footer link).

## 4. Founder section: assessment and proposal

**Source:** `img/boss-photo.jpg` (legacy about.html). The founder's name and role are verified:
"2004 yılında Fatih Yılmaz tarafından … kurulmuş".

| Criterion               | Assessment                                                                                                                                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Resolution              | 1080×1080 JPEG (132 KB). Enough for a 4:5 portrait up to ~375 CSS px wide at 2× (cropped 752×940). Not enough for a large hero portrait                                                                                                                                  |
| Composition             | Centred, eye-level, hands folded on the desk; good light; sharp face                                                                                                                                                                                                     |
| Professional appearance | Good for a company profile (office setting, shirt and vest)                                                                                                                                                                                                              |
| Background              | A large framed historical black-and-white photograph fills the upper half, with many identifiable people in it. A 4:5 crop still shows its lower part. It competes with the face and carries its own connotations. A **re-shoot against a neutral wall** would be better |
| Mobile / desktop        | Works at 4:5 in a 4/12-column slot on desktop and full width on phones (see mockups)                                                                                                                                                                                     |
| Biography accuracy      | The legacy biography is **time-sensitive or private**: age 44, student status, hometown, family, association roles. All excluded. Only the name, role and founding fact are verified                                                                                     |
| Privacy / consent       | Identifiable personal image. **Needs the founder's explicit consent** for the new site                                                                                                                                                                                   |

**Recommendation:** an understated founder note after "Hikâyemiz" on About.

- Portrait (4:5), eyebrow "Kurucumuz", name, the role "Kurucu", and one verified sentence: "EYFA
  Yapı’yı 2004 yılında İstanbul’da kurdu."
- No biography until the founder supplies current wording.
- The company stays the focus: the section is modest, below the story, and not on the homepage.
- **Do not publish** until consent is given; a neutral-background portrait is preferred.

**Mockups** (built with the site's components on a temporary page, which was deleted afterwards;
nothing is in the build):

- `docs/proposals/founder-section-desktop.jpg`
- `docs/proposals/founder-section-mobile.jpg`

**To implement after approval** (about 30 minutes):

1. Register `img/boss-photo.jpg` (or the new portrait) in `src/lib/media.ts`.
2. Add a crop entry and the copy block (with `basis`) to `src/data/corporate.ts`.
3. Add the section to `src/pages/hakkimizda.astro`.
4. Update the Stage 5 biography test so it still bans the excluded details.
