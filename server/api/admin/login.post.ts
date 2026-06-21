/** Verify the admin password. The client stores it and sends it as x-admin-key on writes. */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)
  const expected = useRuntimeConfig().adminPassword
  if (!body?.password || body.password !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Incorrect password' })
  }
  return { ok: true }
})
