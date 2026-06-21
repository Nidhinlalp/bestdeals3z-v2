<script setup lang="ts">
import type { Review } from '~/types'
defineProps<{ review: Review }>()
</script>

<template>
  <figure class="flex h-full flex-col gap-md border border-hairline bg-surface-card p-lg">
    <RatingStars :rating="review.rating" size="md" />
    <blockquote class="flex-1 text-body-md text-body-strong">“{{ review.body }}”</blockquote>
    <figcaption class="flex flex-col gap-0.5 border-t border-hairline pt-md">
      <span class="text-body-sm font-medium text-white">{{ review.name }}</span>
      <span class="text-caption text-muted">{{ review.location }}</span>
    </figcaption>
  </figure>
</template>
