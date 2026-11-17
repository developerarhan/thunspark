'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ShieldCheck, Star, Quote } from 'lucide-react';
import type { TestimonialItem } from '@/lib/content/testimonials';

export type { TestimonialItem };

interface Section08ClientLoveProps {
  testimonials?: readonly TestimonialItem[];
}

export function Section08ClientLove({ testimonials = [] }: Section08ClientLoveProps) {
  const verifiedTestimonials = testimonials.filter(
    (t) => t.isVerified && t.quote.trim().length > 0
  );

  // Render nothing if 0 verified records
  if (verifiedTestimonials.length === 0) {
    return null;
  }

  const isSingle = verifiedTestimonials.length === 1;
  const isTwo = verifiedTestimonials.length === 2;

  return (
    <Section id="testimonials" tone="alt">
      <Container>
        <SectionHeading
          eyebrow="CLIENT REVIEWS"
          title={
            <>
              Direct words from <span className="font-italic-accent">real</span> partners.
            </>
          }
          copy="Measurable impact and honest partnership feedback across e-commerce, B2B SaaS, and consumer brands."
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
                className="p-8 sm:p-12 rounded-2xl bg-card border border-line text-center flex flex-col items-center gap-6 shadow-sm"
              >
                <div className="flex items-center gap-1">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-amber-400 text-amber-400 shrink-0"
                    />
                  ))}
                  <div className="ml-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <ShieldCheck size={14} className="shrink-0" />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                      Verified Client
                    </span>
                  </div>
                </div>

                <p className="text-xl sm:text-2xl md:text-3xl text-ink leading-relaxed font-display font-medium text-balance">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="pt-6 border-t border-line w-full max-w-sm flex items-center justify-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-elevated border border-line text-accent font-mono font-bold text-sm flex items-center justify-center shrink-0">
                    {item.author
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div className="text-left">
                    <div className="font-display font-bold text-base text-ink">
                      {item.author}
                    </div>
                    <div className="text-xs text-soft">
                      {item.role}
                    </div>
                    <div className="text-[11px] font-mono text-meta">
                      {item.company}
                    </div>
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
                className="p-6 sm:p-8 rounded-2xl bg-card border border-line hover:border-line-strong hover:bg-elevated/70 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
              >
                <div className="space-y-4">
                  {/* Top Bar: Stars + Verified Badge */}
                  <div className="flex items-center justify-between gap-3 pb-4 border-b border-line/60">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="fill-amber-400 text-amber-400 shrink-0"
                        />
                      ))}
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <ShieldCheck size={13} className="shrink-0" />
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
                        Verified Partner
                      </span>
                    </div>
                  </div>

                  {/* Quote Body */}
                  <div className="relative pt-1">
                    <Quote
                      size={22}
                      className="text-accent/25 mb-2 rotate-180 shrink-0"
                    />
                    <p className="text-sm sm:text-base text-ink/90 leading-relaxed font-sans">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="pt-5 border-t border-line/60 flex items-center gap-3.5 mt-6">
                  {/* Monogram Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-elevated border border-line text-accent font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-inner group-hover:border-accent/40 transition-colors">
                    {item.author
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-display font-bold text-sm text-ink truncate group-hover:text-accent transition-colors">
                      {item.author}
                    </div>
                    <div className="text-xs text-soft truncate">
                      {item.role}
                    </div>
                    <div className="text-[11px] font-mono text-meta truncate mt-0.5">
                      {item.company}
                    </div>
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
