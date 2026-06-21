<script setup lang="ts">
interface Props { rating: number; count?: number; size?: 'sm' | 'md' }
const props = withDefaults(defineProps<Props>(), { size: 'sm' })
const full = computed(() => Math.round(props.rating))
</script>

<template>
  <div class="flex items-center gap-1.5" :aria-label="`Rated ${rating} out of 5`">
    <div class="flex" :class="size === 'sm' ? 'gap-0.5' : 'gap-1'">
      <svg v-for="i in 5" :key="i" viewBox="0 0 24 24" :class="[size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4', i <= full ? 'text-warning' : 'text-hairline']" fill="currentColor" aria-hidden="true">
        <path d="m12 2 3 6.5 7 .9-5 4.8 1.3 7L12 17.8 5.4 21.2 6.7 14.2 1.7 9.4l7-.9z" />
      </svg>
    </div>
    <span v-if="count != null" class="text-caption text-muted">({{ count }})</span>
  </div>
</template>
