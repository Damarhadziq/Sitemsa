import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tips & Artikel Belajar Vokasi",
  description:
    "Kumpulan artikel, tips belajar efektif, panduan praktikum kejuruan, dan wawasan industri untuk siswa vokasi dan SMK di Sitemsa.",
  keywords: [
    "Tips Belajar SMK",
    "Artikel Vokasi",
    "Tips Belajar Sitemsa",
    "Panduan Praktikum SMK",
    "Belajar Pemrograman SMK",
    "Strategi Belajar Efektif",
  ],
  openGraph: {
    title: "Tips & Artikel Belajar Vokasi | Sitemsa",
    description:
      "Temukan panduan belajar efektif, tips praktikum kejuruan, dan strategi sukses vokasi di Sitemsa.",
    url: "https://sitemsa.vercel.app/tips-belajar",
  },
  alternates: {
    canonical: "https://sitemsa.vercel.app/tips-belajar",
  },
};

export default function TipsBelajarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
