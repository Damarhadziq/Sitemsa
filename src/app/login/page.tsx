'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, User, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authenticateStudent, OFFICIAL_DUMMY_STUDENT } from '@/services/student-profile.service';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAutofillDummyStudent = () => {
    setEmail('siswa@belajar.id');
    setPassword('SiswaSitemsa#2026');
    setErrorMessage('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();

      // Check if it's teacher or admin email
      if (cleanEmail.includes('guru') || cleanEmail.includes('admin')) {
        const adminSuccess = loginWithCredentials(cleanEmail, password);
        if (adminSuccess) {
          setSuccessMessage('Login berhasil sebagai Pengelola/Guru! Mengalihkan...');
          setTimeout(() => {
            if (cleanEmail.includes('admin') || cleanEmail === 'damar.guru@sitemsa.sch.id') {
              router.push('/admin/superadmin');
            } else {
              router.push('/admin/guru');
            }
          }, 400);
          return;
        }
      }

      // Check student authentication
      const studentAuth = authenticateStudent(cleanEmail, password);
      if (studentAuth.success) {
        setSuccessMessage('Login siswa berhasil! Selamat datang di Sitemsa.');
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        setErrorMessage(studentAuth.message || 'Email atau kata sandi tidak sesuai.');
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-[#2E2D2D]">
      {/* Navbar Minimalis */}
      <header className="w-full px-6 lg:px-16 py-4 flex items-center justify-between bg-white border-b border-[#ECECEC]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-[#2563EB]">Sitemsa</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] font-bold border border-blue-200">
            SMKN 1 Semarang
          </span>
        </Link>
        <Link
          href="/admin/login"
          className="text-xs font-semibold text-[#737373] hover:text-[#2563EB] flex items-center gap-1.5 transition-colors"
        >
          <span>Portal Guru & Pengelola</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl bg-white rounded-2xl border border-[#ECECEC] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT COLUMN: Hero & Features */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1E40AF] to-[#2563EB] p-8 lg:p-10 text-white flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-blue-100 border border-white/20">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Autentikasi Siswa Terpadu</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                  Kuasai Keahlian Vokasi Standar Industri
                </h1>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  Akses materi interaktif, bimbingan konseling karir, modul kejuruan, dan kuis terstruktur dalam satu platform.
                </p>
              </div>

              {/* Quick Info Box Akun Siswa Uji Coba */}
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">Akun Uji Coba Siswa</span>
                  <span className="text-[10px] bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full font-bold">Siap Pakai</span>
                </div>
                <div className="text-xs space-y-1 text-white font-mono bg-black/20 p-2.5 rounded-lg">
                  <p>Email: <span className="text-emerald-300">siswa@belajar.id</span></p>
                  <p>Pass : <span className="text-emerald-300">SiswaSitemsa#2026</span></p>
                </div>
                <button
                  type="button"
                  onClick={handleAutofillDummyStudent}
                  className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-blue-50 text-[#1E40AF] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Gunakan Akun Uji Coba</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/15 text-[11px] text-blue-100 flex items-center justify-between">
              <span>SMK Negeri 1 Semarang</span>
              <span>Lantip 7 • 2026</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Form Login */}
          <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#2E2D2D] tracking-tight">
                  Masuk ke Sitemsa
                </h2>
                <p className="text-xs text-[#737373] mt-1">
                  Masukkan email siswa resmi dan kata sandi Anda untuk memulai pembelajaran.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 animate-in fade-in">
                  {errorMessage}
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-600 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#2E2D2D]" htmlFor="student-email">
                    Email Siswa / Pengguna
                  </label>
                  <div className="relative">
                    <input
                      id="student-email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="cth: siswa@belajar.id"
                      required
                      className="w-full h-11 pl-10 pr-4 rounded-lg bg-slate-50 border border-[#ECECEC] text-xs font-medium text-[#2E2D2D] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#2E2D2D]" htmlFor="student-password">
                      Kata Sandi
                    </label>
                    <span className="text-[11px] text-[#2563EB] cursor-pointer hover:underline" onClick={handleAutofillDummyStudent}>
                      Isi Akun Uji Coba?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="student-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      required
                      className="w-full h-11 pl-10 pr-11 rounded-lg bg-slate-50 border border-[#ECECEC] text-xs font-medium text-[#2E2D2D] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-lg bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-70 mt-2"
                >
                  {isLoading ? (
                    <span>Memverifikasi akun...</span>
                  ) : (
                    <>
                      <span>Masuk ke Akun Siswa</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-[#ECECEC] flex items-center justify-between text-xs text-[#737373]">
                <span>Bukan siswa?</span>
                <Link href="/admin/login" className="font-semibold text-[#2563EB] hover:underline">
                  Masuk sebagai Guru / Pengelola ➔
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Minimalis */}
      <footer className="w-full px-6 py-4 text-center text-xs text-slate-400 bg-white border-t border-[#ECECEC]">
        Hak Cipta © 2026 Tim Pengembang PPL Lantip 7 SMK Negeri 1 Semarang. Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
}
