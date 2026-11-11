import React from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  copy?: string;
  align?: 'left' | 'center';
  size?: 'default' | 'compact';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = 'center',
  size = 'default',
  className = '',
}: SectionHeadingProps) {
  const isCentered = align === 'center';
  const isCompact = size === 'compact';

  return (
    <div
      className={`${
        isCentered ? 'text-center mx-auto max-w-4xl' : 'text-left max-w-3xl'
      } ${isCompact ? 'mb-0' : 'mb-12 md:mb-16'} ${className}`}
    >
      {/* Eyebrow with 24px yellow tick */}
      <div
        className={`inline-flex items-center gap-3 font-mono text-[13px] md:text-sm font-semibold uppercase tracking-widest text-soft ${
          isCentered ? 'justify-center' : ''
        } ${isCompact ? 'mb-2' : 'mb-4'}`}
      >
        <span className="w-6 h-[2px] bg-accent inline-block shrink-0" />
        <span>{eyebrow}</span>
      </div>

      {/* Display H2 */}
      <h2
        className={`font-display font-bold text-ink text-balance ${
          isCompact
            ? 'text-[clamp(1.625rem,2.7vw,2.5rem)] leading-[1.08] tracking-[-0.02em]'
            : 'text-[clamp(2.25rem,4vw,4rem)] leading-[1.06] tracking-[-0.03em]'
        }`}
      >
        {title}
      </h2>

      {/* Optional Supporting Copy */}
      {copy && (
        <p
          className={`text-soft leading-relaxed font-sans ${
            isCompact
              ? 'mt-1.5 text-[clamp(0.875rem,1.15vw,1rem)] lg:line-clamp-1 max-w-2xl'
              : 'mt-4 text-base sm:text-lg max-w-2xl'
          } ${isCentered ? 'mx-auto' : ''}`}
        >
          {copy}
        </p>
      )}
    </div>
  );
}
