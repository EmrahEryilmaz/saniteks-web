"use client";

import { useEffect } from "react";
import { buttonPrimaryClass, containerClass, cx, textLinkClass } from "@/components/ui/styles";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Root-level error boundary. It replaces the root layout (no header/footer, no language provider), so it renders its
 * own document, loads the global stylesheet itself and repeats the contact details. Like global-not-found.tsx it is
 * bilingual (Turkish / English).
 * Plain <a> is used for the home links: a full reload is the safest way out of a broken root layout.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="tr" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <title>Bir sorun oluştu · Something went wrong | Saniteks</title>
        <main id="main-content" className="min-w-0 flex-1">
          <section aria-labelledby="page-title" className="relative overflow-hidden border-b-4 border-primary bg-surface-strong">
            <div className={cx(containerClass, "py-7 md:py-9")}>
              <div className="py-10 md:py-16">
                <div className="min-w-0 max-w-3xl">
                  <p className="mb-5 border-s-2 border-primary ps-4 text-xs font-semibold tracking-widest text-link">
                    HATA <span aria-hidden="true">·</span> <span lang="en">ERROR</span>
                  </p>
                  <h1
                    id="page-title"
                    className="text-4xl font-semibold leading-tight tracking-[-0.025em] break-words md:text-5xl lg:text-6xl"
                  >
                    Bir sorun oluştu.
                  </h1>
                  <p lang="en" className="mt-2 text-2xl font-semibold text-muted-foreground">
                    Something went wrong.
                  </p>
                  <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                    Site şu anda beklendiği gibi yüklenemedi. Lütfen tekrar deneyin; sorun sürerse bize telefon veya e-posta ile
                    ulaşabilirsiniz.
                  </p>
                  <p lang="en" className="mt-2 max-w-lg text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                    The site could not be loaded as expected. Please try again; if the problem persists, you can reach us by
                    phone or e-mail.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <button type="button" onClick={() => retry()} className={buttonPrimaryClass}>
                      Tekrar deneyin <span aria-hidden="true">·</span> <span lang="en">Try again</span>
                      <span aria-hidden="true">↻</span>
                    </button>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload on purpose */}
                    <a href="/" className={cx(textLinkClass, "inline-flex min-h-11 items-center font-semibold")}>
                      Ana Sayfa
                    </a>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload on purpose */}
                    <a lang="en" href="/en" className={cx(textLinkClass, "inline-flex min-h-11 items-center font-semibold")}>
                      Home
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
