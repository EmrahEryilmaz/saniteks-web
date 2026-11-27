"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { defaultLocale, isRtl, type Locale } from "./config";
import { makeTranslate, type Dictionary, type Translate } from "./translate";

type I18nValue = { locale: Locale; t: Translate };

const I18nContext = createContext<I18nValue>({ locale: defaultLocale, t: makeTranslate(null) });

/** Provides the language and the client part of its dictionary to client components (set in the root layout). */
export function I18nProvider({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: ReactNode }) {
  const value = useMemo(() => ({ locale, t: makeTranslate(locale === defaultLocale ? null : dictionary) }), [locale, dictionary]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT(): Translate {
  return useContext(I18nContext).t;
}

export function useLocale(): Locale {
  return useContext(I18nContext).locale;
}

export function useDirection(): "rtl" | "ltr" {
  return isRtl(useContext(I18nContext).locale) ? "rtl" : "ltr";
}
