'use client';

import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore, StudentRecord } from '@/lib/admin-store';

export default function AdminGuruMonitoringPage() {
  const { user, activeSubjectFilter } = useAuth();
  const { students } = useAdminStore();

  const assignedSubjects = user?.assignedSubjects || ['Informatika'];
  const currentSubject = activeSubjectFilter || assignedSubjects[0] || 'Informatika';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentModal, setSelectedStudentModal] = useState<StudentRecord | null>(null);

  const subjectStudents = students.filter((s) => s.enrolledSubjects.includes(currentSubject));

  const filteredStudents = subjectStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm) ||
      s.classGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportGrades = () => {
    alert(`Rekap nilai siswa mata pelajaran ${currentSubject} berhasil diunduh.`);
  };

  return (
    <div className="space-y-6 font-sans text-[#2E2D2D] bg-white">
      {/* Big Page Title in Content */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#2E2D2D]">
          Monitoring Siswa
        </h1>
      </div>

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

      {/* Students Performance Table */}
      <div className="bg-white rounded-[10px] border border-[#ECECEC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-[#ECECEC] text-xs font-bold text-[#737373]">
                <th className="py-4 px-6">Profil siswa</th>
                <th className="py-4 px-6">Progres modul mapel</th>
                <th className="py-4 px-6">Nilai kuis terbaru</th>
                <th className="py-4 px-6">Status evaluasi</th>
                <th className="py-4 px-6 text-right">Rincian nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECEC] text-xs">
              {filteredStudents.map((std) => {
                const progress = std.moduleProgress[currentSubject] || 0;
                const subjectQuizzes = std.quizHistory.filter((q) => q.subject === currentSubject);
                const latestQuiz = subjectQuizzes[0];

                return (
                  <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                    {/* Profile */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-next/no-img-element */}
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#ECECEC]"
                        />
                        <div>
                          <p className="font-bold text-[#2E2D2D] text-xs">{std.name}</p>
                          <p className="text-[11px] text-[#737373]">
                            {std.nisn} &bull; {std.classGroup}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Module Progress */}
                    <td className="py-4 px-6">
                      <div className="w-48 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-[#2E2D2D]">{progress}% selesai</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-[#2563EB] rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Quiz Score */}
                    <td className="py-4 px-6">
                      {latestQuiz ? (
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-[#2E2D2D]">{latestQuiz.score}</span>
                          <span className="text-[10px] text-[#737373]">/ {latestQuiz.maxScore}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#737373]">Belum mengerjakan</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {latestQuiz ? (
                        latestQuiz.status === 'Lulus' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-[4px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tuntas / lulus
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 font-semibold px-2.5 py-0.5 rounded-[4px]">
                            <AlertCircle className="w-3 h-3 text-amber-600" /> Perlu bimbingan
                          </span>
                        )
                      ) : (
                        <span className="text-[11px] text-[#737373]">-</span>
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
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#737373] text-xs">
                    Tidak ada siswa terdaftar pada mata pelajaran {currentSubject}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detailed Evaluation Modal */}
      {selectedStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
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
                className="text-[#737373] hover:text-[#2E2D2D] p-1"
              >
                <X className="w-5 h-5" />
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
