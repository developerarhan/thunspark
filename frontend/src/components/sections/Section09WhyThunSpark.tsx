import React from 'react';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { WHY_THUNSPARK } from '@/lib/constants';

export function Section09WhyThunSpark() {
  return (
    <Section tone="alt">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading, Copy, CTA (not sticky) */}
          <div className="lg:col-span-5">
            <SectionHeading
              align="left"
              eyebrow={WHY_THUNSPARK.eyebrow}
              title={
                <>
                  An agency built like a{'\u00A0'}
                  <span className="font-italic-accent">growth partner.</span>
                </>
              }
              copy={WHY_THUNSPARK.copy}
              className="mb-8"
            />

            <Button
              href={WHY_THUNSPARK.cta.href}
              variant="primary"
              size="md"
              data-analytics-cta="why_growth_partner"
            >
              {WHY_THUNSPARK.cta.label}
            </Button>
          </div>

          {/* Right Column: 2x2 Grid of Principle Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {WHY_THUNSPARK.cards.map((card, idx) => (
              <div
                key={card.title}
                className="p-7 rounded-xl bg-card border border-line hover:border-line-strong hover:bg-elevated transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-xs text-accent font-bold mb-2">
                    0{idx + 1}
                  </div>
                  <h3 className="font-display font-bold text-xl text-ink mb-2.5">
                    {card.title}
                  </h3>
                  <p className="text-sm text-soft leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
