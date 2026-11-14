'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { auth } from '@/lib/auth';
import { hashPassword } from '@/lib/auth/password';
import type { UserRole } from '@prisma/client';

// ── TEAM MEMBER ACTIONS ─────────────────────────────────────

export async function createTeamMemberAction(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  // Verify privileged role
  const currentUserRole = session.user.role as UserRole | undefined;
  if (currentUserRole !== 'SUPER_ADMIN' && currentUserRole !== 'AGENCY_OWNER') {
    throw new Error('Only Super Admin or Agency Owner can add team members');
  }

  const email = data.email.trim().toLowerCase();
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error(`User with email "${email}" already exists`);
  }

  const hashedPassword = hashPassword(data.password);

  const newUser = await db.user.create({
    data: {
      name: data.name.trim(),
      email,
      hashedPassword,
      role: data.role || 'GROWTH_STRATEGIST',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  // Record Audit Log
  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'TEAM_MEMBER_CREATED',
      entity: 'User',
      entityId: newUser.id,
      after: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    },
  });

  revalidatePath('/admin/settings');
  return { success: true, userId: newUser.id };
}

export async function updateUserRoleAction(data: {
  userId: string;
  role: UserRole;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const currentUserRole = session.user.role as UserRole | undefined;
  if (currentUserRole !== 'SUPER_ADMIN' && currentUserRole !== 'AGENCY_OWNER') {
    throw new Error('Only Super Admin or Agency Owner can modify roles');
  }

  const existing = await db.user.findUnique({
    where: { id: data.userId },
  });

  if (!existing) throw new Error('User not found');

  const updated = await db.user.update({
    where: { id: data.userId },
    data: { role: data.role },
    select: { id: true, name: true, email: true, role: true },
  });

  // Record Audit Log
  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'TEAM_MEMBER_ROLE_UPDATED',
      entity: 'User',
      entityId: updated.id,
      before: { role: existing.role },
      after: { role: updated.role },
    },
  });

  revalidatePath('/admin/settings');
  return { success: true };
}

export async function deleteTeamMemberAction(userId: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  if (session.user.id === userId) {
    throw new Error('You cannot delete your own account');
  }

  const currentUserRole = session.user.role as UserRole | undefined;
  if (currentUserRole !== 'SUPER_ADMIN' && currentUserRole !== 'AGENCY_OWNER') {
    throw new Error('Only Super Admin or Agency Owner can remove team members');
  }

  const user = await db.user.delete({
    where: { id: userId },
  });

  // Record Audit Log
  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'TEAM_MEMBER_DELETED',
      entity: 'User',
      entityId: userId,
      before: { email: user.email, name: user.name, role: user.role },
    },
  });

  revalidatePath('/admin/settings');
  return { success: true };
}

// ── AGENCY SETTINGS ACTIONS ─────────────────────────────────

export async function updateAgencySettingsAction(data: {
  legalName: string;
  tradeName: string;
  gstin: string;
  pan: string;
  stateCode: string;
  stateName: string;
  registeredAddr: string;
  billingEmail: string;
  contactPhone: string;
  websiteUrl: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  defaultTaxRate: number;
  sacCode: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const setting = await db.agencySetting.upsert({
    where: { id: 'default' },
    update: {
      legalName: data.legalName.trim(),
      tradeName: data.tradeName.trim(),
      gstin: data.gstin.trim().toUpperCase(),
      pan: data.pan.trim().toUpperCase(),
      stateCode: data.stateCode.trim(),
      stateName: data.stateName.trim(),
      registeredAddr: data.registeredAddr.trim(),
      billingEmail: data.billingEmail.trim().toLowerCase(),
      contactPhone: data.contactPhone.trim(),
      websiteUrl: data.websiteUrl.trim(),
      bankName: data.bankName.trim(),
      accountHolder: data.accountHolder.trim(),
      accountNumber: data.accountNumber.trim(),
      ifscCode: data.ifscCode.trim().toUpperCase(),
      upiId: data.upiId.trim(),
      defaultTaxRate: Number(data.defaultTaxRate),
      sacCode: data.sacCode.trim(),
    },
    create: {
      id: 'default',
      legalName: data.legalName.trim(),
      tradeName: data.tradeName.trim(),
      gstin: data.gstin.trim().toUpperCase(),
      pan: data.pan.trim().toUpperCase(),
      stateCode: data.stateCode.trim(),
      stateName: data.stateName.trim(),
      registeredAddr: data.registeredAddr.trim(),
      billingEmail: data.billingEmail.trim().toLowerCase(),
      contactPhone: data.contactPhone.trim(),
      websiteUrl: data.websiteUrl.trim(),
      bankName: data.bankName.trim(),
      accountHolder: data.accountHolder.trim(),
      accountNumber: data.accountNumber.trim(),
      ifscCode: data.ifscCode.trim().toUpperCase(),
      upiId: data.upiId.trim(),
      defaultTaxRate: Number(data.defaultTaxRate),
      sacCode: data.sacCode.trim(),
    },
  });

  // Record Audit Log
  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'AGENCY_SETTINGS_UPDATED',
      entity: 'AgencySetting',
      entityId: setting.id,
      after: {
        gstin: setting.gstin,
        legalName: setting.legalName,
        bankName: setting.bankName,
      },
    },
  });

  revalidatePath('/admin/settings');
  revalidatePath('/admin/invoices');
  return { success: true };
}
