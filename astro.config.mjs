import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) =>
        !page.includes('/practice-pals/beta') &&
        !page.endsWith('/practice-pals/') &&
        page !== 'https://vibesviolinstudio.vercel.app/insights/',
    }),
  ],
  site: 'https://vibesviolinstudio.vercel.app',
});
