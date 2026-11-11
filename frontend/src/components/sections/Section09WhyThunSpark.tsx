import React from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { WHY_THUNSPARK } from '@/lib/constants';

export function Section09WhyThunSpark() {
  return (
    <section className="py-24 md:py-32 bg-base">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Sticky Left Column (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
            <div className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-meta">
              <span className="w-6 h-[2px] bg-accent inline-block shrink-0" />
              <span>{WHY_THUNSPARK.eyebrow}</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.12] tracking-[-0.02em] text-ink">
              An agency built like a{' '}
              <span className="font-italic-accent">growth partner.</span>
            </h2>

            <p className="text-soft text-base sm:text-lg leading-relaxed">
              {WHY_THUNSPARK.copy}
            </p>

            <div className="pt-2">
              <Button
                href={WHY_THUNSPARK.cta.href}
                variant="primary"
                size="md"
                data-analytics-cta="why_growth_partner"
              >
                {WHY_THUNSPARK.cta.label}
              </Button>
            </div>
          </div>

          {/* Right Column: 4 Principle Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {WHY_THUNSPARK.cards.map((card, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl bg-card border border-line hover:border-line-strong hover:bg-elevated transition-all"
              >
                <div className="font-mono text-xs text-accent font-bold mb-2">
                  0{idx + 1}
                </div>
                <h3 className="font-display font-bold text-xl text-ink mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-soft leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
