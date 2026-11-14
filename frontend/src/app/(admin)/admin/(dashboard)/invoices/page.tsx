import React from 'react';
import { db } from '@/lib/db/client';
import InvoicesClient, { type SerializedInvoice, type SerializedExpense } from '@/components/admin/InvoicesClient';

export const metadata = {
  title: 'Invoices & Indian GST Billing | ThunSpark CRM',
};

export default async function InvoicesPage() {
  const [invoicesRaw, expensesRaw, clientsRaw] = await Promise.all([
    db.invoice.findMany({
      include: {
        client: {
          select: {
            id: true,
            legalName: true,
            brandName: true,
            gstin: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.expense.findMany({
      include: {
        client: {
          select: {
            id: true,
            legalName: true,
          },
        },
      },
      orderBy: { date: 'desc' },
      take: 50,
    }),
    db.client.findMany({
      select: {
        id: true,
        legalName: true,
        brandName: true,
        gstin: true,
        projects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { legalName: 'asc' },
    }),
  ]);

  const serializedInvoices: SerializedInvoice[] = invoicesRaw.map((inv) => ({
    id: inv.id,
    number: inv.number,
    status: inv.status,
    issueDate: inv.issueDate.toISOString(),
    dueDate: inv.dueDate.toISOString(),
    currency: inv.currency,
    subtotal: Number(inv.subtotal),
    taxRate: Number(inv.taxRate),
    taxAmount: Number(inv.taxAmount),
    total: Number(inv.total),
    isIgst: inv.isIgst,
    paidAt: inv.paidAt ? inv.paidAt.toISOString() : null,
    paymentMethod: inv.paymentMethod,
    paymentReference: inv.paymentReference,
    notes: inv.notes,
    client: inv.client,
    project: inv.project,
    lineItems: Array.isArray(inv.lineItems) ? (inv.lineItems as any) : [],
  }));

  const serializedExpenses: SerializedExpense[] = expensesRaw.map((exp) => ({
    id: exp.id,
    title: exp.title,
    category: exp.category,
    amount: Number(exp.amount),
    currency: exp.currency,
    date: exp.date.toISOString(),
    isBillable: exp.isBillable,
    notes: exp.notes,
    client: exp.client,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">
          Invoices & Indian GST Billing
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Compliant Tax Invoices (SAC 998311), recurring retainer billing, receivables, and agency expenses.
        </p>
      </div>

      <InvoicesClient
        initialInvoices={serializedInvoices}
        initialExpenses={serializedExpenses}
        clients={clientsRaw}
      />
    </div>
  );
}
