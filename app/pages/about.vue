<script setup lang="ts">
import { SITE } from '~/constants/site'

const stats = [
  { value: 'India', label: 'Service Area' },
  { value: '1–2', label: 'Day Processing' },
  { value: 'WhatsApp', label: 'Human Support' },
  { value: 'COD', label: 'Where Eligible' },
]
const policies = [
  { title: 'Free Shipping over ₹999', body: 'All orders above ₹999 ship free across India. Smaller orders carry a flat ₹49.' },
  { title: 'Cash on Delivery', body: 'Pay only when your order arrives. Available on most pincodes.' },
  { title: 'Fair Returns', body: 'Damaged, defective, wrong or misdescribed item? Message us promptly so we can verify and provide the appropriate remedy.' },
  { title: 'Clear Information', body: 'We aim to show accurate prices, availability and product details before accepting an order.' },
]

useSeoMeta({
  title: 'About Us',
  description: `${SITE.name} offers drones, RC machines and gadgets in India with WhatsApp ordering and Cash on Delivery at eligible pincodes.`,
})
</script>

<template>
  <div>
    <section class="border-b border-hairline bg-surface-soft">
      <div class="container-cloud py-xxl">
        <div class="brand-stripe mb-lg w-20" />
        <h1 class="max-w-3xl text-display-md font-bold uppercase leading-none text-ink md:text-display-lg">{{ SITE.tagline }}</h1>
        <p class="mt-lg max-w-2xl text-title-md text-body-strong">{{ SITE.name }} helps customers across India discover drones, RC machines and useful gadgets, with a simple WhatsApp-first ordering experience.</p>
      </div>
    </section>

    <section class="section">
      <div class="container-cloud grid grid-cols-2 gap-px border border-hairline bg-hairline md:grid-cols-4">
        <div v-for="s in stats" :key="s.label" class="flex flex-col gap-1 bg-canvas p-lg">
          <span class="text-display-sm font-bold text-ink">{{ s.value }}</span>
          <span class="text-label-uppercase uppercase text-muted">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <section class="section border-t border-hairline">
      <div class="container-cloud grid grid-cols-1 gap-xl lg:grid-cols-2">
        <div>
          <div class="brand-stripe mb-lg w-20" />
          <h2 class="text-display-sm font-bold uppercase leading-none text-ink">Why WhatsApp Checkout?</h2>
        </div>
        <div class="flex flex-col gap-md text-body-md text-body">
          <p>WhatsApp lets you review the prepared order before sending it, ask questions, and receive confirmation from a real person. The website does not send your message until you choose to send it in WhatsApp.</p>
          <p>We confirm stock, final charges, delivery estimates and the available payment method in the same conversation. Cash on Delivery is available at eligible pincodes, and prepaid UPI instructions are shared only through our official business chat.</p>
          <BaseButton to="/contact" variant="outline" class="mt-sm w-fit">Talk to Us</BaseButton>
        </div>
      </div>
    </section>

    <section id="policies" class="section border-t border-hairline">
      <div class="container-cloud">
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
