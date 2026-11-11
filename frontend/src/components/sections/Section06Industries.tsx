import React from 'react';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { INDUSTRIES_COPY } from '@/lib/constants';
import { Rocket, ShoppingBag, Briefcase, Users } from 'lucide-react';

const CELL_DIVIDER_CLASSES = [
  'border-b border-line md:border-r lg:border-b-0',
  'border-b border-line lg:border-r lg:border-b-0',
  'border-b border-line md:border-b-0 md:border-r',
  '',
] as const;

export function Section06Industries() {
  const getIndustryIcon = (icon: string) => {
    switch (icon) {
      case 'rocket':
        return <Rocket size={20} className="text-accent" />;
      case 'shopping-bag':
        return <ShoppingBag size={20} className="text-accent" />;
      case 'briefcase':
        return <Briefcase size={20} className="text-accent" />;
      case 'users':
      default:
        return <Users size={20} className="text-accent" />;
    }
  };

  return (
    <Section tone="base">
      <Container>
        <SectionHeading
          eyebrow={INDUSTRIES_COPY.eyebrow}
          title={
            <>
              Built for <span className="font-italic-accent">ambitious</span> businesses.
            </>
          }
          copy="Tailored strategies that respect the operational realities, sales cycles, and margins of your business model."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded-xl border border-line bg-card overflow-hidden">
          {INDUSTRIES_COPY.items.map((item, idx) => (
            <div
              key={item.title}
              className={`p-6 lg:p-7 flex flex-col gap-3 hover:bg-elevated transition-colors ${
                CELL_DIVIDER_CLASSES[idx] ?? ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-elevated border border-line flex items-center justify-center shrink-0">
                  {getIndustryIcon(item.icon)}
                </div>
                <h3 className="font-display font-bold text-lg text-ink leading-snug">
                  {item.title}
                </h3>
              </div>

              <p className="text-sm text-soft leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
