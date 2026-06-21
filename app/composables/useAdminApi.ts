import type { Product, Category, Banner } from '~/types'

type ContentType = 'products' | 'categories' | 'banners'
type DocOf<T extends ContentType> = T extends 'products' ? Product : T extends 'categories' ? Category : Banner

/** Authenticated CRUD client for the admin dashboard. */
export function useAdminApi() {
  const { key } = useAdminAuth()
  const headers = () => ({ 'x-admin-key': key.value ?? '' })

  async function list<T extends ContentType>(type: T): Promise<DocOf<T>[]> {
    return await $fetch(`/api/admin/content/${type}`, { headers: headers() }) as DocOf<T>[]
  }

  async function save(type: ContentType, doc: Record<string, unknown>) {
    return await $fetch(`/api/admin/content/${type}`, { method: 'POST', headers: headers(), body: doc })
  }

  async function remove(type: ContentType, slug: string) {
    return await $fetch(`/api/admin/content/${type}/${slug}`, { method: 'DELETE', headers: headers() })
  }

  return { list, save, remove }
}
