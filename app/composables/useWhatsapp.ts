import type { CartItem, CheckoutDetails } from '~/types'
import { formatPrice } from '~/utils/format'
import { SITE, SHIPPING } from '~/constants/site'

interface OrderSummary {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
}

/** Compute shipping + total from a subtotal. Single source of truth for order math. */
export function computeOrder(items: CartItem[]): OrderSummary {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal === 0 || subtotal >= SHIPPING.freeShippingThreshold ? 0 : SHIPPING.flatRate
  return { items, subtotal, shipping, total: subtotal + shipping }
}

/** Build the human-readable WhatsApp order message. Includes orderRef for cross-referencing. */
export function buildOrderMessage(details: CheckoutDetails, order: OrderSummary, orderRef?: string): string {
  const lines: string[] = []
  lines.push('🛒 *NEW ORDER — BestDeal3z*')
  if (orderRef) lines.push(`*Order Ref: ${orderRef}*`)
  lines.push('')
  lines.push('*Customer*')
  lines.push(`Name: ${details.fullName}`)
  lines.push(`Phone: ${details.phone}`)
  lines.push(`WhatsApp: ${details.whatsapp}`)
  lines.push('')
  lines.push('*Delivery Address*')
  lines.push(details.address)
  lines.push(`${details.city}, ${details.state} - ${details.pincode}`)
  lines.push('')
  lines.push('*Order Items*')
  order.items.forEach((item, idx) => {
    const variant = item.variant
      ? ` (${Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')})`
      : ''
    lines.push(`${idx + 1}. ${item.title}${variant}`)
    lines.push(`   Qty: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`)
  })
  lines.push('')
  lines.push(`Subtotal: ${formatPrice(order.subtotal)}`)
  lines.push(`Shipping: ${order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}`)
  lines.push(`*Total: ${formatPrice(order.total)}*`)
  if (details.notes) {
    lines.push('')
    lines.push(`*Notes*: ${details.notes}`)
  }
  lines.push('')
  lines.push('_Please confirm availability and delivery time. Thank you!_')
  return lines.join('\n')
}

/** Build the full wa.me URL for an order. */
export function buildWhatsappUrl(details: CheckoutDetails, order: OrderSummary, orderRef?: string): string {
  const config = useRuntimeConfig()
  const number = config.public.whatsappNumber || SITE.whatsappNumber
  const message = buildOrderMessage(details, order, orderRef)
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/** A generic "ask about this product" WhatsApp link (used on PDP / contact). */
export function buildEnquiryUrl(text: string): string {
  const config = useRuntimeConfig()
  const number = config.public.whatsappNumber || SITE.whatsappNumber
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}
