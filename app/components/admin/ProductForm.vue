<script setup lang="ts">
import type { Product, Category, ProductVariant } from '~/types'
import { productSchema } from '~/utils/schemas'
import { slugify } from '~/utils/format'

const props = defineProps<{ initial?: Product | null; categories: Category[] }>()
const emit = defineEmits<{ submit: [doc: Record<string, unknown>]; cancel: [] }>()

interface FormState {
  title: string; slug: string; category: string; shortDescription: string; description: string
  brand: string; manufacturer: string; importer: string; countryOfOrigin: string; netQuantity: string
  warrantyInfo: string; safetyInformation: string
  price: number; salePrice: number | null; stock: number
  featured: boolean
  images: string[]; variants: ProductVariant[]; createdAt: string
}

const blank = (): FormState => ({
  title: '', slug: '', category: props.categories[0]?.slug ?? '', shortDescription: '', description: '',
  brand: '', manufacturer: '', importer: '', countryOfOrigin: '', netQuantity: '', warrantyInfo: '', safetyInformation: '',
  price: 0, salePrice: null, stock: 0, featured: false,
  images: [], variants: [], createdAt: new Date().toISOString(),
})

const form = reactive<FormState>(blank())
const slugLocked = ref(false)
const rightsConfirmed = ref(false)
const error = ref('')
const saving = ref(false)

watchEffect(() => {
  const p = props.initial
  if (p) {
    Object.assign(form, {
      title: p.title, slug: p.slug, category: p.category, shortDescription: p.shortDescription,
      description: p.description, price: p.price, salePrice: p.salePrice ?? null, stock: p.stock,
      brand: p.brand, manufacturer: p.manufacturer, importer: p.importer, countryOfOrigin: p.countryOfOrigin,
      netQuantity: p.netQuantity, warrantyInfo: p.warrantyInfo, safetyInformation: p.safetyInformation,
      featured: p.featured,
      images: [...p.images], variants: p.variants ? JSON.parse(JSON.stringify(p.variants)) : [],
      createdAt: p.createdAt,
    })
    slugLocked.value = true
  } else {
    Object.assign(form, blank())
    slugLocked.value = false
  }
  rightsConfirmed.value = false
})

watch(() => form.title, (t) => { if (!slugLocked.value) form.slug = slugify(t) })

const categoryOptions = computed(() => props.categories.map((c) => ({ label: c.name, value: c.slug })))

function addVariant() { form.variants.push({ name: '', options: [''] }) }
function removeVariant(i: number) { form.variants.splice(i, 1) }

function submit() {
  error.value = ''
  if (!rightsConfirmed.value) {
    error.value = 'Confirm that Cloud Scart has permission to publish the product images and copy.'
    return
  }
  const images = form.images.filter(Boolean)
  const doc = {
    title: form.title, slug: form.slug || slugify(form.title), category: form.category,
    shortDescription: form.shortDescription, description: form.description,
    brand: form.brand, manufacturer: form.manufacturer, importer: form.importer,
    countryOfOrigin: form.countryOfOrigin, netQuantity: form.netQuantity,
    warrantyInfo: form.warrantyInfo, safetyInformation: form.safetyInformation,
    price: Number(form.price), salePrice: form.salePrice ? Number(form.salePrice) : null,
    stock: Number(form.stock), featured: form.featured, bestSeller: false, trending: false,
    rating: 0, reviewCount: 0, images,
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
    <BaseTextarea v-model="form.description" label="Full Description" :rows="4" placeholder="Longer body shown on the product page" />

    <fieldset class="flex flex-col gap-md border border-hairline p-md">
      <legend class="px-2 text-label-uppercase uppercase text-body-strong">Mandatory Product Disclosures</legend>
      <div class="grid grid-cols-1 gap-md sm:grid-cols-3">
        <BaseInput v-model="form.brand" label="Brand" placeholder="Brand or unbranded" />
        <BaseInput v-model="form.countryOfOrigin" label="Country of Origin" required placeholder="e.g. India" />
        <BaseInput v-model="form.netQuantity" label="Net Quantity" required placeholder="e.g. 1 unit" />
      </div>
      <BaseTextarea v-model="form.manufacturer" label="Manufacturer / Packer Name & Address" required :rows="2" placeholder="Legal name and complete postal address" />
      <BaseTextarea v-model="form.importer" label="Importer Name & Address (if imported)" :rows="2" placeholder="Required for imported products" />
      <BaseTextarea v-model="form.warrantyInfo" label="Warranty / Guarantee" :rows="2" placeholder="State coverage and duration, or clearly state none" />
      <BaseTextarea v-model="form.safetyInformation" label="Safety & Age Guidance" :rows="2" placeholder="Warnings, supervision and safe-use instructions" />
    </fieldset>

    <div class="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
      <BaseInput v-model.number="form.price" label="Price (₹)" type="number" inputmode="numeric" required />
      <BaseInput v-model.number="form.salePrice" label="Sale Price (₹)" type="number" inputmode="numeric" placeholder="optional" />
      <BaseInput v-model.number="form.stock" label="Stock" type="number" inputmode="numeric" required />
    </div>
    <MultiImageUpload v-model="form.images" label="Images" folder="products" />
    <label class="flex items-start gap-sm border border-hairline bg-surface-soft p-md text-body-sm text-body">
      <input v-model="rightsConfirmed" type="checkbox" required class="mt-1 h-4 w-4 shrink-0 accent-m-red">
      <span>I confirm Cloud Scart owns, has licensed, or has permission to publish these images and this product copy.</span>
    </label>

    <fieldset class="border border-hairline p-md">
      <label class="flex items-center gap-2 text-body-sm text-body"><input v-model="form.featured" type="checkbox" class="accent-m-red"> Featured</label>
    </fieldset>

    <!-- Variants -->
    <section class="flex scroll-mt-4 flex-col gap-sm border-t border-hairline pt-md" aria-labelledby="variants-heading">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span id="variants-heading" class="text-label-uppercase uppercase text-body-strong">Variants</span>
        <button type="button" class="flex min-h-11 w-full items-center justify-center border border-hairline px-md text-caption uppercase tracking-wide text-ink hover:border-ink hover:text-m-red sm:w-auto sm:border-0 sm:px-0" @click="addVariant">+ Add Variant</button>
      </div>
      <div v-for="(v, i) in form.variants" :key="i" class="flex flex-col gap-2 border border-hairline p-sm md:flex-row md:items-end">
        <div class="flex-1"><BaseInput v-model="v.name" label="Name" placeholder="e.g. Colour" /></div>
        <div class="flex-[2]">
          <label class="mb-2 block text-label-uppercase uppercase text-body-strong">Options (comma separated)</label>
          <input :value="v.options.join(', ')" class="h-12 w-full border border-hairline bg-surface-card px-md text-body-md text-ink focus:border-ink focus:outline-none" placeholder="Red, Blue, Green" @input="v.options = ($event.target as HTMLInputElement).value.split(',').map((s) => s.trim())">
        </div>
        <button type="button" class="flex h-12 w-full shrink-0 items-center justify-center border border-hairline text-muted hover:border-m-red hover:text-m-red md:w-12" @click="removeVariant(i)">✕</button>
      </div>
    </section>

    <p v-if="error" class="border border-m-red bg-m-red/10 px-md py-2 text-body-sm text-m-red">{{ error }}</p>

    <div class="mt-1 flex flex-col-reverse gap-sm border-t border-hairline pt-md sm:flex-row sm:justify-end">
      <BaseButton type="button" variant="ghost" class="w-full sm:w-auto" @click="emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit" variant="primary" class="w-full sm:w-auto" :loading="saving">Save Product</BaseButton>
    </div>
  </form>
</template>
