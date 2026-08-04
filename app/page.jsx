import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'

export const metadata = {
  title: 'MINI Electric Türkiye — Elektrikli MINI Topluluğu',
  description: "Türkiye'nin en büyük elektrikli MINI topluluğu. Kampanyalar, araç yıkama merkezi değerlendirmeleri, sık sorulan sorular ve topluluk içeriği tek çatı altında.",
}

const JOTFORM = 'https://www.jotform.com/form/251503841296053'

const cards = [
  { href: '/kampanyalar', icon: '🎁', title: 'Kampanyalar', desc: 'Üyelere özel güncel fırsatlar ve geçmiş kampanyalar' },
  { href: '/yikama', icon: '🚿', title: 'Yıkama Merkezleri', desc: 'Topluluğun puanladığı yıkama merkezleri ve yorumlar' },
  { href: '/sss', icon: '💬', title: 'Sık Sorulan Sorular', desc: 'MINI Electric ve topluluk hakkında merak edilenler' },
  { href: '/hakkimizda', icon: '⚡', title: 'Hakkımızda', desc: 'Minifestomuz, değerlerimiz ve topluluğun hikâyesi' },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader active="/" />

      {/* HERO */}
      <div style={{ background: '#111', color: '#fff', padding: '72px 20px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(232,0,13,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <img src="/logo.png" alt="Mini Electric Türkiye" style={{ width: 120, height: 120, objectFit: 'contain', margin: '0 auto 24px', display: 'block' }} />
          <h1 className="hero-title" style={{ fontFamily: "'Montserrat'", fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span>
          </h1>
          <p style={{ color: '#bbb', fontSize: 15, fontWeight: 400, maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.8 }}>
            Türkiye'nin dört bir yanından MINI Electric tutkunlarını bir araya getiren, deneyimleri paylaşan ve elektrikli sürüşün keyfini çıkaran Türkiye'nin en büyük Elektrikli MINI topluluğu.
          </p>
          <a href={JOTFORM} target="_blank" rel="noreferrer" className="btn-red">Kulübe Katıl</a>
        </div>
      </div>

      {/* HIZLI ERİŞİM */}
      <section className="section-inner" style={{ flex: 1, width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {cards.map((c) => (
            <a key={c.href} href={c.href} className="card" style={{ padding: '26px 22px', textDecoration: 'none', display: 'block', position: 'relative' }}>
              <div style={{ fontSize: 30, marginBottom: 14 }}>{c.icon}</div>
              <div style={{ fontFamily: "'Montserrat'", fontSize: 17, fontWeight: 800, color: '#111', marginBottom: 6 }}>{c.title}</div>
              <div style={{ color: '#777', fontSize: 13.5, lineHeight: 1.6 }}>{c.desc}</div>
              <span style={{ position: 'absolute', top: 24, right: 22, color: '#E8000D', fontSize: 18 }}>→</span>
            </a>
          ))}
        </div>
      </section>

      {/* KULÜBE KATIL */}
      <section style={{ background: '#111', color: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '64px 20px', textAlign: 'center' }}>
          <span className="tag" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Fan Kulübü</span>
          <h2 style={{ fontFamily: "'Montserrat'", fontWeight: 900, fontSize: 32, margin: '10px 0 16px', color: '#fff' }}>Kulübe Katıl</h2>
          <p style={{ color: '#bbb', fontSize: 15, marginBottom: 28, lineHeight: 1.7, maxWidth: 440, marginInline: 'auto' }}>Mini Electric Türkiye topluluğunun bir parçası ol.</p>
          <a href={JOTFORM} target="_blank" rel="noreferrer" className="btn-red">Başvuru Formunu Doldur</a>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
