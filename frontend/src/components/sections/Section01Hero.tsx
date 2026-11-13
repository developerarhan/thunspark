'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookingButton } from '@/components/ui/BookingButton';
import { HERO_COPY } from '@/lib/constants';
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Positioning (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
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

          {/* Right Column: Abstract Sculptural Visual + 4 Floating Chips (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[360px] md:min-h-[440px]">
            {/* Dark Obsidian Sculptural Render Canvas */}
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl bg-gradient-to-b from-elevated via-card to-canvas border border-line p-6 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/[0.03] to-transparent pointer-events-none" />

              {/* Central Geometric Obsidian Motif */}
              <div className="relative z-10 w-44 h-44 rounded-full border border-line-strong bg-alt/90 flex items-center justify-center p-4">
                <div className="w-32 h-32 rounded-full border border-accent/30 bg-card flex items-center justify-center">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-accent"
                  >
                    <path
                      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                      fill="#FFD21F"
                      stroke="#FFD21F"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Bottom Caption */}
              <div className="relative z-10 mt-8 text-center space-y-1">
                <div className="font-mono text-[11px] uppercase tracking-widest text-accent">
                  Strategy &bull; Execution &bull; Measurement
                </div>
                <p className="text-xs text-meta">
                  Connected growth architecture
                </p>
              </div>

              {/* 4 Floating Chips (SEO, Paid Media, CRO, Content) */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-6 left-4 px-3 py-1.5 rounded-full bg-elevated border border-line-strong text-xs font-mono text-ink"
              >
                SEO
              </motion.div>

              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 right-4 px-3 py-1.5 rounded-full bg-elevated border border-line-strong text-xs font-mono text-ink"
              >
                Paid Media
              </motion.div>

              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-16 left-4 px-3 py-1.5 rounded-full bg-elevated border border-line-strong text-xs font-mono text-ink"
              >
                CRO
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-12 right-4 px-3 py-1.5 rounded-full bg-elevated border border-line-strong text-xs font-mono text-ink"
              >
                Content
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
