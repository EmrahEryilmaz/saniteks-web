/**
 * Private label (özel marka) production — /urunler/ozel-marka-uretimi.
 *
 * Customer list supplied by Saniteks (2026-11). The retailers have permitted the use of their official
 * names and logos on this site (company statement, 2026-11-09). Logo files live in public/images/private-label/logos.
 * Company decision 2026-11-10: only the retailer names/logos are shown — no brand owners (Banat removed) and no
 * photos of customers' private-label products.
 */
import { categories, categoryHref } from "./products";

export const privateLabelPath = "/urunler/ozel-marka-uretimi";

export type Logo = { src: string; width: number; height: number };

export type Retailer = {
  slug: string;
  name: string;
  segment: string;
  logo?: Logo;
};

const retailerLogos: Record<string, Logo> = {
  a101: { src: "/images/private-label/logos/a101.svg", width: 735, height: 219 },
  bim: { src: "/images/private-label/logos/bim.png", width: 303, height: 187 },
  file: { src: "/images/private-label/logos/file.svg", width: 276, height: 99 },
  sok: { src: "/images/private-label/logos/sok.svg", width: 20, height: 13 },
  metro: { src: "/images/private-label/logos/metro.svg", width: 500, height: 250 },
  gratis: { src: "/images/private-label/logos/gratis.png", width: 800, height: 442 },
  koctas: { src: "/images/private-label/logos/koctas.png", width: 252, height: 300 },
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
].map((r) => ({ ...r, logo: retailerLogos[r.slug] }));

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
