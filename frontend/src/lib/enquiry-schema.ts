import { z } from 'zod';

export const SERVICE_OPTIONS = [
  'Social Media Marketing',
  'Performance Marketing',
  'SEO Strategy',
  'Content Marketing',
  'Brand Identity & Strategy',
  'Creative Production',
  'Web Design & Dev',
  'Landing Pages & CRO',
  'Analytics Audit',
  'Growth Consulting',
] as const;

export const CHALLENGE_PRESETS = [
  'Ads that burn budget without generating qualified pipeline',
  'Traffic arrives on site but fails to convert below the fold',
  'Inconsistent or invisible content across organic channels',
  'Website design and messaging undersell our actual offering',
  'Data is fragmented with no clear attribution or insights',
  'Growth has plateaued across our primary acquisition channels',
] as const;

export const BUDGET_OPTIONS = [
  'Prefer not to say',
  'Under $2,000 / month',
  '$2,000 – $5,000 / month',
  '$5,000 – $10,000 / month',
  '$10,000+ / month',
  'Project-based sprint (Fixed fee)',
] as const;

export const TIMELINE_OPTIONS = [
  'Prefer not to say',
  'Immediately (Within 2 weeks)',
  'This quarter (Within 30–60 days)',
  'Planning ahead / Exploring options',
] as const;

export const enquiryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must be under 120 characters'),
  workEmail: z
    .string()
    .trim()
    .max(254, 'Email address is too long')
    .pipe(z.email({ error: 'Please enter a valid work email address' })),
  company: z
    .string()
    .trim()
    .min(1, 'Company or brand name is required')
    .max(120, 'Company name must be under 120 characters'),
  website: z
    .string()
    .trim()
    .pipe(
      z.union([
        z.literal(''),
        z.url({
          protocol: /^https?$/,
          error: 'Please enter a valid URL starting with http:// or https://',
        }),
      ])
    )
    .optional(),
  servicesNeeded: z
    .array(z.string().trim().min(1))
    .min(1, 'Please select at least one discipline'),
  businessChallenge: z
    .string()
    .trim()
    .min(20, 'Please describe your primary challenge in at least 20 characters')
    .max(1000, 'Business challenge must be 1,000 characters or fewer'),
  budgetRange: z.string().trim().max(100).optional(),
  timeline: z.string().trim().max(100).optional(),
  message: z
    .string()
    .trim()
    .max(2000, 'Additional context must be 2,000 characters or fewer')
    .optional(),
  consent: z.boolean().refine((val) => val === true, {
    error: 'You must agree to the privacy policy to proceed',
  }),
});

export const enquiryPayloadSchema = enquiryFormSchema.extend({
  website_hp: z.string().optional(),
  turnstileToken: z.string().optional(),
  attribution: z.record(z.string(), z.unknown()).optional(),
});

export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;
export type EnquiryPayload = z.infer<typeof enquiryPayloadSchema>;
export type EnquiryFieldErrors = Partial<Record<keyof EnquiryFormValues, string[]>>;

export interface EnquiryApiResponse {
  success: boolean;
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  simulated?: boolean;
}
