<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { login, isAuthenticated } = useAdminAuth()
const route = useRoute()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

onMounted(() => { if (isAuthenticated.value) navigateTo('/admin') })

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const result = await login(email.value, password.value)
    if (!result.ok) {
      error.value = result.error ?? 'Login failed. Please try again.'
      return
    }
    await navigateTo((route.query.redirect as string) || '/admin')
  } catch {
    error.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

useSeoMeta({ title: 'Admin Login', robots: 'noindex, nofollow' })
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center">
    <div class="w-full max-w-sm border border-hairline bg-surface-card">
      <div class="m-stripe" />
      <form class="flex flex-col gap-lg p-lg" @submit.prevent="submit">
        <div>
          <h1 class="text-title-lg font-bold uppercase">Admin Access</h1>
          <p class="mt-1 text-body-sm text-body">Enter your admin credentials to manage the store.</p>
        </div>
        <BaseInput v-model="email" label="Email" type="email" placeholder="admin@example.com" required autocomplete="username" />
        <BaseInput v-model="password" label="Password" type="password" placeholder="••••••••" required autocomplete="current-password" :error="error" />
        <BaseButton type="submit" variant="primary" size="lg" block :loading="loading">Log In</BaseButton>
        <NuxtLink to="/" class="text-center text-caption uppercase tracking-wide text-muted hover:text-ink">← Back to Store</NuxtLink>
      </form>
    </div>
  </div>
</template>
