import { corporatePages } from "@/data/corporate";
import { privateLabelPath } from "@/data/privateLabel";
import { categories, categoryHref } from "@/data/products";
import { qualityHref, qualityPages } from "@/data/quality";
import { mainNav } from "./site";

export type NavLink = { id: string; label: string; href: string };
/** activePrefix: every route under it marks the entry as the current section (aria-current="location"). */
export type NavEntry = NavLink & { children?: NavLink[]; activePrefix?: string };

const catalogsLink: NavLink = { id: "catalogs", label: "Kataloglar", href: "/kataloglar" };
const privateLabelLink: NavLink = { id: "private-label", label: "Özel Marka Üretimi", href: privateLabelPath };
const corporateLinks: NavLink[] = corporatePages.map((p) => ({ id: p.href, label: p.label, href: p.href }));
const qualityLinks: NavLink[] = qualityPages.map((p) => ({ id: p.slug, label: p.label, href: qualityHref(p.slug) }));

/** Header + mobile menu: "Kurumsal", "Ürünler" and "Kalite" open submenus. */
export const headerNavigation: NavEntry[] = mainNav.map((item) => {
  if (item.href === "/urunler") {
    return {
      id: "products",
      ...item,
      children: [...categories.map((c) => ({ id: c.slug, label: c.name, href: categoryHref(c) })), privateLabelLink, catalogsLink],
    };
  }
  if (item.href.startsWith("/kurumsal")) return { id: "corporate", ...item, activePrefix: "/kurumsal", children: corporateLinks };
  if (item.href.startsWith("/kalite")) return { id: "quality", ...item, activePrefix: "/kalite", children: qualityLinks };
  return { id: item.href, ...item };
});

/** Footer: corporate sub-pages under "Kurumsal"; "Özel Marka Üretimi" and "Kataloglar" under "Ürünler". */
export const footerNavigation: NavEntry[] = mainNav.map((item) => {
  if (item.href === "/urunler") return { id: "products", ...item, children: [privateLabelLink, catalogsLink] };
  if (item.href.startsWith("/kurumsal")) return { id: "corporate", ...item, activePrefix: "/kurumsal", children: corporateLinks };
  if (item.href.startsWith("/kalite")) return { id: "quality", ...item, activePrefix: "/kalite" };
  return { id: item.href, ...item };
});
