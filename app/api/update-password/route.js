import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const { userId, password } = await request.json()

    if (!userId || !password) {
      return Response.json({ error: 'userId ve password gerekli' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, { password })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}