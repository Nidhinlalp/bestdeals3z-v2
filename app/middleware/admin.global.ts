/** Protect every /admin route except the login page. Runs client-side (admin is SSR-disabled). */
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  if (!to.path.startsWith('/admin')) return
  if (to.path === '/admin/login') return

  const { isAuthenticated } = useAdminAuth()
  if (!isAuthenticated.value) {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
