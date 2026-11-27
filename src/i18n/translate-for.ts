import { defaultLocale, isLocale, type Locale } from "./config";
import { makeTranslate, type Dictionary, type Translate } from "./translate";

/**
 * Translate function for an explicit language, for code outside the [lang] tree (route handlers such as /api/contact
 * and /api/apply), where next/root-params is not available. Pages and their components use i18n/server › getT.
 */
const loaders: Record<Exclude<Locale, "tr">, () => Promise<Dictionary>> = {
  en: () => import("./translations/en.json").then((m) => m.default as Dictionary),
  de: () => import("./translations/de.json").then((m) => m.default as Dictionary),
  ar: () => import("./translations/ar.json").then((m) => m.default as Dictionary),
  ru: () => import("./translations/ru.json").then((m) => m.default as Dictionary),
};

/** A language code sent by the browser (e.g. the forms' ?lang=), or Turkish when missing or unknown. */
export function parseLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export async function getTranslateFor(locale: Locale): Promise<Translate> {
  if (locale === defaultLocale) return makeTranslate(null);
  return makeTranslate(await loaders[locale as Exclude<Locale, "tr">]());
}
