# BestDeal3z — Headless E-Commerce Storefront

A production-ready, **backend-free** e-commerce platform built with **Nuxt 3**, **Nuxt Content**, **Pinia** and **Tailwind CSS**. Checkout happens entirely over **WhatsApp** — no payment gateway, no database, no server to maintain.

Design language follows the **BMW M** system in [`DESIGN-bmw-m.md`](./DESIGN-bmw-m.md): a near-black canvas, white uppercase display type, flat (0px-radius) rectangular components and the M-tricolor stripe used only as a brand accent.

---

## ✨ Features

| Area | What you get |
|---|---|
| **Storefront** | Home, Shop (search · filter · sort · paginate), Product details (gallery, variants, related), Cart, WhatsApp Checkout, Categories, About, Contact, Track Order |
| **Cart** | Pinia store persisted to `localStorage` — survives refresh. Slide-in cart drawer + full cart page |
| **WhatsApp checkout** | Validated form → auto-generated order message → `wa.me` deep link. No card/UPI gateway |
| **Admin CMS** | Password-protected `/admin` dashboard to create/edit/delete Products, Categories & Banners. Writes directly to Nuxt Content markdown files |
| **Content** | Real catalog scraped from [dropstore.co.in](https://dropstore.co.in) — 9 products with genuine photos, prices & descriptions across 5 categories + 5 banners |
| **SEO** | Dynamic meta + Open Graph + Twitter cards, Product / Breadcrumb / FAQ / Organization JSON-LD, dynamic `sitemap.xml` & `robots.txt` |
| **Performance** | `@nuxt/image` optimisation, lazy loading, route-based code splitting, prerendering |
| **Responsive** | Mobile-first from 320px → 1728px |

---

## 🧰 Tech Stack

- **Nuxt 3** (Nuxt 4 directory structure via `compatibilityVersion: 4`) + **TypeScript** (strict)
- **Nuxt Content** — file-based CMS (no database)
- **Pinia** + `@pinia-plugin-persistedstate` — cart state
- **Tailwind CSS** — design tokens from the design system
- **@nuxt/image** — image optimisation
- **VueUse** — composition utilities
- **Zod** — validation (content, admin forms, checkout)
- **Vercel** — deployment target

> No Express / Nest / Laravel. No MongoDB / SQL / Firebase. The app runs without any backend server.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env
#    then edit ADMIN_PASSWORD and NUXT_PUBLIC_WHATSAPP_NUMBER

# 3. (Optional) content sources:
npm run scrape   # pull the LIVE Dropstore catalog + real product images
npm run seed     # OR generate offline themed SVG placeholders (no network)

# 4. Run the dev server
npm run dev      # → http://localhost:3000
```

### Environment variables

| Variable | Purpose | Example |
|---|---|---|
| `ADMIN_PASSWORD` | Password for the `/admin` dashboard | `super-secret` |
| `NUXT_PUBLIC_SITE_URL` | Canonical site URL (SEO, sitemap, JSON-LD) | `https://bestdeal3z.vercel.app` |
| `NUXT_PUBLIC_WHATSAPP_NUMBER` | Owner WhatsApp number, intl format, no `+` | `919000000000` |

---

## 📁 Project Structure

```
app/
  assets/css/        Global styles + design tokens
  components/
    base/            BaseButton, BaseInput, BaseModal, BaseDrawer, Pagination…
    product/         ProductCard, ProductGallery, ReviewCard, BannerCard…
    category/        CategoryCard
    cart/            CartItem
    layout/          AppHeader, AppFooter, CartDrawer, HeroCarousel…
    admin/           ProductForm, CategoryForm, BannerForm
  composables/       useCatalog, useWhatsapp, useStructuredData, useAdminApi…
  constants/         site.ts (config), content.ts (reviews + FAQs)
  layouts/           default.vue, admin.vue
  middleware/        admin.global.ts (route protection)
  pages/             Storefront + /admin pages
  stores/            cart.ts, ui.ts
  types/             Shared TypeScript types
  utils/             format.ts, schemas.ts (Zod)
content/
  products/  categories/  banners/    ← Nuxt Content markdown (the "database")
public/
  products/  categories/  banners/    ← Images (SVG placeholders, swap for real photos)
server/
  api/admin/         Login + content CRUD endpoints
  routes/            sitemap.xml, robots.txt
  utils/             content.ts (file I/O + auth), validate.ts (Zod)
scripts/
  scrape-dropstore.mjs   Pull live Dropstore catalog + real images
  generate-content.mjs   Offline SVG-placeholder fallback seed
```

---

## 🛒 How WhatsApp Checkout Works

1. Customer adds products to the cart (persisted in `localStorage`).
2. At **/checkout** they fill in name, phone, WhatsApp, address, city, state, pincode — all Zod-validated.
3. On **Place Order**, the app builds a formatted order message and opens
   `https://wa.me/<NUXT_PUBLIC_WHATSAPP_NUMBER>?text=<encoded order>`.
4. The customer hits **send**; the order is finalised in the WhatsApp chat. Payment is arranged there (Cash on Delivery / UPI link).

No card data ever touches the site.

---

## 🔐 Admin Dashboard (`/admin`)

- Log in with `ADMIN_PASSWORD`. The password is kept in `sessionStorage` and sent as an `x-admin-key` header on every write — server routes reject anything else.
- Manage **Products**, **Categories** and **Banners** with create / edit / delete.
- Saving writes a markdown file into `content/<type>/<slug>.md`; deleting removes it.

> **Image uploads:** drop image files into `public/products` (or `categories` / `banners`) and reference them by path (e.g. `/products/my-photo.jpg`) in the admin form. The repo ships with themed SVG placeholders you can replace at any time.

> **Persistence on Vercel:** serverless filesystems are ephemeral, so edits made on the live site won't survive a redeploy. Treat the admin as a **local content editor** — run it locally, then commit the updated `content/` files to Git (a redeploy publishes them). This is the standard Git-based CMS workflow and keeps the project 100% backend-free. See [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run generate` | Static generation |
| `npm run scrape` | Pull the live Dropstore catalog + download real product images |
| `npm run seed` | Generate offline themed SVG placeholder content (no network) |
| `npm run lint` | Lint with ESLint |
| `npm run typecheck` | Type-check with `vue-tsc` |

---

## 🎨 Design System

All tokens (colours, typography, spacing, radius) live in [`tailwind.config.ts`](./tailwind.config.ts) and [`app/assets/css/main.css`](./app/assets/css/main.css), derived 1:1 from [`DESIGN-bmw-m.md`](./DESIGN-bmw-m.md). BMW Type Next Latin is substituted with **Inter** (the design doc's recommended open-source fallback).

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full deployment guide.
