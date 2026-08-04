'use client'
import { useState } from 'react'

function Empty({ text }) {
  return <div style={{ color: '#bbb', fontSize: 13, fontFamily: "'Inter'", padding: '24px 0' }}>{text}</div>
}

function CampaignCard({ campaign, active }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card" style={{ opacity: active ? 1 : 0.7, borderTop: `3px solid ${active ? '#E8000D' : '#ddd'}` }}>
      <div onClick={() => setOpen(!open)} style={{ padding: 20, cursor: 'pointer', userSelect: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Montserrat'", fontSize: 16, fontWeight: 800, color: '#111', marginBottom: 8 }}>{campaign.title}</div>
            <div style={{ color: '#666', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{campaign.description}</div>
            <div style={{ fontSize: 11, color: '#999' }}>
              <span style={{ color: '#E8000D', fontWeight: 600 }}>Başlangıç:</span> {new Date(campaign.start_at).toLocaleDateString('tr-TR')}
              &nbsp;·&nbsp;
              <span style={{ color: '#E8000D', fontWeight: 600 }}>Bitiş:</span> {new Date(campaign.end_at).toLocaleDateString('tr-TR')}
            </div>
          </div>
          <div style={{ color: '#E8000D', fontSize: 22, fontWeight: 300, flexShrink: 0 }}>{open ? '−' : '+'}</div>
        </div>
      </div>
      {open && (
        <div style={{ borderTop: '1px solid #f5f5f5', padding: '16px 20px', background: '#fafafa' }}>
          {campaign.details
            ? <div style={{ color: '#444', fontSize: 14, lineHeight: 1.8, marginBottom: campaign.images?.length > 0 ? 16 : 0, whiteSpace: 'pre-wrap' }}>{campaign.details}</div>
            : !campaign.images?.length && <div style={{ color: '#bbb', fontSize: 13 }}>Detay eklenmemiş.</div>
          }
          {campaign.images?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {campaign.images.map((url, i) => (
                <img key={i} src={url} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 6, cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); window.open(url, '_blank') }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
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
        : <div className="campaign-grid">{activeCampaigns.map(c => <CampaignCard key={c.id} campaign={c} active />)}</div>
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
            <div className="campaign-grid" style={{ marginTop: 20 }}>
              {finalizedCampaigns.map(c => <CampaignCard key={c.id} campaign={c} active={false} />)}
            </div>
          )}
        </div>
      )}
    </>
  )
}
