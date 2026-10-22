/**
 * Type-safe DataLayer & Google Tag Manager helper.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
  }
}

export type ConsentStatus = 'granted' | 'denied';

export interface ConsentConfig {
  analytics_storage: ConsentStatus;
  ad_storage: ConsentStatus;
  ad_user_data: ConsentStatus;
  ad_personalization: ConsentStatus;
}

export function pushDataLayer(eventData: Record<string, any>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventData);
}

/**
 * Updates Google Consent Mode v2 state across tag containers.
 */
export function updateGoogleConsent(consent: {
  analytics: boolean;
  marketing: boolean;
}) {
  const consentParams: ConsentConfig = {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
  };

  pushDataLayer({
    event: 'consent_update',
    consent: consentParams,
  });

  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('consent', 'update', consentParams);
  }
}

/**
 * Tracks CTA clicks across site components with location metadata.
 */
export function trackCTAClick(ctaName: string, location: string, metadata?: Record<string, any>) {
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
  extra?: Record<string, any>
) {
  pushDataLayer({
    event: `form_${action}`,
    form_name: formName,
    step_number: stepNumber,
    ...extra,
    timestamp: new Date().toISOString(),
  });
}
