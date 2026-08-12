# Deployment Guide — Cloud Scart

Cloud Scart is a **Nuxt 3** storefront backed by **Supabase** (database, auth, storage). It deploys to **Vercel** with no extra configuration.

---

## 1. Prerequisites

- A [GitHub](https://github.com) repository containing this project.
- A [Vercel](https://vercel.com) plan that permits commercial use. Vercel's Hobby plan is restricted to personal, non-commercial projects; use Pro or another suitable commercial plan for this store.
- A [Supabase](https://supabase.com) project (free tier is enough to start).
- Your WhatsApp business number in international format (e.g. `919000000000`).

---

## 2. Supabase Setup

### 2a. Create the database schema

In your Supabase project, open **SQL Editor** and run the migration files in order:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_production_hardening.sql
```

This creates the catalog and order tables, secure RLS policies, the `admin_users` table, and the public `images` bucket with administrator-only write access. If `001_initial_schema.sql` was already applied, run `002_production_hardening.sql` now; it removes the old anonymous order access policy and adds the production fields safely.

### 2b. Create an admin user

1. Go to **Supabase Dashboard → Authentication → Users → Invite user**.
2. Enter the admin's email address and send the invite.
3. Once they accept, copy their **User ID** (UUID) from the Users list.
4. Run this in SQL Editor (replace the UUID):

```sql
INSERT INTO admin_users (user_id) VALUES ('<paste-user-uuid-here>');
```

That user can now log in at `/admin/login` with their email and password.

---

## 3. Environment Variables

Copy `.env.example` to `.env` and fill in all values:

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_KEY` | Supabase → Project Settings → API → `anon` / `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` key (**server only — never expose**) |
| `NUXT_PUBLIC_SITE_URL` | `https://cloudscart.in` |
| `NUXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number, no `+` or spaces, e.g. `919000000000` |
| `NUXT_PUBLIC_SELLER_LEGAL_NAME` | Registered proprietor/company/LLP name operating the store |
| `NUXT_PUBLIC_BUSINESS_ADDRESS` | Full principal business address with state and pincode |
| `NUXT_PUBLIC_GRIEVANCE_OFFICER_NAME` | Full name of the designated consumer grievance officer |
| `NUXT_PUBLIC_GRIEVANCE_EMAIL` | Optional grievance email override |
| `NUXT_PUBLIC_GRIEVANCE_PHONE` | Optional grievance phone override |
| `CONTENT_RIGHTS_CONFIRMED` | Set to `true` only after completing the content/IP review below |

Vercel production builds fail intentionally when the required Supabase, site, WhatsApp or seller/grievance values are missing. This prevents a legally incomplete storefront from being published accidentally.

---

## 4. Deploy to Vercel

1. Push the project to GitHub.
2. Go to **vercel.com → Add New → Project** and import your repository.
3. Vercel auto-detects Nuxt — no build settings changes needed.
4. Add every required environment variable from Step 3 before the first deploy.
5. Click **Deploy**.

**Custom domain:** In Vercel → Project → Settings → Domains, add `cloudscart.in` (and redirect `www.cloudscart.in` to the apex domain if you use `www`). Keep `NUXT_PUBLIC_SITE_URL=https://cloudscart.in` and redeploy.

---

## 5. Managing Content (Admin Panel)

Everything is managed at `/admin` on the live site — no git or code changes needed for day-to-day updates.

| Section | What you can do |
|---|---|
| **Products** | Add, edit, delete products. Upload images, set price, stock, variants. |
| **Categories** | Add, edit, delete categories and their cover images. |
| **Banners** | Manage homepage hero banners — image, headline, CTA button. |
| **Orders** | View all orders, update status (pending → confirmed → shipped → delivered). |

---

## 6. Post-Deploy Checklist

- [ ] Homepage, shop page and a product page all load correctly.
- [ ] The hosting account is on a plan that permits commercial e-commerce use.
- [ ] Add to cart → checkout → **Place Order on WhatsApp** opens WhatsApp with the order pre-filled and the correct number.
- [ ] Payment method (COD / Prepaid) appears in the WhatsApp message.
- [ ] The WhatsApp number, seller legal name, full business address and grievance officer are correct on `/contact` and every policy page.
- [ ] Every live product includes country of origin, net quantity, manufacturer/packer name and address, importer details where applicable, warranty and safety information.
- [ ] Every product photo, logo, description, specification, video and testimonial is original, licensed, supplier-authorized or otherwise lawfully publishable.
- [ ] No invented review, rating, “best seller” or performance claim is live.
- [ ] `/admin/login` accepts the admin email and password.
- [ ] Admin can add a product and it appears live on the store within the configured one-minute cache window.
- [ ] `/sitemap.xml` and `/robots.txt` resolve correctly.
- [ ] Image uploads from the admin panel land in Supabase Storage.
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm audit --prod` and `pnpm build` all pass.
- [ ] `pnpm verify:production` passes; after deployment, run `VERIFY_LIVE_SITE=1 pnpm verify:production` once more.
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev) on the homepage and a product page.

---

## 7. Architecture

| Layer | Technology |
|---|---|
| Frontend | Nuxt 3, Vue 3, Tailwind CSS |
| Database | Supabase (PostgreSQL) — products, categories, banners, orders |
| Auth | Supabase Auth — email/password, JWT, `admin_users` table |
| Storage | Supabase Storage — all product/category/banner images |
| Legal pages | Typed, versioned policy content in `app/constants/policies.ts` |
| Hosting | Vercel (serverless + edge cache) |
| Orders | WhatsApp — no payment gateway; COD and UPI arranged via chat |

After both migrations are applied, RLS (Row Level Security) is enabled on all tables and anonymous visitors cannot read order records. The `anon` key is designed to be public; the service-role key must remain server-only.

---

## 8. Rotating Secrets

If Supabase keys are ever compromised:

1. **Supabase → Project Settings → API → Rotate API keys.**
2. Update `SUPABASE_KEY` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel's environment variables.
3. Trigger a redeploy on Vercel.

To change the admin password: **Supabase → Authentication → Users → Send password reset**.
