# Deployment Guide

BestDeal3z deploys to **Vercel** with zero configuration. Because there is no database and no separate backend, hosting is cheap (it fits comfortably in Vercel's free Hobby tier).

---

## 1. Prerequisites

- A [GitHub](https://github.com) (or GitLab/Bitbucket) repository containing this project.
- A free [Vercel](https://vercel.com) account.
- Your WhatsApp business number in international format (e.g. `919000000000`).

---

## 2. Push to Git

```bash
git init
git add .
git commit -m "Initial commit — BestDeal3z storefront"
git branch -M main
git remote add origin https://github.com/<you>/bestdeal3z.git
git push -u origin main
```

---

## 3. Import into Vercel

1. Go to **vercel.com → Add New → Project** and import your repository.
2. Vercel auto-detects **Nuxt** — no build settings needed.
   - Build command: `npm run build`
   - Output: handled by the Nuxt Vercel preset automatically.
3. Add the **Environment Variables** below before the first deploy.
4. Click **Deploy**.

### Required environment variables

| Key | Value |
|---|---|
| `ADMIN_PASSWORD` | A strong password for `/admin` |
| `NUXT_PUBLIC_SITE_URL` | Your final URL, e.g. `https://bestdeal3z.vercel.app` |
| `NUXT_PUBLIC_WHATSAPP_NUMBER` | Owner number, intl format, no `+` (e.g. `919000000000`) |

> After adding/changing env vars, trigger a **redeploy** so they take effect.

---

## 4. Custom Domain (optional)

In **Vercel → Project → Settings → Domains**, add your domain and follow the DNS instructions. Then update `NUXT_PUBLIC_SITE_URL` to the custom domain and redeploy so canonical URLs, the sitemap and JSON-LD all use it.

---

## 5. Managing Content (the Git-based CMS workflow)

The store's data lives as markdown files in `content/`. There are two ways to edit it:

### A. Locally with the admin dashboard (recommended)
```bash
npm run dev
# visit http://localhost:3000/admin and log in
# add / edit / delete products, categories, banners
git add content public
git commit -m "Update catalog"
git push        # Vercel redeploys with the new content
```

### B. By hand
Edit the markdown files in `content/products`, `content/categories`, `content/banners` directly, drop images into `public/`, commit and push.

> **Why not edit on the live site?** Vercel's serverless filesystem is read-only/ephemeral, so writes made in production are lost on the next deploy. Editing locally + committing keeps everything versioned and free of any backend — the JAMstack way.

### Adding real product photos
1. Put image files in `public/products/` (e.g. `public/products/drone-x-1.jpg`).
2. Reference them in the product (admin form or markdown `images:` list) as `/products/drone-x-1.jpg`.
3. Commit & push. `@nuxt/image` optimises them automatically.

---

## 6. Post-Deploy Checklist

- [ ] Visit the live URL — homepage, shop, a product page all load.
- [ ] Add to cart → checkout → **Place Order on WhatsApp** opens a chat to the correct number with the order prefilled.
- [ ] `/<your-domain>/sitemap.xml` and `/robots.txt` resolve.
- [ ] `/admin` redirects to login and accepts `ADMIN_PASSWORD`.
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev) against the home and a product page.

---

## 7. Performance Notes

- Storefront pages are prerendered/cached; only `/admin` is client-rendered.
- Images are served through `@nuxt/image` (WebP, responsive `srcset`, lazy loading).
- Replace the SVG placeholders with optimised real photos (ideally ≤ 200 KB each) before launch for the best Lighthouse scores.

---

## 8. Alternative Hosts

The app also runs on **Netlify**, **Cloudflare Pages** or any Node host (`node .output/server/index.mjs` after `npm run build`). Set the same three environment variables. The admin write API requires a Node/serverless runtime; on fully static hosts (`npm run generate`) the storefront still works but use the local admin workflow for content.
