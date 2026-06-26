<script setup lang="ts">
import type { Banner } from '~/types'
const props = defineProps<{ banners: Banner[] }>()

const active = ref(0)
const count = computed(() => props.banners.length)
let timer: ReturnType<typeof setInterval> | undefined

const go = (i: number) => { active.value = (i + count.value) % count.value }
const next = () => go(active.value + 1)
const prev = () => go(active.value - 1)

function start() { stop(); if (count.value > 1) timer = setInterval(next, 6000) }
function stop() { if (timer) clearInterval(timer) }

onMounted(start)
onUnmounted(stop)
</script>

<template>
  <section class="relative" aria-roledescription="carousel" aria-label="Featured offers" @mouseenter="stop" @mouseleave="start">
    <div class="relative">
      <Transition name="hero" mode="out-in">
        <BannerCard :key="active" :banner="banners[active]!" :priority="active === 0" />
      </Transition>
    </div>

    <div v-if="count > 1" class="pointer-events-none absolute inset-0">
      <div class="container-bmw relative flex h-full items-end pb-lg">
        <div class="pointer-events-auto flex items-center gap-sm">
          <button class="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60" aria-label="Previous slide" @click="prev">
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button class="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60" aria-label="Next slide" @click="next">
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6" /></svg>
          </button>
          <div class="ml-sm flex gap-2">
            <button v-for="(b, i) in banners" :key="i" class="h-1.5 w-8 transition-colors" :class="i === active ? 'bg-white' : 'bg-white/40 hover:bg-white/70'" :aria-label="`Go to slide ${i + 1}`" @click="go(i)" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-enter-active, .hero-leave-active { transition: opacity 0.5s ease; }
.hero-enter-from, .hero-leave-to { opacity: 0; }
</style>
