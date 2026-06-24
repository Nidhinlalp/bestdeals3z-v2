import { z } from 'zod'

/**
 * Single source of truth for content + form validation.
 * Used by Nuxt Content authoring, the admin CMS, and the checkout form.
 */

export const variantSchema = z.object({
  name: z.string().min(1),
  options: z.array(z.string().min(1)).min(1),
})

export const productSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(1),
  description: z.string().default(''),
  shortDescription: z.string().default(''),
  category: z.string().min(1),
  price: z.number().nonnegative(),
  salePrice: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  trending: z.boolean().default(false),
  images: z.array(z.string()).min(1),
  variants: z.array(variantSchema).default([]),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().nonnegative().default(0),
  createdAt: z.string(),
})

export const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().min(1),
  description: z.string().default(''),
  order: z.number().int().default(0),
})

export const bannerSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().default(''),
  image: z.string().min(1),
  buttonText: z.string().default('Shop Now'),
  buttonLink: z.string().default('/shop'),
  order: z.number().int().default(0),
})

export const cartItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  image: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  variant: z.record(z.string()).optional(),
  maxStock: z.number().int().nonnegative(),
})

/** Indian phone: 10 digits, optionally prefixed with +91 / 91 / 0. */
const indianPhone = z
  .string()
  .trim()
  .regex(/^(?:\+?91|0)?[6-9]\d{9}$/u, 'Enter a valid 10-digit Indian mobile number')

const indianPincode = z
  .string()
  .trim()
  .regex(/^[1-9][0-9]{5}$/u, 'Enter a valid 6-digit pincode')

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name'),
  phone: indianPhone,
  whatsapp: indianPhone,
  address: z.string().trim().min(8, 'Please enter your full address'),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  pincode: indianPincode,
  paymentMethod: z.enum(['cod', 'prepaid'], { required_error: 'Please select a payment method' }),
  notes: z.string().trim().max(500).optional().default(''),
})

/** Admin form schemas reuse the content schemas but accept comma/array image input. */
export const adminProductSchema = productSchema
export const adminCategorySchema = categorySchema
export const adminBannerSchema = bannerSchema
