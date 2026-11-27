<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Saniteks web

Corporate + product site for Saniteks (cleaning sponges, cloths, scourers, special-form sponges, raw materials).
Rebuilt from the live https://www.saniteks.com.tr design. Five languages (owner decision 2026-11-27): Turkish (source,
unprefixed URLs) and English, German, Arabic (RTL), Russian under `/en`, `/de`, `/ar`, `/ru`.

## Stack
- Next.js 16 App Router (`src/app`), React 19, TypeScript strict, alias `@/*` → `src/*`.
- Tailwind CSS 4, CSS-first config in `src/app/globals.css` (design tokens live there — no tailwind.config).
- Swiper 14 for the home hero slider; nodemailer for `/api/contact` and `/api/apply`.

## Conventions
- Design tokens: use semantic utilities only (`bg-surface`, `bg-surface-muted`, `bg-surface-strong`, `text-foreground`,
  `text-muted-foreground`, `text-subtle-foreground`, `text-link`, `bg-primary`, `text-primary-foreground`, `border-border`,
  `bg-overlay/30`, `outline-focus-ring` …). Never hard-code hex colours in components.
- Page container: `mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-16`.
- Font stack is Arial/Helvetica (`font-sans`); no web fonts.
- Every interactive element gets `focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring`
  and a minimum 44px hit area (`min-h-11` / `size-11`). Respect `motion-reduce:`.
- Images: `next/image` with explicit `width`/`height` (or `fill` + `sizes`). Catalogue packshots in
  `public/images/catalog/*.webp` are low resolution — render them `object-contain` on a white tile and keep `sizes` ≤ 480px.
- Product studio photos (2026): `public/images/urunler/<code>-<n>.webp` (code lower-cased, dots → dashes; max 1200 px),
  listed per code in `PHOTOS` in `products.ts` (one letter per photo: P ambalaj, U ürün, C ambalaj+ürün, L kullanımda).
  A SKU with photos shows a thumbnail gallery on its product page (`ProductGallery`). The originals are on the `urun_gorselleri` branch.
- Product data lives only in `src/data/products.ts` (Category → ProductType → Sku). Pages read from it; never duplicate it.
- Product pages are shop-style (owner decision 2026-11-23): `/urunler/<category>` shows the description and then every
  SKU as a tile grid (`CategoryShop` + `ShopProductCard`, product types are only filter chips); each SKU has its own
  page `/urunler/<category>/<sku-slug>`. Product types have no page — `next.config.ts` redirects their old URLs to the
  category (generated from `productTypePaths`); `products.ts` throws if a SKU slug equals a type slug.
- Site-wide constants (contact info, nav) live in `src/lib/site.ts`.
- i18n (`src/i18n/`): routes live under `src/app/[lang]/`; `src/proxy.ts` rewrites unprefixed URLs to Turkish and sends
  first-time visitors to their browser language (not offered → English; no Accept-Language → Turkish; the choice is
  kept in the `NEXT_LOCALE` cookie). Gettext style: the Turkish text is the key — `const t = await getT()` (server) /
  `useT()` (client), always `t("literal")` with `{placeholders}`. Data modules stay Turkish and are shown through
  `getCategories()` / `localized(…)` from `@/i18n/data`; register new data in `src/i18n/sources.ts`. Links use
  `Link` from `@/i18n/Link` (unprefixed hrefs); metadata uses `pageMetadata` (canonical + hreflang). URL slugs stay
  Turkish in every language. Use logical Tailwind classes (`ps-`, `ms-`, `start-`, `border-s` …) so Arabic mirrors.
- After changing or adding Turkish text run `npm run i18n:extract` and add the translations to
  `src/i18n/translations/{en,de,ar,ru}.json`; `npm run i18n:check` must report 0 missing (a missing translation
  falls back to Turkish).
- Copy is Turkish; keep the calm, non-promotional tone of the existing pages. Do not invent certifications, figures or claims.

## Commands
- `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck`
- Verify every change with `npm run typecheck`, `npm run lint` and `npm run build`.

## Project decisions (keep unless the owner says otherwise)
- No source of the live site existed; this repo is a rebuild from its HTML. Product data was transcribed from the
  February 2016 Sanifoam/Sanitex catalogue PDF (not in the repo); catalogue packshots were cut from it.
- Scope: only the 6 product categories listed below (no detergents or personal care). Show code, size and case info; never barcodes.
- The current range is the shipping list `saniteks ürünler.xlsx` (business data, deliberately kept out of the repo).
  Catalogue SKUs missing from it carry `madeToOrder` ("Talep üzerine üretim") via `MADE_TO_ORDER` in `products.ts`.
  Products photographed in 2026 count as current (owner's catalogue rebuild, 2026-11-17); items with only an old
  catalogue photo stay listed. Items without any photo are hidden (owner decision 2026-11-27): they stay in the data, are
  filtered out at the end of `products.ts` (`hiddenSkuPaths`) and their URLs redirect (307) to the category.
- "Plaka ve Rulo Ürünler" summarises the ERP felt (126.0.xxx) and non-woven cloth (800.4.xxx) roll lists as grammage ×
  colour tables and a few varieties — never the full list, never customer prints/brands (Remax, Pure, Banat, Aro, BQ,
  Vileda), seconds or defective stock.
- Categories (2026-11-23): Temizlik Süngerleri, Temizlik Bezleri, Ovucu Materyaller, Özel Formlu Süngerler, Doğal Ürünler
  (natürel lifli and selülozik items only — do not call anything biodegradable/organic etc. without the owner's evidence),
  Plaka ve Rulo Ürünler. The home page shows these six plus an "Özel Marka Üretimi" card.
- Category images are the owner's photos (2026-11-23), all in one scene style (products on travertine steps):
  `public/images/products/kategori-<slug>-foto.webp` for the five product categories and
  `kategori-plaka-ve-rulo-urunler-foto.webp` for `hammadde`; 4:3, used both as page hero and on cards.
- Category slug `hammadde` is titled "Plaka ve Rulo Ürünler" (owner decision 2026-11-11; slug kept so links do not
  break; Dökme Ürünler is currently empty because its items have no photo). Its category image is the owner's photo above; the older
  owner photo `public/images/products/hammadde/rulo-nonwoven-kece*.webp` is still used on the home page and elsewhere;
  recoloured-photo and procedural 3D versions were rejected.
- Kalite menu (owner decision 2026-11-23): one page `/kalite/politikalarimiz` holds the quality, environment and OHS
  policies (anchors `#kalite-politikamiz`, `#cevre-politikamiz`, `#isg-politikamiz`; the old single pages redirect there
  via `mergedPolicyPaths` in `src/data/quality.ts`), plus Şikâyet Prosedürleri and Kalite Belgelerimiz.
- Company facts: Saniteks is a Sanifoam group company; head office İstanbul, production Hendek (Sakarya). Use only
  verifiable group facts — no employee counts or plant areas. Sanifoam group policies apply to Saniteks. The Veliköy URS
  ISO certificates of the 2022–2025 cycle (holder Sanifoam) expired in September 2025 and are hidden by
  `validCertificates()`. Listed now: ISO 9001:2015 no. 212801/A/0001/UK/Tr held by Saniteks (06.04.2024–05.04.2027,
  PDF in `public/documents/certificates/`, supplied 2026-11-23). List other renewed ones only when supplied.
- Private label (`/urunler/ozel-marka-uretimi`): shows only the retailers we produce for, by official name and logo
  (A101, BİM, FİLE, ŞOK, Metro, Gratis, CarrefourSA, Koçtaş — permitted by the retailers). Owner decision 2026-11-10:
  no brand owners (Banat/Bella removed) and no photos or names of customers' private-label products. Never show Vileda
  (Glitzi, Miraclean), DEVA or ECE. CarrefourSA has no logo file yet and is shown as text.
- Logo: the cube was recoloured from light green to sponge yellow (front `#EFE532`, side `#D9C21A`, dark-green top).
  The live site still has the green version — never bring it back. Files: `public/images/logo/saniteks-logo.png`,
  `public/images/icons/saniteks-*.png` and `src/app/favicon.ico` (favicons transparent; the Apple touch icon keeps a white
  background). Never serve anything under `/icons/`: on the Plesk/Apache host it is a server-wide alias to Apache's icons.
- HR: job applications and "İnsan Kaynakları" contact messages go to `site.contact.hrEmail` (ik@sanifoam.com.tr)
  unless `HR_TO` is set.
- Home slider lifestyle photos come from the 2016 catalogue (licence unverified); slide 3 was AI-upscaled and retouched
  (detergent bottle removed).

## Working rules
- `/images/*` is served with a 30-day cache header: when an image's content changes, save it under a new filename and
  update the references (add a redirect in `next.config.ts` if the old path was public).
- Hosting: Plesk (nginx + Phusion Passenger, shared with sanifoam.com.tr), `output: "standalone"`; see `DEPLOY.md` and
  `npm run package:plesk`. The owner deploys — never deploy or change the server without an explicit go.
- Secrets (SMTP credentials etc.) live only in the Plesk environment; never commit `.env*` files.
- Deploys: GitHub Actions commits the built package to the `yayin` branch; the Plesk Git extension pulls it into
  `/saniteks-web/app` (DEPLOY.md › Yöntem C). That deployment adds and deletes files but does NOT refresh files that
  already exist, so each release lives in `releases/<timestamp>-<commit>/` and the Plesk startup file is `app.js`
  (`.github/scripts/plesk-launcher.js`, must stay byte-identical), which runs the newest release and exits when a newer
  one appears. To inspect the live site from here, push a branch named `tani/...` with a curl workflow (GitHub runners
  can reach the site; this sandbox cannot).
