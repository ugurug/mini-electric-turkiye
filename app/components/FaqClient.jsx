'use client'
import { useState } from 'react'

function Empty({ text }) {
  return <div style={{ color: '#bbb', fontSize: 13, fontFamily: "'Inter'", padding: '24px 0' }}>{text}</div>
}

function FaqItem({ f, openFaq, setOpenFaq, last }) {
  return (
    <div style={{ borderBottom: last ? 'none' : '1px solid #f5f5f5' }}>
      <div className="faq-q" style={{ borderRadius: 0 }} onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}>
        <span>{f.question}</span>
        <span style={{ color: '#E8000D', fontSize: 22, fontWeight: 300, flexShrink: 0 }}>{openFaq === f.id ? '−' : '+'}</span>
      </div>
      {openFaq === f.id && (
        <div style={{ padding: '4px 20px 16px', color: '#555', fontSize: 14, lineHeight: 1.7 }}>{f.answer}</div>
      )}
    </div>
  )
}

export default function FaqClient({ faqs = [] }) {
  const [openFaq, setOpenFaq] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tümü')

  const categories = ['Tümü', ...Array.from(new Set(faqs.map(f => f.category || 'Genel'))).sort()]
  const filtered = faqs.filter(f => {
    const matchCat = activeCategory === 'Tümü' || (f.category || 'Genel') === activeCategory
    const matchSearch = search === '' || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })
  const grouped = filtered.reduce((acc, f) => {
    const cat = f.category || 'Genel'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(f)
    return acc
  }, {})

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <input placeholder="Soru ara..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#bbb', fontSize: 15 }}>🔍</span>
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: 18 }}>×</button>}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            background: activeCategory === cat ? '#E8000D' : '#fff',
            border: `1.5px solid ${activeCategory === cat ? '#E8000D' : '#e0e0e0'}`,
            color: activeCategory === cat ? '#fff' : '#555',
            fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
            padding: '5px 14px', cursor: 'pointer', borderRadius: 20, transition: 'all 0.2s', width: 'auto'
          }}>{cat}</button>
        ))}
      </div>
      {filtered.length === 0 ? <Empty text="Aramanızla eşleşen soru bulunamadı." /> :
        activeCategory === 'Tümü' && search === '' ? (
          Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "'Montserrat'", fontSize: 13, fontWeight: 800, color: '#E8000D', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #f0f0f0' }}>{cat}</div>
              <div className="card" style={{ overflow: 'hidden' }}>
                {items.map((f, i) => <FaqItem key={f.id} f={f} openFaq={openFaq} setOpenFaq={setOpenFaq} last={i === items.length - 1} />)}
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            {filtered.map((f, i) => <FaqItem key={f.id} f={f} openFaq={openFaq} setOpenFaq={setOpenFaq} last={i === filtered.length - 1} />)}
          </div>
        )
      }
    </div>
  )
}
