"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import AnimatedList from "@/components/ui/AnimatedList";
import { Sparkles, ArrowRight } from "lucide-react";

export interface TeamMember {
  image: string;
  title: string;
  subtitle: string;
  handle: string;
  borderColor: string;
  division: string;
}

// Data 24 anggota PPL Lantip SMK Negeri 1 Semarang (Diurutkan berdasarkan 6 Prodi)
// Jobdesk:
// - Pend. Informatika (4 orang): Developer
// - Prodi Lainnya (BK, Otomotif, Elektronika, Olahraga, Seni Tari): Content Creator (Penyusun & Pengembang Konten Materi)
const teamMembers: TeamMember[] = [
  // 1. Pend. Informatika (4 orang - Developer)
  { image: "https://i.pravatar.cc/300?img=11", title: "Budi Santoso", subtitle: "Developer", handle: "@budisantoso", borderColor: "#4F46E5", division: "Pend. Informatika" },
  { image: "https://i.pravatar.cc/300?img=13", title: "Andi Saputra", subtitle: "Developer", handle: "@andisaputra", borderColor: "#F59E0B", division: "Pend. Informatika" },
  { image: "https://i.pravatar.cc/300?img=19", title: "Fajar Nugroho", subtitle: "Developer", handle: "@fajarn", borderColor: "#3B82F6", division: "Pend. Informatika" },
  { image: "https://i.pravatar.cc/300?img=25", title: "Yudi Hartono", subtitle: "Developer", handle: "@yudihartono", borderColor: "#10B981", division: "Pend. Informatika" },

  // 2. BK (4 orang - Content Creator)
  { image: "https://i.pravatar.cc/300?img=16", title: "Dewi Lestari", subtitle: "Instructional Designer", handle: "@dewilestari", borderColor: "#06B6D4", division: "BK" },
  { image: "https://i.pravatar.cc/300?img=18", title: "Nina Safitri", subtitle: "Instructional Designer", handle: "@ninasafitri", borderColor: "#10B981", division: "BK" },
  { image: "https://i.pravatar.cc/300?img=22", title: "Dian Novita", subtitle: "Instructional Designer", handle: "@diannov", borderColor: "#06B6D4", division: "BK" },
  { image: "https://i.pravatar.cc/300?img=30", title: "Tari Wulandari", subtitle: "Instructional Designer", handle: "@tariw", borderColor: "#10B981", division: "BK" },

  // 3. Pend. Otomotif (3 orang - Content Creator)
  { image: "https://i.pravatar.cc/300?img=17", title: "Rizky Firmansyah", subtitle: "Instructional Designer", handle: "@rizkyf", borderColor: "#3B82F6", division: "Pend. Otomotif" },
  { image: "https://i.pravatar.cc/300?img=23", title: "Eko Prasetyo", subtitle: "Instructional Designer", handle: "@ekopras", borderColor: "#4F46E5", division: "Pend. Otomotif" },
  { image: "https://i.pravatar.cc/300?img=27", title: "Hendra Gunawan", subtitle: "Instructional Designer", handle: "@hendrag", borderColor: "#8B5CF6", division: "Pend. Otomotif" },

  // 4. Pend. Elektronika (6 orang - Content Creator)
  { image: "https://i.pravatar.cc/300?img=14", title: "Rina Wijaya", subtitle: "Instructional Designer", handle: "@rinawijaya", borderColor: "#EF4444", division: "Pend. Elektronika" },
  { image: "https://i.pravatar.cc/300?img=21", title: "Bayu Setiawan", subtitle: "Instructional Designer", handle: "@bayus", borderColor: "#8B5CF6", division: "Pend. Elektronika" },
  { image: "https://i.pravatar.cc/300?img=26", title: "Fitri Handayani", subtitle: "Instructional Designer", handle: "@fitrihand", borderColor: "#EF4444", division: "Pend. Elektronika" },
  { image: "https://i.pravatar.cc/300?img=32", title: "Vina Panduwinata", subtitle: "Instructional Designer", handle: "@vinap", borderColor: "#F59E0B", division: "Pend. Elektronika" },
  { image: "https://i.pravatar.cc/300?img=33", title: "Galih Rakasiwi", subtitle: "Instructional Designer", handle: "@galihr", borderColor: "#8B5CF6", division: "Pend. Elektronika" },
  { image: "https://i.pravatar.cc/300?img=15", title: "Agus Pratama", subtitle: "Instructional Designer", handle: "@aguspratama", borderColor: "#8B5CF6", division: "Pend. Elektronika" },

  // 5. Pend. Olahraga (3 orang - Content Creator)
  { image: "https://i.pravatar.cc/300?img=29", title: "Reza Oktavian", subtitle: "Instructional Designer", handle: "@rezao", borderColor: "#3B82F6", division: "Pend. Olahraga" },
  { image: "https://i.pravatar.cc/300?img=31", title: "Anton Syahputra", subtitle: "Instructional Designer", handle: "@antons", borderColor: "#F59E0B", division: "Pend. Olahraga" },
  { image: "https://i.pravatar.cc/300?img=34", title: "Nadia Vega", subtitle: "Instructional Designer", handle: "@nadiav", borderColor: "#06B6D4", division: "Pend. Olahraga" },

  // 6. Pend. Seni Tari (4 orang - Content Creator)
  { image: "https://i.pravatar.cc/300?img=12", title: "Siti Rahma", subtitle: "Instructional Designer", handle: "@sitirahma", borderColor: "#10B981", division: "Pend. Seni Tari" },
  { image: "https://i.pravatar.cc/300?img=20", title: "Lina Marlina", subtitle: "Instructional Designer", handle: "@linamarlina", borderColor: "#EF4444", division: "Pend. Seni Tari" },
  { image: "https://i.pravatar.cc/300?img=24", title: "Sinta Maharani", subtitle: "Instructional Designer", handle: "@sintam", borderColor: "#10B981", division: "Pend. Seni Tari" },
  { image: "https://i.pravatar.cc/300?img=28", title: "Maya Putri", subtitle: "Instructional Designer", handle: "@mayaputri", borderColor: "#06B6D4", division: "Pend. Seni Tari" }
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20 w-full">
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold mb-5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Meet The Minds</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#2E2D2D] mb-4 tracking-tight">
            Arsitek di Balik <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#8B5CF6]">Sitemsa</span>
          </h1>
          <p className="text-[#737373] text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Mengenal lebih dekat 24 inovator tangguh dari Tim PPL Lantip SMK Negeri 1 Semarang yang membangun platform pembelajaran ini.
          </p>
        </div>

        {/* ANIMATED 4x6 GRID CARDS DIRECTLY ON CANVAS */}
        <div className="w-full">
          <AnimatedList
            items={teamMembers}
            layout="grid"
            gridClassName="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initialSelectedIndex={-1}
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

      <Footer />
    </div>
  );
}
