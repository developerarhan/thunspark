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
  initialStudies: CaseStudyItem[];
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
        <span className="font-mono text-xs uppercase tracking-wider text-[#8A8A85] mr-2">
          Filter by:
        </span>
        {industries.map((industry) => (
          <button
            key={industry}
            type="button"
            onClick={() => setSelectedIndustry(industry)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
              selectedIndustry === industry
                ? 'bg-[#FFD21F] text-[#050505] font-bold'
                : 'bg-[#111111] text-[#8A8A85] border border-[#252525] hover:border-[#353535] hover:text-[#F5F5F0]'
            }`}
          >
            {industry === 'all' ? 'All Engagements' : industry}
          </button>
        ))}
      </div>

      {/* Grid of Case Studies */}
      {filteredStudies.length === 0 ? (
        <Card className="p-12 text-center bg-[#111111] border-[#252525] max-w-lg mx-auto">
          <p className="text-[#8A8A85] text-sm mb-4">
            No engagements found matching this category filter.
          </p>
          <button
            type="button"
            onClick={() => setSelectedIndustry('all')}
            className="text-xs font-mono text-[#FFD21F] hover:underline"
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
                className="group block h-full focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FFD21F] rounded-xl"
              >
                <Card className="p-6 md:p-8 h-full flex flex-col justify-between bg-[#111111] border-[#252525] group-hover:border-[#FFD21F]/50 group-hover:bg-[#171717] transition-all duration-300">
                  <div>
                    {/* Header meta */}
                    <div className="flex items-center justify-between mb-4">
                      <Tag variant="accent">{study.industry}</Tag>
                      <span className="font-mono text-xs text-[#8A8A85]">
                        {study.year}
                      </span>
                    </div>

                    <h3 className="font-display font-medium text-2xl text-[#F5F5F0] group-hover:text-[#FFD21F] transition-colors mb-3">
                      {study.client}
                    </h3>

                    <p className="font-display text-base text-[#F5F5F0] italic mb-4 leading-snug">
                      &ldquo;{study.headline}&rdquo;
                    </p>

                    <p className="text-[#8A8A85] text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
                      {study.overview}
                    </p>
                  </div>

                  <div>
                    {/* Scope Pills */}
                    <div className="pt-4 border-t border-[#252525] mb-4">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#8A8A85] block mb-2">
                        Scope Delivered:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {study.scope.map((item, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-[#171717] text-[#8A8A85] border border-[#252525]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Honesty Note */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#252525]/60 text-xs text-[#8A8A85]">
                      <span className="italic text-[11px] text-[#8A8A85]">
                        {study.honestyNote}
                      </span>
                      <span className="text-[#8A8A85] group-hover:text-[#FFD21F] group-hover:translate-x-1 transition-all">
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
