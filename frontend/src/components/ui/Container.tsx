import React from 'react';

export function Container({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Section({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={`py-16 md:py-24 relative ${className}`} {...props}>
      {children}
    </section>
  );
}
