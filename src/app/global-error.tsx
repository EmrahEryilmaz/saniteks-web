"use client";

import { useEffect } from "react";
import { buttonPrimaryClass, containerClass, cx, textLinkClass } from "@/components/ui/styles";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Root-level error boundary. It replaces the root layout (no header/footer), so it renders its
 * own document, loads the global stylesheet itself and repeats the contact details.
 * Plain <a> is used for the home link: a full reload is the safest way out of a broken root layout.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="tr" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <title>Bir sorun oluştu | Saniteks</title>
        <main id="main-content" className="min-w-0 flex-1">
          <section aria-labelledby="page-title" className="relative overflow-hidden border-b-4 border-primary bg-surface-strong">
            <div className={cx(containerClass, "py-7 md:py-9")}>
              <div className="py-10 md:py-16">
                <div className="min-w-0 max-w-3xl">
                  <p className="mb-5 border-l-2 border-primary pl-4 text-xs font-semibold tracking-widest text-link">HATA</p>
                  <h1
                    id="page-title"
                    className="text-4xl font-semibold leading-tight tracking-[-0.025em] break-words md:text-5xl lg:text-6xl"
                  >
                    Bir sorun oluştu.
                  </h1>
                  <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                    Site şu anda beklendiği gibi yüklenemedi. Lütfen tekrar deneyin; sorun sürerse bize telefon veya e-posta ile
                    ulaşabilirsiniz.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <button type="button" onClick={() => retry()} className={buttonPrimaryClass}>
                      Tekrar deneyin
                      <span aria-hidden="true">↻</span>
                    </button>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload on purpose */}
                    <a href="/" className={cx(textLinkClass, "inline-flex min-h-11 items-center font-semibold")}>
                      Ana Sayfa
                    </a>
                  </div>
                  <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-6 text-base">
                    <li>
                      <a className={cx(textLinkClass, "inline-flex min-h-11 items-center wrap-anywhere")} href={site.contact.phoneHref}>
                        {site.contact.phoneDisplay}
                      </a>
                    </li>
                    <li>
                      <a className={cx(textLinkClass, "inline-flex min-h-11 items-center wrap-anywhere")} href={`mailto:${site.contact.email}`}>
                        {site.contact.email}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
