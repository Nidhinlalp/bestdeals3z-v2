import { z } from 'zod'

/**
 * Single source of truth for content + form validation.
 * Used by the admin CMS, catalog mapping and checkout form.
 */

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u, 'Use lowercase letters, numbers and single hyphens only')

const imageSourceSchema = z.string().trim().refine((value) => {
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try { return new URL(value).protocol === 'https:' } catch { return false }
}, 'Use a local /path or a secure https:// image URL')

const internalLinkSchema = z
  .string()
  .trim()
  .regex(/^\/(?!\/)[^\s]*$/u, 'Button link must be an internal path beginning with /')

export const variantSchema = z.object({
  name: z.string().min(1),
  options: z.array(z.string().min(1)).min(1),
})

export const productSchema = z.object({
  title: z.string().min(2),
  slug: slugSchema,
  description: z.string().default(''),
  shortDescription: z.string().default(''),
  category: z.string().min(1),
  brand: z.string().trim().default(''),
  manufacturer: z.string().trim().min(2, 'Manufacturer name and address are required'),
  importer: z.string().trim().default(''),
  countryOfOrigin: z.string().trim().min(2, 'Country of origin is required'),
  netQuantity: z.string().trim().min(1, 'Net quantity is required'),
  warrantyInfo: z.string().trim().default(''),
  safetyInformation: z.string().trim().default(''),
  price: z.number().positive('Price must be greater than zero'),
  salePrice: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  trending: z.boolean().default(false),
  images: z.array(imageSourceSchema).min(1),
  variants: z.array(variantSchema).default([]),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().nonnegative().default(0),
  createdAt: z.string(),
}).superRefine((product, context) => {
  if (product.countryOfOrigin.toLocaleLowerCase('en-IN') !== 'india' && !product.importer) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['importer'],
      message: 'Importer name and address are required for products not made in India',
    })
  }
})

export const categorySchema = z.object({
  name: z.string().min(1),
  slug: slugSchema,
  image: imageSourceSchema,
  description: z.string().default(''),
  order: z.number().int().default(0),
})

export const bannerSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  subtitle: z.string().default(''),
  image: imageSourceSchema,
  buttonText: z.string().default('Shop Now'),
  buttonLink: internalLinkSchema.default('/shop'),
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
