'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookingButton } from '@/components/ui/BookingButton';
import { HERO_COPY } from '@/lib/constants';
import { HeroGrowthDiagram } from '@/components/hero/HeroGrowthDiagram';
import { ArrowRight } from 'lucide-react';

export function Section01Hero() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentWord = HERO_COPY.rotatingSlots[count % HERO_COPY.rotatingSlots.length];

  return (
    <Section tone="base" spacing="hero" className="overflow-hidden bg-grain">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines & Positioning (7 cols on md/lg) */}
          <div className="md:col-span-7 lg:col-span-7 space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 font-mono text-[13px] md:text-sm font-semibold uppercase tracking-widest text-soft">
              <span className="w-6 h-[2px] bg-accent inline-block shrink-0" />
              <span>{HERO_COPY.eyebrow}</span>
            </div>

            {/* H1 with Rotating Word Slot */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.04] tracking-[-0.03em] text-ink">
              We turn growth bottlenecks into{' '}
              <span className="relative inline-block h-[1.3em] overflow-hidden align-top text-accent pr-4">
                {/* Static text for SEO crawlers */}
                <span className="sr-only">breakthroughs</span>

                {/* Animated dynamic slot with continuous forward conveyor flow */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={count}
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: '0%', opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block font-italic-accent whitespace-nowrap"
                    aria-hidden="true"
                  >
                    {currentWord}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            {/* Lead Narrative */}
            <p className="text-soft text-lg sm:text-xl leading-relaxed max-w-2xl font-sans">
              {HERO_COPY.lead}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <BookingButton
                location="hero_primary"
                variant="primary"
                size="lg"
                data-analytics-cta="hero_strategy_call"
              >
                <span>{HERO_COPY.primaryCta.label}</span>
                <ArrowRight size={18} className="ml-2 inline" />
              </BookingButton>
              <Button
                href={HERO_COPY.secondaryCta.href}
                variant="secondary"
                size="lg"
                data-analytics-cta="hero_see_work"
              >
                {HERO_COPY.secondaryCta.label}
              </Button>
            </div>
          </div>

          {/* Right Column: Bottleneck, System, Breakthrough Architecture Diagram */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-5 items-center justify-center w-full">
            <HeroGrowthDiagram />
          </div>
        </div>
      </Container>
    </Section>
  );
}
