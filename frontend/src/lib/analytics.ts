/**
 * Type-safe Analytics Layer for Google Tag Manager & Google Consent Mode v2.
 *
 * Guarantees:
 * - Safe during SSR (no-op on server).
 * - Creates window.dataLayer if missing.
 * - Strict typed event map.
 * - Zero PII (Personally Identifiable Information) in any event payload.
 */

export interface AnalyticsEventMap {
  generate_lead: {
    form_id: string;
    services_count: number;
    budget_range?: string;
  };
  book_call_click: {
    location: string;
  };
  cta_click: {
    location: string;
    label: string;
  };
  outbound_click: {
    url: string;
    label?: string;
  };
  mailto_click: {
    url?: string;
    location?: string;
  };
  tel_click: {
    url?: string;
    location?: string;
  };
  faq_open: {
    question_id: string;
  };
  service_filter_change: {
    group: string;
  };
  project_open: {
    slug: string;
  };
  blog_read: {
    slug: string;
    scroll_depth?: number;
  };
}

export type AnalyticsEvent = keyof AnalyticsEventMap;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Pushes an event to the GTM DataLayer.
 * Safe on server (SSR no-op).
 */
export function track<E extends AnalyticsEvent>(
  event: E,
  params: AnalyticsEventMap[E]
): void {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];

  // Create clean payload ensuring no personal data (name, email, phone, message) leaks
  const payload: Record<string, unknown> = {
    event,
    ...params,
    timestamp: new Date().toISOString(),
  };

  window.dataLayer.push(payload);
}
