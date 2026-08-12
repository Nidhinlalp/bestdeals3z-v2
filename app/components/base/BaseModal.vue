<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}
const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const close = () => emit('update:modelValue', false)
const titleId = useId()

const widthClass = computed(() => ({
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-3xl',
})[props.size ?? 'md'])

watch(() => props.modelValue, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})
onKeyStroke('Escape', () => props.modelValue && close())
onUnmounted(() => { if (import.meta.client) document.body.style.overflow = '' })
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="modelValue"
          class="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          @click.self="close"
        >
          <div
            class="flex max-h-[100dvh] w-full flex-col overflow-hidden border border-hairline bg-canvas shadow-2xl sm:max-h-[calc(100dvh-2rem)]"
            :class="widthClass"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title || $slots.header ? titleId : undefined"
            :aria-label="!title && !$slots.header ? 'Dialog' : undefined"
          >
            <div class="brand-stripe shrink-0" />
            <header v-if="title || $slots.header" class="flex shrink-0 items-center justify-between gap-md border-b border-hairline px-4 py-3 sm:px-6 sm:py-4">
              <h2 :id="titleId" class="min-w-0 text-title-md font-bold uppercase tracking-wide sm:text-title-lg"><slot name="header">{{ title }}</slot></h2>
              <button class="flex h-10 w-10 shrink-0 items-center justify-center text-ink hover:text-m-red" aria-label="Close" @click="close">
                <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </header>
            <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [scrollbar-gutter:stable] sm:p-6" tabindex="0">
              <slot />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
