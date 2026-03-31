import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.includes('/practice-pals') && !page.includes('/insights'),
    }),
  ],
  site: 'https://vibesviolinstudio.com',
});
