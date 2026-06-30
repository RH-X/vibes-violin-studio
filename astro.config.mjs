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
        !page.includes('/violin-kickstart') &&
        // "Can You Learn Violin Online?" is drafted ahead of a Thursday publish —
        // remove this line when launching (see POST_LAUNCHED in
        // src/pages/insights/can-you-learn-violin-online.astro).
        !page.includes('/can-you-learn-violin-online'),
    }),
  ],
  site: 'https://vibesviolin.studio',
});
