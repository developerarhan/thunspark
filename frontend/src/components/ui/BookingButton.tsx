'use client';

import React from 'react';
import { Button, ButtonProps } from '@/components/ui/Button';
import { getBookingHref, isExternalBooking } from '@/lib/booking';
import { trackBookCallClick } from '@/lib/analytics/gtm';

export interface BookingButtonProps extends Omit<ButtonProps, 'href' | 'target' | 'rel'> {
  location?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export function BookingButton({
  location = 'unknown',
  href,
  target,
  rel,
  onClick,
  children,
  ...props
}: BookingButtonProps) {
  const resolvedHref = href || getBookingHref();
  const isExternal = isExternalBooking(resolvedHref);
  const finalTarget = target !== undefined ? target : (isExternal ? '_blank' : undefined);
  const finalRel = rel !== undefined ? rel : (isExternal ? 'noopener noreferrer' : undefined);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trackBookCallClick(location);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      href={resolvedHref}
      target={finalTarget}
      rel={finalRel}
      onClick={handleClick}
      data-analytics-location={location}
      {...props}
    >
      {children}
    </Button>
  );
}

export { BookingButton as BookingCTA, BookingButton as BookingLink };
