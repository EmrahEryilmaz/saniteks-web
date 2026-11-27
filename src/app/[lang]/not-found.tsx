import type { Metadata } from "next";
import { getT } from "@/i18n/server";
import { ArrowLink, ButtonLink } from "@/components/ui/ButtonLink";
import { containerClass, cx } from "@/components/ui/styles";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Sayfa bulunamadı"), description: t("Aradığınız sayfa bulunamadı.") };
}

/** 404 — same top band as inner pages (PageHero without breadcrumbs). */
export default async function NotFound() {
  const t = await getT();
  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden border-b border-border bg-surface-strong">
      <div className={cx(containerClass, "py-7 md:py-9")}>
        <div className="py-10 md:py-16">
          <div className="min-w-0 max-w-3xl">
            <p className="mb-5 border-s-2 border-primary ps-4 text-xs font-semibold tracking-widest text-link">404</p>
            <h1 id="page-title" className="text-4xl font-semibold leading-tight tracking-[-0.025em] break-words md:text-5xl lg:text-6xl">
              {t("Sayfa bulunamadı.")}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              {t("Aradığınız sayfa taşınmış, kaldırılmış ya da adresi hatalı yazılmış olabilir. Aşağıdaki bağlantılardan devam edebilirsiniz.")}
            </p>
            <nav aria-label={t("Sayfa bulunamadı bağlantıları")} className="mt-8">
              <ul className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <li>
                  <ButtonLink href="/">{t("Ana Sayfa")}</ButtonLink>
                </li>
                <li>
                  <ArrowLink href="/urunler">{t("Ürünler")}</ArrowLink>
                </li>
                <li>
                  <ArrowLink href="/iletisim">{t("İletişim")}</ArrowLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
