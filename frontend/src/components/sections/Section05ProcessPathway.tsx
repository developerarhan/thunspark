import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PROCESS_PATHWAY } from '@/lib/constants';

export function Section05ProcessPathway() {
  return (
    <section className="py-24 md:py-32 bg-alt border-y border-line">
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
        <div className="relative mt-16">
          {/* Desktop Horizontal Connecting Line */}
          <div className="hidden lg:block absolute top-10 left-12 right-12 h-[2px] bg-line z-0">
            <div className="h-full bg-gradient-to-r from-accent via-accent/60 to-accent/20 w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {PROCESS_PATHWAY.steps.map((step) => (
              <div
                key={step.number}
                className="group p-6 rounded-xl bg-card border border-line hover:border-line-strong hover:bg-elevated transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Step Number Dot */}
                  <div className="w-10 h-10 rounded-full bg-elevated border border-line-strong group-hover:border-accent group-hover:bg-accent text-ink group-hover:text-canvas font-mono text-xs font-bold flex items-center justify-center transition-all mb-6">
                    {step.number}
                  </div>

                  <h3 className="font-display font-bold text-lg text-ink mb-2.5 group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>

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
    </section>
  );
}
