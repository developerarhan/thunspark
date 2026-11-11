'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  CONSENT_UPDATED_EVENT,
  getStoredConsent,
  pushDataLayer,
  type ConsentState,
} from '@/lib/analytics/gtm';

export function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string>('');

  const trackPageView = useCallback((consent: ConsentState | null) => {
    if (typeof window === 'undefined' || !consent?.analytics) return;

    const query = searchParams?.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;

    if (lastTrackedPath.current !== fullPath) {
      lastTrackedPath.current = fullPath;
      pushDataLayer({
        event: 'virtual_page_view',
        page_location: window.location.href,
        page_path: fullPath,
        page_title: document.title,
        timestamp: new Date().toISOString(),
      });
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    trackPageView(getStoredConsent());

    const handleConsentUpdate = (event: Event) => {
      const custom = event as CustomEvent<ConsentState>;
      const consent = custom.detail ?? getStoredConsent();
      if (!consent?.analytics) {
        lastTrackedPath.current = '';
        return;
      }
      trackPageView(consent);
    };

    window.addEventListener(CONSENT_UPDATED_EVENT, handleConsentUpdate);
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, handleConsentUpdate);
  }, [trackPageView]);

  return null;
}
