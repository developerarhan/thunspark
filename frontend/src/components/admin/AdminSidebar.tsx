'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users2,
  Building2,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Briefcase,
  TrendingUp,
  Receipt,
  Settings,
  Layers,
} from 'lucide-react';
import type { UserRole } from '@prisma/client';

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: UserRole;
  };
}

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Leads Pipeline',
    href: '/admin/leads',
    icon: Users2,
    badge: 'Live',
  },
  {
    name: 'Clients Directory',
    href: '/admin/clients',
    icon: Building2,
    badge: null,
  },
  {
    name: 'Projects & Retainers',
    href: '/admin/projects',
    icon: Briefcase,
    badge: 'Live',
    disabled: false,
  },
  {
    name: 'Ad Campaigns',
    href: '/admin/campaigns',
    icon: TrendingUp,
    badge: 'Live',
    disabled: false,
  },
  {
    name: 'Invoices & GST',
    href: '/admin/invoices',
    icon: Receipt,
    badge: 'Live',
    disabled: false,
  },
  {
    name: 'Content CMS',
    href: '/admin/content',
    icon: Layers,
    badge: 'Studio',
    disabled: false,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    badge: null,
    disabled: false,
  },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'AGENCY_OWNER':
        return 'Owner';
      case 'ACCOUNT_MANAGER':
        return 'Account Mgr';
      case 'GROWTH_STRATEGIST':
        return 'Strategist';
      default:
        return 'Staff';
    }
  };

  const navContent = (
    <div className="flex flex-col h-full bg-card border-r border-line p-4 sm:p-5">
      {/* Brand & Badge */}
      <div className="flex items-center justify-between pb-6 border-b border-line">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-accent group-hover:scale-105 transition-transform shrink-0"
          >
            <path
              d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
              fill="#FFD21F"
              stroke="#FFD21F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm tracking-tight text-ink">
              THUN<span className="text-accent">SPARK</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-meta">
              CRM & Operations
            </span>
          </div>
        </Link>
        <Link
          href="/"
          target="_blank"
          title="Open Public Website"
          className="text-meta hover:text-accent p-1.5 rounded-lg hover:bg-elevated transition-colors"
        >
          <ExternalLink size={15} />
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] font-mono uppercase tracking-widest text-meta">
          Core Modules
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin' || pathname === '/admin/dashboard'
              : pathname.startsWith(item.href);

          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-soft/50 text-xs font-medium cursor-not-allowed select-none"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={16} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-elevated/50 text-soft/40 border border-line/40">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/20 font-semibold'
                  : 'text-soft hover:text-ink hover:bg-elevated'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} className={isActive ? 'text-accent' : 'text-meta'} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30 font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="pt-4 border-t border-line space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-elevated border border-line flex items-center justify-center text-xs font-display font-bold text-accent shrink-0">
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'AG'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-ink truncate">
                {user.name || user.email}
              </span>
              <span className="text-[10px] font-mono text-meta">
                {getRoleBadge(user.role)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            title="Sign Out"
            className="p-1.5 rounded-lg text-meta hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-line sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-1.5 rounded-lg bg-elevated text-ink hover:text-accent cursor-pointer"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-display font-bold text-sm tracking-tight text-ink">
            THUN<span className="text-accent">SPARK</span> CRM
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 font-bold">
          {getRoleBadge(user.role)}
        </span>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-base/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
