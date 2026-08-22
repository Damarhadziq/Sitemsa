'use client';

import React, { useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, User, CheckCircle2 } from 'lucide-react';

export interface ModuleInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subject: string;
  teacherName?: string;
  teacherRole?: string;
  teacherAvatar?: string;
  publishDate?: string;
  lastUpdate?: string;
}

export function ModuleInfoModal({
  isOpen,
  onClose,
  title,
  subject,
  teacherName = 'Ibu Siti Rahmawati, S.Pd.',
  teacherRole,
  teacherAvatar,
  publishDate = '20 Agustus 2026',
  lastUpdate = 'Baru saja diperbarui',
}: ModuleInfoModalProps) {
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
        {/* 1. Header: Headline title text & cancel X button (Tanpa Subtitle & Tanpa Border) */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#2E2D2D]">Informasi Modul</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Data Info List (Directly on Canvas, Tanpa Garis Pembatas) */}
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
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-sm shrink-0">
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

          {/* Tanggal Publikasi */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#737373]">
              Tanggal Publikasi
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              <p className="text-sm font-bold text-[#2E2D2D]">
                {publishDate}
              </p>
            </div>
          </div>

          {/* Pembaruan Terakhir */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#737373]">
              Pembaruan Terakhir
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <Clock className="w-4 h-4 text-purple-600" />
              <p className="text-sm font-bold text-[#2E2D2D]">
                {lastUpdate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
