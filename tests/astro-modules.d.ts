/**
 * Plain `tsc` (npm run typecheck) cannot resolve `.astro` files — only the
 * Astro language server (`astro check`) can, and it type-checks them fully.
 * This ambient fallback lets `tsc` accept `.astro` imports in tests; it is
 * ignored wherever the real module resolves. The type is taken from the
 * Container API, which is exactly how the tests consume components.
 */
declare module '*.astro' {
  import type { experimental_AstroContainer } from 'astro/container';

  type ContainerComponent = Parameters<experimental_AstroContainer['renderToString']>[0];
  const Component: ContainerComponent;
  export default Component;
}
