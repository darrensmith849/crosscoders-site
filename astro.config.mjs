import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Live domain — used for canonical URLs, sitemap and absolute OG image URLs.
  site: 'https://crosscoders.co.za',
  integrations: [sitemap({ filter: (page) => !page.includes('/fund') })],
});
