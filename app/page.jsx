'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { iller } from './lib/iller'

export default function Home() {
  const [campaigns, setCampaigns] = useState([])
  const [news, setNews] = useState([])
  const [faqs, setFaqs] = useState([])
  const [centers, setCenters] = useState([])
  const [comments, setComments] = useState([])
  const [openFaq, setOpenFaq] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [view, setView] = useState('main')
  const [showFinalized, setShowFinalized] = useState(false)
  const [filterIl, setFilterIl] = useState('')
  const [filterIlce, setFilterIlce] = useState('')
  const [openCenterComments, setOpenCenterComments] = useState({})
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentForm, setCommentForm] = useState({ isim: '', soyisim: '', plaka: '', content: '', center_id: '', il: '', ilce: '', rating: 0, new_center_name: '', is_new_center: false })
  const [commentSubmitted, setCommentSubmitted] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      const cResult = await supabase.from('campaigns').select('*').order('created_at', { ascending: false })
      const nResult = await supabase.from('news').select('*').order('created_at', { ascending: false })
      const fResult = await supabase.from('faq').select('*').eq('enabled', true).order('display_order')
      const wcResult = await supabase.from('washing_centers').select('*').eq('approved', true)
      const wcomResult = await supabase.from('washing_comments').select('*').eq('approved', true)
      setCampaigns(cResult.data || [])
      setNews(nResult.data || [])
      setFaqs(fResult.data || [])
      setCenters(wcResult.data || [])
      setComments(wcomResult.data || [])
    }
    fetchAll()
  }, [])

  const now = new Date()
  const activeCampaigns = campaigns.filter(c => new Date(c.start_at) <= now && new Date(c.end_at) >= now)
  const finalizedCampaigns = campaigns.filter(c => new Date(c.end_at) < now)

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    let centerId = commentForm.center_id
    if (commentForm.is_new_center) {
      const { data: newCenter, error: centerError } = await supabase
        .from('washing_centers')
        .insert([{ name: commentForm.new_center_name, il: commentForm.il, ilce: commentForm.ilce, approved: false }])
        .select().single()
      if (centerError) return
      centerId = newCenter.id
    }
    const { error } = await supabase.from('washing_comments').insert([{
      isim: commentForm.isim, soyisim: commentForm.soyisim, plaka: commentForm.plaka,
      content: commentForm.content, center_id: centerId, rating: commentForm.rating, approved: false,
    }])
    if (!error) {
      setCommentSubmitted(true)
      setCommentForm({ isim: '', soyisim: '', plaka: '', content: '', center_id: '', il: '', ilce: '', rating: 0, new_center_name: '', is_new_center: false })
    }
  }

  const formatDate = (d) => {
    const date = new Date(d)
    return { day: date.getDate(), month: date.toLocaleString('tr-TR', { month: 'short' }).toUpperCase() }
  }

  const centerStats = (centerId) => {
    const cc = comments.filter(c => c.center_id === centerId)
    if (cc.length === 0) return null
    const avg = cc.reduce((sum, c) => sum + (c.rating || 0), 0) / cc.length
    const score = (avg * cc.length) / (cc.length + 5)
    return { avg: avg.toFixed(1), count: cc.length, score }
  }

  const rankedCenters = centers
    .map(c => ({ ...c, stats: centerStats(c.id) }))
    .filter(c => c.stats !== null)
    .sort((a, b) => b.stats.avg - a.stats.avg || b.stats.count - a.stats.count)

  const filteredCenters = rankedCenters.filter(c => {
    if (filterIl && filterIlce) return c.il === filterIl && c.ilce === filterIlce
    if (filterIl) return c.il === filterIl
    return true
  })

  const displayedCenters = (filterIl || filterIlce) ? filteredCenters : rankedCenters.slice(0, 5)

  const toggleCenterComments = (id) => setOpenCenterComments(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div style={{ background: '#f8f8f8', color: '#111', fontFamily: "'Inter', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .nav-link { color: #444; text-decoration: none; font-family: 'Inter', sans-serif; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600; padding: 8px 12px; transition: color 0.2s; display: block; }
        .nav-link:hover { color: #E8000D; }
        .btn-red { display: inline-block; background: #E8000D; color: #fff; font-family: 'Inter', sans-serif; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-weight: 700; padding: 14px 32px; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s; border-radius: 4px; }
        .btn-red:hover { background: #c00; }
        .btn-outline { display: inline-block; background: transparent; color: #E8000D; font-family: 'Inter', sans-serif; font-size: 12px; letter-spacing: 0.5px; font-weight: 600; padding: 8px 18px; border: 1.5px solid #E8000D; cursor: pointer; transition: all 0.2s; border-radius: 4px; }
        .btn-outline:hover { background: #E8000D; color: #fff; }
        .btn-ghost { background: none; color: #666; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; padding: 8px 16px; border: 1px solid #ddd; cursor: pointer; transition: all 0.2s; border-radius: 4px; }
        .btn-ghost:hover { border-color: #E8000D; color: #E8000D; }
        input, textarea, select { background: #fff; border: 1.5px solid #e0e0e0; color: #111; padding: 10px 14px; font-family: 'Inter', sans-serif; font-size: 14px; width: 100%; outline: none; border-radius: 6px; }
        input:focus, textarea:focus, select:focus { border-color: #E8000D; }
        select option { background: #fff; }
        .card { background: #fff; border-radius: 10px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); overflow: hidden; }
        .campaign-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        @media (max-width: 600px) { .campaign-grid { grid-template-columns: 1fr; } }
        .news-item { display: grid; grid-template-columns: 70px 1fr; border-bottom: 1px solid #f0f0f0; padding: 20px 0; gap: 0; }
        @media (max-width: 500px) {
          .news-item { grid-template-columns: 1fr; gap: 8px; }
          .news-date { border-right: none !important; border-bottom: 1px solid #f0f0f0; padding-right: 0 !important; padding-bottom: 8px; flex-direction: row !important; gap: 6px; align-items: baseline !important; }
          .news-content { padding-left: 0 !important; }
        }
        .mobile-menu { display: none; flex-direction: column; background: #fff; border-top: 1px solid #f0f0f0; padding: 8px 0; }
        .mobile-menu.open { display: flex; }
        .mobile-menu .nav-link { padding: 12px 24px; border-bottom: 1px solid #f5f5f5; font-size: 13px; }
        .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px; flex-direction: column; gap: 5px; }
        .hamburger span { display: block; width: 24px; height: 2px; background: #333; transition: all 0.3s; }
        @media (max-width: 768px) { .hamburger { display: flex; } .desktop-nav { display: none !important; } }
        .section-inner { max-width: 960px; margin: 0 auto; padding: 56px 20px; }
        @media (max-width: 600px) { .section-inner { padding: 40px 16px; } }
        .hero-title { font-size: 52px; letter-spacing: -1px; }
        @media (max-width: 500px) { .hero-title { font-size: 32px; } }
        .faq-q { padding: 16px 20px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: #111; display: flex; justify-content: space-between; align-items: center; background: #fff; user-select: none; gap: 12px; border-radius: 8px; }
        .faq-q:hover { background: #fafafa; }
        .filter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        @media (max-width: 500px) { .filter-grid { grid-template-columns: 1fr; } }
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        @media (max-width: 600px) { .form-grid-3 { grid-template-columns: 1fr; } }
        .section-alt { background: #fff; }
        .tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #E8000D; border: 1.5px solid #E8000D; padding: 3px 10px; border-radius: 20px; margin-bottom: 10px; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }} onClick={() => setView('main')}>
            <img src="/logo.png" alt="Mini Electric Türkiye" style={{ width: 44, height: 44, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Montserrat'", fontSize: 15, fontWeight: 900, color: '#111' }}>
              MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span>
            </span>
          </a>
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center' }}>
            {[['#kampanyalar','Kampanyalar'],['#haberler','Haberler'],['#yikama','Yıkama'],['#kulup','Kulüp']].map(([href, label]) => (
              <a key={href} href={href} className="nav-link" onClick={() => setView('main')}>{label}</a>
            ))}
            <button onClick={() => { setView(view === 'sss' ? 'main' : 'sss'); setMenuOpen(false) }}
              style={{ background: view === 'sss' ? '#E8000D' : 'none', color: view === 'sss' ? '#fff' : '#444', border: view === 'sss' ? 'none' : '1.5px solid #ddd', borderRadius: 4, fontFamily: "'Inter'", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', padding: '6px 14px', cursor: 'pointer', marginLeft: 8, transition: 'all 0.2s' }}>
              SSS
            </button>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
          {[['#kampanyalar','Kampanyalar'],['#haberler','Haberler'],['#yikama','Yıkama'],['#kulup','Kulüp']].map(([href, label]) => (
            <a key={href} href={href} className="nav-link" onClick={() => { setMenuOpen(false); setView('main') }}>{label}</a>
          ))}
          <button onClick={() => { setView(view === 'sss' ? 'main' : 'sss'); setMenuOpen(false) }}
            className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: view === 'sss' ? '#E8000D' : '#444', fontWeight: 700 }}>
            SSS
          </button>
        </div>
      </nav>

      {view === 'main' && <>

      {/* HERO */}
      <div style={{ background: '#111', color: '#fff', padding: '72px 20px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(232,0,13,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <img src="/logo.png" alt="Mini Electric Türkiye" style={{ width: 120, height: 120, objectFit: 'contain', margin: '0 auto 24px', display: 'block' }} />
        <h1 className="hero-title" style={{ fontFamily: "'Montserrat'", fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
          MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span>
        </h1>
        <p style={{ color: '#bbb', fontSize: 15, fontWeight: 400, maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.8 }}>
          Türkiye'nin dört bir yanından MINI Electric tutkunlarını bir araya getiren, deneyimleri paylaşan ve elektrikli sürüşün keyfini çıkaran Türkiye'nin en büyük Elektrikli MINI topluluğu.
        </p>
        <a href="https://www.jotform.com/form/251503841296053" target="_blank" rel="noreferrer" className="btn-red">Kulübe Katıl</a>
      </div>

      {/* AKTİF KAMPANYALAR */}
      <section id="kampanyalar">
        <div className="section-inner">
          <SectionHeader tag="Güncel" title="Güncel Kampanyalar" />
          {activeCampaigns.length === 0
            ? <Empty text="Şu an aktif kampanya bulunmuyor." />
            : <div className="campaign-grid">{activeCampaigns.map(c => <CampaignCard key={c.id} campaign={c} active />)}</div>
          }
        </div>
      </section>

      {/* GEÇMİŞ KAMPANYALAR */}
      {finalizedCampaigns.length > 0 && (
        <section className="section-alt">
          <div className="section-inner">
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
        </section>
      )}

      {/* HABERLER */}
      <section id="haberler">
        <div className="section-inner">
          <SectionHeader tag="Güncel" title="Son Haberler" />
          {news.length === 0 ? <Empty text="Henüz haber eklenmedi." /> : news.map(n => {
            const { day, month } = formatDate(n.created_at)
            return (
              <div key={n.id} className="news-item">
                <div className="news-date" style={{ fontFamily: "'Montserrat'", fontWeight: 900, fontSize: 28, color: '#E8000D', paddingRight: 20, borderRight: '2px solid #f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                  {day}
                  <span style={{ fontFamily: "'Inter'", fontSize: 10, letterSpacing: 1, color: '#999', textTransform: 'uppercase', fontWeight: 600, marginTop: 2 }}>{month}</span>
                </div>
                <div className="news-content" style={{ paddingLeft: 20 }}>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 6 }}>{n.title}</div>
                  <RenderText text={n.content} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* YIKAMA MERKEZLERİ */}
      <section id="yikama" className="section-alt">
        <div className="section-inner">
          <SectionHeader tag="Topluluk" title="Araç Yıkama Merkezleri" />
          <div className="filter-grid">
            <div>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>İle Göre Filtrele</div>
              <select value={filterIl} onChange={e => { setFilterIl(e.target.value); setFilterIlce('') }}>
                <option value="">Tüm Türkiye</option>
                {iller.map(i => <option key={i.il} value={i.il}>{i.il}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>İlçeye Göre Filtrele</div>
              <select value={filterIlce} onChange={e => setFilterIlce(e.target.value)} disabled={!filterIl}>
                <option value="">Tüm İlçeler</option>
                {(iller.find(i => i.il === filterIl)?.ilceler || []).map(ilce => (
                  <option key={ilce} value={ilce}>{ilce}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#999', marginBottom: 20 }}>
            {!filterIl
              ? 'Türkiye genelinde en yüksek puanlı 5 merkez gösteriliyor.'
              : <><span style={{ color: '#E8000D', fontWeight: 600 }}>{filterIl}{filterIlce ? ` / ${filterIlce}` : ''}</span> bölgesinde {filteredCenters.length} merkez bulundu.</>
            }
          </div>

          {displayedCenters.length === 0
            ? <Empty text="Bu bölgede henüz yorumlanmış yıkama merkezi bulunmuyor." />
            : displayedCenters.map((center, index) => {
              const centerComments = comments.filter(c => c.center_id === center.id)
              const isOpen = openCenterComments[center.id]
              return (
                <div key={center.id} className="card" style={{ marginBottom: 12 }}>
                  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, background: '#E8000D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat'", fontWeight: 900, fontSize: 14, color: '#fff', flexShrink: 0 }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Montserrat'", fontSize: 15, fontWeight: 800, color: '#111' }}>{center.name}</div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{center.il} / {center.ilce}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 12 }}>
                      <div style={{ color: '#F5A623', fontSize: 15 }}>
                        {'★'.repeat(Math.round(center.stats.avg))}{'☆'.repeat(5 - Math.round(center.stats.avg))}
                      </div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                        <span style={{ color: '#111', fontWeight: 700 }}>{center.stats.avg}</span> / 5 · {center.stats.count} yorum
                      </div>
                    </div>
                    <button onClick={() => toggleCenterComments(center.id)} className="btn-ghost" style={{ flexShrink: 0, fontSize: 11, padding: '6px 12px' }}>
                      {isOpen ? '▲ Gizle' : '▼ Yorumlar'}
                    </button>
                  </div>
                  {isOpen && (
                    <div style={{ borderTop: '1px solid #f5f5f5', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {centerComments.length === 0
                        ? <div style={{ color: '#bbb', fontSize: 13 }}>Henüz yorum yok.</div>
                        : centerComments.map(c => (
                          <div key={c.id} style={{ borderLeft: '3px solid #E8000D', paddingLeft: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                              {c.rating && <div style={{ color: '#F5A623', fontSize: 12 }}>{'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}</div>}
                              <div style={{ fontSize: 11, color: '#bbb' }}>{new Date(c.created_at).toLocaleDateString('tr-TR')}</div>
                            </div>
                            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{c.content}</div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              )
            })
          }

          <div style={{ marginTop: 20 }}>
            <button onClick={() => { setShowCommentForm(!showCommentForm); setCommentSubmitted(false) }} className="btn-outline" style={{ width: '100%', padding: '12px', fontSize: 13, textAlign: 'center' }}>
              {showCommentForm ? '▲ Formu Kapat' : '+ Yorum Ekle'}
            </button>
          </div>

          {showCommentForm && (
            <div className="card" style={{ padding: '28px 24px', marginTop: 12 }}>
              <div style={{ fontFamily: "'Montserrat'", fontSize: 16, fontWeight: 800, marginBottom: 20, color: '#111' }}>Yorum Ekle</div>
              {commentSubmitted ? (
                <div>
                  <div style={{ color: '#27AE60', fontFamily: "'Montserrat'", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>✓ Yorumunuz alındı. Admin onayından sonra yayınlanacak.</div>
                  <button onClick={() => setCommentSubmitted(false)} className="btn-outline">+ Yeni Yorum Ekle</button>
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="filter-grid">
                    <div>
                      <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>İl</div>
                      <select required value={commentForm.il} onChange={e => setCommentForm({ ...commentForm, il: e.target.value, ilce: '', center_id: '', is_new_center: false })}>
                        <option value="">İl seçin...</option>
                        {iller.map(i => <option key={i.il} value={i.il}>{i.il}</option>)}
                      </select>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>İlçe</div>
                      <select required value={commentForm.ilce} onChange={e => setCommentForm({ ...commentForm, ilce: e.target.value, center_id: '', is_new_center: false })} disabled={!commentForm.il}>
                        <option value="">İlçe seçin...</option>
                        {(iller.find(i => i.il === commentForm.il)?.ilceler || []).map(ilce => (
                          <option key={ilce} value={ilce}>{ilce}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Yıkama Merkezi</div>
                    <select required={!commentForm.is_new_center} value={commentForm.is_new_center ? 'NEW' : commentForm.center_id}
                      onChange={e => {
                        if (e.target.value === 'NEW') setCommentForm({ ...commentForm, is_new_center: true, center_id: '', new_center_name: '' })
                        else setCommentForm({ ...commentForm, is_new_center: false, center_id: e.target.value, new_center_name: '' })
                      }} disabled={!commentForm.ilce}>
                      <option value="">Merkez seçin...</option>
                      {centers.filter(c => c.il === commentForm.il && c.ilce === commentForm.ilce).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                      <option value="NEW">+ Yeni Yıkama Merkezi Ekle</option>
                    </select>
                    {commentForm.is_new_center && (
                      <input required placeholder="Yıkama merkezi adını girin..." value={commentForm.new_center_name}
                        onChange={e => setCommentForm({ ...commentForm, new_center_name: e.target.value })} style={{ marginTop: 8 }} />
                    )}
                  </div>
                  <div className="form-grid-3">
                    <div>
                      <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>İsim</div>
                      <input required placeholder="İsim" value={commentForm.isim} onChange={e => setCommentForm({ ...commentForm, isim: e.target.value })} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Soyisim</div>
                      <input required placeholder="Soyisim" value={commentForm.soyisim} onChange={e => setCommentForm({ ...commentForm, soyisim: e.target.value })} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Araç Plakası</div>
                      <input required placeholder="34 ABC 123" value={commentForm.plaka} onChange={e => setCommentForm({ ...commentForm, plaka: e.target.value.toUpperCase() })} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Puanınız</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} type="button" onClick={() => setCommentForm({ ...commentForm, rating: n })}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, color: n <= (commentForm.rating || 0) ? '#F5A623' : '#ddd', padding: 0, lineHeight: 1, transition: 'color 0.15s' }}>★</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Yorumunuz</div>
                    <textarea placeholder="Deneyiminizi paylaşın..." rows={3} required value={commentForm.content} onChange={e => setCommentForm({ ...commentForm, content: e.target.value })} />
                  </div>
                  <button type="submit" className="btn-red" style={{ alignSelf: 'flex-start' }}>Gönder</button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {/* KULÜBE KATIL */}
      <section id="kulup" style={{ background: '#111', color: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '72px 20px', textAlign: 'center' }}>
          <div className="tag" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Fan Kulübü</div>
          <h2 style={{ fontFamily: "'Montserrat'", fontWeight: 900, fontSize: 36, marginBottom: 16, color: '#fff' }}>Kulübe Katıl</h2>
          <p style={{ color: '#bbb', fontSize: 15, marginBottom: 32, lineHeight: 1.7, maxWidth: 440, margin: '0 auto 32px' }}>Mini Electric Türkiye topluluğunun bir parçası ol.</p>
          <a href="https://www.jotform.com/form/251503841296053" target="_blank" rel="noreferrer" className="btn-red">Başvuru Formunu Doldur</a>
        </div>
      </section>

      <footer style={{ background: '#0a0a0a', borderTop: '1px solid #222' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 20px', textAlign: 'center', color: '#555', fontSize: 12, letterSpacing: 0.5 }}>
          © 2026 <span style={{ color: '#E8000D', fontFamily: "'Montserrat'", fontWeight: 700 }}>Mini Electric Türkiye</span> Fan Kulübü — Tüm hakları saklıdır.
        </div>
      </footer>

      </>}

      {/* SSS VIEW */}
      {view === 'sss' && (
        <div style={{ background: '#f8f8f8', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 20px' }}>
            <SectionHeader tag="Bilgi" title="Sık Sorulan Sorular" />
            {faqs.length === 0 ? <Empty text="Henüz SSS eklenmedi." /> : (
              <FaqSection faqs={faqs} openFaq={openFaq} setOpenFaq={setOpenFaq} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SectionHeader({ tag, title }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div className="tag">{tag}</div>
      <div style={{ fontFamily: "'Montserrat'", fontSize: 30, fontWeight: 900, color: '#111', letterSpacing: -0.5 }}>{title}</div>
    </div>
  )
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

function FaqSection({ faqs, openFaq, setOpenFaq }) {
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
            padding: '5px 14px', cursor: 'pointer', borderRadius: 20, transition: 'all 0.2s'
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

function RenderText({ text }) {
  if (!text) return null
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return (
    <div style={{ color: '#666', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {text.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line.split(urlRegex).map((part, j) =>
            urlRegex.test(part)
              ? <a key={j} href={part} target="_blank" rel="noreferrer" style={{ color: '#E8000D', textDecoration: 'underline' }}>{part}</a>
              : part
          )}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </div>
  )
}

function Empty({ text }) {
  return <div style={{ color: '#bbb', fontSize: 13, fontFamily: "'Inter'", padding: '24px 0' }}>{text}</div>
}