'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  isVerified: boolean;
}

interface Section08ClientLoveProps {
  testimonials?: TestimonialItem[];
}

export function Section08ClientLove({ testimonials = [] }: Section08ClientLoveProps) {
  const verifiedTestimonials = testimonials.filter(
    (t) => t.isVerified && t.quote.trim().length > 0
  );

  // Render nothing (no wrapper, gap, or border) when there are 0 verified records
  if (verifiedTestimonials.length === 0) {
    return null;
  }

  const isSingle = verifiedTestimonials.length === 1;
  const isTwo = verifiedTestimonials.length === 2;

  return (
    <Section id="testimonials" tone="alt">
      <Container>
        <SectionHeading
          eyebrow="CLIENT VOICES"
          title={
            <>
              Direct words from <span className="font-italic-accent">real</span> partners.
            </>
          }
          copy="Feedback from founders and marketing teams we have partnered with."
        />

        {isSingle ? (
          <div className="max-w-3xl mx-auto">
            {verifiedTestimonials.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 sm:p-12 rounded-xl bg-card border border-line text-center flex flex-col items-center gap-6"
              >
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck size={16} className="text-success" />
                  <span className="font-mono text-[11px] text-success font-semibold uppercase tracking-wider">
                    Verified Client
                  </span>
                </div>

                <p className="text-xl sm:text-2xl md:text-3xl text-ink leading-relaxed font-display font-medium text-balance">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="pt-6 border-t border-line w-full max-w-xs">
                  <div className="font-display font-bold text-base text-ink">
                    {item.author}
                  </div>
                  <div className="text-xs text-meta mt-0.5">
                    {item.role}, {item.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-6 ${
              isTwo
                ? 'md:grid-cols-2 max-w-5xl mx-auto'
                : 'md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {verifiedTestimonials.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="p-8 rounded-xl bg-card border border-line hover:border-line-strong hover:bg-elevated transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <ShieldCheck size={16} className="text-success" />
                    <span className="font-mono text-[11px] text-success font-semibold uppercase tracking-wider">
                      Verified Client
                    </span>
                  </div>
                  <p className="text-base text-ink leading-relaxed mb-6 font-display">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-6 border-t border-line">
                  <div className="font-display font-bold text-sm text-ink">
                    {item.author}
                  </div>
                  <div className="text-xs text-meta">
                    {item.role}, {item.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Button href="/contact" variant="secondary" size="md">
            <span>Request client references</span>
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
