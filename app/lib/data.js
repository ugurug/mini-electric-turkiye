// Sunucu tarafı Supabase REST okuma — sayfalar SSR olsun (SEO).
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function sb(path) {
  try {
    const res = await fetch(`${URL}/rest/v1/${path}`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      cache: 'no-store',
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

// Site geneli ayarlar (Kulübe Katıl aç/kapa + link). Tablo yoksa güvenli varsayılan.
const DEFAULT_SETTINGS = { join_enabled: true, join_url: 'https://www.jotform.com/form/251503841296053' }
export async function getSettings() {
  const rows = await sb('site_settings?select=join_enabled,join_url&id=eq.1&limit=1')
  return rows[0] || DEFAULT_SETTINGS
}
