import SiteHeader from '../../components/SiteHeader'
import SiteFooter from '../../components/SiteFooter'
import EventGallery from '../../components/EventGallery'
import { sb } from '../../lib/data'
import { redirect } from 'next/navigation'

async function getEvent(id) {
  if (!/^\d+$/.test(String(id))) return null
  const rows = await sb(`events?select=*&id=eq.${id}&enabled=eq.true&limit=1`)
  return rows[0] || null
}

function fmtDate(d) {
  if (!d) return null
  try {
    return new Date(d).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return null }
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const e = await getEvent(id)
  if (!e) return { title: 'Etkinlikler — MINI Electric Türkiye' }
  return {
    title: `${e.title} — MINI Electric Türkiye`,
    description: e.description || e.title,
  }
}

function renderContent(content) {
  if (!content) return null
  return content.split(/\n{2,}/).map((block, i) => {
    const t = block.trim()
    if (!t) return null
    if (t.startsWith('## ')) {
      return <h2 key={i} style={{ fontFamily: "'Montserrat'", fontSize: 20, fontWeight: 800, color: '#111', margin: '28px 0 10px' }}>{t.slice(3)}</h2>
    }
    return <p key={i} style={{ color: '#444', fontSize: 15.5, lineHeight: 1.85, marginBottom: 14, whiteSpace: 'pre-line' }}>{t}</p>
  })
}

export default async function EtkinlikDetay({ params }) {
  const { id } = await params
  const e = await getEvent(id)
  if (!e) redirect('/etkinlikler')

  const date = fmtDate(e.event_date)
  const past = e.event_date ? new Date(e.event_date).getTime() < Date.now() : false
  const images = Array.isArray(e.images) ? e.images : []

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader active="/etkinlikler" />
      <article className="section-inner" style={{ flex: 1, width: '100%', maxWidth: 800 }}>
        <a href="/etkinlikler" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>← Etkinlikler</a>

        <div style={{ display: 'flex', gap: 8, margin: '16px 0 4px', flexWrap: 'wrap' }}>
          {e.category && <span className="tag">{e.category}</span>}
          <span className="tag" style={past ? {} : { background: '#E8000D', color: '#fff', borderColor: '#E8000D' }}>{past ? 'Geçmiş' : 'Yaklaşan'}</span>
        </div>

        <h1 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 14 }}>{e.title}</h1>

        {(date || e.location) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
            {date && <div style={{ color: '#333', fontSize: 15 }}>🗓️ {date}</div>}
            {e.location && <div style={{ color: '#333', fontSize: 15 }}>📍 {e.location}</div>}
          </div>
        )}

        {e.description && <p style={{ color: '#555', fontSize: 16.5, lineHeight: 1.7, marginBottom: 24 }}>{e.description}</p>}

        {images.length > 0 && (
          <div style={{ margin: '8px 0 28px' }}>
            <EventGallery images={images} title={e.title} />
          </div>
        )}

        {e.content && (
          <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 20 }}>
            {renderContent(e.content)}
          </div>
        )}
      </article>
      <SiteFooter />
    </div>
  )
}
