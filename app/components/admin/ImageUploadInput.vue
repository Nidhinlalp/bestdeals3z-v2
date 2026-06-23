<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  label?: string
  required?: boolean
  folder?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { uploadImage } = useImageUpload()
const uploading = ref(false)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement>()
const id = useId()

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  uploadError.value = ''
  try {
    const url = await uploadImage(file, props.folder ?? 'uploads')
    emit('update:modelValue', url)
  }
  catch (err: unknown) {
    uploadError.value = (err as { message?: string }).message ?? 'Upload failed'
  }
  finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="id" class="text-label-uppercase uppercase text-body-strong">
      {{ label }} <span v-if="required" class="text-m-red">*</span>
    </label>

    <!-- Preview -->
    <div v-if="modelValue" class="relative h-40 overflow-hidden border border-hairline">
      <img :src="modelValue" alt="Preview" class="h-full w-full object-cover" >
      <button
        type="button"
        class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center border border-hairline bg-canvas text-caption text-white hover:border-m-red hover:text-m-red"
        @click="emit('update:modelValue', '')"
      >✕</button>
    </div>

    <!-- Upload + URL row -->
    <div class="flex gap-2">
      <button
        type="button"
        :disabled="uploading"
        class="flex h-12 shrink-0 items-center gap-2 border border-hairline bg-surface-card px-md text-body-sm uppercase text-white transition-colors hover:border-white disabled:opacity-50"
        @click="fileInput?.click()"
      >
        <span v-if="uploading" class="animate-pulse">Uploading…</span>
        <span v-else>Upload Image</span>
      </button>
      <input
        :id="id"
        :value="modelValue ?? ''"
        type="text"
        placeholder="or paste URL"
        class="h-12 min-w-0 flex-1 border border-hairline bg-surface-card px-md text-body-sm text-white placeholder:text-muted focus:border-white focus:outline-none"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" >
    <p v-if="uploadError" class="text-caption text-m-red">{{ uploadError }}</p>
  </div>
</template>
