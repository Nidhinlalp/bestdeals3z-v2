<script setup lang="ts">
import { SITE } from '~/constants/site'

const stats = [
  { value: '5K+', label: 'Happy Customers' },
  { value: '4.6★', label: 'Avg. Rating' },
  { value: '3–6', label: 'Day Delivery' },
  { value: 'COD', label: 'Available' },
]
const policies = [
  { title: 'Free Shipping over ₹999', body: 'All orders above ₹999 ship free across India. Smaller orders carry a flat ₹49.' },
  { title: 'Cash on Delivery', body: 'Pay only when your order arrives. Available on most pincodes.' },
  { title: '24-Hour Return Window', body: 'Damaged or defective on arrival? Message us within 24 hours with an unboxing video for a free replacement or refund.' },
  { title: 'Genuine Products', body: 'Every product is quality-checked before dispatch so you get exactly what you ordered.' },
]

useSeoMeta({
  title: 'About Us',
  description: `${SITE.name} brings you the best deals on drones, RC machines and gadgets in India — with WhatsApp ordering and cash on delivery.`,
  ogImage: '/og-image.svg',
})
</script>

<template>
  <div>
    <section class="border-b border-hairline bg-surface-soft">
      <div class="container-bmw py-xxl">
        <div class="m-stripe mb-lg w-20" />
        <h1 class="max-w-3xl text-display-md font-bold uppercase leading-none text-ink md:text-display-lg">Engineered Deals. Delivered Fast.</h1>
        <p class="mt-lg max-w-2xl text-title-md text-body-strong">{{ SITE.name }} is built for one thing: getting India the best price on drones, RC machines and performance gadgets — without the friction of accounts, cards or clunky checkouts.</p>
      </div>
    </section>

    <section class="section">
      <div class="container-bmw grid grid-cols-2 gap-px border border-hairline bg-hairline md:grid-cols-4">
        <div v-for="s in stats" :key="s.label" class="flex flex-col gap-1 bg-canvas p-lg">
          <span class="text-display-sm font-bold text-ink">{{ s.value }}</span>
          <span class="text-label-uppercase uppercase text-muted">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <section class="section border-t border-hairline">
      <div class="container-bmw grid grid-cols-1 gap-xl lg:grid-cols-2">
        <div>
          <div class="m-stripe mb-lg w-20" />
          <h2 class="text-display-sm font-bold uppercase leading-none text-ink">Why WhatsApp Checkout?</h2>
        </div>
        <div class="flex flex-col gap-md text-body-md text-body">
          <p>We keep things lean so we can keep prices low. Instead of paying for heavy payment gateways and passing the cost to you, we confirm every order personally on WhatsApp.</p>
          <p>You get a real human, instant answers, cash on delivery, and a tracking link — all in one chat. It's faster, friendlier, and lets us pass the savings straight to you.</p>
          <BaseButton to="/contact" variant="outline" class="mt-sm w-fit">Talk to Us</BaseButton>
        </div>
      </div>
    </section>

    <section id="policies" class="section border-t border-hairline">
      <div class="container-bmw">
        <SectionHeader kicker="The Fine Print" title="Shipping & Returns" />
        <div class="grid grid-cols-1 gap-lg md:grid-cols-2">
          <div v-for="p in policies" :key="p.title" class="border border-hairline bg-surface-card p-lg">
            <h3 class="text-title-md font-bold text-ink">{{ p.title }}</h3>
            <p class="mt-sm text-body-md text-body">{{ p.body }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
