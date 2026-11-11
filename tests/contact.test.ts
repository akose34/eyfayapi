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
