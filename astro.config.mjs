import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Live domain — used for canonical URLs, sitemap and absolute OG image URLs.
  // Switch this to https://crosscoders.co.za once that custom domain is live.
  site: 'https://crosscoders.pages.dev',
  integrations: [sitemap({ filter: (page) => !page.includes('/fund') })],
});
