import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal } from '@/components/motion/Reveal';
import { ServiceDetail } from '@/lib/services-data';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface ServiceTemplateProps {
  service: ServiceDetail;
}

export function ServiceTemplate({ service }: ServiceTemplateProps) {
  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 border-b border-[#252525]">
        <Container>
          <Reveal>
            <div className="max-w-4xl">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A8A85] hover:text-[#FFD21F] transition-colors mb-6"
              >
                <ArrowLeft size={14} />
                <span>All Services</span>
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <Tag variant="accent">
                  Chapter {service.groupNumber} / {service.groupName}
                </Tag>
              </div>

              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-[#F5F5F0] tracking-tight mb-6">
                {service.name}
              </h1>

              <div className="p-4 md:p-5 rounded-lg bg-[#111111] border border-[#252525] border-l-2 border-l-[#FFD21F] mb-8">
                <p className="font-display text-lg md:text-xl text-[#F5F5F0] italic">
                  &ldquo;{service.oneLineOutcome}&rdquo;
                </p>
              </div>

              <p className="text-[#8A8A85] text-base sm:text-lg leading-relaxed max-w-3xl mb-8">
                {service.longDesc}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button href="/contact" variant="primary" size="lg">
                  <span>Book a strategy call</span>
                  <ArrowRight size={16} />
                </Button>
                <Button href="#deliverables" variant="secondary" size="lg">
                  <span>See deliverables</span>
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2. SUB-SERVICES GRID */}
      <section className="py-20 md:py-28 border-b border-[#252525]">
        <Container>
          <Reveal>
            <div className="mb-12">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-2">
                CORE CAPABILITIES
              </span>
              <h2 className="font-display font-medium text-3xl md:text-4xl text-[#F5F5F0] tracking-tight">
                What&apos;s included in this system.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.subServices.map((sub, idx) => (
              <Reveal key={idx} delay={idx * 0.08}>
                <Card className="p-6 md:p-8 h-full bg-[#111111] border-[#252525]">
                  <div className="w-8 h-8 rounded-full bg-[#171717] border border-[#252525] flex items-center justify-center font-mono text-xs font-bold text-[#FFD21F] mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="font-display font-medium text-xl text-[#F5F5F0] mb-2">
                    {sub.title}
                  </h3>
                  <p className="text-[#8A8A85] text-sm leading-relaxed">
                    {sub.description}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. PROBLEMS SOLVED */}
      <section className="py-20 md:py-28 bg-[#0A0A0A] border-b border-[#252525]">
        <Container>
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-2">
                THE BOTTLENECKS
              </span>
              <h2 className="font-display font-medium text-3xl md:text-4xl text-[#F5F5F0] tracking-tight mb-4">
                Problems we solve.
              </h2>
              <p className="text-[#8A8A85] text-sm md:text-base">
                If your team is facing any of these friction points, this discipline is engineered specifically to eliminate them.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.problemsSolved.map((problem, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <Card className="p-6 md:p-8 h-full bg-[#111111] border-[#252525]">
                  <div className="flex items-center gap-3 mb-4 text-[#FFD21F]">
                    <AlertCircle size={20} className="shrink-0" />
                    <span className="font-mono text-xs uppercase tracking-wider text-[#8A8A85]">
                      Issue 0{idx + 1}
                    </span>
                  </div>
                  <p className="font-display font-medium text-base md:text-lg text-[#F5F5F0] leading-snug">
                    {problem}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. WHAT WE DELIVER (DELIVERABLES) */}
      <section id="deliverables" className="py-20 md:py-28 border-b border-[#252525] scroll-mt-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="sticky top-28">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-2">
                    TANGIBLE ASSETS
                  </span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-[#F5F5F0] tracking-tight mb-4">
                    What we deliver.
                  </h2>
                  <p className="text-[#8A8A85] text-sm md:text-base leading-relaxed mb-6">
                    No vanity decks or hand-waving consultations. We deliver structured, documented assets that plug directly into your growth stack.
                  </p>
                  <Button href="/contact" variant="primary" size="md">
                    <span>Inquire about this scope</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Card className="p-6 md:p-8 bg-[#111111] border-[#252525] space-y-4">
                {service.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-[#252525] last:border-b-0 last:pb-0">
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

      {/* 5. WHAT RESULTS LOOK LIKE */}
      <section className="py-20 md:py-28 bg-[#0A0A0A] border-b border-[#252525]">
        <Container>
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-2">
                MEASURABLE OUTCOMES
              </span>
              <h2 className="font-display font-medium text-3xl md:text-4xl text-[#F5F5F0] tracking-tight mb-4">
                What results look like.
              </h2>
              <p className="text-[#8A8A85] text-sm md:text-base">
                How we measure genuine success once the system is live and operating.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {service.whatResultsLookLike.map((result, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <Card className="p-6 md:p-8 h-full bg-[#111111] border-[#252525]">
                  <div className="flex items-center gap-2 mb-3 text-[#FFD21F]">
                    <Sparkles size={16} />
                    <span className="font-mono text-xs uppercase tracking-wider text-[#8A8A85]">
                      Signal 0{idx + 1}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-[#F5F5F0] leading-relaxed">
                    {result}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. FAQ ACCORDION */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-20 md:py-28 border-b border-[#252525]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Reveal>
                <div className="text-center mb-12">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-2">
                    COMMON QUESTIONS
                  </span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-[#F5F5F0] tracking-tight">
                    Frequently asked questions.
                  </h2>
                </div>
              </Reveal>

              <Accordion items={service.faqs} />
            </div>
          </Container>
        </section>
      )}

      {/* 7. FINAL CTA BAND */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="max-w-4xl mx-auto rounded-2xl border border-[#252525] bg-[#111111] p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(255,210,31,0.12)_0%,transparent_70%)] pointer-events-none" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#FFD21F] block mb-3">
              NEXT STEP
            </span>
            <h2 className="font-display font-medium text-3xl sm:text-4xl text-[#F5F5F0] tracking-tight mb-4">
              Ready to find your bottleneck?
            </h2>
            <p className="text-[#8A8A85] text-base leading-relaxed max-w-xl mx-auto mb-8">
              Book a 30-minute strategy call. We will review your current {service.name.toLowerCase()} assets and tell you what we would fix first.
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
