import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import WashClient from '../components/WashClient'
import { sb } from '../lib/data'

export const metadata = {
  title: 'Araç Yıkama Merkezleri — MINI Electric Türkiye',
  description: 'Türkiye genelinde topluluk üyelerinin puanladığı araç yıkama merkezleri. İl ve ilçeye göre filtrele, yorumları oku, kendi deneyimini paylaş.',
}

export default async function YikamaPage() {
  const [centers, comments] = await Promise.all([
    sb('washing_centers?select=*&approved=eq.true'),
    sb('washing_comments?select=*&approved=eq.true'),
  ])
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader active="/yikama" />
      <section className="section-inner" style={{ flex: 1, width: '100%' }}>
        <span className="tag">Topluluk</span>
        <h1 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, marginBottom: 14 }}>Araç Yıkama Merkezleri</h1>
        <p style={{ color: '#555', fontSize: 16, lineHeight: 1.8, maxWidth: 640, marginBottom: 32 }}>
          Topluluk üyelerinin deneyimlerine göre puanlanan yıkama merkezleri. Bölgene göre filtrele, yorumları oku ve kendi deneyimini ekle.
        </p>
        <WashClient centers={centers} comments={comments} />
      </section>
      <SiteFooter />
    </div>
  )
}
