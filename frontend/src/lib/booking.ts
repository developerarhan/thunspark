import { siteConfig } from '@/site.config';

/**
 * Returns the primary lead capture route for all CTAs across the website.
 * All CTAs ("Book a Strategy Call", "Get Free Audit", etc.) route directly to "/contact"
 * to capture the qualified lead in the CRM first before Step 2 in-page scheduling.
 */
export function getBookingHref(): string {
  return '/contact';
}

/**
 * Returns the raw Cal.com booking URL from siteConfig/env for the in-page Step 2 embed.
 */
export function getCalBookingUrl(): string {
  return siteConfig.booking?.url || 'https://cal.com/thunspark/strategy';
}

/**
 * Checks if a given booking href is an external URL.
 */
export function isExternalBooking(url: string = getBookingHref()): boolean {
  return url.startsWith('https://');
}

/**
 * Extracts the Cal.com slug (e.g. "thunspark/strategy") for the in-page calendar embed.
 */
export function getCalLink(url: string = getCalBookingUrl()): string | null {
  if (!url || url === '/contact' || url.startsWith('/contact?')) return null;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('cal.com')) {
      const slug = parsed.pathname.replace(/^\/+/, '').trim();
      return slug || 'thunspark/strategy';
    }
  } catch {
    if (!url.startsWith('http') && url.includes('/')) {
      return url.trim();
    }
  }

  return 'thunspark/strategy';
}

/**
 * Helper to get Link/Button props for a booking CTA.
 */
export function getBookingProps(location: string = 'unknown') {
  return {
    href: '/contact',
    'data-analytics-location': location,
  };
}
