'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { siteConfig } from '@/site.config';
import { ArrowRight, Compass, Leaf, Layout, Activity } from 'lucide-react';

export function Section04SolutionsSelector() {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const activeGroup = siteConfig.serviceGroups[activeGroupIndex];

  const getGroupIcon = (id: string) => {
    switch (id) {
      case 'attract':
        return <Leaf size={28} className="text-[#FFD21F]" />;
      case 'engage':
        return <Compass size={28} className="text-[#FFD21F]" />;
      case 'convert':
        return <Layout size={28} className="text-[#FFD21F]" />;
      case 'optimize':
      default:
        return <Activity size={28} className="text-[#FFD21F]" />;
    }
  };

  return (
    <section id="services-selector" className="py-24 md:py-32 bg-[#050505]">
      <Container>
        <SectionHeading
          eyebrow="02 / WHAT WE DO"
          title={
            <>
              Complete growth solutions, <span className="font-italic-accent">connected.</span>
            </>
          }
          copy="Four strategic disciplines working in synergy to acquire, engage, convert, and scale your audience."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Rail: 4 Strategic Group Selector Pills (4 cols) */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
            {siteConfig.serviceGroups.map((group, idx) => {
              const isActive = idx === activeGroupIndex;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroupIndex(idx)}
                  className={`text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer shrink-0 min-w-[200px] lg:min-w-0 ${
                    isActive
                      ? 'bg-[#171717] border-[#FFD21F]'
                      : 'bg-[#111111] border-[#252525] hover:border-[#353535] hover:bg-[#141414]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#8A8A85]">
                      {group.number}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#FFD21F]" />
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#F5F5F0]">
                    {group.name}
                  </h3>
                  <p className="text-xs text-[#8A8A85] line-clamp-1 mt-1">
                    {group.role}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Detail Panel: Pinned Panel with Cross-Fade (8 cols) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeGroup.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 md:p-10 rounded-2xl bg-[#111111] border border-[#252525] space-y-8"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-xl bg-[#171717] border border-[#252525]">
                      {getGroupIcon(activeGroup.id)}
                    </div>
                    <div>
                      <div className="font-mono text-xs text-[#FFD21F] uppercase tracking-wider font-semibold">
                        {activeGroup.number} &bull; Strategic Group
                      </div>
                      <h4 className="font-display font-bold text-2xl text-[#F5F5F0]">
                        {activeGroup.name}
                      </h4>
                    </div>
                  </div>

                  <Link
                    href={`/services#${activeGroup.id}`}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#FFD21F] hover:text-[#FFE75A] transition-colors py-2"
                  >
                    <span>Explore Group</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Role Promise Statement */}
                <p className="text-base sm:text-lg text-[#A6A6A0] leading-relaxed">
                  {activeGroup.role}. We design and instrument every initiative to connect with the full acquisition funnel.
                </p>

                {/* Services Grid Inside the Active Group */}
                <div className="space-y-4 pt-4 border-t border-[#252525]">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#8A8A85] block">
                    Core Capabilities
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeGroup.services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        data-cursor="EXPLORE"
                        className="group p-4 rounded-xl bg-[#171717] border border-[#252525] hover:border-[#FFD21F]/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <h5 className="font-display font-bold text-base text-[#F5F5F0] group-hover:text-[#FFD21F] transition-colors mb-1.5">
                            {service.name}
                          </h5>
                          <p className="text-xs text-[#8A8A85] line-clamp-2 leading-relaxed">
                            {service.shortDesc}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-4">
                          {service.chips.map((chip, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#111111] text-[#A6A6A0] border border-[#252525]"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bottom Mobile Link */}
                <div className="pt-4 sm:hidden">
                  <Link
                    href={`/services#${activeGroup.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#FFD21F] hover:text-[#FFE75A]"
                  >
                    <span>Explore {activeGroup.name} Services Overview</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
