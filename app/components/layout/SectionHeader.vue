<script setup lang="ts">
interface Props { kicker?: string; title: string; link?: string; linkText?: string; stripe?: boolean }
withDefaults(defineProps<Props>(), { linkText: 'View All', stripe: true })
</script>

<template>
  <div class="mb-xl flex flex-wrap items-end justify-between gap-md">
    <div class="flex flex-col gap-sm">
      <div v-if="stripe" class="m-stripe w-20" />
      <p v-if="kicker" class="kicker text-body">{{ kicker }}</p>
      <h2 class="text-display-sm font-bold uppercase leading-none text-white md:text-display-md">{{ title }}</h2>
    </div>
    <NuxtLink v-if="link" :to="link" class="group inline-flex items-center gap-2 text-label-uppercase uppercase tracking-[1.5px] text-white hover:text-m-red">
      {{ linkText }}
      <svg viewBox="0 0 24 24" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
    </NuxtLink>
  </div>
</template>
