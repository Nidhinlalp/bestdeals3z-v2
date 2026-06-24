<script setup lang="ts">
const { data: categories } = await useCategories()
const { data: products } = await useProducts()

const counts = computed(() => {
  const map: Record<string, number> = {}
  for (const p of products.value ?? []) map[p.category] = (map[p.category] ?? 0) + 1
  return map
})

useSeoMeta({
  title: 'All Categories',
  description: 'Explore every BestDeal3z category — camera drones, RC cars, planes, helicopters, boats, gimbals, blasters, robotics and accessories.',
  ogImage: '/og-image.svg',
})
useBreadcrumbSchema([{ name: 'Home', item: '/' }, { name: 'Categories', item: '/categories' }])
</script>

<template>
  <div class="container-bmw py-xl md:py-xxl">
    <Breadcrumb :items="[{ name: 'Home', to: '/' }, { name: 'Categories' }]" class="mb-md" />
    <div class="m-stripe mb-lg w-20" />
    <h1 class="text-display-sm font-bold uppercase leading-none text-white md:text-display-md">Shop by Category</h1>
    <p class="mt-md max-w-xl text-body-md text-body">Ten ranges of drones, RC machines and gadgets — each engineered for a different kind of fun.</p>

    <div class="mt-xl grid grid-cols-2 gap-sm md:grid-cols-3 md:gap-lg lg:grid-cols-4">
      <CategoryCard v-for="c in categories" :key="c.slug" :category="c" :count="counts[c.slug]" />
    </div>
  </div>
</template>
