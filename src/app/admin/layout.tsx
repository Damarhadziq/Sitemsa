'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // For /admin/login page, render standard full-screen white layout
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-white font-sans">{children}</div>;
  }

  return (
    <>
      {/* Mobile / Tablet Screen Guard (< 1024px): Desktop Only Overlay */}
      <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-64 h-64 mx-auto relative flex items-center justify-center">
            <iframe
              src="https://lottie.host/embed/fce576c6-975f-4133-b265-aac53ff316c1/HbOBKAMBQP.lottie"
              className="w-full h-full border-0 pointer-events-none"
              title="Desktop Only Animation"
            />
          </div>

          <div className="space-y-2.5">
            <h2 className="text-xl font-bold text-[#2E2D2D] leading-tight">
              Portal Admin Hanya Dapat Diakses di Perangkat Desktop
            </h2>
            <p className="text-xs text-[#737373] leading-relaxed">
              Untuk pengalaman terbaik, kenyamanan navigasi, serta kemudahan mengelola modul & kuis, silakan buka portal admin ini menggunakan laptop atau komputer Anda.
            </p>
          </div>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100 shadow-2xs">
              <span>Rekomendasi Lebar Layar Minimal: 1024px</span>
            </span>
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
