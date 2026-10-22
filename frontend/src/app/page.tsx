import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { InteractiveGrowthSystem } from '@/components/home/InteractiveGrowthSystem';
import { InteractiveServiceShowcase } from '@/components/home/InteractiveServiceShowcase';
import { apiClient } from '@/lib/api-client';


async function getHomepageData() {
  try {
    const [stagesRes, groupsRes, industriesRes, principlesRes, contentRes] = await Promise.all([
      apiClient.GET('/api/content/growth-stages/', {
        next: { tags: ['growth-stages', 'homepage'] },
      }),
      apiClient.GET('/api/content/service-groups/', {
        next: { tags: ['services', 'homepage'] },
      }),
      apiClient.GET('/api/content/industries/', {
        next: { tags: ['industries', 'homepage'] },
      }),
      apiClient.GET('/api/content/principles/', {
        next: { tags: ['principles', 'homepage'] },
      }),
      apiClient.GET('/api/content/homepage/', {
        next: { tags: ['homepage-content', 'homepage'] },
      }),
    ]);

    const unpack = (res: any) => {
      if (!res?.data) return [];
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data.results)) return res.data.results;
      return [];
    };

    return {
      stages: unpack(stagesRes),
      serviceGroups: unpack(groupsRes),
      industries: unpack(industriesRes),
      principles: unpack(principlesRes),
      homepageSections: unpack(contentRes),
    };
  } catch {
    return {
      stages: [],
      serviceGroups: [],
      industries: [],
      principles: [],
      homepageSections: [],
    };
  }
}

export default async function HomePage() {
  const { stages, serviceGroups, industries, principles } = await getHomepageData();

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <Section className="pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-accent/5 blur-[130px] rounded-full pointer-events-none" />

        <Container className="relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <ScrollReveal delay={0.1}>
              <Badge variant="accent" className="mb-6">
                Strategic Digital Growth Agency
              </Badge>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-text-primary mb-8">
                Digital Marketing Built Around <span className="text-accent">Your Growth.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="text-text-secondary text-lg sm:text-xl leading-relaxed max-w-2xl mb-10">
                We help ambitious businesses turn strategy, content, search, websites, and digital channels into a connected system designed to attract, convert, and grow customers.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Button
                  href="/contact"
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                  data-analytics-cta="hero_start_conversation"
                  data-analytics-location="home_hero"
                >
                  <span>Start a Conversation</span>
                  <ArrowRight size={18} className="ml-2" />
                </Button>

                <Button
                  href="/services"
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  data-analytics-cta="hero_explore_services"
                  data-analytics-location="home_hero"
                >
                  Explore Services
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* 2. THE PROBLEM SECTION */}
      <Section className="bg-bg-secondary border-y border-border py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ScrollReveal>
              <Badge variant="neutral" className="mb-4">
                The Bottleneck
              </Badge>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-6">
                More Marketing Isn&apos;t Always the Answer.
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Most companies invest heavily into tactical activities while compounding commercial leakage across disconnects:
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Content Without Strategy",
                desc: "Publishing high volumes of articles and social posts that never address buyer buying friction or commercial search intent.",
              },
              {
                title: "Traffic Without Conversions",
                desc: "Pouring budget into visits that bounce within seconds due to missing value propositions and absent conversion architecture.",
              },
              {
                title: "Websites Without Clear Positioning",
                desc: "Digital storefronts using vague templates that look and sound identical to hundreds of legacy competitors.",
              },
              {
                title: "Social Without Business Objectives",
                desc: "Chasing vanity engagement metrics while failing to nurture qualified decision-makers into pipeline.",
              },
              {
                title: "SEO Without Search Intent",
                desc: "Ranking for informational keywords that bring zero buyers ready to commission services or make purchases.",
              },
              {
                title: "Advertising Without Conversion Paths",
                desc: "Driving expensive ad clicks directly to bloated homepages with broken attribution and high drop-off.",
              },
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.08}>
                <Card className="p-8 h-full flex flex-col justify-between border-border bg-surface hover:border-border-strong transition-all">
                  <div>
                    <div className="w-8 h-8 rounded-full bg-accent-soft text-accent flex items-center justify-center font-mono text-xs font-bold mb-4">
                      0{idx + 1}
                    </div>
                    <h3 className="font-display font-semibold text-lg text-text-primary mb-3">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3} className="text-center mt-16">
            <p className="font-display font-semibold text-xl text-text-primary">
              &ldquo;Start with the business problem. Then build the marketing system around it.&rdquo;
            </p>
          </ScrollReveal>
        </Container>
      </Section>

      {/* 3. SIGNATURE INTERACTIVE GROWTH SYSTEM (DYNAMIC FROM CMS) */}
      <Section className="py-28">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <ScrollReveal>
              <Badge variant="accent" className="mb-4">
                The Growth System
              </Badge>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-text-primary mb-6">
                Connected Growth Engine
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Click any stage to explore how we connect discovery, positioning, and acquisition into compound business momentum.
              </p>
            </ScrollReveal>
          </div>

          <InteractiveGrowthSystem stages={stages as any} />
        </Container>
      </Section>

      {/* 4. CMS SERVICES INTERACTIVE SHOWCASE */}
      {serviceGroups.length > 0 && (
        <Section className="bg-bg-secondary border-t border-border py-28">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <ScrollReveal>
                <Badge variant="neutral" className="mb-4">
                  Capabilities
                </Badge>
                <h2 className="font-display font-bold text-3xl sm:text-5xl text-text-primary mb-6">
                  Five Core Growth Disciplines
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Tailored solutions engineered around root commercial problems rather than prepackaged retainer bundles.
                </p>
              </ScrollReveal>
            </div>

            <InteractiveServiceShowcase groups={serviceGroups as any} />
          </Container>
        </Section>
      )}

      {/* 5. WHO WE HELP (INDUSTRIES) */}
      {industries.length > 0 && (
        <Section className="py-24">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <ScrollReveal>
                <Badge variant="accent" className="mb-4">
                  Vertical Specialization
                </Badge>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-6">
                  Who We Help
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  We partner with ambitious global businesses positioned to dominate their niche.
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {industries.map((ind: any, idx: number) => (
                <ScrollReveal key={ind.slug} delay={idx * 0.08}>
                  <Card className="p-6 h-full flex flex-col justify-between border-border bg-surface hover:border-accent/50 hover:bg-surface-elevated transition-all">
                    <div>
                      <h4 className="font-display font-bold text-base text-text-primary mb-3">
                        {ind.name}
                      </h4>
                      <p className="text-text-secondary text-xs leading-relaxed">
                        {ind.description}
                      </p>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 6. WHY THUNSPARK (PRINCIPLES) */}
      {principles.length > 0 && (
        <Section className="bg-bg-secondary border-y border-border py-24">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <ScrollReveal>
                <Badge variant="neutral" className="mb-4">
                  Our Philosophy
                </Badge>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-6">
                  Why Thunspark
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Five foundational principles that guide every strategy we design.
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {principles.map((pr: any, idx: number) => (
                <ScrollReveal key={pr.id} delay={idx * 0.08}>
                  <Card className="p-8 h-full flex flex-col justify-between border-border bg-surface">
                    <div>
                      <div className="flex items-center gap-2 text-accent mb-4 font-mono text-xs font-bold">
                        <CheckCircle2 size={16} />
                        <span>Principle 0{idx + 1}</span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-text-primary mb-2">
                        {pr.title}
                      </h3>
                      <p className="text-text-muted text-xs font-medium mb-4">
                        {pr.subtitle}
                      </p>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {pr.description}
                      </p>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 7. HONEST EMPTY PORTFOLIO STATE */}
      <Section className="py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <Badge variant="outline" className="mb-4">
                Portfolio Pipeline
              </Badge>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-6">
                Building What Comes Next.
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                We&apos;re building this portfolio one ambitious project at a time. As we work with businesses around the world, this space will become a collection of the strategies, systems, and outcomes we create.
              </p>
              <Button href="/contact" variant="primary">
                Work With Us
              </Button>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* 8. FINAL CONVERSION CTA */}
      <Section className="py-28 relative">
        <div className="absolute inset-0 bg-accent-soft/20 pointer-events-none" />
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <Badge variant="accent" className="mb-4">
                Take The Next Step
              </Badge>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-text-primary mb-6">
                Have a Growth Problem Worth Solving?
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-10">
                Tell us where you&apos;re stuck. We&apos;ll start with the business problem, not a sales pitch.
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
