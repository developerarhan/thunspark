'use client';

import { useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import {
  CONSENT_UPDATED_EVENT,
  getStoredConsent,
  type ConsentState,
} from '@/lib/analytics/gtm';

const FIRST_TOUCH_KEY = 'thunspark_first_touch';
const LAST_TOUCH_KEY = 'thunspark_last_touch';
const CLICK_IDS_KEY = 'thunspark_click_ids';

export function getAttributionPayload() {
  let firstTouch = {};
  let lastTouch = {};
  let clickIds = {};

  try {
    firstTouch = JSON.parse(Cookies.get(FIRST_TOUCH_KEY) || '{}');
    lastTouch = JSON.parse(Cookies.get(LAST_TOUCH_KEY) || '{}');
    clickIds = JSON.parse(Cookies.get(CLICK_IDS_KEY) || '{}');
  } catch {
    // ignore parse errors
  }

  return {
    first_touch: firstTouch,
    last_touch: lastTouch,
    ...clickIds,
  };
}

export function AttributionTracker() {
  const syncAttribution = useCallback((consent: ConsentState | null) => {
    if (typeof window === 'undefined') return;

    // Clear attribution & ad click ID cookies if consent is missing or revoked
    if (!consent?.analytics) {
      Cookies.remove(FIRST_TOUCH_KEY);
      Cookies.remove(LAST_TOUCH_KEY);
    }
    if (!consent?.marketing) {
      Cookies.remove(CLICK_IDS_KEY);
    }
    if (!consent?.analytics && !consent?.marketing) return;

    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');

    if (consent.analytics) {
      const currentTouch = {
        utm_source: utmSource || '',
        utm_medium: utmMedium || '',
        utm_campaign: utmCampaign || '',
        utm_term: utmTerm || '',
        utm_content: utmContent || '',
        landing_page: window.location.pathname,
        referrer: document.referrer || '',
        timestamp: new Date().toISOString(),
      };

      // Save First Touch if not already present
      if (!Cookies.get(FIRST_TOUCH_KEY)) {
        Cookies.set(FIRST_TOUCH_KEY, JSON.stringify(currentTouch), { expires: 90 });
      }

      // Always update Last Touch if UTM params exist or on landing
      if (utmSource || utmMedium || !Cookies.get(LAST_TOUCH_KEY)) {
        Cookies.set(LAST_TOUCH_KEY, JSON.stringify(currentTouch), { expires: 90 });
      }
    }

    if (consent.marketing) {
      const gclid = urlParams.get('gclid');
      const fbclid = urlParams.get('fbclid');
      const msclkid = urlParams.get('msclkid');

      let existingIds: { gclid?: string; fbclid?: string; msclkid?: string } = {};
      try {
        existingIds = JSON.parse(Cookies.get(CLICK_IDS_KEY) || '{}') as typeof existingIds;
      } catch {
        existingIds = {};
      }

      const updatedIds = {
        gclid: gclid || existingIds.gclid || '',
        fbclid: fbclid || existingIds.fbclid || '',
        msclkid: msclkid || existingIds.msclkid || '',
      };
      Cookies.set(CLICK_IDS_KEY, JSON.stringify(updatedIds), { expires: 90 });
    }
  }, []);

  useEffect(() => {
    syncAttribution(getStoredConsent());

    const handleConsentUpdate = (event: Event) => {
      const custom = event as CustomEvent<ConsentState>;
      syncAttribution(custom.detail ?? getStoredConsent());
    };

    window.addEventListener(CONSENT_UPDATED_EVENT, handleConsentUpdate);
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, handleConsentUpdate);
  }, [syncAttribution]);

  return null;
}
