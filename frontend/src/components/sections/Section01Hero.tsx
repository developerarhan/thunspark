'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookingButton } from '@/components/ui/BookingButton';
import { HERO_COPY } from '@/lib/constants';
import { HeroImageShowcase } from '@/components/hero/HeroImageShowcase';
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
  const [wordIndex, setWordIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync image index with 0.3s delay whenever wordIndex advances via autoplay
  const advanceToNext = useCallback(() => {
    setWordIndex((prev) => {
      const nextWord = (prev + 1) % HERO_COPY.rotatingSlots.length;
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = setTimeout(() => {
        setActiveImageIndex(nextWord);
      }, 300); // 0.3s delay for cause-and-effect transition
      return nextWord;
    });
  }, []);

  // Smart rotation timer: pauses on hover, resumes promptly within 1.5s on unhover, then cycles every 4.5s
  useEffect(() => {
    if (isHovered) {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      return;
    }

    let intervalTimer: NodeJS.Timeout | null = null;

    // Fast resume (1.5s) after moving cursor away instead of waiting a full 5s
    resumeTimeoutRef.current = setTimeout(() => {
      advanceToNext();
      intervalTimer = setInterval(advanceToNext, 4500);
    }, 1500);

    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      if (intervalTimer) clearInterval(intervalTimer);
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    };
  }, [isHovered, advanceToNext]);

  // Clean up any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // When user clicks a dot indicator, immediately jump both word and image
  const handleSelectDot = (index: number) => {
    if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    setWordIndex(index);
    setActiveImageIndex(index);
  };

  const currentWord = HERO_COPY.rotatingSlots[wordIndex % HERO_COPY.rotatingSlots.length];

  // Filter for brands with logos and quadruple-buffer for smooth seamless marquee flow
  const sourceBrands =
    trustedBrands && trustedBrands.length > 0 ? trustedBrands : TRUSTED_BRANDS;
  const logoBrands = sourceBrands.filter((b) => Boolean(b.logo));
  const marqueeBrands = [
    ...logoBrands,
    ...logoBrands,
    ...logoBrands,
    ...logoBrands,
  ];

  return (
    <Section tone="base" spacing="hero" className="overflow-hidden bg-grain pb-12 md:pb-16">
      <Container>
        {/* Eyebrow */}
        <div className="mb-6 sm:mb-8 inline-flex items-center gap-3 font-mono text-[13px] md:text-sm font-semibold uppercase tracking-widest text-soft">
          <span className="w-6 h-[2px] bg-accent inline-block shrink-0" />
          <span>{HERO_COPY.eyebrow}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Headlines & Positioning (6 cols on md/lg) */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between space-y-6 sm:space-y-8">
            <div className="space-y-6">
              {/* H1 with Rotating Word Slot */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.04] tracking-[-0.03em] text-ink break-words">
                We turn growth bottlenecks into{' '}
                <span className="relative inline-block h-[1.3em] overflow-hidden align-top text-accent pr-4">
                  {/* Static text for SEO crawlers */}
                  <span className="sr-only">breakthroughs</span>

                  {/* Animated dynamic slot with continuous forward conveyor flow */}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={wordIndex}
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
              <p className="text-soft text-base sm:text-lg lg:text-xl leading-relaxed font-sans">
                {HERO_COPY.lead}
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
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

              {/* Inline Social Proof Badge */}
              <div className="flex flex-wrap items-center gap-4">
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
          </div>

          {/* Right Column: Dynamic Word-Synced 3-Image Showcase (6 cols) */}
          <div className="md:col-span-6 lg:col-span-6 w-full flex items-start justify-center">
            <HeroImageShowcase
              activeIndex={activeImageIndex}
              onSelectIndex={handleSelectDot}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
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
                    title={brand.name}
                    aria-label={`${brand.name} case study`}
                    className="flex items-center justify-center h-20 sm:h-24 w-52 sm:w-64 px-6 sm:px-8 py-3.5 rounded-2xl bg-white hover:bg-white border border-white/30 hover:border-accent hover:shadow-[0_0_28px_rgba(255,210,31,0.25)] transition-all duration-300 group shrink-0 cursor-pointer shadow-sm"
                  >
                    {/* Brand Logo Only - Sized for High Visual Prominence */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={brand.logo!}
                        alt={`${brand.name} logo`}
                        className="max-h-12 sm:max-h-14 w-auto max-w-[88%] object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
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
