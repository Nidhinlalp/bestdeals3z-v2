<script setup lang="ts">
const { toasts } = useToast()
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <div class="fixed bottom-5 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
        <TransitionGroup name="toast">
          <div
            v-for="t in toasts"
            :key="t.id"
            class="flex items-center gap-sm border bg-surface-card px-md py-sm text-body-sm shadow-lg"
            :class="t.type === 'success' ? 'border-success text-white' : 'border-m-red text-white'"
          >
            <span class="h-2 w-2 shrink-0 rounded-full" :class="t.type === 'success' ? 'bg-success' : 'bg-m-red'" />
            {{ t.message }}
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
