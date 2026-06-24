<script setup lang="ts">
import { SITE } from '~/constants/site'
import { buildEnquiryUrl } from '~/composables/useWhatsapp'

const message = ref('')
const waUrl = computed(() => buildEnquiryUrl(message.value.trim() || 'Hi BestDeal3z! I have a question.'))

useSeoMeta({
  title: 'Contact Us',
  description: 'Get in touch with BestDeal3z on WhatsApp. We reply fast about products, orders and delivery across India.',
  ogImage: '/og-image.svg',
})
</script>

<template>
  <div class="container-bmw py-xl md:py-xxl">
    <div class="m-stripe mb-lg w-20" />
    <h1 class="text-display-sm font-bold uppercase leading-none text-white md:text-display-md">Contact Us</h1>
    <p class="mt-md max-w-xl text-body-md text-body">The fastest way to reach us is WhatsApp — we answer questions about products, orders and delivery within hours.</p>

    <div class="mt-xl grid grid-cols-1 gap-xl lg:grid-cols-2">
      <div class="flex flex-col gap-lg">
        <div class="border border-hairline bg-surface-card p-lg">
          <h2 class="text-title-lg font-bold uppercase">Quick Message</h2>
          <p class="mt-sm text-body-sm text-body">Type your question and we'll open WhatsApp with it ready to send.</p>
          <div class="mt-md flex flex-col gap-md">
            <BaseTextarea v-model="message" label="Your Message" placeholder="e.g. Is the E88 drone in stock for Kochi?" :rows="4" />
            <BaseButton :href="waUrl" variant="primary" size="lg" class="!bg-success !border-success">Send on WhatsApp</BaseButton>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-md">
        <div class="border border-hairline p-lg">
          <p class="kicker text-body">Call / WhatsApp</p>
          <a :href="`tel:${SITE.phone.replace(/\s/g, '')}`" class="text-title-md text-white hover:text-m-red">{{ SITE.phone }}</a>
        </div>
        <div class="border border-hairline p-lg">
          <p class="kicker text-body">Email</p>
          <a :href="`mailto:${SITE.email}`" class="break-all text-title-md text-white hover:text-m-red">{{ SITE.email }}</a>
        </div>
        <div class="border border-hairline p-lg">
          <p class="kicker text-body">Follow Us</p>
          <div class="mt-sm flex flex-col gap-2">
            <a v-for="(url, name) in SITE.social" :key="name" :href="url" target="_blank" rel="noopener" class="text-body-md capitalize text-body hover:text-white">{{ name }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
