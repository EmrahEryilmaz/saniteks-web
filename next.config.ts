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
      // Catalogue cut-outs replaced by studio photos (2026-11); new files carry a "-2026" suffix.
      {
        source:
          "/images/catalog/:slug(super-tekli-oluklu|101-0-750-48|101-0-304-36|110-0-050-20|125-0-115-80|101-0-303-36|104-0-102-80t|105-0-105-168t|103-0-003-20|106-0-202-24).webp",
        destination: "/images/catalog/:slug-2026.webp",
        permanent: true,
      },
      { source: "/images/products/category-sponges.webp", destination: "/images/products/category-sponges-2026.webp", permanent: true },
      { source: "/images/products/category-scourers.webp", destination: "/images/products/category-scourers-2026.webp", permanent: true },
    ];
  },
};

export default nextConfig;
