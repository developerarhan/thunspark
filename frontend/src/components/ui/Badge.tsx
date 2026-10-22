import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'accent' | 'neutral' | 'outline';
  className?: string;
  children: React.ReactNode;
}

export function Badge({
  variant = 'accent',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider select-none';

  const variants = {
    accent: 'bg-accent-soft text-accent border border-accent/20',
    neutral: 'bg-surface-elevated text-text-secondary border border-border',
    outline: 'border border-border text-text-muted bg-transparent',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
