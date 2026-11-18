'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { auth } from '@/lib/auth';
import type { TaskStatus, Priority, Channel, ProjectType } from '@prisma/client';

// ── PROJECT ACTIONS ─────────────────────────────────────────

export async function createProjectAction(data: {
  clientId: string;
  name: string;
  type: ProjectType;
  budgetAmount?: number;
  budgetHours?: number;
  startDate?: string;
  endDate?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const project = await db.project.create({
    data: {
      clientId: data.clientId,
      name: data.name.trim(),
      type: data.type || 'PROJECT',
      budgetAmount: data.budgetAmount ? Number(data.budgetAmount) : null,
      budgetHours: data.budgetHours ? Number(data.budgetHours) : null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });

  revalidatePath('/admin/projects');
  revalidatePath(`/admin/clients/${data.clientId}`);
  return { success: true, projectId: project.id };
}

// ── TASK ACTIONS ────────────────────────────────────────────

export async function createTaskAction(data: {
  projectId: string;
  title: string;
  description?: string;
  priority?: Priority;
  estHours?: number;
  dueDate?: string;
  assigneeId?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const task = await db.task.create({
    data: {
      projectId: data.projectId,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      priority: data.priority || 'MEDIUM',
      estHours: data.estHours ? Number(data.estHours) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assigneeId: data.assigneeId || session.user.id,
    },
  });

  revalidatePath(`/admin/projects/${data.projectId}`);
  return { success: true, taskId: task.id };
}

export async function updateTaskStatusAction(taskId: string, status: TaskStatus) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const task = await db.task.update({
    where: { id: taskId },
    data: { status },
  });

  revalidatePath(`/admin/projects/${task.projectId}`);
  return { success: true };
}

// ── TIME LOGGING & RETAINER BURNDOWN ────────────────────────

export async function logTimeAction(data: {
  projectId: string;
  taskId?: string;
  hours: number;
  notes?: string;
  date?: string;
  billable?: boolean;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const timeLog = await db.$transaction(async (tx) => {
    const log = await tx.timeLog.create({
      data: {
        userId: session.user.id,
        projectId: data.projectId,
        taskId: data.taskId || null,
        hours: Number(data.hours),
        notes: data.notes?.trim() || null,
        date: data.date ? new Date(data.date) : new Date(),
        billable: data.billable ?? true,
      },
    });

    // Update actual hours on task if taskId is provided
    if (data.taskId) {
      const taskLogs = await tx.timeLog.aggregate({
        where: { taskId: data.taskId },
        _sum: { hours: true },
      });
      await tx.task.update({
        where: { id: data.taskId },
        data: { actHours: taskLogs._sum.hours || 0 },
      });
    }

    return log;
  });

  revalidatePath(`/admin/projects/${data.projectId}`);
  return { success: true, logId: timeLog.id };
}

// ── MILESTONES ──────────────────────────────────────────────

export async function toggleMilestoneApprovalAction(milestoneId: string, approved: boolean) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const milestone = await db.milestone.update({
    where: { id: milestoneId },
    data: {
      approved,
      approvedAt: approved ? new Date() : null,
    },
  });

  revalidatePath(`/admin/projects/${milestone.projectId}`);
  return { success: true };
}

export async function createMilestoneAction(data: {
  projectId: string;
  title: string;
  dueDate?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const milestone = await db.milestone.create({
    data: {
      projectId: data.projectId,
      title: data.title.trim(),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });

  revalidatePath(`/admin/projects/${data.projectId}`);
  return { success: true, milestoneId: milestone.id };
}

// ── CAMPAIGN & AD PLATFORM PERFORMANCE ──────────────────────

export async function createCampaignAction(data: {
  clientId: string;
  projectId?: string;
  name: string;
  channel: Channel;
  budget?: number;
  targetCpa?: number;
  targetRoas?: number;
  objective?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const campaign = await db.campaign.create({
    data: {
      clientId: data.clientId,
      projectId: data.projectId || null,
      name: data.name.trim(),
      channel: data.channel || 'GOOGLE_ADS',
      budget: data.budget ? Number(data.budget) : null,
      targetCpa: data.targetCpa ? Number(data.targetCpa) : null,
      targetRoas: data.targetRoas ? Number(data.targetRoas) : null,
      objective: data.objective?.trim() || null,
      status: 'ACTIVE',
    },
  });

  revalidatePath('/admin/campaigns');
  revalidatePath(`/admin/clients/${data.clientId}`);
  return { success: true, campaignId: campaign.id };
}

export async function syncCampaignMetricsAction(data: {
  campaignId: string;
  spend: number;
  actualCpa?: number;
  actualRoas?: number;
  status?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  await db.campaign.update({
    where: { id: data.campaignId },
    data: {
      spend: Number(data.spend),
      actualCpa: data.actualCpa ? Number(data.actualCpa) : null,
      actualRoas: data.actualRoas ? Number(data.actualRoas) : null,
      status: data.status || 'ACTIVE',
    },
  });

  revalidatePath('/admin/campaigns');
  return { success: true };
}

// ── AD PERFORMANCE REPORTS (AI Vision & CSV Parser) ─────────

export async function saveAdPerformanceReportAction(data: {
  clientId: string;
  platform: string;
  dateStart?: string | null;
  dateEnd?: string | null;
  currency?: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpa: number;
  roas?: number | null;
  aiSummaryNotes?: string | null;
  sourceType: string;
  fileName?: string | null;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const report = await db.adPerformanceReport.create({
    data: {
      clientId: data.clientId,
      platform: data.platform || 'meta',
      dateStart: data.dateStart ? new Date(data.dateStart) : null,
      dateEnd: data.dateEnd ? new Date(data.dateEnd) : null,
      currency: data.currency || 'INR',
      spend: Number(data.spend),
      impressions: Number(data.impressions || 0),
      clicks: Number(data.clicks || 0),
      conversions: Number(data.conversions || 0),
      cpa: Number(data.cpa || 0),
      roas: data.roas !== null && data.roas !== undefined ? Number(data.roas) : null,
      aiSummaryNotes: data.aiSummaryNotes?.trim() || null,
      sourceType: data.sourceType || 'screenshot',
      fileName: data.fileName || null,
    },
  });

  // Also sync to active campaign if one exists
  const channelMap: Record<string, Channel> = {
    meta: 'META_ADS',
    google: 'GOOGLE_ADS',
    other: 'OTHER',
  };
  const targetChannel = channelMap[data.platform] || 'OTHER';

  const existingCampaign = await db.campaign.findFirst({
    where: { clientId: data.clientId, channel: targetChannel, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  });

  if (existingCampaign) {
    await db.campaign.update({
      where: { id: existingCampaign.id },
      data: {
        spend: Number(data.spend),
        actualCpa: Number(data.cpa || 0),
        actualRoas: data.roas ? Number(data.roas) : null,
      },
    });
  }

  revalidatePath(`/admin/clients/${data.clientId}`);
  revalidatePath('/admin/campaigns');
  return { success: true, reportId: report.id };
}
