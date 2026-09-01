import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sitemsa - Platform Pembelajaran Vokasi Masa Depan",
    short_name: "Sitemsa",
    description:
      "Platform pembelajaran dan modul interaktif kejuruan vokasi SMK karya Lantip 7 SMKN 1 Semarang.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
