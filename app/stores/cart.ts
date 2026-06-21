import { defineStore } from 'pinia'
import type { CartItem, Product } from '~/types'
import { effectivePrice } from '~/utils/format'

interface CartState {
  items: CartItem[]
}

/** A stable key for a product + chosen variant combination. */
function lineKey(slug: string, variant?: Record<string, string>): string {
  if (!variant || Object.keys(variant).length === 0) return slug
  const v = Object.keys(variant)
    .sort()
    .map((k) => `${k}:${variant[k]}`)
    .join('|')
  return `${slug}__${v}`
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({ items: [] }),

  getters: {
    count: (state): number => state.items.reduce((n, i) => n + i.quantity, 0),
    isEmpty: (state): boolean => state.items.length === 0,
    subtotal: (state): number => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    keys: (state): string[] => state.items.map((i) => lineKey(i.slug, i.variant)),
  },

  actions: {
    /** Add a product to the cart (or bump quantity if the same line exists). */
    add(product: Product, quantity = 1, variant?: Record<string, string>) {
      const key = lineKey(product.slug, variant)
      const existing = this.items.find((i) => lineKey(i.slug, i.variant) === key)
      const price = effectivePrice(product)

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock || 99)
        return
      }

      this.items.push({
        slug: product.slug,
        title: product.title,
        image: product.images[0] ?? '',
        price,
        quantity: Math.min(quantity, product.stock || 99),
        variant: variant && Object.keys(variant).length ? variant : undefined,
        maxStock: product.stock || 99,
      })
    },

    setQuantity(key: string, quantity: number) {
      const item = this.items.find((i) => lineKey(i.slug, i.variant) === key)
      if (!item) return
      const clamped = Math.max(1, Math.min(quantity, item.maxStock || 99))
      item.quantity = clamped
    },

    increment(key: string) {
      const item = this.items.find((i) => lineKey(i.slug, i.variant) === key)
      if (item) this.setQuantity(key, item.quantity + 1)
    },

    decrement(key: string) {
      const item = this.items.find((i) => lineKey(i.slug, i.variant) === key)
      if (item) {
        if (item.quantity <= 1) this.remove(key)
        else this.setQuantity(key, item.quantity - 1)
      }
    },

    remove(key: string) {
      this.items = this.items.filter((i) => lineKey(i.slug, i.variant) !== key)
    },

    clear() {
      this.items = []
    },

    keyOf(item: CartItem): string {
      return lineKey(item.slug, item.variant)
    },
  },

  // Survives refresh via @pinia-plugin-persistedstate.
  // Defaults to localStorage on the client and is skipped during SSR.
  persist: {
    key: 'bestdeal3z-cart',
  },
})
