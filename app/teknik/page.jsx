import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { sb } from '../lib/data'

export const metadata = {
  title: 'Teknik Kütüphane — MINI Electric Türkiye',
  description: 'Elektrikli MINI için pil sağlığı, menzil, şarj ve bakım rehberleri. Topluluğun derlediği gerçek dünya teknik bilgileri.',
}

export default async function TeknikPage() {
  const docs = await sb('technical_docs?select=id,title,slug,category,summary&enabled=eq.true&order=display_order.asc')
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader active="/teknik" />
      <section className="section-inner" style={{ flex: 1, width: '100%' }}>
        <span className="tag">Bilgi</span>
        <h1 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, marginBottom: 14 }}>Teknik Kütüphane</h1>
        <p style={{ color: '#555', fontSize: 16, lineHeight: 1.8, maxWidth: 640, marginBottom: 32 }}>
          Elektrikli MINI için pil sağlığı, menzil, şarj ve bakım rehberleri — topluluğun derlediği pratik bilgiler.
        </p>

        {docs.length === 0 ? (
          <div style={{ color: '#bbb', fontSize: 14, padding: '24px 0' }}>Doküman yakında eklenecek.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {docs.map((d) => (
              <a key={d.id} href={`/teknik/${d.slug}`} className="card" style={{ padding: 22, textDecoration: 'none', display: 'block' }}>
                {d.category && <span className="tag" style={{ marginBottom: 12 }}>{d.category}</span>}
                <div style={{ fontFamily: "'Montserrat'", fontSize: 17, fontWeight: 800, color: '#111', marginBottom: 8, lineHeight: 1.25 }}>{d.title}</div>
                {d.summary && <div style={{ color: '#777', fontSize: 13.5, lineHeight: 1.6 }}>{d.summary}</div>}
                <span style={{ display: 'inline-block', marginTop: 14, color: '#E8000D', fontSize: 13, fontWeight: 600 }}>Devamını oku →</span>
              </a>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  )
}
