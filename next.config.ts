import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** public/images and public/documents are not content-hashed, so 30 days rather than immutable. */
const staticAssetCache = [{ key: "Cache-Control", value: "public, max-age=2592000" }];

const nextConfig: NextConfig = {
  // Self-contained server bundle for Plesk / Phusion Passenger (startup file: .next/standalone/server.js).
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/images/:path*", headers: staticAssetCache },
      { source: "/documents/:path*", headers: staticAssetCache },
    ];
  },
  async redirects() {
    return [
      // The corporate section now has sub-pages (Hakkında, Grup Şirketleri, Üretim Tesisleri) like sanifoam.com.tr.
      { source: "/kurumsal", destination: "/kurumsal/hakkinda", permanent: true },
      { source: "/kalite", destination: "/kalite/kalite-politikamiz", permanent: true },
      // Logo/icons were recoloured (yellow cube) and renamed so cached green copies are never served.
      { source: "/images/logo/logo.png", destination: "/images/logo/saniteks-logo.png", permanent: true },
      // Icons live under /images/icons: on the Plesk/Apache host "/icons/" is a server-wide alias for Apache's own icon
      // folder, so nothing under /icons/ ever reaches the app there. These redirects only help other hosts.
      { source: "/icons/icon-192.png", destination: "/images/icons/saniteks-icon-192.png", permanent: true },
      { source: "/icons/icon-512.png", destination: "/images/icons/saniteks-icon-512.png", permanent: true },
      { source: "/icons/apple-icon.png", destination: "/images/icons/saniteks-apple-icon.png", permanent: true },
      { source: "/icons/:file(saniteks-.*\\.png)", destination: "/images/icons/:file", permanent: true },
    ];
  },
};

export default nextConfig;
