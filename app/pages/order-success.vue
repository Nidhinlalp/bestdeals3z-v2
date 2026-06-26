<script setup lang="ts">
useSeoMeta({ title: 'Order Sent', robots: 'noindex' })
</script>

<template>
  <div class="container-bmw flex min-h-[70vh] flex-col items-center justify-center py-xxl text-center">
    <div class="m-stripe mb-lg w-24" />
    <div class="mb-lg flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success">
      <svg viewBox="0 0 24 24" class="h-10 w-10" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5" /></svg>
    </div>
    <h1 class="text-display-sm font-bold uppercase leading-none text-ink md:text-display-md">Order on its way!</h1>
    <p class="mt-md max-w-md text-body-md text-body">
      Your order has been opened in WhatsApp. <strong class="text-ink">Just hit send</strong> to confirm with our team — we'll reply with availability and delivery time.
    </p>
    <p class="mt-sm max-w-md text-body-sm text-muted">If WhatsApp didn't open, please check your pop-up blocker and try again from your cart.</p>
    <div class="mt-xl flex flex-col gap-sm sm:flex-row">
      <BaseButton to="/shop" variant="primary">Continue Shopping</BaseButton>
      <BaseButton to="/track" variant="outline">Track My Order</BaseButton>
      <BaseButton to="/" variant="ghost">Back to Home</BaseButton>
    </div>
  </div>
</template>
