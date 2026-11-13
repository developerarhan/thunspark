import { siteConfig } from '@/site.config';

/**
 * Returns the configured booking URL if valid https, otherwise falls back to "/contact".
 */
export function getBookingHref(): string {
  return siteConfig.booking?.url || '/contact';
}

/**
 * Checks if a given booking href is an external URL.
 */
export function isExternalBooking(url: string = getBookingHref()): boolean {
  return url.startsWith('https://');
}

/**
 * Helper to get Link/Button props for a booking CTA.
 */
export function getBookingProps(location: string = 'unknown') {
  const href = getBookingHref();
  const isExternal = isExternalBooking(href);

  return {
    href,
    target: isExternal ? '_blank' : undefined,
    rel: isExternal ? 'noopener noreferrer' : undefined,
    'data-analytics-location': location,
  };
}
