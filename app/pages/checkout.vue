<script setup lang="ts">
import { formatPrice } from '~/utils/format'
import { checkoutSchema } from '~/utils/schemas'
import { computeOrder, buildWhatsappUrl } from '~/composables/useWhatsapp'
import type { OrderSummary } from '~/composables/useWhatsapp'
import type { CheckoutDetails } from '~/types'

const cart = useCartStore()
const order = computed(() => computeOrder(cart.items))

// Keep delivery details only in page memory. They are sent to the order API and
// included in the WhatsApp message only after the customer submits the form.
const form = ref<CheckoutDetails>({
  fullName: '', phone: '', whatsapp: '', address: '', city: '', state: '', pincode: '', paymentMethod: 'cod', notes: '',
})
const sameAsPhone = ref(true)
watch([sameAsPhone, () => form.value.phone], () => { if (sameAsPhone.value) form.value.whatsapp = form.value.phone })

const errors = ref<Partial<Record<keyof CheckoutDetails, string>>>({})
const submitting = ref(false)
const acceptedPolicies = ref(false)
const lastWhatsappUrl = useSessionStorage('cloud-scart-last-whatsapp-url', '')

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
].map((state) => ({ label: state, value: state }))

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

  const details = checkoutSchema.parse(form.value)
  const fallbackRef = `CS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  let orderRef = fallbackRef
  let verifiedOrder: OrderSummary = order.value
  const whatsappWindow = window.open('about:blank', '_blank')
  if (whatsappWindow) whatsappWindow.opener = null

  try {
    const saved = await $fetch<{ orderRef: string; order: OrderSummary }>('/api/orders', {
      method: 'POST',
      body: {
        details,
        items: cart.items.map(({ slug, quantity, variant }) => ({ slug, quantity, variant })),
        website: '',
      },
    })
    orderRef = saved.orderRef
    verifiedOrder = saved.order
  }
  catch {
    // WhatsApp remains the source of confirmation if the optional order record fails.
  }

  // WhatsApp opens only after the customer submits and still requires them to press Send.
  const url = buildWhatsappUrl(details, verifiedOrder, orderRef)
  lastWhatsappUrl.value = url
  cart.clear()
  if (whatsappWindow) {
    whatsappWindow.location.replace(url)
    await navigateTo('/order-success')
  }
  else {
    window.location.assign(url)
  }
}

useSeoMeta({ title: 'Checkout', robots: 'noindex' })
</script>

<template>
  <div class="container-cloud py-xl md:py-xxl">
    <div class="brand-stripe mb-lg w-20" />
    <h1 class="text-display-sm font-bold uppercase leading-none text-ink md:text-display-md">Checkout</h1>

    <EmptyState v-if="cart.isEmpty" title="Nothing to check out" description="Your cart is empty. Add some products first." icon="cart" class="mt-xl">
      <BaseButton to="/shop" variant="primary">Browse Products</BaseButton>
    </EmptyState>

    <form v-else class="mt-xl grid grid-cols-1 gap-xl lg:grid-cols-[1fr_380px]" @submit.prevent="placeOrder">
      <!-- Details -->
      <div class="flex flex-col gap-lg">
        <div class="flex flex-col gap-md">
          <h2 class="text-title-lg font-bold uppercase">Delivery Details</h2>
          <p class="text-body-sm text-body">No account needed. We confirm your order on WhatsApp. Choose Cash on Delivery or pay via UPI.</p>
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

        <!-- Payment Method -->
        <div class="flex flex-col gap-sm">
          <span class="text-label-uppercase uppercase text-body-strong">Payment Method <span class="text-m-red">*</span></span>
          <div class="grid grid-cols-1 gap-sm sm:grid-cols-2">
            <button
              type="button"
              :class="form.paymentMethod === 'cod'
                ? 'border-ink bg-surface-card'
                : 'border-hairline bg-canvas hover:border-ink/50'"
              class="flex items-start gap-md border p-md text-left transition-colors"
              @click="form.paymentMethod = 'cod'"
            >
              <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2" :class="form.paymentMethod === 'cod' ? 'border-ink' : 'border-muted'">
                <span v-if="form.paymentMethod === 'cod'" class="h-2 w-2 rounded-full bg-ink" />
              </span>
              <div class="flex flex-col gap-0.5">
                <span class="text-body-sm font-medium text-ink">💵 Cash on Delivery</span>
                <span class="text-caption text-muted">Pay cash when your order arrives</span>
              </div>
            </button>
            <button
              type="button"
              :class="form.paymentMethod === 'prepaid'
                ? 'border-ink bg-surface-card'
                : 'border-hairline bg-canvas hover:border-ink/50'"
              class="flex items-start gap-md border p-md text-left transition-colors"
              @click="form.paymentMethod = 'prepaid'"
            >
              <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2" :class="form.paymentMethod === 'prepaid' ? 'border-ink' : 'border-muted'">
                <span v-if="form.paymentMethod === 'prepaid'" class="h-2 w-2 rounded-full bg-ink" />
              </span>
              <div class="flex flex-col gap-0.5">
                <span class="text-body-sm font-medium text-ink">💳 Prepaid (UPI)</span>
                <span class="text-caption text-muted">Pay via UPI link shared on WhatsApp</span>
              </div>
            </button>
          </div>
          <p v-if="errors.paymentMethod" class="text-caption text-m-red">{{ errors.paymentMethod }}</p>
        </div>

        <BaseTextarea v-model="form.notes" label="Order Notes (optional)" placeholder="Anything we should know? Colour preference, delivery timing…" :rows="2" />

        <label class="flex items-start gap-sm border border-hairline bg-surface-soft p-md text-body-sm text-body">
          <input v-model="acceptedPolicies" type="checkbox" required class="mt-1 h-4 w-4 shrink-0 accent-m-red">
          <span>I have read and agree to the <NuxtLink to="/policies/terms-of-service" target="_blank" class="text-ink underline">Terms of Service</NuxtLink> and <NuxtLink to="/policies/refund-policy" target="_blank" class="text-ink underline">Return & Refund Policy</NuxtLink>, and acknowledge the <NuxtLink to="/policies/privacy-policy" target="_blank" class="text-ink underline">Privacy Policy</NuxtLink>.</span>
        </label>
      </div>

      <!-- Summary -->
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <div class="border border-hairline bg-surface-card">
          <div class="brand-stripe" />
          <div class="flex flex-col gap-md p-lg">
            <h2 class="text-title-lg font-bold uppercase">Your Order</h2>
            <ul class="flex flex-col gap-sm border-b border-hairline pb-md">
              <li v-for="item in cart.items" :key="cart.keyOf(item)" class="flex items-center gap-sm">
                <NuxtImg :src="item.image" :alt="item.title" width="48" height="48" class="h-12 w-12 border border-hairline object-cover" loading="lazy" />
                <span class="flex-1 text-body-sm text-ink line-clamp-1">{{ item.title }}</span>
                <span class="text-caption text-muted">×{{ item.quantity }}</span>
                <span class="text-body-sm text-ink">{{ formatPrice(item.price * item.quantity) }}</span>
              </li>
            </ul>
            <div class="flex flex-col gap-sm">
              <div class="flex justify-between text-body-sm text-body"><span>Subtotal</span><span class="text-ink">{{ formatPrice(order.subtotal) }}</span></div>
              <div class="flex justify-between text-body-sm text-body"><span>Shipping</span><span class="text-ink">{{ order.shipping === 0 ? 'FREE' : formatPrice(order.shipping) }}</span></div>
            </div>
            <div class="flex justify-between border-t border-hairline pt-md text-title-md font-bold text-ink"><span>Total</span><span>{{ formatPrice(order.total) }}</span></div>

            <BaseButton type="submit" variant="primary" size="lg" block :loading="submitting" class="!bg-success !border-success !text-white hover:!bg-success/90">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Z" /></svg>
              Place Order on WhatsApp
            </BaseButton>
            <p class="text-center text-caption text-muted">Opens WhatsApp with your order pre-filled. Pay {{ form.paymentMethod === 'prepaid' ? 'via UPI link we send you' : 'cash on delivery' }}.</p>
          </div>
        </div>
      </aside>
    </form>
  </div>
</template>
