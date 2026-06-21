<script setup lang="ts">
const ui = useUiStore()
const open = computed({ get: () => ui.searchOpen, set: (v) => { if (!v) ui.closeAll() } })
</script>

<template>
  <BaseDrawer v-model="open" title="Search">
    <SearchBar @navigate="ui.closeAll()" />
  </BaseDrawer>
</template>
