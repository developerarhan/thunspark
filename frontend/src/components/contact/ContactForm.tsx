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
} from 'lucide-react';
import { getAttributionPayload } from '@/components/analytics/AttributionTracker';
import { track } from '@/lib/analytics';
import {
  BUDGET_OPTIONS,
  CHALLENGE_PRESETS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  enquiryFormSchema,
  type EnquiryApiResponse,
  type EnquiryFieldErrors,
  type EnquiryFormValues,
} from '@/lib/enquiry-schema';
import { siteConfig } from '@/site.config';

interface TurnstileRenderOptions {
  sitekey: string;
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
    simulated?: boolean;
  } | null>(null);

  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileWidgetError, setTurnstileWidgetError] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!turnstileSiteKey) return;

    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !turnstileContainerRef.current || !window.turnstile) return;
      if (turnstileWidgetIdRef.current) return;

      turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: turnstileSiteKey,
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
      `Budget Range: ${formData.budgetRange || 'Not specified'}`,
      `Timeline: ${formData.timeline || 'Not specified'}`,
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
      setFieldErrors(flattened.fieldErrors as EnquiryFieldErrors);
      setStatus('error');
      setErrorMessage('Please fix the highlighted fields before submitting.');
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

  if (status === 'success' && successMeta) {
    const isAlreadyReceived = successMeta.code === 'ALREADY_RECEIVED';
    return (
      <Card className="p-8 sm:p-12 text-center bg-card border-line">
        <div className="w-16 h-16 rounded-full bg-elevated border border-accent text-accent flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        {successMeta.simulated && !isProduction && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-[#FFBF47] text-[#FFBF47] font-mono text-[11px] mb-4">
            DEV SIMULATION MODE (NO EMAIL DISPATCHED)
          </div>
        )}
        <h3 className="font-display font-medium text-2xl sm:text-3xl text-ink mb-3">
          {isAlreadyReceived ? 'Enquiry Already Received.' : 'Strategy Call Request Received.'}
        </h3>
        <p className="text-soft text-sm leading-relaxed max-w-md mx-auto mb-8">
          {isAlreadyReceived
            ? successMeta.message
            : `Thank you, ${formData.name}. ${successMeta.message}`}
        </p>
        <Button href="/" variant="secondary" size="md">
          <span>Return to Homepage</span>
        </Button>
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

        {/* Services Needed (Pills) */}
        <div>
          <span
            id={`${formId}-services-label`}
            className="font-mono text-xs uppercase tracking-wider text-ink block mb-2"
          >
            Disciplines you are interested in <span className="text-accent">*</span>
          </span>
          <div
            role="group"
            aria-labelledby={`${formId}-services-label`}
            aria-describedby={
              fieldErrors.servicesNeeded ? `${formId}-services-error` : undefined
            }
            className={`flex flex-wrap gap-2 p-3 rounded-lg border ${
              fieldErrors.servicesNeeded
                ? 'border-[#FF6464] bg-elevated'
                : 'border-transparent p-0'
            }`}
          >
            {SERVICE_OPTIONS.map((service) => {
              const isSelected = formData.servicesNeeded.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleService(service)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-accent text-canvas font-bold'
                      : 'bg-elevated text-soft border border-line hover:border-line-strong hover:text-ink'
                  }`}
                >
                  {service}
                </button>
              );
            })}
          </div>
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

        {/* Primary Business Challenge (20-1000 chars textarea + quick presets) */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <label
              htmlFor={`${formId}-challenge`}
              className="font-mono text-xs uppercase tracking-wider text-ink"
            >
              Primary Business Challenge <span className="text-accent">*</span>
            </label>
            <span
              className={`font-mono text-[11px] ${
                challengeLength > 1000 ? 'text-[#FF6464]' : 'text-meta'
              }`}
            >
              {challengeLength} / 1000
            </span>
          </div>

          {/* Optional Preset Quick-Starters */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {CHALLENGE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => updateField('businessChallenge', preset)}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-elevated text-meta border border-line hover:border-line-strong hover:text-ink transition-colors cursor-pointer text-left"
              >
                + {preset}
              </button>
            ))}
          </div>

          <textarea
            id={`${formId}-challenge`}
            rows={3}
            required
            placeholder="Describe the bottleneck holding back growth right now (minimum 20 characters)..."
            value={formData.businessChallenge}
            onChange={(e) => updateField('businessChallenge', e.target.value)}
            aria-invalid={Boolean(fieldErrors.businessChallenge)}
            aria-describedby={
              fieldErrors.businessChallenge ? `${formId}-challenge-error` : undefined
            }
            className={`w-full p-4 rounded-lg bg-elevated border text-sm text-ink placeholder:text-meta focus:outline-none focus:border-accent transition-colors ${
              fieldErrors.businessChallenge ? 'border-[#FF6464]' : 'border-line'
            }`}
          />
          {fieldErrors.businessChallenge?.[0] && (
            <p
              id={`${formId}-challenge-error`}
              role="alert"
              className="mt-1.5 text-xs text-[#FF6464]"
            >
              {fieldErrors.businessChallenge[0]}
            </p>
          )}
        </div>

        {/* Budget & Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor={`${formId}-budget`}
              className="font-mono text-xs uppercase tracking-wider text-ink block mb-2"
            >
              Monthly Growth Budget (Optional)
            </label>
            <select
              id={`${formId}-budget`}
              value={formData.budgetRange}
              onChange={(e) => updateField('budgetRange', e.target.value)}
              className={`w-full h-14 px-4 rounded-lg bg-elevated border border-line text-sm focus:outline-none focus:border-accent transition-colors ${
                formData.budgetRange ? 'text-ink' : 'text-meta'
              }`}
            >
              <option value="" className="bg-elevated text-meta">
                Select a range...
              </option>
              {BUDGET_OPTIONS.map((budget) => (
                <option key={budget} value={budget} className="bg-elevated text-ink">
                  {budget}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={`${formId}-timeline`}
              className="font-mono text-xs uppercase tracking-wider text-ink block mb-2"
            >
              Target Timeline (Optional)
            </label>
            <select
              id={`${formId}-timeline`}
              value={formData.timeline}
              onChange={(e) => updateField('timeline', e.target.value)}
              className={`w-full h-14 px-4 rounded-lg bg-elevated border border-line text-sm focus:outline-none focus:border-accent transition-colors ${
                formData.timeline ? 'text-ink' : 'text-meta'
              }`}
            >
              <option value="" className="bg-elevated text-meta">
                Select a timeline...
              </option>
              {TIMELINE_OPTIONS.map((t) => (
                <option key={t} value={t} className="bg-elevated text-ink">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

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
          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id={`${formId}-consent`}
              required
              checked={formData.consent}
              onChange={(e) => updateField('consent', e.target.checked)}
              aria-invalid={Boolean(fieldErrors.consent)}
              aria-describedby={fieldErrors.consent ? `${formId}-consent-error` : undefined}
              className="mt-1 w-4 h-4 rounded bg-elevated border border-line accent-accent focus:ring-0 focus:ring-offset-0 cursor-pointer"
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
              className="mt-1.5 text-xs text-[#FF6464] pl-7"
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
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full h-14 px-6 rounded-lg bg-accent hover:bg-accent-hi active:bg-accent-deep text-canvas font-display font-medium text-base transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
          </button>
        </div>
      </form>
    </Card>
  );
}
