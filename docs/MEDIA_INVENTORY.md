# Media Inventory

This inventory covers every media file in the repository (originals are unchanged; nothing was
renamed or deleted). I reviewed each image visually on generated contact sheets. Duplicates were
found with a perceptual difference hash after letterbox bars were cropped; no two files are
byte-identical.

Total media: ~76 MB (`img` 33 MB, `projects-img` 20 MB, `mini-videos` 20 MB, `slider-photos`
3 MB, `logos` 0.3 MB, `Faaliyetler-img` 0.3 MB).

---

## 1. Brand assets — `logos/`

| File                   | Size   | Pixels    | Used on legacy     | Notes                                                                                                                                                                                                                                                                                               |
| ---------------------- | ------ | --------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logo.png`             | 228 KB | 1024×1024 | Navbar (all pages) | Gold "EF" wing mark + "EYFA · YAPI" on a **transparent** background (artwork fills the central ~70%×49%). _Corrected in Stage 2: Stage 1 wrongly said "black background" because the contact sheet flattened alpha._ Used for header, footer and favicon. **A vector (SVG) master is still needed** |
| `mimarlik-logo.png`    | 80 KB  | 800×800   | Home: service icon |                                                                                                                                                                                                                                                                                                     |
| `muhendislik-logo.png` | 8 KB   | 216×233   | Home: service icon |                                                                                                                                                                                                                                                                                                     |
| `emlakçi-logo.png`     | 4.5 KB | 213×236   | Home: service icon | Two index entries (NFC + NFD), same blob. See PROJECT_AUDIT §6                                                                                                                                                                                                                                      |

The service icons have inconsistent sizes and styles. Stage 2 should replace them with a
consistent line-icon set (inline SVG) and keep the originals in the repository.

## 2. Videos — `mini-videos/`

All H.264, 29.97 fps. Total ~20 MB.

| File               | Size   | Resolution | Duration | Audio | Content                                                                                                       |
| ------------------ | ------ | ---------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------- |
| `logo-video.mp4`   | 1.2 MB | 1280×720   | 9.4 s    | AAC   | Animated 3D gold EYFA YAPI logo on dark background                                                            |
| `mini-video-1.mp4` | 1.2 MB | 1280×720   | 5.1 s    | —     | Drone: frontal façade with yellow stripes, BİM store at ground floor                                          |
| `mini-video-2.mp4` | 5.2 MB | 1920×1080  | 5.6 s    | AAC   | **Portrait clip pillarboxed into 16:9** (building corner). Added "via uncle's wish" (commits 7bfcb6f–fe61c16) |
| `mini-video-3.mp4` | 1.2 MB | 1920×1080  | 2.2 s    | —     | Drone: completed block, grey/orange façade                                                                    |
| `mini-video-4.mp4` | 3.1 MB | 1280×720   | 13.1 s   | —     | Drone: green-roof building and surroundings                                                                   |
| `mini-video-5.mp4` | 2.8 MB | 1920×1080  | 4.1 s    | —     | Drone: structural frame with scaffolding                                                                      |
| `mini-video-6.mp4` | 2.4 MB | 1280×720   | 10.1 s   | —     | Drone: top-down over construction site                                                                        |
| `mini-video-7.mp4` | 2.7 MB | 1920×1080  | 6.3 s    | —     | Drone: top-down street view                                                                                   |

Recommendation: for the hero, use one short silent loop (≤ 2 MB, 1280 px, re-encoded, `muted
playsinline`, with a poster image). Respect `prefers-reduced-motion` by showing the poster only.
Don't play the 8-clip sequence. Audio tracks should be stripped. The owner should approve which clip.

## 3. Corporate photography — `img/`

Drone stills of completed residential blocks. **Most have black letterbox bars baked into the
file** (exported video frames), so they need cropping before use as full-bleed imagery.

| File                       | Size        | Pixels    | Legacy use      | Subject                                                                  |
| -------------------------- | ----------- | --------- | --------------- | ------------------------------------------------------------------------ |
| `Eyfa-yapi-resim1.JPG`     | 0.9 MB      | 4000×2250 | unused          | Aerial: white block between neighbours (no letterbox)                    |
| `Eyfa-yapi-resim2.png`     | 1.8 MB      | 2872×1865 | home slider     | Block with orange/grey façade, side view                                 |
| `Eyfa-yapi-resim3.png`     | 1.8 MB      | 2872×1865 | home slider     | Same block, wider view                                                   |
| `Eyfa-yapi-resim4,5.png`   | 1.8 MB each | 2728×1771 | unused          | Green-roof block, oblique aerial                                         |
| `Eyfa-yapi-resim6,7.png`   | 2.0 MB each | 3024×1964 | unused          | Green-roof block, top-down                                               |
| `Eyfa-yapi-resim8.png`     | 1.8 MB      | 2728×1771 | home slider     | Green-roof block, oblique                                                |
| `Eyfa-yapi-resim9.png`     | 2.0 MB      | 2872×1865 | unused          | Green-roof block in city context                                         |
| `Eyfa-yapi-resim10,11.png` | 1.9 MB      | 2872×1865 | 10: home slider | Mid-rise block, top-down                                                 |
| `Eyfa-yapi-resim12,13.png` | 2.0 MB      | 3024×1964 | 12: home slider | Block with forested hills behind                                         |
| `Eyfa-yapi-resim14,16.png` | 1.9 MB      | 2872×1865 | unused          | Green-roof block, oblique                                                |
| `Eyfa-yapi-resim15.png`    | 1.8 MB      | 2872×1865 | home slider     | Green-roof block, street corner                                          |
| `Eyfa-yapi-resim17.png`    | 2.0 MB      | 3024×1964 | home slider     | **Frontal elevation, green roof, yellow stripes, shops at ground floor** |
| `Eyfa-yapi-resim18.png`    | 2.0 MB      | 3024×1964 | home slider     | Same building, wide city context with hills                              |
| `boss-photo.jpg`           | 132 KB      | 1080×1080 | about           | Founder portrait at desk (personal data, needs confirmation)             |

## 4. Project media — `projects-img/`

Summarised per gallery here; the project mapping is in CONTENT_INVENTORY §3.

| Group   | Files             | Pixels       | Kind                                | Notes                                                          |
| ------- | ----------------- | ------------ | ----------------------------------- | -------------------------------------------------------------- |
| 1–6     | `1.webp`–`6.webp` | 3363–3820 px | 1 render + 5 colour floor plans     | `1.webp` has a **THERMOsiding watermark**                      |
| 7–9     | `7`–`9.webp`      | 3024×1964    | Drone stills (letterboxed)          |                                                                |
| 10–14   | `10`–`14.webp`    | 3024×1964    | Drone stills                        | 14 = frame under construction                                  |
| 15–20   | `15`–`20.webp`    | 3024×1964    | Drone stills                        | Green roof / yellow stripes                                    |
| 21–22   | `21`, `22.webp`   | 3024×1964    | Drone stills                        |                                                                |
| 23–30   | `23`–`30.webp`    | 3024×1964    | Drone stills                        | "EYFA YAPI" visible on roof                                    |
| 31–35   | `31`–`35.webp`    | 1536–3024 px | Aerial + ground construction photos | **34: "Ferah Evler" hoarding with EYFA logo**. 32, 33 portrait |
| 158_8   | `-1…-3`           | 1755×1241    | CAD floor plans                     |                                                                |
| 184_1   | `-1…-6`           | 1755–2482 px | CAD plans + unit schedule           | Not on legacy site. ARTRIA / GOKTUG branding                   |
| 6078_11 | `-1`              | 5359×4586    | Façade render                       | Not on legacy site. "YEKFA YAPI" / "YILMAZ İNŞAAT" signage     |
| 6078_11 | `-2…-8`           | 1600×1280    | CAD floor plans                     | **Autodesk educational watermark**                             |
| 7109_4  | `-1…-6`           | 1600×1280    | CAD floor plans                     |                                                                |
| 7795_4  | `-1…-7`           | 3508–4963 px | Site + floor plans                  | FERAH CADDE / HAYAT CADDE                                      |

## 5. Duplicates

| Original (used)                        | Duplicate (unused)                      | Method                   |
| -------------------------------------- | --------------------------------------- | ------------------------ |
| `projects-img/6078_11-2,3,4,5,7.webp`  | `slider-photos/photo-1,2,3,4,5.jpg`     | dHash distance 0–4 / 256 |
| `projects-img/7109_4-1,2,3,4,5,6.webp` | `slider-photos/photo-6,7,8,9,10,11.jpg` | dHash distance 0–1 / 256 |

No byte-identical files exist. `img/*` and `projects-img/7–30` show the same buildings, but they
are different frames, not duplicates.

## 6. Activities — `Faaliyetler-img/`

| File                 | Pixels    | Content                                                                                        |
| -------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `sugiad-resim.webp`  | 1440×1800 | SUGİAD award ceremony photo (two people on stage, plaque). Identifiable people need permission |
| `tiyatro_resim.webp` | 1080×1080 | Poster: "Fethin 571. Yılında Fetih İstanbul" theatre performance, Sultanbeyli                  |

---

## 7. Recommended usage (authentic Eyfa Yapı imagery only, no stock)

| Slot                             | First choice                                                                                                                                                                                      | Alternatives                                                                             | Treatment required                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Homepage hero**                | **Stage 3 decision: `projects-img/19.webp`** (calm overcast sky, hills, EYFA roof sign, building low in frame, so it crops to square and 4:5). Earlier first choice `resim17` is frontal but busy | `img/Eyfa-yapi-resim18.png` (wide context); `mini-video-4.mp4` as an optional muted loop | Crop letterbox, warm-neutral grade, charcoal gradient overlay for text contrast |
| **Featured projects**            | Gallery 6 (`27.webp`, EYFA YAPI roof sign), gallery 1 (`34.webp`, Ferah Evler hoarding, once confirmed), gallery 2 (`7.webp`)                                                                     | `24.webp`, `19.webp`                                                                     | Only after names are confirmed                                                  |
| **Project cards**                | First drone still of each gallery; plans only as secondary images                                                                                                                                 | —                                                                                        | Crop to 4:3; floor plans shown `object-contain` on white                        |
| **Corporate / about background** | `img/Eyfa-yapi-resim12.png` (hills behind)                                                                                                                                                        | `img/Eyfa-yapi-resim9.png`, `projects-img/23.webp`                                       | Desaturate slightly; use as a low-contrast band                                 |
| **Services: Mimarlık**           | Colour floor plan `projects-img/3.webp`                                                                                                                                                           | `7795_4-7.webp` (rendered plan)                                                          | Not the Autodesk-watermarked drawings                                           |
| **Services: Mühendislik**        | Structural frame `projects-img/14.webp` or `32.webp`                                                                                                                                              | `mini-video-5.mp4` still                                                                 |                                                                                 |
| **Services: Emlak**              | Finished frontal `projects-img/24.webp`                                                                                                                                                           | `img/Eyfa-yapi-resim2.png`                                                               |                                                                                 |
| **Logo / favicon**               | `logos/logo.png` (interim)                                                                                                                                                                        | —                                                                                        | Owner to provide SVG / transparent master                                       |

Do not use until the owner approves: `projects-img/1.webp` (third-party watermark), `6078_11-*`
(educational watermark or another company's signage), `184_1-*` (third-party branding),
`boss-photo.jpg` and `sugiad-resim.webp` (identifiable people).

## 8. How media reaches the new site

Stage 1 imports originals from their legacy paths through an explicit allowlist in
`src/lib/media.ts`. Astro generates resized WebP variants with `srcset` at build time; the originals
are never shipped. `tests/media.test.ts` ensures every registered file is used, and
`scripts/verify-dist.mjs` enforces a 1 MB per-file and 40 MB total budget. The Stage 1 build is
~18–22 MB because of the multiple widths, and its largest file is ~0.3 MB.

## 9. Stage 3 homepage usage

| Slot                                          | File                                                                                       | Why                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Hero (split, eager, fetchpriority high, q=68) | `projects-img/19.webp`                                                                     | Negative space (sky) and verified signage. Crops to square (phones), 3:2 (tablet) and a tall panel (desktop) |
| Introduction                                  | `img/Eyfa-yapi-resim12.png`                                                                | Forested hills, calm; newly registered and letterbox-trimmed                                                 |
| Featured, large                               | `projects-img/27.webp` (gallery 6)                                                         | "EYFA YAPI" lettering, strongest facade                                                                      |
| Featured                                      | `projects-img/7.webp` (gallery 2), `projects-img/31.webp` (gallery 1, construction)        | Completed block, and work in progress                                                                        |
| Services                                      | `7795_4-7.webp` (rendered plan), `32.webp` (structural frame), `24.webp` (finished facade) | One authentic image per verified service. No watermarked drawings                                            |
| Closing contact                               | `img/Eyfa-yapi-resim18.png`                                                                | Wide city context; newly registered and letterbox-trimmed                                                    |

Not used, pending owner approval as before: `projects-img/1.webp`, `6078_11-*`, `184_1-*`,
`boss-photo.jpg`, `sugiad-resim.webp`.

## 10. Stage 4 — portfolio usage and build-time crops

- The full selection and exclusion review is in `docs/PROJECT_MEDIA_REVIEW.md`.
- **Withheld from the public site** (still in the repository, recoverable, never in `dist/`):
  `6078_11-1…8`, `1.webp`, `184_1-*`, and the near-duplicates `8, 11, 16, 29, 30.webp`. The list is
  in `src/data/withheld-media.json` and enforced by tests and `verify-dist`.
- **Letterbox bands are now removed at build time** by `src/lib/image-service.ts`, using measured
  pixel rows from `src/data/image-crops.json` (34 files: 29 drone stills and the 5 colour plans 2–6).
  This replaces the Stage 2/3 CSS oversizing trick. The original files are unchanged.
- The drone stills are 3024 × 1964 with bands at 168 px top and 94 px bottom, cropped to
  3024 × 1698. Plans 2–6 lose their 313–340 px bottom band only.

## 11. Stage 5 — corporate pages

| Page / slot            | File                                                     | Note                                                                                                                          |
| ---------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| About hero             | `projects-img/23.webp`                                   | Wide city and hills, crop applied                                                                                             |
| About story            | `32.webp` (frame, portrait) + `15.webp` (finished block) | Construction to completion, shown as two separate photos without claiming the same building                                   |
| About → projects       | `28.webp`                                                |                                                                                                                               |
| Services: Müteahhitlik | `33.webp` (portrait, scaffolding)                        | Homepage index uses `34.webp` (EYFA site hoarding)                                                                            |
| Services: Mimarlık     | `24.webp`                                                | Photo, not drawings (drawing authorship is unconfirmed)                                                                       |
| Services: Mühendislik  | `14.webp`                                                |                                                                                                                               |
| Services: Emlak        | `26.webp`                                                |                                                                                                                               |
| Activities             | _none_                                                   | Both `Faaliyetler-img/*` files withheld (award context; municipal branding). Unregistered and listed in `withheld-media.json` |

No image repeats within a page. New rows reuse the gallery thumbnail widths (480/720/960/1280,
default quality), so Astro reuses existing derivatives. The build grew only 1.0 MB (33.1 → 34.1 MB).

## 12. Stage 7 — derivatives and share images

- **Photo derivatives:** WebP quality 72 by default (`MediaFrame`, `fit="cover"`). Drawings keep
  the encoder default (80). A 750 px step was added to the width ladders for phones.
- **Share images:** `/og/*.jpg` (1200×630) are composed at build time from photos already shown
  publicly: home `19`, about `23`, services `33`, projects (first portfolio photo), and each public
  project's first photo. The logo is trimmed, not edited. No floor plan is used (tested).
- **`img/Eyfa-yapi-resim17.png`:** no longer registered (it was the old default share image). The
  original stays in the repository.
- **Build output:** 31.2 MB (was 34.2 MB); the budget stays 40 MB.
