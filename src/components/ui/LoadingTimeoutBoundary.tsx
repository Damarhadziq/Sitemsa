'use client';

import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, AlertTriangle } from 'lucide-react';

export interface LoadingTimeoutBoundaryProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  timeoutMs?: number; // default 10000ms (10 seconds)
  onRetry?: () => void;
  fallbackMessage?: string;
  className?: string;
}

export function LoadingTimeoutBoundary({
  isLoading,
  skeleton,
  children,
  timeoutMs = 10000,
  onRetry,
  fallbackMessage = 'Proses memuat membutuhkan waktu lebih lama dari biasanya. Silakan periksa koneksi Anda dan coba lagi.',
  className = '',
}: LoadingTimeoutBoundaryProps) {
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isLoading) {
      setIsTimedOut(false);
      timer = setTimeout(() => {
        setIsTimedOut(true);
      }, timeoutMs);
    } else {
      setIsTimedOut(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, timeoutMs]);

  const handleRetry = () => {
    setIsTimedOut(false);
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  // 1. If Timed Out -> Show Timeout Fallback State
  if (isLoading && isTimedOut) {
    return (
      <div className={`p-8 bg-white border border-[#ECECEC] rounded-[12px] text-center space-y-4 shadow-2xs animate-in fade-in duration-200 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto text-amber-600">
          <Clock className="w-6 h-6 animate-pulse" />
        </div>

        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="text-base font-bold text-[#2E2D2D]">Waktu Memuat Terlalu Lama</h3>
          <p className="text-xs text-[#737373] leading-relaxed">
            {fallbackMessage}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleRetry}
            className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. If Still Loading -> Show Skeleton
  if (isLoading) {
    return <>{skeleton}</>;
  }

  // 3. Ready -> Show Content
  return <>{children}</>;
}
