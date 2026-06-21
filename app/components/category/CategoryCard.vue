<script setup lang="ts">
import type { Category } from '~/types'
defineProps<{ category: Category; count?: number }>()
</script>

<template>
  <NuxtLink :to="`/category/${category.slug}`" class="group relative block aspect-[4/5] overflow-hidden border border-hairline bg-surface-soft transition-colors hover:border-white">
    <NuxtImg
      :src="category.image"
      :alt="category.name"
      width="500"
      height="625"
      sizes="sm:50vw md:33vw lg:20vw"
      class="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
      loading="lazy"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
    <div class="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-md">
      <h3 class="text-title-lg font-bold uppercase leading-tight text-white">{{ category.name }}</h3>
      <span v-if="count != null" class="text-caption uppercase tracking-wide text-body">{{ count }} {{ count === 1 ? 'product' : 'products' }}</span>
    </div>
  </NuxtLink>
</template>
