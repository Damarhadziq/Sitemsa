'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from '@/components/ui/avatar';
import { authenticateStudent, saveStudentProfile, registerStudent } from '@/services/student-profile.service';
import { useAuth } from '@/lib/auth-context';
import { GoogleAccountModal, GoogleAccountOption } from '@/components/auth/GoogleAccountModal';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=/`,
          },
        });
        if (error) {
          setErrorMsg(error.message);
          setIsGoogleLoading(false);
        }
        return;
      } catch (err: any) {
        console.warn('OAuth fallback error:', err);
      }
    }

    setTimeout(() => {
      // Direct instant login with default Google account
      const defaultGoogleStudent = {
        name: 'Siswa Sitemsa',
        email: 'siswa@belajar.id',
        avatar: 'https://i.pravatar.cc/150?img=12',
        grade: 'X PPLG 1',
        school: 'SMK Negeri 1 Semarang',
      };

      registerStudent(defaultGoogleStudent);

      if (typeof document !== 'undefined') {
        document.cookie = 'sintesa_student_auth=true; path=/; max-age=2592000; SameSite=Lax';
        document.cookie = 'auth_student=siswa; path=/; max-age=2592000; SameSite=Lax';
        document.cookie = 'auth=true; path=/; max-age=2592000; SameSite=Lax';
        localStorage.setItem(
          'sintesa_student_session_v1',
          JSON.stringify({
            ...defaultGoogleStudent,
            role: 'siswa',
            loginTime: new Date().toISOString(),
          })
        );
      }

      window.location.href = '/';
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsPending(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();

      // Check if admin/teacher login
      if (cleanEmail.includes('guru') || cleanEmail.includes('admin') || cleanEmail.includes('superadmin')) {
        const adminSuccess = loginWithCredentials(cleanEmail, password);
        if (adminSuccess) {
          if (cleanEmail.includes('admin') || cleanEmail.includes('superadmin')) {
            window.location.href = '/admin/superadmin';
          } else {
            window.location.href = '/admin/guru';
          }
          return;
        }
      }

      // Authenticate student
      const studentAuth = authenticateStudent(cleanEmail, password);
      if (studentAuth.success) {
        window.location.href = '/';
      } else {
        setErrorMsg(studentAuth.message || 'Email atau kata sandi salah. Silakan periksa kembali.');
        setIsPending(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-[100dvh] h-[100dvh] lg:h-auto lg:min-h-screen bg-white flex flex-col justify-between relative overflow-hidden font-sans">
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

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 sm:px-12 lg:px-20 xl:px-28 pt-6 sm:pt-10 lg:pt-14 pb-4 sm:pb-8 max-w-7xl mx-auto w-full">
        
        {/* Mobile-Only Header: Big OG Dark Gray Logo + Motto (Centered) */}
        <div className="lg:hidden flex flex-col items-center text-center mb-8 sm:mb-10 w-full animate-in fade-in duration-200">
          <h1 className="text-[46px] sm:text-5xl font-extrabold text-[#2E2D2D] tracking-tight mb-2.5 leading-none">
            Sitemsa
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] font-medium max-w-[320px] leading-relaxed">
            Platform Pembelajaran Digital Vokasi SMK Negeri 1 Semarang
          </p>
        </div>

        {/* Desktop Left side - Info (Original Layout) */}
        <div className="hidden lg:flex w-full lg:w-1/2 flex-col justify-center lg:pr-12 xl:pr-20 mb-8 sm:mb-12 lg:mb-0">
          <h2 className="text-xl font-bold text-[#2E2D2D] mb-6 tracking-tight">Sitemsa</h2>

          <h1 className="text-[40px] font-bold text-[#2E2D2D] leading-[1.18] mb-4 tracking-tight">
            Kuasai Keahlian Baru<br />di Setiap Langkah
          </h1>

          <p className="text-base text-[#737373] mb-8 max-w-md leading-relaxed">
            Dari logika hingga seni, pelajari semua materi favoritmu dalam satu platform yang dirancang khusus untukmu.
          </p>

          <div className="flex items-center gap-3">
            <AvatarGroup>
              {[11, 12, 13, 14].map((id) => (
                <Avatar key={id} className="w-10 h-10">
                  <AvatarImage src={`https://i.pravatar.cc/100?img=${id}`} alt={`Student ${id}`} />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
            <p className="text-xs text-[#737373] font-medium leading-relaxed max-w-[340px]">
              Bergabunglah dengan ratusan siswa lainnya yang sudah membuktikan keseruan belajar di Sitemsa.
            </p>
          </div>
        </div>

        {/* Right side - Login Form (Web Utama Signature Style) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-full max-w-[420px]">
            <form onSubmit={handleSubmit} className="flex flex-col">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-2.5 rounded-[10px] text-xs font-medium border border-red-200 mb-3 sm:mb-4 animate-in fade-in">
                  {errorMsg}
                </div>
              )}

              {/* Form fields */}
              <div className="flex flex-col gap-3.5 sm:gap-4">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="email">
                    Email Siswa
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
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
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
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
                  <div className="flex justify-end items-center pt-0.5">
                    <Link href="/lupa-password" className="text-[11px] sm:text-xs font-semibold text-[#2563EB] hover:underline transition-colors">
                      Lupa kata sandi?
                    </Link>
                  </div>
                </div>
              </div>

              {/* Buttons area */}
              <div className="flex flex-col mt-4 sm:mt-5">
                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-[42px] sm:h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-semibold rounded-[10px] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-xs sm:text-sm cursor-pointer shadow-none"
                >
                  {isPending ? 'Memproses Masuk...' : 'Masuk ke Sitemsa'}
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-2 sm:py-2.5">
                  <div className="flex-grow border-t border-[#ECECEC]"></div>
                  <span className="flex-shrink-0 px-3 text-[11px] sm:text-xs text-[#737373]">atau</span>
                  <div className="flex-grow border-t border-[#ECECEC]"></div>
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
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
                  <span>{isGoogleLoading ? 'Menghubungkan Akun Google...' : 'Masuk dengan Google'}</span>
                </button>
              </div>

              {/* Desktop Sign up Link */}
              <div className="hidden lg:block mt-4 text-center text-xs text-[#737373]">
                Belum memiliki akun siswa?{' '}
                <Link href="/signup" className="font-bold text-[#2563EB] hover:underline">
                  Daftar Sekarang
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile-Only Bottom: Replace footer with signup text */}
      <div className="lg:hidden text-center text-xs text-[#737373] pb-6 pt-1 px-6">
        Belum memiliki akun siswa?{' '}
        <Link href="/signup" className="font-bold text-[#2563EB] hover:underline">
          Daftar Sekarang
        </Link>
      </div>

      {/* Desktop Footer Only */}
      <footer className="hidden lg:flex items-center justify-between gap-3 px-6 sm:px-12 lg:px-20 xl:px-28 py-4 sm:py-5 border-t border-[#ECECEC] max-w-7xl mx-auto w-full">
        {/* Social icons - left */}
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:opacity-60 transition-opacity">
            {/* Instagram */}
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#ig)">
                <path d="M14 2.52109C17.7406 2.52109 18.1836 2.5375 19.6547 2.60312C21.0219 2.66328 21.7602 2.89297 22.2523 3.08438C22.9031 3.33594 23.3734 3.64219 23.8602 4.12891C24.3523 4.62109 24.6531 5.08594 24.9047 5.73672C25.0961 6.22891 25.3258 6.97266 25.3859 8.33437C25.4516 9.81094 25.468 10.2539 25.468 13.9891C25.468 17.7297 25.4516 18.1727 25.3859 19.6438C25.3258 21.0109 25.0961 21.7492 24.9047 22.2414C24.6531 22.8922 24.3469 23.3625 23.8602 23.8492C23.368 24.3414 22.9031 24.6422 22.2523 24.8938C21.7602 25.0852 21.0164 25.3148 19.6547 25.375C18.1781 25.4406 17.7352 25.457 14 25.457C10.2594 25.457 9.81641 25.4406 8.34531 25.375C6.97813 25.3148 6.23984 25.0852 5.74766 24.8938C5.09688 24.6422 4.62656 24.3359 4.13984 23.8492C3.64766 23.357 3.34687 22.8922 3.09531 22.2414C2.90391 21.7492 2.67422 21.0055 2.61406 19.6438C2.54844 18.1672 2.53203 17.7242 2.53203 13.9891C2.53203 10.2484 2.54844 9.80547 2.61406 8.33437C2.67422 6.96719 2.90391 6.22891 3.09531 5.73672C3.34687 5.08594 3.65312 4.61562 4.13984 4.12891C4.63203 3.63672 5.09688 3.33594 5.74766 3.08438C6.23984 2.89297 6.98359 2.66328 8.34531 2.60312C9.81641 2.5375 10.2594 2.52109 14 2.52109ZM14 0C10.1992 0 9.72344 0.0164062 8.23047 0.0820312C6.74297 0.147656 5.72031 0.388281 4.83438 0.732812C3.91016 1.09375 3.12813 1.56953 2.35156 2.35156C1.56953 3.12812 1.09375 3.91016 0.732812 4.82891C0.388281 5.72031 0.147656 6.7375 0.0820313 8.225C0.0164063 9.72344 0 10.1992 0 14C0 17.8008 0.0164063 18.2766 0.0820313 19.7695C0.147656 21.257 0.388281 22.2797 0.732812 23.1656C1.09375 24.0898 1.56953 24.8719 2.35156 25.6484C3.12813 26.425 3.91016 26.9062 4.82891 27.2617C5.72031 27.6062 6.7375 27.8469 8.225 27.9125C9.71797 27.9781 10.1937 27.9945 13.9945 27.9945C17.7953 27.9945 18.2711 27.9781 19.7641 27.9125C21.2516 27.8469 22.2742 27.6062 23.1602 27.2617C24.0789 26.9062 24.8609 26.425 25.6375 25.6484C26.4141 24.8719 26.8953 24.0898 27.2508 23.1711C27.5953 22.2797 27.8359 21.2625 27.9016 19.775C27.9672 18.282 27.9836 17.8063 27.9836 14.0055C27.9836 10.2047 27.9672 9.72891 27.9016 8.23594C27.8359 6.74844 27.5953 5.72578 27.2508 4.83984C26.9062 3.91016 26.4305 3.12812 25.6484 2.35156C24.8719 1.575 24.0898 1.09375 23.1711 0.738281C22.2797 0.39375 21.2625 0.153125 19.775 0.0875C18.2766 0.0164063 17.8008 0 14 0Z" fill="#2E2D2D"/>
                <path d="M14 6.80859C10.0297 6.80859 6.80859 10.0297 6.80859 14C6.80859 17.9703 10.0297 21.1914 14 21.1914C17.9703 21.1914 21.1914 17.9703 21.1914 14C21.1914 10.0297 17.9703 6.80859 14 6.80859ZM14 18.6648C11.4242 18.6648 9.33516 16.5758 9.33516 14C9.33516 11.4242 11.4242 9.33516 14 9.33516C16.5758 9.33516 18.6648 11.4242 18.6648 14C18.6648 16.5758 16.5758 18.6648 14 18.6648Z" fill="#2E2D2D"/>
                <path d="M23.1547 6.52425C23.1547 7.45394 22.4 8.20316 21.4758 8.20316C20.5461 8.20316 19.7969 7.44847 19.7969 6.52425C19.7969 5.59456 20.5516 4.84534 21.4758 4.84534C22.4 4.84534 23.1547 5.60003 23.1547 6.52425Z" fill="#2E2D2D"/>
              </g>
              <defs><clipPath id="ig"><rect width="28" height="28" fill="white"/></clipPath></defs>
            </svg>
          </Link>
          <Link href="#" className="hover:opacity-60 transition-opacity">
            {/* TikTok */}
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.0393 10.1074C21.8398 11.3991 24.0456 12.1591 26.428 12.1591V7.55842C25.9771 7.55852 25.5274 7.51133 25.0863 7.41754V11.039C22.7042 11.039 20.4986 10.2789 18.6976 8.98734V18.3761C18.6976 23.0728 14.9037 26.8799 10.224 26.8799C8.47783 26.8799 6.85488 26.3502 5.5067 25.4416C7.04543 27.0205 9.19131 28 11.5653 28C16.2454 28 20.0395 24.1928 20.0395 19.4959V10.1074H20.0393V10.1074ZM21.6944 5.46587C20.7742 4.45697 20.17 3.15316 20.0393 1.71174V1.12H18.7678C19.0879 2.95204 20.1795 4.51722 21.6944 5.46587ZM8.46664 21.8375C7.95251 21.161 7.67468 20.3334 7.67593 19.4825C7.67593 17.3344 9.41123 15.5927 11.5521 15.5927C11.9511 15.5926 12.3477 15.6539 12.728 15.775V11.0714C12.2836 11.0103 11.8351 10.9844 11.3869 10.9939V14.6549C11.0063 14.5338 10.6095 14.4723 10.2105 14.4727C8.06956 14.4727 6.33435 16.2142 6.33435 18.3626C6.33435 19.8817 7.20171 21.1968 8.46664 21.8375Z" fill="#FF004F"/>
              <path d="M18.6975 8.98725C20.4986 10.2789 22.7041 11.0389 25.0863 11.0389V7.41745C23.7566 7.1332 22.5794 6.43584 21.6944 5.46587C20.1793 4.51713 19.0878 2.95194 18.7678 1.12H15.4281V19.4958C15.4205 21.638 13.6882 23.3726 11.5519 23.3726C10.293 23.3726 9.1746 22.7704 8.46629 21.8375C7.20147 21.1968 6.3341 19.8816 6.3341 18.3627C6.3341 16.2145 8.06931 14.4728 10.2102 14.4728C10.6204 14.4728 11.0158 14.5369 11.3866 14.655V10.994C6.78908 11.0893 3.09155 14.8593 3.09155 19.4958C3.09155 21.8104 4.01232 23.9086 5.50674 25.4417C6.85492 26.3502 8.47787 26.88 10.224 26.88C14.9038 26.88 18.6976 23.0727 18.6976 18.3761V8.98725H18.6975Z" fill="#2E2D2D"/>
              <path d="M25.0863 7.41743V6.43823C23.8872 6.44006 22.7117 6.10305 21.6944 5.46576C22.5949 6.45524 23.7808 7.13751 25.0863 7.41743ZM18.7678 1.11998C18.7373 0.944897 18.7138 0.76866 18.6976 0.59175V0H14.0864V18.3759C14.079 20.5179 12.3467 22.2525 10.2102 22.2525C9.583 22.2525 8.99078 22.1031 8.46632 21.8376C9.17463 22.7703 10.293 23.3725 11.5519 23.3725C13.688 23.3725 15.4207 21.6381 15.4281 19.4958V1.11998H18.7678ZM11.3868 10.994V9.95154C11.0015 9.89869 10.6131 9.87217 10.2241 9.87236C5.5439 9.87226 1.75 13.6796 1.75 18.3759C1.75 21.3203 3.24107 23.9151 5.50686 25.4415C4.01245 23.9085 3.09168 21.8102 3.09168 19.4957C3.09168 14.8593 6.78911 11.0893 11.3868 10.994Z" fill="#00F2EA"/>
            </svg>
          </Link>
          <Link href="#" className="hover:opacity-60 transition-opacity">
            {/* Threads */}
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.6408 12.9775C20.5202 12.9197 20.3977 12.864 20.2736 12.8107C20.0575 8.82849 17.8815 6.54865 14.2278 6.52531C14.2112 6.52521 14.1948 6.52521 14.1782 6.52521C11.9928 6.52521 10.1753 7.45805 9.05655 9.15552L11.066 10.534C11.9017 9.266 13.2133 8.9957 14.1792 8.9957C14.1903 8.9957 14.2015 8.9957 14.2126 8.9958C15.4156 9.00347 16.3234 9.35325 16.911 10.0354C17.3386 10.532 17.6246 11.2182 17.7662 12.0843C16.6995 11.903 15.546 11.8473 14.3128 11.918C10.839 12.1181 8.6058 14.1441 8.75578 16.9592C8.8319 18.3872 9.5433 19.6157 10.7589 20.4183C11.7866 21.0967 13.1103 21.4285 14.486 21.3534C16.3027 21.2537 17.7279 20.5606 18.7222 19.2932C19.4774 18.3307 19.955 17.0834 20.1658 15.5117C21.0317 16.0342 21.6733 16.7218 22.0277 17.5484C22.6303 18.9535 22.6654 21.2625 20.7814 23.1449C19.1307 24.794 17.1465 25.5074 14.1478 25.5294C10.8215 25.5048 8.30577 24.438 6.67015 22.3587C5.13852 20.4117 4.34697 17.5995 4.31744 14C4.34697 10.4005 5.13852 7.58823 6.67015 5.64123C8.30577 3.56196 10.8214 2.49521 14.1478 2.47049C17.4983 2.4954 20.0578 3.56729 21.756 5.65658C22.5887 6.68115 23.2165 7.96962 23.6304 9.47192L25.9852 8.84365C25.4835 6.99449 24.6941 5.40104 23.6199 4.07954C21.4428 1.40097 18.2586 0.0284591 14.156 0H14.1396C10.0452 0.0283602 6.89677 1.4061 4.78164 4.0949C2.89945 6.4876 1.92857 9.81687 1.89595 13.9902L1.89584 14L1.89595 14.0098C1.92857 18.1831 2.89945 21.5125 4.78164 23.9051C6.89677 26.5939 10.0452 27.9717 14.1396 28H14.156C17.7961 27.9748 20.3618 27.0217 22.4756 24.9099C25.241 22.1471 25.1577 18.684 24.2463 16.5581C23.5923 15.0335 22.3456 13.7953 20.6408 12.9775ZM14.3559 18.8864C12.8334 18.9722 11.2517 18.2888 11.1737 16.8251C11.1159 15.7398 11.9461 14.5288 14.4494 14.3845C14.736 14.368 15.0173 14.3599 15.2937 14.3599C16.203 14.3599 17.0536 14.4482 17.827 14.6173C17.5385 18.2197 15.8466 18.8046 14.3559 18.8864Z" fill="#2E2D2D"/>
            </svg>
          </Link>
        </div>

        {/* Copyright - right */}
        <span className="text-[11px] sm:text-xs text-gray-400 text-center sm:text-right">
          Copyright Lantip 7 SMKN 1 Semarang. 2026
        </span>
      </footer>
    </div>
  );
}
