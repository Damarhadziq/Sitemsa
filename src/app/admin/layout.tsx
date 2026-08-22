'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // For /admin, /admin/login or dedicated builder pages (e.g. /buat-kuis), render clean full-screen layout without sidebar/admin header
  if (pathname === '/admin' || pathname === '/admin/login' || pathname.startsWith('/admin/guru/pelajaran/buat-kuis')) {
    return <div className="min-h-screen bg-white font-sans">{children}</div>;
  }

  return (
    <>
      {/* Mobile / Tablet Screen Guard (< 1024px): Desktop Only Overlay */}
      <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-xs space-y-5 animate-in fade-in zoom-in-95 duration-200">
          {/* Lottie Animation */}
          <div className="w-56 h-56 mx-auto relative flex items-center justify-center overflow-hidden">
            <iframe
              src="https://lottie.host/embed/0d0a0157-8644-49c4-8cea-c7ca68c0bc54/fapm5CmjTx.lottie"
              className="w-full h-full border-0 pointer-events-none"
              title="Desktop Only Lottie Animation"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-[#2E2D2D] leading-tight">
              Portal Admin Hanya Dapat Diakses di Perangkat Desktop
            </h2>
            <p className="text-xs text-[#737373] leading-relaxed">
              Silakan buka portal admin ini menggunakan laptop atau komputer Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Main Layout (>= 1024px) */}
      <div className="hidden lg:flex min-h-screen bg-white font-sans text-[#111827]">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-white">
          <AdminHeader />
          <main className="flex-1 p-6 lg:p-8 max-w-[1400px] w-full mx-auto bg-white">{children}</main>
        </div>
      </div>
    </>
  );
}
