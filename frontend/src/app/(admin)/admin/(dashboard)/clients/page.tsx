import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db/client';
import {
  Building2,
  Users,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
  let clients: any[] = [];

  if (process.env.DATABASE_URL) {
    try {
      clients = await db.client.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          contacts: true,
          projects: {
            select: { id: true, name: true, status: true, budgetAmount: true },
          },
        },
      });
    } catch (e) {
      console.error('[CRM Clients Fetch Error]:', e);
    }
  }

  return (
    <div className="p-4 sm:p-7 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 block mb-1">
            ACCOUNTS DIRECTORY
          </span>
          <h1 className="text-2xl font-display font-bold text-ink flex items-center gap-2">
            Active Client Accounts
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-elevated border border-line text-meta font-normal">
              {clients.length} Clients
            </span>
          </h1>
        </div>

        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent text-canvas font-semibold text-xs hover:bg-accent-hi transition-colors shadow-sm"
        >
          <span>Convert From Won Leads</span>
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="bg-card border border-line rounded-2xl p-12 text-center space-y-3">
          <Building2 size={36} className="text-meta mx-auto" />
          <h3 className="text-base font-display font-semibold text-ink">
            No Client Accounts Yet
          </h3>
          <p className="text-xs text-soft max-w-md mx-auto">
            When an inbound lead reaches the &quot;Won&quot; stage in your pipeline, click &quot;1-Click Convert&quot; to automatically spin up a dedicated client profile.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-elevated border border-line text-xs font-semibold text-accent hover:bg-card transition-colors"
            >
              Go to Pipeline Kanban
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client) => {
            const primaryContact = client.contacts.find((c: any) => c.isPrimary) || client.contacts[0];
            return (
              <Link
                key={client.id}
                href={`/admin/clients/${client.id}`}
                className="bg-card hover:bg-elevated/40 border border-line hover:border-line-strong rounded-2xl p-5 space-y-4 transition-all group shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-elevated border border-line flex items-center justify-center font-display font-bold text-accent text-sm">
                        {client.legalName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                          {client.brandName || client.legalName}
                        </h2>
                        {client.industry && (
                          <span className="text-[10px] font-mono text-meta">
                            {client.industry}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                      Health {client.healthScore}%
                    </span>
                  </div>

                  {primaryContact && (
                    <div className="text-xs text-soft space-y-0.5 pt-1">
                      <div className="font-medium text-ink flex items-center gap-1.5">
                        <Users size={12} className="text-meta" />
                        <span>{primaryContact.name}</span>
                      </div>
                      <div className="text-[11px] font-mono text-meta truncate pl-4">
                        {primaryContact.email}
                      </div>
                    </div>
                  )}

                  {client.projects.length > 0 && (
                    <div className="pt-2 border-t border-line/60 flex items-center gap-1.5 text-xs text-meta">
                      <Briefcase size={12} className="text-accent" />
                      <span>{client.projects.length} Active Engagement(s)</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs font-mono text-meta">
                  <span>{client.currency} Account</span>
                  <span className="text-accent group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>360° View</span>
                    <ChevronRight size={13} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
