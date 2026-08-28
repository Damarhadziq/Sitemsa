'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithCredentials } = useAuth();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const reason = params.get('reason');
      if (reason === 'inactivity') {
        setSecurityNotice('Sesi Anda telah berakhir karena tidak ada aktivitas selama 30 menit. Silakan masuk kembali.');
      } else if (reason === 'concurrent_device') {
        setSecurityNotice('Akun Anda telah masuk di perangkat lain. Anda telah otomatis dikeluarkan dari perangkat ini demi keamanan.');
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanEmail = email.replace(/\s+/g, '').toLowerCase();
      if (!cleanEmail) {
        setErrorMsg('Silakan masukkan email pengelola atau guru.');
        setIsLoading(false);
        return;
      }
      const success = loginWithCredentials(cleanEmail, password);
      if (!success) {
        setErrorMsg('Email atau kata sandi pengelola / guru tidak sesuai. Silakan periksa kembali.');
        setIsLoading(false);
      }
    }, 250);
  };

  return (
    <>
      {/* Mobile / Tablet Screen Guard (< 1024px): Desktop Only Overlay with Lottie Animation */}
      <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-xs space-y-5 animate-in fade-in zoom-in-95 duration-200">
          {/* Lottie Animation */}
          <div className="w-56 h-56 mx-auto relative flex items-center justify-center overflow-hidden">
            <DotLottieReact
              src="https://lottie.host/0d0a0157-8644-49c4-8cea-c7ca68c0bc54/fapm5CmjTx.lottie"
              loop
              autoplay
              className="w-full h-full"
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

      {/* DESKTOP ADMIN LOGIN (>= 1024px) */}
      <div className="hidden lg:flex h-screen w-full flex-row bg-white font-sans text-[#2E2D2D] overflow-hidden select-none">
        {/* LEFT COLUMN: 60% IMAGE PANEL (ONLY LOGO AT TOP-LEFT, NO CHIP/OTHER CONTENT) */}
        <div className="lg:flex lg:w-[60%] relative bg-slate-900 p-8 xl:p-12 flex-col justify-between overflow-hidden">
          {/* Background Image with Dark Contrast Overlay */}
          {/* eslint-disable-next-next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
            alt="Workspace Sitemsa"
            className="absolute inset-0 w-full h-full object-cover opacity-60 select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-slate-900/30" />

          {/* Top-Left Brand Logo Only */}
          <div className="relative z-10">
            <span className="text-2xl font-bold text-white tracking-tight">Sitemsa</span>
          </div>

          {/* Bottom space empty */}
          <div className="relative z-10" />
        </div>

        {/* RIGHT COLUMN: 40% FORM CONTENT (DIRECT TO FORM, NO SCROLL) */}
        <div className="lg:w-[40%] h-full flex flex-col justify-between p-8 sm:p-12 xl:p-14 bg-white overflow-hidden">
          {/* Main Form Box */}
          <div className="my-auto w-full max-w-md mx-auto text-left space-y-6">
            {/* Title & Short Description */}
            <div className="space-y-1.5 text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2E2D2D] tracking-tight select-none">
                Masuk ke Akun Anda
              </h1>
              <p className="text-xs text-[#737373] leading-relaxed select-none">
                Masukkan email dan kata sandi pengelola atau guru untuk mengakses dashboard.
              </p>
            </div>

            {/* Security Notice / Inactivity / Device Notice Alert */}
            {securityNotice && (
              <div className="p-3 rounded-[8px] bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200 animate-in fade-in duration-200 flex items-start gap-2">
                <span className="shrink-0 font-bold">⚠️</span>
                <span className="leading-relaxed">{securityNotice}</span>
              </div>
            )}

            {/* Error Alert */}
            {errorMsg && (
              <div className="p-2.5 rounded-[8px] bg-red-50 text-red-600 text-xs font-medium border border-red-200 animate-in fade-in duration-200">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Email Field */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-[#2E2D2D] select-none" htmlFor="admin-email">
                  Email Pengelola / Guru
                </label>
                <input
                  id="admin-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cth: admin@sintesa.id"
                  autoComplete="email"
                  required
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-medium text-[#2E2D2D] placeholder:text-[#AAAAAA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all select-text"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-[#2E2D2D] select-none" htmlFor="admin-password">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    required
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-medium text-[#2E2D2D] placeholder:text-[#AAAAAA] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-all pr-10 select-text"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#2E2D2D] focus:outline-none cursor-pointer p-0.5"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-[8px] transition-colors disabled:opacity-70 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shadow-xs active:scale-[0.99] select-none"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <span>Masuk ke Dashboard</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Footer */}
          <div className="text-left select-none">
            <span className="text-[11px] text-[#737373]">
              Copyright Lantip 7 SMKN 1 Semarang. 2026
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
