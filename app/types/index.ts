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

/** Product as stored in Supabase (camelCase). */
export type Product = z.infer<typeof productSchema> & {
  id?: string
  tags?: string[]
  metaTitle?: string | null
  metaDesc?: string | null
}

/** Category as stored in Supabase. `name` maps from DB column `title`. */
export type Category = z.infer<typeof categorySchema> & {
  id?: string
}

/** Banner as stored in Supabase. `buttonText`/`buttonLink` map from DB `cta_label`/`cta_href`. */
export type Banner = z.infer<typeof bannerSchema> & {
  slug: string
  id?: string
  active?: boolean
}

/** A line in the cart. */
export type CartItem = z.infer<typeof cartItemSchema>

/** Validated checkout/customer details. */
export type CheckoutDetails = z.infer<typeof checkoutSchema>

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  orderRef: string
  userId?: string | null
  customerName: string
  customerPhone: string
  customerWhatsapp: string
  address: string
  city: string
  state: string
  pincode: string
  notes: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  status: OrderStatus
  whatsappSent: boolean
  createdAt: string
  updatedAt: string
}

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
