/**
 * Admin auth using Supabase Auth (email + password).
 * `@nuxtjs/supabase` auto-injects useSupabaseClient() and useSupabaseUser().
 */
export function useAdminAuth() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Shared across all components — persists for the SPA session.
  const isAdmin = useState<boolean>('admin-status', () => false)

  const isAuthenticated = computed(() => !!user.value && isAdmin.value)

  async function checkAdminStatus(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        isAdmin.value = false
        return false
      }
      const data = await $fetch<{ isAdmin?: boolean }>('/api/admin/check', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      isAdmin.value = !!data?.isAdmin
    } catch {
      isAdmin.value = false
    }
    return isAdmin.value
  }

  async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: error.message }
    const ok = await checkAdminStatus()
    if (!ok) {
      await supabase.auth.signOut()
      return { ok: false, error: 'You do not have admin access.' }
    }
    return { ok: true }
  }

  async function logout() {
    await supabase.auth.signOut()
    isAdmin.value = false
    navigateTo('/admin/login')
  }

  return { user, isAuthenticated, isAdmin, login, logout, checkAdminStatus }
}
