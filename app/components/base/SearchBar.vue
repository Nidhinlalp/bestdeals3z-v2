<script setup lang="ts">
import type { Product, Category } from '~/types'
import { formatPrice, effectivePrice } from '~/utils/format'

const emit = defineEmits<{ navigate: [] }>()

const { data: products } = useProducts()
const { data: categories } = useCategories()

const query = ref('')
const input = ref<HTMLInputElement | null>(null)

onMounted(() => input.value?.focus())

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q.length < 2) return { products: [] as Product[], categories: [] as Category[] }
  const match = (s: string) => s.toLowerCase().includes(q)
  return {
    products: (products.value ?? []).filter((p) => match(p.title) || match(p.category) || match(p.shortDescription)).slice(0, 6),
    categories: (categories.value ?? []).filter((c) => match(c.name) || match(c.description)).slice(0, 4),
  }
})

const hasResults = computed(() => results.value.products.length > 0 || results.value.categories.length > 0)

function submit() {
  const q = query.value.trim()
  if (!q) return
  emit('navigate')
  navigateTo({ path: '/shop', query: { q } })
}
</script>

<template>
  <div class="flex flex-col">
    <form class="flex items-center gap-sm border-b border-hairline px-lg py-md" @submit.prevent="submit">
      <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-muted" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      <input
        ref="input"
        v-model="query"
        type="search"
        inputmode="search"
        placeholder="Search drones, RC cars, gadgets…"
        class="h-10 w-full bg-transparent text-body-md text-ink placeholder:text-muted focus:outline-none"
        aria-label="Search products"
      >
    </form>

    <div class="flex-1 overflow-y-auto p-lg">
      <p v-if="query.trim().length < 2" class="text-body-sm text-muted">Type at least 2 characters to search.</p>

      <EmptyState v-else-if="!hasResults" title="No matches" :description="`Nothing found for “${query}”. Try another term.`" icon="search" />

      <div v-else class="flex flex-col gap-lg">
        <section v-if="results.categories.length">
          <p class="kicker mb-sm">Categories</p>
          <div class="flex flex-wrap gap-xs">
            <NuxtLink v-for="c in results.categories" :key="c.slug" :to="`/category/${c.slug}`" class="border border-hairline px-sm py-2 text-body-sm hover:border-ink" @click="emit('navigate')">{{ c.name }}</NuxtLink>
          </div>
        </section>

        <section v-if="results.products.length">
          <p class="kicker mb-sm">Products</p>
          <ul class="flex flex-col">
            <li v-for="p in results.products" :key="p.slug">
              <NuxtLink :to="`/product/${p.slug}`" class="flex items-center gap-sm border-b border-hairline py-sm hover:bg-surface-card" @click="emit('navigate')">
                <NuxtImg :src="p.images[0]" :alt="p.title" width="56" height="56" class="h-14 w-14 shrink-0 border border-hairline object-cover" loading="lazy" />
                <span class="flex-1">
                  <span class="block text-body-sm text-ink">{{ p.title }}</span>
                  <span class="block text-caption text-muted">{{ formatPrice(effectivePrice(p)) }}</span>
                </span>
              </NuxtLink>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>
