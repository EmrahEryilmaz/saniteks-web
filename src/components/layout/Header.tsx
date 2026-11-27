import Image from "next/image";
import { Link } from "@/i18n/Link";
import { getT } from "@/i18n/server";
import { localized } from "@/i18n/data";
import { getHeaderNavigation } from "@/lib/navigation";
import { site } from "@/lib/site";
import { containerClass, focusStyle } from "@/components/ui/styles";
import { HeaderFrame } from "./HeaderFrame";
import { MobileMenu } from "./MobileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NavigationLinks } from "./NavigationLinks";

const topbarLinkClass = `inline-flex min-h-11 items-center underline-offset-4 hover:underline ${focusStyle}`;

export async function Header() {
  const t = await getT();
  const headerNavigation = await getHeaderNavigation();
  const text = await localized({ tagline: site.tagline });
  const topbar = (
    <div className={`${containerClass} flex min-h-11 items-center justify-between gap-5 text-xs`}>
      <p className="hidden tracking-wide md:block">{text.tagline}</p>
      <div className="flex w-full items-center justify-between gap-5 md:w-auto md:gap-8">
        <a className={topbarLinkClass} href={`mailto:${site.contact.email}`}>
          {site.contact.email}
        </a>
        <a className={topbarLinkClass} href={site.contact.phoneHref}>
          {site.contact.phoneDisplay}
        </a>
      </div>
    </div>
  );

  return (
    <HeaderFrame topbar={topbar}>
      <div
        className={`${containerClass} flex min-h-20 items-center justify-between gap-5 transition-[min-height] duration-300 group-data-[scrolled=true]/header:min-h-20 lg:min-h-24 motion-reduce:transition-none`}
      >
        <Link className={`shrink-0 ${focusStyle}`} href="/">
          <Image src={site.logo} alt={t("Saniteks ana sayfa")} width={955} height={250} loading="eager" className="h-auto w-40 lg:w-44 xl:w-52" />
        </Link>
        {/* Desktop: the logo links home, so "Ana Sayfa" is left out (as on sanifoam.com.tr); 8 sections need ≥1280px. */}
        <div className="hidden items-center gap-3 xl:flex 2xl:gap-5">
          <nav aria-label={t("Ana navigasyon")}>
            <NavigationLinks items={headerNavigation.filter((item) => item.href !== "/")} variant="desktop" />
          </nav>
          <LanguageSwitcher />
        </div>
        <div className="flex items-center gap-1 xl:hidden">
          <LanguageSwitcher />
          <MobileMenu
            logo={<Image src={site.logo} alt="Saniteks" width={955} height={250} className="h-auto w-40" />}
            footer={
              <div className="mt-10 space-y-6 border-s-2 border-primary ps-5 text-sm">
                <LanguageSwitcher variant="list" />
                <div>
                <a className={`flex min-h-11 items-center ${focusStyle}`} href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
                <a className={`flex min-h-11 items-center ${focusStyle}`} href={site.contact.phoneHref}>
                  {site.contact.phoneDisplay}
                </a>
                </div>
              </div>
            }
          >
            <NavigationLinks items={headerNavigation} variant="mobile" />
          </MobileMenu>
        </div>
      </div>
    </HeaderFrame>
  );
}
