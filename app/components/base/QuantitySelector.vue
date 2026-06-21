<script setup lang="ts">
interface Props { modelValue: number; min?: number; max?: number }
const props = withDefaults(defineProps<Props>(), { min: 1, max: 99 })
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const set = (v: number) => emit('update:modelValue', Math.max(props.min, Math.min(props.max, v)))
</script>

<template>
  <div class="inline-flex items-center border border-hairline">
    <button class="flex h-11 w-11 items-center justify-center text-white hover:bg-surface-card disabled:opacity-30" :disabled="modelValue <= min" aria-label="Decrease quantity" @click="set(modelValue - 1)">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14" /></svg>
    </button>
    <span class="min-w-[44px] text-center text-body-md font-medium tabular-nums" aria-live="polite">{{ modelValue }}</span>
    <button class="flex h-11 w-11 items-center justify-center text-white hover:bg-surface-card disabled:opacity-30" :disabled="modelValue >= max" aria-label="Increase quantity" @click="set(modelValue + 1)">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
    </button>
  </div>
</template>
