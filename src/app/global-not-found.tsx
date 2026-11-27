import type { Metadata } from "next";
import { buttonPrimaryClass, containerClass, cx } from "@/components/ui/styles";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı · Page not found | Saniteks",
  description: "Aradığınız sayfa bulunamadı. The page you are looking for does not exist.",
};

/**
 * 404 for URLs that match no route at all (the localized 404 is [lang]/not-found.tsx). It renders outside the root
 * layout, so it is bilingual (Turkish / English) and uses plain links.
 */
export default function GlobalNotFound() {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <main id="main-content" className="min-w-0 flex-1">
          <section aria-labelledby="page-title" className="border-b-4 border-primary bg-surface-strong">
            <div className={cx(containerClass, "py-16 md:py-24")}>
              <p className="mb-5 border-s-2 border-primary ps-4 text-xs font-semibold tracking-widest text-link">404</p>
              <h1 id="page-title" className="text-4xl leading-tight font-semibold tracking-[-0.025em] md:text-5xl">
                Sayfa bulunamadı.
              </h1>
              <p lang="en" className="mt-2 text-2xl font-semibold text-muted-foreground">
                Page not found.
              </p>
              <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
                Aradığınız sayfa taşınmış, kaldırılmış ya da adresi hatalı yazılmış olabilir.
              </p>
              <p lang="en" className="mt-2 max-w-lg text-base leading-7 text-muted-foreground">
                The page may have moved, been removed, or the address may be mistyped.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- rendered outside the app layout */}
                <a className={buttonPrimaryClass} href="/">
                  Ana Sayfa
                </a>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- rendered outside the app layout */}
                <a lang="en" className={buttonPrimaryClass} href="/en">
                  Home
                </a>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
