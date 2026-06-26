<script setup lang="ts">
/** Flat surface card — 0px radius, hairline border, optional surface fill. */
interface Props { surface?: boolean; hover?: boolean; to?: string }
defineProps<Props>()
</script>

<template>
  <component
    :is="to ? resolveComponent('NuxtLink') : 'div'"
    :to="to"
    class="block border border-hairline rounded-none"
    :class="[surface ? 'bg-surface-card' : 'bg-canvas', hover ? 'transition-colors hover:border-ink' : '']"
  >
    <slot />
  </component>
</template>
