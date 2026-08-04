import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import FaqClient from '../components/FaqClient'
import { sb } from '../lib/data'

export const metadata = {
  title: 'Sık Sorulan Sorular — MINI Electric Türkiye',
  description: 'MINI Electric ve topluluk hakkında sık sorulan sorular. Kategorilere ayrılmış, aranabilir SSS.',
}

export default async function SssPage() {
  const faqs = await sb('faq?select=*&enabled=eq.true&order=display_order.asc')
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader active="/sss" />
      <section className="section-inner" style={{ flex: 1, width: '100%' }}>
        <span className="tag">Bilgi</span>
        <h1 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, marginBottom: 14 }}>Sık Sorulan Sorular</h1>
        <p style={{ color: '#555', fontSize: 16, lineHeight: 1.8, maxWidth: 620, marginBottom: 28 }}>
          MINI Electric ve topluluk hakkında merak edilenler. Aramak için yazın ya da kategoriye göre süzün.
        </p>
        <FaqClient faqs={faqs} />
      </section>
      <SiteFooter />
    </div>
  )
}
