import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Accordion } from '@/components/ui/Accordion';
import { FAQ_GROUPS } from '@/lib/constants';
import { buildMetadata, serializeJsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: { absolute: 'Frequently Asked Questions · ThunSpark' },
  description:
    'Clear answers on how ThunSpark operates: disciplines, partnership terms, measurement, data security, and engagement models.',
  ogTitle: 'Frequently Asked Questions · ThunSpark',
  ogDescription:
    'Clear answers on how ThunSpark operates: disciplines, partnership terms, measurement, data security, and engagement models.',
  path: '/faq',
});

export default function FAQPage() {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: '/faq' },
  ];

  // Aggregate all Q&As across all 4 groups for the FAQPage JSON-LD schema
  const allFaqs = FAQ_GROUPS.flatMap((group) => group.items);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />

      <div className="pt-28 pb-20 md:pt-36 md:pb-28">
        <Container>
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <div className="text-center max-w-3xl mx-auto mb-16">
            <SectionHeading
              eyebrow="CLEAR ANSWERS"
              title="Frequently Asked Questions"
              copy="Everything you need to know about our disciplines, processes, contracts, and data practices."
              align="center"
            />
          </div>

          {/* Quick Navigation Anchor Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-16">
            {FAQ_GROUPS.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="px-3.5 py-1.5 rounded-full border border-line bg-card hover:border-line-strong hover:text-accent font-mono text-xs transition-colors"
              >
                {group.title}
              </a>
            ))}
          </div>

          {/* 4 Group Sections */}
          <div className="max-w-4xl mx-auto space-y-16">
            {FAQ_GROUPS.map((group) => (
              <section
                key={group.id}
                id={group.id}
                className="rounded-2xl border border-line bg-card p-6 sm:p-10 scroll-mt-28"
              >
                <div className="mb-6 pb-6 border-b border-line">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-1">
                    SECTION
                  </span>
                  <h2 className="font-display font-medium text-2xl sm:text-3xl text-ink mb-2">
                    {group.title}
                  </h2>
                  <p className="text-soft text-xs sm:text-sm leading-relaxed">
                    {group.description}
                  </p>
                </div>

                {/* Answers kept in DOM with role="region" */}
                <Accordion items={group.items} singleOpen={false} />
              </section>
            ))}
          </div>

          {/* Bottom Still Have Questions CTA */}
          <div className="max-w-2xl mx-auto text-center mt-20 p-8 rounded-2xl border border-line bg-card/60">
            <h3 className="font-display font-medium text-xl text-ink mb-2">
              Have a question not listed here?
            </h3>
            <p className="text-soft text-xs leading-relaxed mb-6">
              Reach out directly. We discuss your bottlenecks candidly without aggressive sales pressure.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-5 py-2.5 rounded-full bg-accent text-canvas hover:bg-accent-hi transition-colors"
            >
              <span>Ask Our Team</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
