<script setup lang="ts">
import { formatPrice, effectivePrice, isOnSale, discountPercent } from '~/utils/format'
import { buildEnquiryUrl } from '~/composables/useWhatsapp'
import { SITE } from '~/constants/site'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const slug = computed(() => route.params.slug as string)

const { data: product } = await useProduct(slug)
const { data: allProducts } = await useProducts()

if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })
}

const cart = useCartStore()
const ui = useUiStore()

const quantity = ref(1)
const selectedVariants = reactive<Record<string, string>>({})

// Default each variant to its first option.
watchEffect(() => {
  for (const v of product.value?.variants ?? []) {
    if (!selectedVariants[v.name]) selectedVariants[v.name] = v.options[0] ?? ''
  }
})

const price = computed(() => effectivePrice(product.value!))
const onSale = computed(() => isOnSale(product.value!))
const discount = computed(() => discountPercent(product.value!))
const inStock = computed(() => (product.value?.stock ?? 0) > 0)
const importerRequired = computed(() => Boolean(
  product.value?.countryOfOrigin.trim()
  && product.value.countryOfOrigin.toLocaleLowerCase('en-IN') !== 'india',
))
const listingComplete = computed(() => Boolean(
  product.value?.manufacturer.trim()
  && product.value?.countryOfOrigin.trim()
  && product.value?.netQuantity.trim()
  && (!importerRequired.value || product.value?.importer.trim()),
))
const lowStock = computed(() => inStock.value && product.value!.stock <= 5)

const related = computed(() => relatedProducts(allProducts.value ?? [], product.value!, 4))
const enquiryUrl = computed(() => buildEnquiryUrl(`Hi! I'm interested in the ${product.value?.title} (${SITE.url}/product/${slug.value}). Is it available?`))

function addToCart() {
  if (!inStock.value || !listingComplete.value) return
  cart.add(product.value!, quantity.value, { ...selectedVariants })
  ui.openCart()
}
function buyNow() {
  if (!inStock.value || !listingComplete.value) return
  cart.add(product.value!, quantity.value, { ...selectedVariants })
  navigateTo('/checkout')
}

const categoryName = computed(() => (product.value?.category ?? '').replace(/-/g, ' '))

useSeoMeta({
  title: () => product.value?.title,
  description: () => product.value?.shortDescription,
  ogTitle: () => product.value?.title,
  ogDescription: () => product.value?.shortDescription,
  ogImage: () => {
    const image = product.value?.images[0]
    return image?.startsWith('http') ? image : `${runtimeConfig.public.siteUrl}${image || '/og-image.png'}`
  },
  ogType: 'website',
})
useProductSchema(product)
useBreadcrumbSchema(() => [
  { name: 'Home', item: '/' },
  { name: 'Shop', item: '/shop' },
  { name: product.value?.title ?? '', item: `/product/${slug.value}` },
])
</script>

<template>
  <div v-if="product" class="container-cloud py-xl md:py-xxl">
    <Breadcrumb
      :items="[
        { name: 'Home', to: '/' },
        { name: 'Shop', to: '/shop' },
        { name: categoryName, to: `/category/${product.category}` },
        { name: product.title },
      ]"
      class="mb-lg"
    />

    <div class="grid grid-cols-1 gap-xl lg:grid-cols-2">
      <!-- Gallery -->
      <ProductGallery :images="product.images" :alt="product.title" />

      <!-- Info -->
      <div class="flex flex-col gap-lg">
        <div class="flex flex-col gap-sm">
          <NuxtLink :to="`/category/${product.category}`" class="kicker text-body hover:text-ink">{{ categoryName }}</NuxtLink>
          <h1 class="text-display-sm font-bold uppercase leading-none text-ink md:text-display-md">{{ product.title }}</h1>
        </div>

        <div class="flex items-end gap-md">
          <span class="text-display-sm font-bold text-ink">{{ formatPrice(price) }}</span>
          <template v-if="onSale">
            <span class="pb-1 text-title-md text-muted line-through">{{ formatPrice(product.price) }}</span>
            <span class="mb-1.5 bg-m-red px-2 py-1 text-caption font-bold uppercase tracking-wide text-white">Save {{ discount }}%</span>
          </template>
        </div>

        <p class="text-body-md text-body">{{ product.shortDescription }}</p>

        <p class="text-caption text-muted">Price includes applicable taxes. Shipping is shown separately before checkout.</p>

        <div v-if="!listingComplete" class="border border-warning bg-warning/10 p-md text-body-sm text-warning">
          Online ordering is paused until all mandatory manufacturer, importer (when applicable), country-of-origin and net-quantity details are completed. Please ask us on WhatsApp before purchase.
        </div>

        <div class="brand-stripe w-24" />

        <!-- Stock -->
        <div class="flex items-center gap-2 text-body-sm">
          <span class="h-2 w-2 rounded-full" :class="inStock ? 'bg-success' : 'bg-m-red'" />
          <span v-if="lowStock" class="text-warning">Only {{ product.stock }} left in stock</span>
          <span v-else-if="inStock" class="text-body">In stock</span>
          <span v-else class="text-m-red">Currently out of stock</span>
        </div>

        <!-- Variants -->
        <div v-for="v in product.variants" :key="v.name" class="flex flex-col gap-sm">
          <span class="text-label-uppercase uppercase text-body-strong">{{ v.name }}</span>
          <div class="flex flex-wrap gap-sm">
            <button
              v-for="opt in v.options"
              :key="opt"
              class="h-11 border px-md text-body-sm transition-colors"
              :class="selectedVariants[v.name] === opt ? 'border-ink bg-ink text-on-primary' : 'border-hairline text-ink hover:border-ink'"
              @click="selectedVariants[v.name] = opt"
            >{{ opt }}</button>
          </div>
        </div>

        <!-- Quantity + actions -->
        <div class="flex flex-col gap-md pt-sm">
          <div class="flex items-center gap-md">
            <span class="text-label-uppercase uppercase text-body-strong">Qty</span>
            <QuantitySelector v-model="quantity" :max="Math.max(1, product.stock)" />
          </div>
          <div class="grid grid-cols-1 gap-sm sm:grid-cols-2">
            <BaseButton variant="outline" size="lg" :disabled="!inStock || !listingComplete" block @click="addToCart">Add to Cart</BaseButton>
            <BaseButton variant="primary" size="lg" :disabled="!inStock || !listingComplete" block @click="buyNow">Buy Now</BaseButton>
          </div>
          <a :href="enquiryUrl" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 text-label-uppercase uppercase tracking-[1.5px] text-success hover:underline">
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Z" /></svg>
            Ask on WhatsApp
          </a>
        </div>

        <!-- Trust strip -->
        <div class="grid grid-cols-3 gap-sm border-t border-hairline pt-lg text-center">
          <div class="flex flex-col gap-1"><span class="text-body-sm font-medium text-ink">Free Shipping</span><span class="text-caption text-muted">Over ₹999</span></div>
          <div class="flex flex-col gap-1"><span class="text-body-sm font-medium text-ink">Cash on Delivery</span><span class="text-caption text-muted">Pay on arrival</span></div>
          <div class="flex flex-col gap-1"><span class="text-body-sm font-medium text-ink">Issue Support</span><span class="text-caption text-muted">Damaged or wrong items</span></div>
        </div>
      </div>
    </div>

    <!-- Description (markdown body) -->
    <section class="mt-xxl grid grid-cols-1 gap-xl border-t border-hairline pt-xxl lg:grid-cols-[1fr_2fr]">
      <div>
        <div class="brand-stripe mb-lg w-20" />
        <h2 class="text-display-sm font-bold uppercase leading-none text-ink">Details</h2>
      </div>
      <div class="prose-cloud max-w-none">
        <p v-if="product.description" class="whitespace-pre-line text-body-md text-body">{{ product.description }}</p>
      </div>
    </section>

    <section class="mt-xl grid grid-cols-1 gap-xl border-t border-hairline pt-xl lg:grid-cols-[1fr_2fr]">
      <div>
        <div class="brand-stripe mb-lg w-20" />
        <h2 class="text-display-sm font-bold uppercase leading-none text-ink">Product Information</h2>
      </div>
      <dl class="grid grid-cols-1 border border-hairline sm:grid-cols-2">
        <div v-if="product.brand" class="border-b border-hairline p-md sm:border-r"><dt class="kicker text-muted">Brand</dt><dd class="mt-1 text-body-sm text-ink">{{ product.brand }}</dd></div>
        <div class="border-b border-hairline p-md"><dt class="kicker text-muted">Country of Origin</dt><dd class="mt-1 text-body-sm text-ink">{{ product.countryOfOrigin || 'Pending' }}</dd></div>
        <div class="border-b border-hairline p-md sm:border-r"><dt class="kicker text-muted">Net Quantity</dt><dd class="mt-1 text-body-sm text-ink">{{ product.netQuantity || 'Pending' }}</dd></div>
        <div class="border-b border-hairline p-md"><dt class="kicker text-muted">Manufacturer / Packer</dt><dd class="mt-1 whitespace-pre-line text-body-sm text-ink">{{ product.manufacturer || 'Pending' }}</dd></div>
        <div v-if="product.importer || importerRequired" class="border-b border-hairline p-md sm:border-r"><dt class="kicker text-muted">Importer</dt><dd class="mt-1 whitespace-pre-line text-body-sm text-ink">{{ product.importer || 'Pending' }}</dd></div>
        <div v-if="product.warrantyInfo" class="border-b border-hairline p-md"><dt class="kicker text-muted">Warranty</dt><dd class="mt-1 whitespace-pre-line text-body-sm text-ink">{{ product.warrantyInfo }}</dd></div>
        <div v-if="product.safetyInformation" class="p-md sm:col-span-2"><dt class="kicker text-muted">Safety Information</dt><dd class="mt-1 whitespace-pre-line text-body-sm text-ink">{{ product.safetyInformation }}</dd></div>
      </dl>
    </section>

    <!-- Related -->
    <section v-if="related.length" class="mt-xxl border-t border-hairline pt-xxl">
      <SectionHeader kicker="You May Also Like" title="Related Products" :link="`/category/${product.category}`" />
      <ProductGrid :products="related" />
    </section>
  </div>
</template>
