/** robots.txt — allow everything except the admin area, point to the sitemap. */
export default defineEventHandler((event) => {
  const base = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /checkout
Disallow: /cart

Sitemap: ${base}/sitemap.xml
`
  setHeader(event, 'Content-Type', 'text/plain')
  return body
})
