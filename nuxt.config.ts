import { readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { POLICIES } from './app/constants/policies'
import { SITE } from './app/constants/site'

const supabaseHostname = (() => {
  try { return new URL(process.env.SUPABASE_URL || '').hostname } catch { return '' }
})()

const resolvedSiteUrl = process.env.NUXT_PUBLIC_SITE_URL || SITE.url
const resolvedSellerLegalName = process.env.NUXT_PUBLIC_SELLER_LEGAL_NAME || SITE.sellerLegalName
const resolvedBusinessAddress = process.env.NUXT_PUBLIC_BUSINESS_ADDRESS || SITE.businessAddress
const resolvedGrievanceOfficerName = process.env.NUXT_PUBLIC_GRIEVANCE_OFFICER_NAME || SITE.grievanceOfficerName
const contentRightsConfirmed = process.env.CONTENT_RIGHTS_CONFIRMED
  ? process.env.CONTENT_RIGHTS_CONFIRMED === 'true'
  : SITE.contentRightsConfirmed

// Nitro's dependency tracer can miss libvips because the native Sharp package
// loads it by file-system convention instead of a JavaScript import. Trace its
// exported directory explicitly so production image routes include the binary.
const sharpLibvipsTraceEntries = (() => {
  let packageName = ''
  if (process.platform === 'darwin') {
    packageName = `@img/sharp-libvips-darwin-${process.arch}`
  }
  else if (process.platform === 'linux') {
    packageName = `@img/sharp-libvips-linux-${process.arch}`
  }

  if (!packageName) return []

  try {
    const require = createRequire(import.meta.url)
    const packageRoot = dirname(require.resolve(`${packageName}/package`))
    const libraryDirectory = join(packageRoot, 'lib')
    return readdirSync(libraryDirectory, { withFileTypes: true })
      .filter(entry => entry.isFile())
      .map(entry => join(libraryDirectory, entry.name))
  }
  catch {
    return []
  }
})()

if (process.env.VERCEL_ENV === 'production') {
  const requiredProductionVariables = [
    'SUPABASE_URL',
    'SUPABASE_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NUXT_PUBLIC_WHATSAPP_NUMBER',
  ]
  const missing = requiredProductionVariables.filter((name) => !process.env[name]?.trim())
  if (missing.length) {
    throw new Error(`Missing required production environment variables: ${missing.join(', ')}`)
  }
  if (!contentRightsConfirmed) {
    throw new Error('Set CONTENT_RIGHTS_CONFIRMED=true only after verifying the rights or licences for every published image, logo and piece of copy.')
  }
  const productionSiteUrl = new URL(resolvedSiteUrl)
  const productionSupabaseUrl = new URL(process.env.SUPABASE_URL!)
  if (productionSiteUrl.protocol !== 'https:' || productionSupabaseUrl.protocol !== 'https:') {
    throw new Error('Production site and Supabase URLs must use HTTPS.')
  }
  if (['localhost', '127.0.0.1'].includes(productionSiteUrl.hostname)) {
    throw new Error('NUXT_PUBLIC_SITE_URL must use the public production hostname.')
  }
  if (!/^\d{10,15}$/u.test(process.env.NUXT_PUBLIC_WHATSAPP_NUMBER!)) {
    throw new Error('NUXT_PUBLIC_WHATSAPP_NUMBER must contain 10–15 digits without + or spaces.')
  }
  if (!/\b[1-9][0-9]{5}\b/u.test(resolvedBusinessAddress)) {
    throw new Error('NUXT_PUBLIC_BUSINESS_ADDRESS must include the full Indian address and six-digit pincode.')
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  // Opt into the Nuxt 4 directory structure (app/ as the source dir).
  future: { compatibilityVersion: 4 },

  devtools: { enabled: false },

  modules: [
    '@nuxtjs/supabase',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
  ],

  css: ['~/assets/css/main.css'],

  // Use the file name as the component name regardless of nesting depth.
  components: [{ path: '~/components', pathPrefix: false }],

  // Runtime configuration — private keys server-only, public keys exposed to client.
  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    public: {
      siteUrl: resolvedSiteUrl,
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || SITE.whatsappNumber,
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
      sellerLegalName: resolvedSellerLegalName,
      businessAddress: resolvedBusinessAddress,
      grievanceOfficerName: resolvedGrievanceOfficerName,
      grievanceEmail: process.env.NUXT_PUBLIC_GRIEVANCE_EMAIL || SITE.email,
      grievancePhone: process.env.NUXT_PUBLIC_GRIEVANCE_PHONE || SITE.phone,
    },
  },

  // @nuxtjs/supabase reads SUPABASE_URL and SUPABASE_KEY from env automatically.
  // redirect: false — we manage our own admin redirects via middleware.
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/admin/login',
      callback: '/admin',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      bodyAttrs: { class: 'bg-canvas text-on-dark antialiased' },
      title: SITE.name,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#1677a8' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },

  image: {
    quality: 70,
    format: ['webp'],
    densities: [1, 2],
    domains: supabaseHostname ? [supabaseHostname] : [],
    screens: {
      xs: 320,
      sm: 375,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1440,
    },
  },

  nitro: {
    externals: {
      traceInclude: sharpLibvipsTraceEntries,
    },
    prerender: {
      // Only prerender truly static routes. Catalog pages use ISR below.
      routes: [
        '/sitemap.xml',
        '/robots.txt',
        ...POLICIES.map(policy => `/policies/${policy.slug}`),
      ],
      // Avoid shared console-timing label collisions while Nuxt renders several
      // dynamic policy routes in the same build process.
      concurrency: 1,
      failOnError: true,
    },
  },

  routeRules: {
    // Catalog pages — ISR: served from cache, re-generated every 60 s in the background.
    // Changes made in the admin panel go live within ~1 minute without a redeploy.
    '/': { isr: 60 },
    '/shop': { isr: 60 },
    '/categories': { isr: 60 },
    '/category/**': { isr: 60 },
    '/product/**': { isr: 60 },
    '/about': { isr: 3600 },
    '/contact': { isr: 3600 },
    '/track': { isr: 3600 },
    // Policy pages are build-time content, so prerender them.
    '/policies/**': { prerender: true },
    // Admin is client-only (SPA).
    '/admin/**': { ssr: false },
    // Security headers on all routes.
    '/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; upgrade-insecure-requests",
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
