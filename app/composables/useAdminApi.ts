import type { Product, Category, Banner } from '~/types'
import { toProduct, toCategory, toBanner } from './useCatalog'

type ContentType = 'products' | 'categories' | 'banners'
type TableMap = { products: Product; categories: Category; banners: Banner }

const MAPPERS = {
  products: toProduct,
  categories: toCategory,
  banners: toBanner,
} as const

/** Admin CRUD client using Supabase directly. RLS ensures only admins can write. */
export function useAdminApi() {
  const supabase = useSupabaseClient()

  async function list<T extends ContentType>(type: T): Promise<TableMap[T][]> {
    const { data, error } = await supabase.from(type).select('*').order('created_at', { ascending: false })
    if (error) throw error
    const mapper = MAPPERS[type] as (row: Record<string, unknown>) => TableMap[T]
    return ((data ?? []) as unknown as Record<string, unknown>[]).map(mapper)
  }

  async function save(type: ContentType, doc: Record<string, unknown>) {
    const row = toDbRow(type, doc)
    const { data, error } = await supabase.from(type).upsert(row as never, { onConflict: 'slug' }).select().single()
    if (error) throw error
    const isUpdate = doc.id != null
    return { ok: true, slug: String(row.slug), action: isUpdate ? 'updated' : 'created', data }
  }

  async function remove(type: ContentType, slug: string) {
    const { error } = await supabase.from(type).delete().eq('slug', slug)
    if (error) throw error
    return { ok: true }
  }

  return { list, save, remove }
}

/** Map camelCase TS fields → snake_case DB columns, strip client-only fields. */
function toDbRow(type: ContentType, doc: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = { ...doc }

  // Remove fields the DB manages or that don't exist in the schema
  delete row.id
  delete row._path
  delete row.body

  if (type === 'products') {
    row.sale_price = doc.salePrice ?? doc.sale_price ?? null
    row.best_seller = doc.bestSeller ?? doc.best_seller ?? false
    row.short_description = doc.shortDescription ?? doc.short_description ?? ''
    row.meta_title = doc.metaTitle ?? doc.meta_title ?? null
    row.meta_desc = doc.metaDesc ?? doc.meta_desc ?? null
    row.review_count = doc.reviewCount ?? doc.review_count ?? 0
    // Remove camelCase duplicates
    delete row.salePrice
    delete row.bestSeller
    delete row.shortDescription
    delete row.metaTitle
    delete row.metaDesc
    delete row.reviewCount
    delete row.createdAt  // DB manages this
  }

  if (type === 'categories') {
    // DB uses `title`; TS/forms use `name`
    row.title = doc.name ?? doc.title
    delete row.name
  }

  if (type === 'banners') {
    // DB uses `cta_label`/`cta_href`; TS/forms use `buttonText`/`buttonLink`
    row.cta_label = doc.buttonText ?? doc.cta_label ?? ''
    row.cta_href = doc.buttonLink ?? doc.cta_href ?? ''
    delete row.buttonText
    delete row.buttonLink
    if (row.active === undefined) row.active = true
  }

  return row
}
