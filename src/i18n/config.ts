/**
 * Languages of the site (owner decision 2026-11-27). Turkish is the source language and lives at the root URLs
 * ("/urunler"); the others are prefixed ("/en/urunler"). URL slugs stay Turkish in every language.
 * Visitors without a language cookie are sent to the language of their browser (proxy.ts); browsers whose preferred
 * language is not one of these get English. Requests without an Accept-Language header (crawlers) get Turkish.
 */
export const locales = ["tr", "en", "de", "ar", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";
/** Language for browsers whose preferred language is not offered. */
export const fallbackLocale: Locale = "en";

/** Set when the visitor picks a language (and after the first automatic redirect). */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Names in their own language, for the language switcher. */
export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
  ar: "العربية",
  ru: "Русский",
};

/** Open Graph locale. */
export const ogLocales: Record<Locale, string> = { tr: "tr_TR", en: "en_US", de: "de_DE", ar: "ar_AR", ru: "ru_RU" };

/** BCP 47 tag for Intl formatting. */
export const intlLocales: Record<Locale, string> = { tr: "tr-TR", en: "en-GB", de: "de-DE", ar: "ar", ru: "ru-RU" };

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function isRtl(locale: Locale) {
  return locale === "ar";
}

/** Paths that are never localized (files, API). */
const unlocalized = /^\/(api|_next|images|documents|favicon\.ico|sitemap\.xml|robots\.txt|manifest\.webmanifest)(\/|$)/;

/**
 * "/urunler" → "/en/urunler" (Turkish: unchanged). Accepts hashes and queries; leaves external links, hashes,
 * mailto/tel and file paths alone. An already prefixed path is re-prefixed for the target language.
 */
export function localizePath(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//") || unlocalized.test(href)) return href;
  const { path } = stripLocale(href);
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : path.startsWith("/?") || path.startsWith("/#") ? `/${locale}${path.slice(1)}` : `/${locale}${path}`;
}

/** "/en/urunler#x" → { locale: "en", path: "/urunler#x" }; "/urunler" → { locale: "tr", path: "/urunler" }. */
export function stripLocale(href: string): { locale: Locale; path: string } {
  const match = /^\/([a-z]{2})(?=\/|\?|#|$)/.exec(href);
  if (match && isLocale(match[1])) {
    const rest = href.slice(match[0].length);
    return { locale: match[1], path: rest.startsWith("/") ? rest : `/${rest}` };
  }
  return { locale: defaultLocale, path: href };
}

/**
 * The language a browser asks for first (highest q in Accept-Language), as the owner specified: Turkish → Turkish,
 * another offered language → that language, anything else → English. No header → Turkish.
 */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.slice(2)) : 1, index };
    })
    .filter((x) => x.tag && x.tag !== "*" && !Number.isNaN(x.q) && x.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  if (!ranked.length) return defaultLocale;
  const primary = ranked[0].tag.split("-")[0];
  return isLocale(primary) ? primary : fallbackLocale;
}
