import type { z } from 'zod'
import type {
  productSchema,
  categorySchema,
  bannerSchema,
  variantSchema,
  checkoutSchema,
  cartItemSchema,
} from '~/utils/schemas'

/** A selectable product option (e.g. colour / size). */
export type ProductVariant = z.infer<typeof variantSchema>

/** Product as authored in content/products/*.md (front-matter). */
export type Product = z.infer<typeof productSchema> & {
  /** Nuxt Content injects these at query time. */
  _path?: string
  body?: unknown
}

export type Category = z.infer<typeof categorySchema> & { _path?: string }

export type Banner = z.infer<typeof bannerSchema> & { _path?: string }

/** A line in the cart. */
export type CartItem = z.infer<typeof cartItemSchema>

/** Validated checkout/customer details. */
export type CheckoutDetails = z.infer<typeof checkoutSchema>

export interface Review {
  id: string
  name: string
  location: string
  rating: number
  title: string
  body: string
  date: string
  product?: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'

export interface ShopFilters {
  search: string
  category: string
  minPrice: number | null
  maxPrice: number | null
  sort: SortOption
  page: number
}
