import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  trailingSlash: 'never',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.includes('/practice-pals/beta') &&
        !page.includes('/creative-mornings-kickstart'),
    }),
  ],
  site: 'https://www.vibesviolin.studio',
});
