<script setup lang="ts">
import { SITE } from '~/constants/site'
import { REVIEWS, FAQS } from '~/constants/content'

const { data: products } = await useProducts()
const { data: categories } = await useCategories()
const { data: banners } = await useBanners()

const allProducts = computed(() => products.value ?? [])
const { featured, bestSellers, trending } = useProductCollections(allProducts)

// Product counts per category for the category cards.
const categoryCounts = computed(() => {
  const map: Record<string, number> = {}
  for (const p of allProducts.value) map[p.category] = (map[p.category] ?? 0) + 1
  return map
})

const promoBanner = computed(() => banners.value?.[4] ?? banners.value?.[0])

const valueProps = [
  { title: 'Free Shipping', desc: 'On all orders above ₹999' },
  { title: 'Cash on Delivery', desc: 'Pay when it arrives' },
  { title: 'WhatsApp Checkout', desc: 'Order in under a minute' },
  { title: 'Easy Replacement', desc: 'On damaged arrivals' },
]

useSeoMeta({
  title: SITE.tagline,
  description: SITE.description,
  ogTitle: `${SITE.name} — ${SITE.tagline}`,
  ogDescription: SITE.description,
  ogImage: '/og-image.svg',
})
useFaqSchema(FAQS)
</script>

<template>
  <div>
    <!-- Hero -->
    <HeroCarousel v-if="banners?.length" :banners="banners" />

    <!-- Value props -->
    <section class="border-b border-hairline bg-surface-soft">
      <div class="container-bmw grid grid-cols-2 divide-x divide-hairline md:grid-cols-4">
        <div v-for="(v, i) in valueProps" :key="v.title" class="flex flex-col gap-1 px-md py-lg" :class="{ 'border-t border-hairline md:border-t-0': i >= 2 }">
          <span class="text-label-uppercase uppercase text-ink">{{ v.title }}</span>
          <span class="text-caption text-muted">{{ v.desc }}</span>
        </div>
      </div>
    </section>

    <!-- Featured categories -->
    <section class="section">
      <div class="container-bmw">
        <SectionHeader kicker="Browse the Range" title="Shop by Category" link="/categories" />
        <div class="grid grid-cols-2 gap-sm md:grid-cols-3 md:gap-lg lg:grid-cols-5">
          <CategoryCard v-for="c in categories?.slice(0, 5)" :key="c.slug" :category="c" :count="categoryCounts[c.slug]" />
        </div>
      </div>
    </section>

    <!-- Trending -->
    <section v-if="trending.length" class="section border-t border-hairline">
      <div class="container-bmw">
        <SectionHeader kicker="Hot Right Now" title="Trending Products" link="/shop?sort=featured" />
        <ProductGrid :products="trending.slice(0, 8)" />
      </div>
    </section>

    <!-- Promo banner -->
    <BannerCard v-if="promoBanner" :banner="promoBanner" />

    <!-- Featured -->
    <section v-if="featured.length" class="section">
      <div class="container-bmw">
        <SectionHeader kicker="Editor's Picks" title="Featured Deals" link="/shop" />
        <ProductGrid :products="featured.slice(0, 8)" />
      </div>
    </section>

    <!-- Best sellers -->
    <section v-if="bestSellers.length" class="section border-t border-hairline">
      <div class="container-bmw">
        <SectionHeader kicker="Customer Favourites" title="Best Sellers" link="/shop" />
        <ProductGrid :products="bestSellers.slice(0, 4)" />
      </div>
    </section>

    <!-- Reviews -->
    <section class="section border-t border-hairline bg-surface-soft">
      <div class="container-bmw">
        <SectionHeader kicker="From Our Customers" title="Real Reviews" :stripe="true" />
        <div class="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
          <ReviewCard v-for="r in REVIEWS.slice(0, 6)" :key="r.id" :review="r" />
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="section">
      <div class="container-bmw grid grid-cols-1 gap-xl lg:grid-cols-[1fr_2fr]">
        <div>
          <div class="m-stripe mb-lg w-20" />
          <p class="kicker text-body">Need Help?</p>
          <h2 class="text-display-sm font-bold uppercase leading-none text-ink md:text-display-md">Frequently Asked Questions</h2>
          <p class="mt-md text-body-md text-body">Still unsure? Message us on WhatsApp — we reply fast.</p>
          <BaseButton to="/contact" variant="outline" class="mt-lg">Contact Us</BaseButton>
        </div>
        <FaqAccordion :items="FAQS" />
      </div>
    </section>
  </div>
</template>
