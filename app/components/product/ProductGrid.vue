<script setup lang="ts">
import type { Product } from '~/types'
interface Props { products: Product[]; loading?: boolean; skeletonCount?: number }
withDefaults(defineProps<Props>(), { skeletonCount: 8 })
</script>

<template>
  <div class="grid grid-cols-2 gap-sm md:grid-cols-3 md:gap-lg lg:grid-cols-4">
    <template v-if="loading">
      <LoadingSkeleton v-for="n in skeletonCount" :key="n" variant="card" />
    </template>
    <ProductCard v-for="product in products" v-else :key="product.slug" :product="product" />
  </div>
</template>
