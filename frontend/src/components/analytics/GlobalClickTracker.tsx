'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/**
 * Automatically captures mailto_click, tel_click, and outbound_click across all links on the site.
 */
export function GlobalClickTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor || !anchor.href) return;

      const href = anchor.href;

      if (href.startsWith('mailto:')) {
        const cleanMail = href.replace(/^mailto:/i, '').split('?')[0];
        track('mailto_click', {
          url: cleanMail,
          location: anchor.getAttribute('data-analytics-location') || window.location.pathname,
        });
      } else if (href.startsWith('tel:')) {
        const cleanTel = href.replace(/^tel:/i, '').split('?')[0];
        track('tel_click', {
          url: cleanTel,
          location: anchor.getAttribute('data-analytics-location') || window.location.pathname,
        });
      } else if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
          const urlObj = new URL(href);
          if (urlObj.host !== window.location.host) {
            track('outbound_click', {
              url: href,
              label:
                anchor.innerText?.trim() ||
                anchor.getAttribute('aria-label') ||
                urlObj.hostname,
            });
          }
        } catch {
          // Ignore URL parse failures
        }
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  return null;
}
