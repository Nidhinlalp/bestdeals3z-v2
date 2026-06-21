import type { Banner, Category, Product } from '~/types'

/**
 * Thin, typed wrappers around Nuxt Content queries.
 * Each returns an async-data handle so pages stay SSR + cache friendly.
 */

export function useProducts() {
  return useAsyncData('products', () =>
    queryContent<Product>('products').sort({ createdAt: -1 }).find(),
    { default: () => [] as Product[] },
  )
}

export function useProduct(slug: MaybeRefOrGetter<string>) {
  const key = computed(() => `product-${toValue(slug)}`)
  return useAsyncData(
    key.value,
    () => queryContent<Product>('products').where({ slug: toValue(slug) }).findOne(),
    { watch: [key] },
  )
}

export function useCategories() {
  return useAsyncData('categories', () =>
    queryContent<Category>('categories').sort({ order: 1 }).find(),
    { default: () => [] as Category[] },
  )
}

export function useCategory(slug: MaybeRefOrGetter<string>) {
  return useAsyncData(`category-${toValue(slug)}`, () =>
    queryContent<Category>('categories').where({ slug: toValue(slug) }).findOne(),
  )
}

export function useBanners() {
  return useAsyncData('banners', () =>
    queryContent<Banner>('banners').sort({ order: 1 }).find(),
    { default: () => [] as Banner[] },
  )
}

/** Featured / flag-based product collections, computed client+server side. */
export function useProductCollections(products: Ref<Product[]>) {
  const featured = computed(() => products.value.filter((p) => p.featured))
  const bestSellers = computed(() => products.value.filter((p) => p.bestSeller))
  const trending = computed(() => products.value.filter((p) => p.trending))
  return { featured, bestSellers, trending }
}

/** Related products: same category, excluding the current product. */
export function relatedProducts(all: Product[], current: Product, limit = 4): Product[] {
  return all
    .filter((p) => p.category === current.category && p.slug !== current.slug)
    .slice(0, limit)
}
