'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function LupaPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    setTimeout(() => {
      // Redirect to OTP verification page
      router.push(`/verifikasi-otp?from=reset&email=${encodeURIComponent(email.trim())}`);
    }, 400);
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
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#737373] hover:text-[#2E2D2D] mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Halaman Masuk</span>
          </Link>

          {/* Header */}
          <div className="text-center sm:text-left mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E2D2D] tracking-tight mb-2">
              Lupa Kata Sandi?
            </h1>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              Masukkan alamat email terdaftar akun siswamu. Kami akan mengirimkan 4-digit kode OTP untuk verifikasi reset kata sandi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 sm:gap-2">
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

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-[42px] sm:h-[46px] bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-semibold rounded-[10px] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-xs sm:text-sm cursor-pointer shadow-sm mt-2"
            >
              {isPending ? 'Mengirim Kode OTP...' : 'Kirim Kode Verifikasi'}
            </button>
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
