import Image from "next/image";
import { corporatePages } from "@/data/corporate";
import { localized } from "@/i18n/data";
import { Link } from "@/i18n/Link";
import { getT } from "@/i18n/server";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { containerClass, cx, focusStyle } from "@/components/ui/styles";

type CorporateHeroProps = {
  crumbs: Crumb[];
  title: string;
  subtitle: string;
  image: { src: string; alt: string };
  /** Path of the current sub-page, highlighted in the tab strip. */
  current: string;
  /** "left" for Hakkında, "center" for the listing sub-pages (as on sanifoam.com.tr). */
  align?: "left" | "center";
  /** Section label above the title (already translated); defaults to the corporate section. */
  eyebrow?: string;
  /** Sibling pages shown as tabs (labels already translated); defaults to the corporate sub-pages. */
  tabs?: { href: string; label: string }[];
  /** Accessible name of the tab strip (already translated); defaults to "Kurumsal sayfalar". */
  tabsLabel?: string;
};

/**
 * Full-bleed photo hero for /kurumsal/* — sanifoam.com.tr's corporate hero structure in the Saniteks
 * visual language (home-slider overlays, rule-before eyebrow, green border accents), with a tab strip
 * linking the three corporate sub-pages.
 */
export async function CorporateHero({
  crumbs,
  title,
  subtitle,
  image,
  current,
  align = "left",
  eyebrow: eyebrowProp,
  tabs: tabsProp,
  tabsLabel: tabsLabelProp,
}: CorporateHeroProps) {
  const t = await getT();
  const eyebrow = eyebrowProp ?? t("KURUMSAL");
  const tabs = tabsProp ?? (await localized(corporatePages));
  const tabsLabel = tabsLabelProp ?? t("Kurumsal sayfalar");
  const centered = align === "center";
  return (
    <section aria-labelledby="page-title" className="relative isolate overflow-hidden bg-foreground text-primary-foreground">
      <div className="absolute inset-0 -z-10">
        <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover object-center" />
        <div aria-hidden="true" className="absolute inset-0 bg-overlay/35" />
        <div
          aria-hidden="true"
          className={cx(
            "absolute inset-y-0 start-0 w-full border-e border-primary-foreground/15 bg-foreground/55",
            centered ? "lg:inset-x-0" : "lg:w-[58%]",
          )}
        />
      </div>

      <div className={cx(containerClass, "pt-7 md:pt-9")}>
        <Breadcrumbs items={crumbs} tone="dark" />
        <div className={cx("py-14 md:py-20 lg:py-24", centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl")}>
          <p
            className={cx(
              "mb-5 flex items-center gap-4 text-[10px] font-semibold tracking-[0.2em] before:h-px before:w-10 before:bg-primary md:text-xs",
              centered && "justify-center after:h-px after:w-10 after:bg-primary",
            )}
          >
            {eyebrow}
          </p>
          <h1
            id="page-title"
            className={cx(
              "whitespace-pre-line text-4xl font-semibold leading-[1.12] tracking-[-0.025em] break-words md:text-5xl lg:text-6xl",
              centered ? "mx-auto max-w-[20ch]" : "max-w-[18ch]",
            )}
          >
            {title}
          </h1>
          <p
            className={cx(
              "mt-6 text-base leading-7 text-primary-foreground/90 md:text-lg md:leading-8",
              centered ? "mx-auto max-w-2xl" : "max-w-xl border-s-2 border-primary ps-5",
            )}
          >
            {subtitle}
          </p>
        </div>
      </div>

      <nav aria-label={tabsLabel} className="border-t border-primary-foreground/25 bg-foreground/85">
        <ul className={cx(containerClass, "flex gap-x-7 overflow-x-auto")}>
          {tabs.map((page) => {
            const active = page.href === current;
            return (
              <li key={page.href} className="shrink-0">
                <Link
                  href={page.href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "relative flex min-h-12 items-center text-sm font-semibold whitespace-nowrap transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left rtl:after:origin-right after:scale-x-0 after:bg-primary after:transition-transform hover:text-primary-foreground hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 motion-reduce:transition-none motion-reduce:after:transition-none",
                    active ? "text-primary-foreground" : "text-primary-foreground/70",
                    focusStyle,
                  )}
                >
                  {page.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
