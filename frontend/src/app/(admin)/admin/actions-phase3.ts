'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { auth } from '@/lib/auth';
import type { InvoiceStatus, ExpenseCategory } from '@prisma/client';

export interface InvoiceLineItem {
  id: string;
  description: string;
  sacCode?: string;
  quantity: number;
  rate: number;
  amount: number;
}

// ── INVOICE ACTIONS ─────────────────────────────────────────

export async function createInvoiceAction(data: {
  clientId: string;
  projectId?: string;
  issueDate?: string;
  dueDate: string;
  currency?: string;
  taxRate?: number;
  isIgst?: boolean;
  notes?: string;
  lineItems: InvoiceLineItem[];
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const issueDateObj = data.issueDate ? new Date(data.issueDate) : new Date();
  const year = issueDateObj.getFullYear();
  
  // Sequential numbering: TS/2026/001
  const count = await db.invoice.count({
    where: {
      number: {
        startsWith: `TS/${year}/`,
      },
    },
  });
  const seq = String(count + 1).padStart(3, '0');
  const invoiceNumber = `TS/${year}/${seq}`;

  // Calculate totals
  const subtotal = data.lineItems.reduce((acc, item) => {
    return acc + Number(item.quantity || 1) * Number(item.rate || 0);
  }, 0);

  const taxRate = data.taxRate !== undefined ? Number(data.taxRate) : 18.0;
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;

  const invoice = await db.invoice.create({
    data: {
      clientId: data.clientId,
      projectId: data.projectId || null,
      number: invoiceNumber,
      status: 'DRAFT',
      issueDate: issueDateObj,
      dueDate: new Date(data.dueDate),
      currency: data.currency || 'INR',
      lineItems: data.lineItems as any,
      subtotal,
      taxRate,
      taxAmount,
      total,
      isIgst: Boolean(data.isIgst),
      notes: data.notes?.trim() || null,
    },
  });

  revalidatePath('/admin/invoices');
  revalidatePath(`/admin/clients/${data.clientId}`);
  revalidatePath('/admin');
  return { success: true, invoiceId: invoice.id, invoiceNumber: invoice.number };
}

export async function updateInvoiceStatusAction(data: {
  invoiceId: string;
  status: InvoiceStatus;
  paymentMethod?: string;
  paymentReference?: string;
  paidAt?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const updateData: {
    status: InvoiceStatus;
    paidAt?: Date | null;
    paymentMethod?: string | null;
    paymentReference?: string | null;
  } = {
    status: data.status,
  };

  if (data.status === 'PAID') {
    updateData.paidAt = data.paidAt ? new Date(data.paidAt) : new Date();
    updateData.paymentMethod = data.paymentMethod || 'NEFT_RTGS';
    updateData.paymentReference = data.paymentReference?.trim() || null;
  } else if (data.status === 'DRAFT' || data.status === 'SENT' || data.status === 'OVERDUE') {
    updateData.paidAt = null;
  }

  const updated = await db.invoice.update({
    where: { id: data.invoiceId },
    data: updateData,
  });

  revalidatePath('/admin/invoices');
  revalidatePath(`/admin/invoices/${data.invoiceId}`);
  revalidatePath(`/admin/clients/${updated.clientId}`);
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteInvoiceAction(invoiceId: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const inv = await db.invoice.delete({
    where: { id: invoiceId },
  });

  revalidatePath('/admin/invoices');
  revalidatePath(`/admin/clients/${inv.clientId}`);
  return { success: true };
}

// ── EXPENSE ACTIONS ─────────────────────────────────────────

export async function logExpenseAction(data: {
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency?: string;
  date: string;
  clientId?: string;
  projectId?: string;
  isBillable?: boolean;
  receiptUrl?: string;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const expense = await db.expense.create({
    data: {
      title: data.title.trim(),
      category: data.category || 'OPERATIONS',
      amount: Number(data.amount),
      currency: data.currency || 'INR',
      date: new Date(data.date),
      clientId: data.clientId || null,
      projectId: data.projectId || null,
      isBillable: Boolean(data.isBillable),
      receiptUrl: data.receiptUrl?.trim() || null,
      notes: data.notes?.trim() || null,
    },
  });

  revalidatePath('/admin/invoices');
  if (data.clientId) {
    revalidatePath(`/admin/clients/${data.clientId}`);
  }
  return { success: true, expenseId: expense.id };
}

export async function deleteExpenseAction(expenseId: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  await db.expense.delete({
    where: { id: expenseId },
  });

  revalidatePath('/admin/invoices');
  return { success: true };
}
