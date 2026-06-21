/**
 * Global, build-time site constants.
 * Anything secret or environment-specific is overridden via runtimeConfig in nuxt.config.ts.
 */
export const SITE = {
  name: 'BestDeal3z',
  tagline: 'Engineered Deals. Delivered Fast.',
  description:
    'BestDeal3z — drones, RC machines and performance gadgets at the best prices in India. Order in seconds, checkout on WhatsApp. Cash on delivery available.',
  // Default production URL — override with NUXT_PUBLIC_SITE_URL.
  url: 'https://bestdeal3z.vercel.app',
  // WhatsApp number in international format WITHOUT '+' or spaces. Override with NUXT_PUBLIC_WHATSAPP_NUMBER.
  whatsappNumber: '917994867698',
  // Human-readable phone number for display (tel: links strip the spaces).
  phone: '+91 79948 67698',
  email: 'bestdeal3zinfo@gmail.com',
  locale: 'en_IN',
  currency: 'INR',
  currencySymbol: '₹',
  social: {
    instagram: 'https://www.instagram.com/bestdeal3z/',
  },
} as const

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'Contact', to: '/contact' },
] as const

export const SHIPPING = {
  freeShippingThreshold: 999,
  flatRate: 49,
} as const
