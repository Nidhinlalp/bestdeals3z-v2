import type { Product } from '~/types'
import { SITE } from '~/constants/site'
import { effectivePrice } from '~/utils/format'

/** Inject a JSON-LD <script> into the head. */
function useJsonLd(data: MaybeRefOrGetter<Record<string, unknown>>) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: computed(() => JSON.stringify(toValue(data))),
      },
    ],
  })
}

export function useOrganizationSchema() {
  const url = useRuntimeConfig().public.siteUrl
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: SITE.name,
    url,
    logo: `${url}/favicon.svg`,
    description: SITE.description,
    sameAs: Object.values(SITE.social),
  })
}

export function useProductSchema(product: MaybeRefOrGetter<Product | null | undefined>) {
  const url = useRuntimeConfig().public.siteUrl
  useJsonLd(() => {
    const p = toValue(product)
    if (!p) return {}
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.title,
      description: p.shortDescription || p.description,
      image: p.images.map((i) => `${url}${i}`),
      sku: p.slug,
      category: p.category,
      brand: { '@type': 'Brand', name: SITE.name },
      ...(p.reviewCount > 0
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: p.rating,
              reviewCount: p.reviewCount,
            },
          }
        : {}),
      offers: {
        '@type': 'Offer',
        url: `${url}/product/${p.slug}`,
        priceCurrency: SITE.currency,
        price: effectivePrice(p),
        availability:
          p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
    }
  })
}

export interface Crumb {
  name: string
  item: string
}

export function useBreadcrumbSchema(crumbs: MaybeRefOrGetter<Crumb[]>) {
  const url = useRuntimeConfig().public.siteUrl
  useJsonLd(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: toValue(crumbs).map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${url}${c.item}`,
    })),
  }))
}

export function useFaqSchema(faqs: MaybeRefOrGetter<{ question: string; answer: string }[]>) {
  useJsonLd(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: toValue(faqs).map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }))
}
