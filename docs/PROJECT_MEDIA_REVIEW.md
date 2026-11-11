# Project Media Review (Stage 4)

This is an internal editorial and rights review of all 11 legacy project galleries. It is not
published: `docs/` is never part of `dist/`.

The machine-readable source of truth is `curation` in `src/data/projects.ts`. Every legacy image is
either shown or excluded with a reason, and `tests/projects.test.ts` enforces that. Withheld files
are listed in `src/data/withheld-media.json`. They are not registered for the build, and
`scripts/verify-dist.mjs` fails if any of them, or any derivative, appears in `dist/`.

**Method:**

- Every image was inspected visually on contact sheets (letterbox removed) and with zoomed edge
  strips to look for watermarks and title blocks.
- Near-duplicates were judged by eye (same position, angle and moment). A perceptual dHash
  (≤ 40/256) found no pixel-level duplicates within galleries 1–6.
- Letterbox bands were measured at full resolution (`scripts/measure-letterbox.mjs`).
- No original file was modified, renamed or deleted.

## 1. Summary

| Gallery | Slug     | Shown              | Excluded                                 | Public?      | Notes                                                                                                                                     |
| ------- | -------- | ------------------ | ---------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1       | proje-01 | 5 photos (hero 31) | none                                     | yes          | Construction-phase photos only. Labelled "İnşaat sürecinden". "Ferah Evler" hoarding (34) is a lead, not confirmed                        |
| 2       | proje-02 | 2 photos (hero 7)  | 8 (near-duplicate of 7)                  | yes          | Completed-looking block with orange façade accents                                                                                        |
| 3       | proje-03 | 4 photos (hero 14) | 11 (near-duplicate of 12)                | yes          | Structural frame with scaffolding. Labelled as construction                                                                               |
| 4       | proje-04 | 5 photos (hero 19) | 16 (near-duplicate of 15)                | yes          | Green roof, yellow stripes, "≡EYFA" roof logo band. Possibly the same building as gallery 6 (§3)                                          |
| 5       | proje-05 | 2 photos (hero 21) | none                                     | yes          | Brown-roof block                                                                                                                          |
| 6       | proje-06 | 6 photos (hero 27) | 29 (near-dup of 25), 30 (near-dup of 26) | yes          | "EYFA YAPI" lettering on the roof storey. Ground-floor shops (24)                                                                         |
| 7       | proje-07 | 6 plans            | none                                     | yes          | 7109_4 drawings. No watermark or branding found. Plans 3 and 4 are very similar but kept (possibly different floors)                      |
| 8       | proje-08 | nothing            | 6078_11-2…8 (educational watermark)      | **withheld** | Every drawing carries "PRODUCED BY AN AUTODESK EDUCATIONAL PRODUCT". The route redirects to `/projeler/`                                  |
| 9       | proje-09 | 3 plans            | none                                     | yes          | 158_8 drawings. No branding                                                                                                               |
| 10      | proje-10 | 7 plans            | none                                     | yes          | 7795_4 site and floor plans. Mentions "FERAH CADDE" / "HAYAT CADDE". Possibly related to gallery 1 (unconfirmed, so no relation is shown) |
| 11      | proje-11 | 5 colour plans     | 1.webp (THERMOsiding logo and URL)       | yes          | The black band at the bottom of plans 2–6 is removed at build time; drawing content is untouched                                          |

Not part of any legacy gallery and not published: `184_1-1…6` (ARTRIA / GOKTUG Mimarlık branding)
and `6078_11-1` ("YEKFA YAPI" / "YILMAZ İNŞAAT" signage).

## 2. Selection rationale per gallery

- **Hero choice.** The widest, calmest composition that shows the whole building:
  - 27 (EYFA YAPI lettering) for gallery 6.
  - 19 (sky and hills, roof logo) for gallery 4.
  - 14 for gallery 3: the frame against the hills honestly shows construction.
  - 31 for gallery 1: a site overview. Portraits 32 and 33 follow in the gallery.
- **Order inside galleries.** Context first (frontal or wide), then top-down and detail shots.
  Portraits are paired in a 4:5 row (gallery 1: 33 and 32).
- **Drawings.** Residential floors come before ground-floor shop plans (gallery 11: 3, 6, 2, 4, 5).
  Drawings are shown with `object-fit: contain` and are never cropped beyond verified solid bands.

## 3. Possible duplicate groups

**Galleries 4 and 6 are not merged; the question is open.**

Similarities:

- 7 storeys, green hipped roof, grey/white façade with two yellow vertical stripes.
- The same overcast light, and similar neighbourhood texture.
- 19 (gallery 4) and 23 (gallery 6) show the same hills on the horizon.

Differences:

- Gallery 4 shows a "≡EYFA" logo band on the roof (19).
- Gallery 6 shows "EYFA YAPI" gold lettering (26, 27, 30) and ground-floor shops (24).

Interpretation: either one building photographed at different signage phases, or two sister
buildings of the same design. The `img/Eyfa-yapi-resim*.png` stills mix angles from both (resim4,
6, 9 resemble gallery 4; resim14 resembles gallery 6).

Mitigation until the owner answers:

- The portfolio places the two a row apart.
- The homepage uses gallery 4 for the hero and gallery 6 for the large featured card. That may show
  one building twice; the risk is documented.

**Gallery 1 and gallery 10 are possibly related.** The 7795_4 site plans name "FERAH CADDE" and
"HAYAT CADDE", and the gallery 1 hoarding reads "Ferah Evler" beside a "HAYAT" street sign. Not
confirmed, so no "related project" link is shown.

## 4. Rights and branding findings

| File(s)                            | Finding                                                                                                    | Decision                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `6078_11-2…8`                      | Autodesk educational-licence watermark (top and side strips)                                               | Withheld (whole gallery 8)                                                       |
| `6078_11-1`                        | Render with "YEKFA YAPI" and "YILMAZ İNŞAAT" signage                                                       | Withheld (never on the legacy site)                                              |
| `1.webp`                           | THERMOsiding logo and URL (third-party marketing render)                                                   | Withheld                                                                         |
| `184_1-*`                          | ARTRIA Mimarlık and GOKTUG Mimarlık branding, with address and phone numbers                               | Withheld (never on the legacy site)                                              |
| `34.webp`                          | EYFA YAPI hoarding with the company's own phone numbers; a municipal permit board (unreadable at web size) | Shown. Company content                                                           |
| `7109_4`, `158_8`, `7795_4`, `2–6` | No visible watermark or third-party names. Authorship of the drawings is unknown                           | Shown, with the owner asked to confirm publication rights (CONTENT_INVENTORY §4) |

## 5. Letterbox and band crops (build time)

`src/data/image-crops.json` lists 34 files. All 3024×1964 drone stills have exactly 168 px black at
the top and 94 px at the bottom; the crop removes 170 and 96 px (measured band plus a 2 px margin).
Colour plans 2–6 have a 313–340 px black band at the bottom, which is cropped the same way.
`2.webp` has a 1 px dark frame line at the top, below the 0.5% minimum band, so it is kept.

The ground-level photos (32, 33, 35) have no bands, so they have no entry.
