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
    <div className="min-h-screen bg-white flex font-sans text-[#111827]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-white">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 max-w-[1400px] w-full mx-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
