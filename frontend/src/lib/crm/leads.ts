import { db } from '@/lib/db/client';
import type { EnquiryPayload } from '@/lib/enquiry-schema';
import type { LeadSource } from '@prisma/client';

export interface LeadPersistResult {
  leadId: string;
  isReturning: boolean;
}

function asString(val: unknown): string | null {
  return typeof val === 'string' && val.trim().length > 0 ? val.trim() : null;
}

function extractAttributionField(attr: Record<string, unknown> | undefined, field: string): string | null {
  if (!attr) return null;
  // 1. Direct top-level property
  if (typeof attr[field] === 'string' && (attr[field] as string).trim().length > 0) {
    return (attr[field] as string).trim();
  }
  // 2. Inside last_touch object
  const lastTouch = attr.last_touch as Record<string, unknown> | undefined;
  if (lastTouch && typeof lastTouch[field] === 'string' && (lastTouch[field] as string).trim().length > 0) {
    return (lastTouch[field] as string).trim();
  }
  // 3. Inside first_touch object
  const firstTouch = attr.first_touch as Record<string, unknown> | undefined;
  if (firstTouch && typeof firstTouch[field] === 'string' && (firstTouch[field] as string).trim().length > 0) {
    return (firstTouch[field] as string).trim();
  }
  return null;
}

function resolveLeadSource(attribution?: EnquiryPayload['attribution']): LeadSource {
  if (!attribution) return 'ORGANIC';

  const source = (extractAttributionField(attribution, 'utm_source') || '').toLowerCase();
  const medium = (extractAttributionField(attribution, 'utm_medium') || '').toLowerCase();
  const referrer = extractAttributionField(attribution, 'referrer');
  const gclid = asString(attribution.gclid);
  const fbclid = asString(attribution.fbclid);

  if (
    gclid ||
    fbclid ||
    ['cpc', 'paid', 'ppc', 'ad', 'meta_ads', 'google_ads'].includes(medium) ||
    ['google_ads', 'meta_ads', 'linkedin_ads'].includes(source)
  ) {
    return 'PAID';
  }

  if (referrer && !referrer.includes('thunspark.agency')) {
    return 'REFERRAL';
  }

  if (source.includes('email') || medium.includes('email')) {
    return 'DIRECT';
  }

  return 'ORGANIC';
}

/**
 * Persist an inbound enquiry form submission into Neon DB CRM.
 * Implements the Smart Upsert strategy:
 * - If lead exists: appends an Activity record and updates lastActivity.
 * - If lead is new: creates the Lead record with attribution telemetry and initial activity.
 * Guaranteed non-blocking: never throws or fails an enquiry.
 */
export async function persistInboundLead(data: EnquiryPayload): Promise<LeadPersistResult | null> {
  // Gracefully skip if database connection is not configured in this environment
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚡ [CRM DEV] DATABASE_URL not set; skipping database lead persistence.');
    }
    return null;
  }

  try {
    const normalizedEmail = data.workEmail.trim().toLowerCase();

    // Check for existing lead with same email
    const existingLead = await db.lead.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        stage: true,
        name: true,
      },
    });

    if (existingLead) {
      // Smart Upsert: Lead already in pipeline -> Log Activity and bump priority
      const challengeSummary = data.businessChallenge
        ? `Primary Challenge:\n${data.businessChallenge.slice(0, 1000)}`
        : '';
      const notes = data.message ? `\n\nAdditional Notes:\n${data.message.slice(0, 1000)}` : '';
      const services = data.servicesNeeded.length > 0 ? `Services: ${data.servicesNeeded.join(', ')}\n` : '';
      const budget = data.budgetRange ? `Budget: ${data.budgetRange}\n` : '';

      await db.$transaction([
        db.activity.create({
          data: {
            leadId: existingLead.id,
            type: 'FORM_SUBMISSION',
            title: 'Subsequent Inbound Form Submission',
            content: `${services}${budget}${challengeSummary}${notes}`.trim(),
          },
        }),
        db.lead.update({
          where: { id: existingLead.id },
          data: {
            lastActivity: new Date(),
            // Re-open if previously marked LOST
            stage: existingLead.stage === 'LOST' ? 'NEW' : existingLead.stage,
          },
        }),
      ]);

      return { leadId: existingLead.id, isReturning: true };
    }

    // New Lead creation
    const attr = data.attribution || {};
    const source = resolveLeadSource(attr);

    const challengeSummary = data.businessChallenge || '';
    const notesSummary = data.message ? `\n\nNotes:\n${data.message}` : '';

    const newLead = await db.lead.create({
      data: {
        name: data.name.trim(),
        email: normalizedEmail,
        company: data.company.trim(),
        website: data.website?.trim() || null,
        phone: null,
        source,
        serviceInterest: data.servicesNeeded,
        budgetRange: data.budgetRange || null,
        bottleneckNotes: `${challengeSummary}${notesSummary}`.trim(),
        stage: 'NEW',
        utmSource: extractAttributionField(attr, 'utm_source'),
        utmMedium: extractAttributionField(attr, 'utm_medium'),
        utmCampaign: extractAttributionField(attr, 'utm_campaign'),
        utmTerm: extractAttributionField(attr, 'utm_term'),
        utmContent: extractAttributionField(attr, 'utm_content'),
        referrer: extractAttributionField(attr, 'referrer'),
        landingPage: extractAttributionField(attr, 'landing_page'),
        activities: {
          create: {
            type: 'FORM_SUBMISSION',
            title: 'Initial Inbound Strategy Form Submission',
            content: `Services: ${data.servicesNeeded.join(', ')}\nChallenge: ${data.businessChallenge}${data.message ? `\nNotes: ${data.message}` : ''}`,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return { leadId: newLead.id, isReturning: false };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[CRM Lead Capture Error] Failed to persist lead to Neon DB:', errorMsg);
    return null;
  }
}
