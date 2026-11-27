import type { MetadataRoute } from "next";
import { kvkkNotice } from "@/components/legal/kvkk";
import { categories, categoryHref, categorySkus, skuHref } from "@/data/products";
import { qualityHref, qualityPages } from "@/data/quality";
import { localizePath, locales } from "@/i18n/config";
import { site } from "@/lib/site";

type Entry = { path: string; priority: number; changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]> };

const staticRoutes: Entry[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/kurumsal/hakkinda", priority: 0.7, changeFrequency: "yearly" },
  { path: "/kabiliyetler", priority: 0.7, changeFrequency: "yearly" },
  { path: "/kurumsal/grup-sirketleri", priority: 0.5, changeFrequency: "yearly" },
  { path: "/kurumsal/uretim-tesisleri", priority: 0.5, changeFrequency: "yearly" },
  ...qualityPages.map((p) => ({ path: qualityHref(p.slug), priority: 0.4, changeFrequency: "yearly" }) satisfies Entry),
  { path: "/urunler", priority: 0.9, changeFrequency: "monthly" },
  { path: "/urunler/ozel-marka-uretimi", priority: 0.8, changeFrequency: "yearly" },
  { path: "/surdurulebilirlik", priority: 0.6, changeFrequency: "yearly" },
  { path: "/insan-kaynaklari", priority: 0.6, changeFrequency: "yearly" },
  { path: "/iletisim", priority: 0.7, changeFrequency: "yearly" },
  { path: "/kataloglar", priority: 0.6, changeFrequency: "monthly" },
  // The KVKK notice is noindex while it is a draft; listing it would contradict that.
  ...(kvkkNotice.draft ? [] : [{ path: kvkkNotice.path, priority: 0.2, changeFrequency: "yearly" } satisfies Entry]),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes: Entry[] = categories.flatMap((category) => [
    { path: categoryHref(category), priority: 0.8, changeFrequency: "monthly" } satisfies Entry,
    ...categorySkus(category).map(({ sku }) => ({ path: skuHref(category.slug, sku.slug), priority: 0.6, changeFrequency: "monthly" }) satisfies Entry),
  ]);

  // Every page in every language, each entry listing its language versions (hreflang).
  return [...staticRoutes, ...productRoutes].flatMap(({ path, priority, changeFrequency }) => {
    const languages = Object.fromEntries(locales.map((l) => [l, new URL(localizePath(path, l), site.url).toString()]));
    return locales.map((l) => ({
      url: languages[l],
      changeFrequency,
      priority: l === "tr" ? priority : Math.round(priority * 0.9 * 10) / 10,
      alternates: { languages },
    }));
  });
}
