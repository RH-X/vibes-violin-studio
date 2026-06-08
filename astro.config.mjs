import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.endsWith('/practice-pals/') &&
        page !== 'https://vibesviolinstudio.vercel.app/insights/',
    }),
  ],
  site: 'https://vibesviolinstudio.vercel.app',
});
