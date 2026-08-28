'use client';

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  StarIcon,
  Clock01Icon,
  FireIcon,
  Award01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import {
  getFeaturedModules,
  FeaturedModuleCard,
  FEATURED_CARDS_DATA,
} from "@/services/featured.service";

export function FeaturedSection() {
  const [featuredCards, setFeaturedCards] = useState<FeaturedModuleCard[]>(FEATURED_CARDS_DATA.slice(0, 3));

  useEffect(() => {
    setFeaturedCards(getFeaturedModules());

    const handleStorageUpdate = () => {
      setFeaturedCards(getFeaturedModules());
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

  return (
    <section className="mb-8 bg-[#F4EFFF] rounded-[12px] p-5 lg:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base md:text-lg font-semibold text-[#2E2D2D]">
          Rekomendasi Pembelajaran untukmu
        </h2>
        <span className="text-xs text-[#737373] hidden sm:inline">
          Disesuaikan dengan minat dan aktivitas belajarmu
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredCards.map((card) => {
          const { id, subject, title, linkUrl, indicatorType, metadata } = card;

          return (
            <Link
              key={id}
              href={linkUrl}
              className="bg-white rounded-[10px] p-[10px] md:p-4 flex flex-col justify-between border border-[#ECECEC] hover:border-[#2563EB]/40 hover:shadow-xs transition-all duration-200 group cursor-pointer block"
            >
              <div>
                {/* Subject Badge */}
                <span className="inline-block bg-[#E8E7FF] text-[#2563EB] px-2 py-0.5 rounded-[4px] text-[10px] sm:text-[11px] font-semibold mb-2">
                  {subject}
                </span>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-semibold text-[#2E2D2D] mb-2.5 leading-snug group-hover:text-[#2563EB] transition-colors duration-200 line-clamp-2">
                  {title}
                </h3>

                {/* DYNAMIC METADATA & INDICATOR CONDITION RENDERING */}
                <div className="flex items-center text-[11px] text-[#737373] pt-0.5">
                  {/* Condition 1: Social Proof (Avatar Stack + Count) */}
                  {indicatorType === "social_proof" && (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5 shrink-0">
                        {(metadata.avatarIds || [12, 15, 23]).map((avatarId) => (
                          <div
                            key={avatarId}
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white bg-gray-200 overflow-hidden relative"
                          >
                            <Image
                              src={`https://i.pravatar.cc/100?img=${avatarId}`}
                              alt="Siswa"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="leading-tight text-[10.5px] sm:text-xs">
                        {metadata.socialCopy || `${metadata.completedCount || 125} siswa baru saja menyelesaikan ini.`}
                      </span>
                    </div>
                  )}

                  {/* Condition 2: Rating & Reading Duration */}
                  {indicatorType === "rating_duration" && (
                    <div className="flex items-center gap-2.5 text-[10.5px] sm:text-xs">
                      <div className="flex items-center gap-1">
                        <HugeiconsIcon icon={StarIcon} size={13} className="text-[#FFCE03]" />
                        <span className="font-medium text-[#2E2D2D]">{metadata.rating || 4.9}/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HugeiconsIcon icon={Clock01Icon} size={13} className="text-[#737373]" />
                        <span>{metadata.readTime || "10 Menit baca."}</span>
                      </div>
                    </div>
                  )}

                  {/* Condition 3: Trending Flame / Class Hot Pick */}
                  {indicatorType === "trending" && (
                    <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs">
                      <HugeiconsIcon icon={FireIcon} size={13} className="text-[#FFCE03]" />
                      <span>{metadata.trendingText || `Sedang tren di ${metadata.targetGrade || "kelas 10"}`}</span>
                    </div>
                  )}

                  {/* Condition 4: Quiz Certified & High Score */}
                  {indicatorType === "quiz_certified" && (
                    <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs">
                      <HugeiconsIcon icon={Award01Icon} size={13} className="text-[#2563EB]" />
                      <span className="text-[#475569] font-medium truncate">
                        {metadata.quizCopy || `Tersedia Kuis Interaktif • Skor Rata-rata ${metadata.quizScoreAvg || 95}%`}
                      </span>
                    </div>
                  )}

                  {/* Condition 5: Teacher Recommendation */}
                  {indicatorType === "teacher_pick" && (
                    <div className="flex items-center gap-1.5 text-[10.5px] sm:text-xs">
                      <HugeiconsIcon icon={SparklesIcon} size={13} className="text-[#8B5CF6]" />
                      <span className="text-[#475569] font-medium">
                        {metadata.recommendationNote || "Rekomendasi Guru Pengampu"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
