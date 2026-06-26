<script setup lang="ts">
import type { Product } from '~/types'
import { formatPrice, effectivePrice } from '~/utils/format'
definePageMeta({ layout: 'admin' })

const api = useAdminApi()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const { data: categories } = await useCategories()
const products = ref<Product[]>([])
const loading = ref(true)
const search = ref('')

const modalOpen = ref(false)
const editing = ref<Product | null>(null)
const deleteTarget = ref<Product | null>(null)
const formRef = ref<{ done: () => void } | null>(null)

async function refresh() {
  loading.value = true
  try { products.value = await api.list('products') }
  catch { toast.error('Failed to load products') }
  finally { loading.value = false }
}

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return q ? products.value.filter((p) => p.title.toLowerCase().includes(q) || p.category.includes(q)) : products.value
})

function openNew() { editing.value = null; modalOpen.value = true }
function openEdit(p: Product) { editing.value = p; modalOpen.value = true }

async function onSubmit(doc: Record<string, unknown>) {
  try {
    const res = await api.save('products', doc) as { action: string }
    toast.success(`Product ${res.action}`)
    modalOpen.value = false
    await refresh()
  } catch (e) {
    toast.error((e as { statusMessage?: string }).statusMessage ?? 'Save failed')
  } finally {
    formRef.value?.done()
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  try {
    await api.remove('products', deleteTarget.value.slug)
    toast.success('Product deleted')
    deleteTarget.value = null
    await refresh()
  } catch { toast.error('Delete failed') }
}

onMounted(async () => {
  await refresh()
  // Deep links from the dashboard: ?new=1 or ?edit=slug
  if (route.query.new) openNew()
  else if (route.query.edit) {
    const target = products.value.find((p) => p.slug === route.query.edit)
    if (target) openEdit(target)
  }
  if (route.query.new || route.query.edit) router.replace({ query: {} })
})

useSeoMeta({ title: 'Manage Products', robots: 'noindex, nofollow' })
</script>

<template>
  <div class="flex flex-col gap-lg">
    <div class="flex flex-wrap items-end justify-between gap-md">
      <div>
        <div class="m-stripe mb-md w-16" />
        <h1 class="text-display-sm font-bold uppercase leading-none">Products</h1>
        <p class="mt-1 text-body-sm text-body">{{ products.length }} total</p>
      </div>
      <BaseButton variant="primary" @click="openNew">+ Add Product</BaseButton>
    </div>

    <div class="max-w-sm"><BaseInput v-model="search" placeholder="Search products…" type="search" inputmode="search" /></div>

    <div class="border border-hairline">
      <div v-if="loading" class="grid grid-cols-1 gap-px bg-hairline">
        <div v-for="n in 6" :key="n" class="h-16 animate-pulse bg-canvas" />
      </div>
      <table v-else class="w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-hairline text-caption uppercase tracking-wide text-muted">
            <th class="p-md font-medium">Product</th>
            <th class="hidden p-md font-medium sm:table-cell">Category</th>
            <th class="p-md font-medium">Price</th>
            <th class="hidden p-md font-medium md:table-cell">Stock</th>
            <th class="p-md text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.slug" class="border-b border-hairline last:border-0 hover:bg-surface-card">
            <td class="p-md">
              <div class="flex items-center gap-sm">
                <NuxtImg :src="p.images[0]" :alt="p.title" width="40" height="40" class="h-10 w-10 border border-hairline object-cover" loading="lazy" />
                <span class="text-body-sm text-ink line-clamp-1">{{ p.title }}</span>
              </div>
            </td>
            <td class="hidden p-md text-body-sm capitalize text-body sm:table-cell">{{ p.category.replace(/-/g, ' ') }}</td>
            <td class="p-md text-body-sm text-ink">{{ formatPrice(effectivePrice(p)) }}</td>
            <td class="hidden p-md md:table-cell"><span class="text-body-sm" :class="p.stock <= 5 ? 'text-warning' : 'text-body'">{{ p.stock }}</span></td>
            <td class="p-md">
              <div class="flex justify-end gap-2">
                <button class="border border-hairline px-3 py-1 text-caption uppercase text-ink hover:border-ink" @click="openEdit(p)">Edit</button>
                <button class="border border-hairline px-3 py-1 text-caption uppercase text-m-red hover:border-m-red" @click="deleteTarget = p">Delete</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="5" class="p-xl text-center text-body-sm text-muted">No products found.</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Create / edit modal -->
    <BaseModal v-model="modalOpen" :title="editing ? 'Edit Product' : 'Add Product'">
      <ProductForm ref="formRef" :initial="editing" :categories="categories ?? []" @submit="onSubmit" @cancel="modalOpen = false" />
    </BaseModal>

    <!-- Delete confirm -->
    <BaseModal :model-value="!!deleteTarget" title="Delete Product" @update:model-value="deleteTarget = null">
      <p class="text-body-md text-body">Delete <strong class="text-ink">{{ deleteTarget?.title }}</strong>? This removes its content file and cannot be undone.</p>
      <div class="mt-lg flex justify-end gap-sm">
        <BaseButton variant="ghost" @click="deleteTarget = null">Cancel</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Delete</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
