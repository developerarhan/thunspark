'use client';

import React, { useState, useTransition } from 'react';
import {
  Shield,
  Users,
  Building,
  History,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Search,
  KeyRound,
  Save,
} from 'lucide-react';
import {
  createTeamMemberAction,
  updateUserRoleAction,
  deleteTeamMemberAction,
  updateAgencySettingsAction,
} from '@/app/(admin)/admin/actions-phase4';
import type { UserRole } from '@prisma/client';

export interface SerializedUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface SerializedAgencySetting {
  id: string;
  legalName: string;
  tradeName: string;
  gstin: string;
  pan: string;
  stateCode: string;
  stateName: string;
  registeredAddr: string;
  billingEmail: string;
  contactPhone: string;
  websiteUrl: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  defaultTaxRate: number;
  sacCode: string;
}

export interface SerializedAuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  before: any;
  after: any;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

interface SettingsClientProps {
  currentUserId: string;
  currentUserRole?: UserRole;
  teamMembers: SerializedUser[];
  agencySetting: SerializedAgencySetting;
  auditLogs: SerializedAuditLog[];
}

const ROLE_CONFIGS: Record<UserRole, { label: string; color: string; desc: string }> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    desc: 'Unrestricted system root access, billing, and team management.',
  },
  AGENCY_OWNER: {
    label: 'Agency Owner',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    desc: 'Full executive visibility over pipeline, revenue, and clients.',
  },
  ACCOUNT_MANAGER: {
    label: 'Account Manager',
    color: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    desc: 'Client relations, project deliveries, and retainer hours burndown.',
  },
  GROWTH_STRATEGIST: {
    label: 'Growth Strategist',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    desc: 'Inbound lead qualification, discovery audits, and conversions.',
  },
  MEDIA_BUYER: {
    label: 'Media Buyer',
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    desc: 'Google Ads, Meta Marketing campaigns, CPA & ROAS tracking.',
  },
  CONTENT_SEO: {
    label: 'Content & SEO',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    desc: 'Organic search, content deliverables, and creative assets.',
  },
  FINANCE_ADMIN: {
    label: 'Finance Admin',
    color: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    desc: 'GST invoices, SAC code billing, bank UTR payment reconciliations.',
  },
  CLIENT_PORTAL: {
    label: 'Client Portal',
    color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    desc: 'External client view for project milestones and approved invoices.',
  },
  READ_ONLY_AUDITOR: {
    label: 'Auditor',
    color: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    desc: 'Read-only access for compliance, accounts, and audits.',
  },
};

export default function SettingsClient({
  currentUserId,
  currentUserRole,
  teamMembers,
  agencySetting,
  auditLogs,
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<'TEAM' | 'AGENCY' | 'AUDIT'>('TEAM');
  const [searchMember, setSearchMember] = useState('');
  const [isPending, startTransition] = useTransition();

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('GROWTH_STRATEGIST');

  // Agency Profile Form State
  const [agencyForm, setAgencyForm] = useState(agencySetting);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Change Role Modal State
  const [roleModalUser, setRoleModalUser] = useState<SerializedUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('GROWTH_STRATEGIST');

  const canManageTeam =
    currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'AGENCY_OWNER';

  // Handle Add Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createTeamMemberAction({
          name: newMemberName,
          email: newMemberEmail,
          password: newMemberPassword,
          role: newMemberRole,
        });
        setIsAddModalOpen(false);
        setNewMemberName('');
        setNewMemberEmail('');
        setNewMemberPassword('');
      } catch (err: any) {
        alert(err.message || 'Failed to add team member');
      }
    });
  };

  // Handle Update Role
  const handleUpdateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModalUser) return;
    startTransition(async () => {
      try {
        await updateUserRoleAction({
          userId: roleModalUser.id,
          role: selectedRole,
        });
        setRoleModalUser(null);
      } catch (err: any) {
        alert(err.message || 'Failed to update role');
      }
    });
  };

  // Handle Delete Member
  const handleDeleteMember = (user: SerializedUser) => {
    if (!confirm(`Are you sure you want to remove ${user.name || user.email} from the agency?`)) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteTeamMemberAction(user.id);
      } catch (err: any) {
        alert(err.message || 'Failed to delete member');
      }
    });
  };

  // Handle Save Agency Settings
  const handleSaveAgencySettings = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateAgencySettingsAction(agencyForm);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err: any) {
        alert(err.message || 'Failed to save agency settings');
      }
    });
  };

  const filteredMembers = teamMembers.filter(
    (m) =>
      (m.name && m.name.toLowerCase().includes(searchMember.toLowerCase())) ||
      m.email.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.role.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── TABS NAVIGATION BAR ───────────────────────────── */}
      <div className="flex border-b border-zinc-800 gap-6">
        <button
          onClick={() => setActiveTab('TEAM')}
          className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'TEAM'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Team & RBAC Permissions ({teamMembers.length})
        </button>

        <button
          onClick={() => setActiveTab('AGENCY')}
          className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'AGENCY'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Building className="w-4 h-4" />
          Agency Profile & Tax Settings
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'AUDIT'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <History className="w-4 h-4" />
          Security Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* ── TAB 1: TEAM & RBAC PERMISSIONS ────────────────── */}
      {activeTab === 'TEAM' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, email, or role..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {canManageTeam && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition shadow-lg shadow-orange-950/40"
              >
                <Plus className="w-4 h-4" />
                Add Team Member
              </button>
            )}
          </div>

          {/* Members Table */}
          <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/80 border-b border-zinc-800/80 text-zinc-400 font-medium">
                  <tr>
                    <th className="py-3.5 px-4">Member</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">RBAC Role</th>
                    <th className="py-3.5 px-4">Permissions Scope</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    {canManageTeam && <th className="py-3.5 px-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                  {filteredMembers.map((member) => {
                    const cfg = ROLE_CONFIGS[member.role] || {
                      label: member.role,
                      color: 'bg-zinc-800 text-zinc-400',
                      desc: '',
                    };
                    const initials = (member.name || member.email)
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr key={member.id} className="hover:bg-zinc-800/30 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-600/20 border border-orange-500/30 text-orange-400 font-bold flex items-center justify-center text-xs">
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-100">
                                {member.name || 'Unnamed Staff'}
                              </div>
                              {member.id === currentUserId && (
                                <span className="text-[10px] text-orange-400 font-mono">
                                  (You)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-400">{member.email}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.color}`}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400 text-[11px] max-w-xs">
                          {cfg.desc}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-500">
                          {new Date(member.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        {canManageTeam && (
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setRoleModalUser(member);
                                setSelectedRole(member.role);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition"
                            >
                              Edit Role
                            </button>
                            {member.id !== currentUserId && (
                              <button
                                onClick={() => handleDeleteMember(member)}
                                className="p-1 text-zinc-500 hover:text-rose-400 rounded transition"
                                title="Remove team member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: AGENCY PROFILE & TAX SETTINGS ──────────── */}
      {activeTab === 'AGENCY' && (
        <form onSubmit={handleSaveAgencySettings} className="space-y-6 max-w-4xl">
          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Agency settings and Indian GST Tax Profile successfully updated.
            </div>
          )}

          {/* Legal Entity & Registration */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-orange-400" />
              Corporate Identity & Indian GST Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Legal Entity Registered Name *
                </label>
                <input
                  type="text"
                  value={agencyForm.legalName}
                  onChange={(e) => setAgencyForm({ ...agencyForm, legalName: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Brand / Trade Name *
                </label>
                <input
                  type="text"
                  value={agencyForm.tradeName}
                  onChange={(e) => setAgencyForm({ ...agencyForm, tradeName: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Agency GSTIN *
                </label>
                <input
                  type="text"
                  value={agencyForm.gstin}
                  onChange={(e) => setAgencyForm({ ...agencyForm, gstin: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Corporate PAN *
                </label>
                <input
                  type="text"
                  value={agencyForm.pan}
                  onChange={(e) => setAgencyForm({ ...agencyForm, pan: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  GST State Code & State *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="06"
                    value={agencyForm.stateCode}
                    onChange={(e) => setAgencyForm({ ...agencyForm, stateCode: e.target.value })}
                    required
                    className="col-span-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 text-center font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Haryana"
                    value={agencyForm.stateName}
                    onChange={(e) => setAgencyForm({ ...agencyForm, stateName: e.target.value })}
                    required
                    className="col-span-2 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Default SAC Code & GST Rate
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={agencyForm.sacCode}
                    onChange={(e) => setAgencyForm({ ...agencyForm, sacCode: e.target.value })}
                    required
                    className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono text-center"
                    placeholder="998311"
                  />
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={agencyForm.defaultTaxRate}
                      onChange={(e) =>
                        setAgencyForm({
                          ...agencyForm,
                          defaultTaxRate: parseFloat(e.target.value) || 18,
                        })
                      }
                      required
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono"
                    />
                    <span className="absolute right-3 top-2 text-xs text-zinc-500">%</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Registered Office Address (Printed on Tax Invoices) *
                </label>
                <textarea
                  rows={2}
                  value={agencyForm.registeredAddr}
                  onChange={(e) =>
                    setAgencyForm({ ...agencyForm, registeredAddr: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Billing & Accounts Email *
                </label>
                <input
                  type="email"
                  value={agencyForm.billingEmail}
                  onChange={(e) => setAgencyForm({ ...agencyForm, billingEmail: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Accounts Phone / Support
                </label>
                <input
                  type="text"
                  value={agencyForm.contactPhone}
                  onChange={(e) => setAgencyForm({ ...agencyForm, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
                />
              </div>
            </div>
          </div>

          {/* Bank Remittance Details */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              Remittance Bank Details (NEFT / RTGS / UPI)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={agencyForm.bankName}
                  onChange={(e) => setAgencyForm({ ...agencyForm, bankName: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Account Beneficiary Name *
                </label>
                <input
                  type="text"
                  value={agencyForm.accountHolder}
                  onChange={(e) => setAgencyForm({ ...agencyForm, accountHolder: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={agencyForm.accountNumber}
                  onChange={(e) => setAgencyForm({ ...agencyForm, accountNumber: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  value={agencyForm.ifscCode}
                  onChange={(e) => setAgencyForm({ ...agencyForm, ifscCode: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  UPI VPA ID (Virtual Payment Address)
                </label>
                <input
                  type="text"
                  value={agencyForm.upiId}
                  onChange={(e) => setAgencyForm({ ...agencyForm, upiId: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-medium text-xs transition shadow-lg shadow-orange-950/40"
            >
              <Save className="w-4 h-4" />
              {isPending ? 'Saving...' : 'Update Agency Profile'}
            </button>
          </div>
        </form>
      )}

      {/* ── TAB 3: SECURITY AUDIT LOGS ───────────────────── */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/80 border-b border-zinc-800/80 text-zinc-400 font-medium">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Operator</th>
                    <th className="py-3.5 px-4">Action Event</th>
                    <th className="py-3.5 px-4">Target Entity</th>
                    <th className="py-3.5 px-4">Event Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-zinc-300 font-mono text-[11px]">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-500 font-sans">
                        <History className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                        No security audit logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-800/30 transition">
                        <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-zinc-200 font-sans">
                            {log.user?.name || log.user?.email || 'System'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-orange-400 border border-zinc-700/60 font-semibold text-[10px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400">
                          {log.entity} ({log.entityId.slice(0, 8)}...)
                        </td>
                        <td className="py-3.5 px-4 text-zinc-500 max-w-sm truncate">
                          {JSON.stringify(log.after || log.before || {})}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD MEMBER MODAL ─────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Add Agency Staff Member</h3>
                  <p className="text-xs text-zinc-400">Assign role and initial credentials</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Work Email *
                </label>
                <input
                  type="email"
                  placeholder="priya@thunspark.agency"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Initial Password *
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={newMemberPassword}
                  onChange={(e) => setNewMemberPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  RBAC Role *
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                >
                  {Object.entries(ROLE_CONFIGS).map(([roleKey, cfg]) => (
                    <option key={roleKey} value={roleKey}>
                      {cfg.label} - {cfg.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-medium text-xs transition"
                >
                  {isPending ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT ROLE MODAL ──────────────────────────────── */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Modify Member Role</h3>
                  <p className="text-xs text-zinc-400">{roleModalUser.name || roleModalUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setRoleModalUser(null)}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Assigned RBAC Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none"
                >
                  {Object.entries(ROLE_CONFIGS).map(([roleKey, cfg]) => (
                    <option key={roleKey} value={roleKey}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-400 mt-2 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  {ROLE_CONFIGS[selectedRole]?.desc}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-medium text-xs transition"
                >
                  {isPending ? 'Updating...' : 'Save Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
