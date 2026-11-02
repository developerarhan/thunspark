import React from 'react';
import { Container } from '@/components/ui/Container';
import { POSITIONING_STRIP } from '@/lib/constants';

export function Section03PositioningStrip() {
  return (
    <section className="bg-[#0A0A0A] border-y border-[#252525] py-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#252525]">
          {POSITIONING_STRIP.map((cell) => (
            <div
              key={cell.step}
              className="py-4 md:py-2 md:px-8 first:pt-0 last:pb-0 md:first:pl-0 md:last:pr-0 flex items-center gap-4"
            >
              <span className="font-mono text-xs text-[#FFD21F] font-bold shrink-0">
                {cell.step}
              </span>
              <span className="font-display font-medium text-base md:text-lg text-[#F5F5F0]">
                {cell.text}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
