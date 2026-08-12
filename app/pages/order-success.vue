<script setup lang="ts">
const lastWhatsappUrl = useSessionStorage('cloud-scart-last-whatsapp-url', '')
useSeoMeta({ title: 'Order Ready', robots: 'noindex, nofollow' })
</script>

<template>
  <div class="container-cloud flex min-h-[70vh] flex-col items-center justify-center py-xxl text-center">
    <div class="brand-stripe mb-lg w-24" />
    <div class="mb-lg flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success">
      <svg viewBox="0 0 24 24" class="h-10 w-10" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5" /></svg>
    </div>
    <h1 class="text-display-sm font-bold uppercase leading-none text-ink md:text-display-md">Send to confirm</h1>
    <p class="mt-md max-w-md text-body-md text-body">
      Your order has been opened in WhatsApp. <strong class="text-ink">Just hit send</strong> to confirm with our team — we'll reply with availability and delivery time.
    </p>
    <p class="mt-sm max-w-md text-body-sm text-muted">Your order is confirmed only after you send the message and our team accepts it in the chat.</p>
    <div class="mt-xl flex flex-col gap-sm sm:flex-row">
      <BaseButton v-if="lastWhatsappUrl" :href="lastWhatsappUrl" variant="primary">Open WhatsApp Again</BaseButton>
      <BaseButton to="/shop" variant="primary">Continue Shopping</BaseButton>
      <BaseButton to="/track" variant="outline">Track My Order</BaseButton>
      <BaseButton to="/" variant="ghost">Back to Home</BaseButton>
    </div>
  </div>
</template>
