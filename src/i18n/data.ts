import { cache } from "react";
import { categories as baseCategories, categorySkus, type Category, type SkuEntry, type SkuIndexEntry } from "@/data/products";
import { getLocale, getT } from "./server";
import { localizeDeep } from "./translate";

/**
 * Localized views of the data modules for the current language (Server Components). The data files stay Turkish;
 * every translatable string is looked up in translations/<lang>.json (see translate.ts › localizeDeep).
 */
export const getCategories = cache(async (): Promise<Category[]> => {
  const t = await getT();
  return localizeDeep(baseCategories, t);
});

export async function getCategory(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function getSku(categorySlug: string, skuSlug: string): Promise<SkuEntry | undefined> {
  const category = await getCategory(categorySlug);
  return category ? categorySkus(category).find((e) => e.sku.slug === skuSlug) : undefined;
}

/** Flat list of every SKU with its parents, localized (search, product-code index). */
export async function getAllSkus(): Promise<SkuIndexEntry[]> {
  return (await getCategories()).flatMap((category) =>
    category.products.flatMap((product) =>
      product.skus.map((sku) => ({
        ...sku,
        category: { slug: category.slug, name: category.name },
        product: { slug: product.slug, name: product.name, categorySlug: product.categorySlug },
      })),
    ),
  );
}

/** Any other data module (corporate, quality, capabilities, careers, hero slides …) in the current language. */
export async function localized<T>(value: T): Promise<T> {
  return localizeDeep(value, await getT());
}

export { getLocale };
