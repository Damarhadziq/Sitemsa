'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { saveStudentProfile, registerStudent } from '@/services/student-profile.service';
import { GoogleAccountModal, GoogleAccountOption } from '@/components/auth/GoogleAccountModal';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }

    setIsPending(true);

    setTimeout(() => {
      // Register student credentials persistently
      registerStudent({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      // Redirect to OTP verification
      router.push(`/verifikasi-otp?from=signup&email=${encodeURIComponent(email.trim())}&name=${encodeURIComponent(name.trim())}`);
    }, 300);
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const defaultGoogleStudent = {
        name: 'Siswa Sitemsa',
        email: 'siswa@belajar.id',
        avatar: 'https://i.pravatar.cc/150?img=12',
        grade: 'X PPLG 1',
        school: 'SMK Negeri 1 Semarang',
      };

      registerStudent(defaultGoogleStudent);
      router.push(`/lengkapi-profil?name=${encodeURIComponent(defaultGoogleStudent.name)}&email=${encodeURIComponent(defaultGoogleStudent.email)}`);
    }, 350);
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Decorative squiggle - Desktop Only */}
      <div className="hidden lg:block absolute top-0 left-0 -translate-x-[10%] -translate-y-[20%] pointer-events-none opacity-70">
        <svg width="320" height="240" viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M-40,80 C20,-20 60,160 120,60 C180,-40 220,180 300,80"
            stroke="#c7d0f8"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col justify-start items-center px-6 sm:px-12 pt-[64px] pb-8 max-w-xl mx-auto w-full">
        <div className="w-full max-w-[420px] animate-in fade-in duration-200">
          
          {/* Back button (Icon Only - without copy) */}
          <div className="mb-7">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] text-[#2E2D2D] hover:bg-[#F6F5FF] hover:border-[#2563EB] hover:text-[#2563EB] flex items-center justify-center transition-all cursor-pointer shadow-none shrink-0"
              aria-label="Kembali"
            >
              <ArrowLeft size={16} />
            </button>
          </div>

          {/* Headline (Tanpa Subtitle) */}
          <div className="mb-8 sm:mb-9">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E2D2D] tracking-tight">
              Daftar Akun Siswa
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-4.5">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-2.5 rounded-[10px] text-xs font-medium border border-red-200 animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {/* Nama Lengkap */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="name">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="contoh: Muhammad Rizky Pratama"
                required
                className="w-full h-[42px] sm:h-[44px] px-3.5 py-2.5 rounded-[10px] bg-[#FAFAFA] border border-[#ECECEC] text-xs sm:text-sm text-[#2E2D2D] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-none"
              />
            </div>

            {/* Email Siswa */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="email">
                Email Siswa
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh: siswa@belajar.id"
                required
                className="w-full h-[42px] sm:h-[44px] px-3.5 py-2.5 rounded-[10px] bg-[#FAFAFA] border border-[#ECECEC] text-xs sm:text-sm text-[#2E2D2D] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-none"
              />
            </div>

            {/* Kata Sandi */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="password">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full h-[42px] sm:h-[44px] px-3.5 py-2.5 rounded-[10px] bg-[#FAFAFA] border border-[#ECECEC] text-xs sm:text-sm text-[#2E2D2D] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-none pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#2E2D2D] focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Kata Sandi (Dengan icon Eye) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="confirmPassword">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  required
                  className="w-full h-[42px] sm:h-[44px] px-3.5 py-2.5 rounded-[10px] bg-[#FAFAFA] border border-[#ECECEC] text-xs sm:text-sm text-[#2E2D2D] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-none pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#2E2D2D] focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Buttons Area with Added Spacing */}
            <div className="flex flex-col mt-6 sm:mt-7">
              {/* Submit Button ("Verifikasi") */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-[42px] sm:h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-semibold rounded-[10px] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-xs sm:text-sm cursor-pointer shadow-none"
              >
                {isPending ? 'Memproses...' : 'Verifikasi'}
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-2.5 sm:py-3">
                <div className="flex-grow border-t border-[#ECECEC]"></div>
                <span className="flex-shrink-0 px-3 text-[11px] sm:text-xs text-[#737373]">atau</span>
                <div className="flex-grow border-t border-[#ECECEC]"></div>
              </div>

              {/* Google Signup Button */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading || isPending}
                className="w-full h-[42px] sm:h-[44px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold rounded-[10px] hover:bg-[#FAFAFA] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shadow-none disabled:opacity-70"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                <span>{isGoogleLoading ? 'Menghubungkan Akun Google...' : 'Daftar dengan Akun Google'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Replacement: Sign in copy layout matching sign in page */}
      <div className="text-center text-xs text-[#737373] pb-6 pt-2 px-6">
        Sudah memiliki akun siswa?{' '}
        <Link href="/login" className="font-bold text-[#2563EB] hover:underline">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
