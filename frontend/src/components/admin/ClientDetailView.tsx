'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Receipt,
  Sparkles,
  Users,
  Phone,
  Mail,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';
import {
  ClientAdPerformanceTab,
  type SavedReportItem,
} from '@/components/admin/ClientAdPerformanceTab';

interface ClientDetailViewProps {
  client: {
    id: string;
    legalName: string;
    brandName: string | null;
    industry: string | null;
    website: string | null;
    healthScore: number;
    gstin: string | null;
    currency: string;
    timezone: string;
    createdAt: string;
    contacts: Array<{
      id: string;
      name: string;
      role: string | null;
      email: string;
      phone: string | null;
      isPrimary: boolean;
    }>;
    projects: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      budgetAmount: number | null;
    }>;
    invoices: Array<{
      id: string;
      number: string;
      status: string;
      dueDate: string;
      total: number;
      isIgst: boolean;
    }>;
    lead: {
      id: string;
      name: string;
      source: string;
      utmSource: string | null;
      utmCampaign: string | null;
      bottleneckNotes: string | null;
      createdAt: string;
    } | null;
  };
  initialReports: SavedReportItem[];
}

export function ClientDetailView({ client, initialReports }: ClientDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'ad_performance' | 'overview'>('ad_performance');

  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="bg-card border border-line rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-elevated border border-line flex items-center justify-center font-display font-bold text-accent text-2xl">
            {client.legalName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-display font-bold text-ink">
                {client.brandName || client.legalName}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                Health Score {client.healthScore}%
              </span>
            </div>
            <div className="text-xs text-soft font-mono mt-1">
              Legal: {client.legalName} {client.gstin ? `• GSTIN: ${client.gstin}` : ''}
            </div>
          </div>
        </div>

        {client.website && (
          <a
            href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-elevated hover:bg-card border border-line text-xs font-semibold text-accent transition-colors self-start sm:self-auto"
          >
            <span>Visit Client Website</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('ad_performance')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'ad_performance'
              ? 'bg-accent text-canvas shadow-sm font-bold'
              : 'text-soft hover:text-ink bg-card border border-line hover:border-line-strong'
          }`}
        >
          <Sparkles size={14} className={activeTab === 'ad_performance' ? 'text-canvas' : 'text-accent'} />
          <span>Ad Performance (AI Vision Hub)</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
              activeTab === 'ad_performance'
                ? 'bg-black/20 text-canvas'
                : 'bg-elevated text-meta border border-line'
            }`}
          >
            {initialReports.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-accent text-canvas shadow-sm font-bold'
              : 'text-soft hover:text-ink bg-card border border-line hover:border-line-strong'
          }`}
        >
          <Briefcase size={14} />
          <span>Overview &amp; Deliverables ({client.projects.length})</span>
        </button>
      </div>

      {/* Tab 1: Ad Performance (AI Vision & File Drop-Zone) */}
      {activeTab === 'ad_performance' && (
        <ClientAdPerformanceTab
          clientId={client.id}
          clientName={client.brandName || client.legalName}
          currency={client.currency}
          initialReports={initialReports}
        />
      )}

      {/* Tab 2: Overview & Projects */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Projects & Deliverables */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card border border-line rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-accent" />
                  <h2 className="text-sm font-display font-semibold text-ink">
                    Active Engagements &amp; Projects ({client.projects.length})
                  </h2>
                </div>
              </div>

              {client.projects.length === 0 ? (
                <p className="text-xs text-soft font-mono py-4 text-center">
                  No active projects recorded for this account.
                </p>
              ) : (
                <div className="space-y-3">
                  {client.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-elevated border border-line/60 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="text-xs font-semibold text-ink">
                          {proj.name}
                        </h3>
                        <div className="text-[10px] font-mono text-meta mt-0.5">
                          Type: {proj.type} • Status: {proj.status}
                        </div>
                      </div>
                      {proj.budgetAmount && (
                        <span className="font-mono text-xs font-bold text-accent">
                          {client.currency} {Number(proj.budgetAmount).toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tax Invoices & Billing */}
            <div className="bg-card border border-line rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-accent" />
                  <h2 className="text-sm font-display font-semibold text-ink">
                    GST Invoices &amp; Retainers ({client.invoices.length})
                  </h2>
                </div>
                <Link
                  href="/admin/invoices"
                  className="text-[11px] font-mono text-accent hover:underline"
                >
                  + New Invoice
                </Link>
              </div>

              {client.invoices.length === 0 ? (
                <p className="text-xs text-soft font-mono py-4 text-center">
                  No invoices generated for this client yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {client.invoices.map((inv) => (
                    <Link
                      key={inv.id}
                      href={`/admin/invoices/${inv.id}`}
                      className="p-3.5 rounded-xl bg-elevated border border-line/60 hover:border-accent/40 flex items-center justify-between transition-colors group block"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-ink group-hover:text-accent transition-colors">
                            {inv.number}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-line text-soft">
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-meta mt-0.5">
                          Due: {new Date(inv.dueDate).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-ink">
                          ₹{Number(inv.total).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] font-mono text-meta">
                          {inv.isIgst ? 'IGST 18%' : 'CGST+SGST 18%'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Original Lead Attributed Origin */}
            {client.lead && (
              <div className="bg-card border border-line rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 border-b border-line pb-3">
                  <Sparkles size={16} className="text-accent" />
                  <h2 className="text-sm font-display font-semibold text-ink">
                    Inbound Origin Telemetry
                  </h2>
                </div>

                <div className="text-xs space-y-2">
                  <div className="flex justify-between py-1 border-b border-line/40 font-mono">
                    <span className="text-meta">Acquisition Channel:</span>
                    <span className="text-ink font-semibold">{client.lead.source}</span>
                  </div>
                  {client.lead.utmSource && (
                    <div className="flex justify-between py-1 border-b border-line/40 font-mono">
                      <span className="text-meta">UTM Campaign:</span>
                      <span className="text-accent">{client.lead.utmCampaign || client.lead.utmSource}</span>
                    </div>
                  )}
                  {client.lead.bottleneckNotes && (
                    <div className="pt-2">
                      <span className="text-[10px] font-mono text-meta uppercase block mb-1">
                        Original Challenge
                      </span>
                      <p className="text-soft whitespace-pre-wrap p-3 rounded bg-elevated border border-line/60">
                        {client.lead.bottleneckNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Stakeholders & Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-line rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-line pb-3">
                <Users size={16} className="text-accent" />
                <h2 className="text-sm font-display font-semibold text-ink">
                  Key Stakeholders &amp; Contacts
                </h2>
              </div>

              <div className="space-y-3">
                {client.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3.5 rounded-xl bg-elevated border border-line/60 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink">{contact.name}</span>
                      {contact.isPrimary && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-bold">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-soft">
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-meta" />
                        <a href={`mailto:${contact.email}`} className="hover:underline">
                          {contact.email}
                        </a>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-meta" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Metadata */}
            <div className="bg-card border border-line rounded-2xl p-5 space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-line/40">
                <span className="text-meta">Currency</span>
                <span className="text-ink">{client.currency}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-line/40">
                <span className="text-meta">Timezone</span>
                <span className="text-ink">{client.timezone}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-meta">Account Established</span>
                <span className="text-ink">{new Date(client.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
