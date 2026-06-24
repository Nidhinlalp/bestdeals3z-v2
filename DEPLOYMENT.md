# Deployment Guide — BestDeal3z

BestDeal3z is a **Nuxt 3** storefront backed by **Supabase** (database, auth, storage). It deploys to **Vercel** with no extra configuration.

---

## 1. Prerequisites

- A [GitHub](https://github.com) repository containing this project.
- A [Vercel](https://vercel.com) account (free Hobby tier is enough).
- A [Supabase](https://supabase.com) project (free tier is enough to start).
- Your WhatsApp business number in international format (e.g. `919000000000`).

---

## 2. Supabase Setup

### 2a. Create the database schema

In your Supabase project, open **SQL Editor** and run the migration file:

```
supabase/migrations/001_initial_schema.sql
```

This creates the `products`, `categories`, `banners`, and `orders` tables, plus RLS policies and the `admin_users` table.

Then run this additional migration:

```sql
ALTER TABLE orders
ADD COLUMN payment_method text NOT NULL DEFAULT 'cod'
  CHECK (payment_method IN ('cod', 'prepaid'));
```

### 2b. Create an admin user

1. Go to **Supabase Dashboard → Authentication → Users → Invite user**.
2. Enter the admin's email address and send the invite.
3. Once they accept, copy their **User ID** (UUID) from the Users list.
4. Run this in SQL Editor (replace the UUID):

```sql
INSERT INTO admin_users (user_id) VALUES ('<paste-user-uuid-here>');
```

That user can now log in at `/admin/login` with their email and password.

### 2c. Create a storage bucket

1. Go to **Supabase Dashboard → Storage → New bucket**.
2. Name it `images`, set it to **Public**.
3. The admin panel uses this bucket for all image uploads.

---

## 3. Environment Variables

Copy `.env.example` to `.env` and fill in all values:

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_KEY` | Supabase → Project Settings → API → `anon` / `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` key (**server only — never expose**) |
| `NUXT_PUBLIC_SITE_URL` | Your production domain, e.g. `https://bestdeal3z.com` |
| `NUXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number, no `+` or spaces, e.g. `919000000000` |

---

## 4. Deploy to Vercel

1. Push the project to GitHub.
2. Go to **vercel.com → Add New → Project** and import your repository.
3. Vercel auto-detects Nuxt — no build settings changes needed.
4. Add all 5 environment variables (Step 3) before the first deploy.
5. Click **Deploy**.

**Custom domain:** In Vercel → Project → Settings → Domains, add your domain. Then update `NUXT_PUBLIC_SITE_URL` and redeploy.

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
- [ ] Add to cart → checkout → **Place Order on WhatsApp** opens WhatsApp with the order pre-filled and the correct number.
- [ ] Payment method (COD / Prepaid) appears in the WhatsApp message.
- [ ] `/admin/login` accepts the admin email and password.
- [ ] Admin can add a product and it appears live on the store immediately.
- [ ] `/sitemap.xml` and `/robots.txt` resolve correctly.
- [ ] Image uploads from the admin panel land in Supabase Storage.
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev) on the homepage and a product page.

---

## 7. Architecture

| Layer | Technology |
|---|---|
| Frontend | Nuxt 3, Vue 3, Tailwind CSS |
| Database | Supabase (PostgreSQL) — products, categories, banners, orders |
| Auth | Supabase Auth — email/password, JWT, `admin_users` table |
| Storage | Supabase Storage — all product/category/banner images |
| Legal pages | Nuxt Content (Markdown) — only `/policies/*` |
| Hosting | Vercel (serverless + edge cache) |
| Orders | WhatsApp — no payment gateway; COD and UPI arranged via chat |

RLS (Row Level Security) is enabled on all tables. The `anon` key is safe to expose because RLS controls what each visitor can read and write.

---

## 8. Rotating Secrets

If Supabase keys are ever compromised:

1. **Supabase → Project Settings → API → Rotate API keys.**
2. Update `SUPABASE_KEY` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel's environment variables.
3. Trigger a redeploy on Vercel.

To change the admin password: **Supabase → Authentication → Users → Send password reset**.
