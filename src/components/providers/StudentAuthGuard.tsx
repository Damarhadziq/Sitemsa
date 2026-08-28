'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isStudentAuthenticated, syncStudentProfileFromSupabase } from '@/services/student-profile.service';
import { useAuth } from '@/lib/auth-context';

export function StudentAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAuthFlowRoute = 
    pathname === '/' ||
    pathname.startsWith('/login') || 
    pathname.startsWith('/signup') || 
    pathname.startsWith('/register') || 
    pathname.startsWith('/lupa-password') || 
    pathname.startsWith('/verifikasi-otp') || 
    pathname.startsWith('/lengkapi-profil') || 
    pathname.startsWith('/auth') || 
    pathname.startsWith('/tips-belajar') || 
    pathname.startsWith('/dokumentasi') || 
    pathname.startsWith('/team') || 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/api');

  useEffect(() => {
    const handleLogoutStart = () => {
      setIsLoggingOut(true);
    };
    window.addEventListener('sintesa-logging-out', handleLogoutStart);
    return () => window.removeEventListener('sintesa-logging-out', handleLogoutStart);
  }, []);

  useEffect(() => {
    // 1. If accessing public/auth flow or admin routes, don't block
    if (isAuthFlowRoute) {
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
      // Sync latest profile data from Supabase
      syncStudentProfileFromSupabase();
    } else {
      setIsAuthorized(false);
      setIsChecking(false);
      router.replace('/login');
    }
  }, [pathname, user, isAuthLoading, isAuthFlowRoute, router]);

  // If currently logging out, render full page skeleton transition overlay
  if (isLoggingOut) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white font-sans">
        <div className="w-full max-w-4xl px-6 space-y-6 animate-pulse">
          <div className="h-10 bg-gray-100 rounded-[10px] w-48" />
          <div className="h-40 bg-gray-100 rounded-[12px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-100 rounded-[10px]" />
            <div className="h-32 bg-gray-100 rounded-[10px]" />
            <div className="h-32 bg-gray-100 rounded-[10px]" />
          </div>
        </div>
      </div>
    );
  }

  // Public/exempt routes
  if (isAuthFlowRoute) {
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
