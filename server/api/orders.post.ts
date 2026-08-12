import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { z } from 'zod'
import { checkoutSchema } from '~/utils/schemas'
import { SHIPPING } from '~/constants/site'

const orderRequestSchema = z.object({
  details: checkoutSchema,
  items: z.array(z.object({
    slug: z.string().trim().min(1).max(160),
    quantity: z.number().int().min(1).max(99),
    variant: z.record(z.string().trim().max(100)).optional(),
  })).min(1).max(20),
  website: z.string().max(0).optional(),
})

interface ProductRow {
  slug: string
  title: string
  images: string[] | null
  stock: number
  price: number | string
  sale_price: number | string | null
  variants: Array<{ name: string; options: string[] }> | null
  manufacturer: string
  importer: string
  country_of_origin: string
  net_quantity: string
}

const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 10
const WINDOW_MS = 10 * 60 * 1000

function enforceRateLimit(event: H3Event) {
  const forwarded = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
  const ip = forwarded || getRequestHeader(event, 'x-real-ip') || 'unknown'
  const now = Date.now()
  const record = attempts.get(ip)

  if (!record || record.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return
  }

  if (record.count >= MAX_ATTEMPTS) {
    setResponseHeader(event, 'Retry-After', Math.ceil((record.resetAt - now) / 1000))
    throw createError({ statusCode: 429, statusMessage: 'Too many order attempts. Please try again shortly.' })
  }

  record.count += 1
}

function currentPrice(product: ProductRow): number {
  const price = Number(product.price)
  const salePrice = product.sale_price == null ? null : Number(product.sale_price)
  return salePrice != null && salePrice > 0 && salePrice < price ? salePrice : price
}

function makeOrderRef(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `CS-${date}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

export default defineEventHandler(async (event) => {
  if (!getRequestHeader(event, 'content-type')?.toLocaleLowerCase('en-US').includes('application/json')) {
    throw createError({ statusCode: 415, statusMessage: 'Order requests must use application/json.' })
  }

  const contentLength = Number(getRequestHeader(event, 'content-length') || 0)
  if (contentLength > 32_768) {
    throw createError({ statusCode: 413, statusMessage: 'Order request is too large.' })
  }

  enforceRateLimit(event)

  const rawBody = await readRawBody(event)
  if (!rawBody || new TextEncoder().encode(rawBody).byteLength > 32_768) {
    throw createError({ statusCode: rawBody ? 413 : 400, statusMessage: rawBody ? 'Order request is too large.' : 'Order details are required.' })
  }

  let requestBody: unknown
  try {
    requestBody = JSON.parse(rawBody)
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'Order request must be valid JSON.' })
  }

  const parsed = orderRequestSchema.safeParse(requestBody)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Invalid order details.' })
  }

  const config = useRuntimeConfig(event)
  if (!config.public.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({ statusCode: 503, statusMessage: 'Order service is not configured.' })
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const slugs = [...new Set(parsed.data.items.map((item) => item.slug))]
  const { data, error: productError } = await supabase
    .from('products')
    .select('slug,title,images,stock,price,sale_price,variants,manufacturer,importer,country_of_origin,net_quantity')
    .in('slug', slugs)

  if (productError) {
    throw createError({ statusCode: 503, statusMessage: 'Unable to verify the catalog right now.' })
  }

  const products = new Map(((data ?? []) as ProductRow[]).map((product) => [product.slug, product]))
  const quantities = new Map<string, number>()
  const trustedItems = parsed.data.items.map((item) => {
    const product = products.get(item.slug)
    if (!product) {
      throw createError({ statusCode: 409, statusMessage: `A product in your cart is no longer available: ${item.slug}` })
    }
    if (!product.manufacturer.trim() || !product.country_of_origin.trim() || !product.net_quantity.trim()) {
      throw createError({ statusCode: 409, statusMessage: `${product.title} is missing mandatory product information and cannot be ordered online yet.` })
    }
    if (product.country_of_origin.toLocaleLowerCase('en-IN') !== 'india' && !product.importer.trim()) {
      throw createError({ statusCode: 409, statusMessage: `${product.title} is missing importer information and cannot be ordered online yet.` })
    }

    const totalRequested = (quantities.get(item.slug) ?? 0) + item.quantity
    quantities.set(item.slug, totalRequested)
    if (product.stock < totalRequested) {
      throw createError({ statusCode: 409, statusMessage: `${product.title} does not have enough stock.` })
    }

    for (const definition of product.variants ?? []) {
      const selected = item.variant?.[definition.name]
      if (!selected || !definition.options.includes(selected)) {
        throw createError({ statusCode: 409, statusMessage: `Please select a valid ${definition.name} for ${product.title}.` })
      }
    }

    return {
      slug: product.slug,
      title: product.title,
      image: product.images?.[0] ?? '',
      price: currentPrice(product),
      quantity: item.quantity,
      variant: item.variant,
      maxStock: product.stock,
    }
  })

  const subtotal = trustedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= SHIPPING.freeShippingThreshold ? 0 : SHIPPING.flatRate
  const total = subtotal + shipping
  const orderRef = makeOrderRef()
  const details = parsed.data.details

  const { error: insertError } = await supabase.from('orders').insert({
    order_ref: orderRef,
    user_id: null,
    customer_name: details.fullName,
    customer_phone: details.phone,
    customer_whatsapp: details.whatsapp,
    address: details.address,
    city: details.city,
    state: details.state,
    pincode: details.pincode,
    notes: details.notes ?? '',
    payment_method: details.paymentMethod,
    items: trustedItems,
    subtotal,
    shipping,
    total,
    status: 'pending',
    // The API cannot know whether the customer pressed Send in WhatsApp.
    whatsapp_sent: false,
    policy_version: '2026-08-12',
    privacy_accepted_at: new Date().toISOString(),
  })

  if (insertError) {
    throw createError({ statusCode: 503, statusMessage: 'Unable to save the order right now.' })
  }

  setResponseStatus(event, 201)
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return { orderRef, order: { items: trustedItems, subtotal, shipping, total } }
})
