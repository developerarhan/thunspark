'use client';

import React from 'react';
import Link from 'next/link';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
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
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#FFD21F] disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-[#FFD21F] text-[#050505] font-semibold hover:bg-[#FFE75A] active:bg-[#C9A900]',
    secondary:
      'bg-[#111111] text-[#F5F5F0] border border-[#252525] hover:border-[#353535] hover:bg-[#171717]',
    ghost:
      'text-[#A6A6A0] hover:text-[#F5F5F0] hover:bg-[#171717]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs uppercase tracking-wider font-mono font-semibold',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base font-semibold',
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block"
      >
        <Link href={href} className={combinedClasses} {...(props as any)}>
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
      {...(props as HTMLMotionProps<'button'>)}
    >
      {children}
    </motion.button>
  );
}
