<script setup lang="ts">
import type { Product, Category, ProductVariant } from '~/types'
import { productSchema } from '~/utils/schemas'
import { slugify } from '~/utils/format'

const props = defineProps<{ initial?: Product | null; categories: Category[] }>()
const emit = defineEmits<{ submit: [doc: Record<string, unknown>]; cancel: [] }>()

interface FormState {
  title: string; slug: string; category: string; shortDescription: string; description: string
  price: number; salePrice: number | null; stock: number
  featured: boolean; bestSeller: boolean; trending: boolean
  rating: number; reviewCount: number
  images: string[]; variants: ProductVariant[]; createdAt: string
}

const blank = (): FormState => ({
  title: '', slug: '', category: props.categories[0]?.slug ?? '', shortDescription: '', description: '',
  price: 0, salePrice: null, stock: 0, featured: false, bestSeller: false, trending: false,
  rating: 0, reviewCount: 0, images: [], variants: [], createdAt: new Date().toISOString(),
})

const form = reactive<FormState>(blank())
const slugLocked = ref(false)
const error = ref('')
const saving = ref(false)

watchEffect(() => {
  const p = props.initial
  if (p) {
    Object.assign(form, {
      title: p.title, slug: p.slug, category: p.category, shortDescription: p.shortDescription,
      description: p.description, price: p.price, salePrice: p.salePrice ?? null, stock: p.stock,
      featured: p.featured, bestSeller: p.bestSeller, trending: p.trending, rating: p.rating,
      reviewCount: p.reviewCount, images: [...p.images], variants: p.variants ? JSON.parse(JSON.stringify(p.variants)) : [],
      createdAt: p.createdAt,
    })
    slugLocked.value = true
  } else {
    Object.assign(form, blank())
    slugLocked.value = false
  }
})

watch(() => form.title, (t) => { if (!slugLocked.value) form.slug = slugify(t) })

const categoryOptions = computed(() => props.categories.map((c) => ({ label: c.name, value: c.slug })))

function addVariant() { form.variants.push({ name: '', options: [''] }) }
function removeVariant(i: number) { form.variants.splice(i, 1) }

function submit() {
  error.value = ''
  const images = form.images.filter(Boolean)
  const doc = {
    title: form.title, slug: form.slug || slugify(form.title), category: form.category,
    shortDescription: form.shortDescription, description: form.description,
    price: Number(form.price), salePrice: form.salePrice ? Number(form.salePrice) : null,
    stock: Number(form.stock), featured: form.featured, bestSeller: form.bestSeller, trending: form.trending,
    rating: Number(form.rating), reviewCount: Number(form.reviewCount), images,
    variants: form.variants.map((v) => ({ name: v.name, options: v.options.filter(Boolean) })).filter((v) => v.name && v.options.length),
    createdAt: form.createdAt,
  }
  const result = productSchema.safeParse(doc)
  if (!result.success) {
    error.value = result.error.issues[0]?.message ?? 'Please check the form fields.'
    return
  }
  saving.value = true
  emit('submit', doc)
}
defineExpose({ done: () => { saving.value = false } })
</script>

<template>
  <form class="flex flex-col gap-md" @submit.prevent="submit">
    <BaseInput v-model="form.title" label="Title" required placeholder="Product name" />
    <div class="grid grid-cols-1 gap-md sm:grid-cols-2">
      <BaseInput v-model="form.slug" label="Slug" required placeholder="auto-generated" />
      <BaseSelect v-model="form.category" label="Category" :options="categoryOptions" />
    </div>
    <BaseTextarea v-model="form.shortDescription" label="Short Description" :rows="2" placeholder="One-line summary shown on cards" />
    <BaseTextarea v-model="form.description" label="Full Description (markdown)" :rows="4" placeholder="Longer body shown on the product page" />

    <div class="grid grid-cols-2 gap-md sm:grid-cols-3">
      <BaseInput v-model.number="form.price" label="Price (₹)" type="number" inputmode="numeric" required />
      <BaseInput v-model.number="form.salePrice" label="Sale Price (₹)" type="number" inputmode="numeric" placeholder="optional" />
      <BaseInput v-model.number="form.stock" label="Stock" type="number" inputmode="numeric" required />
    </div>
    <div class="grid grid-cols-2 gap-md">
      <BaseInput v-model.number="form.rating" label="Rating (0–5)" type="number" inputmode="decimal" />
      <BaseInput v-model.number="form.reviewCount" label="Review Count" type="number" inputmode="numeric" />
    </div>

    <MultiImageUpload v-model="form.images" label="Images" folder="products" />

    <fieldset class="flex flex-wrap gap-lg border border-hairline p-md">
      <label class="flex items-center gap-2 text-body-sm text-body"><input v-model="form.featured" type="checkbox" class="accent-m-red"> Featured</label>
      <label class="flex items-center gap-2 text-body-sm text-body"><input v-model="form.bestSeller" type="checkbox" class="accent-m-red"> Best Seller</label>
      <label class="flex items-center gap-2 text-body-sm text-body"><input v-model="form.trending" type="checkbox" class="accent-m-red"> Trending</label>
    </fieldset>

    <!-- Variants -->
    <div class="flex flex-col gap-sm">
      <div class="flex items-center justify-between">
        <span class="text-label-uppercase uppercase text-body-strong">Variants</span>
        <button type="button" class="text-caption uppercase tracking-wide text-ink hover:text-m-red" @click="addVariant">+ Add Variant</button>
      </div>
      <div v-for="(v, i) in form.variants" :key="i" class="flex flex-col gap-2 border border-hairline p-sm sm:flex-row sm:items-end">
        <div class="flex-1"><BaseInput v-model="v.name" label="Name" placeholder="e.g. Colour" /></div>
        <div class="flex-[2]">
          <label class="mb-2 block text-label-uppercase uppercase text-body-strong">Options (comma separated)</label>
          <input :value="v.options.join(', ')" class="h-12 w-full border border-hairline bg-surface-card px-md text-body-md text-ink focus:border-ink focus:outline-none" placeholder="Red, Blue, Green" @input="v.options = ($event.target as HTMLInputElement).value.split(',').map((s) => s.trim())">
        </div>
        <button type="button" class="flex h-12 w-12 shrink-0 items-center justify-center border border-hairline text-muted hover:border-m-red hover:text-m-red" @click="removeVariant(i)">✕</button>
      </div>
    </div>

    <p v-if="error" class="border border-m-red bg-m-red/10 px-md py-2 text-body-sm text-m-red">{{ error }}</p>

    <div class="flex justify-end gap-sm border-t border-hairline pt-md">
      <BaseButton type="button" variant="ghost" @click="emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit" variant="primary" :loading="saving">Save Product</BaseButton>
    </div>
  </form>
</template>
