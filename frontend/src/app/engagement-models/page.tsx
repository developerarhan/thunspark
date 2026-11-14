import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { BookingButton } from '@/components/ui/BookingButton';
import { ENGAGEMENT_MODELS, SCOPING_STEPS, FAQ_GROUPS } from '@/lib/constants';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: { absolute: 'Engagement Models & Pricing Philosophy · ThunSpark' },
  description:
    'Transparent partnership structures: Growth Audits, Strategic Retainers, and Targeted Builds. Billed on value, milestones, and sprint velocity.',
  ogTitle: 'Engagement Models & Pricing Philosophy · ThunSpark',
  ogDescription:
    'Transparent partnership structures: Growth Audits, Strategic Retainers, and Targeted Builds. Billed on value, milestones, and sprint velocity.',
  path: '/engagement-models',
});

export default function EngagementModelsPage() {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Engagement Models', path: '/engagement-models' },
  ];

  // Reusing Process & Reporting/Contracts FAQs for engagement queries
  const engagementFaqs = [
    ...(FAQ_GROUPS.find((g) => g.id === 'process')?.items || []),
    ...(FAQ_GROUPS.find((g) => g.id === 'reporting-contracts')?.items || []),
  ];

  return (
    <div className="pt-28 pb-20 md:pt-36 md:pb-28">
      <Container>
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SectionHeading
            eyebrow="TRANSPARENT STRUCTURES"
            title="Partnership Built on Accountability"
            copy="No surprise billings or ambiguous retainer hours. We scope around business outcomes and technical velocity."
            align="center"
          />
        </div>

        {/* 3 Model Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 items-stretch">
          {ENGAGEMENT_MODELS.map((model) => (
            <div
              key={model.id}
              className={`relative rounded-2xl border p-8 flex flex-col justify-between transition-all duration-200 ${
                model.recommendedFor
                  ? 'border-accent bg-card shadow-[0_0_32px_rgba(255,210,31,0.08)] ring-1 ring-accent/30'
                  : 'border-line bg-card hover:border-line-strong'
              }`}
            >
              {model.recommendedFor && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-canvas font-mono text-[11px] font-bold uppercase tracking-wider">
                  Most Common Partner Model
                </div>
              )}

              <div>
                <div className="mb-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-meta block mb-2">
                    MODEL
                  </span>
                  <h2 className="font-display font-medium text-2xl text-ink mb-2">
                    {model.name}
                  </h2>
                  <p className="text-soft text-sm leading-relaxed min-h-[40px]">
                    {model.tagline}
                  </p>
                </div>

                {/* Who It's For */}
                <div className="p-4 rounded-xl bg-elevated border border-line mb-6">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold block mb-1">
                    Who It&apos;s For
                  </span>
                  <p className="text-xs text-soft leading-relaxed">
                    {model.audience}
                  </p>
                </div>

                {/* Deliverables / Scope */}
                <div className="mb-8">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-meta font-semibold block mb-3">
                    What&apos;s Included
                  </span>
                  <ul className="space-y-2.5">
                    {model.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-soft">
                        <Check size={14} className="text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                {/* How It's Billed (in words, strictly no prices) */}
                <div className="pt-6 border-t border-line mb-6">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-meta font-semibold block mb-1.5">
                    How It&apos;s Billed
                  </span>
                  <p className="text-xs text-ink/90 leading-relaxed font-medium">
                    {model.billingMethod}
                  </p>
                </div>

                {/* CTA */}
                {model.id === 'retainer' ? (
                  <BookingButton
                    location="pricing_retainer_card"
                    variant="primary"
                    className="w-full text-center"
                  >
                    {model.ctaText}
                  </BookingButton>
                ) : (
                  <Button
                    href={model.ctaHref}
                    variant={model.recommendedFor ? 'primary' : 'secondary'}
                    className="w-full text-center"
                    data-analytics-cta={`pricing_${model.id}`}
                  >
                    {model.ctaText}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 3-Step Scoping Strip */}
        <div className="rounded-2xl border border-line bg-card p-8 sm:p-12 mb-24">
          <div className="max-w-2xl mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
              HOW SCOPING WORKS
            </span>
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-ink">
              Three Steps from Diagnosis to Velocity
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SCOPING_STEPS.map((step) => (
              <div key={step.step} className="space-y-3">
                <span className="font-mono text-2xl font-bold text-accent block">
                  {step.step}
                </span>
                <h4 className="font-display font-medium text-lg text-ink">
                  {step.title}
                </h4>
                <p className="text-soft text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-ink">
              Engagement & Scoping Details
            </h3>
          </div>

          <Accordion items={engagementFaqs} />

          <div className="text-center mt-12">
            <p className="text-soft text-xs mb-4">
              Have specific scoping requirements or unique compliance standards?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent hover:text-accent-hi transition-colors"
            >
              <span>Speak directly with our team</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
