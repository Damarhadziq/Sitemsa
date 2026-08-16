'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Award01Icon,
  FloppyDiskIcon,
  Camera01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

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
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  const [name, setName] = useState("Budi Santoso");
  const [email, setEmail] = useState("budi@siswa.belajar.id");
  const [school, setSchool] = useState("SMKN 1 Semarang");
  const [nisn, setNisn] = useState("0084920194");
  const [grade, setGrade] = useState("XI PPLG 1");
  const [historySubView, setHistorySubView] = useState<"overview" | "all-materials" | "all-quizzes">("overview");
  const [isSavedToast, setIsSavedToast] = useState(false);

  if (prevInitialTab !== initialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
    setHistorySubView("overview");
  }

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("modal-open");
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
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center md:items-center p-0 md:p-4 animate-in fade-in duration-200 overscroll-contain">
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
            className="w-8 h-8 rounded-full bg-white border border-[#ECECEC] text-[#737373] hover:text-[#2563EB] hover:bg-[#F6F5FF] hover:border-[#2563EB]/40 flex items-center justify-center transition-all shrink-0 cursor-pointer"
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
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[6px] flex items-center gap-2 text-xs font-semibold text-emerald-700 animate-in fade-in duration-200">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                  Data profil berhasil diperbarui!
                </div>
              )}

              {/* Avatar Header Row */}
              <div className="flex items-center gap-4 p-4 bg-[#FAFAFA] border border-[#ECECEC] rounded-[10px]">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#ECECEC] shrink-0 bg-white">
                  <Image
                    src="https://i.pravatar.cc/100?img=12"
                    alt={name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#2E2D2D]">{name}</h3>
                  <p className="text-xs text-[#737373]">{email}</p>
                  <button
                    type="button"
                    className="mt-1 px-3 py-1 bg-white border border-[#ECECEC] hover:bg-gray-100 text-[11px] font-semibold text-[#2E2D2D] rounded-[6px] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <HugeiconsIcon icon={Camera01Icon} size={13} />
                    Ubah Foto Profil
                  </button>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2E2D2D] mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F3F3F3] border border-transparent rounded-[6px] text-xs text-[#2E2D2D] focus:bg-white focus:border-[#2563EB] outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2E2D2D] mb-1.5">
                    Email Siswa
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F3F3F3] border border-transparent rounded-[6px] text-xs text-[#2E2D2D] focus:bg-white focus:border-[#2563EB] outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2E2D2D] mb-1.5">
                    Sekolah / Instansi
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F3F3F3] border border-transparent rounded-[6px] text-xs text-[#2E2D2D] focus:bg-white focus:border-[#2563EB] outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2E2D2D] mb-1.5">
                    NISN / Nomor Induk
                  </label>
                  <input
                    type="text"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F3F3F3] border border-transparent rounded-[6px] text-xs text-[#2E2D2D] focus:bg-white focus:border-[#2563EB] outline-none transition-all font-mono"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#2E2D2D] mb-1.5">
                    Kelas &amp; Jurusan
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F3F3F3] border border-transparent rounded-[6px] text-xs text-[#2E2D2D] focus:bg-white focus:border-[#2563EB] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#FAFAFA] border border-[#ECECEC] hover:bg-[#F6F5FF] hover:border-[#2563EB]/40 text-[#737373] hover:text-[#2563EB] text-xs font-semibold rounded-[6px] transition-all duration-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-95 text-white text-xs font-semibold rounded-[6px] transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <HugeiconsIcon icon={FloppyDiskIcon} size={15} />
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
                  {/* 1. Riwayat Pembelajaran Modul (Top 3) */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-[#2E2D2D] flex items-center gap-2">
                        <HugeiconsIcon icon={Award01Icon} size={15} className="text-[#2563EB]" />
                        Materi yang Telah Dipelajari
                      </h3>

                      <button
                        type="button"
                        onClick={() => setHistorySubView("all-materials")}
                        className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        Lihat semua (6)
                      </button>
                    </div>

                    <div className="border border-[#ECECEC] rounded-[8px] bg-white overflow-hidden">
                      <ul className="divide-y divide-[#ECECEC]">
                        {[
                          {
                            title: "Variabel, Tipe Data & Operasi Logika",
                            subject: "Informatika",
                            progress: 100,
                            status: "Selesai",
                          },
                          {
                            title: "Komponen Pasif (Resistor, Kapasitor, Induktor)",
                            subject: "Elektronika",
                            progress: 65,
                            status: "Dalam proses",
                          },
                          {
                            title: "Manajemen Waktu & Teknik Pomodoro",
                            subject: "Bimbingan & Konseling",
                            progress: 100,
                            status: "Selesai",
                          },
                        ].map((item, idx) => (
                          <li
                            key={idx}
                            className="p-3 px-4 hover:bg-[#F6F5FF] transition-colors flex items-center justify-between gap-4 text-xs"
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

                  {/* 2. Riwayat Nilai Kuis (Top 2) */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-[#2E2D2D] flex items-center gap-2">
                        <HugeiconsIcon icon={Award01Icon} size={15} className="text-[#2563EB]" />
                        Hasil &amp; Nilai Uji Pemahaman (Kuis)
                      </h3>

                      <button
                        type="button"
                        onClick={() => setHistorySubView("all-quizzes")}
                        className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        Lihat semua (6)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          title: "Kuis Variabel & Tipe Data",
                          score: "95/100",
                          correct: "5/5 Benar",
                          grade: "Sangat Baik",
                          date: "14 Agt 2026",
                        },
                        {
                          title: "Kuis Komponen Pasif",
                          score: "90/100",
                          correct: "9/10 Benar",
                          grade: "Sangat Baik",
                          date: "13 Agt 2026",
                        },
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

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#FAFAFA] flex items-center justify-between text-[11px] text-[#737373] shrink-0">
          <span>Tekan <kbd className="px-1.5 py-0.5 bg-white border border-[#ECECEC] rounded text-[#2E2D2D] font-mono">ESC</kbd> untuk menutup</span>
          <span>Sitemsa Platform Pembelajaran Digital</span>
        </div>
      </div>
    </div>
  );
}
