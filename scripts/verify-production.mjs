import { existsSync } from 'node:fs'
import process from 'node:process'

if (existsSync('.env') && typeof process.loadEnvFile === 'function') process.loadEnvFile('.env')

const failures = []
const passes = []

function pass(message) { passes.push(message) }
function fail(message) { failures.push(message) }

const required = [
  'SUPABASE_URL',
  'SUPABASE_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NUXT_PUBLIC_SITE_URL',
  'NUXT_PUBLIC_WHATSAPP_NUMBER',
  'NUXT_PUBLIC_SELLER_LEGAL_NAME',
  'NUXT_PUBLIC_BUSINESS_ADDRESS',
  'NUXT_PUBLIC_GRIEVANCE_OFFICER_NAME',
]

for (const name of required) {
  if (!process.env[name]?.trim()) fail(`Missing environment variable: ${name}`)
}

if (process.env.CONTENT_RIGHTS_CONFIRMED !== 'true') {
  fail('CONTENT_RIGHTS_CONFIRMED must be true after every published image and piece of copy has been rights-checked')
}
else pass('Content-rights review is explicitly confirmed')

let siteUrl
let supabaseUrl
try {
  siteUrl = new URL(process.env.NUXT_PUBLIC_SITE_URL || '')
  if (siteUrl.protocol !== 'https:') fail('NUXT_PUBLIC_SITE_URL must use HTTPS')
  else if (siteUrl.hostname === 'localhost' || siteUrl.hostname === '127.0.0.1') fail('NUXT_PUBLIC_SITE_URL must use the public production hostname')
  else pass('Production site URL uses HTTPS')
}
catch {
  fail('NUXT_PUBLIC_SITE_URL is not a valid URL')
}

try {
  supabaseUrl = new URL(process.env.SUPABASE_URL || '')
  if (supabaseUrl.protocol !== 'https:') fail('SUPABASE_URL must use HTTPS')
}
catch {
  fail('SUPABASE_URL is not a valid URL')
}

if (!/^\d{10,15}$/u.test(process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '')) {
  fail('NUXT_PUBLIC_WHATSAPP_NUMBER must contain 10–15 digits without + or spaces')
}
else pass('WhatsApp number format is valid')

if (process.env.NUXT_PUBLIC_BUSINESS_ADDRESS && !/\b[1-9][0-9]{5}\b/u.test(process.env.NUXT_PUBLIC_BUSINESS_ADDRESS)) {
  fail('NUXT_PUBLIC_BUSINESS_ADDRESS must include a six-digit Indian pincode')
}

if (process.env.SUPABASE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY === process.env.SUPABASE_KEY) {
  fail('SUPABASE_SERVICE_ROLE_KEY must not be the anonymous/public key')
}

const placeholderPattern = /\b(?:dummy|lorem|sample|test|tteinging|suiii|hii)\b/iu
const unsubstantiatedPattern = /\b(?:unbeatable|guaranteed cheapest|lowest price)\b/iu

async function table(name, select) {
  if (!supabaseUrl || !process.env.SUPABASE_KEY) return null
  const url = new URL(`/rest/v1/${name}`, supabaseUrl)
  url.searchParams.set('select', select)
  url.searchParams.set('limit', '1000')
  const response = await fetch(url, { headers: { apikey: process.env.SUPABASE_KEY } })
  const payload = await response.json()
  if (!response.ok) {
    fail(`${name} query failed; apply all migrations (${payload.message || response.status})`)
    return null
  }
  return payload
}

async function imageIsReachable(source) {
  try {
    const url = new URL(source, siteUrl)
    if (url.protocol !== 'https:' && url.origin !== siteUrl?.origin) return false
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    if (response.status === 405) response = await fetch(url, { headers: { Range: 'bytes=0-0' }, redirect: 'follow' })
    return response.ok
  }
  catch {
    return false
  }
}

if (supabaseUrl && process.env.SUPABASE_KEY) {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const serviceCheckUrl = new URL('/rest/v1/orders?select=id&limit=1', supabaseUrl)
    const serviceCheck = await fetch(serviceCheckUrl, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    })
    if (serviceCheck.ok) pass('Supabase service-role credential is valid')
    else fail(`Supabase service-role credential failed with HTTP ${serviceCheck.status}`)
  }

  const [productRows, categoryRows, bannerRows, orderRows] = await Promise.all([
    table('products', 'slug,title,short_description,description,price,sale_price,stock,images,manufacturer,importer,country_of_origin,net_quantity,warranty_info,safety_information'),
    table('categories', 'slug,title,description,image'),
    table('banners', 'slug,title,subtitle,image,cta_label,cta_href,active'),
    table('orders', 'id'),
  ])
  const products = productRows ?? []
  const categories = categoryRows ?? []
  const banners = bannerRows ?? []
  const visibleOrders = orderRows ?? []

  if (orderRows) {
    if (visibleOrders.length) fail('Anonymous clients can read order records; apply 002_production_hardening.sql immediately')
    else pass('Anonymous clients cannot read order records')
  }

  const productFailureCount = failures.length
  if (productRows && !products.length) fail('No products are published')
  for (const product of products) {
    const label = product.title || product.slug || 'unnamed product'
    const searchable = `${product.slug} ${product.title} ${product.short_description} ${product.description}`
    if (placeholderPattern.test(searchable)) fail(`Placeholder/test product content: ${label}`)
    if (!(Number(product.price) > 0)) fail(`Price must be greater than zero: ${label}`)
    if (!product.manufacturer?.trim()) fail(`Missing manufacturer name/address: ${label}`)
    if (!product.country_of_origin?.trim()) fail(`Missing country of origin: ${label}`)
    if (!product.net_quantity?.trim()) fail(`Missing net quantity: ${label}`)
    if (product.country_of_origin?.trim().toLocaleLowerCase('en-IN') !== 'india' && !product.importer?.trim()) fail(`Missing importer name/address for imported product: ${label}`)
    if (!Array.isArray(product.images) || !product.images.length) fail(`Missing product image: ${label}`)
    for (const source of product.images || []) {
      if (!await imageIsReachable(source)) fail(`Unreachable product image: ${label}`)
    }
  }
  if (products.length && failures.length === productFailureCount) pass(`${products.length} product listing(s) passed required-field checks`)

  if (categoryRows && !categories.length) fail('No categories are published')
  for (const category of categories) {
    const searchable = `${category.slug} ${category.title} ${category.description}`
    if (placeholderPattern.test(searchable)) fail(`Placeholder/test category content: ${category.title || category.slug}`)
    if (unsubstantiatedPattern.test(searchable)) fail(`Unsubstantiated category claim: ${category.title || category.slug}`)
    if (!await imageIsReachable(category.image)) fail(`Unreachable category image: ${category.title || category.slug}`)
  }

  const activeBanners = banners.filter((banner) => banner.active)
  if (bannerRows && !activeBanners.length) fail('No active homepage banners are published')
  const maxDiscount = products.reduce((maximum, product) => {
    const price = Number(product.price)
    const salePrice = Number(product.sale_price)
    const discount = price > 0 && salePrice > 0 && salePrice < price ? Math.round((price - salePrice) / price * 100) : 0
    return Math.max(maximum, discount)
  }, 0)
  for (const banner of activeBanners) {
    const searchable = `${banner.slug} ${banner.title} ${banner.subtitle}`
    if (placeholderPattern.test(searchable)) fail(`Placeholder/test banner content: ${banner.title || banner.slug}`)
    const discountClaim = searchable.match(/up to\s+(\d+)%\s+off/iu)
    if (discountClaim && Number(discountClaim[1]) > maxDiscount) fail(`Unsubstantiated discount banner: ${banner.title}`)
    if (!/^\/(?!\/)[^\s]*$/u.test(banner.cta_href || '')) fail(`Invalid banner link: ${banner.title}`)
    if (!await imageIsReachable(banner.image)) fail(`Unreachable banner image: ${banner.title || banner.slug}`)
  }
}

if (process.env.VERIFY_LIVE_SITE === '1' && siteUrl) {
  const routes = ['/', '/shop', '/categories', '/contact', '/policies/shipping-policy', '/policies/refund-policy', '/policies/privacy-policy', '/policies/terms-of-service', '/robots.txt', '/sitemap.xml']
  for (const route of routes) {
    const response = await fetch(new URL(route, siteUrl), { redirect: 'follow' })
    if (!response.ok) fail(`Live route returned ${response.status}: ${route}`)
  }
  if (!failures.some((message) => message.startsWith('Live route'))) pass('All required live routes responded successfully')
}

for (const message of passes) console.log(`PASS  ${message}`)
for (const message of failures) console.error(`FAIL  ${message}`)

if (failures.length) {
  console.error(`\nProduction verification failed with ${failures.length} blocking issue(s).`)
  process.exit(1)
}

console.log('\nProduction verification passed with 0 blocking issues.')
