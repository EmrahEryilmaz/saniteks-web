import type { ProductType, Sku } from "@/data/products";
import { packagingLabel } from "@/data/products";
import { cx, focusStyle } from "@/components/ui/styles";

type Column = { key: string; label: string; value: (sku: Sku) => string | undefined; numeric?: boolean };

/** Comparison table of every SKU of a product type. Columns without any value are dropped. */
export function SkuTable({ product }: { product: ProductType }) {
  const extraLabels = Array.from(new Set(product.skus.flatMap((s) => s.extra?.map((e) => e.label) ?? [])));

  const candidates: Column[] = [
    { key: "code", label: "Ürün kodu", value: (s) => s.code ?? (product.colorOptions ? "Keçe rengine göre" : undefined), numeric: true },
    { key: "size", label: "Ürün ölçüsü", value: (s) => s.productSize, numeric: true },
    { key: "packaging", label: "Ambalaj", value: (s) => (s.packaging ? packagingLabel[s.packaging] : undefined) },
    { key: "qty", label: "İçi adet", value: (s) => s.packsPerCase, numeric: true },
    { key: "case", label: "Ambalaj ölçüsü", value: (s) => s.caseSize, numeric: true },
    ...extraLabels.map((label) => ({
      key: `extra-${label}`,
      label,
      value: (s: Sku) => s.extra?.find((e) => e.label === label)?.value,
    })),
  ];
  const columns = candidates.filter((c) => product.skus.some((s) => c.value(s)));
  const captionId = `${product.slug}-table-caption`;

  return (
    <div
      role="region"
      aria-labelledby={captionId}
      tabIndex={0}
      className={cx("mt-9 overflow-x-auto rounded-sm border border-border bg-surface", focusStyle)}
    >
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption id={captionId} className="sr-only">
          {product.name} — paket seçeneklerinin teknik bilgileri
        </caption>
        <thead className="bg-surface-strong">
          <tr>
            <th scope="col" className="sticky left-0 z-10 bg-surface-strong px-4 py-3 font-semibold">
              Ürün
            </th>
            {columns.map((c) => (
              <th key={c.key} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {product.skus.map((sku) => (
            <tr key={sku.slug} className="align-top">
              <th scope="row" className="sticky left-0 z-10 max-w-64 bg-surface px-4 py-3 font-semibold">
                <a className={cx("text-link underline-offset-4 hover:underline", focusStyle)} href={`#${sku.slug}`}>
                  {sku.name}
                </a>
                {sku.madeToOrder ? <span className="mt-1 block text-xs font-normal text-muted-foreground">Talep üzerine üretim</span> : null}
              </th>
              {columns.map((c) => (
                <td key={c.key} className={cx("px-4 py-3", c.numeric && "tabular-nums whitespace-nowrap")}>
                  {c.value(sku) ?? <span className="text-subtle-foreground">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
