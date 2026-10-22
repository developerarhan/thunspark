'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Compass, TrendingUp, Sparkles, Layout, Target, LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ServiceItem {
  id: number;
  name: string;
  slug: string;
  tagline?: string;
  problem: string;
  approach: string;
  business_objective: string;
  process?: string;
  deliverables?: string;
}

interface ServiceGroupData {
  id: number;
  name: string;
  slug: string;
  icon_name?: string;
  summary?: string;
  services: ServiceItem[];
}

interface ServicesAccordionProps {
  groups: ServiceGroupData[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  Compass,
  TrendingUp,
  Sparkles,
  Layout,
  Target,
};

export function ServicesAccordion({ groups }: ServicesAccordionProps) {
  const [openGroupSlug, setOpenGroupSlug] = useState<string>(groups[0]?.slug || '');
  const [openServiceSlug, setOpenServiceSlug] = useState<string | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {groups.map((group) => {
        const isGroupOpen = openGroupSlug === group.slug;
        const IconComponent = ICON_MAP[group.icon_name || ''] || Compass;

        return (
          <Card
            key={group.slug}
            className={`overflow-hidden border transition-all duration-300 ${
              isGroupOpen ? 'border-accent/40 bg-surface' : 'border-border bg-surface/60'
            }`}
          >
            {/* Service Group Accordion Header */}
            <button
              onClick={() => {
                setOpenGroupSlug(isGroupOpen ? '' : group.slug);
                setOpenServiceSlug(null);
              }}
              className="w-full p-6 sm:p-8 flex items-center justify-between gap-6 text-left cursor-pointer hover:bg-surface-elevated transition-colors"
            >
              <div className="flex items-center gap-5">
                <div className="p-3.5 rounded-xl bg-accent-soft text-accent border border-accent/20">
                  <IconComponent size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-text-primary mb-1">
                    {group.name}
                  </h3>
                  <p className="text-text-secondary text-xs sm:text-sm line-clamp-1 max-w-2xl">
                    {group.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono font-semibold text-text-muted hidden sm:inline">
                  {group.services?.length || 0} Specializations
                </span>
                <ChevronDown
                  size={20}
                  className={`text-accent transition-transform duration-300 ${
                    isGroupOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Service Group Accordion Body */}
            <AnimatePresence>
              {isGroupOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-6 pb-8 sm:px-8 space-y-4 border-t border-border/80"
                >
                  <p className="text-text-secondary text-sm pt-6 pb-2 leading-relaxed max-w-3xl">
                    {group.summary}
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    {group.services.map((service) => {
                      const isServiceExpanded = openServiceSlug === service.slug;

                      return (
                        <div
                          key={service.slug}
                          className={`rounded-xl border transition-all ${
                            isServiceExpanded
                              ? 'border-accent bg-surface-elevated p-6'
                              : 'border-border/60 bg-surface/40 p-5 hover:border-border-strong'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-display font-bold text-base sm:text-lg text-text-primary mb-1">
                                {service.name}
                              </h4>
                              <p className="text-text-secondary text-xs leading-relaxed max-w-2xl">
                                {service.tagline}
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                setOpenServiceSlug(
                                  isServiceExpanded ? null : service.slug
                                )
                              }
                              className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors shrink-0 flex items-center gap-1 cursor-pointer pt-1"
                            >
                              <span>{isServiceExpanded ? 'Close' : 'Details'}</span>
                              <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${
                                  isServiceExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                          </div>

                          <AnimatePresence>
                            {isServiceExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-6 pt-6 border-t border-border/60 grid grid-cols-1 md:grid-cols-3 gap-6"
                              >
                                <div>
                                  <span className="font-mono text-[11px] font-bold text-accent uppercase tracking-wider block mb-2">
                                    Problem It Solves
                                  </span>
                                  <p className="text-text-secondary text-xs leading-relaxed">
                                    {service.problem}
                                  </p>
                                </div>

                                <div>
                                  <span className="font-mono text-[11px] font-bold text-text-primary uppercase tracking-wider block mb-2">
                                    Our Methodology
                                  </span>
                                  <p className="text-text-secondary text-xs leading-relaxed">
                                    {service.approach}
                                  </p>
                                </div>

                                <div>
                                  <span className="font-mono text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-2">
                                    Commercial Impact
                                  </span>
                                  <p className="text-text-secondary text-xs leading-relaxed mb-4">
                                    {service.business_objective}
                                  </p>
                                  <Button href="/contact" size="sm" variant="primary">
                                    <span>Inquire Offering</span>
                                    <ArrowRight size={14} className="ml-1" />
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}
