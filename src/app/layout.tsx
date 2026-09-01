import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sitemsa.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sitemsa - Platform Pembelajaran Vokasi Masa Depan",
    template: "%s | Sitemsa",
  },
  description:
    "Sitemsa adalah platform pembelajaran vokasi digital interaktif persembahan Lantip 7 SMKN 1 Semarang. Menyediakan modul kejuruan Informatika, Elektronika, Otomotif, Seni Tari, BK, dan Olahraga beserta kuis evaluasi adaptif.",
  keywords: [
    "Sitemsa",
    "SINTESA",
    "Sitemsa Vokasi",
    "Platform Pembelajaran Sitemsa",
    "Sitemsa SMKN 1 Semarang",
    "Sitemsa Vercel",
    "LMS Vokasi",
    "Materi SMK",
    "Modul Interaktif SMK",
    "Pembelajaran Vokasi Digital",
    "Kuis Vokasi",
    "Kurikulum Merdeka SMK",
    "Informatika SMK",
    "Teknik Elektronika",
    "Teknik Otomotif",
    "Seni Tari SMK",
    "Bimbingan Konseling SMK",
    "Pendidikan Jasmani Olahraga SMK",
    "SMK Bisa",
    "E-Learning Vokasi Indonesia",
  ],
  authors: [{ name: "Tim Sitemsa Lantip 7", url: siteUrl }],
  creator: "Lantip 7 SMKN 1 Semarang",
  publisher: "Sitemsa",
  applicationName: "Sitemsa",
  category: "education",
  classification: "Educational Platform",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Sitemsa",
    title: "Sitemsa - Platform Pembelajaran Vokasi Masa Depan",
    description:
      "Akses modul pembelajaran interaktif, materi kejuruan SMK lengkap, dan kuis evaluasi adaptif di platform Sitemsa.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Sitemsa - Platform Pembelajaran Vokasi Masa Depan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitemsa - Platform Pembelajaran Vokasi Masa Depan",
    description:
      "Platform pembelajaran vokasi interaktif karya Lantip 7 SMKN 1 Semarang.",
    images: [`${siteUrl}/opengraph-image`],
    creator: "@sitemsa",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563EB",
};

// JSON-LD Structured Data Schema for Google Rich Results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${siteUrl}/#organization`,
      name: "Sitemsa",
      alternateName: ["SINTESA", "Sitemsa Vokasi", "Lantip 7 SMKN 1 Semarang"],
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      description:
        "Platform Pembelajaran Vokasi Masa Depan yang menyediakan materi kejuruan dan modul interaktif untuk siswa dan pengajar SMK di Indonesia.",
      sameAs: [
        "https://www.instagram.com/lantip7_smkn1semarang",
        "https://www.tiktok.com/@lantip7_smkn1semarang",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Semarang",
        addressRegion: "Jawa Tengah",
        addressCountry: "ID",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Sitemsa",
      alternateName: "SINTESA",
      description: "Platform Pembelajaran Vokasi Masa Depan",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "id-ID",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/materi?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#app`,
      name: "Sitemsa",
      applicationCategory: "EducationalApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
      },
    },
  ],
};

import { AuthProvider } from "@/lib/auth-context";
import { QueryProvider } from "@/components/providers/query-provider";
import { StudentAuthGuard } from "@/components/providers/StudentAuthGuard";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} font-sans h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <StudentAuthGuard>{children}</StudentAuthGuard>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
