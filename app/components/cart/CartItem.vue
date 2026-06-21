<script setup lang="ts">
import type { CartItem } from '~/types'
import { formatPrice } from '~/utils/format'

const props = defineProps<{ item: CartItem; compact?: boolean }>()
const cart = useCartStore()
const key = computed(() => cart.keyOf(props.item))
const variantLabel = computed(() =>
  props.item.variant ? Object.entries(props.item.variant).map(([k, v]) => `${k}: ${v}`).join(' · ') : '',
)
</script>

<template>
  <div class="flex gap-sm border-b border-hairline py-md">
    <NuxtLink :to="`/product/${item.slug}`" class="shrink-0">
      <NuxtImg :src="item.image" :alt="item.title" width="88" height="88" class="border border-hairline object-cover" :class="compact ? 'h-16 w-16' : 'h-20 w-20'" loading="lazy" />
    </NuxtLink>
    <div class="flex flex-1 flex-col gap-1">
      <div class="flex items-start justify-between gap-2">
        <NuxtLink :to="`/product/${item.slug}`" class="text-body-md font-medium text-white hover:text-body-strong line-clamp-2">{{ item.title }}</NuxtLink>
        <button class="shrink-0 text-muted hover:text-m-red" :aria-label="`Remove ${item.title}`" @click="cart.remove(key)">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
        </button>
      </div>
      <p v-if="variantLabel" class="text-caption text-muted">{{ variantLabel }}</p>
      <div class="mt-auto flex items-center justify-between gap-2 pt-2">
        <QuantitySelector :model-value="item.quantity" :max="item.maxStock" @update:model-value="cart.setQuantity(key, $event)" />
        <span class="text-body-md font-bold text-white">{{ formatPrice(item.price * item.quantity) }}</span>
      </div>
    </div>
  </div>
</template>
