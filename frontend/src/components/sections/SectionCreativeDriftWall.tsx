'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CREATIVE_SHOWCASE, type CreativeCard } from '@/lib/creatives-data';
import { ArrowUpRight } from 'lucide-react';

// Staggered speeds for organic drifting motion across 4 columns
const COLUMN_CONFIGS = [
  { direction: 'drift-track-up', speed: '26s' },
  { direction: 'drift-track-down', speed: '32s' },
  { direction: 'drift-track-up', speed: '24s' },
  { direction: 'drift-track-down', speed: '30s' },
];

function CreativeTile({ card }: { card: CreativeCard }) {
  const content = (
    <>
      {/* Background Gradient & Subtle Grid Texture */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
      />
      {card.thumbnailUrl && (
        <img
          src={card.thumbnailUrl}
          alt={card.title}
          className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
          loading="lazy"
        />
      )}
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
    </>
  );

  const containerClasses =
    'group relative w-[190px] sm:w-[220px] h-[122px] sm:h-[138px] rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-300 transform-gpu hover:[transform:translateZ(45px)_scale(1.06)] hover:z-30 hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.95)] border border-line/80 hover:border-accent/80 block text-left';

  if (card.projectSlug) {
    return (
      <Link
        href={`/projects/${card.projectSlug}`}
        aria-label={`${card.client} - ${card.title} (View Case Study)`}
        className={containerClasses}
        style={{ backgroundColor: '#0a0a0c' }}
      >
        {content}
      </Link>
    );
  }

  if (card.externalUrl) {
    return (
      <a
        href={card.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${card.client} - ${card.title} (Live Asset)`}
        className={containerClasses}
        style={{ backgroundColor: '#0a0a0c' }}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`${card.client} - ${card.title}`}
      className={containerClasses}
      style={{
        backgroundColor: '#0a0a0c',
      }}
    >
      {content}
    </div>
  );
}

interface SectionCreativeDriftWallProps {
  items?: CreativeCard[];
}

export function SectionCreativeDriftWall({ items }: SectionCreativeDriftWallProps) {
  const displayItems = items && items.length > 0 ? items : CREATIVE_SHOWCASE;

  // Split dynamically into 4 columns
  const rawColumns: CreativeCard[][] = [[], [], [], []];
  displayItems.forEach((card, idx) => {
    rawColumns[idx % 4].push(card);
  });

  // Ensure each column has sufficient items for continuous looping
  const columns = rawColumns.map((col) => {
    let list = [...col];
    while (list.length < 5) {
      list = [...list, ...col];
    }
    return list;
  });
  return (
    <section
      id="creatives"
      data-site-section=""
      className="py-20 md:py-28 bg-alt text-ink overflow-hidden relative border-t border-line"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <Container className="relative z-20 pointer-events-none mb-12 md:mb-16">
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

      {/* 3D Drifting Stage Viewport Wrapper (Strictly bounded with smooth top/bottom mask to prevent text overlap) */}
      <div className="relative z-10 w-full overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_16%,black_84%,transparent_100%)]">
        <div
          className="drift-stage w-full max-w-5xl mx-auto h-[460px] sm:h-[520px] md:h-[580px] relative"
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
            {columns.map((column, colIdx) => {
              const config = COLUMN_CONFIGS[colIdx % COLUMN_CONFIGS.length];
              // Double-buffered for continuous vertical looping
              const loopItems = [...column, ...column];

              return (
                <div
                  key={colIdx}
                  className={`flex-shrink-0 overflow-hidden h-[800px] flex flex-col ${
                    colIdx === 3 ? 'hidden lg:flex' : colIdx === 2 ? 'hidden sm:flex' : 'flex'
                  }`}
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
      </div>
    </section>
  );
}
