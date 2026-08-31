'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Check } from 'lucide-react';

export interface GoogleAccountOption {
  id: string;
  name: string;
  email: string;
  avatar: string;
  grade?: string;
}

const DEFAULT_GOOGLE_ACCOUNTS: GoogleAccountOption[] = [
  {
    id: 'g-1',
    name: 'Siswa Sitemsa',
    email: 'siswa@belajar.id',
    avatar: 'https://i.pravatar.cc/150?img=12',
    grade: 'X PPLG 1',
  },
];

interface GoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: GoogleAccountOption) => void;
  title?: string;
}

export function GoogleAccountModal({
  isOpen,
  onClose,
  onSelectAccount,
  title = 'Pilih Akun Google untuk Masuk',
}: GoogleAccountModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChoose = (acc: GoogleAccountOption) => {
    setSelectedId(acc.id);
    setTimeout(() => {
      onSelectAccount(acc);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-[16px] border border-[#ECECEC] p-6 shadow-xl space-y-5 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header (Native Google Chooser Style) */}
        <div className="flex items-start justify-between gap-3 border-b border-[#ECECEC] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2E2D2D]">
                {title}
              </h3>
              <p className="text-[11px] text-[#737373]">
                Lanjutkan ke Sitemsa
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Account List (Standard Clean Native Google Chooser) */}
        <div className="divide-y divide-[#ECECEC] border border-[#ECECEC] rounded-[12px] overflow-hidden bg-white">
          {DEFAULT_GOOGLE_ACCOUNTS.map((acc) => {
            const isSelected = selectedId === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleChoose(acc)}
                className={`w-full p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70'
                    : 'hover:bg-[#F6F5FF]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200">
                    <Image
                      src={acc.avatar}
                      alt={acc.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2E2D2D] truncate">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-[#737373] truncate">
                      {acc.email}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <p className="text-[10.5px] text-[#94a3b8] text-center leading-relaxed pt-1">
          Untuk melanjutkan, Google akan membagikan nama, alamat email, dan foto profil Anda ke Sitemsa.
        </p>
      </div>
    </div>
  );
}
