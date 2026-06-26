<script setup lang="ts">
import { effectivePrice } from '~/utils/format'
import type { SortOption } from '~/types'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: category } = await useCategory(slug)
const { data: products } = await useProducts()

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true })
}

const sort = ref<SortOption>('featured')
const SORTS: { label: string; value: SortOption }[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
]

const items = computed(() => {
  const list = (products.value ?? []).filter((p) => p.category === slug.value)
  switch (sort.value) {
    case 'price-asc': return [...list].sort((a, b) => effectivePrice(a) - effectivePrice(b))
    case 'price-desc': return [...list].sort((a, b) => effectivePrice(b) - effectivePrice(a))
    case 'newest': return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    default: return [...list].sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
  }
})

useSeoMeta({
  title: () => `${category.value?.name} — Shop`,
  description: () => category.value?.description,
  ogTitle: () => category.value?.name,
  ogDescription: () => category.value?.description,
  ogImage: () => category.value?.image,
})
useBreadcrumbSchema(() => [
  { name: 'Home', item: '/' },
  { name: 'Categories', item: '/categories' },
  { name: category.value?.name ?? '', item: `/category/${slug.value}` },
])
</script>

<template>
  <div v-if="category">
    <!-- Header band -->
    <section class="relative overflow-hidden border-b border-hairline bg-surface-soft">
      <NuxtImg :src="category.image" :alt="category.name" width="1440" height="480" sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw" class="absolute inset-0 h-full w-full object-cover opacity-30" loading="eager" preload />
      <div class="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-canvas/40" />
      <div class="container-bmw relative z-10 py-xxl">
        <Breadcrumb :items="[{ name: 'Home', to: '/' }, { name: 'Categories', to: '/categories' }, { name: category.name }]" class="mb-md" />
        <div class="m-stripe mb-lg w-20" />
        <h1 class="text-display-md font-bold uppercase leading-none text-ink md:text-display-lg">{{ category.name }}</h1>
        <p class="mt-md max-w-xl text-body-md text-body-strong">{{ category.description }}</p>
      </div>
    </section>

    <div class="container-bmw py-xl md:py-xxl">
      <div class="mb-lg flex flex-wrap items-center justify-between gap-md border-b border-hairline pb-md">
        <p class="text-body-sm text-body">{{ items.length }} {{ items.length === 1 ? 'product' : 'products' }}</p>
        <div class="w-full max-w-[240px]"><BaseSelect v-model="sort" :options="SORTS" /></div>
      </div>

      <ProductGrid v-if="items.length" :products="items" />
      <EmptyState v-else title="Nothing here yet" description="This category has no products right now. Check back soon!" icon="box">
        <BaseButton to="/shop" variant="outline">Browse All Products</BaseButton>
      </EmptyState>
    </div>
  </div>
</template>
