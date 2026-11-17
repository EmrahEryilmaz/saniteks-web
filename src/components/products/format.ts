import type { Packaging, ProductType, Sku, SpecRow } from "@/data/products";

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

/** Spec rows shown on a SKU card, in display order. */
export function skuSpecRows(sku: Sku, product: Pick<ProductType, "colorOptions">): SpecRow[] {
  const rows: SpecRow[] = [];
  if (sku.code) rows.push({ label: "Ürün kodu", value: sku.code });
  else if (product.colorOptions) rows.push({ label: "Ürün kodu", value: "Keçe rengine göre" });
  if (sku.productSize) rows.push({ label: "Ürün ölçüsü", value: sku.productSize });
  if (sku.packsPerCase) rows.push({ label: caseQtyLabel(sku.packaging), value: sku.packsPerCase });
  if (sku.caseSize) rows.push({ label: caseSizeLabel(sku.packaging), value: sku.caseSize });
  if (sku.extra) rows.push(...sku.extra);
  return rows;
}

/** "7 paket seçeneği" / "5 çeşit" / "1 seçenek". */
export function skuCountLabel(product: Pick<ProductType, "skus" | "skuKind">) {
  const n = product.skus.length;
  if (n === 1) return "1 seçenek";
  return `${n} ${product.skuKind === "variety" ? "çeşit" : "paket seçeneği"}`;
}

/** Meta line for product type cards: the option count, or "Talep üzerine üretim" if nothing is in regular production. */
export function productMeta(product: Pick<ProductType, "skus" | "skuKind">) {
  if (product.skus.every((s) => s.madeToOrder)) return "Talep üzerine üretim";
  return skuCountLabel(product);
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
