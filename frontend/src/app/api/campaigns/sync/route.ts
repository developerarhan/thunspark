import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { auth } from '@/lib/auth';

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const campaigns = await db.campaign.findMany({
      where: { status: 'ACTIVE' },
    });

    // Simulate ad platform sync with realistic variance
    for (const c of campaigns) {
      const budget = Number(c.budget || 50000);
      const randomSpendIncrement = Math.floor(budget * (0.1 + Math.random() * 0.15));
      const newSpend = Math.min(budget, Number(c.spend || 0) + randomSpendIncrement);
      
      const targetCpa = Number(c.targetCpa || 500);
      const actualCpa = Math.round(targetCpa * (0.85 + Math.random() * 0.3));

      const targetRoas = Number(c.targetRoas || 3.0);
      const actualRoas = Number((targetRoas * (0.9 + Math.random() * 0.35)).toFixed(2));

      await db.campaign.update({
        where: { id: c.id },
        data: {
          spend: newSpend,
          actualCpa,
          actualRoas,
        },
      });
    }

    return NextResponse.json({
      success: true,
      syncedCampaignsCount: campaigns.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Ad Sync API Error]:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
