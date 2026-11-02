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
    card: 'bg-[#111111]',
    elevated: 'bg-[#171717]',
    alt: 'bg-[#0A0A0A]',
  }[surface];

  const interactiveStyles = interactive
    ? 'hover:border-[#353535] hover:bg-[#171717] transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      className={`rounded-xl border border-[#252525] ${surfaceBg} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
