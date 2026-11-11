import React from 'react';
import { Container, Section } from '@/components/ui/Container';
import { POSITIONING_STRIP } from '@/lib/constants';

export function Section03PositioningStrip() {
  return (
    <Section tone="alt" spacing="compact">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line">
          {POSITIONING_STRIP.map((cell) => (
            <div
              key={cell.step}
              className="py-4 md:py-2 md:px-8 first:pt-0 last:pb-0 md:first:pl-0 md:last:pr-0 flex items-center md:justify-center gap-4"
            >
              <span className="font-mono text-xs text-accent font-bold shrink-0">
                {cell.step}
              </span>
              <span className="font-display font-medium text-base md:text-lg text-ink">
                {cell.text}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
