'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Award01Icon,
  FloppyDiskIcon,
  Camera01Icon,
  ArrowLeft01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import {
  getStudentProfile,
  saveStudentProfile,
  logoutStudent,
  StudentProfile,
  DEFAULT_DUMMY_STUDENT,
} from "@/services/student-profile.service";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";

export type ProfileTab = "profile" | "history" | "settings";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ProfileTab;
}

export function UserProfileModal({
  isOpen,
  onClose,
  initialTab = "profile",
}: UserProfileModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    onClose();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sintesa-logging-out'));
    }
    await logoutStudent();
    window.location.href = '/login';
  };

  // Baseline initial profile state
  const [savedProfile, setSavedProfile] = useState<StudentProfile>(DEFAULT_DUMMY_STUDENT);

  const [name, setName] = useState(DEFAULT_DUMMY_STUDENT.name);
  const [email, setEmail] = useState(DEFAULT_DUMMY_STUDENT.email);
  const [school, setSchool] = useState(DEFAULT_DUMMY_STUDENT.school);
  const [nisn, setNisn] = useState(DEFAULT_DUMMY_STUDENT.nisn);
  const [grade, setGrade] = useState(DEFAULT_DUMMY_STUDENT.grade);
  const [avatar, setAvatar] = useState(DEFAULT_DUMMY_STUDENT.avatar);
  const [bio, setBio] = useState(DEFAULT_DUMMY_STUDENT.bio || "");
  const [historySubView, setHistorySubView] = useState<"overview" | "all-materials" | "all-quizzes">("overview");
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Load from persistent store when modal is opened
  useEffect(() => {
    if (isOpen) {
      const p = getStudentProfile();
      setSavedProfile(p);
      setName(p.name);
      setEmail(p.email);
      setSchool(p.school);
      setNisn(p.nisn);
      setGrade(p.grade);
      setAvatar(p.avatar);
      setBio(p.bio || "");
    }
  }, [isOpen]);

  // Track if any field has changed compared to saved profile
  const hasChanges =
    name !== savedProfile.name ||
    school !== savedProfile.school ||
    nisn !== savedProfile.nisn ||
    grade !== savedProfile.grade ||
    avatar !== savedProfile.avatar ||
    bio !== (savedProfile.bio || "");

  if (prevInitialTab !== initialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
    setHistorySubView("overview");
  }

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("modal-open");
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;
    const updated = saveStudentProfile({ name, email, school, nisn, grade, avatar, bio });
    setSavedProfile(updated);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center md:items-center p-0 md:p-4 animate-in fade-in duration-200 overscroll-contain font-sans">
      {/* Hidden avatar file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      {/* Backdrop listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Mobile Bottom Sheet & Desktop Modal Dialog Box */}
      <div className="relative w-full max-w-2xl bg-white border-t md:border border-[#ECECEC] rounded-t-[20px] rounded-b-none md:rounded-[16px] overflow-hidden flex flex-col max-h-[85vh] md:max-h-[85vh] z-10 animate-in slide-in-from-bottom duration-300 md:animate-in md:fade-in md:zoom-in-95 md:duration-150">
        {/* Drag Handle Indicator for Mobile Bottom Sheet */}
        <div className="w-12 h-1.5 bg-[#D4D4D4] rounded-full mx-auto mt-2.5 mb-1 md:hidden shrink-0" />

        {/* Modal Header (Pure White, Seamless Spacing) */}
        <div className="pt-3 md:pt-5 px-6 pb-1 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {activeTab === "history" && historySubView !== "overview" && (
              <button
                type="button"
                onClick={() => setHistorySubView("overview")}
                className="p-1 rounded-[6px] text-[#2E2D2D] hover:text-[#2563EB] hover:bg-[#F6F5FF] transition-colors shrink-0 cursor-pointer flex items-center justify-center"
                aria-label="Kembali"
                title="Kembali"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
              </button>
            )}
            <h2 className="text-base md:text-lg font-bold text-[#2E2D2D]">
              {activeTab === "profile" && "Profil Saya"}
              {activeTab === "history" && (
                historySubView === "overview"
                  ? "Riwayat Belajar"
                  : historySubView === "all-materials"
                  ? "Semua Materi Dipelajari"
                  : "Semua Hasil Nilai Kuis"
              )}
              {activeTab === "settings" && "Pengaturan"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="hidden md:flex w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] items-center justify-center transition-colors shrink-0 cursor-pointer"
            aria-label="Tutup Modal"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
          </button>
        </div>

        {/* Scrollable Content Body (Tighter Top Spacing) */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-3 space-y-5">
          {/* TAB 1: PROFIL SAYA (Editable Form - Full Width Layout) */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Toast Notification */}
              {isSavedToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[10px] flex items-center gap-2 text-xs font-semibold text-emerald-700 animate-in fade-in duration-200">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                  Data profil berhasil diperbarui!
                </div>
              )}

              {/* Avatar Header Row */}
              <div className="flex items-center gap-4 p-4 bg-[#FAFAFA] border border-[#ECECEC] rounded-[12px]">
                <InitialsAvatar
                  name={name}
                  avatar={avatar}
                  sizeClass="w-16 h-16"
                  textSizeClass="text-lg"
                />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#2E2D2D]">{name}</h3>
                  <p className="text-xs text-[#737373]">{email}</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 px-3 py-1.5 bg-white border border-[#ECECEC] hover:bg-gray-50 text-[11px] font-semibold text-[#2E2D2D] rounded-[8px] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <HugeiconsIcon icon={Camera01Icon} size={13} />
                    Ubah Foto Profil
                  </button>
                </div>
              </div>

              {/* Form Fields Grid with White Background & Border #ECECEC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#2E2D2D]">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#2E2D2D]">
                    Email Siswa
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    readOnly
                    className="w-full bg-[#FAFAFA] border border-[#ECECEC] text-[#737373] cursor-not-allowed rounded-[10px] px-3.5 py-2.5 text-xs font-medium focus:outline-none select-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#2E2D2D]">
                    Sekolah / Instansi
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#2E2D2D]">
                    NISN / Nomor Induk
                  </label>
                  <input
                    type="text"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] transition-colors font-mono font-medium"
                    required
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-[#2E2D2D]">
                    Kelas &amp; Jurusan
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-white border border-[#ECECEC] rounded-[10px] px-3.5 py-2.5 text-xs text-[#2E2D2D] focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons: Simpan Perubahan active ONLY if modified */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setName(savedProfile.name);
                    setEmail(savedProfile.email);
                    setSchool(savedProfile.school);
                    setNisn(savedProfile.nisn);
                    setGrade(savedProfile.grade);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-[#2E2D2D] text-xs font-semibold cursor-pointer transition-colors"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={!hasChanges}
                  className={`px-5 py-2.5 rounded-[8px] text-xs font-bold transition-all ${
                    hasChanges
                      ? 'bg-[#2563EB] hover:bg-blue-700 text-white cursor-pointer active:scale-98'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: RIWAYAT BELAJAR & NILAI KUIS */}
          {activeTab === "history" && (
            <div className="space-y-6">
              {/* SUBVIEW 1: OVERVIEW SUMMARY (Default Ringkas) */}
              {historySubView === "overview" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-200">
                  {/* 1. Riwayat Pembelajaran Modul */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-[#2E2D2D] flex items-center gap-2">
                        <HugeiconsIcon icon={Award01Icon} size={15} className="text-[#2563EB]" />
                        Materi yang Telah Dipelajari
                      </h3>
                    </div>

                    <div className="border border-[#ECECEC] rounded-[8px] bg-white overflow-hidden p-6 text-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-2.5">
                        <HugeiconsIcon icon={Award01Icon} size={20} />
                      </div>
                      <p className="text-xs font-bold text-[#2E2D2D] mb-1">
                        Belum Ada Riwayat Materi
                      </p>
                      <p className="text-[11px] text-[#737373] max-w-xs mx-auto mb-3">
                        Kamu belum menyelesaikan materi pembelajaran. Buka katalog materi untuk mulai belajar!
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          router.push('/materi');
                        }}
                        className="px-3.5 py-1.5 rounded-[6px] bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        Jelajahi Materi
                      </button>
                    </div>
                  </div>

                  {/* 2. Riwayat Nilai Kuis */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-[#2E2D2D] flex items-center gap-2">
                        <HugeiconsIcon icon={Award01Icon} size={15} className="text-[#2563EB]" />
                        Hasil &amp; Nilai Uji Pemahaman (Kuis)
                      </h3>
                    </div>

                    <div className="border border-[#ECECEC] rounded-[8px] bg-white overflow-hidden p-6 text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                        <HugeiconsIcon icon={Award01Icon} size={20} />
                      </div>
                      <p className="text-xs font-bold text-[#2E2D2D] mb-1">
                        Belum Ada Riwayat Kuis
                      </p>
                      <p className="text-[11px] text-[#737373] max-w-xs mx-auto">
                        Hasil skor evaluasi dan kelulusan kuis akan otomatis tercatat di sini setelah kamu menyelesaikan kuis pengajar.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 2: DEDICATED FULL VIEW - ALL MATERIALS */}
              {historySubView === "all-materials" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
                  <p className="text-xs text-[#737373]">
                    Menampilkan seluruh daftar materi yang telah Anda pelajari di Sitemsa:
                  </p>

                  <div className="max-h-[55vh] overflow-y-auto border border-[#ECECEC] rounded-[8px] bg-white">
                    <ul className="divide-y divide-[#ECECEC]">
                      {[
                        { title: "Variabel, Tipe Data & Operasi Logika", subject: "Informatika", progress: 100, status: "Selesai" },
                        { title: "Komponen Pasif (Resistor, Kapasitor, Induktor)", subject: "Elektronika", progress: 65, status: "Dalam proses" },
                        { title: "Manajemen Waktu & Teknik Pomodoro", subject: "Bimbingan & Konseling", progress: 100, status: "Selesai" },
                        { title: "Struktur Percabangan (If-Else & Switch)", subject: "Informatika", progress: 80, status: "Dalam proses" },
                        { title: "Prinsip Kerja Mesin 4-Langkah", subject: "Otomotif", progress: 40, status: "Dalam proses" },
                        { title: "Wiraga, Wirama, & Wirasa dalam Tari", subject: "Seni Tari", progress: 100, status: "Selesai" },
                        { title: "Perulangan & Iterasi Algoritma", subject: "Informatika", progress: 50, status: "Dalam proses" },
                        { title: "Hukum Ohm & Sirkuit Listrik Dasar", subject: "Elektronika", progress: 100, status: "Selesai" },
                      ].map((item, idx) => (
                        <li
                          key={idx}
                          className="p-3.5 px-4 hover:bg-[#F6F5FF] transition-colors flex items-center justify-between gap-4 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-semibold text-[#2E2D2D] truncate">{item.title}</span>
                            <span className="bg-[#E8E7FF] text-[#2563EB] px-2 py-0.5 rounded-[4px] text-[10px] font-semibold shrink-0">
                              {item.subject}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-[11px]">
                            <span
                              className={`font-semibold ${
                                item.progress === 100 ? "text-emerald-600" : "text-[#2563EB]"
                              }`}
                            >
                              {item.progress}% ({item.status})
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* SUBVIEW 3: DEDICATED FULL VIEW - ALL QUIZZES */}
              {historySubView === "all-quizzes" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
                  <p className="text-xs text-[#737373]">
                    Menampilkan seluruh riwayat hasil skor kuis dan uji pemahaman Anda:
                  </p>

                  <div className="max-h-[55vh] overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: "Kuis Variabel & Tipe Data", score: "95/100", correct: "5/5 Benar", grade: "Sangat Baik", date: "14 Agt 2026" },
                      { title: "Kuis Komponen Pasif", score: "90/100", correct: "9/10 Benar", grade: "Sangat Baik", date: "13 Agt 2026" },
                      { title: "Kuis Teknik Pomodoro", score: "100/100", correct: "5/5 Benar", grade: "Sempurna", date: "10 Agt 2026" },
                      { title: "Kuis Algoritma Pemula", score: "85/100", correct: "4/5 Benar", grade: "Baik", date: "08 Agt 2026" },
                      { title: "Kuis Mesin Otomotif", score: "92/100", correct: "9/10 Benar", grade: "Sangat Baik", date: "05 Agt 2026" },
                      { title: "Kuis Olahraga & Kebugaran", score: "100/100", correct: "10/10 Benar", grade: "Sempurna", date: "01 Agt 2026" },
                      { title: "Kuis Struktur Percabangan", score: "88/100", correct: "8/10 Benar", grade: "Sangat Baik", date: "28 Jul 2026" },
                      { title: "Kuis Hukum Ohm", score: "95/100", correct: "5/5 Benar", grade: "Sangat Baik", date: "20 Jul 2026" },
                    ].map((quiz, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white border border-[#ECECEC] rounded-[8px] space-y-2 hover:bg-[#F6F5FF] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-[#2E2D2D]">{quiz.title}</p>
                          <span className="text-[10px] text-[#737373] shrink-0">{quiz.date}</span>
                        </div>

                        <div className="flex items-baseline justify-between pt-2 border-t border-[#ECECEC]">
                          <div>
                            <span className="text-lg font-bold text-[#2563EB]">{quiz.score}</span>
                            <span className="text-[11px] text-[#737373] ml-2">({quiz.correct})</span>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-[4px]">
                            {quiz.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PENGATURAN (Full Width Settings) */}
          {activeTab === "settings" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#FAFAFA] border border-[#ECECEC] rounded-[8px] space-y-3">
                <h4 className="font-bold text-[#2E2D2D] text-xs">Preferensi Notifikasi Pembelajaran</h4>
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-[#737373]">Kirim Notifikasi Pembelajaran &amp; Modul Baru via Email</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2563EB] cursor-pointer" />
                </label>
                <label className="flex items-center justify-between cursor-pointer py-1 border-t border-[#ECECEC]">
                  <span className="text-[#737373]">Pengingat Jadwal Belajar Harian Siswa</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2563EB] cursor-pointer" />
                </label>
              </div>

              <div className="p-4 bg-[#FAFAFA] border border-[#ECECEC] rounded-[8px] space-y-3">
                <h4 className="font-bold text-[#2E2D2D] text-xs">Tampilan &amp; Bahasa Platform</h4>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#737373]">Bahasa Antarmuka</span>
                  <span className="font-semibold text-[#2E2D2D]">Bahasa Indonesia</span>
                </div>
                <div className="flex items-center justify-between py-1 border-t border-[#ECECEC]">
                  <span className="text-[#737373]">Tema Warna</span>
                  <span className="font-semibold text-[#2E2D2D]">Terang (Clean Minimalist)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
