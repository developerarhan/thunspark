'use client';

import React from 'react';
import { ServicesShowcase } from '@/components/services/ServicesShowcase';

export function Section04SolutionsSelector() {
  return (
    <ServicesShowcase
      pinned
      eyebrow="WHAT WE DO"
      title={
        <>
          Complete growth solutions, <span className="font-italic-accent">connected.</span>
        </>
      }
      copy="Four strategic disciplines working in synergy to acquire, engage, convert, and scale your audience."
    />
  );
}
