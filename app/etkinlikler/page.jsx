import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { sb } from '../lib/data'

export const metadata = {
  title: 'Etkinlikler — MINI Electric Türkiye',
  description: 'MINI Electric Türkiye topluluğunun buluşmaları, sürüşleri ve etkinlikleri. Yaklaşan ve geçmiş etkinlikleri keşfet.',
}

function fmtDate(d) {
  if (!d) return null
  try {
    return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return null }
}

function EventCard({ e, past }) {
  const cover = Array.isArray(e.images) && e.images.length ? e.images[0] : null
  const date = fmtDate(e.event_date)
  return (
    <a href={`/etkinlikler/${e.id}`} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: past ? 0.85 : 1, textDecoration: 'none', color: 'inherit' }}>
      {cover && (
        <div style={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={cover} alt={e.title} style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', filter: past ? 'grayscale(0.4)' : 'none' }} />
        </div>
      )}
      <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {e.category && <span className="tag">{e.category}</span>}
          {!past && <span className="tag" style={{ background: '#E8000D', color: '#fff', borderColor: '#E8000D' }}>Yaklaşan</span>}
        </div>
        <h3 style={{ fontFamily: "'Montserrat'", fontSize: 19, fontWeight: 800, color: '#111', marginBottom: 10, lineHeight: 1.25 }}>{e.title}</h3>
        {(date || e.location) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
            {date && <div style={{ color: '#555', fontSize: 13.5 }}>🗓️ {date}</div>}
            {e.location && <div style={{ color: '#555', fontSize: 13.5 }}>📍 {e.location}</div>}
          </div>
        )}
        {e.description && <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{e.description}</p>}
        <span style={{ display: 'inline-block', marginTop: 14, color: '#E8000D', fontSize: 13, fontWeight: 600 }}>Detayları gör →</span>
      </div>
    </a>
  )
}

export default async function EtkinliklerPage() {
  const events = await sb('events?select=*&enabled=eq.true&order=event_date.desc')
  const now = Date.now()
  const upcoming = events.filter(e => e.event_date && new Date(e.event_date).getTime() >= now).sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
  const past = events.filter(e => !e.event_date || new Date(e.event_date).getTime() < now)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader active="/etkinlikler" />
      <section className="section-inner" style={{ flex: 1, width: '100%' }}>
        <span className="tag">Topluluk</span>
        <h1 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, marginBottom: 14 }}>Etkinlikler</h1>
        <p style={{ color: '#555', fontSize: 16, lineHeight: 1.8, maxWidth: 640, marginBottom: 32 }}>
          Buluşmalar, sürüşler ve sergiler — MINI Electric Türkiye topluluğunun bir araya geldiği anlar.
        </p>

        {events.length === 0 ? (
          <div style={{ color: '#bbb', fontSize: 14, padding: '24px 0' }}>Etkinlik yakında duyurulacak.</div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <>
                <h2 style={{ fontFamily: "'Montserrat'", fontSize: 22, fontWeight: 800, color: '#111', margin: '8px 0 18px' }}>Yaklaşan Etkinlikler</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 44 }}>
                  {upcoming.map(e => <EventCard key={e.id} e={e} past={false} />)}
                </div>
              </>
            )}
            {past.length > 0 && (
              <>
                <h2 style={{ fontFamily: "'Montserrat'", fontSize: 22, fontWeight: 800, color: '#111', margin: '8px 0 18px' }}>Geçmiş Etkinlikler</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                  {past.map(e => <EventCard key={e.id} e={e} past={true} />)}
                </div>
              </>
            )}
          </>
        )}
      </section>
      <SiteFooter />
    </div>
  )
}
