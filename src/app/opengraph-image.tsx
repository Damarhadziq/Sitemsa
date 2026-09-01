import { ImageResponse } from "next/og";

export const alt = "Sitemsa - Platform Pembelajaran Vokasi Masa Depan";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #1E3A8A 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "64px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.45) 0%, rgba(99,102,241,0.2) 50%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "20%",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 60%)",
          }}
        />

        {/* Top Header / Logo Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563EB, #6366F1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: "26px",
              fontWeight: 800,
              boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
            }}
          >
            S
          </div>
          <span style={{ fontSize: "32px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.5px" }}>
            Sitemsa
          </span>
          <span
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "6px 14px",
              borderRadius: "20px",
              color: "#93C5FD",
              fontSize: "14px",
              fontWeight: 600,
              marginLeft: "12px",
            }}
          >
            Lantip 7 SMKN 1 Semarang
          </span>
        </div>

        {/* Main Content Title & Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "950px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
              margin: 0,
            }}
          >
            Platform Pembelajaran Vokasi Masa Depan
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "#CBD5E1",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Modul interaktif, materi kejuruan SMK lengkap, kuis adaptif, dan evaluasi capaian belajar terintegrasi.
          </p>
        </div>

        {/* Footer Badges / Subjects */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {["Informatika", "Elektronika", "Otomotif", "Seni Tari", "Bimbingan Konseling", "Keolahragaan"].map(
            (badge) => (
              <div
                key={badge}
                style={{
                  background: "rgba(37, 99, 235, 0.2)",
                  border: "1px solid rgba(96, 165, 250, 0.3)",
                  padding: "8px 18px",
                  borderRadius: "10px",
                  color: "#E0F2FE",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                {badge}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
