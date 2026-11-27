import { Fragment, type ReactNode } from "react";

/**
 * Fills the {placeholders} of an already translated sentence with elements (links, <strong> …):
 * rich(t("Şirketimize {email} adresinden ulaşabilirsiniz."), { email: <a …>…</a> }).
 */
export function rich(text: string, parts: Record<string, ReactNode>): ReactNode[] {
  return text.split(/\{(\w+)\}/g).map((chunk, i) => (i % 2 ? <Fragment key={i}>{chunk in parts ? parts[chunk] : `{${chunk}}`}</Fragment> : chunk));
}
