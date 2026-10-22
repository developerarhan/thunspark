'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, Sparkles, Target, TrendingUp, Activity, LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface GrowthStageData {
  step_number: number;
  name: string;
  slug: string;
  headline?: string;
  description: string;
  icon_name?: string;
}

interface InteractiveGrowthSystemProps {
  stages: GrowthStageData[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  Compass,
  Sparkles,
  Target,
  TrendingUp,
  Activity,
};

export function InteractiveGrowthSystem({ stages }: InteractiveGrowthSystemProps) {
  const [activeStep, setActiveStep] = useState<number>(1);

  const activeStage = stages.find((s) => s.step_number === activeStep) || stages[0];
  const ActiveIcon = ICON_MAP[activeStage?.icon_name || ''] || Search;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Horizontal Pipeline Steps (Desktop & Tablet) */}
      <div className="w-full max-w-5xl mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative">
          {stages.map((stage) => {
            const isSelected = stage.step_number === activeStep;
            const IconComponent = ICON_MAP[stage.icon_name || ''] || Search;

            return (
              <button
                key={stage.slug}
                onClick={() => setActiveStep(stage.step_number)}
                className={`relative group text-left p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between h-32 focus:outline-none cursor-pointer ${
                  isSelected
                    ? 'bg-surface-elevated border-accent shadow-lg shadow-accent-soft/40'
                    : 'bg-surface border-border hover:border-border-strong hover:bg-[#1a1a1a]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isSelected ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
                    }`}
                  >
                    0{stage.step_number}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isSelected ? 'bg-accent-soft text-accent' : 'text-text-muted group-hover:text-text-primary'
                    }`}
                  >
                    <IconComponent size={16} />
                  </div>
                </div>

                <div>
                  <h4
                    className={`font-display font-bold text-sm transition-colors ${
                      isSelected ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                    }`}
                  >
                    {stage.name}
                  </h4>
                  <div className="w-full h-1 mt-2 rounded-full overflow-hidden bg-border">
                    {isSelected && (
                      <motion.div
                        layoutId="growth-pipeline-indicator"
                        className="h-full bg-accent"
                        transition={{ duration: 0.25 }}
                      />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Interactive Detail Display */}
      {activeStage && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage.step_number}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-4xl"
          >
            <Card className="p-8 sm:p-12 border-accent/40 bg-[#121212] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl pointer-events-none rounded-full" />

              <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                <div className="p-4 rounded-2xl bg-accent-soft text-accent border border-accent/20 shrink-0">
                  <ActiveIcon size={32} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
                      Stage 0{activeStage.step_number} of 06
                    </span>
                    <span className="text-border">•</span>
                    <span className="text-text-muted text-xs uppercase tracking-wider font-semibold">
                      Continuous Optimization Loop
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary mb-4">
                    {activeStage.name}
                  </h3>

                  <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
                    {activeStage.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
