'use client';

import React, { useState, useTransition } from 'react';
import {
  updateLeadStageAction,
  addLeadActivityAction,
  convertLeadToClientAction,
  createManualLeadAction,
} from '@/app/(admin)/admin/actions';
import {
  Plus,
  Search,
  Building,
  Trophy,
  Columns,
  List,
  ExternalLink,
} from 'lucide-react';
import type { LeadStage, LeadSource, ActivityType } from '@prisma/client';

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website: string | null;
  source: LeadSource;
  stage: LeadStage;
  serviceInterest: string[];
  budgetRange: string | null;
  bottleneckNotes: string | null;
  score: number;
  utmSource: string | null;
  utmCampaign: string | null;
  referrer: string | null;
  createdAt: string;
  lastActivity: string;
  convertedClient?: { id: string; legalName: string } | null;
  activities: Array<{
    id: string;
    type: string;
    title: string;
    content: string | null;
    createdAt: string;
    author?: { name: string | null } | null;
  }>;
}

const STAGES: Array<{ id: LeadStage; label: string; color: string }> = [
  { id: 'NEW', label: '1. New Enquiries', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
  { id: 'PRE_AUDIT', label: '2. Pre-Audit', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
  { id: 'DISCOVERY', label: '3. Discovery Call', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { id: 'PROPOSAL', label: '4. Proposal Sent', color: 'border-orange-500/40 text-orange-400 bg-orange-500/10' },
  { id: 'NEGOTIATION', label: '5. Negotiation', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' },
  { id: 'WON', label: '6. Won Engagement', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  { id: 'LOST', label: '7. Closed / Not a Fit', color: 'border-zinc-700 text-zinc-400 bg-zinc-800/40' },
];

export function LeadsKanbanClient({ initialLeads }: { initialLeads: LeadItem[] }) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [activityNote, setActivityNote] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('NOTE');

  // Convert modal form fields
  const [convertLegalName, setConvertLegalName] = useState('');
  const [convertGstin, setConvertGstin] = useState('');
  const [convertIndustry, setConvertIndustry] = useState('');
  const [convertValue, setConvertValue] = useState('');

  // Manual Add Lead form fields
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadWebsite, setNewLeadWebsite] = useState('');
  const [newLeadNotes, setNewLeadNotes] = useState('');
  const [newLeadBudget, setNewLeadBudget] = useState('');

  // Filter leads
  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.company && l.company.toLowerCase().includes(q))
    );
  });

  const handleStageChange = (leadId: string, nextStage: LeadStage) => {
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: nextStage, lastActivity: new Date().toISOString() } : l))
    );
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, stage: nextStage } : null));
    }

    startTransition(async () => {
      await updateLeadStageAction(leadId, nextStage);
    });
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !activityNote.trim()) return;

    const note = activityNote;
    const type = activityType;
    setActivityNote('');

    startTransition(async () => {
      const res = await addLeadActivityAction(selectedLead.id, note, type);
      if (res?.activity) {
        const newAct = {
          id: res.activity.id,
          type: res.activity.type,
          title: res.activity.title,
          content: res.activity.content,
          createdAt: new Date().toISOString(),
          author: { name: 'You' },
        };
        setSelectedLead((prev) => (prev ? { ...prev, activities: [newAct, ...prev.activities] } : null));
      }
    });
  };

  const handleOpenConvertModal = (lead: LeadItem) => {
    setSelectedLead(lead);
    setConvertLegalName(lead.company || lead.name);
    setConvertIndustry('');
    setConvertGstin('');
    setConvertValue('');
    setShowConvertModal(true);
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    startTransition(async () => {
      const res = await convertLeadToClientAction({
        leadId: selectedLead.id,
        legalName: convertLegalName,
        industry: convertIndustry,
        gstin: convertGstin,
        contractValue: convertValue ? Number(convertValue) : undefined,
      });

      if (res?.success) {
        setShowConvertModal(false);
        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLead.id
              ? { ...l, stage: 'WON', convertedClient: { id: res.clientId, legalName: convertLegalName } }
              : l
          )
        );
        if (selectedLead) {
          setSelectedLead({
            ...selectedLead,
            stage: 'WON',
            convertedClient: { id: res.clientId, legalName: convertLegalName },
          });
        }
      }
    });
  };

  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createManualLeadAction({
        name: newLeadName,
        email: newLeadEmail,
        company: newLeadCompany,
        website: newLeadWebsite,
        budgetRange: newLeadBudget,
        notes: newLeadNotes,
      });

      if (res?.success) {
        setShowAddLeadModal(false);
        // Refresh page to load new record
        window.location.reload();
      }
    });
  };

  return (
    <div className="p-4 sm:p-7 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-1">
            PIPELINE MANAGEMENT
          </span>
          <h1 className="text-2xl font-display font-bold text-ink flex items-center gap-2">
            Inbound Growth Pipeline
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-elevated border border-line text-meta font-normal">
              {leads.length} Deals
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-meta" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, company..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-card border border-line text-xs text-ink placeholder:text-soft/60 focus:outline-none focus:border-accent w-48 sm:w-60"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-card border border-line text-xs">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg ${
                viewMode === 'kanban' ? 'bg-elevated text-accent font-semibold' : 'text-soft hover:text-ink'
              }`}
            >
              <Columns size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${
                viewMode === 'table' ? 'bg-elevated text-accent font-semibold' : 'text-soft hover:text-ink'
              }`}
            >
              <List size={15} />
            </button>
          </div>

          {/* Add Lead Button */}
          <button
            type="button"
            onClick={() => setShowAddLeadModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent text-canvas font-semibold text-xs hover:bg-accent-hi transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            <span>New Inbound Lead</span>
          </button>
        </div>
      </div>

      {/* ── KANBAN BOARD VIEW ── */}
      {viewMode === 'kanban' && (
        <div className="flex items-start gap-4 overflow-x-auto pb-6 w-full">
          {STAGES.map((st) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === st.id);
            return (
              <div
                key={st.id}
                className="bg-card/60 border border-line rounded-2xl p-3 space-y-3 w-[280px] shrink-0 flex flex-col max-h-[calc(100vh-180px)]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-line px-1">
                  <span className="text-xs font-mono font-semibold text-ink truncate">
                    {st.label}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-elevated border border-line text-meta font-bold">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {stageLeads.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-meta font-mono">
                      No deals in this stage
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="p-3.5 rounded-xl bg-elevated hover:bg-card border border-line hover:border-line-strong transition-all cursor-pointer space-y-2 group shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-ink group-hover:text-accent transition-colors line-clamp-1">
                            {lead.name}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-card border border-line text-meta shrink-0">
                            {lead.source}
                          </span>
                        </div>

                        {lead.company && (
                          <div className="text-[11px] text-soft flex items-center gap-1 truncate">
                            <Building size={11} className="shrink-0 text-meta" />
                            <span className="truncate">{lead.company}</span>
                          </div>
                        )}

                        {lead.budgetRange && (
                          <div className="text-[10px] font-mono text-accent">
                            {lead.budgetRange}
                          </div>
                        )}

                        {/* Card Actions Footer */}
                        <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[10px] text-meta font-mono">
                          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                          <span className="group-hover:translate-x-0.5 transition-transform text-accent font-semibold">
                            Details &rarr;
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {viewMode === 'table' && (
        <div className="bg-card border border-line rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated border-b border-line text-meta font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Name / Contact</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Budget Range</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-elevated/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="py-3.5 px-4 font-medium text-ink">
                      <div>{lead.name}</div>
                      <div className="text-[10px] font-mono text-meta">{lead.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-soft">
                      {lead.company || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-elevated border border-line text-accent font-bold">
                        {lead.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-meta">
                      {lead.source}
                    </td>
                    <td className="py-3.5 px-4 text-soft">
                      {lead.budgetRange || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-meta font-mono">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-elevated hover:bg-card border border-line text-[11px] text-accent font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── LEAD DETAIL DRAWER / MODAL ── */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-base/80 backdrop-blur-sm"
            onClick={() => setSelectedLead(null)}
          />
          <div className="relative w-full max-w-xl bg-card border-l border-line h-full flex flex-col z-10 p-6 overflow-y-auto space-y-6 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-4 border-b border-line">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-1">
                  LEAD PROFILE
                </span>
                <h2 className="text-xl font-display font-bold text-ink">
                  {selectedLead.name}
                </h2>
                {selectedLead.company && (
                  <p className="text-xs text-soft flex items-center gap-1.5 mt-0.5">
                    <Building size={13} />
                    {selectedLead.company}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded-lg hover:bg-elevated text-meta hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Stage Selector Action Bar */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-meta block">
                Current Pipeline Stage
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STAGES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStageChange(selectedLead.id, st.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      selectedLead.stage === st.id
                        ? 'bg-accent text-canvas font-bold shadow-sm'
                        : 'bg-elevated text-soft hover:text-ink border border-line'
                    }`}
                  >
                    {st.label.replace(/^\d+\.\s*/, '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Client Conversion Banner (if WON) */}
            {selectedLead.stage === 'WON' && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Trophy size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 block">
                      Deal Won!
                    </span>
                    <span className="text-[11px] text-emerald-300/80">
                      {selectedLead.convertedClient
                        ? `Linked to Client Account: ${selectedLead.convertedClient.legalName}`
                        : 'Ready to convert into Client Directory'}
                    </span>
                  </div>
                </div>
                {!selectedLead.convertedClient && (
                  <button
                    type="button"
                    onClick={() => handleOpenConvertModal(selectedLead)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-canvas font-semibold text-xs hover:bg-emerald-400 cursor-pointer shadow-sm shrink-0"
                  >
                    1-Click Convert
                  </button>
                )}
              </div>
            )}

            {/* Lead Specifications Card */}
            <div className="bg-elevated rounded-xl p-4 border border-line space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-line/60">
                <div>
                  <span className="text-[10px] font-mono uppercase text-meta block">Email</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-accent hover:underline break-all">
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-meta block">Website</span>
                  {selectedLead.website ? (
                    <a
                      href={selectedLead.website.startsWith('http') ? selectedLead.website : `https://${selectedLead.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Visit Site</span>
                      <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span className="text-meta font-mono">None</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-line/60">
                <div>
                  <span className="text-[10px] font-mono uppercase text-meta block">Source</span>
                  <span className="font-mono text-ink font-semibold">{selectedLead.source}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-meta block">Budget Fit</span>
                  <span className="text-ink">{selectedLead.budgetRange || 'Not Specified'}</span>
                </div>
              </div>

              {selectedLead.serviceInterest.length > 0 && (
                <div className="pb-3 border-b border-line/60">
                  <span className="text-[10px] font-mono uppercase text-meta block mb-1.5">
                    Services Needed
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLead.serviceInterest.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-card border border-line text-accent">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attribution Telemetry */}
              {(selectedLead.utmSource || selectedLead.utmCampaign || selectedLead.referrer) && (
                <div className="p-2.5 rounded-lg bg-card/70 border border-line/60 text-[11px] font-mono space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-meta font-bold block mb-1">
                    Telemetry Attribution
                  </span>
                  {selectedLead.utmSource && (
                    <div>UTM Source: <span className="text-accent">{selectedLead.utmSource}</span></div>
                  )}
                  {selectedLead.utmCampaign && (
                    <div>UTM Campaign: <span className="text-ink">{selectedLead.utmCampaign}</span></div>
                  )}
                  {selectedLead.referrer && (
                    <div className="truncate">Referrer: <span className="text-meta">{selectedLead.referrer}</span></div>
                  )}
                </div>
              )}

              {/* Challenge / Bottleneck notes */}
              {selectedLead.bottleneckNotes && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-meta block mb-1">
                    Stated Challenge / Message
                  </span>
                  <p className="text-soft whitespace-pre-wrap leading-relaxed p-2.5 rounded bg-card/60 border border-line/60">
                    {selectedLead.bottleneckNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Activity Stream & Quick Note Logger */}
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  Activity Timeline ({selectedLead.activities.length})
                </span>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddActivity} className="space-y-2">
                <textarea
                  value={activityNote}
                  onChange={(e) => setActivityNote(e.target.value)}
                  placeholder="Log discovery notes, call outcome, proposal status..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-elevated border border-line text-ink text-xs placeholder:text-soft/60 focus:outline-none focus:border-accent resize-none"
                />
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as ActivityType)}
                    className="px-2.5 py-1.5 rounded-lg bg-elevated border border-line text-xs font-mono text-meta"
                  >
                    <option value="NOTE">Note</option>
                    <option value="CALL">Phone Call</option>
                    <option value="MEETING">Discovery Meeting</option>
                    <option value="EMAIL">Email Follow-up</option>
                  </select>
                  <button
                    type="submit"
                    disabled={!activityNote.trim() || isPending}
                    className="px-3.5 py-1.5 rounded-lg bg-accent text-canvas font-semibold text-xs hover:bg-accent-hi transition-colors cursor-pointer disabled:opacity-40"
                  >
                    Log Activity
                  </button>
                </div>
              </form>

              {/* Activities Feed */}
              <div className="space-y-2.5 pt-2">
                {selectedLead.activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-elevated/70 border border-line/60 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-meta font-mono">
                      <span className="font-semibold text-accent">{act.title}</span>
                      <span>{new Date(act.createdAt).toLocaleString()}</span>
                    </div>
                    {act.content && (
                      <p className="text-soft whitespace-pre-wrap leading-relaxed mt-1">
                        {act.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 1-CLICK CONVERT TO CLIENT MODAL ── */}
      {showConvertModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-base/80 backdrop-blur-sm" onClick={() => setShowConvertModal(false)} />
          <div className="relative w-full max-w-md bg-card border border-line rounded-2xl p-6 space-y-5 z-10 shadow-2xl">
            <div className="border-b border-line pb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 block mb-1">
                WIN DEAL & SPIN UP ACCOUNT
              </span>
              <h3 className="font-display font-bold text-lg text-ink">
                Convert to Client Account
              </h3>
            </div>

            <form onSubmit={handleConvertSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono uppercase text-meta mb-1">Legal Company Name *</label>
                <input
                  type="text"
                  required
                  value={convertLegalName}
                  onChange={(e) => setConvertLegalName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-meta mb-1">Industry</label>
                <input
                  type="text"
                  value={convertIndustry}
                  onChange={(e) => setConvertIndustry(e.target.value)}
                  placeholder="e.g. Healthcare, E-commerce, SaaS"
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-meta mb-1">GSTIN (India Tax ID - Optional)</label>
                <input
                  type="text"
                  value={convertGstin}
                  onChange={(e) => setConvertGstin(e.target.value)}
                  placeholder="e.g. 29AAAAA0000A1Z5"
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-meta mb-1">Initial SOW Value (INR)</label>
                <input
                  type="number"
                  value={convertValue}
                  onChange={(e) => setConvertValue(e.target.value)}
                  placeholder="e.g. 150000"
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                />
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-3 py-2 rounded-xl hover:bg-elevated text-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-canvas font-semibold hover:bg-emerald-400 cursor-pointer shadow-sm"
                >
                  Confirm & Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MANUAL ADD LEAD MODAL ── */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-base/80 backdrop-blur-sm" onClick={() => setShowAddLeadModal(false)} />
          <div className="relative w-full max-w-lg bg-card border border-line rounded-2xl p-6 space-y-5 z-10 shadow-2xl">
            <div className="border-b border-line pb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-1">
                MANUAL ENTRY
              </span>
              <h3 className="font-display font-bold text-lg text-ink">
                Add Inbound Lead
              </h3>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-meta mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-meta mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-meta mb-1">Company</label>
                  <input
                    type="text"
                    value={newLeadCompany}
                    onChange={(e) => setNewLeadCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-meta mb-1">Website</label>
                  <input
                    type="text"
                    value={newLeadWebsite}
                    onChange={(e) => setNewLeadWebsite(e.target.value)}
                    placeholder="https://"
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-meta mb-1">Budget Range</label>
                <select
                  value={newLeadBudget}
                  onChange={(e) => setNewLeadBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                >
                  <option value="">Select budget range...</option>
                  <option value="$2,000 – $5,000 / month">$2,000 – $5,000 / month</option>
                  <option value="$5,000 – $10,000 / month">$5,000 – $10,000 / month</option>
                  <option value="$10,000+ / month">$10,000+ / month</option>
                  <option value="Project Sprint">Project Sprint (Fixed Fee)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono uppercase text-meta mb-1">Core Challenge & Notes</label>
                <textarea
                  rows={3}
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  placeholder="Bottleneck or goals..."
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink resize-none"
                />
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-3 py-2 rounded-xl hover:bg-elevated text-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-accent text-canvas font-semibold hover:bg-accent-hi cursor-pointer shadow-sm"
                >
                  Save Lead to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
