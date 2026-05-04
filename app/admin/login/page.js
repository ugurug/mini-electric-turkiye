'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-posta veya şifre hatalı.')
      setLoading(false)
      return
    }

    // Check if user has a profile (is an admin)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (!profile) {
      setError('Bu hesabın admin yetkisi yok.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
  }

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600&family=Barlow+Condensed:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { background: #1a1a1a; border: 1px solid #333; color: #fff; padding: 12px 16px; font-family: 'Barlow', sans-serif; font-size: 14px; width: 100%; outline: none; }
        input:focus { border-color: #E8000D; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 400, padding: 24 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid #E8000D', background: '#0A0A0A', margin: '0 auto 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.2 }}>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 8, letterSpacing: 2, color: '#fff' }}>ELECTRIC</span>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 20, color: '#fff' }}>MINI</span>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 7, letterSpacing: 1.5, color: '#fff' }}>TÜRKİYE</span>
          </div>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, letterSpacing: 3, color: '#fff' }}>
            MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span>
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, letterSpacing: 3, color: '#555', textTransform: 'uppercase', marginTop: 4 }}>Admin Paneli</div>
        </div>

        {/* Form */}
        <div style={{ background: '#111', border: '1px solid #222', borderTop: '3px solid #E8000D', padding: 32 }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, letterSpacing: 2, color: '#aaa', textTransform: 'uppercase', marginBottom: 6 }}>E-posta</div>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" />
            </div>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, letterSpacing: 2, color: '#aaa', textTransform: 'uppercase', marginBottom: 6 }}>Şifre</div>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {error && (
              <div style={{ color: '#E8000D', fontSize: 13, fontFamily: "'Barlow Condensed'", letterSpacing: 0.5 }}>⚠ {error}</div>
            )}
            <button type="submit" disabled={loading} style={{ background: loading ? '#555' : '#E8000D', color: '#fff', border: 'none', padding: '14px', fontFamily: "'Barlow Condensed'", fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{ color: '#555', fontSize: 12, fontFamily: "'Barlow Condensed'", letterSpacing: 1, textDecoration: 'none' }}>← Ana Sayfaya Dön</a>
        </div>
      </div>
    </div>
  )
}