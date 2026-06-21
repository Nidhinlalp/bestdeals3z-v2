<script setup lang="ts">
import { SITE } from '~/constants/site'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl
const route = useRoute()

// Canonical URL tracks the current path reactively (computed inside setup).
const canonical = computed(() => siteUrl + route.path)

// Global SEO defaults — pages override title/description as needed.
useSeoMeta({
  ogType: 'website',
  ogSiteName: SITE.name,
  ogLocale: SITE.locale,
  twitterCard: 'summary_large_image',
  ogUrl: canonical,
})

useHead({
  titleTemplate: (title?: string | null) =>
    title && title !== SITE.name ? `${title} — ${SITE.name}` : SITE.name,
  link: [{ rel: 'canonical', href: canonical }],
})
</script>

<template>
  <NuxtLoadingIndicator color="#e22718" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
