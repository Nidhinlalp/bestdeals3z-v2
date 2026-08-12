/**
 * Global, build-time site constants.
 * Anything secret or environment-specific is overridden via runtimeConfig in nuxt.config.ts.
 */
export const SITE = {
  name: 'Cloud Scart',
  tagline: 'Smart Finds. Delivered Fast.',
  description:
    'Cloud Scart — drones, RC machines and smart gadgets with prices shown clearly. Browse online and continue your order on WhatsApp. Cash on delivery is available at eligible pincodes.',
  // Default production URL — override with NUXT_PUBLIC_SITE_URL.
  url: 'https://cloudscart.in',
  // WhatsApp number in international format WITHOUT '+' or spaces. Override with NUXT_PUBLIC_WHATSAPP_NUMBER.
  whatsappNumber: '917994867698',
  // Human-readable phone number for display (tel: links strip the spaces).
  phone: '+91 79948 67698',
  email: 'cloudscartstore@gmail.com',
  locale: 'en_IN',
  currency: 'INR',
  currencySymbol: '₹',
  social: {
    instagram: 'https://www.instagram.com/cloudscartstore/',
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
