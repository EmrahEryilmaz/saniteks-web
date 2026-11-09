<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
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
- Category slug `hammadde` is titled "Rulo Non-Woven Temizlik Bezi ve Ovucu Keçe Üretimleri" (slug kept so links do not
  break; it still contains Tabaka Hammadde and Dökme Ürünler). Its imagery is the owner's own photo
  (`public/images/products/hammadde/rulo-nonwoven-kece*.webp`); recoloured-photo and procedural 3D versions were rejected.
- Company facts: Saniteks is a Sanifoam group company; head office İstanbul, production Hendek (Sakarya). Use only
  verifiable group facts — no employee counts or plant areas. Sanifoam group policies apply to Saniteks. The Veliköy URS
  ISO certificates expired in September 2025, so `validCertificates()` hides them; list renewed ones only when supplied.
- Private label (`/urunler/ozel-marka-uretimi`): the retailers allow their official names, logos and product photos.
  Brand → chain: Clean & Fun = A101, Mr Green = BİM, Mintax = ŞOK, Benri = Gratis, Carrefour = CarrefourSA,
  ARO / METRO Professional / Fine Dreaming = Metro, Housera / Proera = Koçtaş. Banat (Bella) is shown as a brand owner.
  Never show Vileda (Glitzi, Miraclean); DEVA and ECE are not shown. The Mintax photo stays out (ŞOK's product page names
  another manufacturer, Provel). CarrefourSA has no logo file yet and is shown as text.
- Logo: the cube was recoloured from light green to sponge yellow (front `#EFE532`, side `#D9C21A`, dark-green top).
  The live site still has the green version — never bring it back. Files: `public/images/logo/saniteks-logo.png`,
  `public/icons/saniteks-*.png` (favicons transparent; the Apple touch icon keeps a white background).
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
