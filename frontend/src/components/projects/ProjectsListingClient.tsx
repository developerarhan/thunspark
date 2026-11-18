'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Badge';
import { Reveal } from '@/components/motion/Reveal';
import { ArrowRight, Layers, Sparkles, ExternalLink } from 'lucide-react';
import { track } from '@/lib/analytics';
import type { ProjectDetail } from '@/lib/content/types';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Work' },
  { id: 'branding_print', label: 'Branding & Print' },
  { id: 'web_development', label: 'Web Development' },
  { id: 'full_service', label: 'Full-Service Growth' },
  { id: 'growth_marketing', label: 'Growth & Marketing' },
] as const;

interface ProjectsListingClientProps {
  initialStudies: readonly ProjectDetail[];
}

export function ProjectsListingClient({ initialStudies }: ProjectsListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredStudies = initialStudies.filter((study) => {
    if (selectedCategory === 'all') return true;
    const cats = study.categories || ['full_service'];
    return cats.includes(selectedCategory);
  });

  return (
    <div>
      {/* ── CATEGORY FILTER TABS ── */}
      <div className="flex flex-wrap items-center gap-2 mb-12">
        <span className="font-mono text-xs uppercase tracking-wider text-meta mr-2 hidden sm:inline">
          Filter by:
        </span>
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab.id;
          const count =
            tab.id === 'all'
              ? initialStudies.length
              : initialStudies.filter((s) => (s.categories || ['full_service']).includes(tab.id)).length;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-accent text-canvas font-bold shadow-md shadow-accent/20'
                  : 'bg-card text-meta border border-line hover:border-line-strong hover:text-ink hover:bg-elevated'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-canvas/20 text-canvas' : 'bg-elevated text-meta border border-line/60'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── GRID OF PROJECT CARDS ── */}
      {filteredStudies.length === 0 ? (
        <Card className="p-12 text-center bg-card border-line max-w-lg mx-auto">
          <p className="text-soft text-sm mb-4">
            No case studies found matching this discipline filter.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-mono text-accent hover:underline cursor-pointer"
          >
            Clear filter &amp; view all work
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredStudies.map((study, idx) => {
            const scopePills = study.scopeTags && study.scopeTags.length > 0
              ? study.scopeTags
              : study.deliverables && study.deliverables.length > 0
              ? study.deliverables.slice(0, 4)
              : study.services.slice(0, 4);

            const transformation =
              study.transformationSummary ||
              study.summary ||
              study.headline ||
              study.overview;

            return (
              <Reveal key={study.slug} delay={idx * 0.08}>
                <Link
                  href={`/projects/${study.slug}`}
                  onClick={() => track('project_open', { slug: study.slug })}
                  className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
                >
                  <Card className="p-0 h-full flex flex-col justify-between bg-card border-line group-hover:border-accent/60 group-hover:bg-[#0c0e14] transition-all duration-300 overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:shadow-accent/5">
                    
                    {/* Hero Visual Mockup Container */}
                    <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-[#121622] via-[#0b0e14] to-[#050608] border-b border-line overflow-hidden flex items-center justify-center p-6 sm:p-8">
                      {study.cover ? (
                        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/5 group-hover:scale-[1.03] transition-transform duration-500 ease-out">
                          <Image
                            src={study.cover}
                            alt={`${study.client} Hero Visual Mockup`}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 p-6 flex flex-col justify-between group-hover:border-accent/40 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-bold px-2.5 py-1 rounded-md bg-accent/10 border border-accent/20">
                              {study.industry}
                            </span>
                            <span className="font-mono text-xs text-meta">{study.year}</span>
                          </div>

                          <div className="my-auto text-center py-4">
                            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                              <Sparkles size={24} />
                            </div>
                            <h4 className="font-display font-bold text-2xl text-ink tracking-tight group-hover:text-accent transition-colors">
                              {study.client}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono text-meta pt-2 border-t border-white/5">
                            <span>{study.engagementRole || 'Full-Service Growth'}</span>
                            <span className="text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              <span>Case Study</span>
                              <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Floating Badge */}
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                        <Tag variant="accent" className="backdrop-blur-md bg-black/60 shadow-lg">
                          {study.industry}
                        </Tag>
                        {study.engagementRole && (
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-meta border border-white/10 backdrop-blur-md">
                            {study.engagementRole}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-baseline justify-between mb-2">
                          <h3 className="font-display font-bold text-2xl text-ink group-hover:text-accent transition-colors">
                            {study.client}
                          </h3>
                          <span className="font-mono text-xs text-meta shrink-0 ml-2">
                            {study.year}
                          </span>
                        </div>

                        {/* 1-Line Transformation Summary */}
                        <p className="text-sm font-medium text-ink leading-relaxed mb-4 line-clamp-2">
                          {transformation}
                        </p>

                        {/* Overview Context */}
                        <p className="text-xs text-soft leading-relaxed line-clamp-2 mb-6">
                          {study.overview}
                        </p>
                      </div>

                      <div>
                        {/* Scope Delivered Tags */}
                        <div className="pt-4 border-t border-line/70 mb-4">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-meta block mb-2 font-semibold">
                            Scope Delivered:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {scopePills.map((tag, i) => (
                              <span
                                key={i}
                                className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono bg-elevated text-soft border border-line group-hover:border-line-strong transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Bottom Meta */}
                        <div className="flex items-center justify-between pt-3 border-t border-line/40 text-xs">
                          <span className="font-mono text-[11px] text-meta truncate max-w-[240px]">
                            {study.honestyNote || 'Scope-first verified showcase.'}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-accent group-hover:translate-x-1.5 transition-transform">
                            <span>Explore Case</span>
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>

                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
