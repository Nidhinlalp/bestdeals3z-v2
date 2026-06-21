<script setup lang="ts">
import { NAV_LINKS, SITE } from '~/constants/site'
const ui = useUiStore()
const open = computed({ get: () => ui.menuOpen, set: (v) => { if (!v) ui.closeAll() } })
const { data: categories } = useCategories()
</script>

<template>
  <BaseDrawer v-model="open" side="left" title="Menu">
    <nav class="flex flex-col px-lg" aria-label="Mobile">
      <NuxtLink v-for="link in NAV_LINKS" :key="link.to" :to="link.to" class="border-b border-hairline py-md text-title-md text-white hover:text-m-red" @click="ui.closeAll()">{{ link.label }}</NuxtLink>
    </nav>
    <div class="px-lg pt-lg">
      <p class="kicker mb-sm text-body">Shop by Category</p>
      <div class="flex flex-col">
        <NuxtLink v-for="c in categories" :key="c.slug" :to="`/category/${c.slug}`" class="border-b border-hairline py-sm text-body-md text-body hover:text-white" @click="ui.closeAll()">{{ c.name }}</NuxtLink>
      </div>
    </div>
    <template #footer>
      <p class="text-caption text-muted">© {{ new Date().getFullYear() }} {{ SITE.name }}</p>
    </template>
  </BaseDrawer>
</template>
