import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { INDUSTRIES_COPY } from '@/lib/constants';
import { Rocket, ShoppingBag, Briefcase, Users } from 'lucide-react';

export function Section06Industries() {
  const getIndustryIcon = (icon: string) => {
    switch (icon) {
      case 'rocket':
        return <Rocket size={24} className="text-accent" />;
      case 'shopping-bag':
        return <ShoppingBag size={24} className="text-accent" />;
      case 'briefcase':
        return <Briefcase size={24} className="text-accent" />;
      case 'users':
      default:
        return <Users size={24} className="text-accent" />;
    }
  };

  return (
    <section className="py-24 md:py-32 bg-base">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIES_COPY.items.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl bg-card border border-line hover:border-line-strong hover:bg-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <div className="p-3.5 rounded-xl bg-elevated border border-line w-fit mb-6">
                  {getIndustryIcon(item.icon)}
                </div>
                <h3 className="font-display font-bold text-xl text-ink mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-soft leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
