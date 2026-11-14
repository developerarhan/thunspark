'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { createProjectAction } from '@/app/(admin)/admin/actions-phase2';
import {
  Briefcase,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import type { ProjectType } from '@prisma/client';

export interface ProjectCardItem {
  id: string;
  name: string;
  type: ProjectType;
  status: string;
  budgetAmount: number | null;
  budgetHours: number | null;
  totalHoursLogged: number;
  tasksTotal: number;
  tasksDone: number;
  client: { id: string; legalName: string; brandName: string | null };
  createdAt: string;
}

export function ProjectsListClient({
  initialProjects,
  clients,
}: {
  initialProjects: ProjectCardItem[];
  clients: Array<{ id: string; legalName: string; brandName: string | null }>;
}) {
  const [projects] = useState<ProjectCardItem[]>(initialProjects);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form fields
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [name, setName] = useState('');
  const [type, setType] = useState<ProjectType>('RETAINER');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetHours, setBudgetHours] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !name.trim()) return;

    startTransition(async () => {
      const res = await createProjectAction({
        clientId,
        name,
        type,
        budgetAmount: budgetAmount ? Number(budgetAmount) : undefined,
        budgetHours: budgetHours ? Number(budgetHours) : undefined,
      });

      if (res?.success) {
        setShowModal(false);
        window.location.reload();
      }
    });
  };

  return (
    <div className="p-4 sm:p-7 space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-1">
            DELIVERY & EXECUTION
          </span>
          <h1 className="text-2xl font-display font-bold text-ink flex items-center gap-2">
            Projects & Retainers
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-elevated border border-line text-meta font-normal">
              {projects.length} Engagements
            </span>
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent text-canvas font-semibold text-xs hover:bg-accent-hi transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Engagement</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-card border border-line rounded-2xl p-12 text-center space-y-3">
          <Briefcase size={36} className="text-meta mx-auto" />
          <h3 className="text-base font-display font-semibold text-ink">
            No Active Projects or Retainers Yet
          </h3>
          <p className="text-xs text-soft max-w-md mx-auto">
            Create an engagement manually or convert a won inbound lead to automatically spin up a growth project.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-canvas font-semibold text-xs hover:bg-accent-hi"
            >
              <Plus size={14} />
              <span>Create First Project</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const hasHoursBudget = proj.budgetHours && proj.budgetHours > 0;
            const burnPercent = hasHoursBudget
              ? Math.min(100, Math.round((proj.totalHoursLogged / proj.budgetHours!) * 100))
              : 0;
            const isOverBurn = hasHoursBudget && proj.totalHoursLogged > proj.budgetHours!;

            return (
              <Link
                key={proj.id}
                href={`/admin/projects/${proj.id}`}
                className="bg-card hover:bg-elevated/40 border border-line hover:border-line-strong rounded-2xl p-5 space-y-4 transition-all group shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-meta block truncate">
                        {proj.client.brandName || proj.client.legalName}
                      </span>
                      <h2 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors truncate">
                        {proj.name}
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated border border-line text-accent font-bold shrink-0">
                      {proj.type}
                    </span>
                  </div>

                  {/* Retainer Burn-down Meter */}
                  {hasHoursBudget ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-meta flex items-center gap-1">
                          <Clock size={12} className={isOverBurn ? 'text-red-400' : 'text-accent'} />
                          Hours Logged:
                        </span>
                        <span className={isOverBurn ? 'text-red-400 font-bold' : 'text-ink font-semibold'}>
                          {proj.totalHoursLogged} / {proj.budgetHours} hrs
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-elevated overflow-hidden">
                        <div
                          className={`h-full ${isOverBurn ? 'bg-red-500' : burnPercent > 80 ? 'bg-amber-400' : 'bg-accent'}`}
                          style={{ width: `${burnPercent}%` }}
                        />
                      </div>
                      {isOverBurn && (
                        <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                          <AlertTriangle size={11} /> Over monthly retainer allocation
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-meta font-mono flex items-center gap-1.5 pt-1">
                      <Clock size={12} className="text-accent" />
                      <span>{proj.totalHoursLogged} total hours logged</span>
                    </div>
                  )}

                  {/* Tasks Progression */}
                  <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs text-soft font-mono">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>Tasks: {proj.tasksDone} / {proj.tasksTotal}</span>
                    </span>
                    {proj.budgetAmount && (
                      <span className="text-ink font-semibold">
                        ₹{Number(proj.budgetAmount).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs font-mono text-meta">
                  <span>Status: {proj.status}</span>
                  <span className="text-accent group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                    <span>Task Board</span>
                    <ChevronRight size={13} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── CREATE ENGAGEMENT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-base/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-card border border-line rounded-2xl p-6 space-y-4 z-10 shadow-2xl">
            <div className="border-b border-line pb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-accent block mb-1">
                DELIVERY SETUP
              </span>
              <h3 className="font-display font-bold text-lg text-ink">
                New Project / Retainer
              </h3>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono uppercase text-meta mb-1">Client Account *</label>
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
              </div>

              <div>
                <label className="block font-mono uppercase text-meta mb-1">Engagement Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q4 Performance Marketing & SEO Retainer"
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-meta mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ProjectType)}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                  >
                    <option value="RETAINER">Retainer</option>
                    <option value="PROJECT">Project Sprint</option>
                    <option value="AUDIT">Diagnostic Audit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono uppercase text-meta mb-1">Retainer Hours Budget</label>
                  <input
                    type="number"
                    value={budgetHours}
                    onChange={(e) => setBudgetHours(e.target.value)}
                    placeholder="e.g. 40"
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-meta mb-1">Budget Value (INR)</label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  placeholder="e.g. 150000"
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                />
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded-xl hover:bg-elevated text-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-accent text-canvas font-semibold hover:bg-accent-hi cursor-pointer shadow-sm"
                >
                  Create Engagement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
