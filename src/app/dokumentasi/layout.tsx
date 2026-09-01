import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokumentasi & Panduan Platform",
  description:
    "Panduan lengkap penggunaan fitur platform pembelajaran Sitemsa: navigasi modul, pengerjaan kuis interaktif, monitoring progres, dan verifikasi sertifikasi.",
  keywords: [
    "Dokumentasi Sitemsa",
    "Panduan Pengguna Sitemsa",
    "Cara Pakai Sitemsa",
    "Fitur LMS Sitemsa",
    "Panduan Kuis Sitemsa",
  ],
  openGraph: {
    title: "Dokumentasi & Panduan Platform | Sitemsa",
    description:
      "Panduan lengkap dan dokumentasi fitur platform pembelajaran vokasi Sitemsa.",
    url: "https://sitemsa.vercel.app/dokumentasi",
  },
  alternates: {
    canonical: "https://sitemsa.vercel.app/dokumentasi",
  },
};

export default function DokumentasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
