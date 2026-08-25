'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { saveStudentProfile } from '@/services/student-profile.service';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
      // Save temporary profile info
      saveStudentProfile({
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });

      // Redirect to OTP verification
      router.push(`/verifikasi-otp?from=signup&email=${encodeURIComponent(email.trim())}&name=${encodeURIComponent(name.trim())}`);
    }, 400);
  };

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      saveStudentProfile({
        name: 'Siswa SMKN 1 Semarang',
        email: 'siswa@belajar.id',
      });
      router.push('/lengkapi-profil');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Decorative squiggle */}
      <div className="absolute top-0 left-0 -translate-x-[10%] -translate-y-[20%] pointer-events-none opacity-40 sm:opacity-70">
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
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-10 max-w-xl mx-auto w-full">
        <div className="w-full max-w-[420px] animate-in fade-in duration-200">
          
          {/* Back button */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#737373] hover:text-[#2E2D2D] mb-5 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Halaman Masuk</span>
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E2D2D] tracking-tight mb-1.5">
              Daftar Akun Siswa
            </h1>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              Mulai perjalanan belajarmu di platform pembelajaran digital Sitemsa SMKN 1 Semarang.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-[10px] text-xs font-medium border border-red-200 animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {/* Nama Lengkap */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-medium text-[#292929]" htmlFor="name">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="contoh: Muhammad Rizky Pratama"
                required
                className="w-full h-[42px] sm:h-[46px] px-3.5 py-2.5 rounded-[10px] bg-[#f3f3f3] border border-transparent text-xs sm:text-sm text-[#292929] placeholder:text-[#aaaaaa] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
            </div>

            {/* Email Siswa */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-medium text-[#292929]" htmlFor="email">
                Email Siswa
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh: siswa@belajar.id"
                required
                className="w-full h-[42px] sm:h-[46px] px-3.5 py-2.5 rounded-[10px] bg-[#f3f3f3] border border-transparent text-xs sm:text-sm text-[#292929] placeholder:text-[#aaaaaa] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
            </div>

            {/* Kata Sandi */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-medium text-[#292929]" htmlFor="password">
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
                  className="w-full h-[42px] sm:h-[46px] px-3.5 py-2.5 rounded-[10px] bg-[#f3f3f3] border border-transparent text-xs sm:text-sm text-[#292929] placeholder:text-[#aaaaaa] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all outline-none pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-gray-900 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Kata Sandi */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-medium text-[#292929]" htmlFor="confirmPassword">
                Konfirmasi Kata Sandi
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                required
                className="w-full h-[42px] sm:h-[46px] px-3.5 py-2.5 rounded-[10px] bg-[#f3f3f3] border border-transparent text-xs sm:text-sm text-[#292929] placeholder:text-[#aaaaaa] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-[42px] sm:h-[46px] bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-semibold rounded-[10px] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-xs sm:text-sm cursor-pointer shadow-sm mt-2"
            >
              {isPending ? 'Mendaftarkan Akun...' : 'Lanjutkan ke Verifikasi OTP'}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 px-3 text-xs text-[#64748B]">atau</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Signup Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading}
              className="w-full h-[44px] sm:h-[48px] bg-white border border-gray-200 text-[#2E2D2D] font-semibold rounded-[10px] hover:bg-gray-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
              )}
              <span>{isGoogleLoading ? 'Menghubungkan Akun Google...' : 'Daftar dengan Akun Google'}</span>
            </button>

            {/* Login Link */}
            <div className="mt-4 text-center text-xs text-[#737373]">
              Sudah memiliki akun siswa?{' '}
              <Link href="/login" className="font-bold text-[#2563EB] hover:underline">
                Masuk di sini
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-100 text-center text-[11px] sm:text-xs text-gray-400">
        Copyright Lantip 7 SMKN 1 Semarang. 2026
      </footer>
    </div>
  );
}
