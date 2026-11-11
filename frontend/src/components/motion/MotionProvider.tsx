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

  // Track prefers-reduced-motion changes at runtime
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => {
      const prefersReduced = mediaQuery.matches;
      setReduced(prefersReduced);
      document.documentElement.classList.toggle('rm', prefersReduced);
    };

    syncPreference();
    mediaQuery.addEventListener('change', syncPreference);
    return () => {
      mediaQuery.removeEventListener('change', syncPreference);
    };
  }, []);

  // Create or destroy Lenis cleanly when reduced-motion preference changes
  useEffect(() => {
    if (reduced) return;

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard outexpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      anchors: true,
      stopInertiaOnNavigate: true,
    });

    setLenis(lenisInstance);

    // Connect Lenis to GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenisInstance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // Refresh ScrollTrigger calculations and honor hash anchors on route change
  useEffect(() => {
    ScrollTrigger.refresh();

    if (typeof window === 'undefined' || !window.location.hash) return;

    const rawHash = window.location.hash.slice(1);
    const decodedId = decodeURIComponent(rawHash);
    const frameId = window.requestAnimationFrame(() => {
      const targetEl = document.getElementById(decodedId);
      if (!targetEl) return;

      if (lenis) {
        // Lenis automatically accounts for html scroll-padding-top (96px)
        lenis.scrollTo(targetEl);
      } else {
        targetEl.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [pathname, lenis, reduced]);

  return (
    <MotionContext.Provider value={{ reduced, lenis }}>
      <SiteLoader />
      <CustomCursor />
      <MaskWipeTransition>{children}</MaskWipeTransition>
    </MotionContext.Provider>
  );
}
