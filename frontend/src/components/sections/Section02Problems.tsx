'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PROBLEMS_COPY } from '@/lib/constants';
import { ArrowUpRight } from 'lucide-react';

export function Section02Problems() {
  return (
    <section className="py-24 md:py-32 bg-[#050505]">
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
              className="group p-8 rounded-xl bg-[#111111] border border-[#252525] hover:border-[#353535] hover:bg-[#171717] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Yellow Index Chip */}
                <div className="w-9 h-9 rounded-full border border-[#252525] group-hover:border-[#FFD21F] group-hover:bg-[#FFD21F] flex items-center justify-center font-mono text-xs font-bold text-[#8A8A85] group-hover:text-[#050505] transition-colors mb-6">
                  {item.index}
                </div>

                {/* Problem Title */}
                <h3 className="font-display font-bold text-xl text-[#F5F5F0] mb-3 group-hover:text-[#FFD21F] transition-colors">
                  {item.title}
                </h3>

                {/* Problem Description */}
                <p className="text-sm text-[#A6A6A0] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Anchor Link to Solution */}
              <div className="pt-6 mt-6 border-t border-[#252525]">
                <Link
                  href={`/services/${item.fixCategory}`}
                  data-cursor="EXPLORE"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#8A8A85] group-hover:text-[#FFD21F] transition-colors"
                >
                  <span>How we fix it</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
