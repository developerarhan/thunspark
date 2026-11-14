'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { Container, Section } from '@/components/ui/Container';

interface MetricItem {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  color: string;
}

const STATS: MetricItem[] = [
  {
    value: 10,
    prefix: '',
    suffix: '+',
    decimals: 0,
    label: 'Brands Grown',
    color: 'text-[#2563EB] dark:text-[#3B82F6]', // Electric Blue matching reference
  },
  {
    value: 2,
    prefix: '',
    suffix: 'M+',
    decimals: 0,
    label: 'Reach Generated',
    color: 'text-[#EA580C] dark:text-[#FF6B00]', // Flame Orange matching reference
  },
  {
    value: 1,
    prefix: '$',
    suffix: 'M+',
    decimals: 0,
    label: 'Revenue Driven',
    color: 'text-[#059669] dark:text-[#10B981]', // Growth Green
  },
  {
    value: 4.2,
    prefix: '',
    suffix: 'x',
    decimals: 1,
    label: 'Average ROAS',
    color: 'text-[#D97706] dark:text-[#F59E0B]', // Warm Amber Gold
  },
];

function AnimatedStatCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.6,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const frameId = requestAnimationFrame(() => setDisplayValue(value));
      return () => cancelAnimationFrame(frameId);
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Smooth ease-out exponential curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = easeOut * value;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.floor(displayValue).toString();

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function Section03PositioningStrip() {
  return (
    <Section tone="alt" spacing="none" className="border-y border-line/60 bg-card/30 backdrop-blur-sm relative">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 py-3 sm:py-4">
          {STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`px-4 sm:px-6 md:px-8 py-5 sm:py-6 flex flex-col items-center justify-center text-center transition-colors duration-300 ${
                idx !== 0 ? 'lg:border-l border-line/60' : ''
              } ${idx % 2 === 1 ? 'border-l border-line/60 lg:border-l' : ''} ${
                idx >= 2 ? 'border-t border-line/60 lg:border-t-0' : ''
              }`}
            >
              <div
                className={`font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight ${stat.color}`}
              >
                <AnimatedStatCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <div className="font-sans text-xs sm:text-sm font-medium text-soft tracking-wide mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
