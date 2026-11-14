import { db } from '@/lib/db/client';

export interface DashboardMetrics {
  totalLeads: number;
  newLeadsCount: number;
  inProposalCount: number;
  wonCount: number;
  totalClients: number;
  stageCounts: Record<string, number>;
  sourceCounts: Record<string, number>;
  recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    source: string;
    stage: string;
    budgetRange: string | null;
    createdAt: Date;
    lastActivity: Date;
  }>;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  if (!process.env.DATABASE_URL) {
    return {
      totalLeads: 0,
      newLeadsCount: 0,
      inProposalCount: 0,
      wonCount: 0,
      totalClients: 0,
      stageCounts: {},
      sourceCounts: {},
      recentLeads: [],
    };
  }

  try {
    const [leads, clients] = await Promise.all([
      db.lead.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          source: true,
          stage: true,
          budgetRange: true,
          createdAt: true,
          lastActivity: true,
        },
      }),
      db.client.count(),
    ]);

    const stageCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};

    leads.forEach((l) => {
      stageCounts[l.stage] = (stageCounts[l.stage] || 0) + 1;
      sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
    });

    return {
      totalLeads: leads.length,
      newLeadsCount: stageCounts['NEW'] || 0,
      inProposalCount: (stageCounts['PROPOSAL'] || 0) + (stageCounts['NEGOTIATION'] || 0),
      wonCount: stageCounts['WON'] || 0,
      totalClients: clients,
      stageCounts,
      sourceCounts,
      recentLeads: leads.slice(0, 8),
    };
  } catch (error) {
    console.error('[CRM Dashboard Query Error]:', error);
    return {
      totalLeads: 0,
      newLeadsCount: 0,
      inProposalCount: 0,
      wonCount: 0,
      totalClients: 0,
      stageCounts: {},
      sourceCounts: {},
      recentLeads: [],
    };
  }
}
