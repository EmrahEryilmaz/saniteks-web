import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/metadata";

export type PageImage = { src: string; alt: string; width: number; height: number };

type CorporateMetadataInput = {
  /** Already translated page title without the " | Saniteks" suffix (the root layout template adds it). */
  title: string;
  /** Already translated description. */
  description: string;
  /** Path of the page without language prefix, e.g. "/kurumsal/hakkinda". */
  path: string;
  /** Share image — the page hero, as on the live site (alt already translated). */
  image: PageImage;
};

/**
 * Metadata for the corporate pages in the current language: a thin wrapper around i18n/metadata › pageMetadata
 * (canonical + hreflang alternates, Open Graph, Twitter) that takes the hero image in its { src, alt, … } form.
 * Use it from generateMetadata(): `return corporateMetadata({ title: t("…"), … })`.
 */
export async function corporateMetadata({ title, description, path, image }: CorporateMetadataInput): Promise<Metadata> {
  return pageMetadata({ title, description, path, image: { url: image.src, alt: image.alt, width: image.width, height: image.height } });
}
