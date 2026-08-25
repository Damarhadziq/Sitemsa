"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import AnimatedList from "@/components/ui/AnimatedList";
import { Sparkles, ArrowRight, X, GraduationCap, Building2, Briefcase } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";

export interface TeamMember {
  id?: string;
  image: string;
  title: string;
  subtitle: string;
  handle: string;
  borderColor: string;
  division: string;
}

// Data fallback 24 anggota PPL Lantip SMK Negeri 1 Semarang
const fallbackTeamMembers: TeamMember[] = [
  // 1. Pend. Informatika (4 orang: 1 Developer, 3 Sub-Developer)
  { image: "https://i.pravatar.cc/300?img=11", title: "Damar Hadziq H.", subtitle: "Developer", handle: "@damarhadziq", borderColor: "#4F46E5", division: "Pend. Informatika" },
  { image: "https://i.pravatar.cc/300?img=13", title: "Mochammad Rizal D. D.", subtitle: "Sub-Developer", handle: "@rizaldaffa", borderColor: "#3B82F6", division: "Pend. Informatika" },
  { image: "https://i.pravatar.cc/300?img=19", title: "M. Sulthon Abdullah A.", subtitle: "Sub-Developer", handle: "@sulthonazzam", borderColor: "#2563EB", division: "Pend. Informatika" },
  { image: "https://i.pravatar.cc/300?img=25", title: "Lovyca Imeyra E.", subtitle: "Sub-Developer", handle: "@lovycaimeyra", borderColor: "#10B981", division: "Pend. Informatika" },

  // 2. BK (4 orang - Instructional Designer)
  { image: "https://i.pravatar.cc/300?img=16", title: "Innova Riskianugrah R.", subtitle: "Instructional Designer", handle: "@innovariskia", borderColor: "#06B6D4", division: "BK" },
  { image: "https://i.pravatar.cc/300?img=18", title: "Fateka Maulana A. K.", subtitle: "Instructional Designer", handle: "@fatekamaulana", borderColor: "#10B981", division: "BK" },
  { image: "https://i.pravatar.cc/300?img=22", title: "Erintan Tsuraya R.", subtitle: "Instructional Designer", handle: "@erintantsuraya", borderColor: "#06B6D4", division: "BK" },
  { image: "https://i.pravatar.cc/300?img=30", title: "Dinda Riestia", subtitle: "Instructional Designer", handle: "@dindariestia", borderColor: "#8B5CF6", division: "BK" },

  // 3. Pend. Otomotif (3 orang - Instructional Designer)
  { image: "https://i.pravatar.cc/300?img=17", title: "Ardyan Santoso", subtitle: "Instructional Designer", handle: "@ardyansantoso", borderColor: "#3B82F6", division: "Pend. Otomotif" },
  { image: "https://i.pravatar.cc/300?img=23", title: "Satrio", subtitle: "Instructional Designer", handle: "@satrio", borderColor: "#4F46E5", division: "Pend. Otomotif" },
  { image: "https://i.pravatar.cc/300?img=27", title: "Agam Ainun Ramadhan", subtitle: "Instructional Designer", handle: "@agamainun", borderColor: "#8B5CF6", division: "Pend. Otomotif" },

  // 4. Pend. Elektronika (6 orang - Instructional Designer)
  { image: "https://i.pravatar.cc/300?img=14", title: "Banu Mahmuda H.", subtitle: "Instructional Designer", handle: "@banumahmuda", borderColor: "#EF4444", division: "Pend. Elektronika" },
  { image: "https://i.pravatar.cc/300?img=21", title: "Anisa Susilawati", subtitle: "Instructional Designer", handle: "@anisasusilawati", borderColor: "#8B5CF6", division: "Pend. Elektronika" },
  { image: "https://i.pravatar.cc/300?img=26", title: "Nova Milyard", subtitle: "Instructional Designer", handle: "@novamilyard", borderColor: "#EF4444", division: "Pend. Elektronika" },
  { image: "https://i.pravatar.cc/300?img=32", title: "Vella Pratika I. N.", subtitle: "Instructional Designer", handle: "@vellapratika", borderColor: "#F59E0B", division: "Pend. Elektronika" },
  { image: "https://i.pravatar.cc/300?img=33", title: "Fahrul Adiyansa", subtitle: "Instructional Designer", handle: "@fahruladiyansa", borderColor: "#8B5CF6", division: "Pend. Elektronika" },
  { image: "https://i.pravatar.cc/300?img=15", title: "Tubagus Fauzan A.", subtitle: "Instructional Designer", handle: "@tubagusfauzan", borderColor: "#06B6D4", division: "Pend. Elektronika" },

  // 5. Pend. Olahraga (3 orang - Instructional Designer)
  { image: "https://i.pravatar.cc/300?img=29", title: "Brilian Anugraheni", subtitle: "Instructional Designer", handle: "@briliananugraheni", borderColor: "#3B82F6", division: "Pend. Olahraga" },
  { image: "https://i.pravatar.cc/300?img=31", title: "Ahmad Luthfi F.", subtitle: "Instructional Designer", handle: "@ahmadluthfi", borderColor: "#F59E0B", division: "Pend. Olahraga" },
  { image: "https://i.pravatar.cc/300?img=34", title: "Rinal Febriarso D. P.", subtitle: "Instructional Designer", handle: "@rinalfebriarso", borderColor: "#06B6D4", division: "Pend. Olahraga" },

  // 6. Pend. Seni Tari (4 orang - Instructional Designer)
  { image: "https://i.pravatar.cc/300?img=12", title: "Vivi Riska Wardani", subtitle: "Instructional Designer", handle: "@viviriska", borderColor: "#10B981", division: "Pend. Seni Tari" },
  { image: "https://i.pravatar.cc/300?img=20", title: "Anita Dwi Ningtyas", subtitle: "Instructional Designer", handle: "@anitadwi", borderColor: "#EF4444", division: "Pend. Seni Tari" },
  { image: "/images/meliana.jpg", title: "Meliana Dwi Yanti", subtitle: "Instructional Designer", handle: "@melianadwi", borderColor: "#10B981", division: "Pend. Seni Tari" },
  { image: "https://i.pravatar.cc/300?img=28", title: "Hasnita Ivangka", subtitle: "Instructional Designer", handle: "@hasnitaivangka", borderColor: "#06B6D4", division: "Pend. Seni Tari" }
];

// Helper untuk mendapatkan data detail prodi & fakultas presisi sesuai spesifikasi
const getMemberDetails = (division: string) => {
  switch (division) {
    case "Pend. Informatika":
      return {
        fullProdi: "Pendidikan Teknik Informatika dan Komputer",
        fakultas: "Fakultas Teknik",
      };
    case "BK":
      return {
        fullProdi: "Bimbingan dan Konseling",
        fakultas: "Fakultas Ilmu Pendidikan dan Psikologi",
      };
    case "Pend. Otomotif":
      return {
        fullProdi: "Pendidikan Teknik Otomotif",
        fakultas: "Fakultas Teknik",
      };
    case "Pend. Elektronika":
      return {
        fullProdi: "Pendidikan Teknik Elektronika",
        fakultas: "Fakultas Teknik",
      };
    case "Pend. Olahraga":
      return {
        fullProdi: "Pendidikan Jasmani, Kesehatan, dan Rekreasi",
        fakultas: "Fakultas Ilmu Keolahragaan",
      };
    case "Pend. Seni Tari":
      return {
        fullProdi: "Pendidikan Seni Tari",
        fakultas: "Fakultas Bahasa dan Seni",
      };
    default:
      return {
        fullProdi: division,
        fakultas: "Fakultas Teknik",
      };
  }
};

export default function TeamPage() {
  const { teamMembers: storeTeamMembers } = useAdminStore();
  const allTeamMembers = useMemo(() => {
    return storeTeamMembers && storeTeamMembers.length > 0 ? storeTeamMembers : fallbackTeamMembers;
  }, [storeTeamMembers]);

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  React.useEffect(() => {
    if (selectedMember) {
      document.documentElement.classList.add("modal-open");
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [selectedMember]);

  const memberDetails = selectedMember ? getMemberDetails(selectedMember.division) : null;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-8 md:pb-20 w-full">
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 via-indigo-50/70 to-blue-50/90 border border-blue-100/90 text-[#2563EB] text-xs font-bold mb-5 shadow-2xs">
            <span>Meet The Minds</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#2E2D2D] mb-4 tracking-tight">
            Arsitek di Balik <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#8B5CF6]">Sitemsa</span>
          </h1>
          <p className="text-[#737373] text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Mengenal lebih dekat {allTeamMembers.length} inovator tangguh dari Tim PPL Lantip SMK Negeri 1 Semarang yang membangun platform pembelajaran ini.
          </p>
        </div>

        {/* ANIMATED 4x6 GRID CARDS DIRECTLY ON CANVAS */}
        <div className="w-full">
          <AnimatedList
            items={allTeamMembers}
            layout="grid"
            gridClassName="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initialSelectedIndex={-1}
            onItemSelect={(member: TeamMember) => setSelectedMember(member)}
            showGradients={false}
            enableArrowNavigation={true}
            displayScrollbar={false}
            enableSpotlight={false}
            className="w-full"
            renderItem={(member: TeamMember) => (
              <div className="flex flex-col justify-between h-full space-y-4 group">
                
                {/* Top Row: Avatar Left + Division/Prodi Badge Right */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="relative w-14 h-14 rounded-full p-0.5 border-2 shadow-2xs shrink-0"
                    style={{ borderColor: member.borderColor }}
                  >
                    {/* eslint-disable-next-next/no-img-element */}
                    <img
                      src={member.image}
                      alt={member.title}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  <span className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] px-3.5 py-1 rounded-full border border-blue-100/80 shrink-0">
                    {member.division}
                  </span>
                </div>

                {/* Middle Row: Title (Name) + Subtitle (Jobdesk) */}
                <div className="space-y-1 pt-1">
                  <h4 className="text-base font-bold text-[#2E2D2D] tracking-tight truncate">
                    {member.title}
                  </h4>
                  <p className="text-sm font-semibold text-[#2563EB] truncate">
                    {member.subtitle}
                  </p>
                </div>

                {/* Bottom Row: Divider + Handle Left + Arrow Right */}
                <div className="pt-3.5 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                  <span className="font-mono text-[#737373] text-xs">
                    {member.handle}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors duration-300 shrink-0" />
                </div>

              </div>
            )}
          />
        </div>
      </main>

      {/* MEMBER DETAIL EXPAND BOTTOM SHEET / MODAL */}
      {selectedMember && memberDetails && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-t-[28px] sm:rounded-[24px] border-t sm:border border-[#ECECEC] max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-y-auto max-h-[85vh] sm:max-h-[90vh] space-y-5 animate-in slide-in-from-bottom sm:zoom-in-95 duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Handle (4px height) */}
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto sm:hidden -mt-1 mb-2" />

            {/* Close Button (Hidden on Mobile Bottom Sheet) */}
            <button
              onClick={() => setSelectedMember(null)}
              className="hidden sm:flex absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Tutup Detail"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Avatar & Name Header */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div
                className="relative w-24 h-24 rounded-full p-1 border-2 shadow-sm"
                style={{ borderColor: selectedMember.borderColor }}
              >
                {/* eslint-disable-next-next/no-img-element */}
                <img
                  src={selectedMember.image}
                  alt={selectedMember.title}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#2E2D2D] tracking-tight">
                  {selectedMember.title}
                </h3>
                <p className="text-xs font-mono text-[#737373] mt-0.5">
                  {selectedMember.handle}
                </p>
              </div>

              {/* Institution Badges (Title Case, UNNES) */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/90 px-3 py-1 rounded-full text-xs font-semibold text-amber-600">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-sans font-bold tracking-tight">UNNES</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-xs font-semibold text-[#2563EB]">
                  <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>SMKN 1 Semarang</span>
                </div>
              </div>
            </div>

            {/* Data Diri Info List (Directly on Modal Canvas, No Inner Box Frame, Title Case Labels) */}
            <div className="space-y-4 px-1 pt-1">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#737373]">
                  Program Studi
                </span>
                <p className="text-sm font-bold text-[#2E2D2D]">
                  {memberDetails.fullProdi}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] space-y-1">
                <span className="text-xs font-semibold text-[#737373]">
                  Fakultas
                </span>
                <p className="text-sm font-bold text-[#2E2D2D]">
                  {memberDetails.fakultas}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] space-y-1">
                <span className="text-xs font-semibold text-[#737373]">
                  Jobdesk Tim
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Briefcase className="w-4 h-4 text-[#2563EB]" />
                  <p className="text-sm font-bold text-[#2563EB]">
                    {selectedMember.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links (No Top Divider Line!) */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-[12px] bg-slate-100 hover:bg-slate-200 text-[#2E2D2D] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#E4405F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-[12px] bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
