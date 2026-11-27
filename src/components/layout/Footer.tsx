import Image from "next/image";
import { Link } from "@/i18n/Link";
import { localized } from "@/i18n/data";
import { getT } from "@/i18n/server";
import { getFooterNavigation } from "@/lib/navigation";
import { legalNav, site } from "@/lib/site";
import { containerClass, focusStyle, footerLinkClass } from "@/components/ui/styles";
import { NavigationLinks } from "./NavigationLinks";

export async function Footer() {
  const year = new Date().getFullYear();
  const t = await getT();
  const footerNavigation = await getFooterNavigation();
  const legal = await localized(legalNav);
  const text = await localized({ footerTagline: site.footerTagline });
  return (
    <footer className="border-t-4 border-primary bg-foreground text-primary-foreground print:hidden">
      <div className={`${containerClass} grid gap-9 py-12 md:grid-cols-2 lg:grid-cols-[1.1fr_0.65fr_0.7fr_1.2fr] lg:gap-12 lg:py-16`}>
        <div>
          <Link className={`inline-block ${focusStyle}`} href="/">
            <Image src={site.logo} alt={t("Saniteks ana sayfa")} width={955} height={250} className="h-auto w-52" />
          </Link>
          <p className="mt-5 max-w-xs text-base leading-7 text-primary-foreground/75">{text.footerTagline}</p>
        </div>
        <nav aria-label={t("Site bağlantıları")}>
          <h2 className="mb-5 text-xs font-semibold tracking-widest">{t("Site bağlantıları")}</h2>
          <NavigationLinks items={footerNavigation} variant="footer" />
        </nav>
        <nav aria-label={t("Yasal")}>
          <h2 className="mb-5 text-xs font-semibold tracking-widest">{t("Yasal")}</h2>
          {legal.map((item) => (
            <Link key={item.href} className={`${footerLinkClass} w-fit py-2 text-sm`} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div>
          <h2 className="mb-5 text-xs font-semibold tracking-widest">{t("İletişim")}</h2>
          <address className="not-italic">
            <a className={`${footerLinkClass} text-2xl tracking-tight`} href={site.contact.phoneHref}>
              {site.contact.phoneDisplay}
            </a>
            <br />
            <a className={`${footerLinkClass} text-base`} href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </a>
            <p className="mt-5 max-w-sm text-sm leading-7 text-primary-foreground/75">{site.contact.address}</p>
          </address>
        </div>
      </div>
      <div className={containerClass}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-primary-foreground/20 py-6 text-xs text-primary-foreground/65">
          <p>{t("© {year} Saniteks. Tüm hakları saklıdır.", { year })}</p>
          <a className={`${footerLinkClass} gap-4`} href="#main-content">
            {t("Başa dön")}
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
