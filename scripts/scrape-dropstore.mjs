/**
 * Scrape the Dropstore (Shopify) catalog and rebuild local content from the
 * REAL products: titles, prices, descriptions and downloaded product images.
 *
 *   node scripts/scrape-dropstore.mjs
 *
 * Images are downloaded into /public/products. Content markdown is rewritten in
 * /content/{products,categories,banners}. Re-runnable and idempotent.
 */
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { dirname, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const p = (...s) => resolve(ROOT, ...s)
const SOURCE = 'https://dropstore.co.in/products.json?limit=250'

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const slugify = (s) =>
  s.toLowerCase().normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

// Strip emoji / pictographs but keep ™, ®, normal punctuation.
const cleanTitle = (s) =>
  s.replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '')
    .replace(/\s{2,}/g, ' ').trim()

function htmlToText(html = '') {
  return html
    .replace(/<\s*li[^>]*>/gi, '\n- ')
    .replace(/<\s*(p|div|h[1-6]|ul|ol|table|tr)[^>]*>/gi, '\n')
    .replace(/<\s*\/(p|div|h[1-6]|li|tr|strong|b|em|span)\s*>/gi, '\n')
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&hellip;/g, '…').replace(/&#?\w+;/g, ' ')
    .replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '')
    .replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n')
    .replace(/ +([.,!?;:])/g, '$1').trim()
}

function shortFrom(text, title) {
  const flat = text.replace(/\n+/g, ' ').replace(/^[-\s]+/, '').replace(/\s+/g, ' ').trim()
  if (!flat) return `${title} — available now at the best price, with cash on delivery across India.`
  if (flat.length <= 155) return flat
  const cut = flat.slice(0, 155)
  const sentenceEnd = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '))
  if (sentenceEnd > 70) return cut.slice(0, sentenceEnd + 1).trim()
  return `${cut.slice(0, cut.lastIndexOf(' ')).trim()}…`
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`${res.status} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, buf)
  return buf.length
}

const yamlList = (arr) => arr.map((x) => `  - ${JSON.stringify(x)}`).join('\n')

/* ------------------------------------------------------------------ *
 * Category assignment + presentation metadata, keyed by product handle.
 * ------------------------------------------------------------------ */

const CATEGORIES = [
  { name: 'Camera Drones', slug: 'drones', description: 'Foldable 4K camera drones with one-key control, LED lights and long flight times.' },
  { name: 'RC Cars', slug: 'rc-cars', description: 'High-speed off-road racers and collectible die-cast machines built to take a beating.' },
  { name: 'RC Planes', slug: 'rc-planes', description: 'Remote-controlled jet fighters engineered for stable, beginner-friendly flight.' },
  { name: 'Blasters', slug: 'blasters', description: 'Gel, foam and water blasters with RGB lights and smoke for backyard battles.' },
  { name: 'Gadgets', slug: 'gadgets', description: 'Pocket cinema projectors and lifestyle gadgets at unbeatable deal prices.' },
]

// handle keyword → category slug + merchandising flags + synthetic ratings.
const RULES = [
  { match: /e88|camera-drone/, cat: 'drones', flags: ['featured', 'bestSeller'], rating: 4.7, reviews: 214 },
  { match: /y-series|360-flip/, cat: 'drones', flags: ['bestSeller', 'trending'], rating: 4.5, reviews: 138 },
  { match: /off-road|4wd|racing-car/, cat: 'rc-cars', flags: ['featured', 'trending'], rating: 4.6, reviews: 176 },
  { match: /defender|die-cast/, cat: 'rc-cars', flags: ['trending'], rating: 4.4, reviews: 92 },
  { match: /rc-plane|aeroplane|jet-fighter/, cat: 'rc-planes', flags: ['featured', 'bestSeller'], rating: 4.5, reviews: 121 },
  { match: /m416|gel-blaster/, cat: 'blasters', flags: ['bestSeller'], rating: 4.3, reviews: 87 },
  { match: /ak47|ak-47|suppressor/, cat: 'blasters', flags: ['trending'], rating: 4.4, reviews: 103 },
  { match: /water-gun|vectorstorm|water-blaster/, cat: 'blasters', flags: ['trending'], rating: 4.2, reviews: 64 },
  { match: /projector|cinema/, cat: 'gadgets', flags: ['featured', 'trending'], rating: 4.6, reviews: 152 },
]

function rulesFor(handle, slug) {
  const key = `${handle} ${slug}`
  return RULES.find((r) => r.match.test(key)) ?? { cat: 'gadgets', flags: [], rating: 4.3, reviews: 50 }
}

/* ------------------------------------------------------------------ *
 * Markdown writers
 * ------------------------------------------------------------------ */

function productMarkdown(prod, images) {
  const f = new Set(prod.flags)
  const variantsYaml = prod.variants.length
    ? `variants:\n${prod.variants.map((v) => `  - name: ${JSON.stringify(v.name)}\n    options:\n${v.options.map((o) => `      - ${JSON.stringify(o)}`).join('\n')}`).join('\n')}`
    : 'variants: []'

  const body = [
    `## About the ${prod.title}`,
    '',
    prod.bodyText || prod.shortDescription,
    '',
    '> Ships across India with free delivery over ₹999 and cash on delivery available. Order in seconds — checkout happens on WhatsApp.',
  ].join('\n')

  return `---
title: ${JSON.stringify(prod.title)}
slug: ${JSON.stringify(prod.slug)}
category: ${JSON.stringify(prod.category)}
shortDescription: ${JSON.stringify(prod.shortDescription)}
description: ${JSON.stringify(prod.shortDescription)}
price: ${prod.price}
salePrice: ${prod.salePrice === null ? 'null' : prod.salePrice}
stock: ${prod.stock}
featured: ${f.has('featured')}
bestSeller: ${f.has('bestSeller')}
trending: ${f.has('trending')}
rating: ${prod.rating}
reviewCount: ${prod.reviews}
images:
${yamlList(images)}
${variantsYaml}
createdAt: ${JSON.stringify(prod.createdAt)}
---

${body}
`
}

const categoryMarkdown = (c, order, image) => `---
name: ${JSON.stringify(c.name)}
slug: ${JSON.stringify(c.slug)}
image: ${JSON.stringify(image)}
description: ${JSON.stringify(c.description)}
order: ${order}
---
`

const bannerMarkdown = (b, order) => `---
title: ${JSON.stringify(b.title)}
subtitle: ${JSON.stringify(b.subtitle)}
image: ${JSON.stringify(b.image)}
buttonText: ${JSON.stringify(b.buttonText)}
buttonLink: ${JSON.stringify(b.buttonLink)}
order: ${order}
---
`

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

async function run() {
  console.info('Fetching Dropstore catalog…')
  const res = await fetch(SOURCE, { headers: { 'user-agent': 'Mozilla/5.0' } })
  const { products: raw } = await res.json()
  if (!raw?.length) throw new Error('No products returned')

  // Clean generated dirs.
  for (const d of ['content/products', 'content/categories', 'content/banners', 'public/products', 'public/categories', 'public/banners']) {
    await rm(p(d), { recursive: true, force: true })
    await mkdir(p(d), { recursive: true })
  }

  const baseDate = new Date('2026-02-01T10:00:00.000Z').getTime()
  const catFirstImage = {}
  const built = []
  let imageCount = 0

  for (let i = 0; i < raw.length; i++) {
    const src = raw[i]
    const title = cleanTitle(src.title)
    const slug = slugify(title)
    const meta = rulesFor(src.handle, slug)
    const variant = src.variants?.[0] ?? {}
    const compare = variant.compare_at_price ? Number(variant.compare_at_price) : null
    const current = Number(variant.price ?? 0)
    // Shopify: price = current (sale), compare_at_price = original (higher).
    const price = compare && compare > current ? compare : current
    const salePrice = compare && compare > current ? current : null

    const bodyText = htmlToText(src.body_html)
    const shortDescription = shortFrom(bodyText, title)

    // Download images.
    const images = []
    const srcImages = (src.images ?? []).slice(0, 8)
    for (let j = 0; j < srcImages.length; j++) {
      const url = srcImages[j].src.split('?')[0]
      let ext = extname(url).toLowerCase()
      if (!/\.(jpe?g|png|webp|avif|gif)$/.test(ext)) ext = '.webp'
      const rel = `/products/${slug}-${j + 1}${ext}`
      try {
        await download(url, p('public' + rel))
        images.push(rel)
        imageCount++
      } catch (e) {
        console.warn(`  ! image failed (${slug} #${j + 1}): ${e.message}`)
      }
    }
    if (!images.length) { console.warn(`  ! skipping ${slug} (no images)`); continue }

    if (!catFirstImage[meta.cat]) catFirstImage[meta.cat] = images[0]

    // Map Shopify product options to our variant shape (skip the default "Title").
    const variants = (src.options ?? [])
      .filter((o) => o.name && o.name.toLowerCase() !== 'title' && (o.values?.length ?? 0) > 1)
      .map((o) => ({ name: o.name, options: o.values }))

    const prod = {
      title, slug, category: meta.cat, shortDescription, bodyText, image: images[0],
      price, salePrice, stock: 25 + ((i * 7) % 60),
      flags: meta.flags, rating: meta.rating, reviews: meta.reviews,
      variants, createdAt: new Date(baseDate + i * 36e5 * 18).toISOString(),
    }
    built.push(prod)
    await writeFile(p('content/products', `${slug}.md`), productMarkdown(prod, images), 'utf8')
    console.info(`  ✓ ${title} (${images.length} images)`)
  }

  // Categories — only those with at least one product, using a real product photo as the cover.
  let order = 0
  for (const c of CATEGORIES) {
    if (!catFirstImage[c.slug]) continue
    await writeFile(p('content/categories', `${c.slug}.md`), categoryMarkdown(c, order++, catFirstImage[c.slug]), 'utf8')
  }

  // Banners — hero shots from the strongest real products.
  const pick = (s) => built.find((b) => b.slug.includes(s))
  const drone = pick('e88') || built[0]
  const car = pick('off-road') || pick('4wd') || built[0]
  const projector = pick('projector') || built[0]
  const blaster = pick('ak47') || pick('m416') || built[0]
  const banners = [
    { title: 'THE ULTIMATE FLYING MACHINE', subtitle: `${drone.title} — now on offer with free shipping & cash on delivery.`, image: drone.image, buttonText: 'Shop Drones', buttonLink: '/category/drones' },
    { title: 'BUILT FOR THE DIRT', subtitle: 'High-speed 4WD off-road racers engineered to take a beating.', image: car.image, buttonText: 'Shop RC Cars', buttonLink: '/category/rc-cars' },
    { title: 'CINEMA ANYWHERE', subtitle: 'Pocket projectors that turn any wall into a big screen.', image: projector.image, buttonText: 'Shop Gadgets', buttonLink: '/category/gadgets' },
    { title: 'GEAR UP FOR BATTLE', subtitle: 'RGB gel, foam and water blasters with smoke effects.', image: blaster.image, buttonText: 'Shop Blasters', buttonLink: '/category/blasters' },
    { title: 'DEALS THAT MOVE FAST', subtitle: 'Up to 40% off across drones, RC machines and gadgets. While stocks last.', image: drone.image, buttonText: 'Shop All Deals', buttonLink: '/shop' },
  ]
  for (let i = 0; i < banners.length; i++) {
    await writeFile(p('content/banners', `banner-${i + 1}.md`), bannerMarkdown(banners[i], i), 'utf8')
  }

  console.info(`\nDone. ${built.length} products, ${order} categories, ${banners.length} banners, ${imageCount} images downloaded.`)
}

run().catch((err) => { console.error(err); process.exit(1) })
