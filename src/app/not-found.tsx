import type { Metadata } from "next";
import { ArrowLink, ButtonLink } from "@/components/ui/ButtonLink";
import { containerClass, cx } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  description: "Aradığınız sayfa bulunamadı.",
};

/** 404 — same top band as inner pages (PageHero without breadcrumbs). */
export default function NotFound() {
  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden border-b border-border bg-surface-strong">
      <div className={cx(containerClass, "py-7 md:py-9")}>
        <div className="py-10 md:py-16">
          <div className="min-w-0 max-w-3xl">
            <p className="mb-5 border-l-2 border-primary pl-4 text-xs font-semibold tracking-widest text-link">404</p>
            <h1 id="page-title" className="text-4xl font-semibold leading-tight tracking-[-0.025em] break-words md:text-5xl lg:text-6xl">
              Sayfa bulunamadı.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              Aradığınız sayfa taşınmış, kaldırılmış ya da adresi hatalı yazılmış olabilir. Aşağıdaki bağlantılardan devam
              edebilirsiniz.
            </p>
            <nav aria-label="Sayfa bulunamadı bağlantıları" className="mt-8">
              <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <li>
                  <ButtonLink href="/">Ana Sayfa</ButtonLink>
                </li>
                <li>
                  <ArrowLink href="/urunler">Ürünler</ArrowLink>
                </li>
                <li>
                  <ArrowLink href="/iletisim">İletişim</ArrowLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
