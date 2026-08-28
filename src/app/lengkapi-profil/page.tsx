'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveStudentProfile, registerStudent } from '@/services/student-profile.service';
import { addUserNotification } from '@/services/notification.service';
import { CheckCircle2, School, GraduationCap, ArrowLeft } from 'lucide-react';

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

  const initialName = searchParams.get('name') || '';
  const initialEmail = searchParams.get('email') || '';

  const [name, setName] = useState(initialName);
  const [selectedGrade, setSelectedGrade] = useState('X');
  const [selectedMajor, setSelectedMajor] = useState(JURUSAN_LIST[0]);
  const [nisn, setNisn] = useState('');
  const [school, setSchool] = useState('SMK Negeri 1 Semarang');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isNisnValid = /^\d{10}$/.test(nisn);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama lengkap siswa wajib diisi.');
      return;
    }

    if (!isNisnValid) {
      setErrorMsg('NISN wajib terdiri dari 10 digit angka standar Kemdikbud.');
      return;
    }

    if (!school.trim()) {
      setErrorMsg('Asal sekolah wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const emailToUse = initialEmail || 'siswa@belajar.id';
      const gradeFormatted = `${selectedGrade} ${selectedMajor.split(' ')[0]}`;

      registerStudent({
        name: name.trim(),
        email: emailToUse,
        nisn: nisn.trim(),
        school: school.trim(),
        grade: gradeFormatted,
      });

      // Set cookies and session for student auth
      if (typeof document !== 'undefined') {
        document.cookie = 'sintesa_student_auth=true; path=/; max-age=2592000; SameSite=Lax';
        document.cookie = 'auth_student=siswa; path=/; max-age=2592000; SameSite=Lax';
        document.cookie = 'auth=true; path=/; max-age=2592000; SameSite=Lax';
        localStorage.setItem(
          'sintesa_student_session_v1',
          JSON.stringify({
            email: emailToUse,
            name: name.trim(),
            role: 'siswa',
            school: school.trim(),
            grade: selectedGrade,
            major: selectedMajor,
            nisn: nisn.trim(),
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
      }, 1800);
    }, 450);
  };

  return (
    <div className="w-full max-w-[440px] animate-in fade-in duration-200 font-sans">
      {isSuccess ? (
        /* SUCCESS STATE: LOTTIE -> HEADER -> SUBTITLE -> AUTO DELAY REDIRECT */
        <div className="flex flex-col items-center justify-center text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
          <div className="w-48 h-48 mx-auto relative flex items-center justify-center overflow-hidden">
            <iframe
              src="https://lottie.host/embed/878825de-212a-443e-89a9-c5573cfe890b/3v8OMNEl30.lottie"
              className="w-full h-full border-0 pointer-events-none"
              title="Success Lottie Animation"
            />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-extrabold text-[#2E2D2D] tracking-tight">
              Profil Siswa Berhasil Disimpan!
            </h2>
            <p className="text-xs sm:text-sm text-[#737373] max-w-xs mx-auto leading-relaxed">
              Selamat datang di Sitemsa. Mengalihkan ke ruang belajar utama...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Back button (Icon Only with 64px top margin) */}
          <div className="mt-[64px] mb-7">
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] text-[#2E2D2D] hover:bg-[#F6F5FF] hover:border-[#2563EB] hover:text-[#2563EB] flex items-center justify-center transition-all cursor-pointer shadow-none shrink-0"
              aria-label="Kembali"
            >
              <ArrowLeft size={16} />
            </button>
          </div>

          {/* Headline Only (Tanpa Chip & Tanpa Subtitle) */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2E2D2D] tracking-tight">
              Lengkapi Data Siswa
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-2.5 rounded-[10px] text-xs font-medium border border-red-200 animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {/* Nama Lengkap Siswa */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="name">
                Nama Lengkap Siswa <span className="text-red-500">*</span>
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

            {/* Pilihan Tingkat Kelas (Icon only when selected) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2E2D2D]">
                Tingkatan Kelas <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {['X', 'XI', 'XII'].map((grade) => {
                  const isSelected = selectedGrade === grade;
                  return (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setSelectedGrade(grade)}
                      className={`h-[42px] sm:h-[44px] rounded-[10px] text-xs sm:text-sm font-bold border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs scale-[1.02]'
                          : 'bg-[#FAFAFA] text-[#4A4A4A] border-[#ECECEC] hover:bg-white hover:border-[#2563EB]/40'
                      }`}
                    >
                      {isSelected && <GraduationCap size={15} />}
                      <span>Kelas {grade}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Program Keahlian / Jurusan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="major">
                Program Keahlian / Jurusan <span className="text-red-500">*</span>
              </label>
              <select
                id="major"
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                required
                className="w-full h-[42px] sm:h-[44px] px-3.5 py-2 rounded-[10px] bg-[#FAFAFA] border border-[#ECECEC] text-xs sm:text-sm text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-none cursor-pointer"
              >
                {JURUSAN_LIST.map((jurusan) => (
                  <option key={jurusan} value={jurusan}>
                    {jurusan}
                  </option>
                ))}
              </select>
            </div>

            {/* NISN / Nomor Induk Siswa (10 Numeric Digits + Green Checkmark on Valid) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="nisn">
                NISN / Nomor Induk Siswa Nasional <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="nisn"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={nisn}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setNisn(clean);
                    setErrorMsg('');
                  }}
                  placeholder="10 digit nomor NISN (cth: 0082918239)"
                  required
                  className="w-full h-[42px] sm:h-[44px] px-3.5 py-2.5 rounded-[10px] bg-[#FAFAFA] border border-[#ECECEC] text-xs sm:text-sm text-[#2E2D2D] placeholder-[#737373] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-none pr-10"
                />
                {isNisnValid && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center text-emerald-600 animate-in fade-in zoom-in-75 duration-200" title="NISN Valid Kemdikbud (10 Digit)">
                    <CheckCircle2 size={18} />
                  </div>
                )}
              </div>
            </div>

            {/* Asal Sekolah */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#2E2D2D]" htmlFor="school">
                Asal Sekolah <span className="text-red-500">*</span>
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

            {/* Submit Button ("Mulai Belajar") */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[42px] sm:h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white font-semibold rounded-[10px] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-xs sm:text-sm cursor-pointer shadow-none"
              >
                {isSubmitting ? 'Menyimpan Profil...' : 'Mulai Belajar'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default function LengkapiProfilPage() {
  return (
    <div className="min-h-[100dvh] bg-white flex flex-col justify-start items-center relative overflow-hidden font-sans">
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

      {/* Main Container without footer */}
      <div className="flex-1 flex items-start justify-center px-6 sm:px-12 py-6 max-w-xl mx-auto w-full">
        <Suspense fallback={<div className="text-center text-xs text-gray-400 mt-20">Memuat formulir...</div>}>
          <OnboardingContent />
        </Suspense>
      </div>
    </div>
  );
}
