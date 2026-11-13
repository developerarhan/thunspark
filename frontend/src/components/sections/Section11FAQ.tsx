import React from 'react';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { BookingButton } from '@/components/ui/BookingButton';
import { FAQ_ITEMS, FINAL_CTA } from '@/lib/constants';
import { siteConfig } from '@/site.config';
import { ArrowRight, Mail } from 'lucide-react';

export function Section11FAQ() {
  // Build FAQPage schema only for final verified answers
  const verifiedFaqs = FAQ_ITEMS.filter((item) => item.hasSchema);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: verifiedFaqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <Section tone="base">
      <Container>
        <SectionHeading
          eyebrow="QUESTIONS"
          title={
            <>
              Answers, <span className="font-italic-accent">before</span> you ask.
            </>
          }
          copy="Clear details on our engagement models, timelines, reporting, and deliverables."
        />

        <div className="max-w-4xl mx-auto">
          <Accordion items={FAQ_ITEMS} singleOpen={true} />
        </div>

        {/* Centered Follow-Up Card */}
        <div className="max-w-4xl mx-auto mt-10 p-8 sm:p-10 rounded-xl bg-card border border-line text-center space-y-5">
          <h3 className="font-display font-bold text-xl sm:text-2xl text-ink">
            Still have a question?
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <BookingButton
              location="faq_still_have_question"
              variant="primary"
              size="md"
              data-analytics-cta="faq_strategy_call"
            >
              <span>{FINAL_CTA.primaryCta.label}</span>
              <ArrowRight size={16} className="ml-2" />
            </BookingButton>

            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center gap-2 text-sm font-mono text-soft hover:text-accent transition-colors py-2.5 px-4"
            >
              <Mail size={15} className="text-accent shrink-0" />
              <span>{siteConfig.contact.email}</span>
            </a>
          </div>
        </div>

        {/* FAQPage JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Container>
    </Section>
  );
}
