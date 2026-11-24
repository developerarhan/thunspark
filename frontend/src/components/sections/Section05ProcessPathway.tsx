import React from 'react';
import Image from 'next/image';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PROCESS_PATHWAY } from '@/lib/constants';

export function Section05ProcessPathway() {
  return (
    <Section tone="alt">
      <Container>
        <SectionHeading
          eyebrow={PROCESS_PATHWAY.eyebrow}
          title={
            <>
              A process built to <span className="font-italic-accent">compound.</span>
            </>
          }
          copy="Systematic, cyclical, and tied to revenue. We eliminate guesswork with structured execution sprints."
        />

        {/* 5-Node Process Track */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 xl:gap-8 relative z-10">
            {PROCESS_PATHWAY.steps.map((step) => (
              <div
                key={step.number}
                className="group p-5 sm:p-6 rounded-xl bg-card border border-line hover:border-line-strong hover:bg-elevated transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Visual Illustration without number overlay */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-line/80 bg-surface group-hover:border-accent/40 transition-colors mb-5">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Subtle bottom vignette to blend with card */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                  </div>

                  {/* Step Number & Title */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="w-7 h-7 rounded-full bg-elevated border border-line-strong group-hover:border-accent group-hover:bg-accent text-ink group-hover:text-canvas font-mono text-xs font-bold flex items-center justify-center transition-all shrink-0">
                      {step.number}
                    </span>
                    <h3 className="font-display font-bold text-lg text-ink group-hover:text-accent transition-colors">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs text-soft leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-line">
                  {step.chips.map((chip, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-elevated text-meta border border-line"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
