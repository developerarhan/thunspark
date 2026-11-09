'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
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
    <section className="relative pt-36 md:pt-44 pb-20 md:pb-28 overflow-hidden bg-[#050505] bg-grain">
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#FFD21F]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Positioning (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#8A8A85]">
              <span className="w-6 h-[2px] bg-[#FFD21F] inline-block shrink-0" />
              <span>{HERO_COPY.eyebrow}</span>
            </div>

            {/* H1 with Rotating Word Slot */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.04] tracking-[-0.03em] text-[#F5F5F0]">
              We turn growth bottlenecks into{' '}
              <span className="relative inline-block h-[1.15em] overflow-hidden align-top text-[#FFD21F] pr-1.5">
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
            <p className="text-[#A6A6A0] text-lg sm:text-xl leading-relaxed max-w-2xl font-sans">
              {HERO_COPY.lead}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                href={HERO_COPY.primaryCta.href}
                variant="primary"
                size="lg"
                data-analytics-cta="hero_strategy_call"
              >
                <span>{HERO_COPY.primaryCta.label}</span>
                <ArrowRight size={18} className="ml-2 inline" />
              </Button>
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
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl bg-gradient-to-b from-[#171717] via-[#111111] to-[#050505] border border-[#252525] p-6 flex flex-col items-center justify-center overflow-hidden group">
              {/* Sleek Golden Light Streak Accent */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#FFD21F]/10 rounded-full blur-3xl group-hover:bg-[#FFD21F]/20 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#FFD21F]/[0.03] to-transparent pointer-events-none" />

              {/* Central Geometric Obsidian Motif */}
              <div className="relative z-10 w-44 h-44 rounded-full border border-[#353535] bg-[#0A0A0A]/90 flex items-center justify-center p-4">
                <div className="w-32 h-32 rounded-full border border-[#FFD21F]/30 bg-[#111111] flex items-center justify-center">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#FFD21F]"
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
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#FFD21F]">
                  Strategy &bull; Execution &bull; Measurement
                </div>
                <p className="text-xs text-[#8A8A85]">
                  Connected growth architecture
                </p>
              </div>

              {/* 4 Floating Chips (SEO, Paid Media, CRO, Content) */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-6 left-4 px-3 py-1.5 rounded-full bg-[#171717] border border-[#353535] text-xs font-mono text-[#F5F5F0]"
              >
                SEO
              </motion.div>

              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 right-4 px-3 py-1.5 rounded-full bg-[#171717] border border-[#353535] text-xs font-mono text-[#F5F5F0]"
              >
                Paid Media
              </motion.div>

              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-16 left-4 px-3 py-1.5 rounded-full bg-[#171717] border border-[#353535] text-xs font-mono text-[#F5F5F0]"
              >
                CRO
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-12 right-4 px-3 py-1.5 rounded-full bg-[#171717] border border-[#353535] text-xs font-mono text-[#F5F5F0]"
              >
                Content
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
