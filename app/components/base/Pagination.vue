<script setup lang="ts">
interface Props { page: number; total: number; perPage: number }
const props = defineProps<Props>()
const emit = defineEmits<{ 'update:page': [page: number] }>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)))

// Compact page window with ellipses.
const pages = computed<(number | '…')[]>(() => {
  const last = pageCount.value
  const cur = props.page
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
  const out: (number | '…')[] = [1]
  if (cur > 3) out.push('…')
  for (let i = Math.max(2, cur - 1); i <= Math.min(last - 1, cur + 1); i++) out.push(i)
  if (cur < last - 2) out.push('…')
  out.push(last)
  return out
})

const go = (p: number) => { if (p >= 1 && p <= pageCount.value && p !== props.page) emit('update:page', p) }
</script>

<template>
  <nav v-if="pageCount > 1" class="flex items-center justify-center gap-xs" aria-label="Pagination">
    <button class="flex h-10 w-10 items-center justify-center border border-hairline text-white disabled:opacity-30 hover:border-white" :disabled="page === 1" aria-label="Previous page" @click="go(page - 1)">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6" /></svg>
    </button>
    <template v-for="(pg, i) in pages" :key="i">
      <span v-if="pg === '…'" class="px-2 text-muted">…</span>
      <button
        v-else
        class="h-10 min-w-[40px] border px-2 text-label-uppercase transition-colors"
        :class="pg === page ? 'border-white bg-white text-on-primary' : 'border-hairline text-white hover:border-white'"
        :aria-current="pg === page ? 'page' : undefined"
        @click="go(pg)"
      >{{ pg }}</button>
    </template>
    <button class="flex h-10 w-10 items-center justify-center border border-hairline text-white disabled:opacity-30 hover:border-white" :disabled="page === pageCount" aria-label="Next page" @click="go(page + 1)">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6" /></svg>
    </button>
  </nav>
</template>
