<script setup lang="ts">
import { buildEnquiryUrl } from '~/composables/useWhatsapp'
const href = computed(() => buildEnquiryUrl('Hi BestDeal3z! I have a question about your products.'))
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener"
    aria-label="Chat with us on WhatsApp"
    class="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-lg transition-transform hover:scale-105"
  >
    <svg viewBox="0 0 24 24" class="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.42 1.31-1.95 1.36-.5.05-.96.23-3.23-.67-2.73-1.08-4.46-3.86-4.6-4.04-.13-.18-1.1-1.46-1.1-2.79 0-1.33.7-1.98.94-2.25.24-.27.53-.34.7-.34.18 0 .35 0 .5.01.16.01.38-.06.59.45.24.58.81 2 .88 2.14.07.14.12.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.27.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.23 1.38.27.14.43.12.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.6-.14.25.09 1.57.74 1.84.88.27.14.45.2.51.31.07.11.07.64-.17 1.32Z" />
    </svg>
  </a>
</template>
