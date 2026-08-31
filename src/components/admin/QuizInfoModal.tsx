'use client';

import React, { useEffect } from 'react';
import { X, Calendar, Clock, Award, FileQuestion, BookOpen, CheckCircle2 } from 'lucide-react';

export interface QuizInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subject: string;
  questionCount: number;
  passScore: number;
  duration?: string;
  teacherName?: string;
  teacherRole?: string;
  teacherAvatar?: string;
  publishDate?: string;
  published?: boolean;
}

export function QuizInfoModal({
  isOpen,
  onClose,
  title,
  subject,
  questionCount,
  passScore,
  duration = '15 Menit',
  teacherName = 'Guru Sitemsa',
  teacherRole,
  teacherAvatar,
  publishDate = '20 Agustus 2026',
  published = true,
}: QuizInfoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[16px] border border-[#ECECEC] p-6 max-w-md w-full shadow-xl space-y-5 animate-in zoom-in-95 duration-150 font-sans"
      >
        {/* Header: Headline title text & cancel X button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#2E2D2D]">Informasi Kuis</h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] ${
                published !== false
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/60'
              }`}
            >
              {published !== false ? 'Aktif' : 'Draft'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Data Info List */}
        <div className="space-y-4 px-1">
          {/* Guru Penerbit */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#737373]">
              Dipublikasikan Oleh
            </span>
            <div className="flex items-center gap-3 mt-1.5 p-2.5 rounded-[10px] bg-slate-50 border border-[#ECECEC]">
              {teacherAvatar ? (
                /* eslint-disable-next-next/no-img-element */
                <img
                  src={teacherAvatar}
                  alt={teacherName}
                  className="w-10 h-10 rounded-full object-cover border border-[#ECECEC] shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-[#6366F1] flex items-center justify-center font-bold text-sm shrink-0">
                  {teacherName.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#2E2D2D] truncate">{teacherName}</p>
                <p className="text-[11px] text-[#737373] truncate">
                  {teacherRole || `Guru Pengampu ${subject}`}
                </p>
              </div>
            </div>
          </div>

          {/* Judul & Mata Pelajaran */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#737373]">Judul Kuis</span>
            <p className="text-sm font-bold text-[#2E2D2D] leading-snug">{title}</p>
            <p className="text-[11px] text-[#2563EB] font-semibold">{subject}</p>
          </div>

          {/* Grid Informasi Teknis Kuis */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-[8px] bg-slate-50 border border-[#ECECEC] text-center space-y-0.5">
              <span className="text-[10px] text-[#737373] font-medium block">Total Soal</span>
              <p className="text-sm font-bold text-[#2E2D2D] flex items-center justify-center gap-1">
                <FileQuestion className="w-3.5 h-3.5 text-indigo-600" />
                {questionCount} Soal
              </p>
            </div>

            <div className="p-2.5 rounded-[8px] bg-slate-50 border border-[#ECECEC] text-center space-y-0.5">
              <span className="text-[10px] text-[#737373] font-medium block">Batas KKM</span>
              <p className="text-sm font-bold text-emerald-600 flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                {passScore}%
              </p>
            </div>

            <div className="p-2.5 rounded-[8px] bg-slate-50 border border-[#ECECEC] text-center space-y-0.5">
              <span className="text-[10px] text-[#737373] font-medium block">Durasi</span>
              <p className="text-sm font-bold text-[#2E2D2D] flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                {duration}
              </p>
            </div>
          </div>

          {/* Tanggal Publikasi */}
          <div className="space-y-1 pt-1">
            <span className="text-xs font-semibold text-[#737373]">
              Tanggal Dibuat / Diperbarui
            </span>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E2D2D] mt-0.5">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              <span>{publishDate}</span>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer transition-all active:scale-[0.98]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
