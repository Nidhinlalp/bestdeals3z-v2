<script setup lang="ts">
import { NAV_LINKS, SITE } from '~/constants/site'

const cart = useCartStore()
const ui = useUiStore()
const route = useRoute()

// Subtle solid background once the user scrolls past the hero.
const scrolled = ref(false)
const onScroll = () => { scrolled.value = window.scrollY > 24 }
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// Close any overlay on route change.
watch(() => route.fullPath, () => ui.closeAll())
</script>

<template>
  <header class="sticky top-0 z-40 w-full transition-colors duration-300" :class="scrolled ? 'bg-canvas/95 backdrop-blur border-b border-hairline' : 'bg-canvas border-b border-transparent'">
    <div class="m-stripe" />
    <div class="container-bmw flex h-16 items-center justify-between gap-md">
      <!-- Left: mobile menu + logo -->
      <div class="flex items-center gap-md">
        <button class="flex h-10 w-10 items-center justify-center text-white lg:hidden" aria-label="Open menu" @click="ui.openMenu()">
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        </button>
        <NuxtLink to="/" class="flex items-center gap-2" aria-label="BestDeal3z home">
          <!-- <span class="flex h-7 items-center gap-px" aria-hidden="true">
            <span class="block h-7 w-1.5 bg-m-blue-light" /><span class="block h-7 w-1.5 bg-m-blue-dark" /><span class="block h-7 w-1.5 bg-m-red" />
          </span> -->
          <span class="text-title-lg font-bold uppercase tracking-tight text-white">{{ SITE.name }}</span>
        </NuxtLink>
      </div>

      <!-- Center: desktop nav -->
      <nav class="hidden items-center gap-xl lg:flex" aria-label="Primary">
        <NuxtLink v-for="link in NAV_LINKS" :key="link.to" :to="link.to" class="text-nav-link text-body transition-colors hover:text-white" active-class="text-white">{{ link.label }}</NuxtLink>
      </nav>

      <!-- Right: search + cart -->
      <div class="flex items-center gap-xs">
        <button class="flex h-10 w-10 items-center justify-center text-white hover:text-body-strong" aria-label="Search" @click="ui.openSearch()">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        </button>
        <button class="relative flex h-10 w-10 items-center justify-center text-white hover:text-body-strong" aria-label="Open cart" @click="ui.openCart()">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg>
          <span v-if="cart.count > 0" class="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center bg-m-red px-1 text-[10px] font-bold text-white">{{ cart.count }}</span>
        </button>
      </div>
    </div>

    <MobileMenu />
    <CartDrawer />
    <SearchOverlay />
  </header>
</template>
