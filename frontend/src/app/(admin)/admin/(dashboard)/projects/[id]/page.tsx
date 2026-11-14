import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db/client';
import { ProjectWorkspaceClient } from '@/components/admin/ProjectWorkspaceClient';

export const dynamic = 'force-dynamic';

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!process.env.DATABASE_URL) {
    notFound();
  }

  const project = await db.project.findUnique({
    where: { id },
    include: {
      client: {
        select: { id: true, legalName: true, brandName: true },
      },
      tasks: {
        orderBy: { createdAt: 'desc' },
        include: {
          assignee: { select: { name: true } },
        },
      },
      milestones: {
        orderBy: { dueDate: 'asc' },
      },
      timeLogs: {
        orderBy: { date: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          task: { select: { title: true } },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const formattedProject = {
    id: project.id,
    name: project.name,
    type: project.type,
    status: project.status,
    budgetHours: project.budgetHours,
    budgetAmount: project.budgetAmount ? Number(project.budgetAmount) : null,
    client: project.client,
    tasks: project.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      estHours: t.estHours ? Number(t.estHours) : null,
      actHours: t.actHours ? Number(t.actHours) : null,
      assignee: t.assignee,
    })),
    milestones: project.milestones.map((m) => ({
      id: m.id,
      title: m.title,
      dueDate: m.dueDate ? m.dueDate.toISOString() : null,
      approved: m.approved,
      approvedAt: m.approvedAt ? m.approvedAt.toISOString() : null,
    })),
    timeLogs: project.timeLogs.map((l) => ({
      id: l.id,
      hours: Number(l.hours),
      notes: l.notes,
      date: l.date.toISOString(),
      user: l.user,
      task: l.task,
    })),
  };

  return <ProjectWorkspaceClient project={formattedProject} />;
}
