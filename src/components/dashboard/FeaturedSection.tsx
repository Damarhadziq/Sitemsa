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
import Link from "next/link";
import BorderGlow from "@/components/ui/BorderGlow";
import {
  getFeaturedModules,
  FeaturedModuleCard,
  FEATURED_CARDS_DATA,
} from "@/services/featured.service";
import { ModuleService } from "@/services/module.service";

export function FeaturedSection() {
  const [featuredCards, setFeaturedCards] = useState<FeaturedModuleCard[]>(() => getFeaturedModules());

  useEffect(() => {
    // Initial fetch from local store
    setFeaturedCards(getFeaturedModules());

    // Live sync from Supabase
    ModuleService.fetchFromSupabase().then((mods) => {
      if (mods && mods.length > 0) {
        setFeaturedCards(getFeaturedModules(mods));
      }
    }).catch(() => {});

    const handleStorageUpdate = () => {
      setFeaturedCards(getFeaturedModules());
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

  return (
    <section className="mb-10 space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#1E293B] via-[#2563EB] to-[#6366F1] bg-clip-text text-transparent">
          Rekomendasi Pembelajaran untukmu
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        {featuredCards.map((card) => {
          const { id, subject, title, linkUrl, indicatorType, metadata } = card;

          return (
            <BorderGlow
              key={`${id}-${title}`}
              backgroundColor="#FFFFFF"
              borderRadius={12}
              glowRadius={22}
              glowIntensity={1.2}
              coneSpread={28}
              looping={true}
              colors={['#2563EB', '#6366F1', '#a855f7']}
              className="w-full h-full hover:-translate-y-1 transition-transform duration-200"
            >
              <Link
                href={linkUrl}
                className="relative p-4 sm:p-5 flex flex-col justify-between h-full w-full cursor-pointer block overflow-hidden group"
              >
                {/* Subtle Light-Theme Animated Shimmer Reflection */}
                <div className="recommendation-card-shimmer" />

                {/* Card Content Body */}
                <div className="relative z-10 flex flex-col justify-between h-full space-y-3.5">
                  <div>
                    {/* Subject Badge */}
                    <span className="inline-block bg-[#E8E7FF] text-[#2563EB] px-2.5 py-0.5 rounded-[5px] text-[10px] sm:text-[11px] font-bold mb-2">
                      {subject}
                    </span>

                    {/* Title */}
                    <h3 className="text-xs sm:text-sm font-bold text-[#2E2D2D] leading-snug group-hover:text-[#2563EB] transition-colors duration-200 line-clamp-2">
                      {title}
                    </h3>
                  </div>

                  {/* DYNAMIC METADATA & INDICATOR CONDITION RENDERING */}
                  <div className="flex items-center text-[11px] text-[#737373] pt-2 border-t border-[#ECECEC]/70">
                    {/* Condition 1: Social Proof */}
                    {indicatorType === "social_proof" && (
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5 shrink-0">
                          <div className="w-5 h-5 rounded-full bg-blue-600 border border-white flex items-center justify-center text-[9px] font-bold text-white">S1</div>
                          <div className="w-5 h-5 rounded-full bg-indigo-600 border border-white flex items-center justify-center text-[9px] font-bold text-white">S2</div>
                          <div className="w-5 h-5 rounded-full bg-emerald-600 border border-white flex items-center justify-center text-[9px] font-bold text-white">S3</div>
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
                          <span className="font-semibold text-[#2E2D2D]">{metadata.rating || 4.9}/5</span>
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
            </BorderGlow>
          );
        })}
      </div>
    </section>
  );
}
