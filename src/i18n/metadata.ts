import type { Metadata } from "next";
import { site } from "@/lib/site";
import { defaultLocale, localizePath, locales, ogLocales, type Locale } from "./config";
import { getLocale, getT } from "./server";

/** canonical + hreflang alternates of a page (path without language prefix, e.g. "/urunler"). */
export function alternatesFor(path: string, locale: Locale): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, localizePath(path, l)]));
  languages["x-default"] = localizePath(path, defaultLocale);
  return { canonical: localizePath(path, locale), languages };
}

type PageMetadataInput = {
  /** Already translated title (without " | Saniteks"). */
  title: string;
  /** Already translated description. */
  description: string;
  /** Path without language prefix. */
  path: string;
  image?: { url: string; alt: string; width?: number; height?: number };
};

/**
 * Page metadata in the current language: title, description, canonical + hreflang alternates, Open Graph and Twitter.
 * Open Graph / Twitter objects replace the layout's (shallow merge), so the shared fields are repeated here.
 */
export async function pageMetadata({ title, description, path, image }: PageMetadataInput): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getT();
  const url = localizePath(path, locale);
  const fullTitle = `${title} | ${site.name}`;
  const images = [image ?? { url: site.ogImage, width: 1920, height: 1080, alt: t("Günlük yaşam için temizlik çözümleri") }];
  return {
    title,
    description,
    alternates: alternatesFor(path, locale),
    openGraph: { type: "website", siteName: site.name, locale: ogLocales[locale], title: fullTitle, description, url, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}
