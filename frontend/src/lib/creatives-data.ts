export interface CreativeCard {
  id: string;
  client: string;
  category: string;
  title: string;
  metric?: string;
  accent: string; // Color token / gradient
  bgGradient: string;
  aspectRatio?: string;
  thumbnailUrl?: string | null;
  projectSlug?: string | null;
  externalUrl?: string | null;
}

export const CREATIVE_SHOWCASE: CreativeCard[] = [
  // Column 1
  {
    id: 'cr-1',
    client: 'Coo & Cry',
    category: 'Meta Reels Ad',
    title: 'Autumn Velvet Collection Launch',
    metric: '4.8x ROAS',
    accent: '#FF6B00',
    bgGradient: 'from-orange-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-2',
    client: 'Medilove',
    category: 'Conversion Lander',
    title: 'Direct-to-Consumer Wellness Portal',
    metric: '+285% CVR',
    accent: '#3B82F6',
    bgGradient: 'from-blue-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-3',
    client: 'Suncity Fire',
    category: '3D Product Render',
    title: 'Industrial Extinguisher Safety System',
    metric: 'B2B Qualified',
    accent: '#EF4444',
    bgGradient: 'from-red-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-4',
    client: 'Homeware Expo',
    category: 'Motion Teaser',
    title: 'Global Trade Summit Experience',
    metric: '1.2M Views',
    accent: '#10B981',
    bgGradient: 'from-emerald-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-5',
    client: 'Nexa Growth',
    category: 'SaaS UI/UX',
    title: 'AI Revenue Command Center',
    metric: '68% Retention',
    accent: '#8B5CF6',
    bgGradient: 'from-purple-950/60 via-zinc-900 to-zinc-950',
  },

  // Column 2
  {
    id: 'cr-6',
    client: 'Pulse D2C',
    category: 'Performance UGC',
    title: 'Viral Problem-Solution Story Reel',
    metric: '180K Orders',
    accent: '#EC4899',
    bgGradient: 'from-pink-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-7',
    client: 'Velox Tech',
    category: 'Design System',
    title: 'Logistics Telemetry Fleet Dashboard',
    metric: '<1.2s Load',
    accent: '#06B6D4',
    bgGradient: 'from-cyan-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-8',
    client: 'Artisan Living',
    category: 'Brand Identity',
    title: 'Handcrafted Heritage Packaging',
    metric: 'Luxury Tier',
    accent: '#F59E0B',
    bgGradient: 'from-amber-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-9',
    client: 'Coo & Cry',
    category: 'Google Shopping Feed',
    title: 'High-Intent Dynamic Catalog Ads',
    metric: '5.2x MER',
    accent: '#FF6B00',
    bgGradient: 'from-orange-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-10',
    client: 'Medilove',
    category: 'Clinical Packaging',
    title: 'Doctor-Endorsed Daily Vitamin Kit',
    metric: 'FDA Grade',
    accent: '#3B82F6',
    bgGradient: 'from-blue-950/60 via-zinc-900 to-zinc-950',
  },

  // Column 3
  {
    id: 'cr-11',
    client: 'Homeware Expo',
    category: 'VIP Registration Flow',
    title: 'Interactive Floor Map & Lead Pass',
    metric: '32K Passes',
    accent: '#10B981',
    bgGradient: 'from-emerald-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-12',
    client: 'Suncity Fire',
    category: 'Interactive Catalog',
    title: 'Commercial Fire Safety Compliance Spec',
    metric: 'Govt Certified',
    accent: '#EF4444',
    bgGradient: 'from-red-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-13',
    client: 'Nexa Growth',
    category: 'B2B Lead Magnet',
    title: 'State of B2B Pipeline Growth Report',
    metric: '14K Downloads',
    accent: '#8B5CF6',
    bgGradient: 'from-purple-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-14',
    client: 'Pulse D2C',
    category: 'Static Carousel Ad',
    title: 'Comparison Teardown: Us vs Ordinary',
    metric: '+34% ATC',
    accent: '#EC4899',
    bgGradient: 'from-pink-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-15',
    client: 'Artisan Living',
    category: 'Lookbook Editorial',
    title: 'Minimalist Scandinavian Catalog',
    metric: 'Press Featured',
    accent: '#F59E0B',
    bgGradient: 'from-amber-950/60 via-zinc-900 to-zinc-950',
  },

  // Column 4
  {
    id: 'cr-16',
    client: 'Coo & Cry',
    category: 'Holiday Sale Event',
    title: 'Black Friday Scalable Ad Machine',
    metric: '₹2.4Cr GMV',
    accent: '#FF6B00',
    bgGradient: 'from-orange-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-17',
    client: 'Medilove',
    category: 'Interactive Dosage Quiz',
    title: 'Personalized Health Assessment Engine',
    metric: '52% Completion',
    accent: '#3B82F6',
    bgGradient: 'from-blue-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-18',
    client: 'Velox Tech',
    category: 'Product Walkthrough',
    title: 'Autonomous Dispatch Route Optimizer',
    metric: '-28% Latency',
    accent: '#06B6D4',
    bgGradient: 'from-cyan-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-19',
    client: 'Suncity Fire',
    category: 'Direct Outreach Kit',
    title: 'Enterprise Safety RFP Proposal Deck',
    metric: '₹85L Contract',
    accent: '#EF4444',
    bgGradient: 'from-red-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-20',
    client: 'Homeware Expo',
    category: 'Exhibitor Portal',
    title: 'Multi-Vendor Booth Booking System',
    metric: 'Sold Out in 48h',
    accent: '#10B981',
    bgGradient: 'from-emerald-950/60 via-zinc-900 to-zinc-950',
  },

  // Column 5
  {
    id: 'cr-21',
    client: 'Nexa Growth',
    category: 'Onboarding System',
    title: 'Frictionless 3-Step Workspace Setup',
    metric: '4.2x Activation',
    accent: '#8B5CF6',
    bgGradient: 'from-purple-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-22',
    client: 'Pulse D2C',
    category: 'Retargeting Reel',
    title: 'Social Proof & Verified Review Mashup',
    metric: '4.9★ Rating',
    accent: '#EC4899',
    bgGradient: 'from-pink-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-23',
    client: 'Artisan Living',
    category: 'E-Commerce Storefront',
    title: 'Headless Next.js Global Flagship',
    metric: '99 Performance',
    accent: '#F59E0B',
    bgGradient: 'from-amber-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-24',
    client: 'Coo & Cry',
    category: 'Unboxing Experience',
    title: 'Custom Ribbon & Sustainable Packaging',
    metric: '42% Repeat',
    accent: '#FF6B00',
    bgGradient: 'from-orange-950/60 via-zinc-900 to-zinc-950',
  },
  {
    id: 'cr-25',
    client: 'Medilove',
    category: 'Omnichannel Campaign',
    title: 'National Immune Health Awareness Ad',
    metric: '3.6M Reach',
    accent: '#3B82F6',
    bgGradient: 'from-blue-950/60 via-zinc-900 to-zinc-950',
  },
];
