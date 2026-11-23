'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Reveal } from '@/components/motion/Reveal';

export function FooterSpotlightText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowTextRef = useRef<HTMLParagraphElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const updateSpotlight = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(clientX - rect.left);
    const y = Math.round(clientY - rect.top);

    const mask = `radial-gradient(240px circle at ${x}px ${y}px, black 0%, rgba(0, 0, 0, 0.55) 42%, transparent 75%)`;
    const ambientBg = `radial-gradient(280px circle at ${x}px ${y}px, rgba(255, 210, 31, 0.08) 0%, rgba(255, 210, 31, 0.02) 50%, transparent 80%)`;

    if (glowTextRef.current) {
      glowTextRef.current.style.webkitMaskImage = mask;
      glowTextRef.current.style.maskImage = mask;
    }
    if (ambientRef.current) {
      ambientRef.current.style.background = ambientBg;
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateSpotlight(e.clientX, e.clientY);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    updateSpotlight(e.clientX, e.clientY);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
      setIsHovered(true);
    }
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
  };

  return (
    <Reveal y={40} className="container-page mt-16 mb-10 overflow-hidden">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative flex items-center justify-center select-none py-2 md:py-4 cursor-default group"
      >
        {/* Soft Ambient Spotlight Glow Behind Letters */}
        <div
          ref={ambientRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* Base Watermark Text (Subtle by default) */}
        <p
          aria-hidden="true"
          className="select-none whitespace-nowrap text-center font-display text-[clamp(4rem,15vw,16rem)] font-bold leading-none tracking-tight text-surface-hover"
        >
          ThunSpark
        </p>

        {/* Cursor-Following Spotlight Glow Text (Localized via Radial Mask) */}
        <p
          ref={glowTextRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none whitespace-nowrap text-center font-display text-[clamp(4rem,15vw,16rem)] font-bold leading-none tracking-tight text-accent transition-opacity duration-300 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            textShadow: '0 0 24px rgba(255, 210, 31, 0.45), 0 0 55px rgba(255, 210, 31, 0.2)',
          }}
        >
          ThunSpark
        </p>
      </div>
    </Reveal>
  );
}
