import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import CampaignsClient from '../components/CampaignsClient'
import { sb } from '../lib/data'

export const metadata = {
  title: 'Kampanyalar — MINI Electric Türkiye',
  description: 'MINI Electric Türkiye topluluğunun güncel ve geçmiş kampanyaları, üyelere özel fırsatlar.',
}

export default async function KampanyalarPage() {
  const campaigns = await sb('campaigns?select=*&order=created_at.desc')
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader active="/kampanyalar" />
      <section className="section-inner" style={{ flex: 1, width: '100%' }}>
        <span className="tag">Fırsatlar</span>
        <h1 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, marginBottom: 14 }}>Kampanyalar</h1>
        <p style={{ color: '#555', fontSize: 16, lineHeight: 1.8, maxWidth: 620, marginBottom: 36 }}>
          Topluluğumuza özel güncel kampanyalar ve geçmiş çalışmalarımızın arşivi.
        </p>
        <CampaignsClient campaigns={campaigns} />
      </section>
      <SiteFooter />
    </div>
  )
}
