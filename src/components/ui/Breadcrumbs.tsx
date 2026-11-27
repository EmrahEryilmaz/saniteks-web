import { localizePath, type Locale } from "@/i18n/config";
import { Link } from "@/i18n/Link";
import { getT } from "@/i18n/server";
import { focusStyle, textLinkClass } from "./styles";

export type Crumb = { label: string; href?: string };

const tones = {
  light: { link: `${textLinkClass} inline-flex min-h-11 items-center`, separator: "text-muted-foreground", current: "text-muted-foreground" },
  dark: {
    link: `inline-flex min-h-11 items-center text-primary-foreground/85 underline-offset-4 hover:text-primary-foreground hover:underline ${focusStyle}`,
    separator: "text-primary-foreground/50",
    current: "text-primary-foreground/70",
  },
} as const;

/** "Ana Sayfa / Ürünler / …" trail. The last item is the current page. `dark` is for photo heroes. */
export async function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: keyof typeof tones }) {
  const c = tones[tone];
  const t = await getT();
  return (
    <nav aria-label={t("Sayfa konumu")}>
      <ol className="flex flex-wrap items-center gap-x-3 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex min-h-11 min-w-0 items-center gap-3">
              {i > 0 ? (
                <span aria-hidden="true" className={c.separator}>
                  /
                </span>
              ) : null}
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined} className={c.current}>
                  {item.label}
                </span>
              ) : (
                <Link className={c.link} href={item.href}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Breadcrumb trail → schema.org BreadcrumbList (absolute URLs in the page language; paths without language prefix). */
export function breadcrumbJsonLd(items: Crumb[], baseUrl: string, currentPath: string, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: new URL(localizePath(item.href ?? currentPath, locale), baseUrl).toString(),
    })),
  };
}
