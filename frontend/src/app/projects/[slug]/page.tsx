import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { CASE_STUDIES } from '@/lib/constants';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import Script from 'next/script';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES.find((s) => s.slug === slug);

  if (!study) {
    return { title: 'Project Not Found | ThunSpark' };
  }

  return {
    title: `${study.client} Case Study — ${study.headline} | ThunSpark`,
    description: study.overview,
    openGraph: {
      title: `${study.client}: ${study.headline}`,
      description: study.overview,
      url: `https://thunspark.agency/projects/${slug}`,
    },
    alternates: {
      canonical: `/projects/${slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${study.client} Engagement`,
    headline: study.headline,
    description: study.overview,
    creator: {
      '@type': 'Organization',
      name: 'ThunSpark',
      url: 'https://thunspark.agency',
    },
    datePublished: `${study.year}-01-01`,
  };

  return (
    <>
      <Script
        id={`project-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <div className="flex flex-col">
        {/* 1. HERO */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-[#252525]">
          <Container>
            <Reveal>
              <div className="max-w-4xl">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A8A85] hover:text-[#FFD21F] transition-colors mb-6"
                >
                  <ArrowLeft size={14} />
                  <span>All Projects</span>
                </Link>

                <div className="flex items-center gap-3 mb-4">
                  <Tag variant="accent">{study.industry}</Tag>
                  <span className="font-mono text-xs text-[#8A8A85]">{study.year}</span>
                </div>

                <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#F5F5F0] tracking-tight mb-6">
                  {study.headline}
                </h1>

                <div className="p-4 md:p-5 rounded-lg bg-[#111111] border border-[#252525] border-l-2 border-l-[#FFD21F] mb-8">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#FFD21F] block mb-1">
                    Client Partner
                  </span>
                  <p className="font-display font-medium text-xl text-[#F5F5F0]">
                    {study.client}
                  </p>
                </div>

                <p className="text-[#8A8A85] text-base sm:text-lg leading-relaxed max-w-3xl">
                  {study.overview}
                </p>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* 2. SCOPE OF WORK & SERVICES DELIVERED */}
        <section className="py-20 md:py-28 border-b border-[#252525]">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5">
                <Reveal>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-2">
                    DELIVERY SPECIFICATION
                  </span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-[#F5F5F0] tracking-tight mb-4">
                    Scope of work delivered.
                  </h2>
                  <p className="text-[#8A8A85] text-sm md:text-base leading-relaxed mb-6">
                    A multi-disciplinary execution engineered to ensure every digital touchpoint reinforces brand authority and conversion velocity.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {study.servicesRendered.map((service, i) => (
                      <span
                        key={i}
                        className="inline-block px-3 py-1.5 rounded-lg text-xs font-mono bg-[#171717] text-[#FFD21F] border border-[#353535]"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <Card className="p-6 md:p-8 bg-[#111111] border-[#252525] space-y-4">
                  <h3 className="font-display font-medium text-xl text-[#F5F5F0] mb-2">
                    Delivered Capabilities
                  </h3>
                  {study.scope.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 pb-4 border-b border-[#252525] last:border-b-0 last:pb-0"
                    >
                      <CheckCircle2 size={18} className="text-[#FFD21F] shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-[#F5F5F0] font-medium leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. VERIFIED OUTCOMES / HONESTY SECTION */}
        <section className="py-20 md:py-28 bg-[#0A0A0A] border-b border-[#252525]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Card className="p-6 md:p-10 bg-[#111111] border-[#252525] relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#171717] border border-[#353535] text-[#FFD21F] flex items-center justify-center shrink-0">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-[#FFD21F] block mb-1">
                      Our Data Verification Policy
                    </span>
                    <h3 className="font-display font-medium text-xl text-[#F5F5F0] mb-3">
                      Confidentiality & Verified Metrics
                    </h3>
                    <p className="text-sm md:text-base text-[#8A8A85] leading-relaxed mb-4">
                      {study.honestyNote}
                    </p>
                    <p className="text-xs text-[#8A8A85] leading-relaxed">
                      At ThunSpark, we never fabricate client growth percentages, ROAS figures, or revenue statistics to win new accounts. When clients grant public clearance to share audited unit economics, we publish full post-mortems; until then, we showcase confirmed scope, architecture, and deliverables only.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </section>

        {/* 4. CONVERSION CTA */}
        <section className="py-24 md:py-32">
          <Container>
            <div className="max-w-4xl mx-auto rounded-2xl border border-[#252525] bg-[#111111] p-8 sm:p-14 text-center relative overflow-hidden">
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(255,210,31,0.12)_0%,transparent_70%)] pointer-events-none" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-3">
                START A CONVERSATION
              </span>
              <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#F5F5F0] tracking-tight mb-4">
                Want to build a system like this?
              </h2>
              <p className="text-[#8A8A85] text-base leading-relaxed max-w-xl mx-auto mb-8">
                Book a 30-minute strategy call. We will review your current channels, identify what is holding your growth back, and propose an actionable scope.
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
    </>
  );
}
