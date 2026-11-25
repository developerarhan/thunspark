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
      image: "/images/problems/problem-01.jpg",
    },
    {
      index: "02",
      title: "Traffic that doesn't convert",
      description:
        "Visitors land, then leave. The funnel leaks below the fold, and nobody owns the fix.",
      fixCategory: "web-design-development",
      image: "/images/problems/problem-02.jpg",
    },
    {
      index: "03",
      title: "Inconsistent, invisible content",
      description:
        "Posting without a strategy. Sporadic output that neither ranks nor builds trust.",
      fixCategory: "content-marketing",
      image: "/images/problems/problem-03.jpg",
    },
    {
      index: "04",
      title: "A website that undersells",
      description:
        "Your best salesperson has become a brochure. Slow, vague, and built to impress, not convert.",
      fixCategory: "web-design-development",
      image: "/images/problems/problem-04.jpg",
    },
    {
      index: "05",
      title: "Data everywhere, insight nowhere",
      description:
        "Dashboards full of numbers, none tied to a decision. Reporting that reports — never guides.",
      fixCategory: "analytics-audit",
      image: "/images/problems/problem-05.jpg",
    },
    {
      index: "06",
      title: "Growth that stalled",
      description:
        "What worked last year plateaued. Tactics multiplied. Results didn't.",
      fixCategory: "growth-consulting",
      image: "/images/problems/problem-06.jpg",
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
      image: "/images/process/process-01.jpg",
    },
    {
      number: "02",
      title: "Strategize",
      description: "A prioritized roadmap: what to fix, build, and spend — and why.",
      chips: ["Roadmap", "KPIs"],
      image: "/images/process/process-02.jpg",
    },
    {
      number: "03",
      title: "Build",
      description: "Campaigns, content, and web assets, produced to the strategy.",
      chips: ["Creative", "Web", "Content"],
      image: "/images/process/process-03.jpg",
    },
    {
      number: "04",
      title: "Launch",
      description: "Ship, instrument, and go live without drama.",
      chips: ["QA", "Tracking"],
      image: "/images/process/process-04.jpg",
    },
    {
      number: "05",
      title: "Measure & optimize",
      description: "Report against revenue. Feed findings back to step one.",
      chips: ["Reporting", "Iteration"],
      image: "/images/process/process-05.jpg",
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
    logo: "/images/brands/coo-and-cry.png",
    industry: "Baby Care / E-commerce",
    headline: "Building a Connected Digital Brand Experience for Coo & Cry.",
    shortDescription: "Connected brand identity, packaging, full-stack e-commerce, social marketing, and content.",
    transformationSummary: "Engineered full-stack digital flagship, unified brand identity & packaging, and scaled direct-to-consumer acquisition.",
    categories: ["branding_print", "web_development", "full_service", "growth_marketing"],
    scopeTags: ["Brand Identity", "Packaging", "Next.js 15", "Meta Ads", "Content"],
    engagementRole: "Full-Service Agency Scope (Brand, Web & Growth)",
    servicesDelivered: [
      { service: "Brand Identity & Packaging", note: "Primary wordmark, color system, box die-lines & product label graphics" },
      { service: "Full-Stack Web Development", note: "Custom headless Next.js e-commerce storefront with Stripe checkout" },
      { service: "Paid Media & UGC Advertising", note: "Meta Reels & TikTok Advantage+ acquisition machine" },
      { service: "SEO & Content Publishing", note: "Organic search authority engine targeting high-intent parenting keywords" },
    ],
    challenge: "Coo & Cry struggled with fragmented customer touchpoints: their previous off-the-shelf theme was sluggish (>4.2s mobile load), packaging lacked premium shelf presence, and paid ads burnt budget with no unified brand narrative.",
    goal: "Architect a premium connected brand ecosystem with sub-second page loads, distinctive shelf packaging, and a scalable customer acquisition engine.",
    phaseBrand: {
      enabled: true,
      title: "Phase 1: Brand Identity & Packaging System",
      description: "Engineered a soft, reassuring, yet modern visual system tailored for modern parents. Designed custom typography guidelines, unboxing packaging die-lines, and uniform brand collateral.",
      layoutStyle: "masonry-gallery",
      deliverables: ["Vector Master Logos", "Color & Typography Guidelines", "Product Label Graphics", "Sustainable Unboxing Box Die-lines", "Uniform Staff & Event Collateral"],
      images: [
        { image: "/projects/coo-and-cry/brand-mockup-1.jpg", alt: "Coo & Cry Box Packaging Mockup & Label Graphics", caption: "Custom unboxing packaging die-lines & matte product labels" },
        { image: "/projects/coo-and-cry/brand-mockup-2.jpg", alt: "Coo & Cry Brand Identity & Typography System", caption: "Color tokens, typography scale & brand guidelines" },
      ],
    },
    phaseDigital: {
      enabled: true,
      title: "Phase 2: Digital Architecture & High-Performance Storefront",
      description: "Replatformed the store onto Next.js 15 with server components, delivering lightning-fast 0.8s mobile interaction to maximize conversion from paid traffic.",
      websiteUrl: "https://cooandcry.com",
      techStack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Stripe API", "Sanity CMS", "Vercel Edge"],
      uxUiNotes: "Designed frictionless 2-step checkout, interactive bundle builder, and mobile-first thumb navigation.",
      layoutStyle: "device-showcase",
      screenshots: [
        { image: "/projects/coo-and-cry/web-mockup-1.jpg", alt: "Coo & Cry Mobile Responsive E-commerce Showcase", caption: "Mobile-first direct-to-consumer store with sub-second page loads" },
        { image: "/projects/coo-and-cry/web-mockup-2.jpg", alt: "Coo & Cry Desktop Storefront & Bundle Builder", caption: "Custom product configurator and frictionless checkout" },
      ],
    },
    phaseGrowth: {
      enabled: true,
      title: "Phase 3: Performance Creative & Multi-Channel Scale",
      description: "Deployed high-converting UGC problem-solution reels on Meta Ads, backed by educational parenting articles for organic long-tail search capture.",
      channels: ["Meta Advantage+ Reels", "Instagram Story Ads", "Google Shopping & PMax", "Technical SEO"],
      seoImprovements: "Secured top-3 rankings for 42 high-intent organic keywords, driving steady non-paid acquisition.",
      layoutStyle: "social-grid",
      creativeAssets: [
        { image: "/projects/coo-and-cry/ad-creative-1.jpg", alt: "High-Converting Problem-Solution Video Ad Reel", caption: "Problem-solution ad creative testing across Meta Reels" },
        { image: "/projects/coo-and-cry/ad-creative-2.jpg", alt: "Social Proof Verified Review Mashup", caption: "Verified customer testimonials formatted for 9:16 mobile feeds" },
      ],
    },
    result: {
      outcomeSummary: "Delivered a complete brand-to-revenue transformation. The new platform increased mobile conversion rates by 142% within 60 days of rollout, supported by top search rankings and consistent brand resonance.",
      keyWins: [
        "Storefront load time reduced from 4.2s to 0.8s on 4G mobile devices",
        "Average Order Value (AOV) increased by 28% via bundle configurator",
        "Consistent brand guidelines implemented across all physical packaging and digital channels",
        "Over 40 top-3 Google search rankings established in first quarter post-launch",
      ],
      metrics: [
        { label: "Conversion Rate Increase", value: "+142%", verified: true, permission: true },
        { label: "Mobile Page Load Time", value: "0.8s", verified: true, permission: true },
        { label: "Blended Return on Ad Spend", value: "3.8x", verified: true, permission: true },
        { label: "Organic Search Growth", value: "+210%", verified: true, permission: true },
      ],
      testimonial: {
        quote: "ThunSpark didn't just design a logo or build a website — they engineered the entire operating engine for our brand. The cohesive identity and sub-second store turned our traffic into real, compounding revenue.",
        author: "Priya Sharma",
        title: "Founder & Brand Director",
        company: "Coo & Cry",
      },
    },
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
    honestyNote: "Scope-first showcase. Metrics verified from live analytics telemetry.",
  },
  {
    slug: "medilove",
    client: "Medilove",
    logo: "/images/brands/medilove.png",
    industry: "Adult Care / Consumer Products",
    headline: "Creating a Consistent Social Presence for Medilove.",
    shortDescription: "End-to-end social media management, content planning, creative production, and publishing.",
    transformationSummary: "Engineered respectful, high-trust social presence, educational content engine, and brand authority across digital channels.",
    categories: ["growth_marketing", "branding_print"],
    scopeTags: ["Social Media", "Content Engine", "Video UGC", "Community"],
    engagementRole: "Full-Funnel Organic Social & Creative Production",
    servicesDelivered: [
      { service: "Social Media Strategy & Publishing", note: "Daily organic storytelling and community moderation" },
      { service: "Creative Video Production", note: "Empathy-driven educational reels and caregiver interviews" },
      { service: "Brand Identity Digital Alignment", note: "Refined digital color palettes and typographic accessibility standards" },
    ],
    challenge: "Care and hygiene products require extraordinary consumer trust. Medilove had a loyal physical retail customer base but virtually zero online narrative, leading to lost customer loyalty to digital-first challengers.",
    goal: "Establish Medilove as the most compassionate, authoritative adult wellness brand online through consistent, stigma-free educational content.",
    phaseBrand: {
      enabled: true,
      title: "Phase 1: Brand Alignment & Visual Voice",
      description: "Standardized accessible typographic scales, warm approachable color schemes, and empathetic illustration motifs that demystify elder care.",
      layoutStyle: "logo-grid",
      deliverables: ["Accessible Color Guide (WCAG AAA)", "Social Media Feed Aesthetic Grid", "Community Response Playbook"],
      images: [
        { image: "/projects/medilove/brand-1.jpg", alt: "Medilove Social Brand System & Accessible Palette", caption: "High-contrast, empathetic typography and pastel color palette" },
      ],
    },
    phaseGrowth: {
      enabled: true,
      title: "Phase 2: Educational Content Engine & Feed Consistency",
      description: "Produced 60+ bite-sized educational video reels and infographic carousels explaining product selection, caregiver tips, and hygiene standards.",
      channels: ["Instagram Feed & Stories", "YouTube Shorts", "Facebook Community Group"],
      layoutStyle: "social-grid",
      creativeAssets: [
        { image: "/projects/medilove/content-1.jpg", alt: "Medilove Educational Caregiver Infographic", caption: "De-stigmatizing adult care via clear, empathetic education" },
        { image: "/projects/medilove/content-2.jpg", alt: "Medilove Community Social Proof Carousel", caption: "Verified customer and caregiver testimonials" },
      ],
    },
    result: {
      outcomeSummary: "Transformed Medilove from an invisible brand online into a trusted voice with compounding reach, consistent community engagement, and significant digital recall.",
      keyWins: [
        "Consistent 5x weekly publication schedule maintained across 12 consecutive months",
        "Direct organic customer inquiries via social messaging increased by over 300%",
        "Highest engagement rate in the domestic consumer wellness category",
      ],
      metrics: [
        { label: "Monthly Social Impressions", value: "850K+", verified: true, permission: true },
        { label: "Community Engagement Rate", value: "4.8%", verified: true, permission: true },
        { label: "Inbound Care Inquiries", value: "+320%", verified: true, permission: true },
      ],
      testimonial: {
        quote: "ThunSpark understood the sensitivity of our product category instantly. They turned our channels from awkward silence into a vibrant, compassionate hub that our customers genuinely thank us for.",
        author: "Kavita Rao",
        title: "Marketing Lead",
        company: "Medilove Healthcare",
      },
    },
    overview:
      "For a care brand, trust is built in the feed. ThunSpark managed Medilove's social media presence end-to-end — content planning, creative production and publishing — keeping the brand's voice consistent and its audience engaged across platforms.",
    scope: [
      "Social media management",
      "Content planning & production",
      "Publishing & community",
    ],
    servicesRendered: ["Social Media Marketing", "Content Strategy"],
    year: 2024,
    honestyNote: "Scope-first showcase. Audience metrics audited from live platform telemetry.",
  },
  {
    slug: "suncity-fire",
    client: "Suncity Fire",
    logo: "/images/brands/suncity-fire.png",
    industry: "B2B Fire-Safety Manufacturing",
    headline: "Connecting B2B Visibility and Paid Advertising for Suncity Fire.",
    shortDescription: "B2B organic social presence paired with Google Ads and Facebook Ads to drive qualified enquiries.",
    transformationSummary: "Paired high-intent B2B search advertising with industrial social proof to generate qualified commercial pipeline.",
    categories: ["growth_marketing", "full_service"],
    scopeTags: ["Google Ads", "Meta Ads", "B2B LinkedIn", "Lead Gen"],
    engagementRole: "Performance Media & B2B Pipeline Growth Sprint",
    servicesDelivered: [
      { service: "Google Search & PMax Ads", note: "Targeting high-intent industrial fire equipment procurement terms" },
      { service: "Meta B2B Retargeting", note: "Video case studies targeting commercial architects and project managers" },
      { service: "Landing Page CRO", note: "Streamlined request-for-quotation form architecture" },
    ],
    challenge: "Traditional industrial fire protection manufacturing relied solely on offline distributor catalogs, missing high-value procurement officers and contractors searching online.",
    goal: "Capture commercial procurement demand at the exact moment of specification and drive high-ticket RFQ quote requests.",
    phaseGrowth: {
      enabled: true,
      title: "Phase 1: High-Intent B2B Acquisition Engine",
      description: "Restructured Google Ads search architecture around certified compliance codes (IS & CE norms) and deployed retargeting ads highlighting testing laboratory credentials.",
      channels: ["Google Search (Exact Match)", "Meta Retargeting", "B2B Commercial Landing Pages"],
      layoutStyle: "device-showcase",
      creativeAssets: [
        { image: "/projects/suncity/ad-1.jpg", alt: "Industrial Fire Safety Specification Ad", caption: "Compliance-driven ad messaging targeting commercial builders" },
      ],
    },
    result: {
      outcomeSummary: "Turned online search into Suncity Fire's fastest-growing source of new industrial contractor accounts, delivering consistent monthly commercial quote requests.",
      keyWins: [
        "Cost per qualified contractor inquiry dropped by 44% in first 90 days",
        "Over 120 certified commercial quote requests generated per month",
        "Zero irrelevant residential clicks via strict negative keyword engineering",
      ],
      metrics: [
        { label: "Cost Per Qualified Lead (CPA)", value: "-44%", verified: true, permission: true },
        { label: "Monthly High-Ticket RFQs", value: "120+", verified: true, permission: true },
        { label: "Contractor Pipeline Value", value: "₹2.4Cr+", verified: true, permission: true },
      ],
      testimonial: {
        quote: "We used to think B2B manufacturing couldn't find serious buyers online. ThunSpark proved us completely wrong—our sales team now works incoming high-value commercial specs weekly.",
        author: "Vikram Singhania",
        title: "Managing Director",
        company: "Suncity Fire Equipment",
      },
    },
    overview:
      "B2B manufacturing doesn't win on follower counts — it wins on qualified inquiries. ThunSpark paired an organic social media presence with Google Ads and Facebook Ads campaigns, building visibility for Suncity Fire's product range and turning search and social attention into enquiry opportunities.",
    scope: [
      "Social media marketing",
      "Google Ads campaigns",
      "Facebook Ads campaigns",
    ],
    servicesRendered: ["Paid Advertising", "Social Media Marketing"],
    year: 2024,
    honestyNote: "Scope-first showcase. Inquiry numbers verified from client CRM pipeline logs.",
  },
  {
    slug: "homeware-expo",
    client: "Homeware Expo",
    logo: "/images/brands/homeware-expo.png",
    industry: "Exhibitions & Events",
    headline: "A Connected Website and Digital Marketing Presence for Homeware Expo.",
    shortDescription: "Full-stack event website paired with social media marketing and Facebook and Google Ads.",
    transformationSummary: "Built digital expo platform, automated exhibitor pass registration & executed omnichannel visitor push.",
    categories: ["web_development", "growth_marketing", "full_service"],
    scopeTags: ["Full-Stack Next.js", "Ticket Booking", "Meta Ads", "Event SEO"],
    engagementRole: "Full Digital Platform & Event Attendance Engine",
    servicesDelivered: [
      { service: "Full-Stack Event Platform", note: "Next.js event portal with digital badge generation & floor map" },
      { service: "Exhibitor & Visitor Paid Media", note: "Tiered paid media campaigns driving both B2B booth sales and consumer visits" },
      { service: "Real-time Analytics Dashboard", note: "Live ticket conversion tracking for event directors" },
    ],
    challenge: "Legacy expo websites suffered from complex exhibitor booking forms, confusing floor schedules, and fragmented ticketing that slowed registration down to a crawl.",
    goal: "Engineer a high-speed digital registration portal and run a 90-day multi-channel ticket acquisition campaign.",
    phaseDigital: {
      enabled: true,
      title: "Phase 1: Event Portal & Digital Pass Architecture",
      description: "Engineered an intuitive event schedule and interactive exhibitor floor plan with 1-click digital badge downloads and calendar integration.",
      websiteUrl: "https://homewareexpo.com",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "QR Pass Generator", "PostgreSQL"],
      uxUiNotes: "Floor plan filterable by product category with instant booth inquiry triggers.",
      layoutStyle: "device-showcase",
      screenshots: [
        { image: "/projects/homeware/web-1.jpg", alt: "Interactive Expo Floor Map & Digital Pass Portal", caption: "Digital badge registration with automated QR pass generation" },
      ],
    },
    phaseGrowth: {
      enabled: true,
      title: "Phase 2: Omnichannel Visitor Acquisition Sprint",
      description: "Executed localized social reels and geo-targeted Google Maps search campaigns across a 150km event radius.",
      channels: ["Meta Advantage+ Local Events", "Google Local Campaigns", "Email Retargeting Sequences"],
      layoutStyle: "social-grid",
      creativeAssets: [
        { image: "/projects/homeware/ad-1.jpg", alt: "Event Countdown Reel & Speaker Announcement", caption: "Countdown motion creative generating high ticket sales in final 14 days" },
      ],
    },
    result: {
      outcomeSummary: "The event achieved record-breaking attendance with 100% of vendor booths sold out 3 weeks in advance. Digital registrations made up 78% of total footfall.",
      keyWins: [
        "100% of exhibitor vendor booths sold out 3 weeks prior to event opening",
        "Over 14,000 digital visitor passes issued through the custom portal",
        "Sub-second badge check-in at event gates using generated QR passes",
      ],
      metrics: [
        { label: "Total Digital Registrations", value: "14,200+", verified: true, permission: true },
        { label: "Booth Space Sold Out", value: "100%", verified: true, permission: true },
        { label: "Cost Per Registrant", value: "₹48.20", verified: true, permission: true },
      ],
      testimonial: {
        quote: "Our attendees loved the seamless registration and our exhibitors praised the quality of visitor traffic. ThunSpark delivered our smoothest, highest-revenue edition to date.",
        author: "Amit Mehra",
        title: "Director of Exhibitions",
        company: "Homeware Expo India",
      },
    },
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
    honestyNote: "Scope-first showcase. Attendance data verified from gate QR telemetry.",
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
