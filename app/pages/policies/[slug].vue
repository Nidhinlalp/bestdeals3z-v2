<script setup lang="ts">
import { POLICIES, getPolicy } from '~/constants/policies'
import { SITE } from '~/constants/site'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const policy = computed(() => getPolicy(slug.value))
const config = useRuntimeConfig()

if (!policy.value) {
  throw createError({ statusCode: 404, statusMessage: 'Policy not found', fatal: true })
}

const legal = computed(() => ({
  sellerName: config.public.sellerLegalName || SITE.name,
  businessAddress: config.public.businessAddress,
  grievanceOfficer: config.public.grievanceOfficerName,
  grievanceEmail: config.public.grievanceEmail || SITE.email,
  grievancePhone: config.public.grievancePhone || SITE.phone,
}))

const formattedDate = computed(() => {
  return new Date(policy.value!.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
})

useSeoMeta({
  title: () => policy.value?.title,
  description: () => policy.value?.description,
  ogTitle: () => policy.value?.title,
  ogDescription: () => policy.value?.description,
})
useBreadcrumbSchema(() => [
  { name: 'Home', item: '/' },
  { name: policy.value?.title ?? '', item: `/policies/${slug.value}` },
])
</script>

<template>
  <div v-if="policy" class="container-cloud py-xl md:py-xxl">
    <Breadcrumb :items="[{ name: 'Home', to: '/' }, { name: policy.title }]" class="mb-lg" />

    <div class="grid grid-cols-1 gap-xl lg:grid-cols-[240px_1fr]">
      <!-- Sidebar nav -->
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <div class="brand-stripe mb-md w-16" />
        <p class="kicker mb-sm text-body">Legal</p>
        <nav class="flex flex-col" aria-label="Policies">
          <NuxtLink
            v-for="pol in POLICIES"
            :key="pol.slug"
            :to="`/policies/${pol.slug}`"
            class="border-b border-hairline py-sm text-body-sm transition-colors"
            :class="pol.slug === slug ? 'text-ink' : 'text-body hover:text-ink'"
          >{{ pol.title }}</NuxtLink>
        </nav>
      </aside>

      <!-- Content -->
      <article>
        <h1 class="text-display-sm font-bold uppercase leading-none text-ink md:text-display-md">{{ policy.title }}</h1>
        <p v-if="formattedDate" class="mt-sm text-caption uppercase tracking-wide text-muted">Last updated {{ formattedDate }}</p>
        <div class="brand-stripe my-lg w-24" />
        <div class="prose-cloud max-w-3xl">
          <p v-for="paragraph in policy.introduction" :key="paragraph">{{ paragraph }}</p>

          <section v-for="section in policy.sections" :key="section.title">
            <h2>{{ section.title }}</h2>
            <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
            <ul v-if="section.bullets?.length">
              <li v-for="item in section.bullets" :key="item">{{ item }}</li>
            </ul>
          </section>

          <section>
            <h2>Seller and grievance contact</h2>
            <p><strong>Seller / data fiduciary:</strong> {{ legal.sellerName }}</p>
            <p><strong>Business address:</strong> {{ legal.businessAddress || 'To be supplied in the production environment before orders are accepted.' }}</p>
            <p><strong>Grievance officer:</strong> {{ legal.grievanceOfficer || 'To be supplied in the production environment before orders are accepted.' }}</p>
            <p>
              <strong>Contact:</strong>
              <a :href="`mailto:${legal.grievanceEmail}`">{{ legal.grievanceEmail }}</a>
              · <a :href="`tel:${legal.grievancePhone.replace(/\s/g, '')}`">{{ legal.grievancePhone }}</a>
            </p>
            <p>We acknowledge consumer complaints within 48 hours and aim to resolve them within one month.</p>
          </section>
        </div>
      </article>
    </div>
  </div>
</template>
