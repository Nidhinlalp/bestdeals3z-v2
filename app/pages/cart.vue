<script setup lang="ts">
import { formatPrice } from '~/utils/format'
import { computeOrder } from '~/composables/useWhatsapp'
import { SHIPPING } from '~/constants/site'

const cart = useCartStore()
const order = computed(() => computeOrder(cart.items))
const remaining = computed(() => Math.max(0, SHIPPING.freeShippingThreshold - order.value.subtotal))

useSeoMeta({ title: 'Your Cart', robots: 'noindex' })
</script>

<template>
  <div class="container-bmw py-xl md:py-xxl">
    <div class="m-stripe mb-lg w-20" />
    <h1 class="text-display-sm font-bold uppercase leading-none text-ink md:text-display-md">Your Cart</h1>

    <EmptyState v-if="cart.isEmpty" title="Your cart is empty" description="Looks like you haven't added anything yet. Explore our deals and find your next machine." icon="cart" class="mt-xl">
      <BaseButton to="/shop" variant="primary">Start Shopping</BaseButton>
    </EmptyState>

    <div v-else class="mt-xl grid grid-cols-1 gap-xl lg:grid-cols-[1fr_380px]">
      <!-- Items -->
      <div>
        <div class="flex items-center justify-between border-b border-hairline pb-sm">
          <span class="text-label-uppercase uppercase text-body">{{ cart.count }} items</span>
          <button class="text-caption uppercase tracking-wide text-muted hover:text-m-red" @click="cart.clear()">Clear Cart</button>
        </div>
        <CartItem v-for="item in cart.items" :key="cart.keyOf(item)" :item="item" />
        <NuxtLink to="/shop" class="mt-lg inline-flex items-center gap-2 text-label-uppercase uppercase tracking-[1.5px] text-ink hover:text-m-red">
          <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Continue Shopping
        </NuxtLink>
      </div>

      <!-- Summary -->
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <div class="border border-hairline bg-surface-card">
          <div class="m-stripe" />
          <div class="flex flex-col gap-md p-lg">
            <h2 class="text-title-lg font-bold uppercase">Order Summary</h2>
            <p v-if="remaining > 0" class="border border-hairline bg-surface-soft px-md py-2 text-caption text-body">Add <span class="text-ink">{{ formatPrice(remaining) }}</span> more for FREE shipping.</p>
            <div class="flex flex-col gap-sm border-t border-hairline pt-md">
              <div class="flex justify-between text-body-sm text-body"><span>Subtotal</span><span class="text-ink">{{ formatPrice(order.subtotal) }}</span></div>
              <div class="flex justify-between text-body-sm text-body"><span>Shipping</span><span class="text-ink">{{ order.shipping === 0 ? 'FREE' : formatPrice(order.shipping) }}</span></div>
            </div>
            <div class="flex justify-between border-t border-hairline pt-md text-title-md font-bold text-ink"><span>Total</span><span>{{ formatPrice(order.total) }}</span></div>
            <BaseButton to="/checkout" variant="primary" size="lg" block>Proceed to Checkout</BaseButton>
            <p class="text-center text-caption text-muted">Checkout completes on WhatsApp · No payment gateway</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
