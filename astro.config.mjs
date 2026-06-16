import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://crosscoders.dev',
  integrations: [sitemap({ filter: (page) => !page.includes('/fund') })],
});
