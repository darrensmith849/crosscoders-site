export const sidePreviews = [
  {
    slug: 'vault-commerce',
    name: 'Vault Commerce',
    tag: 'Collector commerce',
    bestFor: 'collectors, rare goods, verified inventory, private drops',
    description: 'A dark, system-like commerce preview built around rarity, authentication and private sourcing.',
    className: 'vault',
  },
  {
    slug: 'spatial-rise',
    name: 'Spatial Rise',
    tag: 'Property / place',
    bestFor: 'property, hospitality, venues, developments, destinations',
    description: 'A cinematic place-story preview for destination launches, architecture and enquiry conversion.',
    className: 'spatial',
  },
  {
    slug: 'editorial-practice',
    name: 'Editorial Practice',
    tag: 'Professional practice',
    bestFor: 'consultants, studios, experts, architecture, advisory firms',
    description: 'A restrained, text-led preview for expert practices that sell judgement, process and trust.',
    className: 'editorial',
  },
];

export const sidePreviewNav = [
  { href: '/template-previews', label: 'Gallery' },
  ...sidePreviews.map((preview) => ({
    href: `/template-previews/${preview.slug}`,
    label: preview.name,
  })),
];
