import React from 'react';
import { db } from '@/lib/db/client';
import { CampaignsClient, type CampaignItem } from '@/components/admin/CampaignsClient';

export const dynamic = 'force-dynamic';

export default async function AdminCampaignsPage() {
  let campaigns: CampaignItem[] = [];
  let clients: Array<{ id: string; legalName: string; brandName: string | null }> = [];

  if (process.env.DATABASE_URL) {
    try {
      const [campaignsData, clientsData] = await Promise.all([
        db.campaign.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            client: {
              select: { id: true, legalName: true, brandName: true },
            },
          },
        }),
        db.client.findMany({
          orderBy: { legalName: 'asc' },
          select: { id: true, legalName: true, brandName: true },
        }),
      ]);

      clients = clientsData;
      campaigns = campaignsData.map((c) => ({
        id: c.id,
        name: c.name,
        channel: c.channel,
        status: c.status,
        budget: c.budget ? Number(c.budget) : null,
        spend: c.spend ? Number(c.spend) : null,
        targetCpa: c.targetCpa ? Number(c.targetCpa) : null,
        actualCpa: c.actualCpa ? Number(c.actualCpa) : null,
        targetRoas: c.targetRoas ? Number(c.targetRoas) : null,
        actualRoas: c.actualRoas ? Number(c.actualRoas) : null,
        client: c.client,
        createdAt: c.createdAt.toISOString(),
      }));
    } catch (e) {
      console.error('[CRM Campaigns Fetch Error]:', e);
    }
  }

  return <CampaignsClient initialCampaigns={campaigns} clients={clients} />;
}
