<script setup lang="ts">
interface PolicyDoc {
  _path?: string
  title: string
  slug: string
  description?: string
  updatedAt?: string
  order?: number
  body?: unknown
}

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: policy } = await useAsyncData(`policy-${slug.value}`, () =>
  queryContent<PolicyDoc>('policies').where({ slug: slug.value }).findOne(),
)

if (!policy.value) {
  throw createError({ statusCode: 404, statusMessage: 'Policy not found', fatal: true })
}

const { data: allPolicies } = await useAsyncData('policies-nav', () =>
  queryContent<PolicyDoc>('policies').only(['title', 'slug', 'order']).sort({ order: 1 }).find(),
  { default: () => [] as PolicyDoc[] },
)

const formattedDate = computed(() => {
  if (!policy.value?.updatedAt) return ''
  return new Date(policy.value.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
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
  <div v-if="policy" class="container-bmw py-xl md:py-xxl">
    <Breadcrumb :items="[{ name: 'Home', to: '/' }, { name: policy.title }]" class="mb-lg" />

    <div class="grid grid-cols-1 gap-xl lg:grid-cols-[240px_1fr]">
      <!-- Sidebar nav -->
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <div class="m-stripe mb-md w-16" />
        <p class="kicker mb-sm text-body">Legal</p>
        <nav class="flex flex-col" aria-label="Policies">
          <NuxtLink
            v-for="pol in allPolicies"
            :key="pol.slug"
            :to="`/policies/${pol.slug}`"
            class="border-b border-hairline py-sm text-body-sm transition-colors"
            :class="pol.slug === slug ? 'text-white' : 'text-body hover:text-white'"
          >{{ pol.title }}</NuxtLink>
        </nav>
      </aside>

      <!-- Content -->
      <article>
        <h1 class="text-display-sm font-bold uppercase leading-none text-white md:text-display-md">{{ policy.title }}</h1>
        <p v-if="formattedDate" class="mt-sm text-caption uppercase tracking-wide text-muted">Last updated {{ formattedDate }}</p>
        <div class="m-stripe my-lg w-24" />
        <div class="prose-bmw max-w-2xl">
          <ContentRenderer :value="policy" />
        </div>
      </article>
    </div>
  </div>
</template>
