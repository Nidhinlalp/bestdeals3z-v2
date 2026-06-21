import { SITE } from '~/constants/site'

/** Format a number as Indian Rupees, e.g. 1499 -> "₹1,499". */
export function formatPrice(value: number): string {
  return `${SITE.currencySymbol}${new Intl.NumberFormat('en-IN').format(Math.round(value))}`
}

/** The price a customer actually pays (sale price when present and lower). */
export function effectivePrice(product: { price: number; salePrice?: number | null }): number {
  if (product.salePrice != null && product.salePrice > 0 && product.salePrice < product.price) {
    return product.salePrice
  }
  return product.price
}

/** Whether the product is discounted. */
export function isOnSale(product: { price: number; salePrice?: number | null }): boolean {
  return product.salePrice != null && product.salePrice > 0 && product.salePrice < product.price
}

/** Discount percentage, rounded — returns 0 when not on sale. */
export function discountPercent(product: { price: number; salePrice?: number | null }): number {
  if (!isOnSale(product)) return 0
  return Math.round(((product.price - (product.salePrice as number)) / product.price) * 100)
}

/** Convert any string into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

/** Truncate text to a length on a word boundary. */
export function truncate(text: string, length = 120): string {
  if (text.length <= length) return text
  return `${text.slice(0, text.lastIndexOf(' ', length))}…`
}
