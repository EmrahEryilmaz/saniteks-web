import type { Metadata } from "next";
import { site } from "./site";

type OgInput = {
  title: string;
  description: string;
  url: string;
  image?: { url: string; alt: string };
};

/**
 * Page-level openGraph replaces the layout's object entirely, so every page
 * re-declares the shared fields through this helper.
 */
export function pageOpenGraph({ title, description, url, image }: OgInput): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title,
    description,
    url,
    images: [image ?? { url: site.ogImage, width: 1920, height: 1080, alt: "Günlük yaşam için temizlik çözümleri" }],
  };
}
