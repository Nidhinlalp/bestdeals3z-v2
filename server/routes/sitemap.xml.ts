import { serverQueryContent } from '#content/server'
import { createClient } from '@supabase/supabase-js'

interface SlugRow { slug: string; created_at?: string }

/** Dynamically generated sitemap covering static pages, products, categories and policies. */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = config.public.siteUrl.replace(/\/$/, '')

  // Products and categories now come from Supabase; policies remain in @nuxt/content
  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceKey)

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('slug, created_at'),
    supabase.from('categories').select('slug'),
  ])

  const policies = await serverQueryContent(event, 'policies').only(['slug']).find()

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
    ...((categories ?? []) as SlugRow[]).map((c) => ({ loc: `${base}/category/${c.slug}`, priority: '0.7', changefreq: 'weekly', lastmod: '' })),
    ...(policies as { slug?: string }[]).map((pol) => ({ loc: `${base}/policies/${pol.slug}`, priority: '0.3', changefreq: 'yearly', lastmod: '' })),
    ...((products ?? []) as SlugRow[]).map((p) => ({ loc: `${base}/product/${p.slug}`, priority: '0.8', changefreq: 'weekly', lastmod: p.created_at ? p.created_at.split('T')[0] : '' })),
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
