'use client';

import React from 'react';
import Link from 'next/link';
import { motion, HTMLMotionProps } from 'framer-motion';
import { track } from '@/lib/analytics';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  children: React.ReactNode;
  'data-analytics-cta'?: string;
  'data-analytics-location'?: string;
  'data-cursor'?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  target,
  rel,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(props.disabled);

  const baseStyles =
    'inline-flex items-center justify-center font-medium select-none rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 ease-out';

  const variants = {
    // Solid accent yellow by default with dark canvas text; smooth micro-lift, brightness shift & accent glow on hover
    primary:
      'bg-accent text-canvas font-semibold shadow-xs hover:enabled:bg-accent-hi hover:enabled:shadow-[0_0_24px_rgba(255,210,31,0.28)] hover:enabled:-translate-y-0.5 active:enabled:translate-y-0 active:enabled:bg-accent-deep active:enabled:shadow-xs disabled:hover:translate-y-0 disabled:hover:bg-accent disabled:hover:shadow-none',
    secondary:
      'bg-card text-ink border border-line hover:enabled:border-line-strong hover:enabled:bg-elevated hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_4px_16px_rgba(0,0,0,0.4)] active:enabled:translate-y-0 disabled:hover:translate-y-0 disabled:hover:shadow-none',
    ghost:
      'text-soft hover:enabled:text-ink hover:enabled:bg-elevated hover:enabled:-translate-y-0.5 active:enabled:translate-y-0 disabled:hover:translate-y-0',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs uppercase tracking-wider font-mono font-semibold',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base font-semibold',
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }

    const ctaName = props['data-analytics-cta'];
    const location = props['data-analytics-location'] || (href ? 'button_link' : 'button');
    const label =
      ctaName ||
      (typeof children === 'string'
        ? children
        : (e.currentTarget.textContent?.trim() || 'CTA'));

    track('cta_click', {
      location,
      label,
    });

    if (props.onClick) {
      props.onClick(e as any);
    }
  };

  if (href) {
    return (
      <motion.div
        whileHover={isDisabled ? undefined : { scale: 1.01 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        className="inline-block"
      >
        <Link
          href={href}
          target={target}
          rel={rel}
          className={combinedClasses}
          onClick={handleClick}
          {...(props as any)}
        >
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={isDisabled ? undefined : { scale: 1.01 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      className={combinedClasses}
      onClick={handleClick}
      {...(props as HTMLMotionProps<'button'>)}
    >
      {children}
    </motion.button>
  );
}
