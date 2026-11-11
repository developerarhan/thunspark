import React from 'react';

export interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline' | string;
  className?: string;
}

export function Tag({
  children,
  variant = 'default',
  className = '',
}: TagProps) {
  const variantStyles = {
    default: 'border-line bg-transparent text-meta',
    accent: 'border-accent/40 bg-accent/10 text-accent',
    outline: 'border-line text-soft',
  }[variant] || 'border-line bg-transparent text-meta';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border font-mono text-[11px] uppercase tracking-wider ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}

export function Chip({
  children,
  className = '',
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const baseClasses =
    'inline-flex items-center px-3.5 py-1.5 rounded-full font-sans text-xs transition-colors duration-200';
  const activeClasses = active
    ? 'bg-accent text-canvas font-semibold border border-accent-hi'
    : 'bg-elevated text-soft border border-line hover:border-line-strong hover:text-ink';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} ${activeClasses} cursor-pointer ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <span className={`${baseClasses} ${activeClasses} ${className}`}>
      {children}
    </span>
  );
}

// Backward compatibility export for existing components
export const Badge = Tag;
