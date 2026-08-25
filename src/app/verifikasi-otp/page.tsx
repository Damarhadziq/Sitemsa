'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

function OtpVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromAction = searchParams.get('from') || 'signup';
  const emailParam = searchParams.get('email') || 'siswa@belajar.id';
  const nameParam = searchParams.get('name') || 'Siswa';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numbers
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);
    setErrorMsg('');

    // Auto-focus next input
    if (cleanVal && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(59);
    setCanResend(false);
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');

    if (fullOtp.length < 4) {
      setErrorMsg('Masukkan 4-digit kode OTP lengkap.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);

      setTimeout(() => {
        if (fromAction === 'reset') {
          router.push('/login');
        } else {
          router.push(`/lengkapi-profil?name=${encodeURIComponent(nameParam)}&email=${encodeURIComponent(emailParam)}`);
        }
      }, 900);
    }, 600);
  };

  return (
    <div className="w-full max-w-[420px] animate-in fade-in duration-200">
      {/* Back button (Icon Only) */}
      <div className="mb-7">
        <button
          type="button"
          onClick={() => router.push(fromAction === 'reset' ? '/lupa-password' : '/signup')}
          className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] text-[#2E2D2D] hover:bg-[#F6F5FF] hover:border-[#2563EB] hover:text-[#2563EB] flex items-center justify-center transition-all cursor-pointer shadow-none shrink-0"
          aria-label="Kembali"
        >
          <ArrowLeft size={16} />
        </button>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E2D2D] tracking-tight mb-2">
          Verifikasi Kode OTP
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
          Kode 4-digit telah dikirimkan ke <strong className="text-[#2563EB] font-semibold">{emailParam}</strong>. Masukkan kode untuk melanjutkan.
        </p>
      </div>

      {isSuccess ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[12px] text-center space-y-2 animate-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h2 className="text-sm font-bold text-emerald-800">Verifikasi Berhasil!</h2>
          <p className="text-xs text-emerald-600">
            {fromAction === 'reset'
              ? 'Kata sandi baru telah diverifikasi. Mengalihkan ke login...'
              : 'Akun terverifikasi. Melanjutkan pengisian kelas & profil...'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-2.5 rounded-[10px] text-xs font-medium border border-red-200 animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* 4 Digit OTP Box Input (Clean Web Utama Style) */}
          <div className="flex justify-center gap-3 sm:gap-4 my-2">
            {[0, 1, 2, 3].map((idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={otp[idx]}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-13 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold text-[#2E2D2D] bg-[#FAFAFA] border border-[#ECECEC] rounded-[12px] focus:border-[#2563EB] focus:bg-white focus:outline-none transition-all shadow-none"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full h-[42px] sm:h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-semibold rounded-[10px] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-xs sm:text-sm cursor-pointer shadow-none"
          >
            {isVerifying ? 'Memverifikasi Kode...' : 'Konfirmasi & Lanjutkan'}
          </button>

          {/* Resend OTP area */}
          <div className="text-center pt-1">
            <p className="text-xs text-[#737373]">
              Tidak menerima kode?{' '}
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-bold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Kirim Ulang Kode
                </button>
              ) : (
                <span className="text-[#94a3b8] font-medium">
                  Kirim ulang dalam 00:{timer < 10 ? `0${timer}` : timer}
                </span>
              )}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

export default function OtpPage() {
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

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-10 max-w-xl mx-auto w-full">
        <Suspense fallback={<div className="text-center text-xs text-gray-400">Memuat verifikasi...</div>}>
          <OtpVerificationContent />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#ECECEC] text-center text-[11px] sm:text-xs text-gray-400">
        Copyright Lantip 7 SMKN 1 Semarang. 2026
      </footer>
    </div>
  );
}
