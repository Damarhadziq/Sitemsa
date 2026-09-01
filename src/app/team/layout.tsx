import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tim Pengembang Sitemsa",
  description:
    "Mengenal tim pengembang, instruktur, dan kontributor di balik platform pembelajaran vokasi Sitemsa karya Lantip 7 SMKN 1 Semarang.",
  keywords: [
    "Tim Sitemsa",
    "Pengembang Sitemsa",
    "Lantip 7 SMKN 1 Semarang",
    "Guru SMKN 1 Semarang",
    "Kontributor Vokasi Sitemsa",
  ],
  openGraph: {
    title: "Tim Pengembang Sitemsa | SMKN 1 Semarang",
    description:
      "Profil tim pengembang dan instruktur inovatif platform pembelajaran vokasi Sitemsa.",
    url: "https://sitemsa.vercel.app/team",
  },
  alternates: {
    canonical: "https://sitemsa.vercel.app/team",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
