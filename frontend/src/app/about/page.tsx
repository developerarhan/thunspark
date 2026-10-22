import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { apiClient } from '@/lib/api-client';
import { ArrowRight, CheckCircle2, Target, Lightbulb, Compass, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Thunspark — Strategic Philosophy & Approach',
  description:
    'Marketing should solve business problems rather than generate activity. Discover why Thunspark exists and how we think about digital growth.',
};

async function getPrinciples() {
  try {
    const res = await apiClient.GET('/api/content/principles/', {
      next: { tags: ['principles', 'about'] },
    });
    if (!res?.data) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray((res.data as any).results)) return (res.data as any).results;
    return [];
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const principles = await getPrinciples();

  return (
    <div className="flex flex-col">
      {/* 1. HERO / WHY THUNSPARK EXISTS */}
      <Section className="pt-20 pb-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <Badge variant="accent" className="mb-4">
                Company Philosophy
              </Badge>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight mb-8">
                Why Thunspark <span className="text-accent">Exists.</span>
              </h1>
              <p className="text-text-secondary text-lg sm:text-xl leading-relaxed">
                The digital agency landscape is filled with tactics executed in silos: SEO agencies that ignore conversion, ad agencies that ignore unit economics, and design studios that ignore search intent.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* 2. HOW WE THINK */}
      <Section className="bg-bg-secondary border-y border-border py-24">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <Badge variant="neutral" className="mb-4">
                Core Thesis
              </Badge>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-6">
                Marketing Must Solve Business Problems, Not Just Generate Activity.
              </h2>
              <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
                <p>
                  Most companies have no shortage of &ldquo;activity&rdquo;—they publish social content, redesign homepages, and boost posts. Yet their customer acquisition costs continue to climb while sales pipelines remain inconsistent.
                </p>
                <p>
                  We believe real marketing impact starts by isolating the underlying commercial bottleneck. Only when the friction point is proven do we architect the messaging, search footprint, content assets, and ad campaigns around it.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <Card className="p-8 sm:p-10 border-accent/30 bg-surface-elevated space-y-6">
                <h3 className="font-display font-bold text-xl text-text-primary">
                  The Thunspark Operating Rule:
                </h3>
                <div className="space-y-4">
                  {[
                    "No tactics without commercial objectives.",
                    "No traffic acquisition without conversion architecture.",
                    "No creative production without distribution blueprints.",
                    "No metric tracking without revenue accountability.",
                  ].map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-text-primary">{rule}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* 3. OUR APPROACH (5 STAGES) */}
      <Section className="py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ScrollReveal>
              <Badge variant="accent" className="mb-4">
                Execution Blueprint
              </Badge>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-6">
                Our Strategic Approach
              </h2>
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                Problem &rarr; Strategy &rarr; Execution &rarr; Measurement &rarr; Optimization
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Problem',
                desc: 'Diagnose the bottleneck: lack of awareness, low conversion, or high churn.',
                icon: Target,
              },
              {
                step: '02',
                title: 'Strategy',
                desc: 'Define positioning, search intent mapping, and capital-efficient channels.',
                icon: Compass,
              },
              {
                step: '03',
                title: 'Execution',
                desc: 'Build high-velocity creative, high-converting landing pages, and search assets.',
                icon: Zap,
              },
              {
                step: '04',
                title: 'Measurement',
                desc: 'Capture full-funnel attribution and track true commercial revenue metrics.',
                icon: Lightbulb,
              },
              {
                step: '05',
                title: 'Optimization',
                desc: 'Systematically iterate to lower CAC and scale lifetime customer value.',
                icon: CheckCircle2,
              },
            ].map((st, idx) => {
              const Icon = st.icon;
              return (
                <ScrollReveal key={idx} delay={idx * 0.08}>
                  <Card className="p-6 h-full flex flex-col justify-between border-border bg-surface hover:border-accent/40 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-xs font-bold text-accent">{st.step}</span>
                        <Icon size={18} className="text-text-muted" />
                      </div>
                      <h4 className="font-display font-bold text-base text-text-primary mb-2">
                        {st.title}
                      </h4>
                      <p className="text-text-secondary text-xs leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 4. WHAT WE BELIEVE (PRINCIPLES) */}
      {principles.length > 0 && (
        <Section className="bg-bg-secondary border-t border-border py-24">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <ScrollReveal>
                <Badge variant="neutral" className="mb-4">
                  Guiding Values
                </Badge>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-6">
                  What We Believe
                </h2>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  These principles govern every growth system we deploy.
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {principles.map((pr: any, idx: number) => (
                <ScrollReveal key={pr.id} delay={idx * 0.08}>
                  <Card className="p-8 h-full flex flex-col justify-between border-border bg-surface">
                    <div>
                      <span className="font-mono text-xs font-bold text-accent block mb-3">
                        Rule 0{idx + 1}
                      </span>
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

      {/* 5. FINAL CTA */}
      <Section className="py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <Badge variant="accent" className="mb-4">
                Next Step
              </Badge>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-6">
                Let&apos;s Talk.
              </h2>
              <p className="text-text-secondary text-base leading-relaxed mb-8">
                Ready to replace disconnected marketing activity with a strategic growth engine?
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
