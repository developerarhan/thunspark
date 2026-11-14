import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Route protection: redirect to login if unauthenticated
  if (!session?.user) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-base text-ink font-sans selection:bg-accent selection:text-canvas">
      <AdminSidebar user={session.user} />
      <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
