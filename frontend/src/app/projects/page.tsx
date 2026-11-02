import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { CASE_STUDIES } from '@/lib/constants';
import { ProjectsListingClient } from '@/components/projects/ProjectsListingClient';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Client Engagements & Case Studies | ThunSpark',
  description:
    'Documented outcomes, full-stack scopes, and growth systems engineered for ambitious businesses. Authentic scope-first showcases.',
  openGraph: {
    title: 'Client Work & Case Studies | ThunSpark',
    description:
      'Documented growth systems engineered for ambitious businesses across e-commerce, consumer brands, and B2B manufacturing.',
    url: 'https://thunspark.agency/projects',
  },
  alternates: {
    canonical: '/projects',
  },
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-[#252525]">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-3">
                SELECTED WORK & CASE STUDIES
              </span>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#F5F5F0] tracking-tight mb-6">
                Proven systems. <br />
                <span className="text-[#8A8A85]">Measured outcomes.</span>
              </h1>
              <p className="text-[#8A8A85] text-base sm:text-lg leading-relaxed">
                We build growth systems that connect strategy to revenue. Here is a selection of recent engagements spanning e-commerce, B2B manufacturing, consumer care, and live events.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. CASE STUDIES GRID WITH FILTER */}
      <section className="py-20 md:py-28 border-b border-[#252525]">
        <Container>
          <ProjectsListingClient initialStudies={CASE_STUDIES as any} />
        </Container>
      </section>

      {/* 3. CONVERSION CTA */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="max-w-4xl mx-auto rounded-2xl border border-[#252525] bg-[#111111] p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(255,210,31,0.12)_0%,transparent_70%)] pointer-events-none" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-3">
              YOUR PROJECT
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#F5F5F0] tracking-tight mb-4">
              Ready to engineer your growth system?
            </h2>
            <p className="text-[#8A8A85] text-base leading-relaxed max-w-xl mx-auto mb-8">
              Book a 30-minute strategy call. We will review your current channels, isolate where revenue leaks, and propose a tailored scope.
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
