'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export interface HeroImageItem {
  id: string;
  src: string;
  alt: string;
  title: string;
}

export const HERO_SHOWCASE_IMAGES: HeroImageItem[] = [
  {
    id: 'hero-img-1',
    src: '/images/hero/1.png',
    alt: 'Your Business Deserves More Than Just Marketing. It Deserves a Growth System.',
    title: 'Growth System Architecture',
  },
  {
    id: 'hero-img-2',
    src: '/images/hero/2.png',
    alt: 'From Attention to Measurable Growth: Marketing Journey Pipeline.',
    title: 'Measurable Growth Pipeline',
  },
  {
    id: 'hero-img-3',
    src: '/images/hero/3.png',
    alt: 'A Connected Marketing System: All channels working together to drive growth.',
    title: 'Connected Marketing Ecosystem',
  },
];

interface HeroImageShowcaseProps {
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

export function HeroImageShowcase({
  activeIndex,
  onSelectIndex,
  onMouseEnter,
  onMouseLeave,
  className = '',
}: HeroImageShowcaseProps) {
  const currentImage = HERO_SHOWCASE_IMAGES[activeIndex % HERO_SHOWCASE_IMAGES.length];

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-card border border-line hover:border-line-strong transition-all duration-300 shadow-2xl group select-none ${className}`}
    >
      {/* Ambient Gold Radial Halo */}
      <div
        aria-hidden="true"
        className="absolute -inset-1 bg-gradient-to-tr from-accent/15 via-accent/5 to-transparent rounded-2xl blur-2xl opacity-60 pointer-events-none -z-10 transition-opacity duration-500 group-hover:opacity-85"
      />

      {/* Main 16:9 Image Viewport - Fits 100% of column width and height without any cropping */}
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 720px"
              className="object-contain w-full h-full rounded-2xl drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle Bottom Vignette Gradient behind the dot indicators */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-14 sm:h-16 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none z-10"
        />

        {/* Centered Dot Indicators Anchored Neatly at the Bottom */}
        <div
          role="tablist"
          aria-label="Hero showcase slides"
          className="absolute bottom-2.5 sm:bottom-3.5 inset-x-0 flex items-center justify-center gap-2.5 z-20 pointer-events-auto"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 shadow-lg">
            {HERO_SHOWCASE_IMAGES.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show ${item.title}`}
                  onClick={() => onSelectIndex(idx)}
                  className={`relative transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? 'w-7 sm:w-8 h-2 bg-accent shadow-[0_0_12px_rgba(255,210,31,0.8)]'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
