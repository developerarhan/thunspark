'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SiteLoader() {
  const [shouldShow, setShouldShow] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user visited in this session
    const hasVisited = sessionStorage.getItem('thunspark_visited');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasVisited && !prefersReducedMotion) {
      setShouldShow(true);
      sessionStorage.setItem('thunspark_visited', 'true');

      // Finish loading animation after 1.2s total
      const timer = setTimeout(() => {
        setIsDone(true);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldShow || isDone) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-[#F5F5F0] pointer-events-none select-none"
        >
          {/* Logo Mark + Bolt Trace */}
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              {/* Lightning Bolt SVG Motif */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#FFD21F]"
              >
                <motion.path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  stroke="#FFD21F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
              </svg>
              <span className="font-display font-extrabold text-2xl tracking-tight">
                THUN<span className="text-[#FFD21F]">SPARK</span>
              </span>
            </motion.div>

            {/* Expanding Accent Line 0 -> 100% in <= 900ms */}
            <div className="w-48 h-[2px] bg-[#252525] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-[#FFD21F]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
