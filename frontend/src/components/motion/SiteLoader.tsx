'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const emptySubscribe = () => () => {};

function getClientSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      sessionStorage.getItem('thunspark_visited') === 'true' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  } catch {
    return true;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function SiteLoader() {
  const isDismissed = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const [isDone, setIsDone] = useState(false);
  const [hasExited, setHasExited] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    try {
      sessionStorage.setItem('thunspark_visited', 'true');
    } catch {}

    // Keep preloader visible under the 1.2s cap without blocking hero LCP paint
    const timer = setTimeout(() => {
      setIsDone(true);
    }, 900);

    return () => {
      clearTimeout(timer);
    };
  }, [isDismissed]);

  const handleExitComplete = () => {
    try {
      document.documentElement.classList.add('hide-site-loader');
    } catch {}
    setHasExited(true);
  };

  if (isDismissed || hasExited) return null;

  return (
    <>
      {/* Self-contained style and fallback script to ensure zero-flash initial render */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html.hide-site-loader #site-loader {
              display: none !important;
            }
          `,
        }}
      />
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #site-loader {
                display: none !important;
              }
            `,
          }}
        />
      </noscript>

      <AnimatePresence onExitComplete={handleExitComplete}>
        {!isDone && (
          <motion.div
            key="site-loader"
            id="site-loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-[9999] flex flex-col items-center pointer-events-none select-none"
          >
            {/* Expanding Accent Line 0 -> 100% in <= 850ms (non-LCP-blocking) */}
            <div className="w-full h-[2px] bg-line/60 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-accent"
              />
            </div>

            {/* Compact Top Brand Pill */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/95 border border-line text-ink"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-accent"
              >
                <motion.path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  stroke="#FFD21F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                />
              </svg>
              <span className="font-display font-extrabold text-xs tracking-tight">
                THUN<span className="text-accent">SPARK</span>
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
