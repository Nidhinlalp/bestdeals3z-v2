import { assertType, requireAdmin, saveDoc, docExists } from '~~/server/utils/content'
import { validateDoc } from '~~/server/utils/validate'

/** Create or update a content document (admin only). Writes a markdown file. */
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const type = assertType(getRouterParam(event, 'type') as string)
  const payload = await readBody<Record<string, unknown>>(event)

  let result
  try {
    result = validateDoc(type, payload)
  } catch (err) {
    throw createError({ statusCode: 422, statusMessage: 'Validation failed', data: (err as { issues?: unknown }).issues })
  }

  const isUpdate = await docExists(type, result.slug)
  await saveDoc(type, result.slug, result.data, result.body)
  return { ok: true, slug: result.slug, action: isUpdate ? 'updated' : 'created' }
})
