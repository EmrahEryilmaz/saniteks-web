<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Saniteks web

Corporate + product site for Saniteks (cleaning sponges, cloths, scourers, special-form sponges, raw materials).
Rebuilt from the live https://www.saniteks.com.tr design; Turkish only (`lang="tr"`).

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
  A SKU with photos shows a thumbnail gallery (`SkuPhotos`). The originals are on the `urun_gorselleri` branch.
- Product data lives only in `src/data/products.ts` (Category → ProductType → Sku). Pages read from it; never duplicate it.
- Site-wide constants (contact info, nav) live in `src/lib/site.ts`.
- Copy is Turkish; keep the calm, non-promotional tone of the existing pages. Do not invent certifications, figures or claims.

## Commands
- `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck`
- Verify every change with `npm run typecheck`, `npm run lint` and `npm run build`.

## Project decisions (keep unless the owner says otherwise)
- No source of the live site existed; this repo is a rebuild from its HTML. Product data was transcribed from the
  February 2016 Sanifoam/Sanitex catalogue PDF (not in the repo); catalogue packshots were cut from it.
- Scope: only the 5 product groups (no detergents or personal care). Show code, size and case info; never barcodes.
- The current range is the shipping list `saniteks ürünler.xlsx` (business data, deliberately kept out of the repo).
  Catalogue SKUs missing from it carry `madeToOrder` ("Talep üzerine üretim") via `MADE_TO_ORDER` in `products.ts`.
  Products photographed in 2026 count as current (owner's catalogue rebuild, 2026-11-17); items without a new photo stay
  on the site with their old catalogue photo or a placeholder.
- "Plaka ve Rulo Ürünler" summarises the ERP felt (126.0.xxx) and non-woven cloth (800.4.xxx) roll lists as grammage ×
  colour tables and a few varieties — never the full list, never customer prints/brands (Remax, Pure, Banat, Aro, BQ,
  Vileda), seconds or defective stock.
- Category slug `hammadde` is titled "Plaka ve Rulo Ürünler" (owner decision 2026-11-11; slug kept so links do not
  break; it still contains Tabaka Hammadde and Dökme Ürünler). Its imagery is the owner's own photo
  (`public/images/products/hammadde/rulo-nonwoven-kece*.webp`); recoloured-photo and procedural 3D versions were rejected.
- Company facts: Saniteks is a Sanifoam group company; head office İstanbul, production Hendek (Sakarya). Use only
  verifiable group facts — no employee counts or plant areas. Sanifoam group policies apply to Saniteks. The Veliköy URS
  ISO certificates expired in September 2025, so `validCertificates()` hides them; list renewed ones only when supplied.
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
