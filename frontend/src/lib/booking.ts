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
 * Extracts the Cal.com slug (e.g. "thunspark/strategy-call") for in-page modal embed.
 * Returns null if not a Cal.com link or if using the internal /contact fallback.
 */
export function getCalLink(url: string = getBookingHref()): string | null {
  if (!url || url === '/contact') return null;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('cal.com')) {
      const slug = parsed.pathname.replace(/^\/+/, '').trim();
      return slug || null;
    }
  } catch {
    // If entered directly as a slug (e.g. "thunspark/strategy")
    if (!url.startsWith('http') && url.includes('/')) {
      return url.trim();
    }
  }

  return null;
}

/**
 * Helper to get Link/Button props for a booking CTA.
 */
export function getBookingProps(location: string = 'unknown') {
  const href = getBookingHref();
  const calLink = getCalLink(href);
  const isExternal = isExternalBooking(href);

  return {
    href,
    target: isExternal && !calLink ? '_blank' : undefined,
    rel: isExternal && !calLink ? 'noopener noreferrer' : undefined,
    'data-analytics-location': location,
    ...(calLink
      ? {
          'data-cal-link': calLink,
          'data-cal-config': '{"layout":"month_view","theme":"dark"}',
        }
      : {}),
  };
}
