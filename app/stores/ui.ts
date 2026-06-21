import { defineStore } from 'pinia'

interface UiState {
  cartOpen: boolean
  menuOpen: boolean
  searchOpen: boolean
}

/** Ephemeral UI state for overlays — deliberately NOT persisted. */
export const useUiStore = defineStore('ui', {
  state: (): UiState => ({ cartOpen: false, menuOpen: false, searchOpen: false }),
  actions: {
    openCart() { this.closeAll(); this.cartOpen = true },
    openMenu() { this.closeAll(); this.menuOpen = true },
    openSearch() { this.closeAll(); this.searchOpen = true },
    closeAll() { this.cartOpen = false; this.menuOpen = false; this.searchOpen = false },
    toggleCart() { const o = this.cartOpen; this.closeAll(); this.cartOpen = !o },
  },
})
