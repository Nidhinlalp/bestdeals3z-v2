<script setup lang="ts">
import type { Product } from '~/types'
import { formatPrice, effectivePrice, isOnSale, discountPercent } from '~/utils/format'

const props = defineProps<{ product: Product }>()

const cart = useCartStore()
const ui = useUiStore()

const price = computed(() => effectivePrice(props.product))
const onSale = computed(() => isOnSale(props.product))
const discount = computed(() => discountPercent(props.product))
const outOfStock = computed(() => props.product.stock <= 0)
const listingComplete = computed(() => Boolean(
  props.product.manufacturer.trim()
  && props.product.countryOfOrigin.trim()
  && props.product.netQuantity.trim()
  && (props.product.countryOfOrigin.toLocaleLowerCase('en-IN') === 'india' || props.product.importer.trim()),
))
const hasVariants = computed(() => (props.product.variants?.length ?? 0) > 0)

function quickAdd() {
  if (outOfStock.value || !listingComplete.value) return
  // Products with variant choices route to the PDP to pick options first.
  if (hasVariants.value) {
    navigateTo(`/product/${props.product.slug}`)
    return
  }
  cart.add(props.product, 1)
  ui.openCart()
}
</script>

<template>
  <article class="group relative flex flex-col border border-hairline bg-canvas transition-colors hover:border-ink">
    <NuxtLink :to="`/product/${product.slug}`" class="relative block aspect-square overflow-hidden bg-surface-soft">
      <NuxtImg
        :src="product.images[0]"
        :alt="product.title"
        width="600"
        height="600"
        sizes="sm:50vw md:33vw lg:25vw"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <span v-if="onSale" class="absolute left-0 top-0 bg-m-red px-2 py-1 text-caption font-bold uppercase tracking-wide text-white">-{{ discount }}%</span>
      <span v-if="outOfStock" class="absolute inset-0 flex items-center justify-center bg-black/70 text-label-uppercase uppercase tracking-widest text-white">Out of Stock</span>
      <span v-else-if="!listingComplete" class="absolute inset-0 flex items-center justify-center bg-black/70 px-md text-center text-label-uppercase uppercase tracking-widest text-white">Details Pending</span>
    </NuxtLink>

    <div class="flex flex-1 flex-col gap-2 p-md">
      <NuxtLink :to="`/category/${product.category}`" class="kicker text-muted hover:text-ink">{{ product.category.replace(/-/g, ' ') }}</NuxtLink>
      <NuxtLink :to="`/product/${product.slug}`" class="text-title-sm font-bold leading-tight text-ink line-clamp-2 hover:text-body">{{ product.title }}</NuxtLink>
      <div class="mt-auto flex items-end justify-between gap-2 pt-sm">
        <div class="flex flex-col">
          <span class="text-title-md font-bold text-ink">{{ formatPrice(price) }}</span>
          <span v-if="onSale" class="text-body-sm text-muted line-through">{{ formatPrice(product.price) }}</span>
        </div>
        <button
          class="flex h-11 w-11 items-center justify-center border border-hairline text-ink transition-colors hover:bg-ink hover:text-on-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
          :disabled="outOfStock || !listingComplete"
          :aria-label="!listingComplete ? `Ordering unavailable for ${product.title} until product details are complete` : hasVariants ? `Choose options for ${product.title}` : `Add ${product.title} to cart`"
          @click="quickAdd"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></svg>
        </button>
      </div>
    </div>
  </article>
</template>
