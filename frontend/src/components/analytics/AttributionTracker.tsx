'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';

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
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');

    const gclid = urlParams.get('gclid');
    const fbclid = urlParams.get('fbclid');
    const msclkid = urlParams.get('msclkid');

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

    // Save ad platform click IDs
    const existingIds = JSON.parse(Cookies.get(CLICK_IDS_KEY) || '{}');
    const updatedIds = {
      gclid: gclid || existingIds.gclid || '',
      fbclid: fbclid || existingIds.fbclid || '',
      msclkid: msclkid || existingIds.msclkid || '',
    };
    Cookies.set(CLICK_IDS_KEY, JSON.stringify(updatedIds), { expires: 90 });
  }, []);

  return null;
}
