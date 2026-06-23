import type { Banner, Category, Product } from '~/types'

// ── DB → TS field mappers (exported so useAdminApi can reuse them) ────────────

export function toProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    description: (row.description as string) ?? '',
    shortDescription: (row.short_description as string) ?? '',
    category: row.category as string,
    price: Number(row.price),
    salePrice: row.sale_price != null ? Number(row.sale_price) : undefined,
    stock: Number(row.stock ?? 0),
    featured: Boolean(row.featured),
    bestSeller: Boolean(row.best_seller),
    trending: Boolean(row.trending),
    images: (row.images as string[]) ?? [],
    variants: (row.variants as Product['variants']) ?? [],
    tags: (row.tags as string[]) ?? [],
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    metaTitle: (row.meta_title as string) ?? null,
    metaDesc: (row.meta_desc as string) ?? null,
    createdAt: (row.created_at as string) ?? new Date().toISOString(),
  }
}

export function toCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: (row.title as string) ?? '',   // DB: title → TS: name
    image: (row.image as string) ?? '',
    description: (row.description as string) ?? '',
    order: Number(row.order ?? 0),
  }
}

export function toBanner(row: Record<string, unknown>): Banner {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    subtitle: (row.subtitle as string) ?? '',
    image: row.image as string,
    buttonText: (row.cta_label as string) ?? '',   // DB: cta_label → TS: buttonText
    buttonLink: (row.cta_href as string) ?? '',     // DB: cta_href  → TS: buttonLink
    active: Boolean(row.active ?? true),
    order: Number(row.order ?? 0),
  }
}

// ── Public Supabase queries ──────────────────────────────────────────────────

export function useProducts() {
  const supabase = useSupabaseClient()
  return useAsyncData('products', async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    return ((data ?? []) as Record<string, unknown>[]).map(toProduct)
  }, { default: () => [] as Product[] })
}

export function useProduct(slug: MaybeRefOrGetter<string>) {
  const supabase = useSupabaseClient()
  const key = computed(() => `product-${toValue(slug)}`)
  return useAsyncData(key.value, async () => {
    const { data } = await supabase.from('products').select('*').eq('slug', toValue(slug)).maybeSingle()
    return data ? toProduct(data as Record<string, unknown>) : null
  }, { watch: [key] })
}

export function useCategories() {
  const supabase = useSupabaseClient()
  return useAsyncData('categories', async () => {
    const { data } = await supabase.from('categories').select('*').order('order', { ascending: true })
    return ((data ?? []) as Record<string, unknown>[]).map(toCategory)
  }, { default: () => [] as Category[] })
}

export function useCategory(slug: MaybeRefOrGetter<string>) {
  const supabase = useSupabaseClient()
  return useAsyncData(`category-${toValue(slug)}`, async () => {
    const { data } = await supabase.from('categories').select('*').eq('slug', toValue(slug)).maybeSingle()
    return data ? toCategory(data as Record<string, unknown>) : null
  })
}

export function useBanners() {
  const supabase = useSupabaseClient()
  return useAsyncData('banners', async () => {
    const { data } = await supabase.from('banners').select('*').eq('active', true).order('order', { ascending: true })
    return ((data ?? []) as Record<string, unknown>[]).map(toBanner)
  }, { default: () => [] as Banner[] })
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
