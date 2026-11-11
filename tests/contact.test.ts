import { describe, expect, it } from 'vitest';
import { mailtoHref, telHref, whatsappHref } from '@/lib/contact';

describe('contact links', () => {
  it('builds tel: links from E.164 numbers', () => {
    expect(telHref('+905326868829')).toBe('tel:+905326868829');
  });

  it('builds wa.me links without the plus sign', () => {
    expect(whatsappHref('+905326868829')).toBe('https://wa.me/905326868829');
  });

  it('encodes Turkish characters in WhatsApp messages', () => {
    expect(whatsappHref('+905326868829', 'Merhaba, proje hakkında bilgi almak istiyorum')).toBe(
      'https://wa.me/905326868829?text=Merhaba%2C%20proje%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum',
    );
  });

  it('builds mailto links with an encoded subject', () => {
    expect(mailtoHref('info@eyfayapi.net')).toBe('mailto:info@eyfayapi.net');
    expect(mailtoHref('info@eyfayapi.net', 'Bilgi talebi & randevu')).toBe(
      'mailto:info@eyfayapi.net?subject=Bilgi%20talebi%20%26%20randevu',
    );
  });

  it('rejects malformed input instead of producing broken links', () => {
    expect(() => telHref('0532 686 88 29')).toThrow();
    expect(() => whatsappHref('905326868829')).toThrow();
    expect(() => mailtoHref('not-an-email')).toThrow();
  });
});

/* ------------------------------------------------------------------------ */
/* Stage 6 — messages, maps and the central contact source                  */
/* ------------------------------------------------------------------------ */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { company, contact } from '@/data/company';
import { projectDisplayName, publicProjects } from '@/data/projects';
import {
  DEFAULT_WHATSAPP_MESSAGE,
  MAX_MESSAGE_LENGTH,
  mapsDirectionsHref,
  projectEnquiryMessage,
  sanitizeMessage,
} from '@/lib/contact';
import { ROOT } from './helpers';

const textOf = (href: string) => new URL(href).searchParams.get('text');

describe('message sanitising', () => {
  it('removes control, newline and bidi-override characters', () => {
    expect(sanitizeMessage('Merhaba\n\r\tdünya‮\u0000!')).toBe('Merhaba dünya !');
  });

  it('keeps Turkish letters, punctuation and emoji', () => {
    expect(sanitizeMessage('Şişli’de 3+1 & 2+1? #A-1 %50 🏠')).toBe(
      'Şişli’de 3+1 & 2+1? #A-1 %50 🏠',
    );
  });

  it('caps the length', () => {
    const long = sanitizeMessage('a'.repeat(1000));
    expect(long.length).toBe(MAX_MESSAGE_LENGTH);
    expect(long.endsWith('…')).toBe(true);
  });
});

describe('WhatsApp links', () => {
  it('round-trips special characters through encoding', () => {
    const message = 'Fiyat? 3+1 & 2+1 #A/1 %50 = "teklif" 🏠 ğüşıöç';
    const href = whatsappHref('+905326868829', message);
    const url = new URL(href);
    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe('/905326868829');
    expect([...url.searchParams.keys()]).toEqual(['text']);
    expect(url.searchParams.get('text')).toBe(message);
  });

  it('cannot be used to inject extra URL parameters or paths', () => {
    const href = contact.whatsapp.forProject('Proje 06&phone=123/../x#y\nZ');
    const url = new URL(href);
    expect([...url.searchParams.keys()]).toEqual(['text']);
    expect(url.pathname).toBe('/905326868829');
    expect(url.hash).toBe('');
    expect(url.searchParams.get('text')).toContain('Proje 06&phone=123/../x#y Z');
  });

  it('uses only the verified company number', () => {
    expect(
      contact.whatsapp.href.startsWith(`https://wa.me/${company.whatsapp.e164.slice(1)}?`),
    ).toBe(true);
    expect(textOf(contact.whatsapp.href)).toBe(DEFAULT_WHATSAPP_MESSAGE);
  });

  it('builds a polite enquiry for every public project from its public label only', () => {
    for (const p of publicProjects()) {
      const label = projectDisplayName(p);
      const text = textOf(contact.whatsapp.forProject(label)) ?? '';
      expect(text).toBe(`Merhaba, web sitenizdeki ${label} hakkında bilgi almak istiyorum.`);
      // No internal data, file names or sale/availability language.
      expect(text).not.toMatch(
        /projects-img|\.webp|UNKNOWN|NEEDS_CONFIRMATION|proje-\d|satılık|satış|müsait|fiyat/i,
      );
    }
  });

  it('falls back to the default message for an empty label', () => {
    expect(projectEnquiryMessage(' \n ')).toBe(DEFAULT_WHATSAPP_MESSAGE);
  });
});

describe('maps and central contact source', () => {
  it('builds an official, keyless Google Maps directions URL', () => {
    const url = new URL(mapsDirectionsHref('EYFA YAPI, Dağıstan Sokak No: 4/14'));
    expect(url.origin).toBe('https://www.google.com');
    expect(url.pathname).toBe('/maps/dir/');
    expect(url.searchParams.get('api')).toBe('1');
    expect(url.searchParams.get('destination')).toBe('EYFA YAPI, Dağıstan Sokak No: 4/14');
    expect(url.searchParams.has('key')).toBe(false);
  });

  it('exposes exactly the verified legacy values', () => {
    expect(contact.mobile.href).toBe('tel:+905326868829');
    expect(contact.landline.href).toBe('tel:+902164195781');
    expect(contact.email.href).toBe('mailto:info@eyfayapi.net');
    expect(contact.email.enquiryHref).toBe(
      'mailto:info@eyfayapi.net?subject=Web%20sitesi%20%C3%BCzerinden%20bilgi%20talebi',
    );
    expect(contact.address.line).toBe(
      'Abdurrahmangazi Mahallesi Dağıstan Sokak No: 4/14, 34920 Sultanbeyli/İstanbul',
    );
    expect(contact.address.directionsHref).toContain('destination=');
    expect(contact.address.embedSrc).toBe(company.mapEmbedUrl);
  });

  it('no component or page hard-codes contact details (single source of truth)', () => {
    const files = (dir: string): string[] =>
      readdirSync(join(ROOT, dir)).flatMap((e) => {
        const rel = `${dir}/${e}`;
        return statSync(join(ROOT, rel)).isDirectory() ? files(rel) : [rel];
      });
    const allowed = new Set(['src/data/company.ts', 'src/lib/contact.ts', 'src/types/content.ts']);
    const offenders = files('src')
      .filter((f) => /\.(astro|ts)$/.test(f) && !allowed.has(f))
      .filter((f) =>
        /wa\.me|tel:\+|mailto:|instagram\.com|532\D?686|216\D?419|info@eyfayapi/.test(
          readFileSync(join(ROOT, f), 'utf8'),
        ),
      );
    expect(offenders).toEqual([]);
  });
});

describe('owner confirmations (2026-11-11)', () => {
  it('every published phone, WhatsApp, e-mail and address value is owner-confirmed', async () => {
    const { company, contact, ownerConfirmations } = await import('@/data/company');
    expect(ownerConfirmations.phones).toEqual(company.phones.map((p) => p.e164));
    expect(ownerConfirmations.phones).toContain(company.whatsapp.e164);
    expect(contact.mobile.href).toBe(`tel:${ownerConfirmations.phones[0]}`);
    expect(contact.landline.href).toBe(`tel:${ownerConfirmations.phones[1]}`);
    expect(contact.email.value).toBe(ownerConfirmations.email);
    expect(contact.address.line).toBe(ownerConfirmations.address);
  });
});
