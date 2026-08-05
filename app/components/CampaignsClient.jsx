'use client'
import { useState } from 'react'

function Empty({ text }) {
  return <div style={{ color: '#bbb', fontSize: 13, fontFamily: "'Inter'", padding: '24px 0' }}>{text}</div>
}

function CampaignCard({ campaign, active }) {
  const cover = Array.isArray(campaign.images) && campaign.images.length ? campaign.images[0] : null
  const start = campaign.start_at ? new Date(campaign.start_at).toLocaleDateString('tr-TR') : null
  const end = campaign.end_at ? new Date(campaign.end_at).toLocaleDateString('tr-TR') : null
  return (
    <a href={`/kampanyalar/${campaign.id}`} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', opacity: active ? 1 : 0.85, borderTop: `3px solid ${active ? '#E8000D' : '#ddd'}` }}>
      {cover && (
        <div style={{ width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={cover} alt={campaign.title} style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block', filter: active ? 'none' : 'grayscale(0.4)' }} />
        </div>
      )}
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: 10 }}>
          <span className="tag" style={active ? { background: '#E8000D', color: '#fff', borderColor: '#E8000D' } : {}}>{active ? 'Aktif' : 'Tamamlandı'}</span>
        </div>
        <div style={{ fontFamily: "'Montserrat'", fontSize: 17, fontWeight: 800, color: '#111', marginBottom: 8, lineHeight: 1.25 }}>{campaign.title}</div>
        {campaign.description && <div style={{ color: '#666', fontSize: 13.5, lineHeight: 1.6, marginBottom: 12 }}>{campaign.description}</div>}
        {(start || end) && (
          <div style={{ fontSize: 11.5, color: '#999', marginBottom: 12 }}>
            {start && <><span style={{ color: '#E8000D', fontWeight: 600 }}>Başlangıç:</span> {start}</>}
            {start && end && <>&nbsp;·&nbsp;</>}
            {end && <><span style={{ color: '#E8000D', fontWeight: 600 }}>Bitiş:</span> {end}</>}
          </div>
        )}
        <span style={{ marginTop: 'auto', color: '#E8000D', fontSize: 13, fontWeight: 600 }}>Detayları gör →</span>
      </div>
    </a>
  )
}

export default function CampaignsClient({ campaigns = [] }) {
  const [showFinalized, setShowFinalized] = useState(false)
  const now = new Date()
  const activeCampaigns = campaigns.filter(c => new Date(c.start_at) <= now && new Date(c.end_at) >= now)
  const finalizedCampaigns = campaigns.filter(c => new Date(c.end_at) < now)

  return (
    <>
      {activeCampaigns.length === 0
        ? <Empty text="Şu an aktif kampanya bulunmuyor." />
        : <div className="grid-3">{activeCampaigns.map(c => <CampaignCard key={c.id} campaign={c} active />)}</div>
      }

      {finalizedCampaigns.length > 0 && (
        <div style={{ marginTop: 44 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: showFinalized ? 24 : 0, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: "'Montserrat'", fontSize: 22, fontWeight: 900, color: '#111', flex: 1 }}>Geçmiş Kampanyalar</div>
            <button onClick={() => setShowFinalized(!showFinalized)} className="btn-ghost">
              {showFinalized ? '▲ Gizle' : '▼ Göster'}
            </button>
          </div>
          {showFinalized && (
            <div className="grid-3" style={{ marginTop: 20 }}>
              {finalizedCampaigns.map(c => <CampaignCard key={c.id} campaign={c} active={false} />)}
            </div>
          )}
        </div>
      )}
    </>
  )
}
