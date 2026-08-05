import SiteHeader from '../../components/SiteHeader'
import SiteFooter from '../../components/SiteFooter'
import EventGallery from '../../components/EventGallery'
import { sb } from '../../lib/data'
import { redirect } from 'next/navigation'

async function getCampaign(id) {
  const s = String(id)
  // Kampanya id'leri UUID; enjeksiyona karşı sadece uuid/sayısal kabul et
  if (!/^[0-9a-f-]{6,40}$/i.test(s)) return null
  const rows = await sb(`campaigns?select=*&id=eq.${encodeURIComponent(s)}&limit=1`)
  return rows[0] || null
}

function fmtDate(d) {
  if (!d) return null
  try {
    return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return null }
}

function statusOf(c) {
  const now = Date.now()
  if (c.start_at && new Date(c.start_at).getTime() > now) return { label: 'Yaklaşan', color: '#F5A623', primary: false }
  if (c.end_at && new Date(c.end_at).getTime() < now) return { label: 'Tamamlandı', color: '#777', primary: false }
  return { label: 'Aktif', color: '#E8000D', primary: true }
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const c = await getCampaign(id)
  if (!c) return { title: 'Kampanyalar — MINI Electric Türkiye' }
  return {
    title: `${c.title} — MINI Electric Türkiye`,
    description: c.description || c.title,
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

export default async function KampanyaDetay({ params }) {
  const { id } = await params
  const c = await getCampaign(id)
  if (!c) redirect('/kampanyalar')

  const s = statusOf(c)
  const images = Array.isArray(c.images) ? c.images : []
  const start = fmtDate(c.start_at)
  const end = fmtDate(c.end_at)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader active="/kampanyalar" />
      <article className="section-inner" style={{ flex: 1, width: '100%', maxWidth: 800 }}>
        <a href="/kampanyalar" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>← Kampanyalar</a>

        <div style={{ display: 'flex', gap: 8, margin: '16px 0 4px', flexWrap: 'wrap' }}>
          <span className="tag" style={s.primary ? { background: '#E8000D', color: '#fff', borderColor: '#E8000D' } : { color: s.color, borderColor: s.color }}>{s.label}</span>
        </div>

        <h1 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 14 }}>{c.title}</h1>

        {(start || end) && (
          <div style={{ color: '#333', fontSize: 14.5, marginBottom: 20 }}>
            {start && <><span style={{ color: '#E8000D', fontWeight: 600 }}>Başlangıç:</span> {start}</>}
            {start && end && <>&nbsp;·&nbsp;</>}
            {end && <><span style={{ color: '#E8000D', fontWeight: 600 }}>Bitiş:</span> {end}</>}
          </div>
        )}

        {c.description && <p style={{ color: '#555', fontSize: 16.5, lineHeight: 1.7, marginBottom: 24 }}>{c.description}</p>}

        {images.length > 0 && (
          <div style={{ margin: '8px 0 28px' }}>
            <EventGallery images={images} title={c.title} />
          </div>
        )}

        {c.details && (
          <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 20 }}>
            {renderContent(c.details)}
          </div>
        )}
      </article>
      <SiteFooter />
    </div>
  )
}
