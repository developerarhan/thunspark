import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CASE_STUDIES } from '@/lib/constants';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export function Section07FeaturedWork() {
  const featuredCases = CASE_STUDIES.slice(0, 3);

  return (
    <section id="work" className="py-24 md:py-32 bg-[#0A0A0A] border-y border-[#252525]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeading
            eyebrow="05 / SELECTED WORK"
            title={
              <>
                Work we&apos;re <span className="font-italic-accent">proud</span> of.
              </>
            }
            copy="Scope-first showcases spanning e-commerce, manufacturing, and consumer brands."
            className="mb-0"
          />

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#FFD21F] hover:text-[#FFE75A] font-semibold transition-colors shrink-0 group py-2"
          >
            <span>View all projects</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Featured Project Cards */}
        {featuredCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCases.map((project) => (
              <div
                key={project.slug}
                className="group p-8 rounded-xl bg-[#111111] border border-[#252525] hover:border-[#353535] hover:bg-[#171717] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Industry Meta Tag */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="font-mono text-xs text-[#FFD21F] uppercase tracking-wider font-semibold">
                      {project.industry}
                    </span>
                    <span className="font-mono text-xs text-[#8A8A85]">
                      {project.year}
                    </span>
                  </div>

                  {/* Client & Headline */}
                  <h3 className="font-display font-bold text-xl text-[#F5F5F0] mb-3 group-hover:text-[#FFD21F] transition-colors leading-snug">
                    {project.headline}
                  </h3>

                  <p className="text-xs text-[#A6A6A0] leading-relaxed line-clamp-3 mb-6">
                    {project.overview}
                  </p>

                  {/* Scope of Work */}
                  <div className="space-y-1.5 pt-4 border-t border-[#252525]">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A8A85] block">
                      Scope Delivered:
                    </span>
                    <ul className="space-y-1 text-xs text-[#F5F5F0]">
                      {project.scope.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD21F]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Honesty Badge & Detail Link */}
                <div className="pt-6 mt-6 border-t border-[#252525] space-y-3">
                  <div className="text-[11px] font-mono text-[#8A8A85] italic">
                    {project.honestyNote}
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    data-cursor="VIEW"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#F5F5F0] group-hover:text-[#FFD21F] transition-colors"
                  >
                    <span>View Case Breakdown</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Premium Empty State per Guide §D1 §7 */
          <div className="p-12 md:p-16 rounded-2xl bg-[#111111] border border-[#252525] text-center max-w-2xl mx-auto space-y-4">
            <h3 className="font-display font-bold text-2xl text-[#F5F5F0]">
              Case studies are on the way.
            </h3>
            <p className="text-sm text-[#A6A6A0] leading-relaxed">
              The work is happening right now across active client engagements. Talk to us about your project and we&apos;ll walk you through our live workflows.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#FFD21F] text-[#050505] font-semibold text-sm hover:bg-[#FFE75A] transition-colors mt-2"
            >
              Start a Conversation
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
