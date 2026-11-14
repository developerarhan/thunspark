'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  X,
  Trash2,
  CreditCard,
  TrendingDown,
  ArrowRight,
} from 'lucide-react';
import { createInvoiceAction, updateInvoiceStatusAction, logExpenseAction, type InvoiceLineItem } from '@/app/(admin)/admin/actions-phase3';
import type { InvoiceStatus, ExpenseCategory } from '@prisma/client';

export interface SerializedInvoice {
  id: string;
  number: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  isIgst: boolean;
  paidAt: string | null;
  paymentMethod: string | null;
  paymentReference: string | null;
  notes: string | null;
  client: {
    id: string;
    legalName: string;
    brandName: string | null;
    gstin: string | null;
  };
  project?: {
    id: string;
    name: string;
  } | null;
  lineItems: InvoiceLineItem[];
}

export interface SerializedExpense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date: string;
  isBillable: boolean;
  notes: string | null;
  client?: {
    id: string;
    legalName: string;
  } | null;
}

interface InvoicesClientProps {
  initialInvoices: SerializedInvoice[];
  initialExpenses: SerializedExpense[];
  clients: Array<{
    id: string;
    legalName: string;
    brandName: string | null;
    gstin: string | null;
    projects: Array<{ id: string; name: string }>;
  }>;
}

export default function InvoicesClient({
  initialInvoices,
  initialExpenses,
  clients,
}: InvoicesClientProps) {
  const [activeTab, setActiveTab] = useState<'INVOICES' | 'EXPENSES'>('INVOICES');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InvoiceStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  // Create Invoice Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [isIgst, setIsIgst] = useState(false);
  const [notes, setNotes] = useState('Payment terms: Net 15 days. GST SAC Code 998311 (Digital Marketing & IT Consulting).');
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    {
      id: '1',
      description: 'Monthly Performance Marketing & Growth Retainer',
      sacCode: '998311',
      quantity: 1,
      rate: 75000,
      amount: 75000,
    },
  ]);

  // Log Expense Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('OPERATIONS');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expenseClientId, setExpenseClientId] = useState('');
  const [expenseBillable, setExpenseBillable] = useState(false);
  const [expenseNotes, setExpenseNotes] = useState('');

  // Quick Payment Recording Modal State
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<SerializedInvoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('NEFT_RTGS');
  const [paymentReference, setPaymentReference] = useState('');

  // Financial Metrics
  const totalReceivables = initialInvoices
    .filter((inv) => inv.status === 'SENT' || inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalCollected = initialInvoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.total, 0);

  const overdueCount = initialInvoices.filter((inv) => inv.status === 'OVERDUE').length;
  const overdueAmount = initialInvoices
    .filter((inv) => inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalExpenses = initialExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Line item helpers
  const handleItemChange = (index: number, field: keyof InvoiceLineItem, value: any) => {
    const updated = [...lineItems];
    const item = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'rate') {
      const q = field === 'quantity' ? Number(value) : Number(item.quantity);
      const r = field === 'rate' ? Number(value) : Number(item.rate);
      item.amount = Math.round(q * r * 100) / 100;
    }
    updated[index] = item;
    setLineItems(updated);
  };

  const handleAddItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: String(Date.now()),
        description: '',
        sacCode: '998311',
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const subtotal = lineItems.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
  const taxAmount = Math.round(subtotal * 0.18 * 100) / 100;
  const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

  // Selected client's projects
  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const clientProjects = selectedClient?.projects || [];

  // Submit invoice creation
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;

    startTransition(async () => {
      try {
        await createInvoiceAction({
          clientId: selectedClientId,
          projectId: selectedProjectId || undefined,
          issueDate,
          dueDate,
          currency: 'INR',
          taxRate: 18.0,
          isIgst,
          notes,
          lineItems,
        });
        setIsCreateModalOpen(false);
      } catch (err: any) {
        alert(err.message || 'Failed to create invoice');
      }
    });
  };

  // Submit expense logging
  const handleLogExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;

    startTransition(async () => {
      try {
        await logExpenseAction({
          title: expenseTitle,
          category: expenseCategory,
          amount: parseFloat(expenseAmount),
          currency: 'INR',
          date: expenseDate,
          clientId: expenseClientId || undefined,
          isBillable: expenseBillable,
          notes: expenseNotes,
        });
        setIsExpenseModalOpen(false);
        setExpenseTitle('');
        setExpenseAmount('');
      } catch (err: any) {
        alert(err.message || 'Failed to log expense');
      }
    });
  };

  // Submit payment status
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice) return;

    startTransition(async () => {
      try {
        await updateInvoiceStatusAction({
          invoiceId: paymentModalInvoice.id,
          status: 'PAID',
          paymentMethod,
          paymentReference,
        });
        setPaymentModalInvoice(null);
        setPaymentReference('');
      } catch (err: any) {
        alert(err.message || 'Failed to record payment');
      }
    });
  };

  // Filtered invoices
  const filteredInvoices = initialInvoices.filter((inv) => {
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    const matchesSearch =
      inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.client.brandName && inv.client.brandName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            PAID
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Clock className="w-3.5 h-3.5" />
            SENT (DUE)
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            OVERDUE
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
            <XCircle className="w-3.5 h-3.5" />
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileText className="w-3.5 h-3.5" />
            DRAFT
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* ── TOP KPI CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Outstanding Receivables */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Receivables (Unpaid)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-zinc-100">
            ₹{totalReceivables.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            {initialInvoices.filter((i) => i.status === 'SENT').length} pending invoices
          </div>
        </div>

        {/* Collected Revenue */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Collected</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-emerald-400">
            ₹{totalCollected.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            {initialInvoices.filter((i) => i.status === 'PAID').length} paid invoices
          </div>
        </div>

        {/* Overdue Invoices */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Overdue Invoices</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-rose-400">
            ₹{overdueAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="mt-1 text-xs text-rose-500/80 font-medium">
            {overdueCount} {overdueCount === 1 ? 'invoice requires' : 'invoices require'} follow-up
          </div>
        </div>

        {/* Agency Expenses */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Tracked Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold tracking-tight text-zinc-100">
            ₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            {initialExpenses.length} operations & ad spend logs
          </div>
        </div>
      </div>

      {/* ── SECTION HEADER & TABS ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-zinc-900 border border-zinc-800 p-1">
            <button
              onClick={() => setActiveTab('INVOICES')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'INVOICES'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tax Invoices ({initialInvoices.length})
            </button>
            <button
              onClick={() => setActiveTab('EXPENSES')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'EXPENSES'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Expenses ({initialExpenses.length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'INVOICES' ? (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition shadow-lg shadow-orange-950/40"
            >
              <Plus className="w-4 h-4" />
              Generate GST Invoice
            </button>
          ) : (
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium text-xs transition border border-zinc-700"
            >
              <Plus className="w-4 h-4" />
              Log Expense
            </button>
          )}
        </div>
      </div>

      {/* ── INVOICES TAB CONTENT ──────────────────────────── */}
      {activeTab === 'INVOICES' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search invoice number, client legal name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              {(['ALL', 'DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    statusFilter === st
                      ? 'bg-orange-600 text-white font-semibold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Invoices Table */}
          <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/80 border-b border-zinc-800/80 text-zinc-400 font-medium">
                  <tr>
                    <th className="py-3.5 px-4">Invoice #</th>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Issue / Due Date</th>
                    <th className="py-3.5 px-4">Tax Structure</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-zinc-500">
                        <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                        No invoices match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-zinc-800/30 transition group">
                        <td className="py-3.5 px-4 font-mono font-semibold text-zinc-100">
                          <Link
                            href={`/admin/invoices/${inv.id}`}
                            className="text-orange-400 hover:text-orange-300 transition flex items-center gap-1.5"
                          >
                            {inv.number}
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-zinc-200">{inv.client.legalName}</div>
                          {inv.client.brandName && (
                            <div className="text-zinc-500 text-[11px]">{inv.client.brandName}</div>
                          )}
                          {inv.client.gstin && (
                            <div className="text-[10px] text-zinc-500 font-mono">
                              GSTIN: {inv.client.gstin}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400">
                          <div>Issued: {new Date(inv.issueDate).toLocaleDateString('en-IN')}</div>
                          <div
                            className={
                              inv.status === 'OVERDUE'
                                ? 'text-rose-400 font-medium'
                                : 'text-zinc-500'
                            }
                          >
                            Due: {new Date(inv.dueDate).toLocaleDateString('en-IN')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-zinc-800 text-zinc-300 font-mono">
                            {inv.isIgst ? 'IGST 18%' : 'CGST 9% + SGST 9%'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-zinc-100 text-sm">
                            ₹{inv.total.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            Base: ₹{inv.subtotal.toLocaleString('en-IN')} + GST ₹
                            {inv.taxAmount.toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">{getStatusBadge(inv.status)}</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <Link
                            href={`/admin/invoices/${inv.id}`}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition"
                          >
                            View & Print
                          </Link>
                          {inv.status !== 'PAID' && (
                            <button
                              onClick={() => {
                                setPaymentModalInvoice(inv);
                              }}
                              className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-medium transition"
                            >
                              Record Payment
                            </button>
                          )}
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

      {/* ── EXPENSES TAB CONTENT ──────────────────────────── */}
      {activeTab === 'EXPENSES' && (
        <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 border-b border-zinc-800/80 text-zinc-400 font-medium">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Expense Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Client / Account</th>
                  <th className="py-3.5 px-4">Billable</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                {initialExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
                      No expenses logged yet.
                    </td>
                  </tr>
                ) : (
                  initialExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-zinc-800/30 transition">
                      <td className="py-3.5 px-4 font-mono text-zinc-400">
                        {new Date(exp.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-zinc-200">{exp.title}</div>
                        {exp.notes && (
                          <div className="text-[11px] text-zinc-500 mt-0.5">{exp.notes}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-zinc-800 text-zinc-300">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {exp.client ? exp.client.legalName : 'Internal Agency'}
                      </td>
                      <td className="py-3.5 px-4">
                        {exp.isBillable ? (
                          <span className="text-emerald-400 font-semibold text-[11px]">Billable</span>
                        ) : (
                          <span className="text-zinc-500 text-[11px]">Non-billable</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-zinc-100">
                        ₹{exp.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CREATE INVOICE MODAL ──────────────────────────── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-100">
                    Generate Indian GST Tax Invoice
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Compliant with SAC 998311 for Digital Marketing & Tech Consulting
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-6">
              {/* Client & Project Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Client Legal Entity *
                  </label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => {
                      setSelectedClientId(e.target.value);
                      setSelectedProjectId('');
                    }}
                    required
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.legalName} {c.brandName ? `(${c.brandName})` : ''}{' '}
                        {c.gstin ? `[GSTIN: ${c.gstin}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Associated Project / Retainer (Optional)
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="">-- No Project (Ad-hoc Billing) --</option>
                    {clientProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates & GST Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Invoice Issue Date *
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    GST Tax Structure
                  </label>
                  <select
                    value={isIgst ? 'IGST' : 'CGST_SGST'}
                    onChange={(e) => setIsIgst(e.target.value === 'IGST')}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                  >
                    <option value="CGST_SGST">Intra-State: CGST (9%) + SGST (9%)</option>
                    <option value="IGST">Inter-State: IGST (18%)</option>
                  </select>
                </div>
              </div>

              {/* Line Items Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                    Itemized Deliverables & SAC Codes
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Line Item
                  </button>
                </div>

                <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
                  <div className="grid grid-cols-12 bg-zinc-950 px-3 py-2 text-[11px] font-medium text-zinc-400">
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2">SAC Code</div>
                    <div className="col-span-1 text-center">Qty</div>
                    <div className="col-span-2 text-right">Rate (₹)</div>
                    <div className="col-span-2 text-right">Amount (₹)</div>
                  </div>

                  {lineItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 px-3 py-2.5 items-center bg-zinc-900/50"
                    >
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="e.g. Monthly SEO Retainer"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          required
                          className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={item.sacCode || '998311'}
                          onChange={(e) => handleItemChange(idx, 'sacCode', e.target.value)}
                          className="w-full px-2 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 font-mono text-center focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="col-span-1">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-full px-2 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 text-center focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="100"
                          min="0"
                          value={item.rate}
                          onChange={(e) =>
                            handleItemChange(idx, 'rate', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 text-right focus:outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <span className="font-mono text-xs font-semibold text-zinc-100">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </span>
                        {lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-zinc-500 hover:text-rose-400 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Invoice Notes & Terms
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none"
                  />
                </div>

                <div className="w-full sm:w-64 space-y-1.5 text-xs text-right">
                  <div className="flex justify-between text-zinc-400">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>{isIgst ? 'IGST @ 18%:' : 'CGST (9%) + SGST (9%):'}</span>
                    <span className="font-mono">₹{taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-orange-400 pt-2 border-t border-zinc-800">
                    <span>Total (INR):</span>
                    <span className="font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-medium text-xs transition shadow-lg shadow-orange-950/40"
                >
                  {isPending ? 'Generating...' : 'Create Tax Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RECORD PAYMENT MODAL ──────────────────────────── */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Record Invoice Payment</h3>
                  <p className="text-xs text-zinc-400">{paymentModalInvoice.number}</p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-xs text-zinc-400">Client: {paymentModalInvoice.client.legalName}</div>
              <div className="text-base font-bold text-emerald-400">
                Amount: ₹{paymentModalInvoice.total.toLocaleString('en-IN')}
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="NEFT_RTGS">Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="UPI">UPI / QR Code</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="STRIPE">Stripe / Credit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Transaction Reference / UTR Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR4928192837 or UPI Ref ID"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs transition"
                >
                  {isPending ? 'Saving...' : 'Mark as Paid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LOG EXPENSE MODAL ─────────────────────────────── */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Log Agency Expense</h3>
                  <p className="text-xs text-zinc-400">Track operations, ad spends & contractors</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Expense Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google Ads Media Spend or Figma Seats"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none"
                  >
                    <option value="AD_SPEND">Ad Spend</option>
                    <option value="SOFTWARE">Software & SaaS</option>
                    <option value="CONTRACTOR">Contractor / Freelancer</option>
                    <option value="OPERATIONS">Operations</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="25000"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">Client Tag</label>
                  <select
                    value={expenseClientId}
                    onChange={(e) => setExpenseClientId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200"
                  >
                    <option value="">Internal Agency</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.legalName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="billableCheck"
                  checked={expenseBillable}
                  onChange={(e) => setExpenseBillable(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-orange-600 focus:ring-0"
                />
                <label htmlFor="billableCheck" className="text-xs text-zinc-300">
                  Billable to client in next retainer invoice
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Receipt link, vendor details or memo"
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium text-xs transition"
                >
                  {isPending ? 'Logging...' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
