<script setup lang="ts">
interface Crumb { name: string; to?: string }
defineProps<{ items: Crumb[] }>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-2 text-caption text-muted">
    <template v-for="(item, i) in items" :key="i">
      <NuxtLink v-if="item.to && i < items.length - 1" :to="item.to" class="uppercase tracking-wide hover:text-ink">{{ item.name }}</NuxtLink>
      <span v-else class="uppercase tracking-wide text-body-strong">{{ item.name }}</span>
      <span v-if="i < items.length - 1" aria-hidden="true" class="text-hairline">/</span>
    </template>
  </nav>
</template>
