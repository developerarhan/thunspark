import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { CheckCircle2, Cpu, ArrowRight } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About ThunSpark — We Solve Business Problems. Marketing Is How.',
  description:
    'Most agencies are built around channels — we are built around the bottleneck. Strategy, creative, web, media, and measurement under one roof.',
  ogTitle: 'About ThunSpark — Strategic Growth Partner',
  ogDescription:
    'We solve business problems. Marketing is how. Discover our principles, operating manifesto, and compounding growth process.',
  path: '/about',
});

const PRINCIPLES = [
  {
    number: '01',
    title: 'Problem-first',
    description:
      'We diagnose before we prescribe. If the honest answer is a refined landing page, not a high-ticket ad retainer, that is the answer we will give you.',
  },
  {
    number: '02',
    title: 'Full-funnel integration',
    description:
      'Strategy, execution, and measurement operate under one roof. No handoffs between disjointed vendors, no knowledge gaps, and zero finger-pointing.',
  },
  {
    number: '03',
    title: 'Senior-led delivery',
    description:
      'Every engagement is directly led and architected by experienced growth strategists — not sold by executives and passed off to junior account handlers.',
  },
  {
    number: '04',
    title: 'Radical transparency',
    description:
      'Reporting you can independently audit. Budgets you can trace down to the penny. If a campaign or channel underperforms, you will hear it from us first.',
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    name: 'Diagnose',
    tagline: 'Isolate the commercial friction point.',
    description:
      'We audit ad accounts, full-funnel analytics, user session journeys, and landing pages to identify what is actually choking revenue velocity.',
  },
  {
    step: '02',
    name: 'Strategize',
    tagline: 'Engineer a prioritized 90-day roadmap.',
    description:
      'A structured game plan defining what to fix, what to build, and where to allocate spend — backed by clear economic unit targets.',
  },
  {
    step: '03',
    name: 'Build',
    tagline: 'Ship high-performing growth assets.',
    description:
      'Bespoke web experiences, high-converting copy, targeted ad creative, and editorial content engineered specifically to the agreed strategy.',
  },
  {
    step: '04',
    name: 'Launch',
    tagline: 'Deploy with precision instrumentation.',
    description:
      'Server-side tracking, verified conversion events, and clean attribution pipelines ensure zero data degradation across all touchpoints.',
  },
  {
    step: '05',
    name: 'Measure & Optimize',
    tagline: 'Compound gains against revenue.',
    description:
      'Transparent weekly reporting against bottom-line business metrics. Continuous iteration loops to lower customer acquisition costs.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-line">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-3">
                ABOUT THUNSPARK
              </span>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-6">
                We solve business problems. <br className="hidden sm:inline" />
                <span className="text-meta">Marketing is how.</span>
              </h1>
              <p className="text-soft text-base sm:text-lg leading-relaxed max-w-2xl">
                Most agencies are built around channels — we are built around the bottleneck. Strategy, creative, web, media, and measurement under one roof.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. MANIFESTO BLOCK */}
      <section className="py-20 md:py-28 bg-alt border-b border-line">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                  THE MANIFESTO
                </span>
                <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight mb-4">
                  The tools change. <br />
                  The ambition doesn&apos;t.
                </h2>
                <p className="text-soft text-sm md:text-base leading-relaxed">
                  We do not believe in busywork. We do not believe in reporting vanity metrics while sales stall. Every strategy we build is rooted in your unit economics, your distribution reality, and your category dynamics.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <Reveal delay={0.1}>
                <Card className="p-6 md:p-8 bg-card border-line space-y-4">
                  <h3 className="font-display font-medium text-xl text-ink mb-2">
                    Our Operating Thesis
                  </h3>
                  <div className="space-y-3">
                    {[
                      'No marketing tactics without commercial rationale.',
                      'No traffic acquisition without conversion architecture.',
                      'No creative production without distribution blueprints.',
                      'No metric reporting without revenue accountability.',
                    ].map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-ink">{rule}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </Reveal>

              {/* AI Honesty Tag */}
              <Reveal delay={0.15}>
                <Card className="p-6 bg-elevated border border-line-strong">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-line text-accent flex items-center justify-center shrink-0">
                      <Cpu size={18} />
                    </div>
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-wider text-accent mb-1">
                        AI Honesty Statement
                      </h4>
                      <p className="text-xs md:text-sm text-soft leading-relaxed">
                        We use modern AI tooling across our research, data processing, and asset generation pipelines. We never use it to replace original thinking, bespoke client strategy, or senior human accountability.
                      </p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. PRINCIPLES */}
      <section className="py-20 md:py-28 border-b border-line">
        <Container>
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                HOW WE OPERATE
              </span>
              <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight mb-4">
                Four principles we refuse to break.
              </h2>
              <p className="text-soft text-sm md:text-base">
                These four commitments guide every engagement, client conversation, and campaign we ship.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRINCIPLES.map((principle, idx) => (
              <Reveal key={principle.number} delay={idx * 0.08}>
                <Card className="p-6 md:p-8 h-full bg-card border-line">
                  <span className="font-mono text-xs font-bold text-accent block mb-4">
                    {principle.number} / COMMITMENT
                  </span>
                  <h3 className="font-display font-medium text-2xl text-ink mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-soft text-sm md:text-base leading-relaxed">
                    {principle.description}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. VERTICAL PROCESS PATHWAY */}
      <section className="py-20 md:py-28 bg-alt border-b border-line">
        <Container>
          <Reveal>
            <div className="max-w-2xl mb-16">
              <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-2">
                A COMPOUNDING PROCESS
              </span>
              <h2 className="font-display font-medium text-3xl md:text-4xl text-ink tracking-tight mb-4">
                How an engagement unfolds.
              </h2>
              <p className="text-soft text-sm md:text-base">
                From initial diagnostic to continuous revenue optimization, every stage builds compounding leverage.
              </p>
            </div>
          </Reveal>

          {/* Vertical Timeline */}
          <div className="relative border-l border-line ml-4 md:ml-8 pl-6 md:pl-10 space-y-12 max-w-3xl">
            {PROCESS_STEPS.map((step, idx) => (
              <Reveal key={step.step} delay={idx * 0.08}>
                <div className="relative">
                  {/* Step Node Dot */}
                  <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-base border-2 border-accent" />

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-bold text-accent">
                        STAGE {step.step}
                      </span>
                      <span className="text-line-strong">•</span>
                      <h3 className="font-display font-medium text-xl md:text-2xl text-ink">
                        {step.name}
                      </h3>
                    </div>

                    <p className="font-display text-sm text-ink italic mb-2">
                      {step.tagline}
                    </p>

                    <p className="text-soft text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="max-w-4xl mx-auto rounded-2xl border border-line bg-card p-8 sm:p-14 text-center relative overflow-hidden">
            <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-3">
              GROWTH PARTNERSHIP
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-ink tracking-tight mb-4">
              Ready to find your growth bottleneck?
            </h2>
            <p className="text-soft text-base leading-relaxed max-w-xl mx-auto mb-8">
              Book a 30-minute strategy call. We will review your current channels, isolate where revenue leaks, and tell you what we would fix first.
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
