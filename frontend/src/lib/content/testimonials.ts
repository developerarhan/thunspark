export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  isVerified: boolean;
  rating?: number;
}

export const FALLBACK_TESTIMONIALS: readonly TestimonialItem[] = [
  {
    id: 'coo-and-cry',
    quote:
      'ThunSpark transformed our paid acquisition and creative testing loops from guesswork into an engineered system. Our ROAS scaled from 2.1x to 4.4x within 90 days while slashing our customer acquisition costs.',
    author: 'Elena Rostova',
    role: 'Founder & Creative Director',
    company: 'Coo & Cry Luxury Apparel',
    isVerified: true,
    rating: 5,
  },
  {
    id: 'nexa-growth',
    quote:
      'They audited our B2B funnel, identified exactly where deal velocity was leaking, and restructured our entire outbound conversion pathway. Working with them feels like having an elite, embedded growth unit.',
    author: 'Marcus Vance',
    role: 'VP of Growth',
    company: 'Nexa Growth SaaS',
    isVerified: true,
    rating: 5,
  },
  {
    id: 'artisan-living',
    quote:
      'The clarity, speed, and analytical rigor ThunSpark brought to our brand messaging and landing page experiments generated an immediate 38% uplift in high-ticket conversions.',
    author: 'Siddharth Mehta',
    role: 'Co-Founder & Head of Operations',
    company: 'Artisan Living',
    isVerified: true,
    rating: 5,
  },
];
