'use client';

import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore, StudentRecord } from '@/lib/admin-store';
import { StudentMonitoringService } from '@/services/student-monitoring.service';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingTimeoutBoundary } from '@/components/ui/LoadingTimeoutBoundary';

export default function AdminGuruMonitoringPage() {
  const { user, activeSubjectFilter } = useAuth();
  const { students, modules } = useAdminStore();

  const assignedSubjects = user?.assignedSubjects || ['Informatika'];
  const currentSubject = activeSubjectFilter || assignedSubjects[0] || 'Informatika';

  const subjectModules = modules.filter(
    (m) =>
      m.subject === currentSubject &&
      (!user ||
        user.role === 'superadmin' ||
        m.teacherId === user.id ||
        m.teacherName?.toLowerCase() === user.name?.toLowerCase() ||
        m.teacherName?.toLowerCase().includes(user.name?.toLowerCase()) ||
        user.name?.toLowerCase().includes(m.teacherName?.toLowerCase()))
  );
  const totalSubjectModules = subjectModules.length || 3;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentModal, setSelectedStudentModal] = useState<StudentRecord | null>(null);

  // Loading state with smooth Skeleton & Timeout safety
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    StudentMonitoringService.fetchMonitoringData().finally(() => {
      setIsLoading(false);
    });

    const unsubscribe = StudentMonitoringService.subscribeToRealtime();
    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [currentSubject]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, currentSubject]);

  React.useEffect(() => {
    if (selectedStudentModal) {
      document.documentElement.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [selectedStudentModal]);

  const subjectStudents = students.filter((s) => {
    const hasProgress = (s.moduleProgress?.[currentSubject] ?? 0) > 0;
    const hasQuiz = s.quizHistory?.some(
      (q) => q.subject.toLowerCase() === currentSubject.toLowerCase()
    );
    const isEnrolled = s.enrolledSubjects?.some(
      (sub) => sub.toLowerCase() === currentSubject.toLowerCase()
    );
    return hasProgress || hasQuiz || isEnrolled;
  });

  const filteredStudents = subjectStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm) ||
      s.classGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [exportToast, setExportToast] = useState<{ show: boolean; success: boolean; message: string }>({
    show: false,
    success: true,
    message: '',
  });

  const handleExportGrades = () => {
    try {
      if (filteredStudents.length === 0) {
        setExportToast({
          show: true,
          success: false,
          message: 'Tidak ada data siswa untuk diekspor.',
        });
        setTimeout(() => setExportToast((prev) => ({ ...prev, show: false })), 3000);
        return;
      }

      // Generate HTML Excel Table with clean formatting
      let tableHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
          <style>
            table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
            th { background-color: #2563EB; color: #ffffff; font-weight: bold; text-align: left; padding: 10px; border: 1px solid #d1d5db; }
            td { padding: 8px 10px; border: 1px solid #e5e7eb; color: #1f2937; }
            tr:nth-child(even) { background-color: #f9fafb; }
          </style>
        </head>
        <body>
          <h2>REKAP NILAI SISWA - MATA PELAJARAN ${currentSubject.toUpperCase()}</h2>
          <p>Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>NISN</th>
                <th>Nama Siswa</th>
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
                <th>Progress Belajar</th>
                <th>Nilai Rata-rata</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
      `;

      filteredStudents.forEach((std, idx) => {
        const progress = std.moduleProgress?.[currentSubject] || 0;
        const subjectQuizzes = std.quizHistory?.filter((q) => q.subject === currentSubject) || [];
        const totalScore = subjectQuizzes.reduce((acc, q) => acc + q.score, 0);
        const avgScore = subjectQuizzes.length > 0
          ? Math.round(totalScore / subjectQuizzes.length)
          : (progress > 0 ? Math.round(progress * 0.9) : 0);
        const isPassed = avgScore >= 75;

        tableHtml += `
          <tr>
            <td>${idx + 1}</td>
            <td>${std.nisn || '-'}</td>
            <td>${std.name}</td>
            <td>${std.classGroup || '-'}</td>
            <td>${currentSubject}</td>
            <td>${progress}%</td>
            <td>${avgScore}</td>
            <td>${isPassed ? 'Tuntas' : 'Belum Tuntas'}</td>
          </tr>
        `;
      });

      tableHtml += `
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Rekap_Nilai_${currentSubject.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportToast({
        show: true,
        success: true,
        message: `Rekap nilai ${currentSubject} berhasil diunduh.`,
      });
    } catch {
      setExportToast({
        show: true,
        success: false,
        message: 'Gagal mengunduh file rekap nilai.',
      });
    }
    setTimeout(() => setExportToast((prev) => ({ ...prev, show: false })), 3000);
  };

  return (
    <div className="space-y-6 font-sans text-[#2E2D2D] bg-white">
      {/* Big Page Title in Content with Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#2E2D2D]">
          Monitoring Siswa
        </h1>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold self-start sm:self-auto shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Realtime Sync</span>
        </div>
      </div>

      {exportToast.show && (
        <div className={`p-3 rounded-[8px] border text-xs font-bold flex items-center justify-between animate-in fade-in duration-200 shadow-2xs ${
          exportToast.success ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          <div className="flex items-center gap-2">
            {exportToast.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{exportToast.message}</span>
          </div>
          <button onClick={() => setExportToast((prev) => ({ ...prev, show: false }))} className="text-current hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Row & Clean Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa, Nisn, atau kelas..."
            className="w-full h-10 pl-9 pr-4 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] placeholder:text-[#AAAAAA] focus:border-[#2563EB] transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-[#737373] font-medium hidden md:inline-block">
            Siswa aktif: <strong className="text-[#2E2D2D] font-bold">{filteredStudents.length}</strong> siswa
          </span>

          <button
            onClick={handleExportGrades}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor rekap nilai</span>
          </button>
        </div>
      </div>

      {/* Students Performance Table with LoadingTimeoutBoundary */}
      <LoadingTimeoutBoundary
        isLoading={isLoading}
        timeoutMs={10000}
        onRetry={() => {
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 300);
        }}
        skeleton={
          <div className="bg-slate-100/60 rounded-[12px] p-6 space-y-4 animate-pulse">
            <div className="flex justify-between items-center pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="h-4 w-28 rounded-[4px]" />
                  </div>
                  <Skeleton className="h-4 w-16 rounded-[4px]" />
                  <Skeleton className="h-4 w-24 rounded-[4px]" />
                  <Skeleton className="h-4 w-12 rounded-[4px]" />
                  <Skeleton className="h-4 w-20 rounded-[4px]" />
                  <Skeleton className="h-7 w-24 rounded-[6px]" />
                </div>
              ))}
            </div>
          </div>
        }
      >
        <div className="bg-white rounded-[10px] border border-[#ECECEC] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#ECECEC] text-xs font-bold text-[#737373]">
                  <th className="py-4 px-6">Profil siswa</th>
                  <th className="py-4 px-6">Kelas</th>
                  <th className="py-4 px-6">Banyak materi dibaca</th>
                  <th className="py-4 px-6">Nilai kalkulasi</th>
                  <th className="py-4 px-6">Status evaluasi</th>
                  <th className="py-4 px-6 text-right">Rincian nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC] text-xs">
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs text-[#737373]">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <p className="font-bold text-[#2E2D2D] text-sm">Belum Ada Data Siswa</p>
                        <p className="text-[#737373] text-xs">Belum ada siswa yang mulai mempelajari materi mata pelajaran {currentSubject}.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((std) => {
                    const progress = std.moduleProgress[currentSubject] || 0;
                    const readCount = Math.min(
                      totalSubjectModules,
                      Math.round((progress / 100) * totalSubjectModules)
                    );

                    const subjectQuizzes = std.quizHistory.filter((q) => q.subject === currentSubject);
                    const totalScore = subjectQuizzes.reduce((acc, q) => acc + q.score, 0);
                    const avgScore = subjectQuizzes.length > 0
                      ? Math.round(totalScore / subjectQuizzes.length)
                      : (progress > 0 ? Math.round(progress * 0.9) : 0);

                    const latestQuiz = subjectQuizzes[0];
                    const isPassed = latestQuiz ? latestQuiz.status === 'Lulus' : avgScore >= 75;

                    return (
                      <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                        {/* Profil siswa (Foto + Nama) */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2.5">
                          {/* eslint-disable-next-next/no-img-element */}
                          <img
                            src={std.avatar}
                            alt={std.name}
                            className="w-7 h-7 rounded-full object-cover border border-[#ECECEC] shrink-0"
                          />
                          <span className="font-bold text-[#2E2D2D] text-xs">{std.name}</span>
                        </div>
                      </td>

                      {/* Kelas */}
                      <td className="py-4 px-6 font-semibold text-[#2E2D2D] text-xs">
                        {std.classGroup}
                      </td>

                      {/* Banyak materi dibaca */}
                      <td className="py-4 px-6 font-semibold text-[#2E2D2D] text-xs">
                        {readCount} Materi
                      </td>

                      {/* Nilai kalkulasi */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#2E2D2D] text-xs">
                          {avgScore} <span className="text-[10px] text-[#737373] font-normal">/ 100</span>
                        </span>
                      </td>

                      {/* Status evaluasi */}
                      <td className="py-4 px-6">
                        {subjectQuizzes.length === 0 && progress === 0 ? (
                          <span className="inline-flex items-center text-[11px] bg-slate-100 text-slate-600 font-semibold px-2.5 py-0.5 rounded-[4px]">
                            Belum mulai
                          </span>
                        ) : isPassed ? (
                          <span className="inline-flex items-center text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-[4px]">
                            Tuntas / lulus
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] bg-amber-50 text-amber-700 font-semibold px-2.5 py-0.5 rounded-[4px]">
                            Perlu bimbingan
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedStudentModal(std)}
                          className="px-3 py-1.5 rounded-[6px] bg-slate-50 hover:bg-blue-50 text-[#2E2D2D] hover:text-[#2563EB] font-semibold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat raport</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Pagination control when students > 10 (Main Website Style) */}
        {filteredStudents.length > 10 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-[#737373]">
              Menampilkan <strong className="text-[#2E2D2D] font-bold">{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong className="text-[#2E2D2D] font-bold">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</strong> dari <strong className="text-[#2E2D2D] font-bold">{filteredStudents.length}</strong> siswa
            </p>

            <div className="flex items-center gap-1">
              {/* Frameless Previous Arrow */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full bg-transparent text-[#737373] hover:text-[#2E2D2D] hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Numbered Page Buttons - Active is 100% Circle Filled Blue */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold transition-all flex items-center justify-center cursor-pointer ${
                      isActive
                        ? "bg-[#2563EB] text-white"
                        : "bg-transparent text-[#737373] hover:text-[#2E2D2D] hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Frameless Next Arrow */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full bg-transparent text-[#737373] hover:text-[#2E2D2D] hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </LoadingTimeoutBoundary>

      {/* Student Detailed Evaluation Modal */}
      {selectedStudentModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-[10px] border border-[#ECECEC] overflow-hidden font-sans">
            <div className="p-6 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-next/no-img-element */}
                <img
                  src={selectedStudentModal.avatar}
                  alt={selectedStudentModal.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#ECECEC]"
                />
                <div>
                  <h3 className="text-base font-bold text-[#2E2D2D]">{selectedStudentModal.name}</h3>
                  <p className="text-xs text-[#737373]">
                    {selectedStudentModal.nisn} &bull; {selectedStudentModal.classGroup}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentModal(null)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 pt-0 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#2E2D2D] mb-2">
                  Riwayat kuis ujian & evaluasi mapel {currentSubject}
                </h4>

                <div className="space-y-2">
                  {selectedStudentModal.quizHistory
                    .filter((q) => q.subject === currentSubject)
                    .map((q) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-[8px] bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-[#2E2D2D]">{q.quizTitle}</p>
                          <p className="text-[11px] text-[#737373] mt-0.5">Tanggal ujian: {q.date}</p>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-bold text-[#2E2D2D]">{q.score}</span>
                          <span className="text-[10px] text-[#737373]"> / {q.maxScore}</span>
                          <div>
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-[4px] ${
                                q.status === 'Lulus'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {q.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                  {selectedStudentModal.quizHistory.filter((q) => q.subject === currentSubject).length === 0 && (
                    <p className="text-xs text-[#737373] py-4 text-center">Belum ada riwayat ujian kuis.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedStudentModal(null)}
                  className="px-4 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs"
                >
                  Tutup rincian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
