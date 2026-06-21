<script setup lang="ts">
interface Props { modelValue: boolean; title?: string }
const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const close = () => emit('update:modelValue', false)

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
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          @click.self="close"
        >
          <div class="w-full max-w-lg border border-hairline bg-canvas" role="dialog" aria-modal="true" :aria-label="title">
            <div class="m-stripe" />
            <header v-if="title || $slots.header" class="flex items-center justify-between border-b border-hairline px-lg py-md">
              <h2 class="text-title-lg font-bold uppercase tracking-wide"><slot name="header">{{ title }}</slot></h2>
              <button class="flex h-10 w-10 items-center justify-center text-white hover:text-m-red" aria-label="Close" @click="close">
                <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </header>
            <div class="p-lg"><slot /></div>
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
