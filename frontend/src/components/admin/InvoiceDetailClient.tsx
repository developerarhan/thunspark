'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Send,
  X,
} from 'lucide-react';
import { updateInvoiceStatusAction } from '@/app/(admin)/admin/actions-phase3';
import type { InvoiceStatus } from '@prisma/client';
import type { InvoiceLineItem } from '@/app/(admin)/admin/actions-phase3';

interface InvoiceDetailClientProps {
  invoice: {
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
      billingAddress: string | null;
      contacts: Array<{
        name: string;
        email: string;
        phone: string | null;
      }>;
    };
    project?: {
      id: string;
      name: string;
    } | null;
    lineItems: InvoiceLineItem[];
  };
}

// Convert numbers into Indian Currency words
function convertNumberToWords(amount: number): string {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function numToWordsUnder1000(n: number): string {
    let str = '';
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      str += teens[n - 10] + ' ';
      n = 0;
    }
    if (n > 0) {
      str += units[n] + ' ';
    }
    return str.trim();
  }

  const intPart = Math.floor(amount);
  if (intPart === 0) return 'Zero Rupees Only';

  let remaining = intPart;
  const crores = Math.floor(remaining / 10000000);
  remaining %= 10000000;
  const lakhs = Math.floor(remaining / 100000);
  remaining %= 100000;
  const thousands = Math.floor(remaining / 1000);
  remaining %= 1000;
  const hundreds = remaining;

  let result = '';
  if (crores > 0) result += numToWordsUnder1000(crores) + ' Crore ';
  if (lakhs > 0) result += numToWordsUnder1000(lakhs) + ' Lakh ';
  if (thousands > 0) result += numToWordsUnder1000(thousands) + ' Thousand ';
  if (hundreds > 0) result += numToWordsUnder1000(hundreds) + ' ';

  return `INR ${result.trim()} Only`;
}

export default function InvoiceDetailClient({ invoice }: InvoiceDetailClientProps) {
  const [isPending, startTransition] = useTransition();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('NEFT_RTGS');
  const [paymentReference, setPaymentReference] = useState('');

  const primaryContact = invoice.client.contacts[0];

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = (status: InvoiceStatus) => {
    startTransition(async () => {
      try {
        await updateInvoiceStatusAction({
          invoiceId: invoice.id,
          status,
        });
      } catch (err: any) {
        alert(err.message || 'Failed to update status');
      }
    });
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateInvoiceStatusAction({
          invoiceId: invoice.id,
          status: 'PAID',
          paymentMethod,
          paymentReference,
        });
        setIsPaymentModalOpen(false);
      } catch (err: any) {
        alert(err.message || 'Failed to record payment');
      }
    });
  };

  const amountInWords = convertNumberToWords(invoice.total);

  return (
    <div className="space-y-6">
      {/* ── ACTION BAR (HIDDEN IN PRINT) ──────────────────── */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/invoices"
            className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-zinc-100">
                {invoice.number}
              </span>
              {invoice.status === 'PAID' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  PAID
                </span>
              )}
              {invoice.status === 'SENT' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Clock className="w-3 h-3" />
                  SENT (DUE)
                </span>
              )}
              {invoice.status === 'OVERDUE' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertTriangle className="w-3 h-3" />
                  OVERDUE
                </span>
              )}
              {invoice.status === 'DRAFT' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <FileText className="w-3 h-3" />
                  DRAFT
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Client: {invoice.client.legalName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {invoice.status === 'DRAFT' && (
            <button
              onClick={() => handleStatusChange('SENT')}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              Mark as Sent
            </button>
          )}

          {invoice.status !== 'PAID' && (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition shadow-lg shadow-emerald-950/40"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Record Payment
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition border border-zinc-700"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* ── GST TAX INVOICE CANVAS (SCREEN & PRINT COMPLIANT) ─ */}
      <div
        id="invoice-document"
        className="bg-white text-zinc-900 rounded-2xl shadow-2xl p-8 sm:p-12 max-w-4xl mx-auto border border-zinc-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none text-xs leading-relaxed"
      >
        {/* Header Bar */}
        <div className="flex justify-between items-start border-b-2 border-orange-600 pb-6 mb-6">
          <div>
            <div className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-2">
              <span className="text-orange-600">THUNSPARK</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800 tracking-normal uppercase">
                Digital Agency
              </span>
            </div>
            <p className="font-semibold text-zinc-800 mt-1">
              ThunSpark Media & Tech Solutions Pvt. Ltd.
            </p>
            <p className="text-zinc-600 text-[11px] max-w-xs mt-0.5">
              DLF Cyber City, Tower 10, Sector 24, Gurugram, Haryana - 122002
            </p>
            <div className="mt-2 text-[11px] font-mono text-zinc-700 space-y-0.5">
              <div>
                <span className="font-bold text-zinc-900">GSTIN:</span> 06AAACT9876Q1Z2
              </div>
              <div>
                <span className="font-bold text-zinc-900">PAN:</span> AAACT9876Q |{' '}
                <span className="font-bold text-zinc-900">State:</span> Haryana (06)
              </div>
              <div>
                <span className="font-bold text-zinc-900">Email:</span> billing@thunspark.agency |{' '}
                <span className="font-bold text-zinc-900">Web:</span> thunspark.agency
              </div>
            </div>
          </div>

          <div className="text-right space-y-2">
            <div className="inline-block px-3 py-1 bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded">
              TAX INVOICE
            </div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              Original for Recipient
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-right space-y-1 mt-2">
              <div>
                <span className="text-zinc-500">Invoice No:</span>{' '}
                <span className="font-mono font-bold text-zinc-900 text-sm">
                  {invoice.number}
                </span>
              </div>
              <div>
                <span className="text-zinc-500">Date of Issue:</span>{' '}
                <span className="font-medium text-zinc-800">
                  {new Date(invoice.issueDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-zinc-500">Payment Due:</span>{' '}
                <span className="font-semibold text-orange-700">
                  {new Date(invoice.dueDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To / Consignee Section */}
        <div className="grid grid-cols-2 gap-8 mb-6 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Billed To (Client Entity)
            </div>
            <div className="text-sm font-bold text-zinc-900">{invoice.client.legalName}</div>
            {invoice.client.brandName && (
              <div className="text-xs text-zinc-600 font-medium">
                Trade Name: {invoice.client.brandName}
              </div>
            )}
            <div className="text-[11px] text-zinc-600 mt-1 whitespace-pre-line">
              {invoice.client.billingAddress || 'Corporate Office Address On File'}
            </div>
            <div className="mt-2 text-[11px] font-mono">
              <span className="font-bold text-zinc-900">Client GSTIN:</span>{' '}
              {invoice.client.gstin || 'Unregistered / Consumer'}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Engagement & Dispatch Details
            </div>
            {invoice.project ? (
              <div className="text-xs font-semibold text-zinc-900">
                Project: {invoice.project.name}
              </div>
            ) : (
              <div className="text-xs font-medium text-zinc-700">Digital Marketing Retainer</div>
            )}
            {primaryContact && (
              <div className="text-[11px] text-zinc-600 mt-1">
                Attention: <span className="font-medium text-zinc-800">{primaryContact.name}</span>{' '}
                ({primaryContact.email})
              </div>
            )}
            <div className="mt-2 text-[11px] space-y-0.5">
              <div>
                <span className="font-bold text-zinc-800">Place of Supply:</span>{' '}
                {invoice.isIgst ? 'Outside Haryana (Inter-State)' : 'Haryana (Intra-State)'}
              </div>
              <div>
                <span className="font-bold text-zinc-800">Reverse Charge:</span> No
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Deliverables Table */}
        <div className="border border-zinc-200 rounded-lg overflow-hidden mb-6">
          <table className="w-full text-left">
            <thead className="bg-zinc-100 border-b border-zinc-200 font-bold text-zinc-700 text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-3">Description of Services</th>
                <th className="py-2.5 px-3 text-center w-24">SAC Code</th>
                <th className="py-2.5 px-3 text-center w-16">Qty</th>
                <th className="py-2.5 px-3 text-right w-28">Rate (INR)</th>
                <th className="py-2.5 px-3 text-right w-32">Taxable Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-800">
              {invoice.lineItems.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="py-3 px-3 text-center text-zinc-500 font-mono">{idx + 1}</td>
                  <td className="py-3 px-3 font-medium">
                    {item.description}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-zinc-600">
                    {item.sacCode || '998311'}
                  </td>
                  <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono">
                    ₹{Number(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">
                    ₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tax Summary & Words Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start mb-6">
          <div>
            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Total Amount in Words
              </div>
              <div className="font-serif italic font-semibold text-zinc-900">
                {amountInWords}
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-3 text-[11px] text-zinc-600">
                <span className="font-bold text-zinc-800">Notes / Remarks: </span>
                {invoice.notes}
              </div>
            )}
          </div>

          <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-50 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Total Taxable Value:</span>
              <span className="font-semibold text-zinc-900">
                ₹{invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {invoice.isIgst ? (
              <div className="flex justify-between text-zinc-600">
                <span>Integrated GST (IGST @ 18%):</span>
                <span className="font-semibold text-zinc-900">
                  ₹{invoice.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-zinc-600">
                  <span>Central GST (CGST @ 9%):</span>
                  <span className="font-semibold text-zinc-900">
                    ₹{(invoice.taxAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>State GST (SGST @ 9%):</span>
                  <span className="font-semibold text-zinc-900">
                    ₹{(invoice.taxAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between text-sm font-bold text-zinc-900 pt-2 border-t-2 border-zinc-300">
              <span>Grand Total (INR):</span>
              <span className="text-orange-700">
                ₹{invoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Banking Remittance Details & Signature */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-zinc-200">
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Remittance Bank Details (NEFT / RTGS)
            </div>
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 space-y-1 font-mono text-[11px] text-zinc-700">
              <div>
                <span className="text-zinc-500">Bank:</span> HDFC Bank Limited
              </div>
              <div>
                <span className="text-zinc-500">Account Name:</span> THUNSPARK MEDIA SOLUTIONS PVT LTD
              </div>
              <div>
                <span className="text-zinc-500">Account Number:</span> 50200088991122
              </div>
              <div>
                <span className="text-zinc-500">IFSC Code:</span> HDFC0001234
              </div>
              <div>
                <span className="text-zinc-500">UPI VPA:</span> thunspark.agency@hdfcbank
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col justify-between items-end">
            <div>
              <div className="text-[11px] font-bold text-zinc-800">
                For THUNSPARK MEDIA SOLUTIONS PVT. LTD.
              </div>
              <div className="text-[10px] text-zinc-500">Authorized Signatory</div>
            </div>

            <div className="pt-12 text-center">
              <div className="w-48 border-b border-zinc-400 mb-1"></div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                Sign & Official Seal
              </span>
            </div>
          </div>
        </div>

        {/* Paid Stamp if PAID */}
        {invoice.status === 'PAID' && (
          <div className="mt-8 p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-bold text-xs">PAYMENT RECEIVED & RECONCILED</div>
                <div className="text-[11px] text-emerald-700 font-mono">
                  Method: {invoice.paymentMethod || 'NEFT'} | Ref/UTR: {invoice.paymentReference || 'CONFIRMED'}
                </div>
              </div>
            </div>
            {invoice.paidAt && (
              <div className="text-[11px] font-mono text-emerald-700">
                Paid on {new Date(invoice.paidAt).toLocaleDateString('en-IN')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── RECORD PAYMENT MODAL ──────────────────────────── */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Record Payment</h3>
                  <p className="text-xs text-zinc-400">{invoice.number}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="text-xs text-zinc-400">Client: {invoice.client.legalName}</div>
              <div className="text-base font-bold text-emerald-400">
                Amount: ₹{invoice.total.toLocaleString('en-IN')}
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
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
                  <option value="STRIPE">Stripe / International Card</option>
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
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs transition"
                >
                  {isPending ? 'Saving...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
