'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, TrendingUp, Sparkles, Layout, Target, ChevronDown, LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ServiceItem {
  id: number;
  name: string;
  slug: string;
  tagline?: string;
  problem: string;
  approach: string;
  business_objective: string;
}

interface ServiceGroupData {
  id: number;
  name: string;
  slug: string;
  icon_name?: string;
  summary?: string;
  services: ServiceItem[];
}

interface InteractiveServiceShowcaseProps {
  groups: ServiceGroupData[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  Compass,
  TrendingUp,
  Sparkles,
  Layout,
  Target,
};

export function InteractiveServiceShowcase({ groups }: InteractiveServiceShowcaseProps) {
  const [activeGroupId, setActiveGroupId] = useState<number>(groups[0]?.id || 1);
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(null);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
  const GroupIcon = ICON_MAP[activeGroup?.icon_name || ''] || Compass;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Category Selection Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {groups.map((group) => {
          const isSelected = group.id === activeGroupId;
          const Icon = ICON_MAP[group.icon_name || ''] || Compass;

          return (
            <button
              key={group.slug}
              onClick={() => {
                setActiveGroupId(group.id);
                setExpandedServiceId(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-accent text-white shadow-md shadow-accent-soft'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-strong'
              }`}
            >
              <Icon size={16} />
              <span>{group.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Group Header */}
      {activeGroup && (
        <div className="w-full max-w-4xl text-center mb-10">
          <p className="text-text-secondary text-base leading-relaxed">
            {activeGroup.summary}
          </p>
        </div>
      )}

      {/* Interactive Expand-in-Place Services Grid */}
      {activeGroup && (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeGroup.services.map((service) => {
            const isExpanded = expandedServiceId === service.id;

            return (
              <Card
                key={service.slug}
                className={`p-6 border transition-all duration-300 flex flex-col justify-between ${
                  isExpanded
                    ? 'border-accent bg-surface-elevated'
                    : 'border-border bg-surface hover:border-border-strong'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h4 className="font-display font-bold text-lg text-text-primary">
                      {service.name}
                    </h4>
                    <button
                      onClick={() =>
                        setExpandedServiceId(isExpanded ? null : service.id)
                      }
                      className="p-1 text-text-muted hover:text-accent transition-colors"
                      aria-label="Expand service details"
                    >
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-accent' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-text-secondary text-xs leading-relaxed mb-4">
                    {service.tagline}
                  </p>

                  {/* Expandable Problem -> Approach -> Objective */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4 pt-4 border-t border-border/80 overflow-hidden"
                      >
                        <div>
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent block mb-1">
                            The Business Problem
                          </span>
                          <p className="text-text-secondary text-xs leading-relaxed">
                            {service.problem}
                          </p>
                        </div>

                        <div>
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-primary block mb-1">
                            Strategic Approach
                          </span>
                          <p className="text-text-secondary text-xs leading-relaxed">
                            {service.approach}
                          </p>
                        </div>

                        <div>
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted block mb-1">
                            Commercial Objective
                          </span>
                          <p className="text-text-secondary text-xs leading-relaxed">
                            {service.business_objective}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-4 mt-2 flex items-center justify-between border-t border-border/40">
                  <button
                    onClick={() =>
                      setExpandedServiceId(isExpanded ? null : service.id)
                    }
                    className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Collapse Details' : 'View Problem & Approach'}</span>
                  </button>

                  <Button
                    href="/contact"
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                  >
                    Inquire
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
