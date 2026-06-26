<script setup lang="ts">
import type { FaqItem } from '~/types'
const props = defineProps<{ items: FaqItem[] }>()
const openId = ref<string | null>(props.items[0]?.id ?? null)
const toggle = (id: string) => { openId.value = openId.value === id ? null : id }
</script>

<template>
  <div class="divide-y divide-hairline border-y border-hairline">
    <div v-for="item in items" :key="item.id">
      <h3>
        <button
          class="flex w-full items-center justify-between gap-md py-md text-left text-title-sm font-medium text-ink hover:text-body-strong"
          :aria-expanded="openId === item.id"
          @click="toggle(item.id)"
        >
          <span>{{ item.question }}</span>
          <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 transition-transform duration-300" :class="openId === item.id ? 'rotate-45 text-m-red' : 'text-muted'" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
        </button>
      </h3>
      <Transition name="acc">
        <div v-if="openId === item.id" class="overflow-hidden">
          <p class="pb-lg pr-8 text-body-md text-body">{{ item.answer }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.acc-enter-active, .acc-leave-active { transition: all 0.3s ease; }
.acc-enter-from, .acc-leave-to { opacity: 0; max-height: 0; }
.acc-enter-to, .acc-leave-from { opacity: 1; max-height: 200px; }
</style>
