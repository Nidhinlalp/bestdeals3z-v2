/** Protect every /admin route except the login page. Runs client-side (admin is SSR-disabled). */
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  if (!to.path.startsWith('/admin')) return
  if (to.path === '/admin/login') return

  const { isAuthenticated, checkAdminStatus } = useAdminAuth()

  // On first load the Supabase session may be loaded but admin status not yet checked.
  if (!isAuthenticated.value) {
    await checkAdminStatus()
  }

  if (!isAuthenticated.value) {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
