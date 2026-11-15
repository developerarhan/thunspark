'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CREATIVE_SHOWCASE, type CreativeCard } from '@/lib/creatives-data';
import { ArrowUpRight } from 'lucide-react';

// Split the 25 showcase items across 5 vertical tracks (5 items each)
const COLUMNS: CreativeCard[][] = [
  CREATIVE_SHOWCASE.slice(0, 5),
  CREATIVE_SHOWCASE.slice(5, 10),
  CREATIVE_SHOWCASE.slice(10, 15),
  CREATIVE_SHOWCASE.slice(15, 20),
  CREATIVE_SHOWCASE.slice(20, 25),
];

// Staggered speeds for organic drifting motion
const COLUMN_CONFIGS = [
  { direction: 'drift-track-up', speed: '28s' },
  { direction: 'drift-track-down', speed: '34s' },
  { direction: 'drift-track-up', speed: '24s' },
  { direction: 'drift-track-down', speed: '32s' },
  { direction: 'drift-track-up', speed: '26s' },
];

function CreativeTile({ card }: { card: CreativeCard }) {
  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`${card.client} - ${card.title}`}
      className="group relative w-[190px] sm:w-[220px] h-[122px] sm:h-[138px] rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-300 transform-gpu hover:[transform:translateZ(45px)_scale(1.06)] hover:z-30 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.95)] border border-line/80 hover:border-accent/80"
      style={{
        backgroundColor: '#0a0a0c',
      }}
    >
      {/* Background Gradient & Subtle Grid Texture */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

      {/* Idle Darkening Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-300 pointer-events-none" />

      {/* Top Bar: Client & Category */}
      <div className="relative z-10 flex items-start justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-mono text-black shrink-0 shadow-sm"
            style={{ backgroundColor: card.accent }}
          >
            {card.client.slice(0, 1)}
          </span>
          <span className="font-display font-semibold text-xs text-ink truncate tracking-tight">
            {card.client}
          </span>
        </div>

        {card.metric && (
          <span
            className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border shrink-0 bg-base/80 text-ink shadow-sm"
            style={{ borderColor: `${card.accent}55` }}
          >
            {card.metric}
          </span>
        )}
      </div>

      {/* Bottom Bar: Title & Category Pill */}
      <div className="relative z-10 space-y-1">
        <p className="text-[11px] font-medium text-ink/90 group-hover:text-ink leading-snug line-clamp-2 transition-colors">
          {card.title}
        </p>

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[9px] font-mono text-meta uppercase tracking-wider">
            {card.category}
          </span>
          <ArrowUpRight
            size={12}
            className="text-soft group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}

export function SectionCreativeDriftWall() {
  return (
    <section
      id="creatives"
      data-site-section=""
      className="py-20 md:py-28 bg-alt text-ink overflow-hidden relative border-t border-line"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <Container className="relative z-20 pointer-events-none mb-10 md:mb-14">
        <SectionHeading
          eyebrow="OUR WORK"
          title={
            <>
              Real Results for <span className="font-italic-accent">Real</span> Brands.
            </>
          }
          copy="A visual lookbook of high-converting ad creatives, motion reels, brand identity systems, and digital assets engineered for scale."
          align="center"
        />
      </Container>

      {/* 3D Drifting Stage Wrapper */}
      <div
        className="drift-stage w-full max-w-6xl mx-auto h-[460px] sm:h-[520px] md:h-[580px] relative z-10"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Radial Edge Vignette Fade */}
        <div className="absolute inset-0 z-10 pointer-events-none [mask-image:radial-gradient(ellipse_78%_80%_at_50%_50%,transparent_40%,#000_100%)] bg-alt/80" />

        {/* 3D Tilted Plane */}
        <div
          className="w-full h-full flex justify-center items-center gap-3.5 sm:gap-5"
          style={{
            transform:
              'rotateX(12deg) rotateY(-8deg) rotateZ(0deg) translateZ(-40px) scale(1.12)',
            transformStyle: 'preserve-3d',
          }}
        >
          {COLUMNS.map((column, colIdx) => {
            const config = COLUMN_CONFIGS[colIdx % COLUMN_CONFIGS.length];
            // Double-buffered for continuous vertical looping
            const loopItems = [...column, ...column];

            return (
              <div
                key={colIdx}
                className="flex-shrink-0 overflow-hidden h-[800px] flex flex-col"
                style={
                  {
                    '--drift-speed': config.speed,
                  } as React.CSSProperties
                }
              >
                <div
                  className={`flex flex-col shrink-0 ${config.direction} gap-3.5 sm:gap-5 py-2`}
                  style={{
                    animation: `${config.direction === 'drift-track-up' ? 'driftVerticalUp' : 'driftVerticalDown'} ${config.speed} linear infinite`,
                    willChange: 'transform',
                  }}
                >
                  {loopItems.map((card, itemIdx) => (
                    <CreativeTile
                      key={`${card.id}-${colIdx}-${itemIdx}`}
                      card={card}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
