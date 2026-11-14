'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  createTaskAction,
  updateTaskStatusAction,
  logTimeAction,
  toggleMilestoneApprovalAction,
  createMilestoneAction,
} from '@/app/(admin)/admin/actions-phase2';
import {
  ArrowLeft,
  Clock,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import type { TaskStatus, Priority } from '@prisma/client';

export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  estHours: number | null;
  actHours: number | null;
  assignee?: { name: string | null } | null;
}

export interface MilestoneItem {
  id: string;
  title: string;
  dueDate: string | null;
  approved: boolean;
  approvedAt: string | null;
}

export interface TimeLogItem {
  id: string;
  hours: number;
  notes: string | null;
  date: string;
  user: { name: string | null; email: string };
  task?: { title: string } | null;
}

const TASK_COLUMNS: Array<{ id: TaskStatus; label: string; color: string }> = [
  { id: 'TODO', label: 'To Do', color: 'border-zinc-700 bg-zinc-800/30 text-zinc-300' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-500/30 bg-blue-500/10 text-blue-400' },
  { id: 'REVIEW', label: 'Review & QA', color: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
  { id: 'BLOCKED', label: 'Blocked', color: 'border-red-500/30 bg-red-500/10 text-red-400' },
  { id: 'DONE', label: 'Completed', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
];

export function ProjectWorkspaceClient({
  project,
}: {
  project: {
    id: string;
    name: string;
    type: string;
    status: string;
    budgetHours: number | null;
    budgetAmount: number | null;
    client: { id: string; legalName: string; brandName: string | null };
    tasks: TaskItem[];
    milestones: MilestoneItem[];
    timeLogs: TimeLogItem[];
  };
}) {
  const [tasks, setTasks] = useState<TaskItem[]>(project.tasks);
  const [milestones, setMilestones] = useState<MilestoneItem[]>(project.milestones);
  const [activeTab, setActiveTab] = useState<'tasks' | 'milestones' | 'timelogs'>('tasks');
  const [isPending, startTransition] = useTransition();

  // Modals state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);

  // New task form fields
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('MEDIUM');
  const [taskEstHours, setTaskEstHours] = useState('');

  // Log time form fields
  const [logHours, setLogHours] = useState('');
  const [logTaskId, setLogTaskId] = useState('');
  const [logNotes, setLogNotes] = useState('');

  // New milestone form
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');

  // Calculate retainer hours stats
  const totalHoursLogged = project.timeLogs.reduce((acc, l) => acc + Number(l.hours), 0);
  const hasRetainer = project.budgetHours && project.budgetHours > 0;
  const burnPercent = hasRetainer
    ? Math.min(100, Math.round((totalHoursLogged / project.budgetHours!) * 100))
    : 0;
  const isOverBurn = hasRetainer && totalHoursLogged > project.budgetHours!;

  const handleTaskStatusChange = (taskId: string, nextStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
    startTransition(async () => {
      await updateTaskStatusAction(taskId, nextStatus);
    });
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    startTransition(async () => {
      const res = await createTaskAction({
        projectId: project.id,
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
        estHours: taskEstHours ? Number(taskEstHours) : undefined,
      });

      if (res?.success) {
        setShowTaskModal(false);
        window.location.reload();
      }
    });
  };

  const handleLogTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logHours || Number(logHours) <= 0) return;

    startTransition(async () => {
      const res = await logTimeAction({
        projectId: project.id,
        taskId: logTaskId || undefined,
        hours: Number(logHours),
        notes: logNotes,
      });

      if (res?.success) {
        setShowTimeModal(false);
        window.location.reload();
      }
    });
  };

  const handleToggleMilestone = (milestoneId: string, currentApproved: boolean) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId ? { ...m, approved: !currentApproved, approvedAt: !currentApproved ? new Date().toISOString() : null } : m
      )
    );
    startTransition(async () => {
      await toggleMilestoneApprovalAction(milestoneId, !currentApproved);
    });
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;

    startTransition(async () => {
      const res = await createMilestoneAction({
        projectId: project.id,
        title: milestoneTitle,
        dueDate: milestoneDate || undefined,
      });

      if (res?.success) {
        setShowMilestoneModal(false);
        window.location.reload();
      }
    });
  };

  return (
    <div className="p-4 sm:p-7 space-y-6 max-w-7xl">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-meta hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} />
          <span>All Engagements</span>
        </Link>
      </div>

      {/* Project Workspace Header */}
      <div className="bg-card border border-line rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-meta">
              {project.client.brandName || project.client.legalName}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-elevated border border-line text-accent font-bold">
              {project.type}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink">
            {project.name}
          </h1>
          <div className="text-xs text-soft font-mono flex items-center gap-3">
            <span>Status: <strong className="text-accent">{project.status}</strong></span>
            {project.budgetAmount && (
              <span>• Contract: <strong>₹{Number(project.budgetAmount).toLocaleString()}</strong></span>
            )}
          </div>
        </div>

        {/* Retainer Burn-down Meter Card */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="p-4 rounded-xl bg-elevated border border-line min-w-[200px] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-meta flex items-center gap-1">
                <Clock size={13} className="text-accent" /> Retainer Burn
              </span>
              <span className={isOverBurn ? 'text-red-400 font-bold' : 'text-ink font-semibold'}>
                {totalHoursLogged.toFixed(1)} {hasRetainer ? `/ ${project.budgetHours} hrs` : 'hrs'}
              </span>
            </div>
            {hasRetainer && (
              <div className="w-full h-2 rounded-full bg-card overflow-hidden">
                <div
                  className={`h-full ${isOverBurn ? 'bg-red-500' : burnPercent > 80 ? 'bg-amber-400' : 'bg-accent'}`}
                  style={{ width: `${burnPercent}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTimeModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-elevated hover:bg-card border border-line text-xs font-semibold text-accent transition-colors cursor-pointer"
            >
              Log Hours
            </button>
            <button
              type="button"
              onClick={() => setShowTaskModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-accent text-canvas font-semibold text-xs hover:bg-accent-hi transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-1 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'tasks'
              ? 'bg-elevated text-accent font-bold border-t border-x border-line'
              : 'text-soft hover:text-ink'
          }`}
        >
          Task Kanban ({tasks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'milestones'
              ? 'bg-elevated text-accent font-bold border-t border-x border-line'
              : 'text-soft hover:text-ink'
          }`}
        >
          Milestones & SOW ({milestones.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('timelogs')}
          className={`px-4 py-2 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'timelogs'
              ? 'bg-elevated text-accent font-bold border-t border-x border-line'
              : 'text-soft hover:text-ink'
          }`}
        >
          Time Logs ({project.timeLogs.length})
        </button>
      </div>

      {/* ── TAB 1: TASK KANBAN BOARD ── */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-6">
          {TASK_COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-card/70 border border-line rounded-2xl p-3.5 space-y-3 min-w-[240px] flex flex-col max-h-[calc(100vh-250px)]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-line px-1">
                  <span className="text-xs font-mono font-semibold text-ink">
                    {col.label}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-elevated border border-line text-meta font-bold">
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-[10px] text-meta font-mono">
                      No tasks
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-elevated border border-line hover:border-line-strong transition-all space-y-2.5 text-xs shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h4 className="font-semibold text-ink leading-snug">
                            {task.title}
                          </h4>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                              task.priority === 'URGENT'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : task.priority === 'HIGH'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-zinc-800 text-meta border border-line'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-soft line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Estimated vs Actual hours */}
                        <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[10px] text-meta font-mono">
                          <span>
                            {task.actHours ? `${task.actHours}h` : '0h'} / {task.estHours ? `${task.estHours}h` : '—'}
                          </span>
                          {/* Quick Status Shift Dropdown */}
                          <select
                            value={task.status}
                            disabled={isPending}
                            onChange={(e) => handleTaskStatusChange(task.id, e.target.value as TaskStatus)}
                            className="bg-card px-1.5 py-0.5 rounded border border-line text-[10px] text-accent"
                          >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="REVIEW">Review</option>
                            <option value="BLOCKED">Blocked</option>
                            <option value="DONE">Done</option>
                          </select>
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

      {/* ── TAB 2: MILESTONES ── */}
      {activeTab === 'milestones' && (
        <div className="bg-card border border-line rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="text-base font-display font-semibold text-ink">
                Deliverable Milestones
              </h3>
              <p className="text-xs text-meta font-mono">Client sign-off checkpoints</p>
            </div>
            <button
              type="button"
              onClick={() => setShowMilestoneModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-canvas font-semibold text-xs hover:bg-accent-hi"
            >
              <Plus size={13} />
              <span>Add Milestone</span>
            </button>
          </div>

          {milestones.length === 0 ? (
            <p className="text-xs text-soft font-mono py-8 text-center">
              No milestones created yet. Add deliverables for client approval.
            </p>
          ) : (
            <div className="divide-y divide-line">
              {milestones.map((m) => (
                <div key={m.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleToggleMilestone(m.id, m.approved)}
                      className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                        m.approved
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-elevated text-meta border-line hover:text-ink'
                      }`}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <div>
                      <span className={`text-xs font-semibold ${m.approved ? 'line-through text-soft' : 'text-ink'}`}>
                        {m.title}
                      </span>
                      {m.dueDate && (
                        <span className="text-[10px] font-mono text-meta block">
                          Target: {new Date(m.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      m.approved
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-elevated text-meta border border-line'
                    }`}
                  >
                    {m.approved ? 'Approved' : 'Pending Sign-off'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: TIME LOGS ── */}
      {activeTab === 'timelogs' && (
        <div className="bg-card border border-line rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="text-base font-display font-semibold text-ink">
                Hourly Delivery Logs
              </h3>
              <p className="text-xs text-meta font-mono">Retainer time tracking audit trail</p>
            </div>
            <button
              type="button"
              onClick={() => setShowTimeModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-canvas font-semibold text-xs hover:bg-accent-hi"
            >
              <Plus size={13} />
              <span>Log Hours</span>
            </button>
          </div>

          {project.timeLogs.length === 0 ? (
            <p className="text-xs text-soft font-mono py-8 text-center">
              No hours logged yet for this engagement.
            </p>
          ) : (
            <div className="divide-y divide-line">
              {project.timeLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-ink">{log.user.name || log.user.email}</span>
                    {log.task && (
                      <span className="text-[10px] font-mono text-accent block">
                        Task: {log.task.title}
                      </span>
                    )}
                    {log.notes && <p className="text-soft text-[11px] mt-0.5">{log.notes}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-accent text-sm">
                      {log.hours} hrs
                    </span>
                    <span className="text-[10px] font-mono text-meta block">
                      {new Date(log.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ADD TASK MODAL ── */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-base/80 backdrop-blur-sm" onClick={() => setShowTaskModal(false)} />
          <div className="relative w-full max-w-md bg-card border border-line rounded-2xl p-6 space-y-4 z-10 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-ink border-b border-line pb-2">
              Add Project Task
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono uppercase text-meta mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Set up Meta Conversion API & Pixel"
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-meta mb-1">Description / Spec</label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-meta mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono uppercase text-meta mb-1">Est. Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={taskEstHours}
                    onChange={(e) => setTaskEstHours(e.target.value)}
                    placeholder="4.0"
                    className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-line flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-3 py-1.5 rounded-xl hover:bg-elevated text-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 rounded-xl bg-accent text-canvas font-semibold hover:bg-accent-hi"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LOG TIME MODAL ── */}
      {showTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-base/80 backdrop-blur-sm" onClick={() => setShowTimeModal(false)} />
          <div className="relative w-full max-w-md bg-card border border-line rounded-2xl p-6 space-y-4 z-10 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-ink border-b border-line pb-2">
              Log Retainer Hours
            </h3>
            <form onSubmit={handleLogTime} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono uppercase text-meta mb-1">Hours Spent *</label>
                <input
                  type="number"
                  step="0.25"
                  required
                  value={logHours}
                  onChange={(e) => setLogHours(e.target.value)}
                  placeholder="e.g. 2.5"
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-meta mb-1">Linked Task (Optional)</label>
                <select
                  value={logTaskId}
                  onChange={(e) => setLogTaskId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                >
                  <option value="">General Project Time</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono uppercase text-meta mb-1">Work Done / Notes</label>
                <textarea
                  rows={2}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="What was completed during this time..."
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink resize-none"
                />
              </div>

              <div className="pt-3 border-t border-line flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTimeModal(false)}
                  className="px-3 py-1.5 rounded-xl hover:bg-elevated text-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 rounded-xl bg-accent text-canvas font-semibold hover:bg-accent-hi"
                >
                  Save Time Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD MILESTONE MODAL ── */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-base/80 backdrop-blur-sm" onClick={() => setShowMilestoneModal(false)} />
          <div className="relative w-full max-w-md bg-card border border-line rounded-2xl p-6 space-y-4 z-10 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-ink border-b border-line pb-2">
              Add Deliverable Milestone
            </h3>
            <form onSubmit={handleCreateMilestone} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono uppercase text-meta mb-1">Milestone Name *</label>
                <input
                  type="text"
                  required
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  placeholder="e.g. Month 1 Technical SEO Audit Delivery"
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-meta mb-1">Target Date</label>
                <input
                  type="date"
                  value={milestoneDate}
                  onChange={(e) => setMilestoneDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-elevated border border-line text-ink font-mono"
                />
              </div>

              <div className="pt-3 border-t border-line flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMilestoneModal(false)}
                  className="px-3 py-1.5 rounded-xl hover:bg-elevated text-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 rounded-xl bg-accent text-canvas font-semibold hover:bg-accent-hi"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
