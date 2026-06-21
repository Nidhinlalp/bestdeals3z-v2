<script setup lang="ts">
import type { Banner } from '~/types'
import { bannerSchema } from '~/utils/schemas'
import { slugify } from '~/utils/format'

const props = defineProps<{ initial?: (Banner & { slug?: string }) | null }>()
const emit = defineEmits<{ submit: [doc: Record<string, unknown>]; cancel: [] }>()

const form = reactive({ title: '', slug: '', subtitle: '', image: '', buttonText: 'Shop Now', buttonLink: '/shop', order: 0 })
const error = ref('')
const saving = ref(false)

watchEffect(() => {
  if (props.initial) {
    Object.assign(form, {
      title: props.initial.title, slug: props.initial.slug ?? props.initial._path?.split('/').pop() ?? '',
      subtitle: props.initial.subtitle, image: props.initial.image,
      buttonText: props.initial.buttonText, buttonLink: props.initial.buttonLink, order: props.initial.order,
    })
  } else {
    Object.assign(form, { title: '', slug: '', subtitle: '', image: '', buttonText: 'Shop Now', buttonLink: '/shop', order: 0 })
  }
})

function submit() {
  error.value = ''
  const slug = form.slug || slugify(form.title)
  const doc = { ...form, slug, order: Number(form.order) }
  const result = bannerSchema.safeParse(doc)
  if (!result.success) { error.value = result.error.issues[0]?.message ?? 'Check the fields.'; return }
  saving.value = true
  emit('submit', doc)
}
defineExpose({ done: () => { saving.value = false } })
</script>

<template>
  <form class="flex flex-col gap-md" @submit.prevent="submit">
    <BaseInput v-model="form.title" label="Title" required placeholder="HEADLINE IN UPPERCASE" />
    <BaseInput v-model="form.slug" label="Slug / File name" required placeholder="banner-1" />
    <BaseTextarea v-model="form.subtitle" label="Subtitle" :rows="2" />
    <BaseInput v-model="form.image" label="Image Path" required placeholder="/banners/banner-1.svg" />
    <div class="grid grid-cols-1 gap-md sm:grid-cols-2">
      <BaseInput v-model="form.buttonText" label="Button Text" />
      <BaseInput v-model="form.buttonLink" label="Button Link" placeholder="/shop or /category/drones" />
    </div>
    <BaseInput v-model.number="form.order" label="Sort Order" type="number" inputmode="numeric" />
    <p v-if="error" class="border border-m-red bg-m-red/10 px-md py-2 text-body-sm text-m-red">{{ error }}</p>
    <div class="flex justify-end gap-sm border-t border-hairline pt-md">
      <BaseButton type="button" variant="ghost" @click="emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit" variant="primary" :loading="saving">Save Banner</BaseButton>
    </div>
  </form>
</template>
