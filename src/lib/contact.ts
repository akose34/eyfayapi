/**
 * Backend-free contact helpers. All contact happens through native links
 * (tel:, mailto:, WhatsApp deep links); there is no form and no server.
 */

const E164 = /^\+[1-9]\d{6,14}$/;

const assertE164 = (value: string): string => {
  if (!E164.test(value)) throw new Error(`Invalid E.164 phone number: "${value}"`);
  return value;
};

/** tel: link, e.g. telHref('+905326868829') → "tel:+905326868829". */
export const telHref = (e164: string): string => `tel:${assertE164(e164)}`;

/**
 * WhatsApp click-to-chat deep link (https://wa.me/<digits>), optionally with a
 * pre-filled message. wa.me requires the number without "+" or spaces.
 */
export function whatsappHref(e164: string, message?: string): string {
  const digits = assertE164(e164).slice(1);
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** mailto: link with an optional, safely encoded subject. */
export function mailtoHref(email: string, subject?: string): string {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`Invalid email: "${email}"`);
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}

/* ------------------------------------------------------------------------ */
/* Stage 6 — WhatsApp messages and map links                                */
/* ------------------------------------------------------------------------ */

/** Upper bound for pre-filled message text (keeps URLs short and safe). */
export const MAX_MESSAGE_LENGTH = 300;

/**
 * Normalises text for a pre-filled message: removes control and bidi
 * override characters, collapses whitespace, trims and caps the length.
 * Encoding happens separately (encodeURIComponent in whatsappHref).
 */
export function sanitizeMessage(text: string, max = MAX_MESSAGE_LENGTH): string {
  const cleaned = text
    // Unicode controls (Cc: C0/C1 incl. \n \r \t) and format characters (Cf: zero-width, bidi overrides, BOM)
    .replace(/[\p{Cc}\p{Cf}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.length > max ? `${cleaned.slice(0, max - 1).trimEnd()}…` : cleaned;
}

/** Polite, concise default message for general enquiries. */
export const DEFAULT_WHATSAPP_MESSAGE =
  'Merhaba, web siteniz üzerinden ulaşıyorum. Bilgi almak istiyorum.';

/**
 * Message for a project-specific enquiry. Uses ONLY the project's public
 * label (e.g. "Proje 06") — never internal notes, file names or unverified
 * facts. It asks for information; it never implies availability or sale.
 */
export function projectEnquiryMessage(publicLabel: string): string {
  const label = sanitizeMessage(publicLabel, 60);
  if (!label) return DEFAULT_WHATSAPP_MESSAGE;
  return `Merhaba, web sitenizdeki ${label} hakkında bilgi almak istiyorum.`;
}

/**
 * Google Maps "Maps URLs" (official, keyless, cross-platform) for an address.
 * Opens the Maps app on mobile and maps.google.com on desktop. No request is
 * made until the visitor follows the link.
 */
export function mapsDirectionsHref(destination: string): string {
  const url = new URL('https://www.google.com/maps/dir/');
  url.searchParams.set('api', '1');
  url.searchParams.set('destination', sanitizeMessage(destination, 200));
  return url.toString();
}
