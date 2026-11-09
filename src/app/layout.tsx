import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { focusStyle } from "@/components/ui/styles";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.defaultTitle, template: "%s | Saniteks" },
  description: site.defaultDescription,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: site.defaultTitle,
    description: site.defaultDescription,
    images: [{ url: site.ogImage, width: 1920, height: 1080, alt: "Günlük yaşam için temizlik çözümleri" }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.defaultTitle,
    description: site.defaultDescription,
    images: [{ url: site.ogImage, alt: "Günlük yaşam için temizlik çözümleri" }],
  },
  icons: {
    // Transparent cube icons; the Apple touch icon keeps its white background (iOS fills transparency with black).
    icon: [
      { url: "/icons/saniteks-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/saniteks-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/saniteks-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/saniteks-apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#009933",
};

const organizationJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}${site.logo}`,
    email: site.contact.email,
    telephone: site.contact.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.addressParts.street,
      addressLocality: site.contact.addressParts.district,
      addressRegion: site.contact.addressParts.city,
      addressCountry: site.contact.addressParts.country,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "tr-TR",
    publisher: { "@id": `${site.url}/#organization` },
  },
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="tr" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <a
          href="#main-content"
          className={`sr-only z-50 rounded-sm bg-surface p-4 text-link focus:not-sr-only focus:fixed focus:top-2 focus:left-2 ${focusStyle}`}
        >
          Ana içeriğe geç
        </a>
        <Header />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 pt-24 outline-none has-[#hero-slider]:pt-0">
          {children}
        </main>
        <Footer />
        <JsonLd data={organizationJsonLd} />
      </body>
    </html>
  );
}
