'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isStudentAuthenticated } from '@/services/student-profile.service';
import { useAuth } from '@/lib/auth-context';

export function StudentAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. If accessing login or admin routes, don't block
    if (pathname.startsWith('/login') || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      setIsChecking(false);
      setIsAuthorized(true);
      return;
    }

    // 2. Wait for auth context check
    if (isAuthLoading) return;

    const studentAuthed = isStudentAuthenticated();
    const hasActiveUser = !!user;

    if (studentAuthed || hasActiveUser) {
      setIsAuthorized(true);
      setIsChecking(false);
    } else {
      setIsAuthorized(false);
      setIsChecking(false);
      router.replace('/login');
    }
  }, [pathname, user, isAuthLoading, router]);

  // Public/exempt routes
  if (pathname.startsWith('/login') || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return <>{children}</>;
  }

  // During auth check, show clean minimalist loading spinner so no unauthenticated content is flashed
  if (isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#737373] animate-pulse">
            Memverifikasi sesi masuk Sitemsa...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
