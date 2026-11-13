import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { BookingButton } from '@/components/ui/BookingButton';
import { Reveal } from '@/components/motion/Reveal';
import { CASE_STUDIES } from '@/lib/constants';
import { ProjectsListingClient } from '@/components/projects/ProjectsListingClient';
import { ArrowRight } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: { absolute: 'Client Engagements & Case Studies | ThunSpark' },
  description:
    'Documented outcomes, full-stack scopes, and growth systems engineered for ambitious businesses. Authentic scope-first showcases.',
  ogTitle: 'Client Work & Case Studies | ThunSpark',
  ogDescription:
    'Documented growth systems engineered for ambitious businesses across e-commerce, consumer brands, and B2B manufacturing.',
  path: '/projects',
});

export default function ProjectsPage() {
  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-line">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-3">
                SELECTED WORK & CASE STUDIES
              </span>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-6">
                Proven systems. <br />
                <span className="text-meta">Measured outcomes.</span>
              </h1>
              <p className="text-soft text-base sm:text-lg leading-relaxed">
                We build growth systems that connect strategy to revenue. Here is a selection of recent engagements spanning e-commerce, B2B manufacturing, consumer care, and live events.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. CASE STUDIES GRID WITH FILTER */}
      <section className="py-20 md:py-28 border-b border-line">
        <Container>
          <ProjectsListingClient initialStudies={CASE_STUDIES} />
        </Container>
      </section>

      {/* 3. CONVERSION CTA */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="max-w-4xl mx-auto rounded-2xl border border-line bg-card p-8 sm:p-14 text-center relative overflow-hidden">
            <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-3">
              YOUR PROJECT
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-ink tracking-tight mb-4">
              Ready to engineer your growth system?
            </h2>
            <p className="text-soft text-base leading-relaxed max-w-xl mx-auto mb-8">
              Book a 30-minute strategy call. We will review your current channels, isolate where revenue leaks, and propose a tailored scope.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <BookingButton location="projects_page_cta" variant="primary" size="lg">
                <span>Book a strategy call</span>
                <ArrowRight size={16} />
              </BookingButton>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
