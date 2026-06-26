<script setup lang="ts">
import { SITE } from '~/constants/site'
const { logout, isAuthenticated } = useAdminAuth()
const route = useRoute()

const nav = [
  { label: 'Dashboard', to: '/admin', exact: true },
  { label: 'Products', to: '/admin/products' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Banners', to: '/admin/banners' },
  { label: 'Orders', to: '/admin/orders' },
]
const isActive = (item: { to: string; exact?: boolean }) =>
  item.exact ? route.path === item.to : route.path.startsWith(item.to)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-canvas text-on-dark lg:flex-row">
    <!-- Sidebar -->
    <aside class="flex shrink-0 flex-col border-b border-hairline lg:w-64 lg:border-b-0 lg:border-r">
      <div class="m-stripe" />
      <div class="flex items-center justify-between p-lg">
        <NuxtLink to="/admin" class="flex items-center gap-2">
          <NuxtImg src="/logo.png" alt="BestDeal3z Logo" width="24" height="24" class="h-6 w-6 object-contain" />
          <span class="text-title-md font-bold uppercase">{{ SITE.name }}</span>
        </NuxtLink>
        <span class="text-caption uppercase tracking-wide text-muted">Admin</span>
      </div>
      <nav v-if="isAuthenticated" class="flex gap-2 overflow-x-auto px-lg pb-md lg:flex-col lg:gap-1 lg:overflow-visible lg:px-md">
        <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="whitespace-nowrap border-b-2 px-sm py-2 text-body-sm transition-colors lg:border-b-0 lg:border-l-2 lg:px-md" :class="isActive(item) ? 'border-m-red text-ink' : 'border-transparent text-body hover:text-ink'">{{ item.label }}</NuxtLink>
      </nav>
      <div v-if="isAuthenticated" class="mt-auto hidden flex-col gap-sm p-md lg:flex">
        <NuxtLink to="/" target="_blank" class="text-caption uppercase tracking-wide text-muted hover:text-ink">View Store ↗</NuxtLink>
        <button class="text-left text-caption uppercase tracking-wide text-muted hover:text-m-red" @click="logout">Log Out</button>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 overflow-x-hidden p-lg lg:p-xl">
      <slot />
    </main>
    <ToastHost />
  </div>
</template>
