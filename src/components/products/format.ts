import type { Packaging, ProductType, Sku, SpecRow } from "@/data/products";
import type { Translate } from "@/i18n/translate";

/** "Koli içi adet" / "Torba içi adet" / "Çuval içi adet". */
export function caseQtyLabel(t: Translate, packaging: Packaging = "koli") {
  if (packaging === "naylon-torba") return t("Torba içi adet");
  if (packaging === "cuval") return t("Çuval içi adet");
  return t("Koli içi adet");
}

/** "Koli ölçüsü" / "Torba ölçüsü" / "Çuval ölçüsü". */
export function caseSizeLabel(t: Translate, packaging: Packaging = "koli") {
  if (packaging === "naylon-torba") return t("Torba ölçüsü");
  if (packaging === "cuval") return t("Çuval ölçüsü");
  return t("Koli ölçüsü");
}

/** Every spec row of a SKU, in display order (product detail page). The SKU must already be localized. */
export function skuSpecRows(sku: Sku, t: Translate): SpecRow[] {
  const rows: SpecRow[] = [];
  if (sku.code) rows.push({ label: t("Ürün kodu"), value: sku.code });
  if (sku.productSize) rows.push({ label: t("Ürün ölçüsü"), value: sku.productSize });
  if (sku.packsPerCase) rows.push({ label: caseQtyLabel(t, sku.packaging), value: sku.packsPerCase });
  if (sku.caseSize) rows.push({ label: caseSizeLabel(t, sku.packaging), value: sku.caseSize });
  if (sku.extra) rows.push(...sku.extra);
  return rows;
}

/** The two or three rows shown on a product card in the category grid (code is shown separately). */
export function skuCardRows(sku: Sku, t: Translate): SpecRow[] {
  const rows: SpecRow[] = [];
  if (sku.productSize) rows.push({ label: t("Ölçü"), value: sku.productSize });
  if (sku.packsPerCase) rows.push({ label: caseQtyLabel(t, sku.packaging), value: sku.packsPerCase });
  for (const row of sku.extra ?? []) if (rows.length < 3) rows.push(row);
  return rows;
}

export function madeToOrderLabel(t: Translate) {
  return t("Talep üzerine üretim");
}

/** Page title of a SKU: pack names such as "Süper Tekli Paket" get their product group added, then the code. */
export function skuTitle(sku: Sku, product: Pick<ProductType, "name">) {
  const name = sku.name.toLocaleLowerCase("tr").includes(product.name.toLocaleLowerCase("tr")) ? sku.name : `${sku.name} – ${product.name}`;
  return sku.code ? `${name} (${sku.code})` : name;
}

/** Lower-cases a label or name for use inside a sentence; German keeps its capitalised nouns. */
export function inSentence(text: string, intlLocale: string) {
  return intlLocale.startsWith("de") ? text : text.toLocaleLowerCase(intlLocale);
}

/**
 * Meta / JSON-LD description of a SKU, built from its own (localized) data so every product page reads differently.
 * `intlLocale` is the BCP 47 tag of the page language (lower-casing).
 */
export function skuDescription(sku: Sku, product: Pick<ProductType, "name">, t: Translate, intlLocale: string) {
  const facts = [
    sku.code && t("Ürün kodu {code}", { code: sku.code }),
    sku.productSize && t("ölçü {size}", { size: sku.productSize }),
    sku.packsPerCase && `${inSentence(caseQtyLabel(t, sku.packaging), intlLocale)} ${sku.packsPerCase}`,
    ...(sku.extra ?? []).slice(0, sku.productSize ? 1 : 3).map((row) => `${inSentence(row.label, intlLocale)}: ${row.value}`),
  ].filter(Boolean);
  return `${sku.name} – ${product.name}. ${facts.join(", ")}${facts.length ? "." : ""}`.trim();
}

/**
 * Contact page link that preselects "Satış" and names the product in the message. "Satış" is the form's subject
 * value (not translated); the path has no language prefix — render it with a localizing link.
 */
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
