'use client';

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { FeaturedSection } from "@/components/dashboard/FeaturedSection";
import { SubjectCatalog } from "@/components/dashboard/SubjectCatalog";
import { PromoBanner } from "@/components/dashboard/PromoBanner";
import { LearningArticles } from "@/components/dashboard/LearningArticles";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-8 md:pb-12 w-full flex-1">
        {isLoading ? (
          <div className="space-y-8 animate-pulse">
            {/* Hero Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-3 w-full md:w-1/2">
                <div className="w-48 h-8 bg-gray-100 rounded-[8px]" />
                <div className="w-full h-5 bg-gray-100 rounded-[6px]" />
              </div>
              <div className="w-full md:w-[380px] h-[120px] bg-gray-100 rounded-[12px]" />
            </div>

            {/* Featured Skeleton */}
            <div className="h-[220px] bg-gray-100 rounded-[12px]" />

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[180px] bg-gray-100 rounded-[10px]" />
              ))}
            </div>
          </div>
        ) : (
          <div className="transition-opacity duration-300">
            <HeroSection />
            <FeaturedSection />
            <SubjectCatalog />
            <PromoBanner />
            <LearningArticles />
          </div>
        )}
      </main>
    </div>
  );
}
