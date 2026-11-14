import React from 'react';
import { db } from '@/lib/db/client';
import { ProjectsListClient, type ProjectCardItem } from '@/components/admin/ProjectsListClient';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  let projects: ProjectCardItem[] = [];
  let clients: Array<{ id: string; legalName: string; brandName: string | null }> = [];

  if (process.env.DATABASE_URL) {
    try {
      const [projectsData, clientsData] = await Promise.all([
        db.project.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            client: {
              select: { id: true, legalName: true, brandName: true },
            },
            tasks: {
              select: { id: true, status: true },
            },
            timeLogs: {
              select: { hours: true },
            },
          },
        }),
        db.client.findMany({
          orderBy: { legalName: 'asc' },
          select: { id: true, legalName: true, brandName: true },
        }),
      ]);

      clients = clientsData;
      projects = projectsData.map((p) => {
        const totalHours = p.timeLogs.reduce((acc, log) => acc + Number(log.hours || 0), 0);
        const tasksDone = p.tasks.filter((t) => t.status === 'DONE').length;

        return {
          id: p.id,
          name: p.name,
          type: p.type,
          status: p.status,
          budgetAmount: p.budgetAmount ? Number(p.budgetAmount) : null,
          budgetHours: p.budgetHours,
          totalHoursLogged: Number(totalHours.toFixed(1)),
          tasksTotal: p.tasks.length,
          tasksDone,
          client: p.client,
          createdAt: p.createdAt.toISOString(),
        };
      });
    } catch (e) {
      console.error('[CRM Projects Fetch Error]:', e);
    }
  }

  return <ProjectsListClient initialProjects={projects} clients={clients} />;
}
