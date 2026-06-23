<script setup lang="ts">
import { formatPrice } from '~/utils/format'
import { checkoutSchema } from '~/utils/schemas'
import { computeOrder, buildWhatsappUrl } from '~/composables/useWhatsapp'
import type { CheckoutDetails } from '~/types'

const cart = useCartStore()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const order = computed(() => computeOrder(cart.items))

// Remember details locally for repeat orders (never sent anywhere but WhatsApp).
const form = useLocalStorage<CheckoutDetails>('bestdeal3z-customer', {
  fullName: '', phone: '', whatsapp: '', address: '', city: '', state: '', pincode: '', notes: '',
})
const sameAsPhone = ref(true)
watch([sameAsPhone, () => form.value.phone], () => { if (sameAsPhone.value) form.value.whatsapp = form.value.phone })

const errors = ref<Partial<Record<keyof CheckoutDetails, string>>>({})
const submitting = ref(false)

const INDIAN_STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'].map((s) => ({ label: s, value: s }))

function validate(): boolean {
  const result = checkoutSchema.safeParse(form.value)
  errors.value = {}
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof CheckoutDetails
      if (!errors.value[key]) errors.value[key] = issue.message
    }
    return false
  }
  return true
}

async function placeOrder() {
  if (cart.isEmpty) return
  if (!validate()) {
    await nextTick()
    document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  submitting.value = true

  // Generate human-readable order reference
  const orderRef = `BD3Z-${Math.floor(1000 + Math.random() * 9000)}`
  const details = checkoutSchema.parse(form.value)

  // Save order to Supabase (fire-and-forget; WhatsApp still opens even if this fails)
  const { error } = await supabase.from('orders').insert({
    order_ref: orderRef,
    user_id: user.value?.id ?? null,
    customer_name: details.fullName,
    customer_phone: details.phone,
    customer_whatsapp: details.whatsapp,
    address: details.address,
    city: details.city,
    state: details.state,
    pincode: details.pincode,
    notes: details.notes ?? '',
    items: cart.items,
    subtotal: order.value.subtotal,
    shipping: order.value.shipping,
    total: order.value.total,
    status: 'pending',
    whatsapp_sent: true,
  })
  if (error) console.error('Order save failed:', error)

  // Open WhatsApp with the prefilled order (includes order ref), then show the success page.
  const url = buildWhatsappUrl(details, order.value, orderRef)
  window.open(url, '_blank', 'noopener')
  cart.clear()
  await navigateTo('/order-success')
}

useSeoMeta({ title: 'Checkout', robots: 'noindex' })
</script>

<template>
  <div class="container-bmw py-xl md:py-xxl">
    <div class="m-stripe mb-lg w-20" />
    <h1 class="text-display-sm font-bold uppercase leading-none text-white md:text-display-md">Checkout</h1>

    <EmptyState v-if="cart.isEmpty" title="Nothing to check out" description="Your cart is empty. Add some products first." icon="cart" class="mt-xl">
      <BaseButton to="/shop" variant="primary">Browse Products</BaseButton>
    </EmptyState>

    <form v-else class="mt-xl grid grid-cols-1 gap-xl lg:grid-cols-[1fr_380px]" @submit.prevent="placeOrder">
      <!-- Details -->
      <div class="flex flex-col gap-lg">
        <div class="flex flex-col gap-md">
          <h2 class="text-title-lg font-bold uppercase">Delivery Details</h2>
          <p class="text-body-sm text-body">No account needed. We confirm your order on WhatsApp and you pay cash on delivery.</p>
        </div>

        <BaseInput v-model="form.fullName" label="Full Name" placeholder="e.g. Arjun Menon" required autocomplete="name" :error="errors.fullName" />

        <div class="grid grid-cols-1 gap-md sm:grid-cols-2">
          <BaseInput v-model="form.phone" label="Phone Number" placeholder="10-digit mobile" type="tel" inputmode="tel" required autocomplete="tel" :error="errors.phone" />
          <div class="flex flex-col gap-2">
            <BaseInput v-model="form.whatsapp" label="WhatsApp Number" placeholder="10-digit WhatsApp" type="tel" inputmode="tel" required :error="errors.whatsapp" :class="sameAsPhone ? 'opacity-60 pointer-events-none' : ''" />
            <label class="flex items-center gap-2 text-caption text-body"><input v-model="sameAsPhone" type="checkbox" class="accent-m-red"> Same as phone number</label>
          </div>
        </div>

        <BaseTextarea v-model="form.address" label="Full Address" placeholder="House / flat no., street, area, landmark" required :rows="3" :error="errors.address" />

        <div class="grid grid-cols-1 gap-md sm:grid-cols-3">
          <BaseInput v-model="form.city" label="City" placeholder="City" required autocomplete="address-level2" :error="errors.city" />
          <BaseSelect v-model="form.state" label="State" :options="[{ label: 'Select state', value: '' }, ...INDIAN_STATES]" :error="errors.state" />
          <BaseInput v-model="form.pincode" label="Pincode" placeholder="6-digit" type="text" inputmode="numeric" required autocomplete="postal-code" :error="errors.pincode" />
        </div>

        <BaseTextarea v-model="form.notes" label="Order Notes (optional)" placeholder="Anything we should know? Colour preference, delivery timing…" :rows="2" />
      </div>

      <!-- Summary -->
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <div class="border border-hairline bg-surface-card">
          <div class="m-stripe" />
          <div class="flex flex-col gap-md p-lg">
            <h2 class="text-title-lg font-bold uppercase">Your Order</h2>
            <ul class="flex flex-col gap-sm border-b border-hairline pb-md">
              <li v-for="item in cart.items" :key="cart.keyOf(item)" class="flex items-center gap-sm">
                <NuxtImg :src="item.image" :alt="item.title" width="48" height="48" class="h-12 w-12 border border-hairline object-cover" loading="lazy" />
                <span class="flex-1 text-body-sm text-white line-clamp-1">{{ item.title }}</span>
                <span class="text-caption text-muted">×{{ item.quantity }}</span>
                <span class="text-body-sm text-white">{{ formatPrice(item.price * item.quantity) }}</span>
              </li>
            </ul>
            <div class="flex flex-col gap-sm">
              <div class="flex justify-between text-body-sm text-body"><span>Subtotal</span><span class="text-white">{{ formatPrice(order.subtotal) }}</span></div>
              <div class="flex justify-between text-body-sm text-body"><span>Shipping</span><span class="text-white">{{ order.shipping === 0 ? 'FREE' : formatPrice(order.shipping) }}</span></div>
            </div>
            <div class="flex justify-between border-t border-hairline pt-md text-title-md font-bold text-white"><span>Total</span><span>{{ formatPrice(order.total) }}</span></div>

            <BaseButton type="submit" variant="primary" size="lg" block :loading="submitting" class="!bg-success !border-success !text-white hover:!bg-success/90">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Z" /></svg>
              Place Order on WhatsApp
            </BaseButton>
            <p class="text-center text-caption text-muted">Tapping this opens WhatsApp with your order ready to send. No online payment.</p>
          </div>
        </div>
      </aside>
    </form>
  </div>
</template>
