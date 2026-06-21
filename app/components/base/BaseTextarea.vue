<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  rows?: number
}
defineProps<Props>()
defineEmits<{ 'update:modelValue': [value: string] }>()
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="id" class="text-label-uppercase uppercase text-body-strong">
      {{ label }} <span v-if="required" class="text-m-red">*</span>
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :rows="rows || 4"
      :aria-invalid="!!error"
      class="w-full rounded-none border bg-surface-card px-md py-sm text-body-md text-white placeholder:text-muted focus:outline-none focus:border-white transition-colors resize-y"
      :class="error ? 'border-m-red' : 'border-hairline'"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <p v-if="error" class="text-caption text-m-red">{{ error }}</p>
  </div>
</template>
