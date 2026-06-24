import { SITE } from './app/constants/site'

const supabaseHostname = (() => {
  try { return new URL(process.env.SUPABASE_URL || '').hostname } catch { return '' }
})()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  // Opt into the Nuxt 4 directory structure (app/ as the source dir).
  future: { compatibilityVersion: 4 },

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
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
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || SITE.url,
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || SITE.whatsappNumber,
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
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
      htmlAttrs: { lang: 'en', class: 'dark' },
      bodyAttrs: { class: 'bg-canvas text-on-dark antialiased' },
      title: SITE.name,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#000000' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },

  content: {
    documentDriven: false,
    markdown: { anchorLinks: false },
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
    prerender: {
      // Only prerender truly static routes. Content pages use ISR below.
      routes: ['/sitemap.xml', '/robots.txt'],
      failOnError: false,
    },
  },

  routeRules: {
    // Content pages — ISR: served from cache, re-generated every 60 s in the background.
    // Changes made in the admin panel go live within ~1 minute without a redeploy.
    '/': { isr: 60 },
    '/shop': { isr: 60 },
    '/categories': { isr: 60 },
    '/category/**': { isr: 60 },
    '/product/**': { isr: 60 },
    '/about': { isr: 3600 },
    '/contact': { isr: 3600 },
    '/track': { isr: 3600 },
    // Policy pages are markdown — only change on redeploy, so prerender them.
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
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
