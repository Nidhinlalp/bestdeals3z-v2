const STORAGE_KEY = 'bestdeal3z-admin-key'

/**
 * Lightweight admin auth. The password doubles as the API key:
 * after a successful login we keep it in sessionStorage and send it
 * as `x-admin-key` on every write request. Cleared when the tab closes.
 */
export function useAdminAuth() {
  const key = useState<string | null>('admin-key', () => null)

  // Hydrate from sessionStorage on the client.
  if (import.meta.client && key.value === null) {
    key.value = sessionStorage.getItem(STORAGE_KEY)
  }

  const isAuthenticated = computed(() => !!key.value)

  async function login(password: string): Promise<boolean> {
    await $fetch('/api/admin/login', { method: 'POST', body: { password } })
    key.value = password
    if (import.meta.client) sessionStorage.setItem(STORAGE_KEY, password)
    return true
  }

  function logout() {
    key.value = null
    if (import.meta.client) sessionStorage.removeItem(STORAGE_KEY)
    navigateTo('/admin/login')
  }

  return { key, isAuthenticated, login, logout }
}
