<script setup lang="ts">
interface Props { variant?: 'card' | 'text' | 'image' | 'block'; count?: number }
withDefaults(defineProps<Props>(), { variant: 'card', count: 1 })
</script>

<template>
  <div v-for="n in count" :key="n" class="relative overflow-hidden border border-hairline bg-surface-card">
    <div v-if="variant === 'card'">
      <div class="aspect-square w-full bg-surface-elevated" />
      <div class="space-y-3 p-md">
        <div class="h-3 w-1/3 bg-surface-elevated" />
        <div class="h-4 w-3/4 bg-surface-elevated" />
        <div class="h-5 w-1/2 bg-surface-elevated" />
      </div>
    </div>
    <div v-else-if="variant === 'image'" class="aspect-square w-full bg-surface-elevated" />
    <div v-else-if="variant === 'text'" class="h-4 w-full bg-surface-elevated" />
    <div v-else class="h-24 w-full bg-surface-elevated" />
    <div class="shimmer absolute inset-0" />
  </div>
</template>

<style scoped>
.shimmer {
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent);
  transform: translateX(-100%);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { 100% { transform: translateX(100%); } }
</style>
