<script setup lang="ts">
import { formatPrice } from '~/utils/format'
import { computeOrder } from '~/composables/useWhatsapp'
import { SHIPPING } from '~/constants/site'

const cart = useCartStore()
const ui = useUiStore()

const open = computed({ get: () => ui.cartOpen, set: (v) => { if (!v) ui.closeAll() } })
const order = computed(() => computeOrder(cart.items))
const remaining = computed(() => Math.max(0, SHIPPING.freeShippingThreshold - order.value.subtotal))
</script>

<template>
  <BaseDrawer v-model="open" :title="`Cart (${cart.count})`">
    <div v-if="cart.isEmpty" class="px-lg">
      <EmptyState title="Your cart is empty" description="Browse our drones, RC machines and gadgets to find your next deal." icon="cart">
        <BaseButton to="/shop" variant="outline" @click="ui.closeAll()">Start Shopping</BaseButton>
      </EmptyState>
    </div>

    <div v-else class="px-lg">
      <p v-if="remaining > 0" class="mt-md border border-hairline bg-surface-soft px-md py-2 text-caption text-body">
        Add <span class="text-white">{{ formatPrice(remaining) }}</span> more for <span class="text-white">FREE shipping</span>.
      </p>
      <p v-else class="mt-md border border-success/40 bg-surface-soft px-md py-2 text-caption text-success">You've unlocked FREE shipping! 🎉</p>
      <CartItem v-for="item in cart.items" :key="cart.keyOf(item)" :item="item" compact />
    </div>

    <template v-if="!cart.isEmpty" #footer>
      <div class="flex flex-col gap-sm">
        <div class="flex items-center justify-between text-body-sm text-body">
          <span>Subtotal</span><span class="text-white">{{ formatPrice(order.subtotal) }}</span>
        </div>
        <div class="flex items-center justify-between text-body-sm text-body">
          <span>Shipping</span><span class="text-white">{{ order.shipping === 0 ? 'FREE' : formatPrice(order.shipping) }}</span>
        </div>
        <div class="flex items-center justify-between border-t border-hairline pt-sm text-title-md font-bold text-white">
          <span>Total</span><span>{{ formatPrice(order.total) }}</span>
        </div>
        <BaseButton to="/checkout" variant="primary" size="lg" block class="mt-sm" @click="ui.closeAll()">Checkout</BaseButton>
        <BaseButton to="/cart" variant="ghost" block @click="ui.closeAll()">View Cart</BaseButton>
      </div>
    </template>
  </BaseDrawer>
</template>
