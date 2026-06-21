import { z } from 'zod'
import type { ContentType } from './content'

/**
 * Server-side validation contract for admin writes.
 * Mirrors app/utils/schemas.ts but lives in the server bundle to stay isolated.
 */

const variant = z.object({ name: z.string().min(1), options: z.array(z.string().min(1)).min(1) })

const product = z.object({
  title: z.string().min(2),
  slug: z.string().min(1),
  category: z.string().min(1),
  shortDescription: z.string().default(''),
  description: z.string().default(''),
  price: z.number().nonnegative(),
  salePrice: z.number().nonnegative().nullable().default(null),
  stock: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  trending: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().nonnegative().default(0),
  images: z.array(z.string().min(1)).min(1),
  variants: z.array(variant).default([]),
  createdAt: z.string().default(() => new Date().toISOString()),
})

const category = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().min(1),
  description: z.string().default(''),
  order: z.number().int().default(0),
})

const banner = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  subtitle: z.string().default(''),
  image: z.string().min(1),
  buttonText: z.string().default('Shop Now'),
  buttonLink: z.string().default('/shop'),
  order: z.number().int().default(0),
})

const schemas = { products: product, categories: category, banners: banner } as const

/** Validate + normalise an incoming admin payload. Returns the slug, body and clean front-matter data. */
export function validateDoc(type: ContentType, payload: Record<string, unknown>) {
  const body = typeof payload.body === 'string' ? payload.body : ''
  const parsed = schemas[type].parse(payload)
  // `body` is markdown content, not front-matter — keep it separate.
  const { ...data } = parsed as Record<string, unknown>
  return { slug: String((parsed as { slug: string }).slug), data, body }
}
