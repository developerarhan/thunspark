import React from 'react';

export function Container({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

type SectionTone = 'base' | 'alt';
type SectionSpacing = 'default' | 'compact' | 'hero' | 'none';

const TONE_CLASSES: Record<SectionTone, string> = {
  base: 'bg-base',
  alt: 'bg-alt',
};

const SPACING_CLASSES: Record<SectionSpacing, string> = {
  default: 'py-14 md:py-20 lg:py-24',
  compact: 'py-6 md:py-8',
  hero: 'pt-36 md:pt-44 pb-20 md:pb-28',
  none: '',
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  spacing?: SectionSpacing;
  ref?: React.Ref<HTMLElement>;
}

export function Section({
  tone = 'base',
  spacing = 'default',
  className = '',
  children,
  ref,
  ...props
}: SectionProps) {
  return (
    <section
      ref={ref}
      data-site-section=""
      className={`relative ${TONE_CLASSES[tone]} ${SPACING_CLASSES[spacing]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
