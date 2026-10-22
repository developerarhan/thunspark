'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pushDataLayer } from '@/lib/analytics/gtm';

export function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathname = useRef<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    if (lastPathname.current !== fullPath) {
      lastPathname.current = fullPath;
      pushDataLayer({
        event: 'virtual_page_view',
        page_location: window.location.href,
        page_path: fullPath,
        page_title: document.title,
        timestamp: new Date().toISOString(),
      });
    }
  }, [pathname, searchParams]);

  return null;
}
