import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  className?: string;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-xl border transition-all duration-300';

  const variants = {
    default: 'bg-surface border-border text-text-primary',
    elevated: 'bg-surface-elevated border-border-strong text-text-primary shadow-xl shadow-black/40',
    glass: 'bg-[#151515]/80 backdrop-blur-md border-border/80 text-text-primary',
    interactive:
      'bg-surface border-border hover:border-border-strong hover:bg-surface-elevated hover:-translate-y-1 text-text-primary cursor-pointer',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
