<script setup lang="ts">
import { buildEnquiryUrl } from '~/composables/useWhatsapp'

const orderId = ref('')
const waUrl = computed(() =>
  buildEnquiryUrl(`Hi BestDeal3z! I'd like to track my order${orderId.value.trim() ? ` (Ref: ${orderId.value.trim()})` : ''}.`),
)

useSeoMeta({
  title: 'Track Your Order',
  description: 'Track your BestDeal3z order. Share your order reference on WhatsApp and we will send you a live tracking link.',
  ogImage: '/og-image.svg',
})
</script>

<template>
  <div class="container-bmw py-xl md:py-xxl">
    <div class="m-stripe mb-lg w-20" />
    <h1 class="text-display-sm font-bold uppercase leading-none text-ink md:text-display-md">Track Your Order</h1>
    <p class="mt-md max-w-xl text-body-md text-body">All orders are confirmed and tracked on WhatsApp. Enter your order reference (from your WhatsApp chat) and we'll send you a live tracking update.</p>

    <div class="mt-xl max-w-md border border-hairline bg-surface-card p-lg">
      <div class="m-stripe mb-lg w-16" />
      <div class="flex flex-col gap-md">
        <BaseInput v-model="orderId" label="Order Reference (optional)" placeholder="e.g. BD3Z-1042" />
        <BaseButton :href="waUrl" variant="primary" size="lg" block class="!bg-success !border-success">Track on WhatsApp</BaseButton>
        <p class="text-caption text-muted">Don't have a reference? No problem — just message us and we'll find your order by your phone number.</p>
      </div>
    </div>
  </div>
</template>
