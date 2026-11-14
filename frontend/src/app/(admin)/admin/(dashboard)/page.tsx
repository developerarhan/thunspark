import React from 'react';
import Link from 'next/link';
import { getDashboardMetrics } from '@/lib/crm/dashboard';
import {
  Users2,
  FileCheck2,
  Trophy,
  ArrowRight,
  Sparkles,
  Clock,
  Building,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const data = await getDashboardMetrics();

  const cards = [
    {
      title: 'Total Inbound Leads',
      value: data.totalLeads,
      icon: Users2,
      desc: 'All time pipeline volume',
      accent: 'text-accent',
    },
    {
      title: 'Active / New Enquiries',
      value: data.newLeadsCount,
      icon: Sparkles,
      desc: 'Awaiting discovery call',
      accent: 'text-blue-400',
    },
    {
      title: 'Proposal & Negotiation',
      value: data.inProposalCount,
      icon: FileCheck2,
      desc: 'Active deal closing stages',
      accent: 'text-amber-400',
    },
    {
      title: 'Won Client Accounts',
      value: data.wonCount,
      icon: Trophy,
      desc: `${data.totalClients} total active clients`,
      accent: 'text-emerald-400',
    },
  ];

  return (
    <div className="p-5 sm:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-line">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-1">
            AGENCY OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink">
            Operations & Inbound Command
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-canvas font-semibold text-xs hover:bg-accent-hi transition-colors shadow-sm"
          >
            <span>Open Pipeline Kanban</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {cards.map((c) => (
          <div
            key={c.title}
            className="bg-card border border-line rounded-2xl p-5 sm:p-6 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-meta">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl bg-elevated border border-line ${c.accent}`}>
                <c.icon size={18} />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-display font-bold text-ink">
              {c.value}
            </div>
            <p className="text-xs text-soft font-mono">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Stage Breakdown & Sources Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pipeline Distribution */}
        <div className="lg:col-span-7 bg-card border border-line rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h2 className="text-base font-display font-semibold text-ink">
                Pipeline Stages Breakdown
              </h2>
              <p className="text-xs text-meta font-mono">Current distribution across deal flow</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
            >
              <span>View Board</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { stage: 'NEW', label: '1. New Enquiries', color: 'bg-blue-500' },
              { stage: 'PRE_AUDIT', label: '2. Pre-Audit Research', color: 'bg-purple-500' },
              { stage: 'DISCOVERY', label: '3. Discovery Call', color: 'bg-amber-500' },
              { stage: 'PROPOSAL', label: '4. Proposal Sent', color: 'bg-orange-500' },
              { stage: 'NEGOTIATION', label: '5. Negotiation & SOW', color: 'bg-indigo-500' },
              { stage: 'WON', label: '6. Won Engagement', color: 'bg-emerald-500' },
              { stage: 'LOST', label: '7. Closed / Not a Fit', color: 'bg-zinc-600' },
            ].map((st) => {
              const count = data.stageCounts[st.stage] || 0;
              const percent = data.totalLeads > 0 ? Math.round((count / data.totalLeads) * 100) : 0;
              return (
                <div key={st.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${st.color}`} />
                      {st.label}
                    </span>
                    <span className="font-mono text-meta">
                      {count} deals ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-elevated overflow-hidden">
                    <div
                      className={`h-full ${st.color}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Sources Distribution */}
        <div className="lg:col-span-5 bg-card border border-line rounded-2xl p-6 space-y-5">
          <div className="border-b border-line pb-4">
            <h2 className="text-base font-display font-semibold text-ink">
              Channel Attribution
            </h2>
            <p className="text-xs text-meta font-mono">Inbound acquisition channels</p>
          </div>

          <div className="space-y-3">
            {['ORGANIC', 'PAID', 'REFERRAL', 'DIRECT', 'OUTBOUND', 'OTHER'].map((src) => {
              const count = data.sourceCounts[src] || 0;
              const percent = data.totalLeads > 0 ? Math.round((count / data.totalLeads) * 100) : 0;
              return (
                <div
                  key={src}
                  className="flex items-center justify-between p-3 rounded-xl bg-elevated border border-line/60"
                >
                  <span className="text-xs font-mono uppercase text-ink font-semibold">
                    {src}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-display font-bold text-accent">
                      {count}
                    </span>
                    <span className="text-[10px] font-mono text-meta">
                      ({percent}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="bg-card border border-line rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="text-base font-display font-semibold text-ink">
              Recent Inbound Enquiries
            </h2>
            <p className="text-xs text-meta font-mono">Real-time pipeline entries from website</p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
          >
            <span>View All Leads</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {data.recentLeads.length === 0 ? (
          <div className="py-12 text-center text-soft text-sm font-mono">
            No inbound leads recorded yet. Submissions to the contact form will appear here live.
          </div>
        ) : (
          <div className="divide-y divide-line">
            {data.recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-elevated border border-line flex items-center justify-center text-xs font-mono font-bold text-accent shrink-0">
                    {lead.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-ink truncate">
                        {lead.name}
                      </span>
                      {lead.company && (
                        <span className="text-xs text-soft flex items-center gap-1">
                          <Building size={12} />
                          {lead.company}
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated border border-line text-accent font-semibold">
                        {lead.stage}
                      </span>
                    </div>
                    <div className="text-xs text-meta font-mono mt-0.5 truncate">
                      {lead.email} {lead.budgetRange ? `• ${lead.budgetRange}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <span className="text-[11px] font-mono text-meta flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/admin/leads?id=${lead.id}`}
                    className="p-1.5 rounded-lg bg-elevated hover:bg-card border border-line text-xs text-ink hover:text-accent transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
