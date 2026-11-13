import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { BookingButton } from '@/components/ui/BookingButton';
import { Reveal } from '@/components/motion/Reveal';
import { SERVICES_DATA } from '@/lib/services-data';
import { ArrowRight } from 'lucide-react';
import {
  buildMetadata,
  buildAbsoluteUrl,
  ORGANIZATION_SCHEMA_REF,
  serializeJsonLd,
} from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: { absolute: 'Strategic Growth Services & Disciplines | ThunSpark' },
  description:
    'Ten connected digital growth disciplines organized across Attract, Engage, Convert, and Optimize. Built to diagnose and fix growth bottlenecks.',
  ogTitle: 'Services & Disciplines | ThunSpark',
  ogDescription:
    'Ten connected digital growth disciplines organized across Attract, Engage, Convert, and Optimize.',
  path: '/services',
});

const CHAPTERS = [
  {
    id: 'attract',
    number: '01',
    name: 'Attract',
    tagline: 'High-intent acquisition across organic and paid channels.',
    description:
      'We bring qualified, purchase-ready traffic to your business through data-backed paid advertising, technical SEO, and compounding content engines.',
    slugs: [
      'social-media-marketing',
      'performance-marketing',
      'seo-strategy',
      'content-marketing',
    ],
  },
  {
    id: 'engage',
    number: '02',
    name: 'Engage',
    tagline: 'Brand positioning and creative production that command attention.',
    description:
      'First impressions compound. We craft distinct visual identities and commercial-grade creative assets that build instant category authority.',
    slugs: ['brand-identity-strategy', 'creative-production-direction'],
  },
  {
    id: 'convert',
    number: '03',
    name: 'Convert',
    tagline: 'High-velocity digital experiences engineered for revenue.',
    description:
      'Traffic is useless if it leaks below the fold. We build fast, bespoke web systems and conversion funnels that transform visitors into revenue.',
    slugs: ['web-design-development', 'landing-pages-cro'],
  },
  {
    id: 'optimize',
    number: '04',
    name: 'Optimize',
    tagline: 'Precision instrumentation, analytics, and senior growth leadership.',
    description:
      'Measurement is how growth compounds. We eliminate data blindspots, audit conversion funnels, and guide capital allocation with senior oversight.',
    slugs: ['analytics-audit-instrumentation', 'growth-consulting-audits'],
  },
];

const servicesCatalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'ThunSpark Digital Growth Services',
  description:
    'Ten connected digital growth disciplines organized across Attract, Engage, Convert, and Optimize.',
  url: buildAbsoluteUrl('/services'),
  provider: ORGANIZATION_SCHEMA_REF,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Growth Disciplines',
    itemListElement: Object.values(SERVICES_DATA).map((service, idx) => ({
      '@type': 'Offer',
      position: idx + 1,
      itemOffered: {
        '@type': 'Service',
        name: service.name,
        description: service.shortDesc,
        url: buildAbsoluteUrl(`/services/${service.slug}`),
      },
    })),
  },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(servicesCatalogSchema) }}
      />
      <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-line">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-3">
                SERVICES & DISCIPLINES
              </span>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-6">
                Ten disciplines. One connected system.
              </h1>
              <p className="text-soft text-base sm:text-lg leading-relaxed mb-8">
                We organize our capabilities across the four phases of the modern growth journey: Attract, Engage, Convert, and Optimize. No isolated tactics. Every move has a reason and every result is provable.
              </p>

              {/* Jump Anchors */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {CHAPTERS.map((chapter) => (
                  <a
                    key={chapter.id}
                    href={`#${chapter.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-card hover:border-accent hover:text-accent text-xs font-mono text-meta transition-colors"
                  >
                    <span>{chapter.number}</span>
                    <span className="text-ink">{chapter.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. CHAPTERS */}
      {CHAPTERS.map((chapter, chapterIdx) => (
        <section
          key={chapter.id}
          id={chapter.id}
          className={`py-20 md:py-28 border-b border-line scroll-mt-20 ${
            chapterIdx % 2 === 1 ? 'bg-alt' : 'bg-base'
          }`}
        >
          <Container>
            <Reveal>
              <div className="max-w-3xl mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs font-bold text-accent">
                    CHAPTER {chapter.number}
                  </span>
                  <span className="text-line-strong">•</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-meta">
                    {chapter.name}
                  </span>
                </div>
                <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight mb-4">
                  {chapter.tagline}
                </h2>
                <p className="text-soft text-sm md:text-base leading-relaxed">
                  {chapter.description}
                </p>
              </div>
            </Reveal>

            {/* Grid of services in this chapter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chapter.slugs.map((slug) => {
                const service = SERVICES_DATA[slug];
                if (!service) return null;

                return (
                  <Reveal key={slug}>
                    <Link
                      href={`/services/${slug}`}
                      className="group block h-full focus:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl"
                    >
                      <Card className="p-6 md:p-8 h-full flex flex-col justify-between bg-card border-line group-hover:border-accent/50 group-hover:bg-elevated transition-all duration-300">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-xs uppercase text-meta">
                              Discipline
                            </span>
                            <span className="text-meta group-hover:text-accent group-hover:translate-x-1 transition-all">
                              <ArrowRight size={18} />
                            </span>
                          </div>

                          <h3 className="font-display font-medium text-2xl text-ink group-hover:text-accent transition-colors mb-3">
                            {service.name}
                          </h3>

                          <p className="font-display text-sm text-ink italic mb-4">
                            &ldquo;{service.oneLineOutcome}&rdquo;
                          </p>

                          <p className="text-soft text-xs md:text-sm leading-relaxed mb-6">
                            {service.shortDesc}
                          </p>
                        </div>

                        <div>
                          <div className="pt-4 border-t border-line flex flex-wrap gap-2">
                            {service.deliverables.slice(0, 3).map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono bg-elevated text-meta border border-line"
                              >
                                {item}
                              </span>
                            ))}
                            {service.deliverables.length > 3 && (
                              <span className="inline-block px-2 py-1 text-[11px] font-mono text-meta">
                                +{service.deliverables.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>
      ))}

      {/* 3. CONVERSION CTA */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="max-w-4xl mx-auto rounded-2xl border border-line bg-card p-8 sm:p-14 text-center relative overflow-hidden">
            <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-3">
              NOT SURE WHERE TO START?
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-ink tracking-tight mb-4">
              We diagnose the bottleneck first.
            </h2>
            <p className="text-soft text-base leading-relaxed max-w-xl mx-auto mb-8">
              Most clients don&apos;t need all ten disciplines at once. Book a 30-minute diagnostic call and we will identify the single highest-leverage priority for your growth.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <BookingButton location="services_page_cta" variant="primary" size="lg">
                <span>Book a strategy call</span>
                <ArrowRight size={16} />
              </BookingButton>
            </div>
          </div>
        </Container>
      </section>
      </div>
    </>
  );
}
