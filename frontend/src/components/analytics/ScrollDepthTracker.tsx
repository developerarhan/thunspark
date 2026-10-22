'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { pushDataLayer } from '@/lib/analytics/gtm';

const MILESTONES = [25, 50, 75, 90, 100];

export function ScrollDepthTracker() {
  const pathname = usePathname();
  const reachedMilestones = useRef<Set<number>>(new Set());

  // Reset milestones whenever user navigates between pages
  useEffect(() => {
    reachedMilestones.current.clear();
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const currentScrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      MILESTONES.forEach((milestone) => {
        if (currentScrollPercent >= milestone && !reachedMilestones.current.has(milestone)) {
          reachedMilestones.current.add(milestone);
          pushDataLayer({
            event: 'scroll_depth',
            scroll_percentage: milestone,
            page_path: window.location.pathname,
            timestamp: new Date().toISOString(),
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return null;
}
