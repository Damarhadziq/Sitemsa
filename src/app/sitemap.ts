import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sitemsa.vercel.app";
  const now = new Date();

  // Core static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/materi`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/tips-belajar`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/dokumentasi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
  ];

  // Subject and category routes
  const subjectSlugs = [
    "informatika",
    "elektronika",
    "otomotif",
    "seni-tari",
    "bimbingan-konseling",
    "keolahragaan",
  ];

  const subjectRoutes: MetadataRoute.Sitemap = subjectSlugs.map((slug) => ({
    url: `${baseUrl}/materi?subjek=${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Default core vocational learning module pages
  const defaultModuleIds = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
  ];

  const moduleRoutes: MetadataRoute.Sitemap = defaultModuleIds.map((id) => ({
    url: `${baseUrl}/materi/${id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...subjectRoutes, ...moduleRoutes];
}
