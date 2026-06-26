<script setup lang="ts">
import type { Banner } from '~/types'
definePageMeta({ layout: 'admin' })

const api = useAdminApi()
const toast = useToast()
const route = useRoute()
const router = useRouter()

type BannerRow = Banner & { slug: string }
const items = ref<BannerRow[]>([])
const loading = ref(true)
const modalOpen = ref(false)
const editing = ref<BannerRow | null>(null)
const deleteTarget = ref<BannerRow | null>(null)
const formRef = ref<{ done: () => void } | null>(null)

const withSlug = (b: Banner): BannerRow => ({ ...b, slug: b.slug || (b as { _path?: string })._path?.split('/').pop() || '' })

async function refresh() {
  loading.value = true
  try { items.value = (await api.list('banners')).map(withSlug) }
  catch { toast.error('Failed to load banners') }
  finally { loading.value = false }
}

function openNew() { editing.value = null; modalOpen.value = true }
function openEdit(b: BannerRow) { editing.value = b; modalOpen.value = true }

async function onSubmit(doc: Record<string, unknown>) {
  try {
    const res = await api.save('banners', doc) as { action: string }
    toast.success(`Banner ${res.action}`)
    modalOpen.value = false
    await refresh()
  } catch (e) { toast.error((e as { statusMessage?: string }).statusMessage ?? 'Save failed') }
  finally { formRef.value?.done() }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  try { await api.remove('banners', deleteTarget.value.slug); toast.success('Banner deleted'); deleteTarget.value = null; await refresh() }
  catch { toast.error('Delete failed') }
}

onMounted(async () => {
  await refresh()
  if (route.query.new) openNew()
  if (route.query.new) router.replace({ query: {} })
})

useSeoMeta({ title: 'Manage Banners', robots: 'noindex, nofollow' })
</script>

<template>
  <div class="flex flex-col gap-lg">
    <div class="flex flex-wrap items-end justify-between gap-md">
      <div>
        <div class="m-stripe mb-md w-16" />
        <h1 class="text-display-sm font-bold uppercase leading-none">Banners</h1>
        <p class="mt-1 text-body-sm text-body">{{ items.length }} total</p>
      </div>
      <BaseButton variant="primary" @click="openNew">+ Add Banner</BaseButton>
    </div>

    <div v-if="loading" class="flex flex-col gap-md">
      <LoadingSkeleton v-for="n in 3" :key="n" variant="block" />
    </div>
    <div v-else class="flex flex-col gap-md">
      <div v-for="b in items" :key="b.slug" class="relative overflow-hidden border border-hairline">
        <NuxtImg :src="b.image" :alt="b.title" width="800" height="200" class="absolute inset-0 h-full w-full object-cover opacity-25" loading="lazy" />
        <div class="relative flex items-center justify-between gap-md p-lg">
          <div>
            <p class="text-title-md font-bold uppercase text-ink">{{ b.title }}</p>
            <p class="text-caption text-body line-clamp-1">{{ b.subtitle }}</p>
            <p class="mt-1 text-caption text-muted">→ {{ b.buttonText }} · {{ b.buttonLink }}</p>
          </div>
          <div class="flex shrink-0 flex-col gap-2">
            <button class="border border-hairline bg-canvas px-3 py-1 text-caption uppercase text-ink hover:border-ink" @click="openEdit(b)">Edit</button>
            <button class="border border-hairline bg-canvas px-3 py-1 text-caption uppercase text-m-red hover:border-m-red" @click="deleteTarget = b">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <BaseModal v-model="modalOpen" :title="editing ? 'Edit Banner' : 'Add Banner'">
      <BannerForm ref="formRef" :initial="editing" @submit="onSubmit" @cancel="modalOpen = false" />
    </BaseModal>

    <BaseModal :model-value="!!deleteTarget" title="Delete Banner" @update:model-value="deleteTarget = null">
      <p class="text-body-md text-body">Delete the banner <strong class="text-ink">{{ deleteTarget?.title }}</strong>?</p>
      <div class="mt-lg flex justify-end gap-sm">
        <BaseButton variant="ghost" @click="deleteTarget = null">Cancel</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Delete</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
