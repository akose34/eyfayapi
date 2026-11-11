# Owner Review Checklist

How to review locally:

```bash
export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
npm run build && npx astro preview
```

Then open `http://localhost:4321/`. Nothing here is published until the owner approves Stage 8.

## 1. Facts (must be confirmed or corrected)

- [ ] Phone (mobile/WhatsApp) **0 (532) 686 88 29**: still current.
- [ ] Landline **0 216 419 57 81**: still current, and is it the office line?
- [ ] E-mail **info@eyfayapi.net**: monitored.
- [ ] Address **Abdurrahmangazi Mahallesi Dağıstan Sokak No: 4/14, 34920 Sultanbeyli/İstanbul**
      and the Google Maps pin.
- [ ] Instagram **@eyfa.yapi**: the official account.
- [ ] Founded **2004** by **Fatih Yılmaz** (used in text and structured data).
- [ ] Legal name **EYFA MÜTEAHHİTLİK YAPI İNŞAAT SAN. TİC. LTD. ŞTİ.** (footer, structured data).
- [ ] Opening hours: publish? If so, provide them.

## 2. Projects

For each project, provide the details or say "keep the label":

| Label    | Name | Location (district) | Type | Status / year | Approve photos |
| -------- | ---- | ------------------- | ---- | ------------- | -------------- |
| Proje 01 |      |                     |      |               | [ ]            |
| Proje 02 |      |                     |      |               | [ ]            |
| Proje 03 |      |                     |      |               | [ ]            |
| Proje 04 |      |                     |      |               | [ ]            |
| Proje 05 |      |                     |      |               | [ ]            |
| Proje 06 |      |                     |      |               | [ ]            |
| Proje 07 |      |                     |      |               | [ ]            |
| Proje 09 |      |                     |      |               | [ ]            |
| Proje 10 |      |                     |      |               | [ ]            |
| Proje 11 |      |                     |      |               | [ ]            |

- [ ] The company holds the rights to all published photos and drawings.
- [ ] Withheld media (`PROJECT_MEDIA_REVIEW.md`) stays unpublished, or a clean replacement is
      supplied.

## 3. Wording to approve (legacy copy that makes unverifiable claims)

| Where                    | Current (legacy)                                                                    | Option: softened                                                      |
| ------------------------ | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Projects page lead       | "…İşte Eyfa Yapı'nın **başarıyla tamamladığı** ve sürdürdüğü projelerden bazıları." | "…İşte Eyfa Yapı'nın tamamladığı ve sürdürdüğü projelerden bazıları." |
| Homepage principle 3     | "…bugüne dek teslim ettiği her projede bu anlayışıyla **öne çıkmıştır**."           | "…her projede bu anlayışla çalışır."                                  |
| Default meta description | "…projelerde **güvenilir çözümler** sunar…"                                         | keep, or "…projelerde çözümler sunar…"                                |
| Mimarlık service         | "**Uzman mimarlarla** birlikte…"                                                    | "Mimarlarla birlikte…"                                                |
| Mühendislik service      | "**Alanında yetkin** mühendislerle…"                                                | "Mühendislerle…"                                                      |
| Emlak service            | "**Doğru projeleri, doğru yatırımcılarla** buluşturuyoruz."                         | keep or rewrite                                                       |
| Brand casing             | "Eyfa Yapı" (brand) and "EYFA Yapı" (legacy text) both appear                       | pick one                                                              |

- [ ] Approve or choose an option for each row.
- [ ] Approve the Stage 6 WhatsApp messages (default and per-project).
- [ ] Approve the shortened Projects meta description: "Eyfa Yapı projeleri: konut, ticari yapı,
      altyapı ve kentsel dönüşüm alanlarındaki çalışmalarımızdan fotoğraflar ve çizimler."
- [ ] Approve the editorial About/Services copy from Stage 5 (`CONTENT_INVENTORY.md` §6).

## 4. Navigation: Activities page

The page shows one item (SUGİAD membership). Two items are withheld (attribution unclear).

- **Recommendation:** keep the page and its footer link, but **remove "Faaliyetler" from the
  primary header navigation** until there are at least three verified items.
  - Header slots go to pages visitors look for (projects, services, contact).
  - A one-item page in the main menu reads as unfinished.
- **Consequences of removing it:** the URL stays live and indexable, reachable from the footer
  ("Faaliyetlerimiz") and the sitemap. No redirect is needed. The legacy `/faaliyet.html` redirect
  is unaffected.
- [ ] Decide: keep in header / footer only / remove the page.

## 5. Creative direction (proposals, not implemented)

- [ ] **Hero image:** keep `projects-img/19.webp`, or try a stronger alternative
      (`projects-img/23.webp` aerial, or a short muted `mini-videos` loop). Proposal only.
- [ ] **Headline:** "Eyfa Yapı ile Geleceği İnşa Ediyoruz." is the legacy tagline (also in the
      footer). Shortening it is a brand decision. Keep it, or supply a new approved line.
- [ ] **Homepage density:** the copy is legacy text. Approve shortening the hero intro to its
      first sentence (the second sentence repeats the about section).
- [ ] **Project presentation:** improves automatically once names are confirmed (§2).

## 6. Manual checks

- [ ] VoiceOver walk-through (`ACCESSIBILITY_AUDIT.md` §4).
- [ ] Real phones: iPhone Safari and an Android Chrome. Tap the WhatsApp, phone, e-mail and
      directions links. They should open the app with the right number and message; **do not
      send**.
- [ ] The "Haritayı yükle" map shows the correct office.

## 7. Release approval

- [ ] Content blockers B1–B4 in `RELEASE_BLOCKERS.md` resolved or accepted.
- [ ] Deployment plan (`DEPLOYMENT_PLAN.md`) approved. Only then does Stage 8 begin.
