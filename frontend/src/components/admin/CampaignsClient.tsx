'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { createCampaignAction } from '@/app/(admin)/admin/actions-phase2';
import {
  TrendingUp,
  Plus,
  RefreshCw,
} from 'lucide-react';
import type { Channel } from '@prisma/client';

export interface CampaignItem {
  id: string;
  name: string;
  channel: Channel;
  status: string;
  budget: number | null;
  spend: number | null;
  targetCpa: number | null;
  actualCpa: number | null;
  targetRoas: number | null;
  actualRoas: number | null;
  client: { id: string; legalName: string; brandName: string | null };
  createdAt: string;
}

const CHANNEL_BADGES: Record<Channel, { label: string; color: string }> = {
  GOOGLE_ADS: { label: 'Google Ads', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  META_ADS: { label: 'Meta Ads', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  LINKEDIN_ADS: { label: 'LinkedIn Ads', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  SEO: { label: 'Organic SEO', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  EMAIL: { label: 'Email / Retention', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  SOCIAL_ORGANIC: { label: 'Organic Social', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  CONTENT: { label: 'Content Strategy', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  WEB: { label: 'Conversion Rate', color: 'bg-accent/10 text-accent border-accent/20' },
  OTHER: { label: 'Channel Other', color: 'bg-zinc-800 text-meta border-line' },
};

export function CampaignsClient({
  initialCampaigns,
  clients,
}: {
  initialCampaigns: CampaignItem[];
  clients: Array<{ id: string; legalName: string; brandName: string | null }>;
}) {
  const [campaigns] = useState<CampaignItem[]>(initialCampaigns);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSyncing, setIsSyncing] = useState(false);

  // Filters
  const [filterClient, setFilterClient] = useState<string>('ALL');
  const [filterChannel, setFilterChannel] = useState<string>('ALL');

  // Form fields
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<Channel>('GOOGLE_ADS');
  const [budget, setBudget] = useState('');
  const [targetCpa, setTargetCpa] = useState('');
  const [targetRoas, setTargetRoas] = useState('');

  // Filtered Campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    const matchClient = filterClient === 'ALL' || c.client.id === filterClient;
    const matchChannel = filterChannel === 'ALL' || c.channel === filterChannel;
    return matchClient && matchChannel;
  });

  // Dynamic Portfolio / Client Stats based on active filter
  const totalBudget = filteredCampaigns.reduce((acc, c) => acc + (c.budget || 0), 0);
  const totalSpend = filteredCampaigns.reduce((acc, c) => acc + (c.spend || 0), 0);
  const avgRoas =
    filteredCampaigns.filter((c) => c.actualRoas).length > 0
      ? (
          filteredCampaigns.reduce((acc, c) => acc + (c.actualRoas || 0), 0) /
          filteredCampaigns.filter((c) => c.actualRoas).length
        ).toFixed(2)
      : '0.00';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !name.trim()) return;

    startTransition(async () => {
      const res = await createCampaignAction({
        clientId,
        name,
        channel,
        budget: budget ? Number(budget) : undefined,
        targetCpa: targetCpa ? Number(targetCpa) : undefined,
        targetRoas: targetRoas ? Number(targetRoas) : undefined,
      });

      if (res?.success) {
        setShowModal(false);
        window.location.reload();
      }
    });
  };

  const handleSyncMetrics = async () => {
    setIsSyncing(true);
    try {
      // Call mock sync endpoint
      const res = await fetch('/api/campaigns/sync', { method: 'POST' });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-4 sm:p-7 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-1">
            PERFORMANCE MARKETING & APIS
          </span>
          <h1 className="text-2xl font-display font-bold text-ink flex items-center gap-2">
            Ad Campaigns & Channel Tracking
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncMetrics}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-elevated hover:bg-card border border-line text-xs font-semibold text-accent transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing APIs...' : 'Sync Ad Platforms'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent text-canvas font-semibold text-xs hover:bg-accent-hi transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Client & Platform Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/60 border border-line rounded-2xl p-3.5">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Client Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-meta">Client:</span>
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-elevated border border-line text-xs font-semibold text-ink focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Clients ({clients.length})</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brandName || c.legalName}
                </option>
              ))}
            </select>
          </div>

          {/* Channel Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-meta">Platform:</span>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-elevated border border-line text-xs font-semibold text-ink focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Channels</option>
              <option value="GOOGLE_ADS">Google Ads</option>
              <option value="META_ADS">Meta Ads</option>
              <option value="LINKEDIN_ADS">LinkedIn Ads</option>
              <option value="SEO">Organic SEO</option>
              <option value="EMAIL">Email / Retention</option>
              <option value="WEB">Web / Conversion Rate</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Counter */}
        <div className="text-xs font-mono text-meta">
          Showing <span className="font-bold text-accent">{filteredCampaigns.length}</span> of {campaigns.length} campaigns
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-card border border-line rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-meta">
            Allocated Media Budget
          </span>
          <div className="text-2xl sm:text-3xl font-display font-bold text-ink">
            ₹{totalBudget.toLocaleString()}
          </div>
          <span className="text-xs font-mono text-meta">Active client ad spend allocations</span>
        </div>

        <div className="bg-card border border-line rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-meta">
            Live Platform Spend
          </span>
          <div className="text-2xl sm:text-3xl font-display font-bold text-accent">
            ₹{totalSpend.toLocaleString()}
          </div>
          <span className="text-xs font-mono text-meta">
            Pacing: {totalBudget > 0 ? `${Math.round((totalSpend / totalBudget) * 100)}% consumed` : '0%'}
          </span>
        </div>

        <div className="bg-card border border-line rounded-2xl p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-meta">
            Portfolio Blended ROAS
          </span>
          <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-400">
            {avgRoas}x
          </div>
          <span className="text-xs font-mono text-meta">Cross-channel return on ad spend</span>
        </div>
      </div>

      {/* Campaigns Table */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-card border border-line rounded-2xl p-12 text-center space-y-3">
          <TrendingUp size={36} className="text-meta mx-auto" />
          <h3 className="text-base font-display font-semibold text-ink">
            {campaigns.length === 0 ? 'No Ad Campaigns Tracked Yet' : 'No Campaigns Match Active Filter'}
          </h3>
          <p className="text-xs text-soft max-w-md mx-auto">
            {campaigns.length === 0
              ? 'Set up Google Ads, Meta Ads, or SEO campaigns to monitor budget pacing, CPA targets, and ROAS.'
              : 'Try clearing or changing your Client or Channel filter above to view campaigns.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (campaigns.length === 0) {
                  setShowModal(true);
                } else {
                  setFilterClient('ALL');
                  setFilterChannel('ALL');
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-canvas font-semibold text-xs hover:bg-accent-hi"
            >
              <Plus size={14} />
              <span>{campaigns.length === 0 ? 'Create Campaign' : 'Reset Filters'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-line rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated border-b border-line text-meta font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Campaign / Client</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Budget Pacing</th>
                  <th className="py-3 px-4">Target CPA vs Actual</th>
                  <th className="py-3 px-4">Target ROAS vs Actual</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredCampaigns.map((camp) => {
                  const b = camp.budget || 0;
                  const s = camp.spend || 0;
                  const pacingPercent = b > 0 ? Math.min(100, Math.round((s / b) * 100)) : 0;
                  const cpaGood = camp.targetCpa && camp.actualCpa ? camp.actualCpa <= camp.targetCpa : true;
                  const roasGood = camp.targetRoas && camp.actualRoas ? camp.actualRoas >= camp.targetRoas : true;

                  const badge = CHANNEL_BADGES[camp.channel] || CHANNEL_BADGES.OTHER;

                  return (
                    <tr key={camp.id} className="hover:bg-elevated/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-ink text-sm">{camp.name}</div>
                        <div className="text-[11px] font-mono text-meta">
                          {camp.client.brandName || camp.client.legalName}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono min-w-[150px]">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-accent font-semibold">₹{s.toLocaleString()}</span>
                          <span className="text-meta">/ ₹{b.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-elevated overflow-hidden">
                          <div
                            className={`h-full ${pacingPercent > 95 ? 'bg-red-400' : 'bg-accent'}`}
                            style={{ width: `${pacingPercent}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {camp.actualCpa ? (
                          <div className={cpaGood ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                            ₹{camp.actualCpa} <span className="text-meta font-normal text-[10px]">/ ₹{camp.targetCpa || '—'} target</span>
                          </div>
                        ) : (
                          <span className="text-meta">Target: ₹{camp.targetCpa || '—'}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {camp.actualRoas ? (
                          <div className={roasGood ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                            {camp.actualRoas}x <span className="text-meta font-normal text-[10px]">/ {camp.targetRoas || '—'}x target</span>
                          </div>
                        ) : (
                          <span className="text-meta">Target: {camp.targetRoas ? `${camp.targetRoas}x` : '—'}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {camp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CREATE CAMPAIGN MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-base/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-card border border-line rounded-2xl p-6 space-y-4 z-10 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-ink border-b border-line pb-2">
              Add Performance Campaign
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono uppercase text-meta mb-1">Client Account *</label>
                {clients.length === 0 ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 space-y-1">
                    <p className="font-semibold text-xs">No client accounts found</p>
                    <p className="text-[11px] text-zinc-300">
                      Convert a won deal in the{' '}
                      <Link href="/admin/leads" className="underline text-accent font-bold">
                        Leads Pipeline
                      </Link>{' '}
                      first to create a client account.
                    </p>
                  </div>
                ) : (
                  <select
                    required
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.brandName || c.legalName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-mono uppercase text-meta mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Google Search - High Intent Core Keywords"
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-meta mb-1">Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as Channel)}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                  >
                    <option value="GOOGLE_ADS">Google Ads</option>
                    <option value="META_ADS">Meta Ads</option>
                    <option value="LINKEDIN_ADS">LinkedIn Ads</option>
                    <option value="SEO">Organic SEO</option>
                    <option value="EMAIL">Email Marketing</option>
                    <option value="CONTENT">Content Strategy</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono uppercase text-meta mb-1">Budget (INR)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-meta mb-1">Target CPA (INR)</label>
                  <input
                    type="number"
                    value={targetCpa}
                    onChange={(e) => setTargetCpa(e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-meta mb-1">Target ROAS (Multiplier)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetRoas}
                    onChange={(e) => setTargetRoas(e.target.value)}
                    placeholder="e.g. 3.5"
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-line flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-xl hover:bg-elevated text-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 rounded-xl bg-accent text-canvas font-semibold hover:bg-accent-hi"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
