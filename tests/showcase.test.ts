import { describe, expect, it, vi } from 'vitest';
import config, { DEV_SHOWCASE_ROUTE } from '../astro.config';

/** Runs the showcase integration's setup hook for a given CLI command. */
function injectedRoutesFor(command: 'dev' | 'build' | 'preview') {
  const injectRoute = vi.fn();
  const integration = config.integrations?.find(
    (i) => i && typeof i === 'object' && 'name' in i && i.name === 'eyfa-dev-showcase',
  );
  if (!integration || !('hooks' in integration)) throw new Error('showcase integration missing');
  const hook = integration.hooks['astro:config:setup'] as unknown as (o: {
    command: string;
    injectRoute: typeof injectRoute;
  }) => void;
  hook({ command, injectRoute });
  return injectRoute.mock.calls;
}

describe('design-system showcase', () => {
  it('is injected for `astro dev`', () => {
    const calls = injectedRoutesFor('dev');
    expect(calls).toHaveLength(1);
    expect(calls[0]?.[0]).toMatchObject({ pattern: DEV_SHOWCASE_ROUTE });
  });

  it('is never injected for production builds or preview', () => {
    expect(injectedRoutesFor('build')).toHaveLength(0);
    expect(injectedRoutesFor('preview')).toHaveLength(0);
  });

  it('does not live in src/pages (cannot become a route by accident)', async () => {
    const { existsSync } = await import('node:fs');
    expect(existsSync(new URL('../src/pages/dev', import.meta.url))).toBe(false);
    expect(existsSync(new URL('../src/dev/DesignSystem.astro', import.meta.url))).toBe(true);
  });
});
