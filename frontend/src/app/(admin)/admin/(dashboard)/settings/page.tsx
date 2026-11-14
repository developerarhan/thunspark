import React from 'react';
import { db } from '@/lib/db/client';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsClient, {
  type SerializedUser,
  type SerializedAgencySetting,
  type SerializedAuditLog,
} from '@/components/admin/SettingsClient';
import type { UserRole } from '@prisma/client';

export const metadata = {
  title: 'CRM Settings & Team RBAC | ThunSpark CRM',
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/admin/login');
  }

  const [usersRaw, agencyRaw, auditLogsRaw] = await Promise.all([
    db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
    db.agencySetting.findUnique({
      where: { id: 'default' },
    }),
    db.auditLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
  ]);

  const serializedUsers: SerializedUser[] = usersRaw.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
  }));

  const serializedAgencySetting: SerializedAgencySetting = agencyRaw
    ? {
        id: agencyRaw.id,
        legalName: agencyRaw.legalName,
        tradeName: agencyRaw.tradeName,
        gstin: agencyRaw.gstin,
        pan: agencyRaw.pan,
        stateCode: agencyRaw.stateCode,
        stateName: agencyRaw.stateName,
        registeredAddr: agencyRaw.registeredAddr,
        billingEmail: agencyRaw.billingEmail,
        contactPhone: agencyRaw.contactPhone,
        websiteUrl: agencyRaw.websiteUrl,
        bankName: agencyRaw.bankName,
        accountHolder: agencyRaw.accountHolder,
        accountNumber: agencyRaw.accountNumber,
        ifscCode: agencyRaw.ifscCode,
        upiId: agencyRaw.upiId,
        defaultTaxRate: Number(agencyRaw.defaultTaxRate),
        sacCode: agencyRaw.sacCode,
      }
    : {
        id: 'default',
        legalName: 'ThunSpark Media & Tech Solutions Pvt. Ltd.',
        tradeName: 'ThunSpark Digital Agency',
        gstin: '06AAACT9876Q1Z2',
        pan: 'AAACT9876Q',
        stateCode: '06',
        stateName: 'Haryana',
        registeredAddr: 'DLF Cyber City, Tower 10, Sector 24, Gurugram, Haryana - 122002',
        billingEmail: 'billing@thunspark.agency',
        contactPhone: '+91 98765 43210',
        websiteUrl: 'https://thunspark.agency',
        bankName: 'HDFC Bank Limited',
        accountHolder: 'THUNSPARK MEDIA SOLUTIONS PVT LTD',
        accountNumber: '50200088991122',
        ifscCode: 'HDFC0001234',
        upiId: 'thunspark.agency@hdfcbank',
        defaultTaxRate: 18.0,
        sacCode: '998311',
      };

  const serializedAuditLogs: SerializedAuditLog[] = auditLogsRaw.map((log) => ({
    id: log.id,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    before: log.before,
    after: log.after,
    createdAt: log.createdAt.toISOString(),
    user: log.user,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">
          Agency Settings & Team RBAC
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage team member roles, permissions, corporate Indian GST settings, and compliance audit logs.
        </p>
      </div>

      <SettingsClient
        currentUserId={session.user.id || ''}
        currentUserRole={session.user.role as UserRole | undefined}
        teamMembers={serializedUsers}
        agencySetting={serializedAgencySetting}
        auditLogs={serializedAuditLogs}
      />
    </div>
  );
}
