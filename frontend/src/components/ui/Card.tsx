import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  surface?: 'card' | 'elevated' | 'alt';
}

export function Card({
  children,
  className = '',
  interactive = false,
  surface = 'card',
  ...props
}: CardProps) {
  const surfaceBg = {
    card: 'bg-card',
    elevated: 'bg-elevated',
    alt: 'bg-alt',
  }[surface];

  const interactiveStyles = interactive
    ? 'hover:border-line-strong hover:bg-elevated transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      className={`rounded-xl border border-line ${surfaceBg} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
