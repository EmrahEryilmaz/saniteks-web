import { corporatePages } from "@/data/corporate";
import { privateLabelPath } from "@/data/privateLabel";
import { categoryHref } from "@/data/products";
import { qualityHref, qualityPages } from "@/data/quality";
import { getCategories, localized } from "@/i18n/data";
import { getT } from "@/i18n/server";
import { mainNav } from "./site";

export type NavLink = { id: string; label: string; href: string };
/** activePrefix: every route under it marks the entry as the current section (aria-current="location"). */
export type NavEntry = NavLink & { children?: NavLink[]; activePrefix?: string };

/** Header + mobile menu: "Kurumsal", "Ürünler" and "Kalite" open submenus. Labels in the current language. */
export async function getHeaderNavigation(): Promise<NavEntry[]> {
  const t = await getT();
  const [nav, corporate, quality, categories] = await Promise.all([
    localized(mainNav),
    localized(corporatePages),
    localized(qualityPages.map((p) => ({ slug: p.slug, label: p.label }))),
    getCategories(),
  ]);
  const catalogsLink: NavLink = { id: "catalogs", label: t("Kataloglar"), href: "/kataloglar" };
  const privateLabelLink: NavLink = { id: "private-label", label: t("Özel Marka Üretimi"), href: privateLabelPath };
  return nav.map((item) => {
    if (item.href === "/urunler") {
      return {
        id: "products",
        ...item,
        children: [...categories.map((c) => ({ id: c.slug, label: c.name, href: categoryHref(c) })), privateLabelLink, catalogsLink],
      };
    }
    if (item.href.startsWith("/kurumsal")) {
      return { id: "corporate", ...item, activePrefix: "/kurumsal", children: corporate.map((p) => ({ id: p.href, label: p.label, href: p.href })) };
    }
    if (item.href.startsWith("/kalite")) {
      return {
        id: "quality",
        ...item,
        activePrefix: "/kalite",
        children: quality.map((p) => ({ id: p.slug, label: p.label, href: qualityHref(p.slug) })),
      };
    }
    return { id: item.href, ...item };
  });
}

/** Footer: corporate sub-pages under "Kurumsal"; "Özel Marka Üretimi" and "Kataloglar" under "Ürünler". */
export async function getFooterNavigation(): Promise<NavEntry[]> {
  const t = await getT();
  const [nav, corporate] = await Promise.all([localized(mainNav), localized(corporatePages)]);
  const catalogsLink: NavLink = { id: "catalogs", label: t("Kataloglar"), href: "/kataloglar" };
  const privateLabelLink: NavLink = { id: "private-label", label: t("Özel Marka Üretimi"), href: privateLabelPath };
  return nav.map((item) => {
    if (item.href === "/urunler") return { id: "products", ...item, children: [privateLabelLink, catalogsLink] };
    if (item.href.startsWith("/kurumsal")) {
      return { id: "corporate", ...item, activePrefix: "/kurumsal", children: corporate.map((p) => ({ id: p.href, label: p.label, href: p.href })) };
    }
    if (item.href.startsWith("/kalite")) return { id: "quality", ...item, activePrefix: "/kalite" };
    return { id: item.href, ...item };
  });
}
