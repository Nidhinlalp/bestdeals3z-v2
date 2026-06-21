<script setup lang="ts">
import type { NuxtError } from '#app'
const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error.statusCode === 404)
useSeoMeta({ title: is404.value ? 'Page Not Found' : 'Something went wrong', robots: 'noindex' })
</script>

<template>
  <div class="flex min-h-screen flex-col bg-canvas">
    <div class="m-stripe" />
    <main class="container-bmw flex flex-1 flex-col items-center justify-center py-xxl text-center">
      <p class="text-display-lg font-bold text-hairline md:text-[120px]">{{ error.statusCode }}</p>
      <h1 class="mt-md text-display-sm font-bold uppercase text-white">{{ is404 ? 'Lost in the pit lane' : 'Engine trouble' }}</h1>
      <p class="mt-sm max-w-md text-body-md text-body">
        {{ is404 ? "The page you're looking for doesn't exist or has been moved." : 'An unexpected error occurred. Please try again.' }}
      </p>
      <div class="mt-xl flex gap-sm">
        <BaseButton variant="primary" @click="clearError({ redirect: '/' })">Back to Home</BaseButton>
        <BaseButton to="/shop" variant="outline" @click="clearError()">Shop Products</BaseButton>
      </div>
    </main>
  </div>
</template>
