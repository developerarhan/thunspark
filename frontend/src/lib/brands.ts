export interface TrustedBrand {
  id: string;
  name: string;
  category: string;
  symbol?: string; // Optional custom SVG path
  caseStudyHref?: string;
  logo?: string | null;
}

/**
 * Easily expandable brand list.
 * To add more brands in the future, simply append a new brand object here.
 */
export const TRUSTED_BRANDS: TrustedBrand[] = [
  {
    id: 'coo-and-cry',
    name: 'Coo & Cry',
    category: 'Luxury Apparel',
    caseStudyHref: '/projects/coo-and-cry',
    logo: '/images/brands/coo-and-cry.png',
  },
  {
    id: 'medilove',
    name: 'Medilove',
    category: 'Healthcare & Pharma',
    caseStudyHref: '/projects/medilove',
    logo: '/images/brands/medilove.png',
  },
  {
    id: 'suncity-fire',
    name: 'Suncity Fire',
    category: 'Industrial Safety',
    caseStudyHref: '/projects/suncity-fire',
    logo: '/images/brands/suncity-fire.png',
  },
  {
    id: 'homeware-expo',
    name: 'Homeware Expo',
    category: 'B2B Trade & Events',
    caseStudyHref: '/projects/homeware-expo',
    logo: '/images/brands/homeware-expo.png',
  },
  {
    id: 'nexa-growth',
    name: 'Nexa Growth',
    category: 'B2B SaaS',
  },
  {
    id: 'velox-tech',
    name: 'Velox Logistics',
    category: 'Supply Chain',
  },
  {
    id: 'pulse-d2c',
    name: 'Pulse Media',
    category: 'E-Commerce',
  },
  {
    id: 'artisan-living',
    name: 'Artisan Living',
    category: 'Design & Living',
  },
];

export const FOUNDER_AVATARS = [
  { initials: 'RK', name: 'Rahul K.', role: 'Founder, Coo & Cry', color: 'from-amber-500/20 to-orange-500/20 text-orange-400' },
  { initials: 'SM', name: 'Dr. Sameer M.', role: 'CEO, Medilove', color: 'from-blue-500/20 to-cyan-500/20 text-blue-400' },
  { initials: 'AP', name: 'Amit P.', role: 'MD, Suncity Fire', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400' },
  { initials: 'VS', name: 'Vikram S.', role: 'Dir., Homeware Expo', color: 'from-purple-500/20 to-pink-500/20 text-purple-400' },
  { initials: 'NJ', name: 'Neha J.', role: 'VP Growth, Nexa', color: 'from-rose-500/20 to-amber-500/20 text-rose-400' },
];
