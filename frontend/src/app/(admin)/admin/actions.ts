'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { auth } from '@/lib/auth';
import type { LeadStage, LeadSource, ActivityType } from '@prisma/client';

export async function updateLeadStageAction(leadId: string, newStage: LeadStage) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const oldLead = await db.lead.findUnique({
    where: { id: leadId },
    select: { stage: true, name: true },
  });

  if (!oldLead) {
    throw new Error('Lead not found');
  }

  await db.$transaction([
    db.lead.update({
      where: { id: leadId },
      data: {
        stage: newStage,
        lastActivity: new Date(),
      },
    }),
    db.activity.create({
      data: {
        leadId,
        type: 'STAGE_CHANGE',
        title: `Stage updated to ${newStage}`,
        content: `Moved from ${oldLead.stage} to ${newStage} by ${session.user.name || session.user.email}`,
        authorId: session.user.id,
      },
    }),
  ]);

  revalidatePath('/admin');
  revalidatePath('/admin/leads');
  return { success: true };
}

export async function addLeadActivityAction(leadId: string, content: string, type: ActivityType = 'NOTE') {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  if (!content.trim()) {
    throw new Error('Activity content cannot be empty');
  }

  const activity = await db.activity.create({
    data: {
      leadId,
      type,
      title: type === 'CALL' ? 'Phone / Strategy Call' : type === 'MEETING' ? 'Discovery Meeting' : 'Internal Note',
      content: content.trim(),
      authorId: session.user.id,
    },
  });

  await db.lead.update({
    where: { id: leadId },
    data: { lastActivity: new Date() },
  });

  revalidatePath('/admin/leads');
  return { success: true, activity };
}

export interface ConvertLeadPayload {
  leadId: string;
  legalName: string;
  brandName?: string;
  industry?: string;
  gstin?: string;
  billingAddress?: string;
  currency?: string;
  contractValue?: number;
}

export async function convertLeadToClientAction(payload: ConvertLeadPayload) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const lead = await db.lead.findUnique({
    where: { id: payload.leadId },
    include: { convertedClient: true },
  });

  if (!lead) {
    throw new Error('Lead not found');
  }

  if (lead.convertedClient) {
    return { success: true, clientId: lead.convertedClient.id, message: 'Client already exists' };
  }

  const client = await db.$transaction(async (tx) => {
    // 1. Create client account
    const newClient = await tx.client.create({
      data: {
        legalName: payload.legalName.trim(),
        brandName: payload.brandName?.trim() || lead.company || payload.legalName.trim(),
        industry: payload.industry?.trim() || null,
        website: lead.website,
        gstin: payload.gstin?.trim() || null,
        billingAddress: payload.billingAddress?.trim() || null,
        currency: payload.currency || 'INR',
        leadId: lead.id,
        accountManagerId: session.user.id,
        contacts: {
          create: {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            isPrimary: true,
            role: 'Primary Stakeholder',
          },
        },
        projects: {
          create: {
            name: `${lead.company || lead.name} Initial Growth Sprint`,
            type: 'PROJECT',
            status: 'ACTIVE',
            budgetAmount: payload.contractValue ? Number(payload.contractValue) : null,
          },
        },
      },
    });

    // 2. Update lead stage to WON
    await tx.lead.update({
      where: { id: lead.id },
      data: {
        stage: 'WON',
        lastActivity: new Date(),
      },
    });

    // 3. Log activity
    await tx.activity.create({
      data: {
        leadId: lead.id,
        type: 'STAGE_CHANGE',
        title: 'Deal Won & Converted to Client Account',
        content: `Created Client Account "${newClient.legalName}" with primary contact ${lead.name}`,
        authorId: session.user.id,
      },
    });

    return newClient;
  });

  revalidatePath('/admin');
  revalidatePath('/admin/leads');
  revalidatePath('/admin/clients');

  return { success: true, clientId: client.id };
}

export async function createManualLeadAction(formData: {
  name: string;
  email: string;
  company?: string;
  website?: string;
  phone?: string;
  source?: LeadSource;
  budgetRange?: string;
  servicesNeeded?: string[];
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const lead = await db.lead.create({
    data: {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      company: formData.company?.trim() || null,
      website: formData.website?.trim() || null,
      phone: formData.phone?.trim() || null,
      source: formData.source || 'DIRECT',
      serviceInterest: formData.servicesNeeded || [],
      budgetRange: formData.budgetRange || null,
      bottleneckNotes: formData.notes?.trim() || null,
      stage: 'NEW',
      ownerId: session.user.id,
      activities: {
        create: {
          type: 'NOTE',
          title: 'Manual Lead Created in CRM',
          content: `Created by ${session.user.name || session.user.email}`,
          authorId: session.user.id,
        },
      },
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/leads');
  return { success: true, leadId: lead.id };
}
