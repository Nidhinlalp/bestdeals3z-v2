<script setup lang="ts">
const props = defineProps<{ images: string[]; alt: string }>()
const active = ref(0)
watch(() => props.images, () => { active.value = 0 })
</script>

<template>
  <div class="flex flex-col gap-sm">
    <div class="relative aspect-square overflow-hidden border border-hairline bg-surface-soft">
      <NuxtImg
        :key="active"
        :src="images[active]"
        :alt="alt"
        width="900"
        height="900"
        sizes="sm:100vw lg:50vw"
        class="h-full w-full animate-fade-in object-cover"
        preload
        fetchpriority="high"
      />
      <div class="m-stripe absolute bottom-0 left-0 w-24" />
    </div>

    <div v-if="images.length > 1" class="grid grid-cols-4 gap-sm md:grid-cols-5">
      <button
        v-for="(img, i) in images"
        :key="img"
        class="relative aspect-square overflow-hidden border bg-surface-soft transition-colors"
        :class="i === active ? 'border-white' : 'border-hairline hover:border-body'"
        :aria-label="`View image ${i + 1}`"
        :aria-current="i === active"
        @click="active = i"
      >
        <NuxtImg :src="img" :alt="`${alt} thumbnail ${i + 1}`" width="160" height="160" class="h-full w-full object-cover" loading="lazy" />
      </button>
    </div>
  </div>
</template>
