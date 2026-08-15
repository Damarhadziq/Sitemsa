"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ChromaGrid, { ChromaItem } from "@/components/ui/ChromaGrid";

// Data untuk 24 anggota PPL Lantip
const teamMembers: ChromaItem[] = [
  { image: "https://i.pravatar.cc/300?img=11", title: "Budi Santoso", subtitle: "Project Manager", handle: "@budisantoso", borderColor: "#4F46E5", gradient: "linear-gradient(145deg, #4F46E5, #000)" },
  { image: "https://i.pravatar.cc/300?img=12", title: "Siti Rahma", subtitle: "Lead UI/UX Designer", handle: "@sitirahma", borderColor: "#10B981", gradient: "linear-gradient(210deg, #10B981, #000)" },
  { image: "https://i.pravatar.cc/300?img=13", title: "Andi Saputra", subtitle: "Frontend Developer", handle: "@andisaputra", borderColor: "#F59E0B", gradient: "linear-gradient(165deg, #F59E0B, #000)" },
  { image: "https://i.pravatar.cc/300?img=14", title: "Rina Wijaya", subtitle: "Backend Engineer", handle: "@rinawijaya", borderColor: "#EF4444", gradient: "linear-gradient(195deg, #EF4444, #000)" },
  { image: "https://i.pravatar.cc/300?img=15", title: "Agus Pratama", subtitle: "Data Scientist", handle: "@aguspratama", borderColor: "#8B5CF6", gradient: "linear-gradient(225deg, #8B5CF6, #000)" },
  { image: "https://i.pravatar.cc/300?img=16", title: "Dewi Lestari", subtitle: "Quality Assurance", handle: "@dewilestari", borderColor: "#06B6D4", gradient: "linear-gradient(135deg, #06B6D4, #000)" },
  { image: "https://i.pravatar.cc/300?img=17", title: "Rizky Firmansyah", subtitle: "DevOps Engineer", handle: "@rizkyf", borderColor: "#3B82F6", gradient: "linear-gradient(145deg, #3B82F6, #000)" },
  { image: "https://i.pravatar.cc/300?img=18", title: "Nina Safitri", subtitle: "System Analyst", handle: "@ninasafitri", borderColor: "#10B981", gradient: "linear-gradient(180deg, #10B981, #000)" },
  { image: "https://i.pravatar.cc/300?img=19", title: "Fajar Nugroho", subtitle: "Frontend Developer", handle: "@fajarn", borderColor: "#F59E0B", gradient: "linear-gradient(165deg, #F59E0B, #000)" },
  { image: "https://i.pravatar.cc/300?img=20", title: "Lina Marlina", subtitle: "UI/UX Designer", handle: "@linamarlina", borderColor: "#EF4444", gradient: "linear-gradient(195deg, #EF4444, #000)" },
  { image: "https://i.pravatar.cc/300?img=21", title: "Bayu Setiawan", subtitle: "Backend Engineer", handle: "@bayus", borderColor: "#8B5CF6", gradient: "linear-gradient(225deg, #8B5CF6, #000)" },
  { image: "https://i.pravatar.cc/300?img=22", title: "Dian Novita", subtitle: "Scrum Master", handle: "@diannov", borderColor: "#06B6D4", gradient: "linear-gradient(135deg, #06B6D4, #000)" },
  { image: "https://i.pravatar.cc/300?img=23", title: "Eko Prasetyo", subtitle: "Software Architect", handle: "@ekopras", borderColor: "#4F46E5", gradient: "linear-gradient(145deg, #4F46E5, #000)" },
  { image: "https://i.pravatar.cc/300?img=24", title: "Sinta Maharani", subtitle: "Content Writer", handle: "@sintam", borderColor: "#10B981", gradient: "linear-gradient(210deg, #10B981, #000)" },
  { image: "https://i.pravatar.cc/300?img=25", title: "Yudi Hartono", subtitle: "Frontend Developer", handle: "@yudihartono", borderColor: "#F59E0B", gradient: "linear-gradient(165deg, #F59E0B, #000)" },
  { image: "https://i.pravatar.cc/300?img=26", title: "Fitri Handayani", subtitle: "Backend Engineer", handle: "@fitrihand", borderColor: "#EF4444", gradient: "linear-gradient(195deg, #EF4444, #000)" },
  { image: "https://i.pravatar.cc/300?img=27", title: "Hendra Gunawan", subtitle: "Security Analyst", handle: "@hendrag", borderColor: "#8B5CF6", gradient: "linear-gradient(225deg, #8B5CF6, #000)" },
  { image: "https://i.pravatar.cc/300?img=28", title: "Maya Putri", subtitle: "UI/UX Designer", handle: "@mayaputri", borderColor: "#06B6D4", gradient: "linear-gradient(135deg, #06B6D4, #000)" },
  { image: "https://i.pravatar.cc/300?img=29", title: "Reza Oktavian", subtitle: "Mobile Developer", handle: "@rezao", borderColor: "#3B82F6", gradient: "linear-gradient(145deg, #3B82F6, #000)" },
  { image: "https://i.pravatar.cc/300?img=30", title: "Tari Wulandari", subtitle: "Quality Assurance", handle: "@tariw", borderColor: "#10B981", gradient: "linear-gradient(180deg, #10B981, #000)" },
  { image: "https://i.pravatar.cc/300?img=31", title: "Anton Syahputra", subtitle: "Data Analyst", handle: "@antons", borderColor: "#F59E0B", gradient: "linear-gradient(165deg, #F59E0B, #000)" },
  { image: "https://i.pravatar.cc/300?img=32", title: "Vina Panduwinata", subtitle: "Frontend Developer", handle: "@vinap", borderColor: "#EF4444", gradient: "linear-gradient(195deg, #EF4444, #000)" },
  { image: "https://i.pravatar.cc/300?img=33", title: "Galih Rakasiwi", subtitle: "Backend Engineer", handle: "@galihr", borderColor: "#8B5CF6", gradient: "linear-gradient(225deg, #8B5CF6, #000)" },
  { image: "https://i.pravatar.cc/300?img=34", title: "Nadia Vega", subtitle: "Product Owner", handle: "@nadiav", borderColor: "#06B6D4", gradient: "linear-gradient(135deg, #06B6D4, #000)" }
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EFFF] text-[#0400F4] text-sm font-semibold mb-6">
            Meet The Minds
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#2E2D2D] mb-6 tracking-tight">
            Arsitek di Balik <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0400F4] to-[#8B5CF6]">Sitemsa</span>
          </h1>
          <p className="text-[#737373] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Mengenal lebih dekat 24 inovator tangguh dari Tim PPL Lantip SMK Negeri 1 Semarang yang membangun platform pembelajaran ini.
          </p>
        </div>

        <div className="relative w-full min-h-[800px] h-auto">
          <ChromaGrid 
            items={teamMembers}
            radius={250}
            damping={0.4}
            fadeOut={0.8}
            ease="power3.out"
            columns={4}
            rows={6}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
