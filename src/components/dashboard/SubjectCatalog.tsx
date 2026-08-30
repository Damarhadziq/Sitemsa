'use client';

import React, { useState, useEffect } from 'react';
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import {
  Layers01Icon,
  ComputerIcon,
  CpuIcon,
  UserGroupIcon,
  MusicNote01Icon,
  Car01Icon,
  Dumbbell01Icon,
  Book01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { SubjectService } from '@/services/subject.service';
import { ModuleService } from '@/services/module.service';
import { ProgressService } from '@/services/progress.service';
import { useAdminStore } from '@/lib/admin-store';

interface SubjectDisplay {
  id: string | number;
  name: string;
  isLastStudied?: boolean;
  modulesCount: number;
  completedMateri: number;
  totalMateri: number;
  description: string;
  icon: IconSvgElement;
}

const getSubjectIcon = (name: string): IconSvgElement => {
  const n = name.toLowerCase();
  if (n.includes('informatika') || n.includes('komputer') || n.includes('pplg')) return ComputerIcon;
  if (n.includes('elektronika')) return CpuIcon;
  if (n.includes('konseling') || n.includes('bk')) return UserGroupIcon;
  if (n.includes('tari') || n.includes('seni')) return MusicNote01Icon;
  if (n.includes('otomotif') || n.includes('mesin')) return Car01Icon;
  if (n.includes('olahraga') || n.includes('keolahragaan')) return Dumbbell01Icon;
  return Book01Icon;
};

const normalizeSubName = (cat: string) => {
  const c = cat.toLowerCase().replace(/\s+/g, ' ').trim();
  if (c.includes('bk') || c.includes('konseling')) return 'bimbingan konseling';
  if (c.includes('informatika') || c.includes('komputer')) return 'informatika';
  if (c.includes('elektronika')) return 'elektronika';
  if (c.includes('tari')) return 'seni tari';
  if (c.includes('otomotif')) return 'otomotif';
  if (c.includes('olahraga') || c.includes('keolahragaan')) return 'keolahragaan';
  return c;
};

const getActualModuleCount = (subjectName: string, storeModules: any[] = []): number => {
  const norm = normalizeSubName(subjectName);
  
  if (storeModules && storeModules.length > 0) {
    const matching = storeModules.filter((m) => m.isPublished !== false && normalizeSubName(m.subject || '') === norm);
    const uniqueTitles = new Set(matching.map((m) => (m.title || '').toLowerCase().trim()));
    return uniqueTitles.size;
  }

  return 0;
};

export function SubjectCatalog() {
  const { modules } = useAdminStore();
  const [subjectsList, setSubjectsList] = useState<SubjectDisplay[]>([]);

  useEffect(() => {
    Promise.all([
      SubjectService.fetchFromSupabase(),
      ModuleService.fetchFromSupabase(),
    ]).then(([subs, cloudModules]) => {
      if (cloudModules && cloudModules.length > 0) {
        useAdminStore.setState({
          modules: cloudModules.map((c) => ({
            id: c.id,
            subject: c.subject,
            title: c.title,
            level: c.level,
            duration: c.duration,
            topics: c.topics,
            description: c.description,
            teacherId: c.teacherId,
            teacherName: c.teacherName,
            isPublished: c.isPublished !== false,
            createdAt: c.createdAt,
            isAiRecommended: c.isAiRecommended,
            quizSource: c.quizSource,
          })),
        });
      }

      const activeStoreModules = cloudModules && cloudModules.length > 0 ? cloudModules : useAdminStore.getState().modules;
      const student = ProgressService.getStudentById('std-1');
      const progressMap = student?.moduleProgress || {};

      const mapped: SubjectDisplay[] = subs.map((sub) => {
        const total = getActualModuleCount(sub.name, activeStoreModules);
        const percent = progressMap[sub.name] || 0;
        const completed = Math.round((percent / 100) * total);

        return {
          id: sub.id,
          name: sub.name,
          isLastStudied: percent > 0,
          modulesCount: total,
          completedMateri: completed,
          totalMateri: total,
          description: sub.description || `Kuasai materi dan kompetensi keahlian ${sub.name}.`,
          icon: getSubjectIcon(sub.name),
        };
      });

      setSubjectsList(mapped);
    });
  }, [modules]);

  const displayList = subjectsList.length > 0 ? subjectsList : [
    {
      id: 1,
      name: "Informatika",
      isLastStudied: false,
      modulesCount: 3,
      completedMateri: 0,
      totalMateri: 3,
      description: "Pemrograman dasar, logika algoritma, struktur data, dan pengembangan perangkat lunak.",
      icon: ComputerIcon,
    },
    {
      id: 2,
      name: "Elektronika",
      isLastStudied: false,
      modulesCount: 6,
      completedMateri: 0,
      totalMateri: 6,
      description: "Komponen pasif & aktif, dasar kelistrikan, sirkuit terpadu, dan mikrokontroler.",
      icon: CpuIcon,
    },
    {
      id: 3,
      name: "Bimbingan Konseling",
      isLastStudied: false,
      modulesCount: 7,
      completedMateri: 0,
      totalMateri: 7,
      description: "Kepercayaan diri, pemetaan potensi diri, prokrastinasi, dan bimbingan karir masa depan.",
      icon: UserGroupIcon,
    },
    {
      id: 4,
      name: "Seni Tari",
      isLastStudied: false,
      modulesCount: 2,
      completedMateri: 0,
      totalMateri: 2,
      description: "Eksplorasi gerak koreografi, tata busana panggung, tata rias, dan properti tari tradisional.",
      icon: MusicNote01Icon,
    },
    {
      id: 5,
      name: "Otomotif",
      isLastStudied: false,
      modulesCount: 2,
      completedMateri: 0,
      totalMateri: 2,
      description: "Sistem pengisian kelistrikan, transmisi manual, termodinamika mesin, dan diagnosis kendaraan.",
      icon: Car01Icon,
    },
    {
      id: 6,
      name: "Keolahragaan",
      isLastStudied: false,
      modulesCount: 2,
      completedMateri: 0,
      totalMateri: 2,
      description: "Keterampilan gerak & taktik bola basket, bola voli, kebugaran jasmani, dan sportivitas.",
      icon: Dumbbell01Icon,
    },
  ];

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base md:text-lg font-semibold text-[#2E2D2D]">
          Bidang Studi
        </h2>
        <Link
          href="/materi"
          className="text-xs font-semibold text-[#2563EB] hover:underline"
        >
          Lihat Semua Materi
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayList.map((subject) => {
          const progressPercent = (subject.completedMateri / subject.totalMateri) * 100;

          return (
            <Link
              key={subject.id}
              href={`/materi?bidang=${encodeURIComponent(subject.name)}`}
              className="bg-white border border-[#ECECEC] rounded-[10px] p-4 space-y-3 hover:bg-[#F6F5FF] hover:border-[#2563EB]/40 transition-all duration-300 ease-out group cursor-pointer block"
            >
              {/* Header: Title + Optional Badge */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-[6px] bg-[#F4EFFF] flex items-center justify-center text-[#2563EB] shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                    <HugeiconsIcon icon={subject.icon} size={16} />
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors duration-200">
                    {subject.name}
                  </h3>
                </div>

                {subject.isLastStudied && (
                  <span className="shrink-0 bg-[#E8E7FF] text-[#2563EB] px-2 py-0.5 rounded-[4px] text-[11px] font-medium">
                    Terakhir Kamu Pelajari
                  </span>
                )}
              </div>

              {/* Materi count */}
              <div className="flex items-center gap-1.5 text-[#2563EB]">
                <HugeiconsIcon icon={Layers01Icon} size={15} />
                <span className="text-xs font-medium">
                  {subject.modulesCount} Materi Tersedia
                </span>
              </div>

              {/* Progress Bar + Counter */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 h-1.5 bg-[#ECECEC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563EB] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-[#2E2D2D] shrink-0">
                  {subject.completedMateri} dari {subject.totalMateri} Materi
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#737373] leading-normal">
                {subject.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
