<script setup lang="ts">
import type { SortOption } from '~/types'
import { effectivePrice } from '~/utils/format'

const route = useRoute()
const router = useRouter()

const { data: products } = await useProducts()
const { data: categories } = await useCategories()

const PER_PAGE = 12

const SORTS: { label: string; value: SortOption }[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A–Z', value: 'name-asc' },
]

// Local filter state hydrated from the URL query.
const search = ref((route.query.q as string) ?? '')
const category = ref((route.query.category as string) ?? '')
const sort = ref<SortOption>(((route.query.sort as SortOption) || 'featured'))
const maxPriceFilter = ref<number>(route.query.max ? Number(route.query.max) : 0)
const page = ref(route.query.page ? Number(route.query.page) : 1)

// Sync search box from external navigations (e.g. the search overlay).
watch(() => route.query.q, (q) => { search.value = (q as string) ?? '' })

const priceCeiling = computed(() =>
  Math.ceil((Math.max(0, ...(products.value ?? []).map((p) => effectivePrice(p))) || 5000) / 500) * 500,
)
watchEffect(() => { if (maxPriceFilter.value === 0) maxPriceFilter.value = priceCeiling.value })

const filtered = computed(() => {
  let list = [...(products.value ?? [])]
  const q = search.value.trim().toLowerCase()
  if (q) list = list.filter((p) => p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) || p.category.includes(q))
  if (category.value) list = list.filter((p) => p.category === category.value)
  if (maxPriceFilter.value) list = list.filter((p) => effectivePrice(p) <= maxPriceFilter.value)

  switch (sort.value) {
    case 'price-asc': list.sort((a, b) => effectivePrice(a) - effectivePrice(b)); break
    case 'price-desc': list.sort((a, b) => effectivePrice(b) - effectivePrice(a)); break
    case 'name-asc': list.sort((a, b) => a.title.localeCompare(b.title)); break
    case 'newest': list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break
    default: list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
  }
  return list
})

const paginated = computed(() => filtered.value.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE))

// Reset to page 1 whenever a filter changes, and reflect state in the URL.
watch([search, category, sort, maxPriceFilter], () => { page.value = 1 })
watch([search, category, sort, page], () => {
  const query: Record<string, string> = {}
  if (search.value) query.q = search.value
  if (category.value) query.category = category.value
  if (sort.value !== 'featured') query.sort = sort.value
  if (page.value > 1) query.page = String(page.value)
  router.replace({ query })
}, { deep: true })

function clearFilters() {
  search.value = ''; category.value = ''; sort.value = 'featured'; maxPriceFilter.value = priceCeiling.value
}

function goToPage(p: number) {
  page.value = p
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

useSeoMeta({
  title: 'Shop All Products',
  description: 'Browse the full BestDeal3z range — drones, RC cars, planes, gimbals, blasters and gadgets. Filter, sort and order on WhatsApp.',
  ogImage: '/og-image.svg',
})
useBreadcrumbSchema([{ name: 'Home', item: '/' }, { name: 'Shop', item: '/shop' }])
</script>

<template>
  <div class="container-bmw py-xl md:py-xxl">
    <Breadcrumb :items="[{ name: 'Home', to: '/' }, { name: 'Shop' }]" class="mb-md" />
    <div class="m-stripe mb-lg w-20" />
    <h1 class="text-display-sm font-bold uppercase leading-none text-white md:text-display-md">Shop All Products</h1>

    <div class="mt-xl grid grid-cols-1 gap-xl lg:grid-cols-[260px_1fr]">
      <!-- Filters sidebar -->
      <aside class="flex flex-col gap-lg lg:sticky lg:top-24 lg:self-start">
        <BaseInput v-model="search" label="Search" placeholder="Search products…" type="search" inputmode="search" />

        <div class="flex flex-col gap-sm">
          <span class="text-label-uppercase uppercase text-body-strong">Category</span>
          <div class="flex flex-col">
            <button class="border-b border-hairline py-2 text-left text-body-sm transition-colors" :class="category === '' ? 'text-white' : 'text-body hover:text-white'" @click="category = ''">All Categories</button>
            <button v-for="c in categories" :key="c.slug" class="flex items-center justify-between border-b border-hairline py-2 text-left text-body-sm transition-colors" :class="category === c.slug ? 'text-white' : 'text-body hover:text-white'" @click="category = c.slug">
              <span>{{ c.name }}</span>
              <span v-if="category === c.slug" class="m-stripe h-1 w-8" />
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-sm">
          <div class="flex items-center justify-between">
            <span class="text-label-uppercase uppercase text-body-strong">Max Price</span>
            <span class="text-body-sm text-white">₹{{ maxPriceFilter.toLocaleString('en-IN') }}</span>
          </div>
          <input v-model.number="maxPriceFilter" type="range" min="0" :max="priceCeiling" step="100" class="accent-m-red" aria-label="Maximum price">
        </div>

        <BaseButton variant="ghost" size="sm" @click="clearFilters">Clear Filters</BaseButton>
      </aside>

      <!-- Results -->
      <div class="flex flex-col gap-lg">
        <div class="flex flex-wrap items-center justify-between gap-md border-b border-hairline pb-md">
          <p class="text-body-sm text-body">{{ filtered.length }} {{ filtered.length === 1 ? 'product' : 'products' }}</p>
          <div class="w-full max-w-[240px]">
            <BaseSelect v-model="sort" :options="SORTS" />
          </div>
        </div>

        <ProductGrid v-if="paginated.length" :products="paginated" />
        <EmptyState v-else title="No products found" description="Try adjusting your search or filters." icon="search">
          <BaseButton variant="outline" @click="clearFilters">Reset</BaseButton>
        </EmptyState>

        <Pagination :page="page" :total="filtered.length" :per-page="PER_PAGE" class="mt-md" @update:page="goToPage" />
      </div>
    </div>
  </div>
</template>
