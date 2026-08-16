'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, UserCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans">
      {/* Decorative wave background top left */}
      <div className="absolute top-0 left-0 -translate-x-[10%] -translate-y-[20%] pointer-events-none">
        <svg width="360" height="280" viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M-40,80 C20,-20 60,160 120,60 C180,-40 220,180 300,80"
            stroke="#c7d0f8"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col lg:flex-row items-center px-6 lg:px-20 xl:px-28 pt-20 pb-8">
        
        {/* Left Side: Brand Context & Admin Role Intro */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center lg:pr-16 xl:pr-24 mb-12 lg:mb-0">
          <div className="flex items-center gap-2.5 mb-10">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Sitemsa</h2>
            <span className="text-xs bg-[#E8E7FF] text-[#2563EB] font-bold px-2.5 py-0.5 rounded-[4px]">
              Portal Admin & Guru
            </span>
          </div>

          <h1 className="text-3xl sm:text-[2.75rem] lg:text-5xl font-bold text-gray-900 leading-[1.15] mb-6">
            Kelola Konten &<br />Monitoring Pembelajaran
          </h1>

          <p className="text-base text-gray-500 mb-10 max-w-md leading-relaxed">
            Portal autentikasi khusus bagi Superadmin untuk mengelola website utama dan hak akses guru, serta Admin Guru untuk manajemen pelajaran dan siswa.
          </p>

          <div className="space-y-3 max-w-md">
            <div className="flex items-center gap-3 p-3.5 rounded-[12px] bg-white border border-[#ECECEC]">
              <div className="p-2 rounded-[8px] bg-[#E8E7FF] text-[#2563EB]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Peran Superadmin</h4>
                <p className="text-xs text-gray-500">Kelola akun guru, hak akses mapel, & konten utama website.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-[12px] bg-white border border-[#ECECEC]">
              <div className="p-2 rounded-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Peran Admin Guru</h4>
                <p className="text-xs text-gray-500">Manajemen modul materi, kuis, & monitoring nilai siswa.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-full max-w-[451px]">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">Masuk Portal Admin</h3>
                <p className="text-sm text-gray-500 mt-1">Masukkan kredensial akun pengelola Anda di bawah ini.</p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-[10px] text-base border border-red-200 mb-6">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-6">
                {/* Email */}
                <div className="flex flex-col gap-[10px]">
                  <label className="text-base font-medium text-[#292929]" htmlFor="admin-email">
                    Email Pengelola / Guru
                  </label>
                  <input
                    id="admin-email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email (cth: admin@sintesa.id)"
                    className="w-full h-[47px] px-3 py-[14px] rounded-[10px] bg-[#f3f3f3] border border-transparent text-base text-[#292929] placeholder:text-[#aaaaaa] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-[10px]">
                  <label className="text-base font-medium text-[#292929]" htmlFor="admin-password">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full h-[47px] px-3 py-[14px] rounded-[10px] bg-[#f3f3f3] border border-transparent text-base text-[#292929] placeholder:text-[#aaaaaa] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all outline-none pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#292929] hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex flex-col mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[47px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-[10px] transition-colors disabled:opacity-70 flex justify-center items-center text-base cursor-pointer"
                >
                  {isLoading ? 'Masuk...' : 'Masuk Portal Manajemen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-6 lg:px-20 xl:px-28 py-6 border-t border-[#ECECEC]">
        <span className="text-xs text-gray-400">
          Copyright Lantip 7 SMKN 1 Semarang. 2026
        </span>
        <span className="text-xs text-gray-400">
          Akses Terproteksi Pengelola & Guru
        </span>
      </footer>
    </div>
  );
}
