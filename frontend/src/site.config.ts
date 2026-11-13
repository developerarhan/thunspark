function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  }

  // In production builds, log a clear warning if NEXT_PUBLIC_SITE_URL is missing
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[siteConfig] Warning: NEXT_PUBLIC_SITE_URL is not set in production. Falling back to Vercel production URL or default domain.'
    );
  }

  // Vercel system environment variables (without protocol)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/+$/, '');
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, '');
  }

  // Localhost in development
  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000';
  }

  return 'https://www.thunspark.agency';
}

function resolveBookingUrl(): string | null {
  const rawUrl = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();
  if (!rawUrl) return null;

  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {}

  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[siteConfig] Warning: NEXT_PUBLIC_BOOKING_URL must be a valid https URL. Received: "${rawUrl}". Ignoring and falling back to /contact.`
    );
  }
  return null;
}

export const siteConfig = {
  name: "ThunSpark",
  legalName: "Thunspark Agency", // TODO(LEGAL): confirm registration entity
  tagline: "Strategy That Sparks Growth.",
  url: resolveSiteUrl(),
  booking: {
    url: resolveBookingUrl(),
  },
  description:
    "ThunSpark is a strategy-led, social-first digital growth agency. We diagnose growth bottlenecks and connect strategy, creative execution, and measurement into one system.",
  positioning: "Strategy-led, social-first digital growth agency",
  market: "India-first, international selectively",
  brandColors: {
    base: "#050505",
    alt: "#0A0A0A",
    card: "#111111",
    elevated: "#171717",
    ink: "#F5F5F0",
    soft: "#A6A6A0",
    muted: "#6F6F6A",
    meta: "#8A8A85",
    accent: "#FFD21F",
    accentHi: "#FFE75A",
    accentDeep: "#C9A900",
    line: "#252525",
    lineStrong: "#353535",
  },
  contact: {
    email: "hello@thunspark.agency", // TODO(CONTENT): confirm primary inbox
    phone: "+91 00000 00000", // TODO(CONTENT): confirm primary WhatsApp/phone
    whatsapp: "+91 00000 00000",
    location: "India", // TODO(CONTENT): confirm registered office location
    socials: { // TODO(CONTENT): verify official social profile URLs before enabling in Organization.sameAs JSON-LD
      linkedin: "https://linkedin.com/company/thunspark",
      instagram: "https://instagram.com/thunspark",
      twitter: "https://twitter.com/thunspark",
    },
  },
  serviceGroups: [
    {
      id: "attract",
      number: "01",
      name: "Attract",
      role: "Build visibility, acquire relevant audiences",
      services: [
        {
          name: "Social Media Marketing",
          slug: "social-media-marketing",
          shortDesc: "Audience-focused social strategies, content systems and community building.",
          chips: ["Content Planning", "Community", "Reels & Shorts", "Creator Collabs"],
          icon: "leaf",
          launchStatus: "launch",
        },
        {
          name: "SEO Services",
          slug: "seo",
          shortDesc: "Technical audits, content optimization and local visibility with zero ranking guarantees.",
          chips: ["Technical SEO", "Content Optimization", "Keyword Strategy", "Local Search"],
          icon: "trending-up",
          launchStatus: "launch",
        },
        {
          name: "Performance Marketing & Paid Ads",
          slug: "performance-marketing",
          shortDesc: "Google and Meta campaigns built around revenue goals, not platform vanity metrics.",
          chips: ["Google Ads", "Meta Ads", "Retargeting", "Creative Testing"],
          icon: "megaphone",
          launchStatus: "launch",
        },
      ],
    },
    {
      id: "engage",
      number: "02",
      name: "Engage",
      role: "Create relevance, trust, differentiation",
      services: [
        {
          name: "Content Strategy & Marketing",
          slug: "content-marketing",
          shortDesc: "Editorial planning, copywriting and creative production that builds trust and supports the buyer journey.",
          chips: ["Editorial Planning", "Copywriting", "Brand Stories", "Asset Production"],
          icon: "pen-tool",
          launchStatus: "launch",
        },
        {
          name: "Branding & Creative Strategy",
          slug: "branding-creative",
          shortDesc: "Positioning, identity systems and campaign creative that make brands recognizable, consistent and trusted.",
          chips: ["Visual Identity", "Brand Guidelines", "Positioning", "Packaging"],
          icon: "compass",
          launchStatus: "launch",
        },
      ],
    },
    {
      id: "convert",
      number: "03",
      name: "Convert",
      role: "Turn interest into action",
      services: [
        {
          name: "Web Design & Development",
          slug: "web-design-development",
          shortDesc: "Fast, credible, conversion-focused websites and e-commerce experiences built for modern performance.",
          chips: ["Next.js", "Full-Stack Dev", "CRO Architecture", "Headless CMS"],
          icon: "layout",
          launchStatus: "launch",
        },
        {
          name: "Email Marketing & Automation",
          slug: "email-marketing",
          shortDesc: "Segmented campaigns and lifecycle journeys — welcome flows, nurturing and retention that respect consent.",
          chips: ["Lifecycle Flows", "Segmentation", "Klaviyo / Resend", "Retention"],
          icon: "mail",
          launchStatus: "phase-2",
        },
        {
          name: "Online Reputation Management",
          slug: "reputation-management",
          shortDesc: "Review monitoring, response workflows and crisis planning. Authentic reputation care — never rating manipulation.",
          chips: ["Review Monitoring", "Crisis Planning", "Brand Sentiment", "Response Systems"],
          icon: "shield",
          launchStatus: "phase-2",
        },
      ],
    },
    {
      id: "optimize",
      number: "04",
      name: "Optimize",
      role: "Improve decisions and efficiency",
      services: [
        {
          name: "Digital Growth Audit & Analytics",
          slug: "analytics-audit",
          shortDesc: "Find the leaks: tracking audits, funnel analysis and KPI frameworks that turn data into decisions.",
          chips: ["GA4 Setup", "GTM Audit", "Funnel Diagnosis", "Attribution"],
          icon: "activity",
          launchStatus: "phase-2",
        },
        {
          name: "Digital Growth Strategy & Consultancy",
          slug: "growth-consulting",
          shortDesc: "Bottleneck diagnosis and a prioritized growth roadmap. Strategy-only engagements available.",
          chips: ["Roadmaps", "Channel Priorities", "Budget Allocation", "Advisory"],
          icon: "compass",
          launchStatus: "phase-2",
        },
      ],
    },
  ],
  motion: {
    customCursor: true,
    pageTransitions: true,
    siteLoader: true,
    smoothScroll: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;
