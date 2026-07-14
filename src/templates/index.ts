export const templateCards = [
  {
    slug: 'product-signal',
    name: 'Product Signal',
    bestFor: 'Consumer products, gear, ecommerce',
    description: 'A focused product system for precision brands that need specs, range cards and premium conversion flow.',
    tag: 'Product / Ecommerce',
    className: 'ps',
  },
  {
    slug: 'spatial-rise',
    name: 'Spatial Rise',
    bestFor: 'Property, hospitality, venues, destinations',
    description: 'A cinematic spatial narrative for places, developments and destinations that sell atmosphere.',
    tag: 'Property / Place',
    className: 'sr',
  },
  {
    slug: 'editorial-practice',
    name: 'Editorial Practice',
    bestFor: 'Studios, consultants, architecture, experts',
    description: 'A refined editorial practice template for expert-led firms with case studies, services and consultation flow.',
    tag: 'Professional Services',
    className: 'ep',
  },
  {
    slug: 'vault-commerce',
    name: 'Vault Commerce',
    bestFor: 'Collectors, rare goods, boutique ecommerce',
    description: 'A high-contrast commerce system for verified inventory, private drops and collector services.',
    tag: 'Collector Commerce',
    className: 'vc',
  },
  {
    slug: 'mission-control',
    name: 'Mission Control',
    bestFor: 'SaaS, dashboards, AI tools, platforms',
    description: 'A clean product-led SaaS template built around dashboard proof, workflows, integrations and demo conversion.',
    tag: 'SaaS / Platform',
    className: 'mc',
  },
];

export const templateNav = [
  { href: '/templates', label: 'Gallery' },
  ...templateCards.map((template) => ({
    href: `/templates/${template.slug}`,
    label: template.name,
  })),
];
