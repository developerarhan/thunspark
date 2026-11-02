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
    default: 'border-[#252525] bg-transparent text-[#8A8A85]',
    accent: 'border-[#FFD21F]/40 bg-[#FFD21F]/10 text-[#FFD21F]',
    outline: 'border-[#252525] text-[#A6A6A0]',
  }[variant] || 'border-[#252525] bg-transparent text-[#8A8A85]';

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
    ? 'bg-[#FFD21F] text-[#050505] font-semibold border border-[#FFE75A]'
    : 'bg-[#171717] text-[#A6A6A0] border border-[#252525] hover:border-[#353535] hover:text-[#F5F5F0]';

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
