import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import {
  enquiryPayloadSchema,
  type EnquiryApiResponse,
} from '@/lib/enquiry-schema';
import {
  checkInMemoryRateLimit,
  checkInMemoryDedupe,
  recordInMemoryDedupe,
  checkDurableEnquiryGuard,
  getClientIp,
} from '@/lib/enquiry-guard';
import { siteConfig } from '@/site.config';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

type TurnstileCheckResult =
  | { ok: true; simulated: boolean }
  | { ok: false; status: 400 | 403 | 503; code: string; message: string };

function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp: string,
  isProduction: boolean
): Promise<TurnstileCheckResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    if (isProduction) {
      return {
        ok: false,
        status: 503,
        code: 'TURNSTILE_NOT_CONFIGURED',
        message: 'Security verification is temporarily unavailable. Please email us directly.',
      };
    }
    console.log('⚡ [DEV] Turnstile verification simulated (TURNSTILE_SECRET_KEY not set).');
    return { ok: true, simulated: true };
  }

  if (!token || token.trim().length === 0) {
    if (!isProduction) {
      console.log('⚡ [DEV] Turnstile verification bypassed (no token submitted in dev).');
      return { ok: true, simulated: true };
    }
    return {
      ok: false,
      status: 400,
      code: 'TURNSTILE_MISSING',
      message: 'Please complete the security verification check before submitting.',
    };
  }

  try {
    const formParams = new URLSearchParams({
      secret: secretKey,
      response: token,
    });
    if (remoteIp !== 'unknown') {
      formParams.set('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formParams,
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return {
        ok: false,
        status: 503,
        code: 'TURNSTILE_UNAVAILABLE',
        message: 'Security verification service returned an unexpected error. Please try again or email us directly.',
      };
    }

    const outcome = (await res.json()) as TurnstileVerifyResponse;
    if (outcome.success !== true) {
      const errorCodes = outcome['error-codes'] || [];
      console.error('[Turnstile Error] Verification rejected by Cloudflare:', errorCodes);

      const isSecretOrConfigError = errorCodes.some((code) =>
        ['missing-input-secret', 'invalid-input-secret', 'bad-request', 'internal-error'].includes(code)
      );

      const isExpiredOrUsed = errorCodes.some((code) =>
        ['timeout-or-duplicate', 'invalid-input-response'].includes(code)
      );

      if (isSecretOrConfigError) {
        return {
          ok: false,
          status: 503,
          code: 'TURNSTILE_UNAVAILABLE',
          message: 'Security verification is temporarily unavailable. Please email us directly.',
        };
      }

      if (isExpiredOrUsed) {
        return {
          ok: false,
          status: 403,
          code: 'TURNSTILE_INVALID',
          message: 'Security verification expired or was already used. Please refresh the check and try again.',
        };
      }

      return {
        ok: false,
        status: 403,
        code: 'TURNSTILE_INVALID',
        message: 'Bot verification failed or expired. Please refresh the check and try again.',
      };
    }

    // Compare returned action to "enquiry" when Cloudflare returns one; mismatch returns TURNSTILE_INVALID 403
    if (outcome.action && outcome.action !== 'enquiry') {
      console.error('[Turnstile Error] Action mismatch detected:', outcome.action);
      return {
        ok: false,
        status: 403,
        code: 'TURNSTILE_INVALID',
        message: 'Bot verification failed or expired. Please refresh the check and try again.',
      };
    }

    return { ok: true, simulated: false };
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : 'Unknown network error';
    console.error('Turnstile verification error:', detail);

    if (!isProduction) {
      console.log('⚡ [DEV] Turnstile network error bypassed in non-production.');
      return { ok: true, simulated: true };
    }

    return {
      ok: false,
      status: 503,
      code: 'TURNSTILE_UNREACHABLE',
      message: 'Could not reach the security verification service. Please try again or email us directly.',
    };
  }
}

export async function POST(request: Request) {
  const isProduction = isProductionEnvironment();

  try {
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json<EnquiryApiResponse>(
        {
          success: false,
          code: 'INVALID_JSON',
          message: 'Invalid request payload.',
        },
        { status: 400 }
      );
    }

    // 1. Honeypot check: return generic success without sending or logging sensitive data
    if (
      typeof rawBody === 'object' &&
      rawBody !== null &&
      'website_hp' in rawBody &&
      typeof (rawBody as { website_hp?: unknown }).website_hp === 'string' &&
      (rawBody as { website_hp: string }).website_hp.trim().length > 0
    ) {
      return NextResponse.json<EnquiryApiResponse>({
        success: true,
        code: 'ENQUIRY_RECEIVED',
        message: 'Thank you. We have received your inquiry and will respond within 24 hours.',
      });
    }

    // 2. Validate input schema
    const parsed = enquiryPayloadSchema.safeParse(rawBody);
    if (!parsed.success) {
      const flattened = z.flattenError(parsed.error);
      return NextResponse.json<EnquiryApiResponse>(
        {
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Please review the highlighted fields and try again.',
          fieldErrors: flattened.fieldErrors as Record<string, string[]>,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 3. In-memory tier (existing logic, local, zero cost)
    const clientIp = getClientIp(request);
    if (!checkInMemoryRateLimit(clientIp)) {
      return NextResponse.json<EnquiryApiResponse>(
        {
          success: false,
          code: 'RATE_LIMITED',
          message: 'Too many requests from your network. Please wait a few minutes or email us directly.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
          },
        }
      );
    }

    if (checkInMemoryDedupe(data.workEmail, data.businessChallenge)) {
      return NextResponse.json<EnquiryApiResponse>({
        success: true,
        code: 'ALREADY_RECEIVED',
        message:
          'We have already received your enquiry within the last few minutes. Our team is reviewing it and will reply shortly.',
      });
    }

    // 4. Turnstile verification (fail closed in production)
    const turnstileResult = await verifyTurnstileToken(data.turnstileToken, clientIp, isProduction);
    if (!turnstileResult.ok) {
      return NextResponse.json<EnquiryApiResponse>(
        {
          success: false,
          code: turnstileResult.code,
          message: turnstileResult.message,
        },
        { status: turnstileResult.status }
      );
    }

    // 5. Durable Upstash Redis tier (distributed rate limits + atomic 5m dedupe)
    // Only reached if all previous checks (honeypot, schema, memory, turnstile) passed
    const guardResult = await checkDurableEnquiryGuard({
      clientIp,
      email: data.workEmail,
      businessChallenge: data.businessChallenge,
    });

    if (!guardResult.allowed) {
      if (guardResult.reason === 'rate_limited') {
        return NextResponse.json<EnquiryApiResponse>(
          {
            success: false,
            code: 'RATE_LIMITED',
            message: guardResult.message,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(guardResult.retryAfter || 60),
            },
          }
        );
      }

      if (guardResult.reason === 'already_received') {
        return NextResponse.json<EnquiryApiResponse>({
          success: true,
          code: 'ALREADY_RECEIVED',
          message: guardResult.message,
        });
      }
    }

    // 6. Email dispatch via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const envFromEmail = process.env.RESEND_FROM_EMAIL?.trim();
    const toEmail = process.env.ENQUIRY_NOTIFICATION_EMAIL?.trim() || siteConfig.contact.email;

    if (!resendApiKey) {
      if (isProduction) {
        return NextResponse.json<EnquiryApiResponse>(
          {
            success: false,
            code: 'EMAIL_SERVICE_UNAVAILABLE',
            message:
              'Our enquiry delivery service is temporarily unavailable. Please send your request directly via email below.',
          },
          { status: 503 }
        );
      }

      // Development simulation only
      recordInMemoryDedupe(data.workEmail, data.businessChallenge);
      console.log('⚡ [DEV SIMULATION] Enquiry validated (RESEND_API_KEY not set):', {
        name: data.name,
        company: data.company,
        servicesNeeded: data.servicesNeeded,
        budgetRange: data.budgetRange || 'Not specified',
      });

      return NextResponse.json<EnquiryApiResponse>({
        success: true,
        code: 'ENQUIRY_SIMULATED',
        message: '[Dev Mode] Enquiry validated and simulated successfully (no email sent).',
        simulated: true,
      });
    }

    if (isProduction && !envFromEmail) {
      return NextResponse.json<EnquiryApiResponse>(
        {
          success: false,
          code: 'EMAIL_SENDER_NOT_CONFIGURED',
          message:
            'Our enquiry sender configuration is incomplete. Please contact us directly via email below.',
        },
        { status: 503 }
      );
    }

    const fromEmail = envFromEmail || 'ThunSpark Notifications <onboarding@resend.dev>';
    const resend = new Resend(resendApiKey);

    const safeName = escapeHtml(data.name);
    const safeEmail = escapeHtml(data.workEmail);
    const safeCompany = escapeHtml(data.company);
    const safeWebsite = data.website ? escapeHtml(data.website) : 'N/A';
    const safeServices = escapeHtml(data.servicesNeeded.join(', '));
    const safeChallenge = escapeHtml(data.businessChallenge).replace(/\n/g, '<br />');
    const safeBudget = escapeHtml(data.budgetRange || 'Not specified');
    const safeTimeline = escapeHtml(data.timeline || 'Not specified');
    const safeMessage = data.message
      ? escapeHtml(data.message).replace(/\n/g, '<br />')
      : 'None';
    const safeAttribution = escapeHtml(JSON.stringify(data.attribution || {}, null, 2));

    const { data: sendResult, error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: sanitizeHeaderValue(data.workEmail),
      subject: sanitizeHeaderValue(`New Growth Enquiry from ${data.name} (${data.company})`),
      html: `
        <h2>New Strategy Call Request</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Work Email:</strong> ${safeEmail}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        <p><strong>Website:</strong> ${safeWebsite}</p>
        <p><strong>Services Needed:</strong> ${safeServices}</p>
        <p><strong>Primary Challenge:</strong><br />${safeChallenge}</p>
        <p><strong>Budget Range:</strong> ${safeBudget}</p>
        <p><strong>Timeline:</strong> ${safeTimeline}</p>
        <p><strong>Additional Notes:</strong><br />${safeMessage}</p>
        <hr />
        <h3>Attribution Telemetry</h3>
        <pre style="background: #f4f4f4; padding: 10px; border-radius: 4px;">${safeAttribution}</pre>
      `,
    });

    if (sendError || !sendResult?.id) {
      console.error('Resend delivery error:', sendError?.message || 'Missing email ID in response');
      return NextResponse.json<EnquiryApiResponse>(
        {
          success: false,
          code: 'EMAIL_DELIVERY_FAILED',
          message:
            'We were unable to deliver your enquiry right now. Your details are preserved below so you can send them directly by email.',
        },
        { status: 502 }
      );
    }

    // Record in-memory dedupe window only after confirmed email dispatch
    recordInMemoryDedupe(data.workEmail, data.businessChallenge);

    return NextResponse.json<EnquiryApiResponse>({
      success: true,
      code: 'ENQUIRY_SENT',
      message: 'Thank you. We have received your inquiry and will respond within 24 hours.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error handling enquiry:', message);
    return NextResponse.json<EnquiryApiResponse>(
      {
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again or email us directly below.',
      },
      { status: 500 }
    );
  }
}
