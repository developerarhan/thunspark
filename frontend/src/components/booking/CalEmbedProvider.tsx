'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface CalApi {
  (...args: unknown[]): void;
  ns?: Record<string, CalApi>;
  q?: unknown[];
  loaded?: boolean;
}

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

/**
 * CalEmbedProvider
 * Initializes Cal.com's official embed snippet for in-page modal popups.
 * Automatically themes the modal to ThunSpark's dark aesthetic (#050505 base, #FFD21F accent).
 * Zero bundle impact on /admin and /studio routes.
 */
export function CalEmbedProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable in CRM and Sanity Studio
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/studio')) {
      return;
    }

    // Embed snippet provided by official Cal.com documentation, modernized with TypeScript & rest params
    (function (C: Window, A: string, L: string) {
      const p = function (a: CalApi, ar: unknown[]) {
        if (!a.q) a.q = [];
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function (...args: unknown[]) {
          const cal: CalApi = C.Cal as CalApi;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            const script = d.createElement('script');
            script.src = A;
            script.async = true;
            d.head.appendChild(script);
            cal.loaded = true;
          }
          if (args[0] === L) {
            const api: CalApi = function (...innerArgs: unknown[]) {
              p(api, innerArgs);
            };
            const namespace = args[1];
            api.q = api.q || [];
            if (typeof namespace === 'string') {
              cal.ns = cal.ns || {};
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], args);
              p(cal, ['initNamespace', namespace]);
            } else {
              p(cal, args);
            }
            return;
          }
          p(cal, args);
        };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    if (window.Cal) {
      window.Cal('init', { origin: 'https://cal.com' });

      // Theme Cal modal to match ThunSpark dark design language
      window.Cal('ui', {
        theme: 'dark',
        styles: {
          branding: {
            brandColor: '#FFD21F',
          },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    }
  }, [pathname]);

  return null;
}
