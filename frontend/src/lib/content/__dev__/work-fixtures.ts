import type { HomeWorkClient } from '@/lib/content/types';

if (process.env.NODE_ENV === 'production') {
  throw new Error('work-fixtures is dev-only and must not be loaded in production.');
}

const SAMPLE_COVER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#171717"/><rect x="40" y="40" width="560" height="320" rx="16" stroke="#353535" stroke-width="2"/><circle cx="140" cy="140" r="36" fill="#FFD21F"/><rect x="200" y="120" width="240" height="16" rx="4" fill="#F5F5F0"/><rect x="200" y="152" width="160" height="12" rx="4" fill="#8A8A85"/><rect x="104" y="220" width="432" height="90" rx="8" fill="#111111" stroke="#252525"/></svg>`
)}`;

const SAMPLE_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="none"><rect x="20" y="20" width="120" height="120" rx="24" fill="#050505"/><path d="M84 40L52 84H78L72 120L108 74H82L84 40Z" fill="#FFD21F"/></svg>`
)}`;

const INDUSTRIES = [
  'B2B SaaS',
  'E-Commerce & DTC',
  'Consumer Health',
  'Industrial Tech',
  'Fintech',
  'Hospitality',
] as const;

/**
 * Generates deterministic mock HomeWorkClient items for local layout verification
 * (1, 4, 12, 40 clients cycling through cover, logo, and monogram states).
 */
export function generateMockWorkClients(count: number): HomeWorkClient[] {
  return Array.from({ length: count }, (_, idx) => {
    const mod = idx % 3;
    const n = idx + 1;
    const slug = `mock-client-${n}`;
    return {
      slug,
      client: `Sample Partner ${String(n).padStart(2, '0')}`,
      industry: INDUSTRIES[idx % INDUSTRIES.length],
      shortDescription:
        'Full-funnel acquisition architecture pairing high-intent search, creative sprints, and conversion telemetry.',
      cover: mod === 0 ? SAMPLE_COVER_SVG : null,
      logo: mod === 1 ? SAMPLE_LOGO_SVG : null,
      year: 2025 - (idx % 4),
      featured: idx < 3,
    };
  });
}
