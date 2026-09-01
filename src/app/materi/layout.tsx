import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Materi & Modul Vokasi",
  description:
    "Eksplorasi modul pembelajaran kejuruan SMK lengkap di Sitemsa: Informatika, Teknik Elektronika, Teknik Otomotif, Seni Tari, Bimbingan Konseling, dan Keolahragaan.",
  keywords: [
    "Materi SMK",
    "Modul Vokasi",
    "Katalog Materi Sitemsa",
    "Informatika SMK",
    "Teknik Elektronika",
    "Teknik Otomotif",
    "Seni Tari",
    "Bimbingan Konseling",
    "Keolahragaan",
    "Modul Pembelajaran Interaktif",
  ],
  openGraph: {
    title: "Katalog Materi & Modul Vokasi | Sitemsa",
    description:
      "Akses puluhan modul pembelajaran interaktif dan materi kejuruan SMK lengkap di Sitemsa.",
    url: "https://sitemsa.vercel.app/materi",
  },
  alternates: {
    canonical: "https://sitemsa.vercel.app/materi",
  },
};

export default function MateriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
