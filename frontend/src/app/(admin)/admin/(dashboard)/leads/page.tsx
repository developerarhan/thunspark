import React from 'react';
import { db } from '@/lib/db/client';
import { LeadsKanbanClient, type LeadItem } from '@/components/admin/LeadsKanbanClient';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  let leads: LeadItem[] = [];

  if (process.env.DATABASE_URL) {
    try {
      const data = await db.lead.findMany({
        orderBy: { lastActivity: 'desc' },
        include: {
          convertedClient: {
            select: { id: true, legalName: true },
          },
          activities: {
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: { name: true },
              },
            },
          },
        },
      });

      leads = data.map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        company: l.company,
        website: l.website,
        source: l.source,
        stage: l.stage,
        serviceInterest: l.serviceInterest,
        budgetRange: l.budgetRange,
        bottleneckNotes: l.bottleneckNotes,
        score: l.score,
        utmSource: l.utmSource,
        utmCampaign: l.utmCampaign,
        referrer: l.referrer,
        createdAt: l.createdAt.toISOString(),
        lastActivity: l.lastActivity.toISOString(),
        convertedClient: l.convertedClient
          ? { id: l.convertedClient.id, legalName: l.convertedClient.legalName }
          : null,
        activities: l.activities.map((a) => ({
          id: a.id,
          type: a.type,
          title: a.title,
          content: a.content,
          createdAt: a.createdAt.toISOString(),
          author: a.author ? { name: a.author.name } : null,
        })),
      }));
    } catch (e) {
      console.error('[CRM Leads Fetch Error]:', e);
    }
  }

  return <LeadsKanbanClient initialLeads={leads} />;
}
