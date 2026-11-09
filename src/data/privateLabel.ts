/**
 * Private label (özel marka) production — /urunler/ozel-marka-uretimi.
 *
 * Customer list supplied by Saniteks (2026-11). The retailers have permitted the use of their official
 * names and logos on this site (company statement, 2026-11-09). Logo files live in
 * public/images/private-label/logos; product photos in public/images/private-label/products.
 */
import { partnerLogos, plProductData } from "./privateLabelProducts";
import { categories, categoryHref } from "./products";

export const privateLabelPath = "/urunler/ozel-marka-uretimi";

export type Logo = { src: string; width: number; height: number };

export type Retailer = {
  slug: string;
  name: string;
  segment: string;
  logo?: Logo;
};

export const retailers: Retailer[] = [
  { slug: "a101", name: "A101", segment: "İndirim marketi" },
  { slug: "bim", name: "BİM", segment: "İndirim marketi" },
  { slug: "file", name: "FİLE", segment: "Süpermarket" },
  { slug: "sok", name: "ŞOK", segment: "İndirim marketi" },
  { slug: "metro", name: "Metro", segment: "Toptan ticaret" },
  { slug: "gratis", name: "Gratis", segment: "Kişisel bakım ve kozmetik" },
  // Official CarrefourSA logo file could not be downloaded (403); the tile shows the name until it is added.
  { slug: "carrefoursa", name: "CarrefourSA", segment: "Süpermarket ve hipermarket" },
  { slug: "koctas", name: "Koçtaş", segment: "Yapı market ve ev" },
].map((r) => ({ ...r, logo: partnerLogos[r.slug] }));

/**
 * Brand owners Saniteks produces for (contract manufacturing under their brand). Company decision 2026-11-09:
 * Banat (Bella) is shown with permission; Vileda is intentionally not listed.
 */
export type BrandOwner = Retailer & { brands: string[]; description: string };

export const brandOwners: BrandOwner[] = [
  {
    slug: "banat",
    name: "Banat",
    segment: "Kişisel bakım ve ev ürünleri",
    brands: ["Bella"],
    description: "Banat'ın Bella markalı bulaşık ve çok amaçlı süngerlerini üretiyoruz.",
  },
].map((b) => ({ ...b, logo: partnerLogos[b.slug] }));

/** Retailer or brand owner by slug. */
export function getRetailer(slug: string): Retailer | undefined {
  return retailers.find((r) => r.slug === slug) ?? brandOwners.find((b) => b.slug === slug);
}

/**
 * Private-label products as sold by the retailers.
 * `manufacturerVerified`: the retailer's product page names Sanifoam/Saniteks as manufacturer.
 * `confirmedByCompany`: Saniteks confirmed the product is theirs. Only products with either flag are shown.
 */
export type PlProduct = {
  retailer: string;
  name: string;
  ownBrand?: string;
  image: string;
  imageAlt: string;
  /** Where the photo was taken from (for reference; not linked on the site). */
  sourceUrl: string;
  barcode?: string;
  retailerArticle?: string;
  manufacturerVerified: boolean;
  confirmedByCompany: boolean;
};

export const plProducts: PlProduct[] = plProductData;

export const visiblePlProducts = () => plProducts.filter((p) => p.manufacturerVerified || p.confirmedByCompany);

/** Product groups offered for private label (raw materials are supplied unbranded, so excluded). */
export const privateLabelCategories = categories
  .filter((c) => c.slug !== "hammadde")
  .map((c) => ({ name: c.name, href: categoryHref(c), description: c.shortDescription, image: c.image, imageAlt: c.imageAlt }));

export const privateLabelSteps = [
  {
    title: "İhtiyaç ve ürün seçimi",
    text: "Ürün tipi, ölçü, keçe ve sünger rengi ile paket içeriği raf ve fiyat hedefinize göre birlikte belirlenir.",
  },
  {
    title: "Numune ve onay",
    text: "Seçilen ürün için numune hazırlanır; onayınızın ardından ürün özellikleri netleştirilir.",
  },
  {
    title: "Ambalaj ve etiket",
    text: "Ürün, kendi marka tasarımınız ve barkodunuzla ambalajlanır; ambalaj tipi ürüne göre seçilir.",
  },
  {
    title: "Üretim ve kontrol",
    text: "Üretim, kendi markalarımızda uyguladığımız kalite yaklaşımı ve kontrol adımlarıyla yürütülür.",
  },
  {
    title: "Sevkiyat",
    text: "Ürünler koli, naylon torba veya çuval ile, siparişe göre planlanan sevkiyatlarla teslim edilir.",
  },
];

/** Flexibility figures — all derived from src/data/products.ts. */
export const privateLabelFacts = [
  { value: "9", label: "keçe rengi seçeneği" },
  { value: "1–12", label: "adetlik paket seçenekleri" },
  { value: "3", label: "sevkiyat ambalajı: koli, torba, çuval" },
];
