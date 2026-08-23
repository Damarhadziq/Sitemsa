'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithCredentials } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      if (!email.trim()) {
        setErrorMsg('Silakan masukkan email pengelola atau guru.');
        setIsLoading(false);
        return;
      }
      const success = loginWithCredentials(email, password);
      if (!success) {
        setErrorMsg('Email atau kata sandi tidak valid.');
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-white font-sans text-[#2E2D2D] overflow-hidden select-none">
      {/* LEFT COLUMN: 60% IMAGE PANEL (ONLY LOGO AT TOP-LEFT, NO CHIP/OTHER CONTENT) */}
      <div className="hidden lg:flex lg:w-[60%] relative bg-slate-900 p-8 xl:p-12 flex-col justify-between overflow-hidden">
        {/* Background Image with Dark Contrast Overlay */}
        {/* eslint-disable-next-next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop"
          alt="Workspace Sitemsa"
          className="absolute inset-0 w-full h-full object-cover opacity-60 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-slate-900/30" />

        {/* Top-Left Brand Logo Only (Hanya nama logo tanpa chip/elemen lain) */}
        <div className="relative z-10">
          <span className="text-2xl font-bold text-white tracking-tight">Sitemsa</span>
        </div>

        {/* Bottom space empty */}
        <div className="relative z-10" />
      </div>

      {/* RIGHT COLUMN: 40% FORM CONTENT (DIRECT TO FORM, NO SCROLL) */}
      <div className="w-full lg:w-[40%] h-full flex flex-col justify-between p-8 sm:p-12 xl:p-14 bg-white overflow-hidden">
        {/* Mobile brand fallback */}
        <div className="lg:hidden flex items-center gap-2 pb-2">
          <span className="text-xl font-bold text-[#2E2D2D] tracking-tight">Sitemsa</span>
        </div>

        {/* Main Form Box (Centered in Right Column for Equal Left/Right Whitespace) */}
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

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-2.5 rounded-[8px] bg-red-50 text-red-600 text-xs font-medium border border-red-200 animate-in fade-in duration-200">
              {errorMsg}
            </div>
          )}

          {/* Form with Proportional Dashboard Style */}
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
                className="w-full h-10 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-[8px] transition-colors disabled:opacity-70 flex items-center justify-center text-xs sm:text-sm cursor-pointer shadow-xs active:scale-[0.99] select-none"
              >
                {isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note (Aligned with Form Container) */}
        <div className="w-full max-w-md mx-auto text-xs text-[#737373] text-left pt-2 select-none">
          Copyright Lantip 7 SMKN 1 Semarang. 2026
        </div>
      </div>
    </div>
  );
}
