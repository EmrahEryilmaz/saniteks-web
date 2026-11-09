import Image from "next/image";
import Link from "next/link";
import { headerNavigation } from "@/lib/navigation";
import { site } from "@/lib/site";
import { containerClass, focusStyle } from "@/components/ui/styles";
import { HeaderFrame } from "./HeaderFrame";
import { MobileMenu } from "./MobileMenu";
import { NavigationLinks } from "./NavigationLinks";

const topbarLinkClass = `inline-flex min-h-11 items-center underline-offset-4 hover:underline ${focusStyle}`;

export function Header() {
  const topbar = (
    <div className={`${containerClass} flex min-h-11 items-center justify-between gap-5 text-xs`}>
      <p className="hidden tracking-wide md:block">{site.tagline}</p>
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
          <Image src={site.logo} alt="Saniteks ana sayfa" width={955} height={250} loading="eager" className="h-auto w-40 lg:w-44 xl:w-52" />
        </Link>
        {/* Desktop: the logo links home, so "Ana Sayfa" is left out (as on sanifoam.com.tr); 8 sections need ≥1280px. */}
        <nav aria-label="Ana navigasyon" className="hidden xl:block">
          <NavigationLinks items={headerNavigation.filter((item) => item.href !== "/")} variant="desktop" />
        </nav>
        <div className="xl:hidden">
          <MobileMenu
            logo={<Image src={site.logo} alt="Saniteks" width={955} height={250} className="h-auto w-40" />}
            footer={
              <div className="mt-10 border-l-2 border-primary pl-5 text-sm">
                <a className={`flex min-h-11 items-center ${focusStyle}`} href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
                <a className={`flex min-h-11 items-center ${focusStyle}`} href={site.contact.phoneHref}>
                  {site.contact.phoneDisplay}
                </a>
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
