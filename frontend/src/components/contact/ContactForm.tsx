'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Mail,
  ShieldAlert,
  ChevronDown,
  Check,
} from 'lucide-react';
import { getAttributionPayload } from '@/components/analytics/AttributionTracker';
import { track } from '@/lib/analytics';
import {
  CHALLENGE_PRESETS,
  SERVICE_OPTIONS,
  enquiryFormSchema,
  type EnquiryApiResponse,
  type EnquiryFieldErrors,
  type EnquiryFormValues,
} from '@/lib/enquiry-schema';
import { siteConfig } from '@/site.config';
import { getCalLink } from '@/lib/booking';

interface TurnstileRenderOptions {
  sitekey: string;
  action?: string;
  theme?: 'light' | 'dark' | 'auto';
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-explicit-script';
const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export function ContactForm() {
  const formId = useId();
  const isProduction = process.env.NODE_ENV === 'production';
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || '';

  const [formData, setFormData] = useState<EnquiryFormValues & { website_hp: string }>({
    name: '',
    workEmail: '',
    company: '',
    website: '',
    servicesNeeded: [],
    businessChallenge: '',
    budgetRange: '',
    timeline: '',
    message: '',
    consent: false,
    website_hp: '',
  });

  const [fieldErrors, setFieldErrors] = useState<EnquiryFieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMeta, setSuccessMeta] = useState<{
    code: string;
    message: string;
    leadId?: string;
    simulated?: boolean;
  } | null>(null);

  // In-page calendar scheduling states
  const [bookingStatus, setBookingStatus] = useState<'pending' | 'booked'>('pending');
  const [bookedDetails, setBookedDetails] = useState<{
    date?: string;
    time?: string;
    eventTitle?: string;
  } | null>(null);

  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileWidgetError, setTurnstileWidgetError] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const consentInputRef = useRef<HTMLInputElement | null>(null);
  const [highlightConsent, setHighlightConsent] = useState(false);

  // Dropdown states for streamlined compact form
  const [isDisciplinesOpen, setIsDisciplinesOpen] = useState(false);
  const [isCustomChallenge, setIsCustomChallenge] = useState(false);
  const disciplinesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (disciplinesRef.current && !disciplinesRef.current.contains(event.target as Node)) {
        setIsDisciplinesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!turnstileSiteKey) return;

    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !turnstileContainerRef.current || !window.turnstile) return;
      if (turnstileWidgetIdRef.current) return;

      turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: turnstileSiteKey,
        action: 'enquiry',
        theme: 'dark',
        callback: (token: string) => {
          if (!isMounted) return;
          setTurnstileToken(token);
          setTurnstileWidgetError('');
        },
        'expired-callback': () => {
          if (!isMounted) return;
          setTurnstileToken('');
          setTurnstileWidgetError('Security check expired. Please verify again.');
        },
        'error-callback': () => {
          if (!isMounted) return;
          setTurnstileToken('');
          setTurnstileWidgetError(
            'Security verification widget failed to load. You can email us directly below.'
          );
        },
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      let script = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
      const handleLoad = () => renderWidget();

      if (!script) {
        script = document.createElement('script');
        script.id = TURNSTILE_SCRIPT_ID;
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', handleLoad);

      return () => {
        isMounted = false;
        script?.removeEventListener('load', handleLoad);
        if (turnstileWidgetIdRef.current && window.turnstile) {
          window.turnstile.remove(turnstileWidgetIdRef.current);
          turnstileWidgetIdRef.current = null;
        }
      };
    }

    return () => {
      isMounted = false;
      if (turnstileWidgetIdRef.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [turnstileSiteKey]);

  const resetTurnstile = () => {
    setTurnstileToken('');
    if (turnstileWidgetIdRef.current && window.turnstile) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
    }
  };

  const clearFieldError = (field: keyof EnquiryFormValues) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateField = <K extends keyof EnquiryFormValues>(
    field: K,
    value: EnquiryFormValues[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const toggleService = (service: string) => {
    setFormData((prev) => {
      const exists = prev.servicesNeeded.includes(service);
      return {
        ...prev,
        servicesNeeded: exists
          ? prev.servicesNeeded.filter((s) => s !== service)
          : [...prev.servicesNeeded, service],
      };
    });
    clearFieldError('servicesNeeded');
  };

  const buildMailtoUrl = (): string => {
    const subject = `Growth Strategy Enquiry — ${formData.company || formData.name || 'New Lead'}`;
    const bodyLines = [
      `Name: ${formData.name || 'N/A'}`,
      `Work Email: ${formData.workEmail || 'N/A'}`,
      `Company: ${formData.company || 'N/A'}`,
      `Website: ${formData.website || 'N/A'}`,
      `Services Interested In: ${formData.servicesNeeded.join(', ') || 'Not selected'}`,
      '',
      'Primary Business Challenge:',
      formData.businessChallenge || 'N/A',
      '',
      'Additional Context:',
      formData.message || 'None',
    ];

    const params = new URLSearchParams({
      subject,
      body: bodyLines.join('\n'),
    });

    return `mailto:${siteConfig.contact.email}?${params.toString()}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const parsed = enquiryFormSchema.safeParse(formData);
    if (!parsed.success) {
      const flattened = z.flattenError(parsed.error);
      const errors = flattened.fieldErrors as EnquiryFieldErrors;
      setFieldErrors(errors);
      setStatus('error');
      setErrorMessage('Please fix the highlighted fields before submitting.');

      // If consent is missing, scroll directly to consent and highlight it
      if (errors.consent) {
        setHighlightConsent(true);
        consentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        consentInputRef.current?.focus();
        setTimeout(() => setHighlightConsent(false), 2000);
      } else {
        const firstFieldKey = Object.keys(errors)[0];
        if (firstFieldKey) {
          const el = document.getElementById(`${formId}-${firstFieldKey}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el?.focus();
        }
      }
      return;
    }

    setFieldErrors({});

    if (isProduction && !turnstileSiteKey) {
      setStatus('error');
      setErrorMessage(
        'Security verification is not configured on this environment. Your details have been kept below so you can email us directly.'
      );
      return;
    }

    if (turnstileSiteKey && !turnstileToken) {
      setStatus('error');
      setErrorMessage('Please complete the Cloudflare security check above before submitting.');
      return;
    }

    setStatus('submitting');

    try {
      const attribution = getAttributionPayload();
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...parsed.data,
          website_hp: formData.website_hp,
          turnstileToken,
          attribution,
        }),
      });

      let data: EnquiryApiResponse | null = null;
      try {
        data = (await res.json()) as EnquiryApiResponse;
      } catch {
        data = null;
      }

      if (!res.ok || !data || !data.success || (isProduction && data.simulated)) {
        if (data?.fieldErrors) {
          setFieldErrors(data.fieldErrors as EnquiryFieldErrors);
        }
        resetTurnstile();
        setStatus('error');
        setErrorMessage(
          data?.message ||
            'Unable to submit your enquiry right now. Your details are preserved below so you can send them directly via email.'
        );
        return;
      }

      setSuccessMeta({
        code: data.code,
        message: data.message,
        leadId: data.leadId,
        simulated: data.simulated,
      });
      setStatus('success');

      // Track generate_lead after a confirmed API success only (never on failed or simulated send)
      if (!data.simulated) {
        track('generate_lead', {
          form_id: 'contact_enquiry_form',
          services_count: formData.servicesNeeded.length,
          ...(formData.budgetRange ? { budget_range: formData.budgetRange } : {}),
        });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Network error while submitting your enquiry.';
      resetTurnstile();
      setStatus('error');
      setErrorMessage(
        `${message} Your details are preserved below so you can email us directly.`
      );
    }
  };

  useEffect(() => {
    if (status !== 'success') return;

    // Listen for Cal.com booking confirmation events (embed iframe postMessage or window.Cal)
    const handleMessage = (e: MessageEvent) => {
      try {
        const raw = e.data;
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const action = data?.type || data?.action || data?.event;

        if (
          action === 'cal:bookingSuccessful' ||
          action === 'bookingSuccessful' ||
          action === 'BOOKING_SUCCESSFUL'
        ) {
          console.log('✅ [Cal In-Page Event] Booking confirmed:', data);
          const payload = data?.data || data?.payload || {};
          handleBookingConfirmed(payload);
        }
      } catch {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [status, successMeta?.leadId, formData.workEmail]);

  const handleBookingConfirmed = async (bookingData?: any) => {
    setBookingStatus('booked');
    setBookedDetails({
      date:
        bookingData?.date ||
        (bookingData?.startTime
          ? new Date(bookingData.startTime).toLocaleDateString()
          : undefined),
      time: bookingData?.time,
      eventTitle: bookingData?.eventTitle || 'Growth Strategy Call',
    });

    try {
      await fetch('/api/crm/leads/record-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: successMeta?.leadId,
          email: formData.workEmail,
          bookingDetails: {
            eventTitle: bookingData?.eventTitle || 'Growth Strategy Call',
            date: bookingData?.date,
            time: bookingData?.time,
            url: bookingData?.bookingUrl,
          },
        }),
      });
    } catch (e) {
      console.error('Failed to sync booking to CRM:', e);
    }
  };

  if (status === 'success' && successMeta) {
    const isAlreadyReceived = successMeta.code === 'ALREADY_RECEIVED';
    const calSlug = getCalLink() || 'thunspark/strategy';

    if (bookingStatus === 'booked') {
      return (
        <Card className="p-8 sm:p-12 text-center bg-card border-line animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs mb-4">
            STRATEGY CALL CONFIRMED
          </div>
          <h3 className="font-display font-medium text-2xl sm:text-3xl text-ink mb-3">
            You&apos;re All Set, {formData.name}!
          </h3>
          <p className="text-soft text-sm leading-relaxed max-w-md mx-auto mb-6">
            Your strategy consultation is booked and your lead status has been advanced in our CRM. A calendar invitation with video conference coordinates has been dispatched to{' '}
            <strong className="text-ink">{formData.workEmail}</strong>.
          </p>

          <div className="p-4 rounded-xl bg-elevated border border-line max-w-sm mx-auto mb-8 text-left space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-meta">Brand / Company:</span>
              <span className="text-ink font-semibold">{formData.company}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-meta">Disciplines:</span>
              <span className="text-accent font-semibold">
                {formData.servicesNeeded.join(', ') || 'Growth Strategy'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-meta">Pipeline Stage:</span>
              <span className="text-emerald-400 font-semibold">Discovery Session Confirmed</span>
            </div>
          </div>

          <Button href="/" variant="secondary" size="md">
            <span>Return to Homepage</span>
          </Button>
        </Card>
      );
    }

    return (
      <Card className="p-6 sm:p-8 bg-card border-line space-y-6 animate-in fade-in duration-300">
        {/* Step Indicator Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[11px] mb-2">
              STEP 2 OF 2: IN-PAGE SCHEDULER
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-ink">
              Choose Your Strategy Call Time
            </h3>
            <p className="text-xs text-soft mt-1 leading-relaxed">
              {isAlreadyReceived
                ? 'Your enquiry is logged in our CRM. Select a convenient time below for your 30-minute growth consultation:'
                : `Thank you, ${formData.name}. Your details are recorded in our CRM pipeline. Pick a 30-minute strategy slot below:`}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 font-mono text-xs text-meta bg-elevated px-3 py-1.5 rounded-lg border border-line">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Lead Saved to CRM</span>
          </div>
        </div>

        {/* Embedded Dark Themed Calendar */}
        <div className="w-full min-h-[620px] rounded-xl overflow-hidden border border-line bg-base relative">
          <iframe
            src={`https://cal.com/${calSlug}?embed=true&layout=month_view&theme=dark&name=${encodeURIComponent(
              formData.name
            )}&email=${encodeURIComponent(formData.workEmail)}`}
            title="Schedule Your Strategy Call"
            className="w-full h-[620px] border-0"
            allow="camera; microphone; autoplay; fullscreen"
          />
        </div>

        {/* Escape Hatch / Book Later */}
        <div className="pt-2 text-center space-y-3">
          <p className="text-xs text-meta">
            Prefer to pick a time later? We have also sent a direct booking link to{' '}
            <span className="text-ink font-mono">{formData.workEmail}</span>.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button href="/" variant="secondary" size="sm">
              <span>Skip &amp; Return to Homepage</span>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const challengeLength = formData.businessChallenge.trim().length;
  const mailtoUrl = buildMailtoUrl();

  return (
    <Card className="p-6 sm:p-10 bg-card border-line">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Hidden Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="website_hp"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website_hp}
            onChange={(e) => setFormData((prev) => ({ ...prev, website_hp: e.target.value }))}
          />
        </div>

        {/* Name & Work Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor={`${formId}-name`}
              className="font-mono text-xs uppercase tracking-wider text-ink block mb-2"
            >
              Your Name <span className="text-accent">*</span>
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              required
              placeholder="Sarah Chen"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? `${formId}-name-error` : undefined}
              className={`w-full h-14 px-4 rounded-lg bg-elevated border text-sm text-ink placeholder:text-meta focus:outline-none focus:border-accent transition-colors ${
                fieldErrors.name ? 'border-[#FF6464]' : 'border-line'
              }`}
            />
            {fieldErrors.name?.[0] && (
              <p
                id={`${formId}-name-error`}
                role="alert"
                className="mt-1.5 text-xs text-[#FF6464]"
              >
                {fieldErrors.name[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`${formId}-workEmail`}
              className="font-mono text-xs uppercase tracking-wider text-ink block mb-2"
            >
              Work Email <span className="text-accent">*</span>
            </label>
            <input
              id={`${formId}-workEmail`}
              type="email"
              required
              placeholder="sarah@company.com"
              value={formData.workEmail}
              onChange={(e) => updateField('workEmail', e.target.value)}
              aria-invalid={Boolean(fieldErrors.workEmail)}
              aria-describedby={fieldErrors.workEmail ? `${formId}-workEmail-error` : undefined}
              className={`w-full h-14 px-4 rounded-lg bg-elevated border text-sm text-ink placeholder:text-meta focus:outline-none focus:border-accent transition-colors ${
                fieldErrors.workEmail ? 'border-[#FF6464]' : 'border-line'
              }`}
            />
            {fieldErrors.workEmail?.[0] && (
              <p
                id={`${formId}-workEmail-error`}
                role="alert"
                className="mt-1.5 text-xs text-[#FF6464]"
              >
                {fieldErrors.workEmail[0]}
              </p>
            )}
          </div>
        </div>

        {/* Company & Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor={`${formId}-company`}
              className="font-mono text-xs uppercase tracking-wider text-ink block mb-2"
            >
              Company / Brand <span className="text-accent">*</span>
            </label>
            <input
              id={`${formId}-company`}
              type="text"
              required
              placeholder="Acme Growth Inc."
              value={formData.company}
              onChange={(e) => updateField('company', e.target.value)}
              aria-invalid={Boolean(fieldErrors.company)}
              aria-describedby={fieldErrors.company ? `${formId}-company-error` : undefined}
              className={`w-full h-14 px-4 rounded-lg bg-elevated border text-sm text-ink placeholder:text-meta focus:outline-none focus:border-accent transition-colors ${
                fieldErrors.company ? 'border-[#FF6464]' : 'border-line'
              }`}
            />
            {fieldErrors.company?.[0] && (
              <p
                id={`${formId}-company-error`}
                role="alert"
                className="mt-1.5 text-xs text-[#FF6464]"
              >
                {fieldErrors.company[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`${formId}-website`}
              className="font-mono text-xs uppercase tracking-wider text-ink block mb-2"
            >
              Website URL (Optional)
            </label>
            <input
              id={`${formId}-website`}
              type="url"
              placeholder="https://company.com"
              value={formData.website}
              onChange={(e) => updateField('website', e.target.value)}
              aria-invalid={Boolean(fieldErrors.website)}
              aria-describedby={fieldErrors.website ? `${formId}-website-error` : undefined}
              className={`w-full h-14 px-4 rounded-lg bg-elevated border text-sm text-ink placeholder:text-meta focus:outline-none focus:border-accent transition-colors ${
                fieldErrors.website ? 'border-[#FF6464]' : 'border-line'
              }`}
            />
            {fieldErrors.website?.[0] && (
              <p
                id={`${formId}-website-error`}
                role="alert"
                className="mt-1.5 text-xs text-[#FF6464]"
              >
                {fieldErrors.website[0]}
              </p>
            )}
          </div>
        </div>

        {/* Disciplines & Primary Challenge Dropdowns (Compact 2-Column Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Disciplines Dropdown */}
          <div ref={disciplinesRef} className="relative">
            <label
              id={`${formId}-services-label`}
              className="font-mono text-xs uppercase tracking-wider text-ink block mb-2"
            >
              Disciplines Interested In <span className="text-accent">*</span>
            </label>
            <button
              id={`${formId}-servicesNeeded`}
              type="button"
              onClick={() => setIsDisciplinesOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isDisciplinesOpen}
              className={`w-full h-14 px-4 rounded-lg bg-elevated border text-sm text-left flex items-center justify-between transition-colors cursor-pointer ${
                fieldErrors.servicesNeeded
                  ? 'border-[#FF6464]'
                  : isDisciplinesOpen
                    ? 'border-accent'
                    : 'border-line'
              }`}
            >
              <div className="truncate pr-2">
                {formData.servicesNeeded.length === 0 ? (
                  <span className="text-meta">Select disciplines...</span>
                ) : formData.servicesNeeded.length <= 2 ? (
                  <span className="text-ink font-medium">
                    {formData.servicesNeeded.join(', ')}
                  </span>
                ) : (
                  <span className="text-ink font-medium">
                    {formData.servicesNeeded.slice(0, 2).join(', ')}{' '}
                    <span className="text-accent text-xs font-mono font-bold">
                      (+{formData.servicesNeeded.length - 2} more)
                    </span>
                  </span>
                )}
              </div>
              <ChevronDown
                size={16}
                className={`text-meta shrink-0 transition-transform duration-200 ${
                  isDisciplinesOpen ? 'rotate-180 text-accent' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDisciplinesOpen && (
              <div className="absolute z-30 left-0 right-0 mt-2 p-2 bg-[#12141a] border border-line-strong rounded-xl shadow-2xl max-h-64 overflow-y-auto space-y-1">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-line/60 mb-1 text-[11px] font-mono text-meta">
                  <span>{formData.servicesNeeded.length} of {SERVICE_OPTIONS.length} selected</span>
                  {formData.servicesNeeded.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, servicesNeeded: [] }))}
                      className="text-soft hover:text-accent transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                {SERVICE_OPTIONS.map((service) => {
                  const isSelected = formData.servicesNeeded.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-accent/15 text-accent font-semibold'
                          : 'text-soft hover:bg-elevated hover:text-ink'
                      }`}
                    >
                      <span>{service}</span>
                      {isSelected && <Check size={14} className="text-accent shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            )}

            {fieldErrors.servicesNeeded?.[0] && (
              <p
                id={`${formId}-services-error`}
                role="alert"
                className="mt-1.5 text-xs text-[#FF6464]"
              >
                {fieldErrors.servicesNeeded[0]}
              </p>
            )}
          </div>

          {/* Primary Business Challenge Dropdown */}
          <div>
            <label
              htmlFor={`${formId}-businessChallenge`}
              className="font-mono text-xs uppercase tracking-wider text-ink block mb-2"
            >
              Primary Business Challenge <span className="text-accent">*</span>
            </label>
            <div className="relative">
              <select
                id={`${formId}-businessChallenge`}
                value={
                  isCustomChallenge
                    ? 'custom'
                    : CHALLENGE_PRESETS.includes(formData.businessChallenge as any)
                      ? formData.businessChallenge
                      : formData.businessChallenge
                        ? 'custom'
                        : ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom') {
                    setIsCustomChallenge(true);
                    updateField('businessChallenge', '');
                  } else if (val) {
                    setIsCustomChallenge(false);
                    updateField('businessChallenge', val);
                  } else {
                    setIsCustomChallenge(false);
                    updateField('businessChallenge', '');
                  }
                }}
                aria-invalid={Boolean(fieldErrors.businessChallenge)}
                aria-describedby={
                  fieldErrors.businessChallenge ? `${formId}-challenge-error` : undefined
                }
                className={`w-full h-14 px-4 pr-10 rounded-lg bg-elevated border text-sm focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer ${
                  formData.businessChallenge || isCustomChallenge ? 'text-ink' : 'text-meta'
                } ${fieldErrors.businessChallenge ? 'border-[#FF6464]' : 'border-line'}`}
              >
                <option value="" className="bg-[#12141a] text-meta">
                  Select primary challenge...
                </option>
                {CHALLENGE_PRESETS.map((preset) => (
                  <option key={preset} value={preset} className="bg-[#12141a] text-ink">
                    {preset}
                  </option>
                ))}
                <option value="custom" className="bg-[#12141a] text-accent font-medium">
                  ✏️ Other / Custom Challenge...
                </option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-meta pointer-events-none"
              />
            </div>

            {fieldErrors.businessChallenge?.[0] && !isCustomChallenge && (
              <p
                id={`${formId}-challenge-error`}
                role="alert"
                className="mt-1.5 text-xs text-[#FF6464]"
              >
                {fieldErrors.businessChallenge[0]}
              </p>
            )}
          </div>
        </div>

        {/* Custom Challenge Detail Textarea (revealed only if custom is chosen) */}
        {isCustomChallenge && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[11px] font-mono text-meta">
              <span>Describe your custom bottleneck <span className="text-accent">*</span></span>
              <span className={challengeLength > 1000 ? 'text-[#FF6464]' : ''}>
                {challengeLength} / 1000
              </span>
            </div>
            <textarea
              id={`${formId}-businessChallenge`}
              rows={2}
              required
              placeholder="Describe the bottleneck holding back growth right now (minimum 20 characters)..."
              value={formData.businessChallenge}
              onChange={(e) => updateField('businessChallenge', e.target.value)}
              aria-invalid={Boolean(fieldErrors.businessChallenge)}
              className={`w-full p-3 rounded-lg bg-elevated border text-sm text-ink placeholder:text-meta focus:outline-none focus:border-accent transition-colors ${
                fieldErrors.businessChallenge ? 'border-[#FF6464]' : 'border-line'
              }`}
            />
            {fieldErrors.businessChallenge?.[0] && (
              <p
                role="alert"
                className="mt-1 text-xs text-[#FF6464]"
              >
                {fieldErrors.businessChallenge[0]}
              </p>
            )}
          </div>
        )}

        {/* Message / Context */}
        <div>
          <label
            htmlFor={`${formId}-message`}
            className="font-mono text-xs uppercase tracking-wider text-ink block mb-2"
          >
            Additional Context & Goals (Optional)
          </label>
          <textarea
            id={`${formId}-message`}
            rows={3}
            placeholder="Share what you have tried, what currently works, or target milestones for the next 90 days..."
            value={formData.message}
            onChange={(e) => updateField('message', e.target.value)}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? `${formId}-message-error` : undefined}
            className={`w-full p-4 rounded-lg bg-elevated border text-sm text-ink placeholder:text-meta focus:outline-none focus:border-accent transition-colors ${
              fieldErrors.message ? 'border-[#FF6464]' : 'border-line'
            }`}
          />
          {fieldErrors.message?.[0] && (
            <p
              id={`${formId}-message-error`}
              role="alert"
              className="mt-1.5 text-xs text-[#FF6464]"
            >
              {fieldErrors.message[0]}
            </p>
          )}
        </div>

        {/* Cloudflare Turnstile Widget / Configuration Notice */}
        <div>
          {turnstileSiteKey ? (
            <div className="space-y-2">
              <div
                ref={turnstileContainerRef}
                className="min-h-[65px] rounded-lg bg-elevated border border-line p-2 flex items-center"
              />
              {turnstileWidgetError && (
                <p role="alert" className="text-xs text-[#FF6464]">
                  {turnstileWidgetError}
                </p>
              )}
            </div>
          ) : isProduction ? (
            <div
              role="alert"
              className="p-4 rounded-lg bg-elevated border border-[#FFBF47] text-xs text-soft flex items-start gap-3"
            >
              <ShieldAlert size={16} className="text-[#FFBF47] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-ink font-medium">
                  Automated form verification is currently unavailable.
                </p>
                <p>
                  You can still fill out your details and click below to send directly via email,
                  or write to{' '}
                  <a
                    href={mailtoUrl}
                    className="text-accent underline hover:text-accent-hi"
                  >
                    {siteConfig.contact.email}
                  </a>
                  .
                </p>
              </div>
            </div>
          ) : (
            <div className="px-3 py-2 rounded-lg bg-elevated border border-line font-mono text-[11px] text-meta">
              [Dev Mode] Turnstile widget skipped (NEXT_PUBLIC_TURNSTILE_SITE_KEY not set).
            </div>
          )}
        </div>

        {/* Consent Checkbox */}
        <div>
          <div
            className={`flex items-start gap-3 p-2.5 -m-2.5 rounded-xl transition-all duration-300 ${
              highlightConsent
                ? 'bg-accent/10 ring-2 ring-accent/60 shadow-[0_0_16px_rgba(255,210,31,0.2)]'
                : fieldErrors.consent
                  ? 'bg-[#FF6464]/10 ring-1 ring-[#FF6464]/50'
                  : ''
            }`}
          >
            <input
              ref={consentInputRef}
              type="checkbox"
              id={`${formId}-consent`}
              required
              checked={formData.consent}
              onChange={(e) => {
                updateField('consent', e.target.checked);
                if (e.target.checked) {
                  setHighlightConsent(false);
                }
              }}
              aria-invalid={Boolean(fieldErrors.consent)}
              aria-describedby={fieldErrors.consent ? `${formId}-consent-error` : undefined}
              className={`mt-1 w-4 h-4 rounded bg-elevated border accent-accent focus:ring-0 focus:ring-offset-0 cursor-pointer ${
                fieldErrors.consent ? 'border-[#FF6464]' : 'border-line'
              }`}
            />
            <label
              htmlFor={`${formId}-consent`}
              className="text-xs text-soft leading-relaxed cursor-pointer"
            >
              I agree to the processing of my details according to the{' '}
              <Link href="/privacy-policy" className="text-accent hover:underline">
                Privacy Policy
              </Link>
              . We will never share or sell your company information.{' '}
              <span className="text-accent">*</span>
            </label>
          </div>
          {fieldErrors.consent?.[0] && (
            <p
              id={`${formId}-consent-error`}
              role="alert"
              className="mt-1.5 text-xs text-[#FF6464] pl-7 font-medium"
            >
              {fieldErrors.consent[0]}
            </p>
          )}
        </div>

        {/* Error Alert + Prefilled Mailto Fallback */}
        {status === 'error' && errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-lg bg-elevated border border-[#FF6464] text-xs space-y-3"
          >
            <div className="flex items-start gap-2.5 text-[#FF6464]">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
            <div className="pt-2 border-t border-line flex flex-wrap items-center justify-between gap-3">
              <span className="text-soft">
                Prefer direct email? Your entered details are prefilled:
              </span>
              <a
                href={mailtoUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card border border-line-strong hover:border-accent text-accent font-mono text-xs font-medium transition-colors"
              >
                <Mail size={14} />
                <span>Email {siteConfig.contact.email}</span>
              </a>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={status === 'submitting'}
            className="w-full h-14 font-display text-base"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Submitting request...</span>
              </>
            ) : (
              <>
                <span>Book a strategy call</span>
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
