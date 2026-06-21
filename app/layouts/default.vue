<script setup lang="ts">
useOrganizationSchema()
</script>

<template>
  <div class="flex min-h-screen flex-col bg-canvas">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <WhatsAppFab />
  </div>
</template>
