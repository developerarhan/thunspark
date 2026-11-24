'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container, Section } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PROBLEMS_COPY } from '@/lib/constants';
import { ArrowUpRight } from 'lucide-react';

export function Section02Problems() {
  return (
    <Section tone="base">
      <Container>
        <SectionHeading
          eyebrow={PROBLEMS_COPY.eyebrow}
          title={PROBLEMS_COPY.h2}
          copy={PROBLEMS_COPY.intro}
        />

        {/* 3x2 Grid of Problem Cards with Staggered Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROBLEMS_COPY.items.map((item, idx) => (
            <motion.div
              key={item.index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.45,
                delay: idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group p-6 sm:p-7 rounded-xl bg-card border border-line hover:border-line-strong hover:bg-elevated transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Visual Illustration */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-line/80 bg-surface group-hover:border-accent/40 transition-colors mb-6">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle bottom vignette to blend with card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                {/* Problem Title */}
                <h3 className="font-display font-bold text-xl text-ink mb-3 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>

                {/* Problem Description */}
                <p className="text-sm text-soft leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Anchor Link to Solution */}
              <div className="pt-6 mt-6 border-t border-line">
                <Link
                  href={`/services/${item.fixCategory}`}
                  data-cursor="EXPLORE"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-meta group-hover:text-accent transition-colors"
                >
                  <span>How we fix it</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
