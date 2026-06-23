<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]
  label?: string
  folder?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const { uploadImage } = useImageUpload()
const uploading = ref(false)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement>()

async function onFileChange(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files ?? [])
  if (!files.length) return
  uploading.value = true
  uploadError.value = ''
  try {
    const urls = await Promise.all(files.map(f => uploadImage(f, props.folder ?? 'uploads')))
    emit('update:modelValue', [...props.modelValue, ...urls])
  }
  catch (err: unknown) {
    uploadError.value = (err as { message?: string }).message ?? 'Upload failed'
  }
  finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function remove(i: number) {
  const next = [...props.modelValue]
  next.splice(i, 1)
  emit('update:modelValue', next)
}

function addManualRow() {
  emit('update:modelValue', [...props.modelValue, ''])
}

function updateUrl(i: number, val: string) {
  const next = [...props.modelValue]
  next[i] = val
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <span v-if="label" class="text-label-uppercase uppercase text-body-strong">{{ label }}</span>

    <!-- Image rows -->
    <div v-if="modelValue.length" class="flex flex-col gap-2">
      <div v-for="(url, i) in modelValue" :key="i" class="flex items-center gap-2">
        <div class="h-12 w-16 shrink-0 overflow-hidden border border-hairline bg-surface-card">
          <img v-if="url" :src="url" alt="" class="h-full w-full object-cover" >
        </div>
        <input
          :value="url"
          type="text"
          placeholder="Image URL"
          class="h-12 min-w-0 flex-1 border border-hairline bg-surface-card px-md text-body-sm text-white placeholder:text-muted focus:border-white focus:outline-none"
          @input="updateUrl(i, ($event.target as HTMLInputElement).value)"
        >
        <button
          type="button"
          class="flex h-12 w-12 shrink-0 items-center justify-center border border-hairline text-muted hover:border-m-red hover:text-m-red"
          @click="remove(i)"
        >✕</button>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <button
        type="button"
        :disabled="uploading"
        class="flex h-10 items-center border border-hairline bg-surface-card px-md text-caption uppercase text-white hover:border-white disabled:opacity-50"
        @click="fileInput?.click()"
      >
        <span v-if="uploading" class="animate-pulse">Uploading…</span>
        <span v-else>+ Upload Image</span>
      </button>
      <button
        type="button"
        class="flex h-10 items-center border border-hairline bg-surface-card px-md text-caption uppercase text-muted hover:border-white hover:text-white"
        @click="addManualRow"
      >+ Add URL</button>
    </div>

    <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onFileChange" >
    <p v-if="uploadError" class="text-caption text-m-red">{{ uploadError }}</p>
  </div>
</template>
