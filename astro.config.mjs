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
        // Violin Kickstart is hidden/prelaunch — remove this line when launching
        // (see VIOLIN_KICKSTART_LAUNCHED in src/pages/violin-kickstart.astro).
        !page.includes('/violin-kickstart'),
    }),
  ],
  site: 'https://vibesviolin.studio',
});
