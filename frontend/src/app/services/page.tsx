import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ServicesAccordion } from '@/components/services/ServicesAccordion';
import { apiClient } from '@/lib/api-client';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Strategic Growth Services',
  description:
    'Comprehensive digital growth disciplines: Growth Strategy, SEO & Organic Growth, Content & Creative, Web & Conversion, and Paid Media.',
};

async function getServicesData() {
  try {
    const res = await apiClient.GET('/api/content/service-groups/', {
      next: { tags: ['services'] },
    });
    if (!res?.data) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray((res.data as any).results)) return (res.data as any).results;
    return [];
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const groups = await getServicesData();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <Section className="pt-20 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <Badge variant="accent" className="mb-4">
                Disciplines & Capabilities
              </Badge>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight mb-6">
                Connected Systems Built For <span className="text-accent">Sustainable Growth.</span>
              </h1>
              <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
                We do not sell prepackaged generic retainers. We diagnose where your growth engine leaks attention or conversion, then engineer the exact system needed to scale.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* Accordion Showcase */}
      <Section className="py-8 pb-28">
        <Container>
          <ServicesAccordion groups={groups as any} />
        </Container>
      </Section>

      {/* Conversion CTA */}
      <Section className="bg-bg-secondary border-t border-border py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <Badge variant="neutral" className="mb-4">
                Tailored Engagement
              </Badge>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-6">
                Need a Custom Growth Roadmap?
              </h2>
              <p className="text-text-secondary text-base leading-relaxed mb-8">
                Share your current unit economics, acquisition bottlenecks, and timeline. We will review your digital footprint and propose a structured game plan.
              </p>
              <Button href="/contact" size="lg" variant="primary">
                <span>Start a Conversation</span>
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </ScrollReveal>
          </div>
        </Container>
      </Section>
    </div>
  );
}
