/**
 * ThunSpark Master Website Constants (Guide v1.2 Verbatim)
 * Centralized content repository and static fallback data.
 */

export const HERO_COPY = {
  eyebrow: "DIGITAL GROWTH AGENCY",
  h1Prefix: "We turn growth bottlenecks into ",
  rotatingSlots: ["breakthroughs.", "pipeline.", "momentum."],
  lead: "Thunspark is a complete digital growth partner. We diagnose what's blocking your growth, then connect strategy, execution, and measurement into one system — so every move has a reason and every result is provable.",
  primaryCta: {
    label: "Book a strategy call",
    href: "/contact",
  },
  secondaryCta: {
    label: "See our work",
    href: "#work",
  },
  floatingChips: [
    { label: "SEO", pos: "top-left" },
    { label: "Paid Media", pos: "top-right" },
    { label: "CRO", pos: "bottom-left" },
    { label: "Content", pos: "bottom-right" },
  ],
} as const;

export const PROBLEMS_COPY = {
  eyebrow: "THE REAL PROBLEMS",
  h2: "What's actually holding your growth back?",
  intro:
    "Most agencies start with a channel. We start with the problem. These are the six we see most often.",
  items: [
    {
      index: "01",
      title: "Ads that burn budget",
      description:
        "Clicks arrive, pipeline doesn't. Campaigns optimized for platform metrics instead of revenue.",
      fixCategory: "performance-marketing",
    },
    {
      index: "02",
      title: "Traffic that doesn't convert",
      description:
        "Visitors land, then leave. The funnel leaks below the fold, and nobody owns the fix.",
      fixCategory: "web-design-development",
    },
    {
      index: "03",
      title: "Inconsistent, invisible content",
      description:
        "Posting without a strategy. Sporadic output that neither ranks nor builds trust.",
      fixCategory: "content-marketing",
    },
    {
      index: "04",
      title: "A website that undersells",
      description:
        "Your best salesperson has become a brochure. Slow, vague, and built to impress, not convert.",
      fixCategory: "web-design-development",
    },
    {
      index: "05",
      title: "Data everywhere, insight nowhere",
      description:
        "Dashboards full of numbers, none tied to a decision. Reporting that reports — never guides.",
      fixCategory: "analytics-audit",
    },
    {
      index: "06",
      title: "Growth that stalled",
      description:
        "What worked last year plateaued. Tactics multiplied. Results didn't.",
      fixCategory: "growth-consulting",
    },
  ],
} as const;

export const POSITIONING_STRIP = [
  { step: "01", text: "Diagnose the bottleneck" },
  { step: "02", text: "Build the growth system" },
  { step: "03", text: "Prove it with measurement" },
] as const;

export const PROCESS_PATHWAY = {
  eyebrow: "HOW WE WORK",
  h2: "A process built to compound.",
  steps: [
    {
      number: "01",
      title: "Diagnose",
      description: "Audit ads, analytics, and funnel. Find the real bottleneck.",
      chips: ["Audit", "Tracking review"],
    },
    {
      number: "02",
      title: "Strategize",
      description: "A prioritized roadmap: what to fix, build, and spend — and why.",
      chips: ["Roadmap", "KPIs"],
    },
    {
      number: "03",
      title: "Build",
      description: "Campaigns, content, and web assets, produced to the strategy.",
      chips: ["Creative", "Web", "Content"],
    },
    {
      number: "04",
      title: "Launch",
      description: "Ship, instrument, and go live without drama.",
      chips: ["QA", "Tracking"],
    },
    {
      number: "05",
      title: "Measure & optimize",
      description: "Report against revenue. Feed findings back to step one.",
      chips: ["Reporting", "Iteration"],
    },
  ],
} as const;

export const INDUSTRIES_COPY = {
  eyebrow: "WHO WE HELP",
  h2: "Built for ambitious businesses.",
  items: [
    {
      title: "Startups & scale-ups",
      description: "Moving fast with more channels than hands. We bring the system.",
      icon: "rocket",
    },
    {
      title: "E-commerce & DTC",
      description: "Margins live and die by CAC and conversion. We optimize both.",
      icon: "shopping-bag",
    },
    {
      title: "B2B & professional services",
      description: "Long cycles, committee decisions. We build trust at every step.",
      icon: "briefcase",
    },
    {
      title: "Founders & lean teams",
      description: "You don't need a bigger team. You need a sharper one.",
      icon: "users",
    },
  ],
} as const;

export const WHY_THUNSPARK = {
  eyebrow: "WHY THUNSPARK",
  h2: "An agency built like a growth partner.",
  copy: "We don't sell marketing services. We solve business problems — and stay until the numbers move.",
  cta: {
    label: "Let's talk growth",
    href: "/contact",
  },
  cards: [
    {
      title: "Problem-first",
      description:
        "We diagnose before we prescribe. If the honest answer is a landing page, not a retainer, that's the answer.",
    },
    {
      title: "Full-funnel integration",
      description:
        "Strategy, execution, and measurement under one roof. No handoffs, no gaps, no finger-pointing.",
    },
    {
      title: "Senior-led delivery",
      description:
        "Every engagement is directed by senior growth strategists, not passed off to junior account managers.", // TODO(CONTENT): confirm claim
    },
    {
      title: "Radical transparency",
      description:
        "Reporting you can audit. Budgets you can trace. If something isn't working, you'll hear it from us first.",
    },
  ],
} as const;

export const CASE_STUDIES = [
  {
    slug: "coo-and-cry",
    client: "Coo & Cry",
    industry: "Baby Care / E-commerce",
    headline: "Building a Connected Digital Brand Experience for Coo & Cry.", shortDescription: "Connected brand identity, packaging, full-stack e-commerce, social marketing, and content.", // TODO(CONTENT)
    overview:
      "Coo & Cry needed more than isolated marketing assets — it needed a connected brand experience spanning how the brand looks, speaks, sells and shows up online. ThunSpark delivered the full stack: brand identity and packaging design, a full-stack e-commerce website, ongoing social media marketing, blog writing and content creation, so every touchpoint works from the same brand foundation.",
    scope: [
      "Full-stack e-commerce development",
      "Branding & packaging design",
      "Social media marketing",
      "Blog writing & content creation",
    ],
    servicesRendered: ["Web Design & Dev", "Branding", "Social Media", "Content"],
    year: 2024,
    honestyNote: "Scope-first showcase. Verified metrics pending client publication permission.",
  },
  {
    slug: "medilove",
    client: "Medilove",
    industry: "Adult Care / Consumer Products",
    headline: "Creating a Consistent Social Presence for Medilove.", shortDescription: "End-to-end social media management, content planning, creative production, and publishing.", // TODO(CONTENT)
    overview:
      "For a care brand, trust is built in the feed. ThunSpark managed Medilove's social media presence end-to-end — content planning, creative production and publishing — keeping the brand's voice consistent and its audience engaged across platforms.",
    scope: [
      "Social media management",
      "Content planning & production",
      "Publishing & community",
    ],
    servicesRendered: ["Social Media Marketing", "Content Strategy"],
    year: 2024,
    honestyNote: "Scope-first showcase. Verified metrics pending client publication permission.",
  },
  {
    slug: "suncity-fire",
    client: "Suncity Fire",
    industry: "B2B Fire-Safety Manufacturing",
    headline: "Connecting B2B Visibility and Paid Advertising for Suncity Fire.", shortDescription: "B2B organic social presence paired with Google Ads and Facebook Ads to drive qualified enquiries.", // TODO(CONTENT)
    overview:
      "B2B manufacturing doesn't win on follower counts — it wins on qualified inquiries. ThunSpark paired an organic social media presence with Google Ads and Facebook Ads campaigns, building visibility for Suncity Fire's product range and turning search and social attention into enquiry opportunities.",
    scope: [
      "Social media marketing",
      "Google Ads campaigns",
      "Facebook Ads campaigns",
    ],
    servicesRendered: ["Paid Advertising", "Social Media Marketing"],
    year: 2024,
    honestyNote: "Scope-first showcase. Verified metrics pending client publication permission.",
  },
  {
    slug: "homeware-expo",
    client: "Homeware Expo",
    industry: "Exhibitions & Events",
    headline: "A Connected Website and Digital Marketing Presence for Homeware Expo.", shortDescription: "Full-stack event website paired with social media marketing and Facebook and Google Ads.", // TODO(CONTENT)
    overview:
      "An expo lives or dies by attendance and exhibitor interest. ThunSpark built Homeware Expo's digital foundation — a full-stack website — and ran the event's visibility engine with social media marketing plus Facebook and Google Ads campaigns.",
    scope: [
      "Full-stack web development",
      "Social media marketing",
      "Facebook Ads",
      "Google Ads",
    ],
    servicesRendered: ["Web Development", "Social Media", "Paid Ads"],
    year: 2024,
    honestyNote: "Scope-first showcase. Verified metrics pending client publication permission.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "What does ThunSpark actually do?",
    a: "Five connected disciplines: growth strategy, organic growth (SEO, content, Pinterest), content & creative, web & conversion, and paid growth. Most clients start with a diagnostic and add execution where it matters.",
    hasSchema: true,
  },
  {
    q: "Who do you work with?",
    a: "Startups and scale-ups, e-commerce brands, and B2B businesses — founders and owners who want growth they can measure, not marketing they have to guess about.",
    hasSchema: true,
  },
  {
    q: "How do engagements work?",
    a: "We start with a diagnostic sprint to identify bottlenecks, follow with a clear growth roadmap, and transition into monthly execution retainers tailored to your primary acquisition channels.",
    hasSchema: false, // TODO(CONTENT): confirm minimum terms
  },
  {
    q: "How long until we see results?",
    a: "Paid campaigns can show signal in weeks. SEO and content compound over months. We'll give you honest ranges for your situation before you spend a rupee — not a generic promise.",
    hasSchema: true,
  },
  {
    q: "How do you measure and report ROI?",
    a: "We agree on KPIs tied to revenue before launch, instrument them properly, and report against them on a fixed cadence you can audit.",
    hasSchema: true,
  },
  {
    q: "What happens on a strategy call?",
    a: "Thirty minutes. We look at your funnel and channels, name the biggest bottleneck we see, and tell you what we'd do first — whether or not you hire us.",
    hasSchema: true,
  },
  {
    q: "Do you require long-term contracts?",
    a: "We prefer earning your trust month-over-month. Standard engagements begin with a 90-day sprint to establish benchmarks and traction before flexible retainers.",
    hasSchema: false, // TODO(CONTENT): confirm contract terms
  },
  {
    q: "What is the minimum budget to work with ThunSpark?",
    a: "Engagements are scoped individually based on channel count, media volume, and technical velocity required to generate reliable signal.",
    hasSchema: false, // TODO(CONTENT): confirm minimum scope
  },
] as const;

export interface EngagementModel {
  id: 'project' | 'retainer' | 'audit';
  name: string;
  tagline: string;
  audience: string;
  deliverables: string[];
  billingMethod: string;
  recommendedFor?: boolean;
  ctaText: string;
  ctaHref: string;
}

export const SCOPING_STEPS = [
  {
    step: '01',
    title: 'Diagnostic Consultation',
    description: 'We audit your channel data, funnel metrics, and current acquisition bottlenecks to pinpoint where growth is stalling.',
  },
  {
    step: '02',
    title: 'Custom Scope Definition',
    description: 'We define the deliverables, technical integrations, and clear resource requirements suited to your velocity needs.',
  },
  {
    step: '03',
    title: 'Milestone-Based Execution',
    description: 'Work begins with clear weekly sprint cadences, transparent project boards, and measurable business milestones.',
  },
] as const;

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    id: 'audit',
    name: 'Growth Audit & Diagnostics',
    tagline: 'Deep-dive inspection before significant capital commitment.', // TODO(CONTENT)
    audience: 'Founders and marketing leads who need clarity on why acquisition has stalled or where ad spend is leaking.', // TODO(CONTENT)
    deliverables: [
      'Comprehensive funnel, analytics & tracking audit',
      'Ad account structure and unit economic evaluation',
      'Conversion barrier and customer journey diagnosis',
      'Prioritized 90-day execution roadmap and recommendations',
    ],
    billingMethod: 'Fixed one-time assessment fee based on technical complexity and audit scope.', // TODO(CONTENT): billed in words, no prices
    ctaText: 'Request an Audit',
    ctaHref: '/contact?intent=audit',
  },
  {
    id: 'retainer',
    name: 'Strategic Growth Retainer',
    tagline: 'End-to-end growth leadership and multi-channel execution.', // TODO(CONTENT)
    audience: 'Growing brands needing a dedicated growth partner across paid media, creative production, and analytics.', // TODO(CONTENT)
    recommendedFor: true,
    deliverables: [
      'Dedicated strategy, creative direction & media operations',
      'Continuous experimentation roadmap and sprint cadence',
      'Real-time reporting dashboards with bi-weekly strategic syncs',
      'Full pipeline tracking from ad click to verified revenue',
    ],
    billingMethod: 'Monthly predictable flat advisory and management fee tailored to sprint velocity.', // TODO(CONTENT): billed in words, no prices
    ctaText: 'Explore Retainer Scope',
    ctaHref: '/contact?intent=retainer',
  },
  {
    id: 'project',
    name: 'Targeted Sprint / Project',
    tagline: 'Focused execution for specific infrastructure builds and overhauls.', // TODO(CONTENT)
    audience: 'Teams requiring a discrete deliverable such as a website redesign, analytics overhaul, or landing page sprint.', // TODO(CONTENT)
    deliverables: [
      'Dedicated deliverable milestones with agreed completion criteria',
      'Architecture, design, implementation, and rigorous QA',
      'Handover documentation, team training, and post-launch monitoring',
      'Clear scope boundaries with change-order transparency',
    ],
    billingMethod: 'Milestone-based project billing structured across agreed deliverable phases.', // TODO(CONTENT): billed in words, no prices
    ctaText: 'Discuss Your Project',
    ctaHref: '/contact?intent=project',
  },
];

export interface FAQGroup {
  id: string;
  title: string;
  description: string;
  items: { q: string; a: string }[];
}

export const FAQ_GROUPS: FAQGroup[] = [
  {
    id: 'general',
    title: 'General',
    description: 'Agency background, positioning, and who we work best with.',
    items: [
      {
        q: 'What does ThunSpark actually do?',
        a: 'Five connected disciplines: growth strategy, organic growth (SEO, content, Pinterest), content & creative, web & conversion, and paid growth. Most clients start with a diagnostic and add execution where it matters.',
      },
      {
        q: 'Who do you work with?',
        a: 'Startups, scale-ups, and established brands — founders and marketing leads who want growth they can measure, not marketing they have to guess about.',
      },
      {
        q: 'How long until we see measurable results?',
        a: 'Paid media and funnel fixes often yield signal within weeks. SEO and compounding brand equity take 3 to 6 months. We set transparent benchmark expectations before work begins.',
      },
      {
        q: 'What happens on an initial strategy call?',
        a: 'A focused 30-minute working session. We look at your current funnel, identify the most evident bottleneck, and share actionable first steps — regardless of whether you engage us.',
      },
    ],
  },
  {
    id: 'process',
    title: 'Process',
    description: 'How we diagnose bottlenecks, scope work, and execute sprints.',
    items: [
      {
        q: 'How do client engagements work?',
        a: 'We diagnose first through an audit sprint, establish a prioritized roadmap, and transition into recurring execution sprints or milestone project deliveries.',
      },
      {
        q: 'What is included in the initial Growth Audit?',
        a: 'We inspect tracking and analytics configurations, review ad structures, analyze conversion pathways, and deliver a written findings document with prioritized recommendations.',
      },
      {
        q: 'How quickly can campaigns or audits launch?',
        a: 'Audits begin within 3 business days of asset access. Full campaign launches follow technical tracking verification and creative production sprints.',
      },
      {
        q: 'How are deliverables tracked and communicated?',
        a: 'Clients receive dedicated project board access, weekly asynchronous sprint updates, and bi-weekly strategic review calls.',
      },
    ],
  },
  {
    id: 'reporting-contracts',
    title: 'Reporting and Contracts',
    description: 'Contract structures, billing models, and performance measurement.',
    items: [
      {
        q: 'How do you measure and report ROI?',
        a: 'We agree on primary business KPIs (pipeline, verified customer acquisition cost, conversion rate) before launch and track them via dedicated automated reporting dashboards.',
      },
      {
        q: 'Do you require long-term lock-in contracts?',
        a: 'We structure agreements around milestone deliverables or 90-day sprint commitments with 30-day notice windows, preferring to earn retention through proven results.',
      },
      {
        q: 'How is billing structured?',
        a: 'Engagements are billed as either flat monthly retainers for continuous execution or fixed milestone payments for discrete builds, agreed in advance with no hidden surcharges.',
      },
      {
        q: 'How frequently do we review performance reports?',
        a: 'Dashboards update in real time. We provide weekly performance recaps and deep-dive strategic reviews every two weeks.',
      },
    ],
  },
  {
    id: 'data-nda',
    title: 'Data and NDA',
    description: 'Confidentiality, intellectual property, and account ownership.',
    items: [
      {
        q: 'Do you sign non-disclosure agreements (NDAs)?',
        a: 'Yes. We execute mutual NDAs prior to accessing proprietary systems, customer analytics, or financial data.',
      },
      {
        q: 'Who owns the ad accounts, creative assets, and code?',
        a: 'You do. All campaigns, ad accounts, pixel data, custom code, and creative assets remain 100% your property during and after our engagement.',
      },
      {
        q: 'How is data privacy handled across analytics tools?',
        a: 'We implement Google Consent Mode v2 and comply with global privacy standards, ensuring user tracking respects consent choices.',
      },
      {
        q: 'What access permissions do you require during discovery?',
        a: 'Standard read-only or analyst access to Google Analytics, Search Console, and ad platforms, without requiring administrative control.',
      },
    ],
  },
];

export const FINAL_CTA = {
  h2: "Ready to find your bottleneck?",
  copy: "Book a strategy call. We'll tell you what's blocking your growth — and exactly what we'd fix first.",
  primaryCta: {
    label: "Book a strategy call",
    href: "/contact",
  },
  secondaryEmail: "hello@thunspark.agency",
  teasers: [
    "Bottleneck diagnosis",
    "90-day roadmap",
    "Channel priorities",
  ],
} as const;

export const LEGAL_DISCLAIMER =
  "Marketing outcomes vary based on business conditions, competitive factors, budgets, implementation, and other variables. Past performance does not guarantee future results.";
