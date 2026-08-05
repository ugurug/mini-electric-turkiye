import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import StatCounters from './components/StatCounters'
import { sb } from './lib/data'

export const metadata = {
  title: 'MINI Electric Türkiye — Elektrikli MINI Topluluğu',
  description: "Türkiye'nin en büyük elektrikli MINI topluluğu. Kampanyalar, araç yıkama merkezi değerlendirmeleri, sık sorulan sorular ve topluluk içeriği tek çatı altında.",
}

const JOTFORM = 'https://www.jotform.com/form/251503841296053'

const cards = [
  { href: '/kampanyalar', icon: '🎁', title: 'Kampanyalar', desc: 'Üyelere özel güncel fırsatlar ve geçmiş kampanyalar' },
  { href: '/etkinlikler', icon: '📅', title: 'Etkinlikler', desc: 'Buluşmalar, sürüşler ve topluluk etkinlikleri' },
  { href: '/isbirlikleri', icon: '🤝', title: 'İş Birlikleri', desc: 'Anlaşmalı markalar ve üyelere özel avantajlar' },
  { href: '/topluluk', icon: '📊', title: 'Topluluk Rakamları', desc: 'Üye, şehir, model ve renk dağılımıyla topluluğun portresi' },
  { href: '/yikama', icon: '🚿', title: 'Yıkama Merkezleri', desc: 'Topluluğun puanladığı yıkama merkezleri ve yorumlar' },
  { href: '/teknik', icon: '📚', title: 'Teknik Kütüphane', desc: 'Pil sağlığı, menzil, şarj ve bakım rehberleri' },
  { href: '/sss', icon: '💬', title: 'Sık Sorulan Sorular', desc: 'MINI Electric ve topluluk hakkında merak edilenler' },
  { href: '/hakkimizda', icon: '⚡', title: 'Hakkımızda', desc: 'Minifestomuz, değerlerimiz ve topluluğun hikâyesi' },
]

function fmtDate(d) {
  if (!d) return null
  try { return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) } catch { return null }
}

function MiniCard({ href, cover, tag, title, desc, meta, grayscale }) {
  return (
    <a href={href} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}>
      {cover && (
        <div style={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={cover} alt={title} style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', filter: grayscale ? 'grayscale(0.4)' : 'none' }} />
        </div>
      )}
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {tag && <div style={{ marginBottom: 10 }}><span className="tag">{tag}</span></div>}
        <div style={{ fontFamily: "'Montserrat'", fontSize: 16, fontWeight: 800, color: '#111', marginBottom: 6, lineHeight: 1.25 }}>{title}</div>
        {meta && <div style={{ color: '#999', fontSize: 12, marginBottom: 8 }}>{meta}</div>}
        {desc && <div style={{ color: '#777', fontSize: 13, lineHeight: 1.55 }}>{desc}</div>}
        <span style={{ marginTop: 'auto', paddingTop: 12, color: '#E8000D', fontSize: 12.5, fontWeight: 600 }}>Detayları gör →</span>
      </div>
    </a>
  )
}

function SectionHead({ title, href }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
      <h2 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(22px, 3.5vw, 28px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, margin: 0 }}>{title}</h2>
      <a href={href} style={{ color: '#E8000D', fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}>Tümünü gör →</a>
    </div>
  )
}

export default async function Home() {
  const now = Date.now()
  const [campaigns, events, partners, statsRows, eventIds] = await Promise.all([
    sb('campaigns?select=id,title,description,images,start_at,end_at&order=created_at.desc&limit=3'),
    sb('events?select=id,title,description,images,event_date,category&enabled=eq.true&order=event_date.desc&limit=3'),
    sb('partners?select=id,name,logo,url&enabled=eq.true&order=display_order.asc&limit=12'),
    sb('community_stats?select=members,cities,models&id=eq.1&limit=1'),
    sb('events?select=id&enabled=eq.true'),
  ])
  const stats = statsRows[0] || {}
  const statModels = Array.isArray(stats.models) ? stats.models : []
  const heroCounters = [
    { value: stats.members || 0, label: 'Üye', suffix: '+' },
    { value: stats.cities || 0, label: 'Şehir' },
    { value: Array.isArray(eventIds) ? eventIds.length : 0, label: 'Etkinlik' },
    { value: statModels.length, label: 'Model' },
  ]
  const hasStats = (stats.members || stats.cities || statModels.length)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader active="/" />

      {/* HERO */}
      <div style={{ background: '#111', color: '#fff', padding: '40px 20px 38px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(232,0,13,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <img src="/logo.png" alt="Mini Electric Türkiye" style={{ width: 76, height: 76, objectFit: 'contain', margin: '0 auto 14px', display: 'block' }} />
          <h1 className="hero-title" style={{ fontFamily: "'Montserrat'", fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 14 }}>
            MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span>
          </h1>
          <p style={{ color: '#bbb', fontSize: 14.5, fontWeight: 400, maxWidth: 560, margin: '0 auto 22px', lineHeight: 1.7 }}>
            Türkiye'nin dört bir yanından MINI Electric tutkunlarını bir araya getiren, deneyimleri paylaşan ve elektrikli sürüşün keyfini çıkaran Türkiye'nin en büyük Elektrikli MINI topluluğu.
          </p>
          <a href={JOTFORM} target="_blank" rel="noreferrer" className="btn-red">Kulübe Katıl</a>

          {hasStats && (
            <div style={{ maxWidth: 620, margin: '36px auto 0', paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <StatCounters items={heroCounters} dark />
              <div style={{ marginTop: 20 }}>
                <a href="/topluluk" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12.5, fontWeight: 600, letterSpacing: 0.5, textDecoration: 'none', textTransform: 'uppercase' }}>Tüm Rakamlar →</a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SON KAMPANYALAR */}
      {campaigns.length > 0 && (
        <section className="section-inner" style={{ width: '100%' }}>
          <SectionHead title="Son Kampanyalar" href="/kampanyalar" />
          <div className="grid-3">
            {campaigns.map((c) => {
              const finalized = c.end_at && new Date(c.end_at).getTime() < now
              return (
                <MiniCard
                  key={c.id}
                  href={`/kampanyalar/${c.id}`}
                  cover={Array.isArray(c.images) && c.images.length ? c.images[0] : null}
                  tag={finalized ? 'Tamamlandı' : 'Aktif'}
                  title={c.title}
                  desc={c.description}
                  grayscale={finalized}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* SON ETKİNLİKLER */}
      {events.length > 0 && (
        <section className="section-inner section-alt" style={{ width: '100%' }}>
          <SectionHead title="Son Etkinlikler" href="/etkinlikler" />
          <div className="grid-3">
            {events.map((e) => {
              const past = e.event_date && new Date(e.event_date).getTime() < now
              return (
                <MiniCard
                  key={e.id}
                  href={`/etkinlikler/${e.id}`}
                  cover={Array.isArray(e.images) && e.images.length ? e.images[0] : null}
                  tag={e.category || (past ? 'Geçmiş' : 'Yaklaşan')}
                  title={e.title}
                  desc={e.description}
                  meta={fmtDate(e.event_date)}
                  grayscale={past}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* HIZLI ERİŞİM */}
      <section className="section-inner" style={{ width: '100%' }}>
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

      {/* PARTNER LOGO BANDI */}
      {partners.length > 0 && (
        <section className="section-alt" style={{ width: '100%', borderTop: '1px solid #eee' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '44px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 26 }}>
              <span className="tag">Kurumsal</span>
              <h2 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(20px, 3.2vw, 26px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, margin: '8px 0 6px' }}>İş Birliklerimiz</h2>
              <p style={{ color: '#888', fontSize: 14, margin: 0 }}>Topluluğumuza değer katan markalar</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
              {partners.map((p) => {
                const inner = p.logo
                  ? <img src={p.logo} alt={p.name} title={p.name} style={{ maxWidth: 130, maxHeight: 46, width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', filter: 'grayscale(1)', opacity: 0.75 }} />
                  : <span style={{ fontFamily: "'Montserrat'", fontSize: 15, fontWeight: 800, color: '#444', letterSpacing: 0.2 }}>{p.name}</span>
                const box = { display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 120, height: 72, padding: '0 20px', background: '#fff', border: '1px solid #eee', borderRadius: 10 }
                return p.url
                  ? <a key={p.id} href={p.url} target="_blank" rel="noreferrer" style={{ ...box, textDecoration: 'none' }}>{inner}</a>
                  : <div key={p.id} style={box}>{inner}</div>
              })}
            </div>
            <div style={{ textAlign: 'center', marginTop: 26 }}>
              <a href="/isbirlikleri" className="btn-outline">Tüm İş Birlikleri</a>
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  )
}
