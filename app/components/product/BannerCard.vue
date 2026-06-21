<script setup lang="ts">
import type { Banner } from '~/types'
defineProps<{ banner: Banner; priority?: boolean }>()
</script>

<template>
  <section class="relative flex min-h-[420px] items-center overflow-hidden bg-canvas md:min-h-[560px]">
    <NuxtImg
      :src="banner.image"
      :alt="banner.title"
      width="1440"
      height="720"
      sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
      class="absolute inset-0 h-full w-full object-cover opacity-70"
      :loading="priority ? 'eager' : 'lazy'"
      :preload="priority"
      :fetchpriority="priority ? 'high' : 'auto'"
    />
    <div class="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
    <div class="container-bmw relative z-10">
      <div class="max-w-2xl py-xxl">
        <div class="m-stripe mb-lg w-32" />
        <h2 class="text-display-md font-bold uppercase leading-none text-white md:text-display-lg">{{ banner.title }}</h2>
        <p v-if="banner.subtitle" class="mt-md max-w-lg text-body-md text-body-strong md:text-title-md">{{ banner.subtitle }}</p>
        <BaseButton :to="banner.buttonLink" variant="primary" size="lg" class="mt-xl">{{ banner.buttonText }}</BaseButton>
      </div>
    </div>
  </section>
</template>
