import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { focusStyle } from "@/components/ui/styles";
import { I18nProvider } from "@/i18n/client";
import { isLocale, isRtl, localizePath, locales, ogLocales } from "@/i18n/config";
import { alternatesFor } from "@/i18n/metadata";
import { getClientDictionary, getLocale, getT } from "@/i18n/server";
import { site } from "@/lib/site";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getT();
  const title = t("Saniteks | Temizlik Ürünleri ve Çözümleri");
  const description = t(
    "Saniteks temizlik bezleri, süngerleri ve malzeme seçeneklerini keşfedin. Ürünler ve iş birliği için bizimle iletişime geçin.",
  );
  const imageAlt = t("Günlük yaşam için temizlik çözümleri");
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: "%s | Saniteks" },
    description,
    applicationName: site.name,
    alternates: alternatesFor("/", locale),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: ogLocales[locale],
      title,
      description,
      images: [{ url: site.ogImage, width: 1920, height: 1080, alt: imageAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [{ url: site.ogImage, alt: imageAlt }] },
    icons: {
      // Transparent cube icons; the Apple touch icon keeps its white background (iOS fills transparency with black).
      icon: [
        { url: "/images/icons/saniteks-icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/images/icons/saniteks-icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/images/icons/saniteks-icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/images/icons/saniteks-apple-icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#009933",
};

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = await getT();
  const dictionary = await getClientDictionary(lang);

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
      "@id": `${site.url}${localizePath("/", lang)}#website`,
      name: site.name,
      url: `${site.url}${localizePath("/", lang)}`,
      inLanguage: lang,
      publisher: { "@id": `${site.url}/#organization` },
    },
  ];

  return (
    <html lang={lang} dir={isRtl(lang) ? "rtl" : "ltr"} className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <I18nProvider locale={lang} dictionary={dictionary}>
          <a
            href="#main-content"
            className={`sr-only z-50 rounded-sm bg-surface p-4 text-link focus:not-sr-only focus:fixed focus:top-2 focus:start-2 ${focusStyle}`}
          >
            {t("Ana içeriğe geç")}
          </a>
          <Header />
          <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 pt-24 outline-none has-[#hero-slider]:pt-0">
            {children}
          </main>
          <Footer />
        </I18nProvider>
        <JsonLd data={organizationJsonLd} />
      </body>
    </html>
  );
}
