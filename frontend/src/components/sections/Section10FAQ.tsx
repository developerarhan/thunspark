import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { FAQ_ITEMS } from '@/lib/constants';

export function Section10FAQ() {
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
    <section className="py-24 md:py-32 bg-[#050505]">
      <Container>
        <SectionHeading
          eyebrow="09 / QUESTIONS"
          title={
            <>
              Answers, <span className="font-italic-accent">before</span> you ask.
            </>
          }
          copy="Clear details on our engagement models, timelines, reporting, and deliverables."
        />

        <div className="max-w-3xl">
          <Accordion items={FAQ_ITEMS} singleOpen={true} />
        </div>

        {/* FAQPage JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Container>
    </section>
  );
}
