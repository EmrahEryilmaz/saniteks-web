import type { Packaging, Sku, SpecRow } from "@/data/products";

const packagingNoun: Record<Packaging, string> = {
  koli: "Koli",
  "naylon-torba": "Torba",
  cuval: "Çuval",
};

/** "Koli içi adet" / "Torba içi adet" / "Çuval içi adet". */
export function caseQtyLabel(packaging: Packaging = "koli") {
  return `${packagingNoun[packaging]} içi adet`;
}

/** "Koli ölçüsü" / "Torba ölçüsü" / "Çuval ölçüsü". */
export function caseSizeLabel(packaging: Packaging = "koli") {
  return `${packagingNoun[packaging]} ölçüsü`;
}

/** Every spec row of a SKU, in display order (product detail page). */
export function skuSpecRows(sku: Sku): SpecRow[] {
  const rows: SpecRow[] = [];
  if (sku.code) rows.push({ label: "Ürün kodu", value: sku.code });
  if (sku.productSize) rows.push({ label: "Ürün ölçüsü", value: sku.productSize });
  if (sku.packsPerCase) rows.push({ label: caseQtyLabel(sku.packaging), value: sku.packsPerCase });
  if (sku.caseSize) rows.push({ label: caseSizeLabel(sku.packaging), value: sku.caseSize });
  if (sku.extra) rows.push(...sku.extra);
  return rows;
}

/** The two or three rows shown on a product card in the category grid (code is shown separately). */
export function skuCardRows(sku: Sku): SpecRow[] {
  const rows: SpecRow[] = [];
  if (sku.productSize) rows.push({ label: "Ölçü", value: sku.productSize });
  if (sku.packsPerCase) rows.push({ label: caseQtyLabel(sku.packaging), value: sku.packsPerCase });
  for (const row of sku.extra ?? []) if (rows.length < 3) rows.push(row);
  return rows;
}

/** "12 ürün" — the category grid count. */
export function productCountLabel(n: number) {
  return `${n} ürün`;
}

export const madeToOrderLabel = "Talep üzerine üretim";

/** Contact page link that preselects "Satış" and names the product in the message. */
export function inquiryHref(subject: string) {
  return `/iletisim?konu=${encodeURIComponent("Satış")}&urun=${encodeURIComponent(subject)}`;
}

export function skuInquirySubject(sku: Sku) {
  return sku.code ? `${sku.name} (${sku.code})` : sku.name;
}

/** Fold Turkish characters and case so "sunger" matches "Sünger". */
export function foldTr(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
}
