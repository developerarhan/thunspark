'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Badge';
import { Reveal } from '@/components/motion/Reveal';
import { ArrowRight } from 'lucide-react';

export interface CaseStudyItem {
  slug: string;
  client: string;
  industry: string;
  headline: string;
  overview: string;
  scope: readonly string[] | string[];
  servicesRendered: readonly string[] | string[];
  year: number;
  honestyNote: string;
}

interface ProjectsListingClientProps {
  initialStudies: readonly CaseStudyItem[];
}

export function ProjectsListingClient({ initialStudies }: ProjectsListingClientProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const industries = [
    'all',
    ...Array.from(new Set(initialStudies.map((s) => s.industry))),
  ];

  const filteredStudies =
    selectedIndustry === 'all'
      ? initialStudies
      : initialStudies.filter((s) => s.industry === selectedIndustry);

  return (
    <div>
      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 mb-12">
        <span className="font-mono text-xs uppercase tracking-wider text-meta mr-2">
          Filter by:
        </span>
        {industries.map((industry) => (
          <button
            key={industry}
            type="button"
            onClick={() => setSelectedIndustry(industry)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
              selectedIndustry === industry
                ? 'bg-accent text-canvas font-bold'
                : 'bg-card text-meta border border-line hover:border-line-strong hover:text-ink'
            }`}
          >
            {industry === 'all' ? 'All Engagements' : industry}
          </button>
        ))}
      </div>

      {/* Grid of Case Studies */}
      {filteredStudies.length === 0 ? (
        <Card className="p-12 text-center bg-card border-line max-w-lg mx-auto">
          <p className="text-soft text-sm mb-4">
            No engagements found matching this category filter.
          </p>
          <button
            type="button"
            onClick={() => setSelectedIndustry('all')}
            className="text-xs font-mono text-accent hover:underline"
          >
            Clear filter
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredStudies.map((study, idx) => (
            <Reveal key={study.slug} delay={idx * 0.08}>
              <Link
                href={`/projects/${study.slug}`}
                className="group block h-full focus:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl"
              >
                <Card className="p-6 md:p-8 h-full flex flex-col justify-between bg-card border-line group-hover:border-accent/50 group-hover:bg-elevated transition-all duration-300">
                  <div>
                    {/* Header meta */}
                    <div className="flex items-center justify-between mb-4">
                      <Tag variant="accent">{study.industry}</Tag>
                      <span className="font-mono text-xs text-meta">
                        {study.year}
                      </span>
                    </div>

                    <h3 className="font-display font-medium text-2xl text-ink group-hover:text-accent transition-colors mb-3">
                      {study.client}
                    </h3>

                    <p className="font-display text-base text-ink italic mb-4 leading-snug">
                      &ldquo;{study.headline}&rdquo;
                    </p>

                    <p className="text-soft text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
                      {study.overview}
                    </p>
                  </div>

                  <div>
                    {/* Scope Pills */}
                    <div className="pt-4 border-t border-line mb-4">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-meta block mb-2">
                        Scope Delivered:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {study.scope.map((item, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-elevated text-meta border border-line"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Honesty Note */}
                    <div className="flex items-center justify-between pt-3 border-t border-line/60 text-xs text-meta">
                      <span className="italic text-[11px] text-meta">
                        {study.honestyNote}
                      </span>
                      <span className="text-meta group-hover:text-accent group-hover:translate-x-1 transition-all">
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
