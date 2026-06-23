<script setup lang="ts">
import type { Category } from '~/types'
import { categorySchema } from '~/utils/schemas'
import { slugify } from '~/utils/format'

const props = defineProps<{ initial?: Category | null }>()
const emit = defineEmits<{ submit: [doc: Record<string, unknown>]; cancel: [] }>()

const form = reactive({ name: '', slug: '', image: '', description: '', order: 0 })
const slugLocked = ref(false)
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
})
watch(() => form.name, (n) => { if (!slugLocked.value) form.slug = slugify(n) })

function submit() {
  error.value = ''
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
    <p v-if="error" class="border border-m-red bg-m-red/10 px-md py-2 text-body-sm text-m-red">{{ error }}</p>
    <div class="flex justify-end gap-sm border-t border-hairline pt-md">
      <BaseButton type="button" variant="ghost" @click="emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit" variant="primary" :loading="saving">Save Category</BaseButton>
    </div>
  </form>
</template>
