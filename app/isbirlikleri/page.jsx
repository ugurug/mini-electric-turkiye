import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { sb } from '../lib/data'

const JOTFORM = 'https://www.jotform.com/form/251503841296053'
const INSTAGRAM = 'https://instagram.com/minielectricturkiye'

export const metadata = {
  title: 'İş Birlikleri — MINI Electric Türkiye',
  description: 'MINI Electric Türkiye topluluğunun iş birliği yaptığı markalar, servisler ve üyelere özel avantajlar. Markanızla topluluğumuzu buluşturun.',
}

function PartnerCard({ p }) {
  const inner = (
    <>
      <div style={{ width: '100%', height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, background: '#f4f4f4', borderRadius: 10, overflow: 'hidden' }}>
        {p.logo
          ? <img src={p.logo} alt={p.name} style={{ maxWidth: '80%', maxHeight: '80%', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }} />
          : <span style={{ fontFamily: "'Montserrat'", fontSize: 22, fontWeight: 900, color: '#ccc' }}>{p.name?.slice(0, 2).toUpperCase()}</span>}
      </div>
      {p.category && <span className="tag" style={{ marginBottom: 10 }}>{p.category}</span>}
      <div style={{ fontFamily: "'Montserrat'", fontSize: 17, fontWeight: 800, color: '#111', marginBottom: 8, lineHeight: 1.25 }}>{p.name}</div>
      {p.description && <div style={{ color: '#666', fontSize: 13.5, lineHeight: 1.6, marginBottom: 12 }}>{p.description}</div>}
      {p.benefit && (
        <div style={{ marginTop: 'auto', background: 'rgba(232,0,13,0.06)', border: '1px solid rgba(232,0,13,0.18)', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E8000D', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>Üyelere Özel</div>
          <div style={{ color: '#333', fontSize: 13.5, lineHeight: 1.5 }}>{p.benefit}</div>
        </div>
      )}
      {p.url && <span style={{ display: 'inline-block', marginTop: 12, color: '#E8000D', fontSize: 13, fontWeight: 600 }}>Firmayı ziyaret et →</span>}
    </>
  )
  const style = { padding: 20, display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', height: '100%' }
  return p.url
    ? <a href={p.url} target="_blank" rel="noreferrer" className="card" style={style}>{inner}</a>
    : <div className="card" style={style}>{inner}</div>
}

export default async function IsBirlikleriPage() {
  const partners = await sb('partners?select=*&enabled=eq.true&order=display_order.asc,created_at.desc')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader active="/isbirlikleri" />
      <section className="section-inner" style={{ flex: 1, width: '100%' }}>
        <span className="tag">Kurumsal</span>
        <h1 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, marginBottom: 14 }}>İş Birlikleri</h1>
        <p style={{ color: '#555', fontSize: 16, lineHeight: 1.8, maxWidth: 640, marginBottom: 36 }}>
          Topluluğumuzla iş birliği yapan markalar ve servisler — üyelerimize sunulan özel avantajlarla birlikte.
        </p>

        {partners.length === 0 ? (
          <div style={{ color: '#bbb', fontSize: 14, padding: '24px 0' }}>İş birlikleri yakında duyurulacak.</div>
        ) : (
          <div className="grid-3">
            {partners.map((p) => <PartnerCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      {/* BİRLİKTE ÇALIŞALIM */}
      <section style={{ background: '#111', color: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '56px 20px', textAlign: 'center' }}>
          <span className="tag" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>İş Birliği</span>
          <h2 style={{ fontFamily: "'Montserrat'", fontWeight: 900, fontSize: 'clamp(24px, 4vw, 30px)', margin: '10px 0 14px', color: '#fff' }}>Birlikte Çalışalım</h2>
          <p style={{ color: '#bbb', fontSize: 15, marginBottom: 26, lineHeight: 1.7, maxWidth: 520, marginInline: 'auto' }}>
            Markanızı Türkiye'nin en büyük elektrikli MINI topluluğuyla buluşturmak ister misiniz? İş birliği için bize ulaşın.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn-red">Instagram'dan Yaz</a>
            <a href={JOTFORM} target="_blank" rel="noreferrer" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>Başvuru Formu</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
