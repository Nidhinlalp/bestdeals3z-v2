<script setup lang="ts">
interface Option { label: string; value: string }
interface Props {
  modelValue?: string
  label?: string
  options: Option[]
  error?: string
}
defineProps<Props>()
defineEmits<{ 'update:modelValue': [value: string] }>()
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="id" class="text-label-uppercase uppercase text-body-strong">{{ label }}</label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        class="h-12 w-full appearance-none rounded-none border border-hairline bg-surface-card px-md pr-10 text-body-md text-white focus:outline-none focus:border-white transition-colors"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="opt in options" :key="opt.value" :value="opt.value" class="bg-surface-card">
          {{ opt.label }}
        </option>
      </select>
      <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
    <p v-if="error" class="text-caption text-m-red">{{ error }}</p>
  </div>
</template>
