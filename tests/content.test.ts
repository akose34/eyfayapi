import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { activities } from '@/data/activities';
import { company, legacyCopy } from '@/data/company';
import { projects } from '@/data/projects';
import { services } from '@/data/services';
import { ROOT, normaliseText, readRoot } from './helpers';

const legacyHome = normaliseText(readRoot('index.html'));
const legacyAbout = normaliseText(readRoot('about.html'));

describe('company facts come verbatim from the legacy site', () => {
  it('legal name, phones, email, address, instagram', () => {
    expect(legacyHome).toContain(company.legalName);
    for (const phone of company.phones) expect(legacyHome).toContain(phone.display);
    expect(legacyHome).toContain(company.email);
    expect(legacyHome).toContain(company.address.street);
    expect(legacyHome).toContain(`${company.address.postalCode}`);
    expect(legacyHome).toContain(`${company.address.district}/${company.address.city}`);
    // Attribute values (hrefs, iframe src, meta) are checked against the raw HTML.
    const rawHome = readRoot('index.html');
    expect(rawHome).toContain(`https://wa.me/${company.whatsapp.e164.slice(1)}`);
    expect(rawHome).toContain(company.social[0].url);
    expect(rawHome).toContain(company.mapEmbedUrl);
  });

  it('phone numbers in E.164 match their display form', () => {
    for (const phone of [...company.phones, company.whatsapp]) {
      const digits = phone.display.replace(/\D/g, '').replace(/^0|^90/, '');
      expect(phone.e164).toBe(`+90${digits}`);
    }
  });

  it('homepage and about copy is unchanged', () => {
    expect(legacyHome).toContain(legacyCopy.homeHeadline);
    expect(legacyHome).toContain(legacyCopy.homeIntro);
    expect(legacyHome).toContain(normaliseText(legacyCopy.projectsIntro));
    expect(readRoot('index.html')).toContain(`content="${legacyCopy.metaDescription}"`);
    for (const p of [
      ...legacyCopy.aboutCompany,
      ...legacyCopy.aboutCompanyList,
      ...legacyCopy.aboutCompanyClosing,
      legacyCopy.mission,
      legacyCopy.vision,
    ]) {
      expect(legacyAbout).toContain(p);
    }
  });

  it('services and activities are verbatim', () => {
    for (const s of services) {
      expect(legacyHome).toContain(s.title);
      expect(legacyHome).toContain(s.description);
    }
    const legacyActivities = normaliseText(readRoot('faaliyet.html'));
    for (const a of activities) {
      expect(legacyActivities).toContain(a.title);
      expect(legacyActivities).toContain(a.description);
      expect(existsSync(join(ROOT, a.image))).toBe(true);
    }
  });
});

describe('projects mirror legacy projeler.html', () => {
  it('has unique, URL-safe slugs', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it('lists exactly the legacy gallery images, in legacy order', () => {
    const legacyImages = [
      ...readRoot('projeler.html').matchAll(/src="(projects-img\/[^"]+)"/g),
    ].map((m) => m[1]);
    const ours = projects.flatMap((p) => p.gallery.map((g) => g.src));
    expect(ours).toEqual(legacyImages);
  });

  it('references only files that exist', () => {
    for (const p of projects) {
      for (const g of p.gallery) expect(existsSync(join(ROOT, g.src)), g.src).toBe(true);
    }
  });

  it('never presents an unconfirmed project name as verified', () => {
    for (const p of projects) {
      // The legacy site contains no project names at all.
      expect(p.name.status).not.toBe('VERIFIED');
      expect(p.description.status).not.toBe('VERIFIED');
    }
  });
});
