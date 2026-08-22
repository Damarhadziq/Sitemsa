'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AdminIndexPage() {
  const router = useRouter();
  const { user, role, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/admin/login');
    } else if (role === 'superadmin') {
      router.replace('/admin/superadmin');
    } else {
      router.replace('/admin/guru');
    }
  }, [user, role, isLoading, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-[#2563EB]" />
        <span className="text-xs font-semibold text-[#737373]">Mengarahkan ke portal...</span>
      </div>
    </div>
  );
}
