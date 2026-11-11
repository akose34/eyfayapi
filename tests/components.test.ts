/**
 * Renders the shared UI components with Astro's Container API and asserts
 * their semantic/accessibility contracts (not their visual styling).
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Breadcrumbs from '@/components/Breadcrumbs.astro';
import Button from '@/components/Button.astro';
import ContactCTA from '@/components/ContactCTA.astro';
import ContactLinks from '@/components/ContactLinks.astro';
import Divider from '@/components/Divider.astro';
import EmptyState from '@/components/EmptyState.astro';
import Eyebrow from '@/components/Eyebrow.astro';
import IconButton from '@/components/IconButton.astro';
import Section from '@/components/Section.astro';
import SectionHeading from '@/components/SectionHeading.astro';
import StageNotice from '@/components/StageNotice.astro';
import TextLink from '@/components/TextLink.astro';
import { company } from '@/data/company';
import { DEFAULT_WHATSAPP_MESSAGE } from '@/lib/contact';

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (component: Parameters<AstroContainer['renderToString']>[0], options = {}) =>
  container.renderToString(component, options);

describe('Button', () => {
  it('renders a link when href is given', async () => {
    const html = await render(Button, {
      props: { href: '/projeler/' },
      slots: { default: 'Projeler' },
    });
    expect(html).toMatch(/^<a[^>]+href="\/projeler\/"/);
    expect(html).not.toContain('<button');
  });

  it('renders a type="button" button otherwise, and supports disabled', async () => {
    const html = await render(Button, { props: { disabled: true }, slots: { default: 'Gönder' } });
    expect(html).toMatch(/<button[^>]+type="button"/);
    expect(html).toMatch(/<button[^>]+disabled/);
  });

  it('marks external links safely and announces the new tab', async () => {
    const html = await render(Button, {
      props: { href: 'https://wa.me/905326868829', external: true },
      slots: { default: 'WhatsApp' },
    });
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('(yeni sekmede açılır)');
  });

  it('keeps icons decorative', async () => {
    const html = await render(Button, {
      props: { href: '/', icon: 'arrow-right' },
      slots: { default: 'Git' },
    });
    expect(html).toMatch(/<svg[^>]+aria-hidden="true"/);
  });

  it('passes through ARIA attributes', async () => {
    const html = await render(Button, {
      props: { href: '/iletisim/', 'aria-current': 'page' },
      slots: { default: 'İletişim' },
    });
    expect(html).toContain('aria-current="page"');
  });
});

describe('IconButton', () => {
  it('requires and exposes an accessible name', async () => {
    const html = await render(IconButton, { props: { icon: 'menu', label: 'Menüyü aç' } });
    expect(html).toMatch(/<button[^>]+aria-label="Menüyü aç"/);
    expect(html).toContain('size-11'); // 44×44 px target
  });
});

describe('TextLink', () => {
  it('renders an arrow link; external variant announces the new tab', async () => {
    const internal = await render(TextLink, {
      props: { href: '/projeler/' },
      slots: { default: 'Tümü' },
    });
    expect(internal).toContain('href="/projeler/"');
    const external = await render(TextLink, {
      props: { href: 'https://www.instagram.com/eyfa.yapi/', external: true },
      slots: { default: 'Instagram' },
    });
    expect(external).toContain('rel="noopener noreferrer"');
    expect(external).toContain('(yeni sekmede açılır)');
  });
});

describe('Breadcrumbs', () => {
  it('prefixes Ana Sayfa, marks the current page and emits BreadcrumbList JSON-LD', async () => {
    const html = await render(Breadcrumbs, {
      props: { items: [{ label: 'Projeler', href: '/projeler/' }, { label: 'Proje 01' }] },
      request: new Request('https://eyfayapi.net/projeler/proje-01/'),
    });
    expect(html).toContain('aria-label="Sayfa konumu"');
    expect(html).toMatch(/<a[^>]+href="\/"[^>]*>Ana Sayfa<\/a>/);
    expect(html).toMatch(/aria-current="page"[^>]*>Proje 01/);
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).toContain('"position":3');
  });
});

describe('SectionHeading', () => {
  it('renders the requested heading level with id', async () => {
    const h1 = await render(SectionHeading, {
      props: { title: 'Projelerimiz', level: 'h1', id: 'x' },
    });
    expect(h1).toMatch(/<h1[^>]+id="x"[^>]*>Projelerimiz<\/h1>/);
    const h2 = await render(SectionHeading, { props: { title: 'Hizmetler', eyebrow: 'Uzmanlık' } });
    expect(h2).toMatch(/<h2[^>]*>Hizmetler<\/h2>/);
    expect(h2).toContain('Uzmanlık');
  });
});

describe('Section', () => {
  it('applies the dark tone and names the region', async () => {
    const html = await render(Section, {
      props: { tone: 'dark', labelledby: 'baslik' },
      slots: { default: 'x' },
    });
    expect(html).toMatch(/<section[^>]+aria-labelledby="baslik"/);
    expect(html).toContain('tone-dark');
  });
});

describe('Utility components', () => {
  it('Eyebrow hides its decorative rule', async () => {
    expect(await render(Eyebrow, { slots: { default: 'Kurumsal' } })).toContain(
      'aria-hidden="true"',
    );
  });

  it('Divider renders an <hr>', async () => {
    expect(await render(Divider, { props: { variant: 'accent' } })).toContain('<hr');
  });

  it('EmptyState and StageNotice render their text', async () => {
    expect(await render(EmptyState, { props: { title: 'Sonuç yok' } })).toContain('Sonuç yok');
    const notice = await render(StageNotice, {
      props: { title: 'Onay bekliyor' },
      slots: { default: 'Not' },
    });
    expect(notice).toContain('aria-label="Hazırlık notu"');
  });
});

describe('Contact components use only verified company data', () => {
  it('ContactLinks lists every verified channel with working hrefs', async () => {
    const html = await render(ContactLinks, { props: { address: true } });
    for (const phone of company.phones) {
      expect(html).toContain(`href="tel:${phone.e164}"`);
      expect(html).toContain(phone.display);
    }
    // Stage 6: the WhatsApp link carries the polite default message.
    expect(html).toContain(
      `href="https://wa.me/${company.whatsapp.e164.slice(1)}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}"`,
    );
    expect(html).toContain(`href="mailto:${company.email}"`);
    expect(html).toContain(company.social[0].url);
    expect(html).toContain(company.address.street);
  });

  it('ContactCTA links to WhatsApp, phone and e-mail', async () => {
    const html = await render(ContactCTA);
    expect(html).toContain('https://wa.me/905326868829');
    expect(html).toContain('tel:+905326868829');
    expect(html).toContain('mailto:info@eyfayapi.net');
    expect(html).toMatch(/<h2[^>]+id="iletisim-cta"/);
  });
});
