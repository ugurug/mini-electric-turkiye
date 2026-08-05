import SiteHeader from '../../components/SiteHeader'
import SiteFooter from '../../components/SiteFooter'
import { sb } from '../../lib/data'
import { redirect } from 'next/navigation'

async function getDoc(slug) {
  const rows = await sb(`technical_docs?select=*&slug=eq.${encodeURIComponent(slug)}&enabled=eq.true&limit=1`)
  return rows[0] || null
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const doc = await getDoc(slug)
  if (!doc) return { title: 'Teknik Kütüphane — MINI Electric Türkiye' }
  return {
    title: `${doc.title} — MINI Electric Türkiye`,
    description: doc.summary || doc.title,
  }
}

function renderContent(content) {
  if (!content) return <p style={{ color: '#888' }}>İçerik yakında.</p>
  return content.split(/\n{2,}/).map((block, i) => {
    const t = block.trim()
    if (!t) return null
    if (t.startsWith('## ')) {
      return <h2 key={i} style={{ fontFamily: "'Montserrat'", fontSize: 19, fontWeight: 800, color: '#111', margin: '28px 0 10px' }}>{t.slice(3)}</h2>
    }
    return <p key={i} style={{ color: '#444', fontSize: 15.5, lineHeight: 1.85, marginBottom: 14, whiteSpace: 'pre-line' }}>{t}</p>
  })
}

export default async function TeknikDetay({ params }) {
  const { slug } = await params
  const doc = await getDoc(slug)
  if (!doc) redirect('/teknik')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader active="/teknik" />
      <article className="section-inner" style={{ flex: 1, width: '100%', maxWidth: 760 }}>
        <a href="/teknik" style={{ color: '#999', fontSize: 13, textDecoration: 'none' }}>← Teknik Kütüphane</a>
        <div style={{ marginTop: 16, marginBottom: 4 }}>
          {doc.category && <span className="tag">{doc.category}</span>}
        </div>
        <h1 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 12 }}>{doc.title}</h1>
        {doc.summary && <p style={{ color: '#555', fontSize: 16.5, lineHeight: 1.7, marginBottom: 24 }}>{doc.summary}</p>}
        <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 20 }}>
          {renderContent(doc.content)}
        </div>
      </article>
      <SiteFooter />
    </div>
  )
}
