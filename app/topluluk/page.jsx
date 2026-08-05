import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import StatCounters from '../components/StatCounters'
import { sb } from '../lib/data'

export const metadata = {
  title: 'Topluluk Rakamları — MINI Electric Türkiye',
  description: "MINI Electric Türkiye topluluğunun portresi: üye sayısı, şehir dağılımı, model ve renk dağılımı, yıllara göre büyüme.",
}

function BarList({ items = [], accent = '#E8000D', unit = '' }) {
  const rows = items.filter(i => i && i.label)
  if (rows.length === 0) return null
  const max = Math.max(...rows.map(r => Number(r.value) || 0), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {rows.map((r, i) => {
        const v = Number(r.value) || 0
        const pct = Math.max((v / max) * 100, 2)
        const color = r.hex || accent
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{v.toLocaleString('tr-TR')}{unit}</span>
            </div>
            <div style={{ height: 10, background: '#eee', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 6 }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Panel({ title, subtitle, children, full }) {
  return (
    <div className="card" style={{ padding: 24, ...(full ? { gridColumn: '1 / -1' } : {}) }}>
      <h2 style={{ fontFamily: "'Montserrat'", fontSize: 18, fontWeight: 800, color: '#111', marginBottom: subtitle ? 4 : 18 }}>{title}</h2>
      {subtitle && <p style={{ color: '#888', fontSize: 13, marginBottom: 18 }}>{subtitle}</p>}
      {children}
    </div>
  )
}

export default async function ToplulukPage() {
  const [rows, eventIds] = await Promise.all([
    sb('community_stats?select=*&id=eq.1&limit=1'),
    sb('events?select=id&enabled=eq.true'),
  ])
  const s = rows[0] || {}
  const models = Array.isArray(s.models) ? s.models : []
  const colors = Array.isArray(s.colors) ? s.colors : []
  const citiesDist = Array.isArray(s.cities_dist) ? s.cities_dist : []
  const growth = Array.isArray(s.growth) ? s.growth : []
  const eventsCount = Array.isArray(eventIds) ? eventIds.length : 0

  const counters = [
    { value: s.members || 0, label: 'Üye', suffix: '+' },
    { value: s.cities || 0, label: 'Şehir' },
    { value: eventsCount, label: 'Etkinlik' },
    { value: models.length, label: 'Model' },
  ]

  const hasAny = (s.members || s.cities || models.length || colors.length || citiesDist.length || growth.length || s.survey_summary)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SiteHeader active="/topluluk" />
      <section className="section-inner" style={{ flex: 1, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span className="tag">Portre</span>
          <h1 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, margin: '10px 0 14px' }}>Topluluk Rakamları</h1>
          <p style={{ color: '#555', fontSize: 16, lineHeight: 1.8, maxWidth: 560, margin: '0 auto 8px' }}>
            Türkiye'nin dört bir yanından elektrikli MINI tutkunları — sayılarla topluluğumuzun portresi.
          </p>
        </div>

        <div style={{ margin: '32px 0 12px' }}>
          <StatCounters items={counters} size="lg" />
        </div>

        {hasAny && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18, marginTop: 40 }}>
            {models.length > 0 && (
              <Panel title="Model Dağılımı" subtitle="Topluluktaki elektrikli MINI modelleri">
                <BarList items={models} />
              </Panel>
            )}
            {colors.length > 0 && (
              <Panel title="Renk Dağılımı" subtitle="Topluluktaki MINI renkleri">
                <BarList items={colors} />
              </Panel>
            )}
            {citiesDist.length > 0 && (
              <Panel title="Şehir Dağılımı" subtitle="Üyelerin en yoğun olduğu şehirler" full>
                <BarList items={citiesDist} accent="#111" />
              </Panel>
            )}
          </div>
        )}

        {s.survey_summary && (
          <div className="card" style={{ padding: 24, marginTop: 18, borderLeft: '3px solid #E8000D' }}>
            <h2 style={{ fontFamily: "'Montserrat'", fontSize: 16, fontWeight: 800, color: '#111', marginBottom: 10 }}>Kasko Anketi Özeti</h2>
            <p style={{ color: '#444', fontSize: 15, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>{s.survey_summary}</p>
          </div>
        )}

        {!hasAny && (
          <div style={{ color: '#bbb', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>Topluluk rakamları yakında güncellenecek.</div>
        )}
      </section>
      <SiteFooter />
    </div>
  )
}
