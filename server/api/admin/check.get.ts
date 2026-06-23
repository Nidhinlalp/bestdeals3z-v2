import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.replace('Bearer ', '')
  if (!token) return { isAdmin: false }

  const config = useRuntimeConfig()
  const adminClient = createClient(config.public.supabaseUrl, config.supabaseServiceKey)

  const { data: { user }, error } = await adminClient.auth.getUser(token)
  if (error || !user) return { isAdmin: false }

  const { data } = await adminClient
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  return { isAdmin: !!data }
})
