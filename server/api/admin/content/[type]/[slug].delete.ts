import { assertType, requireAdmin, deleteDoc } from '~~/server/utils/content'

/** Delete a content document (admin only). */
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const type = assertType(getRouterParam(event, 'type') as string)
  const slug = getRouterParam(event, 'slug') as string
  const removed = await deleteDoc(type, slug)
  if (!removed) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return { ok: true, slug }
})
