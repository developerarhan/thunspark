'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookingButton } from '@/components/ui/BookingButton';
import { HERO_COPY } from '@/lib/constants';
import { HeroGrowthDiagram } from '@/components/hero/HeroGrowthDiagram';
import { TRUSTED_BRANDS, FOUNDER_AVATARS } from '@/lib/brands';
import { ArrowRight, Star } from 'lucide-react';

export interface HeroTrustedBrand {
  id?: string;
  name: string;
  category: string;
  logo?: string | null;
  caseStudyHref?: string;
}

export interface Section01HeroProps {
  trustedBrands?: HeroTrustedBrand[];
}

export function Section01Hero({ trustedBrands }: Section01HeroProps = {}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentWord = HERO_COPY.rotatingSlots[count % HERO_COPY.rotatingSlots.length];

  // Double-buffered for seamless infinite marquee loop
  const sourceBrands =
    trustedBrands && trustedBrands.length > 0 ? trustedBrands : TRUSTED_BRANDS;
  const marqueeBrands = [...sourceBrands, ...sourceBrands];

  return (
    <Section tone="base" spacing="hero" className="overflow-hidden bg-grain pb-12 md:pb-16">
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
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.04] tracking-[-0.03em] text-ink break-words">
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

            {/* Inline Social Proof Badge (Option C Part 1) */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {/* Overlapping Founder Avatars */}
              <div className="flex -space-x-2.5 overflow-hidden py-0.5">
                {FOUNDER_AVATARS.map((avatar, i) => (
                  <div
                    key={i}
                    title={`${avatar.name} (${avatar.role})`}
                    className={`inline-block h-8 w-8 rounded-full ring-2 ring-base bg-gradient-to-br ${avatar.color} border border-line flex items-center justify-center font-mono font-bold text-[10px] shadow-sm select-none`}
                  >
                    {avatar.initials}
                  </div>
                ))}
              </div>

              {/* Stars & Social Proof Text */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className="fill-amber-400 text-amber-400 shrink-0"
                    />
                  ))}
                  <span className="text-xs font-bold text-ink ml-1 font-mono">
                    4.9 / 5
                  </span>
                </div>
                <p className="text-xs text-soft font-medium mt-0.5">
                  Trusted by 10+ founders & scale-ups
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Bottleneck, System, Breakthrough Architecture Diagram */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-5 items-center justify-center w-full">
            <HeroGrowthDiagram />
          </div>
        </div>

        {/* Full-Width Trusted Brands Marquee (Option C Part 2) */}
        <div className="mt-14 sm:mt-16 pt-10 border-t border-line/60">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-3 font-mono text-[13px] md:text-sm font-semibold uppercase tracking-widest text-soft">
              <span className="w-6 h-[2px] bg-accent inline-block shrink-0" />
              <span>TRUSTED BY HIGH-GROWTH BRANDS &amp; SCALE-UPS</span>
            </div>
          </div>

          <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div
              className="flex flex-row flex-nowrap w-max shrink-0 items-center gap-4 sm:gap-6 py-2 animate-marquee"
              style={{
                animation: 'marquee 35s linear infinite',
                willChange: 'transform',
              }}
            >
              {marqueeBrands.map((brand, i) => {
                const CardWrapper = brand.caseStudyHref ? Link : 'div';
                return (
                  <CardWrapper
                    key={`${brand.id || brand.name}-${i}`}
                    href={brand.caseStudyHref || ''}
                    className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-card/60 hover:bg-card border border-line hover:border-line-strong transition-all duration-300 group shrink-0"
                  >
                    {/* Brand Logo Image (from Sanity) OR Monogram Fallback */}
                    {brand.logo ? (
                      <span className="w-6 h-6 rounded-md bg-elevated border border-line flex items-center justify-center p-0.5 overflow-hidden shrink-0">
                        <img
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                          loading="lazy"
                        />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-md bg-elevated text-accent group-hover:text-accent-hi border border-line text-[10px] font-mono font-bold flex items-center justify-center transition-colors shrink-0">
                        {brand.name.slice(0, 1)}
                      </span>
                    )}

                    {/* Brand Name & Category */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-display font-semibold text-soft group-hover:text-ink transition-colors tracking-tight whitespace-nowrap">
                        {brand.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-elevated/80 text-meta border border-line/50 whitespace-nowrap">
                        {brand.category}
                      </span>
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
