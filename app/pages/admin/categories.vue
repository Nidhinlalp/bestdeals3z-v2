<script setup lang="ts">
import type { Category } from '~/types'
definePageMeta({ layout: 'admin' })

const api = useAdminApi()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const items = ref<Category[]>([])
const loading = ref(true)
const modalOpen = ref(false)
const editing = ref<Category | null>(null)
const deleteTarget = ref<Category | null>(null)
const formRef = ref<{ done: () => void } | null>(null)

async function refresh() {
  loading.value = true
  try { items.value = await api.list('categories') }
  catch { toast.error('Failed to load categories') }
  finally { loading.value = false }
}

function openNew() { editing.value = null; modalOpen.value = true }
function openEdit(c: Category) { editing.value = c; modalOpen.value = true }

async function onSubmit(doc: Record<string, unknown>) {
  try {
    const res = await api.save('categories', doc) as { action: string }
    toast.success(`Category ${res.action}`)
    modalOpen.value = false
    await refresh()
  } catch (e) { toast.error((e as { statusMessage?: string }).statusMessage ?? 'Save failed') }
  finally { formRef.value?.done() }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  try { await api.remove('categories', deleteTarget.value.slug); toast.success('Category deleted'); deleteTarget.value = null; await refresh() }
  catch { toast.error('Delete failed') }
}

onMounted(async () => {
  await refresh()
  if (route.query.new) openNew()
  if (route.query.new) router.replace({ query: {} })
})

useSeoMeta({ title: 'Manage Categories', robots: 'noindex, nofollow' })
</script>

<template>
  <div class="flex flex-col gap-lg">
    <div class="flex flex-wrap items-end justify-between gap-md">
      <div>
        <div class="m-stripe mb-md w-16" />
        <h1 class="text-display-sm font-bold uppercase leading-none">Categories</h1>
        <p class="mt-1 text-body-sm text-body">{{ items.length }} total</p>
      </div>
      <BaseButton variant="primary" @click="openNew">+ Add Category</BaseButton>
    </div>

    <div v-if="loading" class="grid grid-cols-2 gap-md md:grid-cols-3 lg:grid-cols-4">
      <LoadingSkeleton v-for="n in 4" :key="n" variant="card" />
    </div>
    <div v-else class="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="c in items" :key="c.slug" class="flex items-center gap-md border border-hairline p-md">
        <NuxtImg :src="c.image" :alt="c.name" width="64" height="64" class="h-16 w-16 shrink-0 border border-hairline object-cover" loading="lazy" />
        <div class="flex-1 overflow-hidden">
          <p class="text-body-md font-medium text-white line-clamp-1">{{ c.name }}</p>
          <p class="text-caption text-muted line-clamp-1">{{ c.description }}</p>
        </div>
        <div class="flex shrink-0 flex-col gap-2">
          <button class="border border-hairline px-3 py-1 text-caption uppercase text-white hover:border-white" @click="openEdit(c)">Edit</button>
          <button class="border border-hairline px-3 py-1 text-caption uppercase text-m-red hover:border-m-red" @click="deleteTarget = c">Delete</button>
        </div>
      </div>
    </div>

    <BaseModal v-model="modalOpen" :title="editing ? 'Edit Category' : 'Add Category'">
      <CategoryForm ref="formRef" :initial="editing" @submit="onSubmit" @cancel="modalOpen = false" />
    </BaseModal>

    <BaseModal :model-value="!!deleteTarget" title="Delete Category" @update:model-value="deleteTarget = null">
      <p class="text-body-md text-body">Delete <strong class="text-white">{{ deleteTarget?.name }}</strong>? Products in this category will remain but become uncategorised.</p>
      <div class="mt-lg flex justify-end gap-sm">
        <BaseButton variant="ghost" @click="deleteTarget = null">Cancel</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Delete</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
