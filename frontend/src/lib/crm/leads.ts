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

function resolveLeadSource(attribution?: EnquiryPayload['attribution']): LeadSource {
  if (!attribution) return 'ORGANIC';

  const source = (asString(attribution.utm_source) || '').toLowerCase();
  const medium = (asString(attribution.utm_medium) || '').toLowerCase();
  const referrer = asString(attribution.referrer);

  if (['cpc', 'paid', 'ppc', 'ad', 'meta_ads', 'google_ads'].includes(medium) || ['google_ads', 'meta_ads', 'linkedin_ads'].includes(source)) {
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
        utmSource: asString(attr.utm_source),
        utmMedium: asString(attr.utm_medium),
        utmCampaign: asString(attr.utm_campaign),
        utmTerm: asString(attr.utm_term),
        utmContent: asString(attr.utm_content),
        referrer: asString(attr.referrer),
        landingPage: asString(attr.landing_page),
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
