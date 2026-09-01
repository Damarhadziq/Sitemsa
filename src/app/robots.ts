import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sitemsa.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/materi",
          "/materi/*",
          "/tips-belajar",
          "/dokumentasi",
          "/team",
          "/icon.svg",
          "/favicon.svg",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/auth/*",
          "/profil",
          "/lengkapi-profil",
          "/verifikasi-otp",
          "/lupa-password",
          "/login",
          "/signup",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/materi",
          "/materi/*",
          "/tips-belajar",
          "/dokumentasi",
          "/team",
        ],
        disallow: [
          "/admin/*",
          "/api/*",
          "/profil",
          "/lengkapi-profil",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
