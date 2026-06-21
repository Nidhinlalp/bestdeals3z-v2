<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  side?: 'right' | 'left'
}
const props = withDefaults(defineProps<Props>(), { side: 'right', title: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const close = () => emit('update:modelValue', false)

// Lock body scroll while open + close on Escape.
watch(() => props.modelValue, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})
onKeyStroke('Escape', () => props.modelValue && close())
onUnmounted(() => { if (import.meta.client) document.body.style.overflow = '' })
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modelValue" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" @click="close" />
      </Transition>
      <Transition :name="side === 'right' ? 'slide-right' : 'slide-left'">
        <aside
          v-if="modelValue"
          class="fixed top-0 bottom-0 z-50 flex w-full max-w-md flex-col bg-canvas border-hairline"
          :class="side === 'right' ? 'right-0 border-l' : 'left-0 border-r'"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
        >
          <div class="m-stripe" />
          <header class="flex items-center justify-between border-b border-hairline px-lg py-md">
            <h2 class="text-title-lg font-bold uppercase tracking-wide">{{ title }}</h2>
            <button class="flex h-10 w-10 items-center justify-center text-white hover:text-m-red" aria-label="Close" @click="close">
              <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </header>
          <div class="flex-1 overflow-y-auto">
            <slot />
          </div>
          <div v-if="$slots.footer" class="border-t border-hairline p-lg">
            <slot name="footer" />
          </div>
        </aside>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-right-enter-active, .slide-right-leave-active,
.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }
</style>
