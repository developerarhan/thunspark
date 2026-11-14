import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/client';
import InvoiceDetailClient from '@/components/admin/InvoiceDetailClient';

interface InvoiceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: InvoiceDetailPageProps) {
  const { id } = await params;
  const invoice = await db.invoice.findUnique({
    where: { id },
    select: { number: true },
  });

  if (!invoice) return { title: 'Invoice Not Found' };
  return {
    title: `Tax Invoice ${invoice.number} | ThunSpark CRM`,
  };
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = await params;

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      client: {
        include: {
          contacts: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
      project: true,
    },
  });

  if (!invoice) {
    notFound();
  }

  // If no primary contact, grab the first available contact
  if (invoice.client.contacts.length === 0) {
    const anyContact = await db.contact.findFirst({
      where: { clientId: invoice.clientId },
    });
    if (anyContact) {
      invoice.client.contacts = [anyContact];
    }
  }

  const serializedInvoice = {
    id: invoice.id,
    number: invoice.number,
    status: invoice.status,
    issueDate: invoice.issueDate.toISOString(),
    dueDate: invoice.dueDate.toISOString(),
    currency: invoice.currency,
    subtotal: Number(invoice.subtotal),
    taxRate: Number(invoice.taxRate),
    taxAmount: Number(invoice.taxAmount),
    total: Number(invoice.total),
    isIgst: invoice.isIgst,
    paidAt: invoice.paidAt ? invoice.paidAt.toISOString() : null,
    paymentMethod: invoice.paymentMethod,
    paymentReference: invoice.paymentReference,
    notes: invoice.notes,
    client: {
      id: invoice.client.id,
      legalName: invoice.client.legalName,
      brandName: invoice.client.brandName,
      gstin: invoice.client.gstin,
      billingAddress: invoice.client.billingAddress,
      contacts: invoice.client.contacts.map((c) => ({
        name: c.name,
        email: c.email,
        phone: c.phone,
      })),
    },
    project: invoice.project
      ? {
          id: invoice.project.id,
          name: invoice.project.name,
        }
      : null,
    lineItems: Array.isArray(invoice.lineItems) ? (invoice.lineItems as any) : [],
  };

  return <InvoiceDetailClient invoice={serializedInvoice} />;
}
