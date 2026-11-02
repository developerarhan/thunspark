import React from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  copy?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <div
      className={`mb-12 md:mb-16 ${
        isCenter ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'
      } ${className}`}
    >
      {/* Eyebrow with 24px yellow tick */}
      <div
        className={`inline-flex items-center gap-3 mb-4 font-mono text-xs uppercase tracking-widest text-[#8A8A85] ${
          isCenter ? 'justify-center' : 'justify-start'
        }`}
      >
        <span className="w-6 h-[2px] bg-[#FFD21F] inline-block shrink-0" />
        <span>{eyebrow}</span>
      </div>

      {/* Main Section Title */}
      <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-[1.12] tracking-[-0.02em] text-[#F5F5F0]">
        {title}
      </h2>

      {/* Optional Supporting Copy */}
      {copy && (
        <p className="mt-4 text-[#A6A6A0] text-base md:text-lg leading-relaxed">
          {copy}
        </p>
      )}
    </div>
  );
}
