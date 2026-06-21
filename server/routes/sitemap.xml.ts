import { serverQueryContent } from '#content/server'

interface Doc { _path?: string; slug?: string; createdAt?: string }

/** Dynamically generated sitemap covering static pages, products and categories. */
export default defineEventHandler(async (event) => {
  const base = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')

  const products = await serverQueryContent<Doc>(event, 'products').only(['slug', 'createdAt']).find()
  const categories = await serverQueryContent<Doc>(event, 'categories').only(['slug']).find()
  const policies = await serverQueryContent<Doc>(event, 'policies').only(['slug']).find()

  const staticPages = [
    { loc: '/', priority: '1.0', freq: 'daily' },
    { loc: '/shop', priority: '0.9', freq: 'daily' },
    { loc: '/categories', priority: '0.8', freq: 'weekly' },
    { loc: '/about', priority: '0.5', freq: 'monthly' },
    { loc: '/contact', priority: '0.5', freq: 'monthly' },
    { loc: '/track', priority: '0.4', freq: 'monthly' },
  ]

  const urls = [
    ...staticPages.map((p) => ({ loc: base + p.loc, priority: p.priority, changefreq: p.freq, lastmod: '' })),
    ...categories.map((c) => ({ loc: `${base}/category/${c.slug}`, priority: '0.7', changefreq: 'weekly', lastmod: '' })),
    ...policies.map((pol) => ({ loc: `${base}/policies/${pol.slug}`, priority: '0.3', changefreq: 'yearly', lastmod: '' })),
    ...products.map((p) => ({ loc: `${base}/product/${p.slug}`, priority: '0.8', changefreq: 'weekly', lastmod: p.createdAt ? p.createdAt.split('T')[0] : '' })),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return body
})
