<script setup lang="ts">
import { SITE, NAV_LINKS } from '~/constants/site'
const { data: categories } = useCategories()
const year = new Date().getFullYear()
const config = useRuntimeConfig()

const legal = computed(() => ({
  sellerName: config.public.sellerLegalName || SITE.name,
  businessAddress: config.public.businessAddress,
  grievanceOfficer: config.public.grievanceOfficerName,
  grievanceEmail: config.public.grievanceEmail || SITE.email,
  grievancePhone: config.public.grievancePhone || SITE.phone,
}))

const columns = computed(() => [
  { title: 'Shop', links: (categories.value ?? []).slice(0, 5).map((c) => ({ label: c.name, to: `/category/${c.slug}` })) },
  { title: 'Company', links: [{ label: 'About Us', to: '/about' }, { label: 'Contact', to: '/contact' }, { label: 'FAQ', to: '/#faq' }] },
  { title: 'Policies', links: [
    { label: 'Shipping Policy', to: '/policies/shipping-policy' },
    { label: 'Return & Refund', to: '/policies/refund-policy' },
    { label: 'Privacy Policy', to: '/policies/privacy-policy' },
    { label: 'Terms of Service', to: '/policies/terms-of-service' },
  ] },
])
</script>

<template>
  <footer class="border-t border-hairline bg-canvas">
    <div class="brand-stripe" />
    <div class="container-cloud py-xxl">
      <div class="grid grid-cols-1 gap-xl md:grid-cols-2 lg:grid-cols-4">
        <!-- Brand -->
        <div class="flex flex-col gap-md">
          <NuxtLink to="/" class="flex items-center gap-3" :aria-label="`${SITE.name} home`">
            <NuxtImg src="/logo.png" :alt="`${SITE.name} logo`" width="48" height="48" class="h-12 w-12 object-contain" />
            <span class="text-title-lg font-bold uppercase text-ink">{{ SITE.name }}</span>
          </NuxtLink>
          <p class="max-w-xs text-body-sm text-body">{{ SITE.tagline }} Explore drones, RC machines and gadgets, then confirm your order on WhatsApp.</p>
          <div class="flex gap-sm">
            <a v-for="(url, name) in SITE.social" :key="name" :href="url" target="_blank" rel="noopener" :aria-label="name" class="flex h-10 w-10 items-center justify-center border border-hairline text-body hover:border-ink hover:text-ink">
              <span class="text-caption uppercase">{{ String(name).slice(0, 2) }}</span>
            </a>
          </div>
        </div>

        <!-- Link columns -->
        <div v-for="col in columns" :key="col.title" class="flex flex-col gap-md">
          <h3 class="text-label-uppercase uppercase text-ink">{{ col.title }}</h3>
          <ul class="flex flex-col gap-sm">
            <li v-for="link in col.links" :key="link.to"><NuxtLink :to="link.to" class="text-body-sm text-body hover:text-ink">{{ link.label }}</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="mt-xxl border-t border-hairline pt-lg text-caption text-muted">
        <p>Sold by {{ legal.sellerName }}<template v-if="legal.businessAddress"> · {{ legal.businessAddress }}</template></p>
        <p class="mt-1">Grievance contact<template v-if="legal.grievanceOfficer">: {{ legal.grievanceOfficer }}</template> · <a :href="`mailto:${legal.grievanceEmail}`" class="hover:text-ink">{{ legal.grievanceEmail }}</a> · <a :href="`tel:${legal.grievancePhone.replace(/\s/g, '')}`" class="hover:text-ink">{{ legal.grievancePhone }}</a></p>
      </div>

      <div class="mt-lg flex flex-col items-start justify-between gap-md border-t border-hairline pt-lg md:flex-row md:items-center">
        <p class="text-caption text-muted">© {{ year }} {{ SITE.name }}. Cloud Scart branding and original site content reserved. Third-party marks belong to their respective owners.</p>
        <nav class="flex flex-wrap gap-md" aria-label="Footer">
          <NuxtLink v-for="l in NAV_LINKS" :key="l.to" :to="l.to" class="text-caption uppercase tracking-wide text-muted hover:text-ink">{{ l.label }}</NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>
