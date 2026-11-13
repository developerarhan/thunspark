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
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-accent text-canvas font-semibold hover:bg-accent-hi active:bg-accent-deep',
    secondary:
      'bg-card text-ink border border-line hover:border-line-strong hover:bg-elevated',
    ghost:
      'text-soft hover:text-ink hover:bg-elevated',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs uppercase tracking-wider font-mono font-semibold',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base font-semibold',
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
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
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={combinedClasses}
      onClick={handleClick}
      {...(props as HTMLMotionProps<'button'>)}
    >
      {children}
    </motion.button>
  );
}
