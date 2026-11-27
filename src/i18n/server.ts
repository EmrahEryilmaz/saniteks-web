import { cache } from "react";
import { lang } from "next/root-params";
import { defaultLocale, isLocale, isRtl, type Locale } from "./config";
import { makeTranslate, type Dictionary, type Translate } from "./translate";
import { clientKeys } from "./client-keys";

const loaders: Record<Exclude<Locale, "tr">, () => Promise<Dictionary>> = {
  en: () => import("./translations/en.json").then((m) => m.default as Dictionary),
  de: () => import("./translations/de.json").then((m) => m.default as Dictionary),
  ar: () => import("./translations/ar.json").then((m) => m.default as Dictionary),
  ru: () => import("./translations/ru.json").then((m) => m.default as Dictionary),
};

/** Current language from the [lang] root segment (Server Components and server utilities only). */
export const getLocale = cache(async (): Promise<Locale> => {
  const value = await lang();
  return isLocale(value) ? value : defaultLocale;
});

export const getDictionary = cache(async (locale: Locale): Promise<Dictionary | null> =>
  locale === defaultLocale ? null : loaders[locale as Exclude<Locale, "tr">](),
);

/** Translate function for the current language: const t = await getT(); t("Ürünler"). */
export const getT = cache(async (): Promise<Translate> => makeTranslate(await getDictionary(await getLocale())));

/** The part of the dictionary that client components need (keys listed in client-keys.ts). */
export async function getClientDictionary(locale: Locale): Promise<Dictionary> {
  const dictionary = await getDictionary(locale);
  if (!dictionary) return {};
  const out: Dictionary = {};
  for (const key of clientKeys) if (dictionary[key]) out[key] = dictionary[key];
  return out;
}

export async function getDirection(): Promise<"rtl" | "ltr"> {
  return isRtl(await getLocale()) ? "rtl" : "ltr";
}
