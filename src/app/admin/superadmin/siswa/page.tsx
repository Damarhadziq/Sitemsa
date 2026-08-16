'use client';

import React, { useState } from 'react';
import { Search, Award, BookOpen, Clock, ChevronDown, Check } from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';

export default function SuperadminSiswaPage() {
  const { students } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  const classesList = ['All', ...Array.from(new Set(students.map((s) => s.classGroup)))];

  const filteredStudents = students.filter((s) => {
    const matchQuery =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchClass = selectedClassFilter === 'All' || s.classGroup === selectedClassFilter;
    return matchQuery && matchClass;
  });

  return (
    <div className="space-y-6 font-sans text-[#2E2D2D] bg-white">
      {/* Big Page Title in Content */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#2E2D2D]">
          Monitoring Siswa Global
        </h1>
      </div>

      {/* Action Bar: Clean Search Bar & Custom Class Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa, Nisn, atau email..."
            className="w-full h-10 pl-9 pr-4 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] placeholder:text-[#AAAAAA] focus:border-[#2563EB] transition-all outline-none"
          />
        </div>

        {/* Custom Class Dropdown Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#737373] font-semibold whitespace-nowrap">Filter kelas:</span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowClassDropdown(!showClassDropdown)}
              className="h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-bold text-[#2E2D2D] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>{selectedClassFilter === 'All' ? 'Semua Kelas' : selectedClassFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
            </button>

            {showClassDropdown && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-[8px] border border-[#ECECEC] p-1 z-50 shadow-xs">
                {classesList.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => {
                      setSelectedClassFilter(cls);
                      setShowClassDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-[6px] text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      selectedClassFilter === cls ? 'bg-blue-50 text-[#2563EB]' : 'text-[#2E2D2D] hover:bg-slate-50'
                    }`}
                  >
                    <span>{cls === 'All' ? 'Semua Kelas' : cls}</span>
                    {selectedClassFilter === cls && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-[10px] border border-[#ECECEC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-[#ECECEC] text-xs font-bold text-[#737373]">
                <th className="py-4 px-6">Profil siswa</th>
                <th className="py-4 px-6">Nisn & kelas</th>
                <th className="py-4 px-6">Mata pelajaran diikuti</th>
                <th className="py-4 px-6">Rata-rata nilai kuis</th>
                <th className="py-4 px-6 text-right">Aktivitas terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECEC] text-xs">
              {filteredStudents.map((std) => {
                const totalScore = std.quizHistory.reduce((acc, q) => acc + q.score, 0);
                const avgScore = std.quizHistory.length > 0 ? Math.round(totalScore / std.quizHistory.length) : 0;

                return (
                  <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                    {/* Student Info */}
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
                          <p className="text-[11px] text-[#737373]">{std.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* NISN & Class */}
                    <td className="py-4 px-6">
                      <p className="font-mono text-xs font-semibold text-[#2E2D2D]">{std.nisn}</p>
                      <span className="text-[10px] bg-slate-100 font-semibold text-slate-600 px-2 py-0.5 rounded-[4px]">
                        {std.classGroup}
                      </span>
                    </td>

                    {/* Enrolled Subjects */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {std.enrolledSubjects.map((subj) => (
                          <span
                            key={subj}
                            className="text-[10px] bg-blue-50 text-[#2563EB] font-semibold px-2.5 py-0.5 rounded-[4px] inline-flex items-center gap-1"
                          >
                            <BookOpen className="w-2.5 h-2.5" />
                            <span>{subj}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Quiz Average */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-[8px] bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-xs border border-amber-100">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-[#2E2D2D] text-sm">{avgScore}</span>
                          <span className="text-[10px] text-[#737373]"> / 100</span>
                          <p className="text-[10px] text-[#737373]">
                            {std.quizHistory.length} Ujian kuis selesai
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Last Active */}
                    <td className="py-4 px-6 text-right">
                      <span className="text-[11px] text-[#737373] font-medium inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#737373]" /> {std.lastActive}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#737373] text-xs">
                    Tidak ada data siswa yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
