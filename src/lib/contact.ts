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
