'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { SiteLoader } from './SiteLoader';
import { CustomCursor } from './CustomCursor';
import { MaskWipeTransition } from './MaskWipeTransition';

// Register GSAP plugins safely on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface MotionContextValue {
  reduced: boolean;
  lenis: Lenis | null;
}

const MotionContext = createContext<MotionContextValue>({
  reduced: false,
  lenis: null,
});

export function useMotion() {
  return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => {
      const prefersReduced = mediaQuery.matches;
      setReduced(prefersReduced);
      if (prefersReduced) {
        document.documentElement.classList.add('rm');
      } else {
        document.documentElement.classList.remove('rm');
      }
    };

    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);

    // Initialize Lenis only if reduced motion is disabled
    let lenisInstance: Lenis | null = null;
    if (!mediaQuery.matches) {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard outexpo
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      });

      setLenis(lenisInstance);

      // Connect Lenis to GSAP ScrollTrigger
      lenisInstance.on('scroll', ScrollTrigger.update);

      const rafCallback = (time: number) => {
        lenisInstance?.raf(time * 1000);
      };

      gsap.ticker.add(rafCallback);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(rafCallback);
        lenisInstance?.destroy();
        mediaQuery.removeEventListener('change', updateMotionPreference);
      };
    }

    return () => {
      mediaQuery.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  // Refresh ScrollTrigger calculations on route change
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <MotionContext.Provider value={{ reduced, lenis }}>
      <SiteLoader />
      <CustomCursor />
      <MaskWipeTransition>{children}</MaskWipeTransition>
    </MotionContext.Provider>
  );
}
