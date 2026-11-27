"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { localizePath } from "./config";
import { useLocale } from "./client";

/**
 * next/link that keeps the visitor in their language: "/urunler" becomes "/en/urunler" on English pages. Use it for
 * every internal link (external URLs, hashes, files and API paths pass through unchanged).
 */
export function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  const localized = typeof href === "string" ? localizePath(href, locale) : href;
  return <NextLink href={localized} {...rest} />;
}

export default Link;
