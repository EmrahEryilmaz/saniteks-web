"use client";

import Image from "next/image";
import { useDeferredValue, useId, useMemo, useState } from "react";
import { cx, focusStyle } from "@/components/ui/styles";
import { useT } from "@/i18n/client";
import { Link } from "@/i18n/Link";
import { foldTr } from "./format";
import { SkuImagePlaceholder } from "./SkuImagePlaceholder";

export type SkuSearchEntry = {
  slug: string;
  code?: string;
  name: string;
  nameEn: string;
  productSize?: string;
  image?: string;
  imageAlt: string;
  madeToOrder?: boolean;
  categorySlug: string;
  categoryName: string;
  productName: string;
  href: string;
};

type Props = {
  entries: SkuSearchEntry[];
  categories: { slug: string; name: string }[];
};

function haystack(e: SkuSearchEntry) {
  const code = e.code ?? "";
  return foldTr([e.name, e.nameEn, e.productName, e.categoryName, code, code.replace(/[^0-9a-z]/gi, "")].join(" "));
}

/** Filterable list of every SKU (entries already localized; hrefs without language prefix). Server-rendered with the full list, so it works without JavaScript. */
export function SkuSearch({ entries, categories }: Props) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const inputId = useId();
  const statusId = useId();

  const indexed = useMemo(() => entries.map((e) => ({ entry: e, text: haystack(e) })), [entries]);

  const results = useMemo(() => {
    const terms = foldTr(deferredQuery).split(/\s+/).filter(Boolean);
    return indexed
      .filter(({ entry, text }) => (!category || entry.categorySlug === category) && terms.every((term) => text.includes(term.replace(/\./g, "")) || text.includes(term)))
      .map(({ entry }) => entry);
  }, [indexed, deferredQuery, category]);

  const chipClass = (active: boolean) =>
    cx(
      "inline-flex min-h-11 items-center rounded-sm border px-4 text-sm font-semibold transition-colors motion-reduce:transition-none",
      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-foreground hover:border-primary hover:text-link",
      focusStyle,
    );

  return (
    <div className="mt-9">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div>
          <label htmlFor={inputId} className="mb-2 block text-sm font-semibold">
            {t("Ürün adı veya kodu")}
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Örn. 100.0.350 veya oluklu")}
            autoComplete="off"
            aria-describedby={statusId}
            className={cx(
              "min-h-12 w-full rounded-sm border border-border-strong bg-surface px-4 text-base placeholder:text-subtle-foreground",
              focusStyle,
            )}
          />
        </div>
        <div role="group" aria-label={t("Kategoriye göre filtrele")} className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)} className={chipClass(category === null)}>
            {t("Tümü")}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              aria-pressed={category === c.slug}
              onClick={() => setCategory(category === c.slug ? null : c.slug)}
              className={chipClass(category === c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <p id={statusId} role="status" aria-live="polite" className="mt-6 text-sm text-muted-foreground tabular-nums">
        {results.length === entries.length
          ? t("{count} ürün listeleniyor.", { count: entries.length })
          : t("{count} sonuç bulundu.", { count: results.length })}
      </p>

      {results.length ? (
        <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {results.map((e) => (
            <li key={e.slug} className="min-w-0">
              <Link
                href={e.href}
                className={cx(
                  "group flex h-full items-center gap-4 rounded-sm border border-border bg-surface p-3 transition-colors hover:border-primary motion-reduce:transition-none",
                  focusStyle,
                )}
              >
                <span className="relative block h-16 w-20 shrink-0 overflow-hidden rounded-sm border border-border bg-white">
                  {e.image ? <Image src={e.image} alt="" fill sizes="80px" className="object-contain p-1" /> : <SkuImagePlaceholder />}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold leading-snug break-words group-hover:text-link">{e.name}</span>
                  <span className="mt-0.5 block text-sm tabular-nums text-link">
                    {e.code ?? t("Kod: talep üzerine")}
                    {e.madeToOrder ? <span className="ms-2 text-xs font-normal text-muted-foreground">· {t("Talep üzerine üretim")}</span> : null}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-subtle-foreground">
                    {e.categoryName} › {e.productName}
                    {e.productSize ? ` · ${e.productSize}` : ""}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-sm border border-border bg-surface p-6">
          <p className="font-semibold">{t("Aramanızla eşleşen bir ürün bulunamadı.")}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("Farklı bir kelime deneyin veya aradığınız ürünü")}{" "}
            <Link className={cx("text-link underline underline-offset-4", focusStyle)} href="/iletisim">
              {t("bize sorun")}
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
