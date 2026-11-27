/**
 * Gettext-style translation: Turkish source strings are the keys; translations/<lang>.json maps them to the
 * other languages. A missing translation falls back to the Turkish text (and `npm run i18n:check` reports it).
 * Placeholders: t("{count} ürün listeleniyor", { count: 12 }).
 */
export type Dictionary = Record<string, string>;
export type Vars = Record<string, string | number>;
export type Translate = (source: string, vars?: Vars) => string;

export function makeTranslate(dictionary: Dictionary | null): Translate {
  return (source, vars) => {
    const text = (dictionary && dictionary[source]) || source;
    return vars ? text.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match)) : text;
  };
}

/** Object keys whose string values are identifiers, paths or codes — never translated by localizeDeep. */
const skipKeys = new Set([
  "slug",
  "id",
  "code",
  "categorySlug",
  "packaging",
  "image",
  "src",
  "href",
  "url",
  "file",
  "logo",
  "hex",
  "nameEn",
  "number",
  "validFrom",
  "validUntil",
  "email",
  "phone",
  "phoneHref",
  "phoneE164",
  "mapsHref",
  "path",
  "icon",
  "position",
  "kind",
  "variant",
  "key",
  "published",
  "address",
  "streetAddress",
  "addressLocality",
  "addressRegion",
  "postalCode",
  "addressCountry",
  "phoneDisplay",
]);

/**
 * Returns a copy of `value` with every translatable string replaced (strings under skipKeys are kept). Used for the
 * data modules (products, corporate, quality …), whose Turkish strings are keys in translations/<lang>.json.
 */
export function localizeDeep<T>(value: T, t: Translate, key?: string): T {
  if (typeof value === "string") return (key && skipKeys.has(key) ? value : t(value)) as T;
  if (Array.isArray(value)) return value.map((item) => localizeDeep(item, t, key)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = localizeDeep(v, t, k);
    return out as T;
  }
  return value;
}
