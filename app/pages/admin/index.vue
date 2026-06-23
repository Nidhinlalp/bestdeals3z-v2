<script setup lang="ts">
import { formatPrice } from '~/utils/format'
definePageMeta({ layout: 'admin' })

const supabase = useSupabaseClient()

const { data: products } = await useProducts()
const { data: categories } = await useCategories()
const { data: banners } = await useBanners()

const ordersCount = ref(0)
onMounted(async () => {
  const { count } = await supabase.from('orders').select('id', { count: 'exact', head: true })
  ordersCount.value = count ?? 0
})

const lowStock = computed(() => (products.value ?? []).filter((p) => p.stock <= 5).slice(0, 6))
const totalValue = computed(() => (products.value ?? []).reduce((s, p) => s + (p.salePrice || p.price) * p.stock, 0))

const cards = computed(() => [
  { label: 'Products', value: products.value?.length ?? 0, to: '/admin/products' },
  { label: 'Categories', value: categories.value?.length ?? 0, to: '/admin/categories' },
  { label: 'Banners', value: banners.value?.length ?? 0, to: '/admin/banners' },
  { label: 'Orders', value: ordersCount.value, to: '/admin/orders' },
  { label: 'Inventory Value', value: formatPrice(totalValue.value), to: '/admin/products' },
])

useSeoMeta({ title: 'Dashboard', robots: 'noindex, nofollow' })
</script>

<template>
  <div class="flex flex-col gap-xl">
    <div>
      <div class="m-stripe mb-md w-16" />
      <h1 class="text-display-sm font-bold uppercase leading-none">Dashboard</h1>
      <p class="mt-sm text-body-sm text-body">Manage your store. All data is stored in Supabase.</p>
    </div>

    <div class="grid grid-cols-2 gap-px border border-hairline bg-hairline lg:grid-cols-5">
      <NuxtLink v-for="c in cards" :key="c.label" :to="c.to" class="group flex flex-col gap-1 bg-canvas p-lg transition-colors hover:bg-surface-card">
        <span class="text-display-sm font-bold text-white">{{ c.value }}</span>
        <span class="text-label-uppercase uppercase text-muted group-hover:text-body">{{ c.label }}</span>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 gap-lg lg:grid-cols-2">
      <div class="border border-hairline">
        <div class="flex items-center justify-between border-b border-hairline p-md">
          <h2 class="text-title-md font-bold uppercase">Quick Actions</h2>
        </div>
        <div class="grid grid-cols-1 gap-sm p-md sm:grid-cols-2">
          <BaseButton to="/admin/products?new=1" variant="outline" size="sm">+ Add Product</BaseButton>
          <BaseButton to="/admin/categories?new=1" variant="outline" size="sm">+ Add Category</BaseButton>
          <BaseButton to="/admin/banners?new=1" variant="outline" size="sm">+ Add Banner</BaseButton>
          <BaseButton to="/admin/orders" variant="outline" size="sm">View Orders</BaseButton>
          <BaseButton to="/" variant="ghost" size="sm">View Store ↗</BaseButton>
        </div>
      </div>

      <div class="border border-hairline">
        <div class="flex items-center justify-between border-b border-hairline p-md">
          <h2 class="text-title-md font-bold uppercase">Low Stock</h2>
          <span class="text-caption text-muted">≤ 5 units</span>
        </div>
        <ul v-if="lowStock.length" class="divide-y divide-hairline">
          <li v-for="p in lowStock" :key="p.slug" class="flex items-center justify-between gap-md p-md">
            <NuxtLink :to="`/admin/products?edit=${p.slug}`" class="text-body-sm text-white hover:text-m-red line-clamp-1">{{ p.title }}</NuxtLink>
            <span class="shrink-0 text-caption" :class="p.stock === 0 ? 'text-m-red' : 'text-warning'">{{ p.stock }} left</span>
          </li>
        </ul>
        <p v-else class="p-md text-body-sm text-body">All products are well stocked.</p>
      </div>
    </div>
  </div>
</template>
