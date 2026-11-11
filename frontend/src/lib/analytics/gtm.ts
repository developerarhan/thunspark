import Cookies from 'js-cookie';

/**
 * Type-safe DataLayer & Google Tag Manager helper.
 */

export const CONSENT_COOKIE_KEY = 'thunspark_cookie_consent';
export const CONSENT_UPDATED_EVENT = 'thunspark:consent-updated';

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
}

export type DataLayerPayload = Record<string, unknown>;

type GtagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: DataLayerPayload[];
    gtag?: GtagFunction;
  }
}

export type ConsentStatus = 'granted' | 'denied';

export interface ConsentConfig {
  analytics_storage: ConsentStatus;
  ad_storage: ConsentStatus;
  ad_user_data: ConsentStatus;
  ad_personalization: ConsentStatus;
}

export function getStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  const raw = Cookies.get(CONSENT_COOKIE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { analytics?: unknown; marketing?: unknown };
    return {
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return null;
  }
}

export function pushDataLayer(eventData: DataLayerPayload) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventData);
}

/**
 * Updates Google Consent Mode v2 state across tag containers and notifies client trackers.
 */
export function updateGoogleConsent(consent: ConsentState) {
  const consentParams: ConsentConfig = {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
  };

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', consentParams);
  }

  pushDataLayer({
    event: 'consent_update',
    consent: consentParams,
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<ConsentState>(CONSENT_UPDATED_EVENT, { detail: consent })
    );
  }
}

/**
 * Tracks CTA clicks across site components with location metadata.
 */
export function trackCTAClick(
  ctaName: string,
  location: string,
  metadata?: DataLayerPayload
) {
  if (!getStoredConsent()?.analytics) return;

  pushDataLayer({
    event: 'cta_click',
    cta_name: ctaName,
    cta_location: location,
    ...metadata,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Tracks Form lifecycle transitions.
 */
export function trackFormEvent(
  formName: string,
  action: 'start' | 'step_advance' | 'submit' | 'success' | 'error',
  stepNumber?: number,
  extra?: DataLayerPayload
) {
  if (!getStoredConsent()?.analytics) return;

  pushDataLayer({
    event: `form_${action}`,
    form_name: formName,
    step_number: stepNumber,
    ...extra,
    timestamp: new Date().toISOString(),
  });
}
