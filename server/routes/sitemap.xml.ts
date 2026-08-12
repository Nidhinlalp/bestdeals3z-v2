import { createClient } from '@supabase/supabase-js'
import { POLICY_SLUGS } from '~/constants/policies'

interface SlugRow { slug: string; created_at?: string }
interface ProductSlugRow extends SlugRow {
  manufacturer: string
  importer: string
  country_of_origin: string
  net_quantity: string
}

function isPublishableProduct(product: ProductSlugRow): boolean {
  return Boolean(
    product.manufacturer?.trim()
    && product.country_of_origin?.trim()
    && product.net_quantity?.trim()
    && (product.country_of_origin.toLocaleLowerCase('en-IN') === 'india' || product.importer?.trim()),
  )
}

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
  })[character]!)
}

/** Dynamically generated sitemap covering static pages, products, categories and policies. */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = config.public.siteUrl.replace(/\/$/, '')

  // Products and categories come from Supabase; legal policy slugs are build-time constants.
  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceKey)

  const [productResult, categoryResult] = await Promise.all([
    supabase.from('products').select('slug, created_at, manufacturer, importer, country_of_origin, net_quantity'),
    supabase.from('categories').select('slug'),
  ])
  if (process.env.VERCEL_ENV === 'production' && (productResult.error || categoryResult.error)) {
    throw createError({ statusCode: 503, statusMessage: 'Catalog schema is not ready for production.' })
  }
  const products = productResult.data
  const categories = categoryResult.data

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
    ...((categories ?? []) as SlugRow[]).map((c) => ({ loc: `${base}/category/${encodeURIComponent(c.slug)}`, priority: '0.7', changefreq: 'weekly', lastmod: '' })),
    ...POLICY_SLUGS.map((policySlug) => ({ loc: `${base}/policies/${policySlug}`, priority: '0.3', changefreq: 'yearly', lastmod: '' })),
    ...((products ?? []) as ProductSlugRow[]).filter(isPublishableProduct).map((p) => ({ loc: `${base}/product/${encodeURIComponent(p.slug)}`, priority: '0.8', changefreq: 'weekly', lastmod: p.created_at ? p.created_at.split('T')[0] : '' })),
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${escapeXml(u.lastmod)}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return body
})
