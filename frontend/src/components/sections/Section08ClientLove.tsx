'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowRight, ShieldCheck, PhoneCall, CheckCircle2 } from 'lucide-react';

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
  const verifiedTestimonials = testimonials.filter((t) => t.isVerified && t.quote.trim().length > 0);

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-base border-b border-line">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeading
            eyebrow="06 / CLIENT VOICES"
            title={
              <>
                Direct words from <span className="font-italic-accent">real</span> partners.
              </>
            }
            copy="We don't manufacture praise or publish anonymous claims. Every partnership is grounded in documented scope and provable deliverables."
            className="mb-0"
          />

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-mono text-xs text-accent hover:text-accent-hi font-semibold transition-colors shrink-0 group py-2"
          >
            <span>Request client references</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* If verified client testimonials exist, render them */}
        {verifiedTestimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <ShieldCheck size={16} className="text-[#47C78A]" />
                    <span className="font-mono text-[11px] text-[#47C78A] font-semibold uppercase tracking-wider">
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
        ) : (
          /* Anti-Fabrication Transparency Grid (Build Guide §R6 / §D1 §7) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Direct Founder Introductions */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 rounded-xl bg-card border border-line hover:border-line-strong hover:bg-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-elevated border border-line flex items-center justify-center text-accent mb-6">
                  <PhoneCall size={20} />
                </div>
                <span className="font-mono text-xs text-accent uppercase tracking-wider font-semibold block mb-2">
                  Direct Introductions
                </span>
                <h3 className="font-display font-bold text-xl text-ink mb-3">
                  Speak directly with founders we work with.
                </h3>
                <p className="text-sm text-soft leading-relaxed mb-6">
                  Rather than reading curated pull quotes, we connect qualified prospective partners directly with founders we have delivered for. Ask for an intro during your discovery call.
                </p>
              </div>

              <div className="pt-6 border-t border-line">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-accent hover:text-accent-hi transition-colors"
                >
                  <span>Request a founder reference</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* Card 2: Anti-Fabrication Guarantee */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 rounded-xl bg-card border border-line hover:border-line-strong hover:bg-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-elevated border border-line flex items-center justify-center text-[#47C78A] mb-6">
                  <ShieldCheck size={20} />
                </div>
                <span className="font-mono text-xs text-[#47C78A] uppercase tracking-wider font-semibold block mb-2">
                  Anti-Fabrication Standard
                </span>
                <h3 className="font-display font-bold text-xl text-ink mb-3">
                  Documented scope over vanity claims.
                </h3>
                <p className="text-sm text-soft leading-relaxed mb-6">
                  Every case study outlines verified scope delivered. Specific revenue and commercial returns are published strictly when client NDAs and formal audit permissions permit.
                </p>
              </div>

              <div className="pt-6 border-t border-line">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-meta">
                  <CheckCircle2 size={14} className="text-[#47C78A]" />
                  <span>100% Scope-verified showcases</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Active Client Ecosystem */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 rounded-xl bg-card border border-line hover:border-line-strong hover:bg-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-elevated border border-line flex items-center justify-center text-accent mb-6">
                  <span className="font-mono text-base font-bold">04</span>
                </div>
                <span className="font-mono text-xs text-accent uppercase tracking-wider font-semibold block mb-2">
                  Live Client Engagements
                </span>
                <h3 className="font-display font-bold text-xl text-ink mb-3">
                  Multi-disciplinary systems across 4 sectors.
                </h3>
                <p className="text-sm text-soft leading-relaxed mb-6">
                  Active partnerships spanning D2C baby care, consumer wellness, industrial B2B fire-safety, and international trade exhibitions.
                </p>
              </div>

              <div className="pt-6 border-t border-line">
                <div className="flex flex-wrap gap-1.5">
                  {['E-Commerce', 'B2B Industrial', 'Consumer Care', 'Exhibitions'].map((sector) => (
                    <span
                      key={sector}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-elevated text-soft border border-line"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </Container>
    </section>
  );
}
