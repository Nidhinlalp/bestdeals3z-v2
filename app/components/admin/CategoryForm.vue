<script setup lang="ts">
import type { Category } from '~/types'
import { categorySchema } from '~/utils/schemas'
import { slugify } from '~/utils/format'

const props = defineProps<{ initial?: Category | null }>()
const emit = defineEmits<{ submit: [doc: Record<string, unknown>]; cancel: [] }>()

const form = reactive({ name: '', slug: '', image: '', description: '', order: 0 })
const slugLocked = ref(false)
const rightsConfirmed = ref(false)
const error = ref('')
const saving = ref(false)

watchEffect(() => {
  if (props.initial) {
    Object.assign(form, { name: props.initial.name, slug: props.initial.slug, image: props.initial.image, description: props.initial.description, order: props.initial.order })
    slugLocked.value = true
  } else {
    Object.assign(form, { name: '', slug: '', image: '', description: '', order: 0 })
    slugLocked.value = false
  }
  rightsConfirmed.value = false
})
watch(() => form.name, (n) => { if (!slugLocked.value) form.slug = slugify(n) })

function submit() {
  error.value = ''
  if (!rightsConfirmed.value) { error.value = 'Confirm that Cloud Scart has permission to publish this image and copy.'; return }
  const doc = { ...form, slug: form.slug || slugify(form.name), order: Number(form.order) }
  const result = categorySchema.safeParse(doc)
  if (!result.success) { error.value = result.error.issues[0]?.message ?? 'Check the fields.'; return }
  saving.value = true
  emit('submit', doc)
}
defineExpose({ done: () => { saving.value = false } })
</script>

<template>
  <form class="flex flex-col gap-md" @submit.prevent="submit">
    <BaseInput v-model="form.name" label="Name" required placeholder="Category name" />
    <div class="grid grid-cols-1 gap-md sm:grid-cols-2">
      <BaseInput v-model="form.slug" label="Slug" required />
      <BaseInput v-model.number="form.order" label="Sort Order" type="number" inputmode="numeric" />
    </div>
    <ImageUploadInput v-model="form.image" label="Image" required folder="categories" />
    <BaseTextarea v-model="form.description" label="Description" :rows="3" />
    <label class="flex items-start gap-sm border border-hairline bg-surface-soft p-md text-body-sm text-body">
      <input v-model="rightsConfirmed" type="checkbox" required class="mt-1 h-4 w-4 shrink-0 accent-m-red">
      <span>I confirm Cloud Scart owns, has licensed, or has permission to publish this image and category copy.</span>
    </label>
    <p v-if="error" class="border border-m-red bg-m-red/10 px-md py-2 text-body-sm text-m-red">{{ error }}</p>
    <div class="flex flex-col-reverse gap-sm border-t border-hairline pt-md sm:flex-row sm:justify-end">
      <BaseButton type="button" variant="ghost" class="w-full sm:w-auto" @click="emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit" variant="primary" class="w-full sm:w-auto" :loading="saving">Save Category</BaseButton>
    </div>
  </form>
</template>
