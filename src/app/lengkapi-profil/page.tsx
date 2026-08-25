'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveStudentProfile } from '@/services/student-profile.service';
import { addUserNotification } from '@/services/notification.service';
import { CheckCircle2, School, GraduationCap, Sparkles, ArrowLeft } from 'lucide-react';

const JURUSAN_LIST = [
  'Pengembangan Perangkat Lunak & Gim (PPLG)',
  'Teknik Jaringan Komputer & Telekomunikasi (TJKT)',
  'Teknik Elektronika Industri',
  'Teknik Ketenagalistrikan',
  'Teknik Otomotif',
  'Teknik Mesin',
  'Seni Tari & Pertunjukan',
  'Desain Komunikasi Visual (DKV)',
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialName = searchParams.get('name') || 'Muhammad Rizky Pratama';
  const initialEmail = searchParams.get('email') || 'siswa@belajar.id';

  const [name, setName] = useState(initialName);
  const [selectedGrade, setSelectedGrade] = useState('X');
  const [selectedMajor, setSelectedMajor] = useState(JURUSAN_LIST[0]);
  const [nisn, setNisn] = useState('0082918239');
  const [school, setSchool] = useState('SMK Negeri 1 Semarang');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      saveStudentProfile({
        name: name.trim(),
        email: initialEmail,
        nisn: nisn.trim(),
        school: school,
        grade: `${selectedGrade} ${selectedMajor.split(' ')[0]}`,
      });

      // Set cookie for student auth
      if (typeof document !== 'undefined') {
        document.cookie = 'sintesa_student_auth=true; path=/; max-age=2592000; SameSite=Lax';
        localStorage.setItem(
          'sintesa_student_session_v1',
          JSON.stringify({
            email: initialEmail,
            name: name.trim(),
            role: 'siswa',
            school: school,
            grade: selectedGrade,
            major: selectedMajor,
            loginTime: new Date().toISOString(),
          })
        );
      }

      // Add dynamic welcome notification
      addUserNotification({
        type: 'sistem',
        title: 'Selamat Datang di Sitemsa!',
        message: `Halo ${name.split(' ')[0]} (${selectedGrade} - ${selectedMajor.split('(')[0]}), profilmu telah aktif. Selamat belajar!`,
        linkUrl: '/materi',
      });

      setIsSuccess(true);

      setTimeout(() => {
        router.push('/');
      }, 700);
    }, 500);
  };

  return (
    <div className="w-full max-w-[480px] animate-in fade-in duration-200">
      {/* Back button (Icon Only) */}
      <div className="mb-7">
        <button
          type="button"
          onClick={() => router.push('/signup')}
          className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] text-[#2E2D2D] hover:bg-[#F6F5FF] hover:border-[#2563EB] hover:text-[#2563EB] flex items-center justify-center transition-all cursor-pointer shadow-none shrink-0"
          aria-label="Kembali"
        >
          <ArrowLeft size={16} />
        </button>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8E7FF] text-[#2563EB] text-[11px] font-semibold mb-2">
          <Sparkles size={13} />
          <span>Langkah Terakhir Pendaftaran</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E2D2D] tracking-tight mb-1.5">
          Lengkapi Data Siswa
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
          Pilih tingkatan kelas dan jurusanmu agar materi serta kuis yang disajikan sesuai kurikulum belajarmu.
        </p>
      </div>

      {isSuccess ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[12px] text-center space-y-2 animate-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h2 className="text-sm font-bold text-emerald-800">Pendaftaran Berhasil!</h2>
          <p className="text-xs text-emerald-600">
            Mengalihkan ke beranda belajar Sitemsa...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Lengkap */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="name">
              Nama Lengkap Siswa
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-[42px] sm:h-[44px] px-3.5 py-2.5 rounded-[10px] bg-[#FAFAFA] border border-[#ECECEC] text-xs sm:text-sm text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-none"
            />
          </div>

          {/* Pilihan Tingkat Kelas */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#2E2D2D]">
              Tingkatan Kelas
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {['X', 'XI', 'XII'].map((grade) => {
                const isSelected = selectedGrade === grade;
                return (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setSelectedGrade(grade)}
                    className={`py-2.5 rounded-[10px] text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-none'
                        : 'bg-[#FAFAFA] text-[#4A4A4A] border-[#ECECEC] hover:bg-white hover:border-[#2563EB]/40'
                    }`}
                  >
                    <GraduationCap size={15} />
                    <span>Kelas {grade}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Program Keahlian / Jurusan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="major">
              Program Keahlian / Jurusan
            </label>
            <select
              id="major"
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="w-full h-[42px] sm:h-[44px] px-3.5 py-2 rounded-[10px] bg-[#FAFAFA] border border-[#ECECEC] text-xs sm:text-sm text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-none cursor-pointer"
            >
              {JURUSAN_LIST.map((jurusan) => (
                <option key={jurusan} value={jurusan}>
                  {jurusan}
                </option>
              ))}
            </select>
          </div>

          {/* NIS / NISN */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="nisn">
              NISN / Nomor Induk Siswa
            </label>
            <input
              id="nisn"
              type="text"
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              placeholder="contoh: 0082918239"
              required
              className="w-full h-[42px] sm:h-[44px] px-3.5 py-2.5 rounded-[10px] bg-[#FAFAFA] border border-[#ECECEC] text-xs sm:text-sm text-[#2E2D2D] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-none"
            />
          </div>

          {/* Asal Sekolah */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="school">
              Asal Sekolah
            </label>
            <div className="relative">
              <input
                id="school"
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
                className="w-full h-[42px] sm:h-[44px] pl-10 pr-3.5 py-2.5 rounded-[10px] bg-[#FAFAFA] border border-[#ECECEC] text-xs sm:text-sm text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-none"
              />
              <School size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[42px] sm:h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-semibold rounded-[10px] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-xs sm:text-sm cursor-pointer shadow-none pt-1"
          >
            {isSubmitting ? 'Menyimpan Profil...' : 'Selesaikan Pendaftaran & Mulai Belajar'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function LengkapiProfilPage() {
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
        <Suspense fallback={<div className="text-center text-xs text-gray-400">Memuat formulir...</div>}>
          <OnboardingContent />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#ECECEC] text-center text-[11px] sm:text-xs text-gray-400">
        Copyright Lantip 7 SMKN 1 Semarang. 2026
      </footer>
    </div>
  );
}
