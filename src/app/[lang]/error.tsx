"use client";

import { useEffect } from "react";
import { intlLocales } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/client";
import { Link } from "@/i18n/Link";
import { buttonPrimaryClass, containerClass, cx, textLinkClass } from "@/components/ui/styles";

function errorDigest(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "digest" in error && typeof error.digest === "string") return error.digest;
  return undefined;
}

/** Route-level error boundary (renders inside the root layout, so header and footer stay). */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const t = useT();
  const locale = useLocale();
  const digest = errorDigest(error);

  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden border-b border-border bg-surface-strong">
      <div className={cx(containerClass, "py-7 md:py-9")}>
        <div className="py-10 md:py-16">
          <div className="min-w-0 max-w-3xl">
            <p className="mb-5 border-s-2 border-primary ps-4 text-xs font-semibold tracking-widest text-link">
              {t("Hata").toLocaleUpperCase(intlLocales[locale])}
            </p>
            <h1 id="page-title" className="text-4xl font-semibold leading-tight tracking-[-0.025em] break-words md:text-5xl lg:text-6xl">
              {t("Bir sorun oluştu.")}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              {t("Sayfa yüklenirken beklenmeyen bir hata oluştu. Tekrar deneyebilir veya ana sayfaya dönebilirsiniz.")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <button type="button" onClick={() => retry()} className={buttonPrimaryClass}>
                {t("Tekrar deneyin")}
                <span aria-hidden="true">↻</span>
              </button>
              <Link href="/" className={cx(textLinkClass, "inline-flex min-h-11 items-center font-semibold")}>
                {t("Ana Sayfa")}
              </Link>
            </div>
            {digest ? <p className="mt-6 text-sm text-muted-foreground">{t("Hata kodu: {digest}", { digest })}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
