/**
 * Data whose Turkish strings are translated through translations/<lang>.json. Pages show them through
 * i18n/data.ts (getCategories, localized(…)); scripts/i18n/extract.ts walks everything registered here to list the
 * strings for the translators. Whole modules are registered: functions are ignored, identifier-like keys are skipped
 * (see translate.ts › skipKeys).
 */
import * as capabilities from "@/data/capabilities";
import * as careers from "@/data/careers";
import * as corporate from "@/data/corporate";
import * as privateLabel from "@/data/privateLabel";
import { categories } from "@/data/products";
import * as quality from "@/data/quality";
import { heroSlides } from "@/components/home/heroSlides";
import { footerNav, legalNav, mainNav, site } from "@/lib/site";

export const translatableData: Record<string, unknown> = {
  categories,
  capabilities: { ...capabilities },
  careers: { ...careers },
  corporate: { ...corporate },
  privateLabel: { ...privateLabel },
  quality: { ...quality },
  heroSlides,
  siteText: { tagline: site.tagline, footerTagline: site.footerTagline },
  mainNav,
  footerNav,
  legalNav,
};
