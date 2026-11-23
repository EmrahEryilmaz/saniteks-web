"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import { cx, focusStyle } from "@/components/ui/styles";

export type ShopGroup = { slug: string; name: string; count: number };
export type ShopItem = { key: string; group: string; node: ReactNode };

/**
 * Category product grid with product-group filter chips (shop-style). The tiles are rendered on the server and
 * passed in; the chips only hide the tiles of other groups. Without JavaScript every tile stays visible.
 */
export function CategoryShop({
  groups,
  items,
  label,
  elsewhere,
}: {
  groups: ShopGroup[];
  items: ShopItem[];
  label: string;
  /** SKU slug → product page for SKUs of other categories: old "#<sku>" links whose product moved category. */
  elsewhere: Record<string, string>;
}) {
  const [active, setActive] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && !document.getElementById(id) && elsewhere[id]) router.replace(elsewhere[id]);
  }, [elsewhere, router]);
  const statusId = useId();
  const visible = active ? items.filter((i) => i.group === active) : items;
  const chips: { slug: string | null; name: string; count: number }[] = [{ slug: null, name: "Tümü", count: items.length }, ...groups];

  return (
    <div>
      {groups.length > 1 ? (
        <div role="group" aria-label={`${label}: ürün grubuna göre süz`} aria-describedby={statusId} className="flex flex-wrap gap-2">
          {chips.map((chip) => {
            const selected = chip.slug === active;
            return (
              <button
                key={chip.slug ?? "all"}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(chip.slug)}
                className={cx(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors motion-reduce:transition-none",
                  selected
                    ? "border-link bg-link text-primary-foreground"
                    : "border-border bg-surface text-foreground hover:border-primary hover:text-link",
                  focusStyle,
                )}
              >
                {chip.name}
                <span className={cx("tabular-nums", selected ? "text-primary-foreground" : "text-muted-foreground")}>{chip.count}</span>
              </button>
            );
          })}
        </div>
      ) : null}
      <p id={statusId} role="status" className="mt-5 text-sm font-semibold tabular-nums text-muted-foreground">
        {visible.length} ürün listeleniyor
        {active ? ` — ${groups.find((g) => g.slug === active)?.name}` : ""}
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5 xl:grid-cols-4">
        {visible.map((item) => (
          <li key={item.key} className="min-w-0">
            {item.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
