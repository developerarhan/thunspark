import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/client';
import { ArrowLeft } from 'lucide-react';
import { ClientDetailView } from '@/components/admin/ClientDetailView';
import type { SavedReportItem } from '@/components/admin/ClientAdPerformanceTab';

export const dynamic = 'force-dynamic';

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!process.env.DATABASE_URL) {
    notFound();
  }

  let client: any = null;

  try {
    client = await db.client.findUnique({
      where: { id },
      include: {
        contacts: true,
        projects: true,
        invoices: {
          orderBy: { createdAt: 'desc' },
        },
        adReports: {
          orderBy: { createdAt: 'desc' },
        },
        lead: {
          select: {
            id: true,
            name: true,
            source: true,
            utmSource: true,
            utmCampaign: true,
            bottleneckNotes: true,
            createdAt: true,
          },
        },
      },
    });
  } catch (err) {
    console.warn('[Client Detail Fetch with adReports warning]:', err);
    client = await db.client.findUnique({
      where: { id },
      include: {
        contacts: true,
        projects: true,
        invoices: {
          orderBy: { createdAt: 'desc' },
        },
        lead: {
          select: {
            id: true,
            name: true,
            source: true,
            utmSource: true,
            utmCampaign: true,
            bottleneckNotes: true,
            createdAt: true,
          },
        },
      },
    });
  }

  if (!client) {
    notFound();
  }

  const formattedReports: SavedReportItem[] = (client.adReports || []).map((r: any) => ({
    id: r.id,
    platform: r.platform,
    dateStart: r.dateStart ? r.dateStart.toISOString() : null,
    dateEnd: r.dateEnd ? r.dateEnd.toISOString() : null,
    currency: r.currency,
    spend: Number(r.spend),
    impressions: r.impressions,
    clicks: r.clicks,
    conversions: r.conversions,
    cpa: Number(r.cpa),
    roas: r.roas ? Number(r.roas) : null,
    aiSummaryNotes: r.aiSummaryNotes,
    sourceType: r.sourceType,
    fileName: r.fileName,
    createdAt: r.createdAt.toISOString(),
  }));

  const formattedClient = {
    id: client.id,
    legalName: client.legalName,
    brandName: client.brandName,
    industry: client.industry,
    website: client.website,
    healthScore: client.healthScore,
    gstin: client.gstin,
    currency: client.currency,
    timezone: client.timezone,
    createdAt: client.createdAt.toISOString(),
    contacts: client.contacts.map((c: any) => ({
      id: c.id,
      name: c.name,
      role: c.role,
      email: c.email,
      phone: c.phone,
      isPrimary: c.isPrimary,
    })),
    projects: client.projects.map((p: any) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      status: p.status,
      budgetAmount: p.budgetAmount ? Number(p.budgetAmount) : null,
    })),
    invoices: client.invoices.map((inv: any) => ({
      id: inv.id,
      number: inv.number,
      status: inv.status,
      dueDate: inv.dueDate.toISOString(),
      total: Number(inv.total),
      isIgst: inv.isIgst,
    })),
    lead: client.lead
      ? {
          id: client.lead.id,
          name: client.lead.name,
          source: client.lead.source,
          utmSource: client.lead.utmSource,
          utmCampaign: client.lead.utmCampaign,
          bottleneckNotes: client.lead.bottleneckNotes,
          createdAt: client.lead.createdAt.toISOString(),
        }
      : null,
  };

  return (
    <div className="p-4 sm:p-7 space-y-6 max-w-6xl">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-meta hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} />
          <span>All Clients</span>
        </Link>
      </div>

      <ClientDetailView client={formattedClient} initialReports={formattedReports} />
    </div>
  );
}
