import type { Faq } from './content';

export type Segment = {
  slug: string;
  label: string;
  h1: string;
  sub: string;
  pains: string[];
  builds: { name: string; href: string; line: string }[];
  foundationHook: boolean;
  seoTitle: string;
  seoDesc: string;
};

export const segments: Segment[] = [
  {
    slug: 'churches',
    label: 'For Churches',
    h1: 'Technology that helps your church reach more people — with less stress.',
    sub: 'Websites, apps, online giving, chatbots and automation, built for ministry — free or subsidised where budgets are tight.',
    pains: ['An outdated website nobody can update', 'Giving that’s clunky or offline', 'New visitors falling through the cracks', 'Volunteers drowning in admin', 'No app — or a generic template one', 'AI that feels risky or off-limits'],
    builds: [
      { name: 'Websites', href: '/services/websites', line: 'Sermons, events, plan-your-visit and online giving — run it yourself.' },
      { name: 'Apps & custom software', href: '/services/web-mobile-apps', line: 'A branded church app: media, giving, check-in, push.' },
      { name: 'Chatbots', href: '/services/chatbots', line: 'A “new here?” bot that books a visit and answers questions.' },
      { name: 'AI agents', href: '/services/ai-agents', line: 'An admin copilot for scheduling, summaries and drafting.' },
      { name: 'Automation', href: '/services/automation', line: 'Connect your ChMS, email and giving so nothing slips.' },
    ],
    foundationHook: true,
    seoTitle: 'Church website & app developers',
    seoDesc: 'Websites, apps, online giving, chatbots and automation built for churches — free or subsidised where budgets are tight.',
  },
  {
    slug: 'ministries',
    label: 'For Ministries',
    h1: 'A platform for your mission — not another template site.',
    sub: 'Supporter platforms, automation, AI and websites for parachurch, missions, campus and media ministries.',
    pains: ['Running on spreadsheets and goodwill', 'Supporters scattered across tools', 'Content and media you can’t keep up with', 'Manual reporting eating your week', 'You need a platform, not a template'],
    builds: [
      { name: 'Apps & platforms', href: '/services/web-mobile-apps', line: 'Supporter platforms, portals and event systems.' },
      { name: 'Automation', href: '/services/automation', line: 'Sync your CRM, email and giving; auto-build reports.' },
      { name: 'AI agents', href: '/services/ai-agents', line: 'Research, drafting and admin, handled 24/7.' },
      { name: 'Websites', href: '/services/websites', line: 'Multilingual, media-rich sites that convert supporters.' },
    ],
    foundationHook: true,
    seoTitle: 'Software, CRM & automation for ministries',
    seoDesc: 'Supporter platforms, automation, AI and websites for parachurch, missions, campus and media ministries.',
  },
  {
    slug: 'nonprofits',
    label: 'For Christian-run businesses',
    h1: 'Software that works as hard as you do — from a team that shares your values.',
    sub: 'Websites, custom tools, automation and AI for Christian-owned businesses that want to build with excellence and integrity.',
    pains: ['Off-the-shelf tools that don’t quite fit', 'Manual admin stealing time from real work', 'A website that undersells what you do', 'You want AI, done responsibly and well', 'Agencies that don’t share your values'],
    builds: [
      { name: 'Websites', href: '/services/websites', line: 'Sites that win trust and bring in customers.' },
      { name: 'Custom software', href: '/services/custom-software', line: 'Internal tools and platforms that fit how you work.' },
      { name: 'Automation', href: '/services/automation', line: 'Automate the busywork capping your growth.' },
      { name: 'AI agents', href: '/services/ai-agents', line: 'Copilots and assistants that do real work, 24/7.' },
    ],
    foundationHook: false,
    seoTitle: 'Software & websites for Christian-owned businesses',
    seoDesc: 'Websites, custom software, automation and AI for Christian-run businesses — built with excellence by a studio that shares your values.',
  },
  {
    slug: 'business',
    label: 'For Christian Startups',
    h1: 'From idea to launched product — fast, senior, and AI-native.',
    sub: 'Custom software, apps, AI and automation for Christian founders building something ambitious.',
    pains: ['An idea but no technical partner', 'You need an MVP fast, done right', 'You want AI in your product, done responsibly', 'Manual ops capping your growth', 'Agencies that are slow and template-y'],
    builds: [
      { name: 'Custom software', href: '/services/custom-software', line: 'Bespoke platforms, APIs and MVPs, built to scale.' },
      { name: 'Apps & software', href: '/services/web-mobile-apps', line: 'SaaS, portals and mobile apps that grow with you.' },
      { name: 'AI agents', href: '/services/ai-agents', line: 'Copilots and customer-service agents that do real work.' },
      { name: 'Automation', href: '/services/automation', line: 'Automate the manual work slowing you down.' },
    ],
    foundationHook: false,
    seoTitle: 'MVP, app & AI development for Christian startups',
    seoDesc: 'Custom software, apps, AI agents and automation for Christian founders and startups. Senior, fast, AI-native.',
  },
];

export const segmentBySlug = (slug: string) => segments.find((s) => s.slug === slug);

export const faqCategories: { category: string; items: Faq[] }[] = [
  {
    category: 'Working with us',
    items: [
      { q: 'How do we get started?', a: 'Apply for a build. We read every application, and if it\'s a fit we\'ll reach out with a clear next step — no obligation.' },
      { q: 'Do you work remotely?', a: 'Yes — we work with churches, ministries and businesses anywhere, across South Africa and beyond.' },
      { q: 'How long does a project take?', a: 'Often weeks rather than months — we scope it precisely once we start.' },
      { q: 'Who will we work with?', a: 'A small, senior team — the people building your software, not a junior hand-off.' },
    ],
  },
  {
    category: 'Pricing & ownership',
    items: [
      { q: 'How do you price?', a: 'Every project is scoped together once you apply, so you only pay for what you need — no off-the-shelf price tags.' },
      { q: 'Do I own the code and design?', a: 'Yes — the code and the design are yours.' },
      { q: 'What shapes the cost?', a: 'Scope, complexity and how custom it is. We’re honest about the drivers up front.' },
      { q: 'Is the church work really free?', a: 'For under-resourced churches, the Foundation builds free or subsidised — funded by our paid work and donations.' },
    ],
  },
  {
    category: 'AI',
    items: [
      { q: 'How do you use AI?', a: 'To build faster and to a higher standard — and we build AI features (agents, chatbots, assistants) into your product.' },
      { q: 'Will an AI chatbot make things up about us?', a: 'No — it’s grounded in your content and won’t answer beyond it, with human oversight.' },
      { q: 'Is our data safe?', a: 'Yes — your data stays yours and isn’t used to train models.' },
      { q: '“Built with Claude” — what does that mean?', a: 'We build on Anthropic’s Claude, a leading and safety-focused AI model.' },
    ],
  },
  {
    category: 'The Foundation',
    items: [
      { q: 'Is the free build really free?', a: 'Yes — for churches and ministries that qualify. No catch.' },
      { q: 'Who qualifies?', a: 'Under-resourced churches, ministries and Christian nonprofits with a clear need and willingness to partner.' },
      { q: 'How is it funded?', a: 'Our paid client work, multiplied by AI leverage, plus donations and sponsorships.' },
      { q: 'Is CrossCoders a charity or a business?', a: 'Both — a commercial studio whose work funds a non-profit Foundation arm.' },
    ],
  },
  {
    category: 'Technical',
    items: [
      { q: 'What do you build with?', a: 'Modern, dependable tools — TypeScript throughout, fast frameworks, and leading AI models.' },
      { q: 'Can you fix or take over an existing build?', a: 'Often yes — we’ll assess it honestly first.' },
      { q: 'Do you handle hosting and domains?', a: 'Yes — we can set up and look after hosting, domains and email.' },
      { q: 'Is everything accessible and mobile-friendly?', a: 'Yes — accessible, fast and mobile-first by default.' },
    ],
  },
];
