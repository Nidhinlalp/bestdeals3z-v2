<script setup lang="ts">
interface Props { title: string; description?: string; icon?: 'cart' | 'search' | 'box' }
withDefaults(defineProps<Props>(), { icon: 'box', description: undefined })
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-md py-section text-center">
    <div class="flex h-16 w-16 items-center justify-center border border-hairline text-muted">
      <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <template v-if="icon === 'cart'"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></template>
        <template v-else-if="icon === 'search'"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></template>
        <template v-else><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></template>
      </svg>
    </div>
    <h3 class="text-title-lg font-bold uppercase">{{ title }}</h3>
    <p v-if="description" class="max-w-sm text-body-md text-body">{{ description }}</p>
    <div v-if="$slots.default" class="pt-sm"><slot /></div>
  </div>
</template>
