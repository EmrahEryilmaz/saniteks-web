import type { Metadata } from "next";
import { site } from "@/lib/site";

export type PageImage = { src: string; alt: string; width: number; height: number };

type CorporateMetadataInput = {
  /** Page title without the " | Saniteks" suffix (the root layout template adds it). */
  title: string;
  description: string;
  /** Path of the page, e.g. "/kurumsal". */
  path: string;
  /** Share image — the page hero, as on the live site. */
  image: PageImage;
};

/**
 * Metadata for the corporate pages. Open Graph / Twitter objects replace the root layout's
 * (Next merges them shallowly), so the shared fields are repeated here.
 */
export function corporateMetadata({ title, description, path, image }: CorporateMetadataInput): Metadata {
  const fullTitle = `${title} | ${site.name}`;
  const images = [{ url: image.src, width: image.width, height: image.height, alt: image.alt }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      title: fullTitle,
      description,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images,
    },
  };
}
