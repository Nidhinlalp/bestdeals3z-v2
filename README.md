# Cloud Scart

Cloud Scart is a Nuxt storefront for drones, RC products and gadgets. Customers build a cart on the site, enter delivery details, and choose whether to send the prepared order through WhatsApp. Supabase provides catalog data, order records, administrator authentication and image storage.

## Features

- Responsive storefront, product search and filtering, product variants and persistent cart.
- WhatsApp-first checkout with Cash on Delivery or separately confirmed UPI payment.
- Supabase-backed products, categories, banners, orders, admin authentication and images.
- Responsive administration screens for catalog, banner and order management.
- Product, breadcrumb, FAQ and organization structured data, plus sitemap and robots routes.
- Plain-language shipping, return, privacy and service policies maintained in code.

## Local development

Requirements: Node.js 20.19 or newer and pnpm 10.

```bash
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

Set every Supabase and public site value documented in `.env.example`. Private keys must never use a `NUXT_PUBLIC_` prefix.

## Quality checks

```bash
pnpm typecheck
pnpm lint
pnpm audit --prod
pnpm build
pnpm verify:production
```

`verify:production` checks required environment values, the explicit content-rights sign-off, the live Supabase schema/RLS, mandatory product disclosures, placeholder content, discount claims and public image availability. Set `VERIFY_LIVE_SITE=1` to include post-deployment route checks.

## Architecture

```text
app/
  components/       Storefront, base UI and administrator components
  composables/      Catalog, admin, WhatsApp, uploads and structured data
  constants/        Site copy, FAQ and legal policies
  pages/            Storefront and administrator routes
  stores/           Cart and UI state
server/
  api/admin/        Authenticated administrator checks
  routes/           sitemap.xml and robots.txt
supabase/
  migrations/       Database schema, RLS and storage policies
public/              Brand and social-preview assets
```

## Checkout behavior

1. The customer adds items and completes the validated checkout form.
2. The site records the order in Supabase and prepares an itemized WhatsApp message.
3. WhatsApp opens in a new tab. The customer must choose to send the message.
4. The store confirms stock, final charges, payment method and delivery estimate in the official chat.

The website does not collect card numbers, UPI PINs, OTPs or banking passwords.

## Production deployment

The intended host is Vercel. Production builds intentionally fail if essential Supabase or WhatsApp configuration is absent. The confirmed domain and seller disclosures have versioned defaults in `app/constants/site.ts` and can be overridden through Vercel environment variables. Apply every SQL migration in order and complete the checklist in [DEPLOYMENT.md](./DEPLOYMENT.md) before accepting orders.

## Content and intellectual property

Use only product descriptions, photographs, video, logos, testimonials and specifications that Cloud Scart owns, created, licensed or has permission to publish. Third-party product names should be used only as necessary to identify the goods. Do not import a competitor’s catalog or publish invented customer reviews.
