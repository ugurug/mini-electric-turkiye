import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { getSettings } from '../lib/data'

export const metadata = {
  title: 'İletişim — MINI Electric Türkiye',
  description: "MINI Electric Türkiye topluluğuyla iletişim: Instagram üzerinden bize ulaşın, başvuru formuyla topluluğa katılın.",
}

const INSTAGRAM = 'https://www.instagram.com/minielectricturkiye'

export default async function Iletisim() {
  const settings = await getSettings()
  const channels = [
    { icon: '📸', label: 'Instagram', value: '@minielectricturkiye', href: INSTAGRAM, note: 'Bize ulaşmanın en hızlı yolu' },
    ...(settings.join_enabled ? [{ icon: '🎫', label: 'Kulübe Katıl', value: 'Başvuru formu', href: settings.join_url, note: 'Topluluğa katılmak için doldur' }] : []),
  ]
  return (
    <div style={{ background: '#f8f8f8', color: '#111', fontFamily: "'Inter', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@300;400;500;600&display=swap');`}</style>

      <SiteHeader active="/iletisim" />

      <section style={{ maxWidth: 760, margin: '0 auto', padding: '56px 20px 8px' }}>
        <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#E8000D', border: '1.5px solid #E8000D', padding: '3px 10px', borderRadius: 20, marginBottom: 14 }}>İletişim</span>
        <h1 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, marginBottom: 14 }}>Bize ulaş</h1>
        <p style={{ color: '#555', fontSize: 16, lineHeight: 1.8, maxWidth: 600 }}>
          Sorular, öneriler veya topluluğa katılmak için aşağıdaki kanallardan bize ulaşabilirsin.
        </p>
      </section>

      <section style={{ maxWidth: 760, margin: '0 auto', padding: '24px 20px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {channels.map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
              style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', padding: '22px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 30, flexShrink: 0 }}>{c.icon}</span>
              <span>
                <span style={{ display: 'block', fontFamily: "'Montserrat'", fontSize: 16, fontWeight: 800, color: '#111' }}>{c.label}</span>
                <span style={{ display: 'block', color: '#E8000D', fontSize: 14, fontWeight: 600, margin: '2px 0' }}>{c.value}</span>
                <span style={{ display: 'block', color: '#999', fontSize: 12.5 }}>{c.note}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
