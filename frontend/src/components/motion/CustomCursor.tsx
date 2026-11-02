'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hoverState, setHoverState] = useState<{ isHovered: boolean; label?: string }>({
    isHovered: false,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices, not touch
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReduced) return;
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check for contextual hover targets
      const target = (e.target as HTMLElement)?.closest('[data-cursor], a, button');
      if (target) {
        const customLabel = target.getAttribute('data-cursor');
        setHoverState({
          isHovered: true,
          label: customLabel || undefined,
        });
      } else {
        setHoverState({ isHovered: false });
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <>
      {/* Precision Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FFD21F] pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: pos.x - 4,
          y: pos.y - 4,
          scale: hoverState.isHovered ? 0 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
      />

      {/* Expanding Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#FFD21F] pointer-events-none z-50 flex items-center justify-center font-mono text-[9px] font-bold tracking-widest text-[#050505] uppercase"
        animate={{
          x: pos.x - (hoverState.isHovered ? (hoverState.label ? 36 : 22) : 16),
          y: pos.y - (hoverState.isHovered ? (hoverState.label ? 36 : 22) : 16),
          width: hoverState.isHovered ? (hoverState.label ? 72 : 44) : 32,
          height: hoverState.isHovered ? (hoverState.label ? 72 : 44) : 32,
          backgroundColor: hoverState.isHovered ? '#FFD21F' : 'rgba(255, 210, 31, 0.05)',
          borderColor: hoverState.isHovered ? '#FFE75A' : '#FFD21F',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.15 }}
      >
        {hoverState.label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center font-bold px-1"
          >
            {hoverState.label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
