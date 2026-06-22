export const brand = {
  name: 'CrossCoders',
  org: 'Kingdom Come Foundation',
  tagline: 'Software worth believing in.',
  ethos: 'Christ, code & coffee.',
  email: 'daniel@crosscoders.co.za',
  ccEmail: 'darren@crosscoders.co.za',
  contactHref: 'mailto:daniel@crosscoders.co.za?cc=darren@crosscoders.co.za',
  verse: '“Whatever you do, work at it with all your heart.” — Colossians 3:23',
  builtWith: 'Claude',
  description:
    'A Christian software studio building apps, websites, AI agents and automation for churches, ministries and mission-driven organisations.',
};

export const nav = [
  { label: 'What we build', href: '/services' },
  { label: 'Our approach', href: '/ai' },
  { label: 'Work', href: '/work' },
  { label: 'Foundation', href: '/foundation' },
];

export const ctas = {
  primary: { label: 'Apply for a build', href: '/foundation/apply' },
  secondary: { label: 'See our work', href: '/work' },
  fund: { label: 'Fuel a build', href: '/give' },
};

// Impact meter config — figures are ILLUSTRATIVE until real build costs are set.
// `current` is the real amount raised (0 at launch = pledge mode → "be the first").
export const give = {
  goal: 30000,
  current: 0,
  costPerBuild: 10000,
  peoplePerBuild: 120,
  illustrative: true,
  tiers: [
    { amount: 10000, label: '1 church' },
    { amount: 20000, label: '2 churches' },
    { amount: 30000, label: '3 · goal' },
  ],
};

export type Faq = { q: string; a: string };
export type Step = { t: string; d: string };

export type Product = {
  slug: string;
  name: string;
  blurb: string; // home/footer card
  icon: string;
  eyebrow: string;
  h1: string;
  sub: string;
  intro: string; // "what it is"
  capabilities: string[];
  useCasesMinistry: string[];
  useCasesBusiness: string[];
  steps: Step[];
  aiAngle: string;
  outcomes: string[];
  faq: Faq[];
  related: string[];
  seoTitle: string;
  seoDesc: string;
};

export const products: Product[] = [
  {
    slug: 'web-mobile-apps',
    name: 'Apps & custom software',
    blurb: 'Web and mobile apps, platforms, member systems and internal tools — built around exactly how you work.',
    icon: 'app',
    eyebrow: 'Web · iOS · Android',
    h1: 'Software built around exactly how you work.',
    sub: 'Web and mobile apps, platforms, portals and internal tools — one build, every screen.',
    intro:
      'Custom applications — web and mobile — that fit your organisation exactly, instead of forcing you into someone else’s template. Member platforms, booking systems, donor tools, internal dashboards, native apps.',
    capabilities: ['Member & community platforms', 'Booking & event systems', 'Donor / CRM tools', 'Admin dashboards & internal tools', 'Native iOS & Android apps', 'Member & customer portals'],
    useCasesMinistry: ['A branded church app — sermons, events, giving, push', 'Check-in & volunteer scheduling', 'A donor CRM that fits your team', 'A small-groups finder & member directory'],
    useCasesBusiness: ['A customer or member portal', 'An operations dashboard', 'A field-team mobile app', 'An MVP for a SaaS idea'],
    steps: [{ t: 'Map it', d: 'We learn exactly how you work, then design around it.' }, { t: 'Design', d: 'You see the screens before we build a thing.' }, { t: 'Build', d: 'Engineered in TypeScript, tested, senior-reviewed.' }, { t: 'Launch & care', d: 'Live, your team trained, and supported after.' }],
    aiAngle: 'AI speeds the build — and we bake it into the product: smart search, recommendations and in-app assistants that make it feel effortless.',
    outcomes: ['Software that fits, instead of one you fight', 'Manual work and spreadsheets gone', 'One system your whole team uses', 'Grows with you'],
    faq: [{ q: 'Web app or native mobile?', a: 'We’ll advise — often a fast web app first, native where it earns its place.' }, { q: 'Can it replace our spreadsheets and tools?', a: 'That’s usually the point — one system that fits how you actually work.' }, { q: 'How long does it take?', a: 'Weeks, not months — we scope it precisely once we start.' }, { q: 'Do we own it?', a: 'Yes — the code and the design are yours.' }],
    related: ['custom-software', 'automation', 'ai-agents'],
    seoTitle: 'Web & mobile app development for churches, ministries & business',
    seoDesc: 'Custom web and mobile apps, platforms, portals and internal tools — built around exactly how you work, for mission-driven teams and business.',
  },
  {
    slug: 'websites',
    name: 'Websites',
    blurb: 'Fast, beautiful sites with media, events, online giving and a CMS your team can run in minutes.',
    icon: 'web',
    eyebrow: 'Websites & CMS',
    h1: 'A website you can run yourself — built beautifully.',
    sub: 'Fast, modern sites with media, events, online giving and a CMS your team can edit in minutes.',
    intro:
      'Beautiful, fast websites that help more people find you and get involved — with everything a church, ministry or business needs, and a content system your own team can run without a developer.',
    capabilities: ['Church sites — sermons, events, plan-your-visit', 'Online giving & donations', 'A CMS your team edits in minutes', 'Multilingual & accessible', 'SEO foundations & fast loading', 'Landing pages & microsites'],
    useCasesMinistry: ['A full church website with giving & media', 'A campaign or event microsite', 'A donations landing page', 'A multilingual mission site'],
    useCasesBusiness: ['A marketing site that ranks on Google', 'A lead-capture service site', 'A product launch landing page', 'A brand or portfolio site'],
    steps: [{ t: 'Shape it', d: 'Content, structure and a look that’s unmistakably you.' }, { t: 'Design', d: 'See the direction before we build.' }, { t: 'Build', d: 'Fast, accessible, and built so Google can find you.' }, { t: 'Launch & care', d: 'Go live, train your team, and we look after it.' }],
    aiAngle: 'AI-assisted content and copy, smart on-site search, an optional grounded chat assistant — and a faster build, so you launch sooner.',
    outcomes: ['More people find you', 'More people get involved and give', 'Update it yourself in minutes', 'Loads instantly, everywhere'],
    faq: [{ q: 'Can we edit it ourselves?', a: 'Yes — a friendly CMS lets your team update content in minutes.' }, { q: 'Can it take online giving?', a: 'Absolutely — giving, events and media are core to a church build.' }, { q: 'Will it rank on Google?', a: 'We build SEO foundations in from day one and it loads fast.' }, { q: 'Can you move our existing site?', a: 'Yes — we migrate content and set up redirects cleanly.' }],
    related: ['chatbots', 'web-mobile-apps', 'automation'],
    seoTitle: 'Website design & development for churches, ministries & business',
    seoDesc: 'Fast, beautiful websites with media, events, online giving and a self-editable CMS — for churches, ministries and mission-driven businesses.',
  },
  {
    slug: 'ai-agents',
    name: 'AI agents',
    blurb: 'Grounded assistants that do the work — answer questions, handle admin and run 24/7.',
    icon: 'agent',
    eyebrow: 'AI that does the work',
    h1: 'AI that does the work — not just chats.',
    sub: 'Autonomous, grounded assistants that handle multi-step tasks, on your content, with human oversight.',
    intro:
      'An AI agent does real work — not just answers. Grounded in your own content, connected to your tools, and guardrailed, it triages, drafts, schedules and reports — so your small team gets its time back.',
    capabilities: ['Ministry assistants grounded in your content', 'Admin agents — scheduling, summarising, drafting', 'Research & data-entry agents', 'Customer-service agents with escalation', 'Built on Claude, grounded with your data (RAG)', 'Human-in-the-loop approvals'],
    useCasesMinistry: ['Triage overnight prayer requests & draft replies', 'A “ministry brain” over your handbook & docs', 'Turn a sermon into a newsletter draft', 'Keep your ChMS tidy automatically'],
    useCasesBusiness: ['A support agent grounded in your knowledge base', 'A sales-research agent', 'An internal “copilot” for your team', 'An automated reporting agent'],
    steps: [{ t: 'Ground it', d: 'We connect it to your real content and tools.' }, { t: 'Guardrail it', d: 'Rules, limits and human approval where it matters.' }, { t: 'Build', d: 'On leading models like Claude, tested for accuracy.' }, { t: 'Launch & watch', d: 'Live, monitored, and improving over time.' }],
    aiAngle: 'This is the AI product. We obsess over grounding (it answers from your content, not thin air), safety, and human oversight — so it’s trustworthy in a ministry context.',
    outcomes: ['24/7 capacity', 'Your team freed from busywork', 'Scale without extra hires', 'On-brand, and improving over time'],
    faq: [{ q: 'What’s the difference from a chatbot?', a: 'A chatbot converses; an agent acts — it completes multi-step tasks.' }, { q: 'Will it make things up?', a: 'It’s grounded in your content (RAG) and guardrailed, with human oversight.' }, { q: 'Is our data safe?', a: 'Yes — your data stays yours and isn’t used to train models.' }, { q: 'Can it connect to our ChMS / CRM?', a: 'Yes — agents can read and act in the tools you already use.' }],
    related: ['chatbots', 'automation', 'custom-software'],
    seoTitle: 'Custom AI agents for churches, ministries & business',
    seoDesc: 'Grounded, guardrailed AI agents that do real work — built on Claude, on your content, with human oversight. For mission-driven teams and business.',
  },
  {
    slug: 'chatbots',
    name: 'Chatbots',
    blurb: 'Accurate, on-brand assistants for your site and socials, with a human hand-off when it matters.',
    icon: 'chat',
    eyebrow: 'Conversational AI',
    h1: 'Answers in seconds — accurate, on-brand, always on.',
    sub: 'Assistants for your website, app and socials — grounded in your content, in your tone, with a human hand-off.',
    intro:
      'A chatbot is the friendly front door. Grounded in your own content so it’s accurate (not inventive), tuned to your voice, available 24/7, and ready to hand off to a real person when it matters.',
    capabilities: ['Website chat grounded in your content', '“New here?” & plan-your-visit bots', 'Giving & donation helpers', 'WhatsApp / Messenger / Instagram', 'Lead capture & qualification', 'Smart escalation to a human'],
    useCasesMinistry: ['A “new here?” bot that books a visit', 'A giving helper that answers questions', 'An after-hours FAQ & prayer intake bot', 'A congregation WhatsApp assistant'],
    useCasesBusiness: ['A support bot that deflects repeat tickets', 'A lead-capture bot on your site', 'A WhatsApp sales assistant', 'A multilingual storefront helper'],
    steps: [{ t: 'Train it', d: 'Grounded in your real content and FAQs.' }, { t: 'Voice it', d: 'Tuned to your tone — warm, accurate, on-brand.' }, { t: 'Connect it', d: 'On your site, app or socials, with hand-off.' }, { t: 'Launch & tune', d: 'Live, monitored, and improved from real chats.' }],
    aiAngle: 'Grounding is the whole point — it answers from your content, so it’s accurate and trustworthy. That’s exactly what reassures AI-wary teams.',
    outcomes: ['Instant 24/7 answers', 'More visitors connected and captured', 'Fewer repetitive questions for your team', 'A warm first touch'],
    faq: [{ q: 'Will it make things up about us?', a: 'No — it’s grounded in your content and won’t answer beyond it.' }, { q: 'Where can it live?', a: 'Your website, app, WhatsApp, Messenger or Instagram.' }, { q: 'Can a human take over?', a: 'Yes — it escalates to a person whenever needed.' }, { q: 'How is it different from an agent?', a: 'A chatbot converses; an agent completes tasks. We build both.' }],
    related: ['ai-agents', 'websites', 'automation'],
    seoTitle: 'AI chatbots for churches, ministries & business',
    seoDesc: 'Accurate, on-brand, grounded chatbots for your website, app and socials — with human hand-off. For churches, ministries and business.',
  },
  {
    slug: 'automation',
    name: 'Automation & integrations',
    blurb: 'Connect your tools and automate the manual work, so your team spends its time on the mission.',
    icon: 'auto',
    eyebrow: 'Automation & integrations',
    h1: 'Your tools, finally talking to each other.',
    sub: 'Connect your systems and automate the manual work — and get hours back every week.',
    intro:
      'Stop copying data between tools by hand. We connect your systems and automate the repetitive work — onboarding, follow-ups, syncing, reporting — so nothing slips and your team spends its time on the mission.',
    capabilities: ['Connect ChMS / CRM / email / giving / accounting', 'Onboarding & follow-up automations', 'Two-way data sync between tools', 'Live reporting dashboards', 'AI-powered steps (summarise, classify, route)', 'Scheduled jobs, alerts & monitoring'],
    useCasesMinistry: ['Auto-welcome new people who fill in a connect card', 'Giving → CRM → receipt, automatically', 'A leadership dashboard that builds itself', 'Volunteer reminders that just happen'],
    useCasesBusiness: ['Lead → CRM → assign & notify', 'Sync orders, accounting and fulfilment', 'A weekly KPI report, automatically', 'SaaS-to-SaaS data sync'],
    steps: [{ t: 'Map it', d: 'We map the manual process you want gone.' }, { t: 'Design', d: 'Design the flow and the safeguards.' }, { t: 'Build', d: 'Connect your tools — Make/Zapier or custom.' }, { t: 'Monitor', d: 'Live, with alerts if anything needs a human.' }],
    aiAngle: 'Beyond simple rules — AI steps that understand, summarise, classify and decide: route by intent, summarise a thread into a task, draft the follow-up.',
    outcomes: ['Hours saved every week', 'Fewer manual errors', 'Nothing slips through the cracks', 'Systems that finally talk to each other'],
    faq: [{ q: 'Which tools can you connect?', a: 'Most popular ChMS, CRM, email, giving and accounting tools — and custom APIs.' }, { q: 'Zapier or custom?', a: 'Whichever fits — off-the-shelf where it’s enough, custom where it isn’t.' }, { q: 'What if a tool has no integration?', a: 'We can usually build one via its API.' }, { q: 'Is it reliable?', a: 'Yes — with monitoring and alerts so a human steps in if needed.' }],
    related: ['ai-agents', 'custom-software', 'web-mobile-apps'],
    seoTitle: 'Automation & software integrations for churches, ministries & business',
    seoDesc: 'Connect your tools and automate the manual work — onboarding, syncing, reporting — with AI-powered steps. For mission-driven teams and business.',
  },
  {
    slug: 'custom-software',
    name: 'Custom software',
    blurb: 'Bespoke platforms, APIs and systems — from a sketch to shipped, built exactly for you.',
    icon: 'code',
    eyebrow: 'Bespoke software',
    h1: 'If it can be built, we can build it.',
    sub: 'Bespoke platforms, data systems, APIs and MVPs — from a sketch to shipped.',
    intro:
      'The “anything else.” When your need doesn’t fit a box — a bespoke platform, a data system, an API, a startup MVP, or rescuing a stalled build — we’re the technical partner who can take it from a sketch to shipped.',
    capabilities: ['Custom platforms & data systems', 'APIs & integrations', 'Dashboards & internal tools', 'Startup MVPs & digital products', 'Technical consulting & architecture', 'Deeply-embedded AI'],
    useCasesMinistry: ['A denomination-wide, multi-congregation platform', 'A bespoke giving or grants system', 'A system that unifies scattered data', 'A reporting platform for a ministry network'],
    useCasesBusiness: ['An MVP from sketch to launch', 'A bespoke internal platform', 'A partner-facing API', 'Architecture consulting or a build rescue'],
    steps: [{ t: 'Scope it', d: 'We turn a fuzzy idea into a clear, costed plan.' }, { t: 'Prototype', d: 'A working proof in days, to de-risk fast.' }, { t: 'Build', d: 'Engineered to last, senior throughout.' }, { t: 'Launch & evolve', d: 'Shipped, then improved over time.' }],
    aiAngle: 'We use AI to prototype and build rapidly — idea to proof in days — and we can build AI deeply into whatever you’re making, not bolted on.',
    outcomes: ['A partner who can build anything', 'Ideas de-risked fast with prototypes', 'Architecture that lasts', 'Exactly what you need, nothing you don’t'],
    faq: [{ q: 'Our idea is unusual — can you build it?', a: 'Almost certainly — that’s exactly what this is for. Let’s scope it.' }, { q: 'Can you prototype first?', a: 'Yes — a fast working prototype is often the best first step.' }, { q: 'Can you take over an existing build?', a: 'Often yes — we’ll assess it honestly first.' }, { q: 'Do we own it?', a: 'Yes — the code and IP are yours.' }],
    related: ['web-mobile-apps', 'automation', 'ai-agents'],
    seoTitle: 'Custom software development & systems for churches, ministries & business',
    seoDesc: 'Bespoke platforms, data systems, APIs and MVPs — from a sketch to shipped, with deeply-embedded AI. For mission-driven teams and business.',
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

// ======================== THE QUEUE — churches in the pipeline ========================
// Public, consented list of approved builds people can read about and fund.
// Figures are ILLUSTRATIVE while the Foundation registers; real churches replace
// these seed entries once they've consented to be listed.
export const journey: { k: QueueStage | 'applied' | 'verified'; t: string; d: string }[] = [
  { k: 'applied', t: 'Applied', d: 'A church tells us what they need.' },
  { k: 'verified', t: 'Verified', d: 'We confirm a real, under-resourced ministry.' },
  { k: 'approved', t: 'Approved', d: 'Listed publicly as a funded project.' },
  { k: 'funding', t: 'Funding', d: 'Supporters pledge toward the build.' },
  { k: 'building', t: 'Building', d: 'We design, build and train the team.' },
  { k: 'shipped', t: 'Shipped', d: 'Live — and theirs to keep.' },
];

export const stageMeta: Record<QueueStage, { label: string; tone: string }> = {
  approved: { label: 'Approved', tone: 'brass' },
  funding: { label: 'Funding', tone: 'forest' },
  building: { label: 'In build', tone: 'forest' },
  shipped: { label: 'Shipped', tone: 'ink' },
};

export type QueueStage = 'approved' | 'funding' | 'building' | 'shipped';
export type QueueChurch = {
  slug: string;
  name: string;
  kind: string; // Church / Ministry / Christian nonprofit
  region: string;
  art: string; // ChurchArt illustration kind
  image?: string; // optional real photo (overrides illustration)
  stage: QueueStage;
  tagline: string;
  need: string[];
  goal: number; // Rand to fund the build
  raised: number; // pledged so far (illustrative)
  story: string[];
  outcome: string;
};

export const queue: QueueChurch[] = [
  {
    slug: 'grace-chapel',
    name: 'Grace Chapel',
    kind: 'Church',
    region: 'Mdantsane, Eastern Cape',
    art: 'steeple',
    stage: 'building',
    tagline: 'A 300-strong township church with no way to be found online.',
    need: ['Website with sermons & events', 'Online giving', 'A “plan your visit” page'],
    goal: 2500,
    raised: 1850,
    story: [
      'Grace Chapel has served Mdantsane for over twenty years, but until now you couldn’t find them anywhere online — no website, no way to give, no way for a newcomer to know when services start.',
      'Their pastor runs everything from a personal phone. Every week, visitors who searched for “church near me” simply never found them.',
      'We’re building Grace a fast, beautiful site they can run themselves — sermons, events, and online giving — so the next person looking for a church home actually finds one.',
    ],
    outcome: 'Found on Google, giving online, and a team that can update it all themselves.',
  },
  {
    slug: 'hope-community',
    name: 'Hope Community Church',
    kind: 'Church',
    region: 'Khayelitsha, Western Cape',
    art: 'modern',
    stage: 'funding',
    tagline: 'A growing congregation that lives on WhatsApp and needs a real home.',
    need: ['A branded church app', 'Push notifications & events', 'Check-in for kids & volunteers'],
    goal: 4000,
    raised: 980,
    story: [
      'Hope Community has grown faster than its admin can keep up. Announcements, rosters and prayer requests all live in a tangle of WhatsApp groups.',
      'They need a single home: a simple app for their people, with events, giving, and safe check-in for children and volunteers.',
      'Fund this build and you give an overstretched team their evenings back — and give their congregation one place that just works.',
    ],
    outcome: 'One app for the whole church — events, giving and check-in, instead of fifteen WhatsApp groups.',
  },
  {
    slug: 'lighthouse-youth',
    name: 'Lighthouse Youth',
    kind: 'Youth ministry',
    region: 'Soweto, Gauteng',
    art: 'lighthouse',
    stage: 'approved',
    tagline: 'A youth ministry turning hundreds away because sign-ups are chaos.',
    need: ['Event & camp sign-ups', 'A simple website', 'An after-hours questions chatbot'],
    goal: 3000,
    raised: 0,
    story: [
      'Lighthouse runs camps and outreach for hundreds of young people across Soweto — and every event sign-up is a paper-and-pen scramble that loses kids in the gaps.',
      'They’ve just been approved as a funded project. They need online sign-ups, a site parents trust, and a chatbot to answer the after-hours questions that flood their leaders’ phones.',
      'Be the first to pledge toward Lighthouse and help get this build funded.',
    ],
    outcome: 'Every young person signed up in seconds — and no leader answering DMs at midnight.',
  },
  {
    slug: 'new-life-mission',
    name: 'New Life Mission',
    kind: 'Christian nonprofit',
    region: 'Polokwane, Limpopo',
    art: 'hands',
    stage: 'funding',
    tagline: 'A feeding-and-discipleship mission drowning in spreadsheets.',
    need: ['A donor & supporter platform', 'Automated thank-yous & receipts', 'Impact reporting'],
    goal: 6000,
    raised: 2200,
    story: [
      'New Life feeds and disciples families across Limpopo, funded entirely by a faithful base of small donors — tracked, painfully, in a dozen spreadsheets.',
      'They lose hours every week to manual receipts and reporting, and donors rarely hear what their giving achieved.',
      'This build gives them a proper supporter platform with automated receipts and impact reports — so they can spend their time on people, not paperwork.',
    ],
    outcome: 'Hours back every week, donors who feel the impact, and reporting that builds itself.',
  },
  {
    slug: 'cornerstone-fellowship',
    name: 'Cornerstone Fellowship',
    kind: 'Church',
    region: 'Pietermaritzburg, KwaZulu-Natal',
    art: 'chapel',
    stage: 'shipped',
    tagline: 'Our first free build — live, and theirs to keep.',
    need: ['Website with media & giving', 'Self-serve CMS', 'SEO foundations'],
    goal: 2500,
    raised: 2500,
    story: [
      'Cornerstone was the proof that this works. A small fellowship with a big heart and a budget that never stretched to a website.',
      'In a matter of weeks we built and launched their site — sermons, events and online giving — and trained their team to run it themselves.',
      'It’s live today, fully funded by supporters like you. This is what every funded project here becomes.',
    ],
    outcome: 'Live, found, giving online — and run entirely by their own team.',
  },
];

export const queueBySlug = (slug: string) => queue.find((c) => c.slug === slug);
