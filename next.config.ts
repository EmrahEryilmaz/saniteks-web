import type { NextConfig } from "next";
import { productTypePaths } from "./src/data/products";
import { mergedPolicyPaths } from "./src/data/quality";

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
      { source: "/kalite", destination: "/kalite/politikalarimiz", permanent: true },
      // The quality, environment and OHS policies were merged into one page (owner decision 2026-11-23).
      ...mergedPolicyPaths.map(({ from, to }) => ({ source: `/kalite/${from}`, destination: `/kalite/${to}`, permanent: true })),
      // Product-type pages (/urunler/<category>/<type>) were folded into the shop-style category pages; every product
      // now has its own page /urunler/<category>/<sku>. products.ts guarantees no SKU slug equals a type slug.
      ...productTypePaths.map(({ category, type }) => ({ source: `/urunler/${category}/${type}`, destination: `/urunler/${category}`, permanent: true })),
      // Older product-type pages that no longer exist at all.
      { source: "/urunler/ovucu-materyaller/naturel-kece", destination: "/urunler/dogal-urunler", permanent: true },
      { source: "/urunler/ozel-formlu-sungerler/:old(oval-formlu-sunger|kavrama-formlu-sunger)", destination: "/urunler/ozel-formlu-sungerler", permanent: true },
      { source: "/urunler/ozel-formlu-sungerler/sihirli-sunger", destination: "/urunler/ozel-formlu-sungerler/106-0-202-24", permanent: true },
      { source: "/urunler/hammadde/rulo-hammadde", destination: "/urunler/hammadde", permanent: true },
      // Logo/icons were recoloured (yellow cube) and renamed so cached green copies are never served.
      { source: "/images/logo/logo.png", destination: "/images/logo/saniteks-logo.png", permanent: true },
      // Icons live under /images/icons: on the Plesk/Apache host "/icons/" is a server-wide alias for Apache's own icon
      // folder, so nothing under /icons/ ever reaches the app there. These redirects only help other hosts.
      { source: "/icons/icon-192.png", destination: "/images/icons/saniteks-icon-192.png", permanent: true },
      { source: "/icons/icon-512.png", destination: "/images/icons/saniteks-icon-512.png", permanent: true },
      { source: "/icons/apple-icon.png", destination: "/images/icons/saniteks-apple-icon.png", permanent: true },
      { source: "/icons/:file(saniteks-.*\\.png)", destination: "/images/icons/:file", permanent: true },
      // Catalogue cut-outs replaced by the 2026 studio photos (/images/urunler/<code>-<n>.webp). Only the removed files
      // are listed: redirects run before public files, so a broader pattern would hide catalogue images still in use.
      {
        source: "/images/catalog/:slug(100-0-350-30|100-0-400-16|100-0-600-c|100-0-800-120t|100-0-850-60t|100-0-876-60t|101-0-302-72|101-0-303-36|101-0-304-36|101-0-350-40|101-0-376-24|101-0-410-30|101-0-750-48|101-0-800-66t|101-0-850-36t|102-0-090-16|102-0-101-16|102-0-102-16|102-0-600-60|103-0-003-20|103-0-200-40|103-0-302-45|104-0-102-80t|104-0-103-100|104-0-104-90|105-0-105-168t|105-0-204-168t|106-0-001-36|106-0-020-50|106-0-202-24|106-0-500-18|110-0-001-20|110-0-002-20|110-0-050-20|110-0-201-20|110-0-650-c|110-0-663-c|110-0-840-12|110-0-841-12|110-0-842-12|113-0-001-48|114-0-001-50|114-0-003-50|114-0-100-50|116-0-005-50|125-0-105-100|125-0-114-120|125-0-115-80|125-0-502-90|230-0-975){-2026}?.webp",
        destination: "/images/urunler/:slug-1.webp",
        permanent: true,
      },
      { source: "/images/catalog/rulo-kece.webp", destination: "/images/products/hammadde/ovucu-kece-rulo.webp", permanent: true },
      { source: "/images/catalog/rulo-temizlik-bezi-20-80.webp", destination: "/images/products/hammadde/non-woven-bez-rulo.webp", permanent: true },
      { source: "/images/catalog/super-tekli-duz.webp", destination: "/images/urunler/101-0-001-50-1.webp", permanent: true },
      { source: "/images/catalog/super-tekli-oluklu{-2026}?.webp", destination: "/images/urunler/100-0-125-40-1.webp", permanent: true },
      // Category images: the owner's photos (2026-11-23) replaced the earlier compositions and catalogue packshots.
      {
        source: "/images/products/kategori-:slug(temizlik-sungerleri|temizlik-bezleri|ovucu-materyaller|ozel-formlu-sungerler|dogal-urunler){-sayfa}?.webp",
        destination: "/images/products/kategori-:slug-foto.webp",
        permanent: true,
      },
      { source: "/images/products/hammadde/rulo-nonwoven-kece-4x3.webp", destination: "/images/products/kategori-plaka-ve-rulo-urunler-foto.webp", permanent: true },
      { source: "/images/products/category-sponges{-2026}?.webp", destination: "/images/products/kategori-temizlik-sungerleri-foto.webp", permanent: true },
      { source: "/images/products/category-scourers{-2026}?.webp", destination: "/images/products/kategori-ovucu-materyaller-foto.webp", permanent: true },
      { source: "/images/products/category-specialty-2026.webp", destination: "/images/products/kategori-ozel-formlu-sungerler-foto.webp", permanent: true },
    ];
  },
};

export default nextConfig;
