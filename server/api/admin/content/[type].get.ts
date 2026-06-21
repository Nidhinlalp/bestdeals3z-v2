import { serverQueryContent } from '#content/server'
import { assertType, requireAdmin } from '~~/server/utils/content'

/** List all documents of a content type (admin only). */
export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const type = assertType(getRouterParam(event, 'type') as string)
  const docs = await serverQueryContent(event, type).find()
  return docs
})
