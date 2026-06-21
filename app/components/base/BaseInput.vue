<script setup lang="ts">
interface Props {
  modelValue?: string | number | null
  label?: string
  type?: string
  placeholder?: string
  error?: string
  required?: boolean
  autocomplete?: string
  inputmode?: 'text' | 'numeric' | 'tel' | 'email' | 'search' | 'decimal'
}
const props = defineProps<Props>()
defineEmits<{ 'update:modelValue': [value: string] }>()
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="id" class="text-label-uppercase uppercase text-body-strong">
      {{ label }} <span v-if="required" class="text-m-red">*</span>
    </label>
    <input
      :id="id"
      :value="modelValue ?? ''"
      :type="type || 'text'"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-err` : undefined"
      class="h-12 w-full rounded-none border bg-surface-card px-md text-body-md text-white placeholder:text-muted focus:outline-none focus:border-white transition-colors"
      :class="error ? 'border-m-red' : 'border-hairline'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <p v-if="error" :id="`${id}-err`" class="text-caption text-m-red">{{ error }}</p>
  </div>
</template>
