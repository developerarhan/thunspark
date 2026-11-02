import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { SERVICES_DATA } from '@/lib/services-data';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Strategic Growth Services & Disciplines | ThunSpark',
  description:
    'Ten connected digital growth disciplines organized across Attract, Engage, Convert, and Optimize. Built to diagnose and fix growth bottlenecks.',
  openGraph: {
    title: 'Services & Disciplines | ThunSpark',
    description:
      'Ten connected digital growth disciplines organized across Attract, Engage, Convert, and Optimize.',
    url: 'https://thunspark.agency/services',
  },
  alternates: {
    canonical: '/services',
  },
};

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

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-[#252525]">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-3">
                SERVICES & DISCIPLINES
              </span>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#F5F5F0] tracking-tight mb-6">
                Ten disciplines. One connected system.
              </h1>
              <p className="text-[#8A8A85] text-base sm:text-lg leading-relaxed mb-8">
                We organize our capabilities across the four phases of the modern growth journey: Attract, Engage, Convert, and Optimize. No isolated tactics. Every move has a reason and every result is provable.
              </p>

              {/* Jump Anchors */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {CHAPTERS.map((chapter) => (
                  <a
                    key={chapter.id}
                    href={`#${chapter.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#252525] bg-[#111111] hover:border-[#FFD21F] hover:text-[#FFD21F] text-xs font-mono text-[#8A8A85] transition-colors"
                  >
                    <span>{chapter.number}</span>
                    <span className="text-[#F5F5F0]">{chapter.name}</span>
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
          className={`py-20 md:py-28 border-b border-[#252525] scroll-mt-20 ${
            chapterIdx % 2 === 1 ? 'bg-[#0A0A0A]' : 'bg-[#050505]'
          }`}
        >
          <Container>
            <Reveal>
              <div className="max-w-3xl mb-12">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs font-bold text-[#FFD21F]">
                    CHAPTER {chapter.number}
                  </span>
                  <span className="text-[#353535]">•</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#8A8A85]">
                    {chapter.name}
                  </span>
                </div>
                <h2 className="font-display font-medium text-3xl md:text-4xl text-[#F5F5F0] tracking-tight mb-4">
                  {chapter.tagline}
                </h2>
                <p className="text-[#8A8A85] text-sm md:text-base leading-relaxed">
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
                      className="group block h-full focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD21F] rounded-xl"
                    >
                      <Card className="p-6 md:p-8 h-full flex flex-col justify-between bg-[#111111] border-[#252525] group-hover:border-[#FFD21F]/50 group-hover:bg-[#171717] transition-all duration-300">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-xs uppercase text-[#8A8A85]">
                              Discipline
                            </span>
                            <span className="text-[#8A8A85] group-hover:text-[#FFD21F] group-hover:translate-x-1 transition-all">
                              <ArrowRight size={18} />
                            </span>
                          </div>

                          <h3 className="font-display font-medium text-2xl text-[#F5F5F0] group-hover:text-[#FFD21F] transition-colors mb-3">
                            {service.name}
                          </h3>

                          <p className="font-display text-sm text-[#F5F5F0] italic mb-4">
                            &ldquo;{service.oneLineOutcome}&rdquo;
                          </p>

                          <p className="text-[#8A8A85] text-xs md:text-sm leading-relaxed mb-6">
                            {service.shortDesc}
                          </p>
                        </div>

                        <div>
                          <div className="pt-4 border-t border-[#252525] flex flex-wrap gap-2">
                            {service.deliverables.slice(0, 3).map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#171717] text-[#8A8A85] border border-[#252525]"
                              >
                                {item}
                              </span>
                            ))}
                            {service.deliverables.length > 3 && (
                              <span className="inline-block px-2 py-1 text-[11px] font-mono text-[#8A8A85]">
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
          <div className="max-w-4xl mx-auto rounded-2xl border border-[#252525] bg-[#111111] p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(255,210,31,0.12)_0%,transparent_70%)] pointer-events-none" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-3">
              NOT SURE WHERE TO START?
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#F5F5F0] tracking-tight mb-4">
              We diagnose the bottleneck first.
            </h2>
            <p className="text-[#8A8A85] text-base leading-relaxed max-w-xl mx-auto mb-8">
              Most clients don&apos;t need all ten disciplines at once. Book a 30-minute diagnostic call and we will identify the single highest-leverage priority for your growth.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact" variant="primary" size="lg">
                <span>Book a strategy call</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
