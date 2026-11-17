import React from 'react';
import {
  Sparkles,
  ExternalLink,
  BookOpen,
  Briefcase,
  Users2,
  FileText,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const metadata = {
  title: 'Content CMS & Marketing Hub | ThunSpark CRM',
};

const SANITY_MODELS = [
  {
    title: 'Case Studies & Client Work',
    desc: 'Publish B2B growth case studies, metrics, deliverables, and client outcomes.',
    icon: Briefcase,
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    href: '/studio/structure/project',
  },
  {
    title: 'Creative Showcase (Drift Wall)',
    desc: 'Manage the 3D lookbook of ad creatives, motion reels, metric badges, and case study links.',
    icon: Zap,
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    href: '/studio/structure/creativeShowcase',
  },
  {
    title: 'Client Testimonials & Reviews',
    desc: 'Author, edit, and verify client quotes and founder reviews featured on the homepage.',
    icon: ShieldCheck,
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    href: '/studio/structure/testimonial',
  },
  {
    title: 'Blog & Thought Leadership',
    desc: 'Author performance marketing articles, SEO teardowns, and industry playbooks.',
    icon: BookOpen,
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    href: '/studio/structure/post',
  },
  {
    title: 'Agency Team & Leadership',
    desc: 'Manage public team member profiles, bios, roles, and headshots.',
    icon: Users2,
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    href: '/studio/structure/teamMember',
  },
  {
    title: 'Career Openings & Hiring',
    desc: 'Post job descriptions, requirements, and hiring status for agency roles.',
    icon: FileText,
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    href: '/studio/structure/jobOpening',
  },
  {
    title: 'Site Settings & Global SEO',
    desc: 'Update meta tags, social preview cards, OpenGraph schema, and footer links.',
    icon: Sliders,
    color: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    href: '/studio/structure/siteSettings',
  },
];

export default function ContentHubPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/40 via-zinc-900 to-zinc-900 border border-orange-500/20 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-orange-600 text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">
              Unified Content CMS Bridge
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 mt-1">
            Marketing Content & Sanity Studio
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Edit public website case studies, blog insights, and team profiles directly via our embedded Sanity Studio bridge without juggling separate systems.
          </p>
        </div>

        <a
          href="/studio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition shadow-lg shadow-orange-950/40 shrink-0 self-start sm:self-auto"
        >
          <span>Open Full Sanity Studio</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Authentication Note */}
      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-200">Single Sign-On (SSO) Continuity: </span>
          Both <code className="text-orange-400 font-mono">/admin</code> and{' '}
          <code className="text-orange-400 font-mono">/studio</code> use the same administrative identity.
          When authenticated with Google SSO (<span className="text-zinc-300 font-mono">admin@thunspark.agency</span>),
          your browser session grants immediate access to both systems without re-authenticating.
        </div>
      </div>

      {/* Content Schemas Quick Launcher Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-400" />
          Direct Content Launchers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SANITY_MODELS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 transition group flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-orange-400 transition-colors mt-3">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500 group-hover:text-zinc-300 flex items-center justify-between">
                  <span>Manage in Sanity</span>
                  <span>&rarr;</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
