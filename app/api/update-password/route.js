import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const { userId, password } = await request.json()

    if (!userId || !password) {
      return Response.json({ error: 'userId ve password gerekli' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { 
        password: password,
        email_confirm: true
      }
    )

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, user: data.user.id })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}