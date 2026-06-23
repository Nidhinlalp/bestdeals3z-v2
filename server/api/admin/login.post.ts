/** Replaced by Supabase Auth — this endpoint is no longer used. */
export default defineEventHandler(() => {
  throw createError({ statusCode: 410, statusMessage: 'Gone — use Supabase Auth instead.' })
})
