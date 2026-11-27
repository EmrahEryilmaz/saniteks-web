"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { LOCALE_COOKIE, localeNames, localizePath, locales, stripLocale, type Locale } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/client";
import { cx, focusStyle } from "@/components/ui/styles";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Remember the choice so unprefixed (Turkish) URLs stop redirecting to the browser language. */
function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

/**
 * Language menu: the same page in another language. Plain <a> (full page load): the root layout — <html lang/dir> —
 * differs per language.
 */
export function LanguageSwitcher({ variant = "header" }: { variant?: "header" | "list" }) {
  const locale = useLocale();
  const t = useT();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const path = stripLocale(pathname).path;

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const options = locales.map((l) => ({ locale: l, href: localizePath(`${path}${hash}`, l) }));

  if (variant === "list") {
    return (
      <nav aria-label={t("Dil seçimi")}>
        <ul className="flex flex-wrap gap-2">
          {options.map((o) => (
            <li key={o.locale}>
              <a
                href={o.href}
                hrefLang={o.locale}
                lang={o.locale}
                aria-current={o.locale === locale ? "true" : undefined}
                onClick={() => remember(o.locale)}
                className={cx(
                  "inline-flex min-h-11 items-center rounded-sm border px-3 text-sm font-semibold",
                  o.locale === locale ? "border-primary-foreground bg-primary-foreground text-foreground" : "border-primary-foreground/30 hover:border-primary-foreground",
                  focusStyle,
                )}
              >
                {localeNames[o.locale]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t("Dil: {language}. Dili değiştir", { language: localeNames[locale] })}
        onClick={() => setOpen((v) => !v)}
        className={cx("flex min-h-11 items-center gap-1.5 px-2 text-sm font-semibold uppercase", focusStyle)}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
        </svg>
        {locale}
      </button>
      {open ? (
        <ul id={menuId} className="absolute end-0 top-full z-50 min-w-44 border-t-2 border-primary bg-surface p-2 text-foreground shadow-sm">
          {options.map((o) => (
            <li key={o.locale}>
              <a
                href={o.href}
                hrefLang={o.locale}
                lang={o.locale}
                aria-current={o.locale === locale ? "true" : undefined}
                onClick={() => remember(o.locale)}
                className={cx(
                  "flex min-h-11 items-center justify-between gap-4 px-4 text-sm font-semibold hover:bg-surface-muted hover:text-link aria-[current=true]:text-link",
                  focusStyle,
                )}
              >
                {localeNames[o.locale]}
                <span aria-hidden="true" className="text-xs uppercase text-subtle-foreground">
                  {o.locale}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
