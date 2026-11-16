'use client';

import React, { useRef, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { track } from '@/lib/analytics';

export interface GsapOutlineButtonProps {
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  disabled?: boolean;
  'data-analytics-cta'?: string;
  'data-analytics-location'?: string;
  'data-cal-link'?: string;
  'data-cal-config'?: string;
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: unknown;
}

const SIZE_CLASSES = {
  sm: 'px-4 py-2 text-xs uppercase tracking-wider font-mono font-semibold',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base font-semibold',
};

/**
 * GsapOutlineButton
 * -  Default: hollow accent-coloured outline pill, text in accent colour
 * -  Hover:   GSAP animates a solid accent fill that slides in from the left,
 *             text colour transitions to canvas (dark) so it stays readable
 * -  Focus:   Keyboard-accessible with visible focus ring
 */
export function GsapOutlineButton({
  href,
  target,
  rel,
  className = '',
  children,
  size = 'sm',
  onClick,
  disabled = false,
  ...props
}: GsapOutlineButtonProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;
    if (fillRef.current) {
      gsap.killTweensOf(fillRef.current);
      gsap.fromTo(
        fillRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.38, ease: 'power3.out' }
      );
    }
    if (textRef.current) {
      gsap.to(textRef.current, { color: '#0a0a0a', duration: 0.22, ease: 'power2.out' });
    }
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;
    if (fillRef.current) {
      gsap.killTweensOf(fillRef.current);
      gsap.to(fillRef.current, {
        scaleX: 0,
        transformOrigin: 'right center',
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
    if (textRef.current) {
      gsap.to(textRef.current, { color: '#FFD21F', duration: 0.22, ease: 'power2.out' });
    }
  }, [disabled]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      const ctaName = props['data-analytics-cta'];
      const location = props['data-analytics-location'] || (href ? 'button_link' : 'button');
      const label = ctaName || (e.currentTarget.textContent?.trim() || 'CTA');
      track('cta_click', { location, label });
      if (onClick) onClick(e);
    },
    [disabled, href, onClick, props]
  );

  const baseClass = [
    'relative inline-flex items-center justify-center select-none rounded-full overflow-hidden isolate [transform:translateZ(0)]',
    'border-0 shadow-[inset_0_0_0_2px_#FFD21F]',
    'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent',
    disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
    SIZE_CLASSES[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {/* Animated fill layer — starts at scaleX:0, slides in on hover, seamlessly covers edge-to-edge */}
      <span
        ref={fillRef}
        aria-hidden="true"
        style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
        className="absolute -inset-[1px] bg-accent pointer-events-none"
      />
      {/* Text — always on top of fill, colour is GSAP-animated */}
      <span
        ref={textRef}
        style={{ color: '#FFD21F' }}
        className="relative z-10 inline-flex items-center gap-2 font-semibold whitespace-nowrap"
      >
        {children}
      </span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={baseClass}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick as React.MouseEventHandler<HTMLAnchorElement>}
        aria-label={props['aria-label']}
        {...props}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      disabled={disabled}
      className={baseClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
      aria-label={props['aria-label']}
      {...props}
    >
      {inner}
    </button>
  );
}
