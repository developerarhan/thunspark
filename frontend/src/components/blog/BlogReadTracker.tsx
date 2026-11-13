'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';

interface BlogReadTrackerProps {
  slug: string;
}

/**
 * Fires blog_read event once per page when the reader reaches 75% scroll depth.
 */
export function BlogReadTracker({ slug }: BlogReadTrackerProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    firedRef.current = false;
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (firedRef.current) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const currentScrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      if (currentScrollPercent >= 75) {
        firedRef.current = true;
        track('blog_read', {
          slug,
          scroll_depth: 75,
        });
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also perform initial check in case page is short or pre-scrolled
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [slug]);

  return null;
}
