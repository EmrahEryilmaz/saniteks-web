import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, negotiateLocale } from "@/i18n/config";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Language routing (see src/i18n/config.ts):
 * - "/en/…", "/de/…", "/ar/…", "/ru/…" are served as they are;
 * - "/tr/…" is redirected to the unprefixed Turkish URL (one URL per page);
 * - unprefixed URLs are Turkish, unless the visitor has chosen another language (cookie) or, on a first visit, the
 *   browser's preferred language is not Turkish — then they are redirected to that language (English if not offered).
 *   Turkish pages are rendered from the internal "/tr/…" route via a rewrite.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (isLocale(first)) {
    if (first !== defaultLocale) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(chosen) ? chosen : negotiateLocale(request.headers.get("accept-language"));

  if (locale !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    url.search = search;
    const response = NextResponse.redirect(url, 307);
    if (!isLocale(chosen)) response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
    response.headers.set("Vary", "Accept-Language, Cookie");
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  const response = NextResponse.rewrite(url);
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  // Pages only: no API routes, Next internals, public files or anything with a file extension.
  matcher: ["/((?!api|_next|images|documents|.*\\..*).*)"],
};
