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

export const madeToOrderLabel = "Talep üzerine üretim";

/** Page title of a SKU: pack names such as "Süper Tekli Paket" get their product group added, then the code. */
export function skuTitle(sku: Sku, product: Pick<ProductType, "name">) {
  const name = sku.name.toLocaleLowerCase("tr").includes(product.name.toLocaleLowerCase("tr")) ? sku.name : `${sku.name} – ${product.name}`;
  return sku.code ? `${name} (${sku.code})` : name;
}

/** Meta / JSON-LD description of a SKU, built from its own data so every product page reads differently. */
export function skuDescription(sku: Sku, product: Pick<ProductType, "name">) {
  const facts = [
    sku.code && `Ürün kodu ${sku.code}`,
    sku.productSize && `ölçü ${sku.productSize}`,
    sku.packsPerCase && `${caseQtyLabel(sku.packaging).toLocaleLowerCase("tr")} ${sku.packsPerCase}`,
    ...(sku.extra ?? []).slice(0, sku.productSize ? 1 : 3).map((row) => `${row.label.toLocaleLowerCase("tr")}: ${row.value}`),
  ].filter(Boolean);
  return `${sku.name} – ${product.name}. ${facts.join(", ")}${facts.length ? "." : ""}`.trim();
}

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
