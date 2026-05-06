'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [campaigns, setCampaigns] = useState([])
  const [news, setNews] = useState([])
  const [faqs, setFaqs] = useState([])
  const [centers, setCenters] = useState([])
  const [comments, setComments] = useState([])
  const [openFaq, setOpenFaq] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [commentForm, setCommentForm] = useState({ author_name: '', content: '', center_id: '', suggested_center_name: '' })
  const [commentSubmitted, setCommentSubmitted] = useState(false)
  const [suggestingNewCenter, setSuggestingNewCenter] = useState(false)
  const [showFinalized, setShowFinalized] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      const [c, n, f, i, wc, wcom] = await Promise.all([
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('faq').select('*').eq('enabled', true).order('display_order'),
        supabase.from('washing_centers').select('*').eq('approved', true),
        supabase.from('washing_comments').select('*').eq('approved', true),
      ])
      setCampaigns(c.data || [])
      setNews(n.data || [])
      setFaqs(f.data || [])
      setCenters(wc.data || [])
      setComments(wcom.data || [])
    }
    fetchAll()
  }, [])

  const now = new Date()
  const activeCampaigns = campaigns.filter(c => new Date(c.start_at) <= now && new Date(c.end_at) >= now)
  const finalizedCampaigns = campaigns.filter(c => new Date(c.end_at) < now)

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      author_name: commentForm.author_name,
      content: commentForm.content,
      approved: false,
    }
    if (suggestingNewCenter) {
      payload.suggested_center_name = commentForm.suggested_center_name
    } else {
      payload.center_id = commentForm.center_id
    }
    const { error } = await supabase.from('washing_comments').insert([payload])
    if (!error) {
      setCommentSubmitted(true)
      setCommentForm({ author_name: '', content: '', center_id: '', suggested_center_name: '' })
    }
  }

  const formatDate = (d) => {
    const date = new Date(d)
    return { day: date.getDate(), month: date.toLocaleString('tr-TR', { month: 'short' }) }
  }

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', fontFamily: "'Inter', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;800;900&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .nav-link { color: #aaa; text-decoration: none; font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; padding: 6px 10px; transition: color 0.2s; display: block; }
        .nav-link:hover { color: #E8000D; }

        .btn-red { display: inline-block; background: #E8000D; color: #fff; font-family: 'Inter', sans-serif; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-weight: 700; padding: 14px 32px; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s; }
        .btn-red:hover { background: #c00; }

        input, textarea, select { background: #1a1a1a; border: 1px solid #333; color: #fff; padding: 10px 14px; font-family: 'Inter', sans-serif; font-size: 13px; width: 100%; outline: none; border-radius: 0; }
        input:focus, textarea:focus, select:focus { border-color: #E8000D; }
        select option { background: #1a1a1a; }

        .campaign-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
        @media (max-width: 600px) { .campaign-grid { grid-template-columns: 1fr; } }

        .news-item { display: grid; grid-template-columns: 70px 1fr; border-bottom: 1px solid #1a1a1a; padding: 20px 0; gap: 0; }
        @media (max-width: 500px) {
          .news-item { grid-template-columns: 1fr; gap: 8px; }
          .news-date { border-right: none !important; border-bottom: 1px solid #222; padding-right: 0 !important; padding-bottom: 8px; flex-direction: row !important; gap: 6px; align-items: baseline !important; }
          .news-content { padding-left: 0 !important; }
        }

        .mobile-menu { display: none; flex-direction: column; background: #0d0d0d; border-top: 1px solid #1f1f1f; padding: 8px 0; }
        .mobile-menu.open { display: flex; }
        .mobile-menu .nav-link { padding: 12px 24px; border-bottom: 1px solid #111; font-size: 13px; }

        .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 8px; flex-direction: column; gap: 5px; }
        .hamburger span { display: block; width: 24px; height: 2px; background: #fff; transition: all 0.3s; }
        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .desktop-nav { display: none !important; }
        }

        .section-inner { max-width: 960px; margin: 0 auto; padding: 48px 20px; border-bottom: 1px solid #1f1f1f; }
        @media (max-width: 600px) { .section-inner { padding: 36px 16px; } }

        .hero-title { font-size: 42px; letter-spacing: 2px; }
        @media (max-width: 500px) { .hero-title { font-size: 28px; letter-spacing: 1px; } }

        .issue-item { background: #1A1A1A; border: 1px solid #2a2a2a; padding: 16px 20px; display: flex; gap: 12px; align-items: flex-start; }
        @media (max-width: 500px) {
          .issue-item { flex-wrap: wrap; }
          .issue-status { margin-left: 0 !important; }
        }

        .faq-q { padding: 14px 18px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: #fff; display: flex; justify-content: space-between; align-items: center; background: #1A1A1A; user-select: none; gap: 12px; }
        .faq-q:hover { background: #1f1f1f; }

        .washing-center { background: #1A1A1A; border: 1px solid #2a2a2a; margin-bottom: 16px; }
        .comment-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 600px) { .comment-form-grid { grid-template-columns: 1fr; } }

        .footer-inner { max-width: 960px; margin: 0 auto; padding: 24px 20px; text-align: center; color: #444; font-size: 12px; letter-spacing: 1px; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: '#0A0A0A', borderBottom: '2px solid #E8000D', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/logo.png" alt="Mini Electric Türkiye" style={{ width: 44, height: 44, objectFit: 'contain' }} />
            <span style={{ fontFamily: "'Montserrat'", fontSize: 16, fontWeight: 800, letterSpacing: 1, color: '#fff' }}>
              MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'flex' }}>
            {[['#kampanyalar','Kampanyalar'],['#haberler','Haberler'],['#sss','SSS'],['#yikama','Yıkama'],['#kulup','Kulüp']].map(([href, label]) => (
              <a key={href} href={href} className="nav-link">{label}</a>
            ))}
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
          {[['#kampanyalar','Kampanyalar'],['#haberler','Haberler'],['#sss','SSS'],['#yikama','Yıkama'],['#kulup','Kulüp']].map(([href, label]) => (
            <a key={href} href={href} className="nav-link" onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#111', borderBottom: '1px solid #222', padding: '52px 20px 44px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(139,0,0,0.04) 40px, rgba(139,0,0,0.04) 80px)', pointerEvents: 'none' }} />
        <img src="/logo.png" alt="Mini Electric Türkiye" style={{ width: 130, height: 130, objectFit: 'contain', margin: '0 auto 20px', display: 'block' }} />
        <h1 className="hero-title" style={{ fontFamily: "'Montserrat'", fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>
          MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span>
        </h1>
        <p style={{ color: '#aaa', fontSize: 14, marginTop: 16, fontFamily: "'Inter'", fontWeight: 400, maxWidth: 580, margin: '16px auto 0', lineHeight: 1.8 }}>
          Türkiye'nin dört bir yanından MINI Electric tutkunlarını bir araya getiren, deneyimleri paylaşan ve elektrikli sürüşün keyfini çıkaran Türkiye'nin en büyük Elektrikli MINI topluluğu.
        </p>
        <div style={{ width: 50, height: 3, background: '#E8000D', margin: '20px auto 0' }} />
      </div>

      {/* ACTIVE CAMPAIGNS */}
      <section id="kampanyalar">
        <div className="section-inner">
          <SectionHeader tag="Aktif" title="Güncel Kampanyalar" />
          {activeCampaigns.length === 0 ? <Empty text="Şu an aktif kampanya bulunmuyor." /> : (
            <div className="campaign-grid">
              {activeCampaigns.map(c => <CampaignCard key={c.id} campaign={c} active />)}
            </div>
          )}
        </div>
      </section>

      {/* FINALIZED CAMPAIGNS */}
      {finalizedCampaigns.length > 0 && (
        <section>
          <div className="section-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: showFinalized ? 24 : 0, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: "'Inter'", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#555', fontWeight: 700, border: '1px solid #333', padding: '3px 8px', flexShrink: 0 }}>Arşiv</div>
              <div style={{ fontFamily: "'Montserrat'", fontSize: 26, fontWeight: 900, letterSpacing: 1 }}>Geçmiş Kampanyalar</div>
              <div style={{ flex: 1, height: 1, background: '#222', minWidth: 20 }} />
              <button onClick={() => setShowFinalized(!showFinalized)} style={{ background: 'none', border: '1px solid #333', color: '#aaa', fontFamily: "'Inter'", fontSize: 12, fontWeight: 600, padding: '6px 14px', cursor: 'pointer', letterSpacing: 0.5, transition: 'all 0.2s', flexShrink: 0 }}>
                {showFinalized ? '▲ Gizle' : '▼ Göster'}
              </button>
            </div>
            {showFinalized && (
              <div className="campaign-grid">
                {finalizedCampaigns.map(c => <CampaignCard key={c.id} campaign={c} active={false} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* NEWS */}
      <section id="haberler">
        <div className="section-inner">
          <SectionHeader tag="Güncel" title="Haberler" />
          {news.length === 0 ? <Empty text="Henüz haber eklenmedi." /> : news.map(n => {
            const { day, month } = formatDate(n.created_at)
            return (
              <div key={n.id} className="news-item">
                <div className="news-date" style={{ fontFamily: "'Inter'", fontWeight: 800, fontSize: 26, color: '#E8000D', paddingRight: 20, borderRight: '2px solid #222', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                  {day}
                  <span style={{ fontFamily: "'Inter'", fontSize: 10, letterSpacing: 1, color: '#aaa', textTransform: 'uppercase', fontWeight: 600, marginTop: 2 }}>{month}</span>
                </div>
                <div className="news-content" style={{ paddingLeft: 20 }}>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{n.title}</div>
                  <RenderText text={n.content} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="sss">
        <div className="section-inner">
          <SectionHeader tag="Bilgi" title="Sık Sorulan Sorular" />
          {faqs.length === 0 ? <Empty text="Henüz SSS eklenmedi." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {faqs.map(f => (
                <div key={f.id} style={{ border: '1px solid #222' }}>
                  <div className="faq-q" onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}>
                    <span>{f.question}</span>
                    <span style={{ color: '#E8000D', fontSize: 22, fontWeight: 300, flexShrink: 0 }}>{openFaq === f.id ? '−' : '+'}</span>
                  </div>
                  {openFaq === f.id && (
                    <div style={{ padding: '14px 18px', color: '#aaa', fontSize: 13, borderTop: '1px solid #222', background: '#111', lineHeight: 1.7 }}>{f.answer}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WASHING */}
      <section id="yikama">
        <div className="section-inner">
          <SectionHeader tag="Topluluk" title="Araç Yıkama Merkezleri" />
          {centers.length === 0 ? <Empty text="Henüz yıkama merkezi eklenmedi." /> : centers.map(center => (
            <div key={center.id} className="washing-center">
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, background: '#E8000D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🚿</div>
                <div>
                  <div style={{ fontFamily: "'Montserrat'", fontSize: 15, fontWeight: 700, color: '#fff' }}>{center.name}</div>
                  <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{center.address}</div>
                </div>
              </div>
              <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {comments.filter(c => c.center_id === center.id).length === 0
                  ? <div style={{ color: '#555', fontSize: 13 }}>Henüz yorum yok.</div>
                  : comments.filter(c => c.center_id === center.id).map(c => (
                    <div key={c.id} style={{ borderLeft: '3px solid #8B0000', paddingLeft: 12 }}>
                      <div style={{ fontSize: 12, color: '#E8000D', fontWeight: 700, fontFamily: "'Inter'", marginBottom: 3 }}>{c.author_name}</div>
                      <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>{c.content}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {/* COMMENT FORM */}
          <div style={{ background: '#111', border: '1px solid #222', borderTop: '3px solid #E8000D', padding: '24px 20px', marginTop: 8 }}>
            <div style={{ fontFamily: "'Montserrat'", fontSize: 16, fontWeight: 800, letterSpacing: 1, marginBottom: 20, textTransform: 'uppercase' }}>Yorum Ekle / Merkez Öner</div>
            {commentSubmitted ? (
              <div style={{ color: '#27AE60', fontFamily: "'Inter'", fontSize: 14, fontWeight: 600 }}>✓ Yorumunuz alındı. Admin onayından sonra yayınlanacak.</div>
            ) : (
              <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input placeholder="Adınız" required value={commentForm.author_name} onChange={e => setCommentForm({ ...commentForm, author_name: e.target.value })} />
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#aaa' }}>
                    <input type="radio" name="centerType" style={{ width: 'auto' }} checked={!suggestingNewCenter} onChange={() => setSuggestingNewCenter(false)} />
                    Mevcut merkez seç
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#aaa' }}>
                    <input type="radio" name="centerType" style={{ width: 'auto' }} checked={suggestingNewCenter} onChange={() => setSuggestingNewCenter(true)} />
                    Yeni merkez öner
                  </label>
                </div>
                {suggestingNewCenter
                  ? <input placeholder="Yıkama merkezi adı" value={commentForm.suggested_center_name} onChange={e => setCommentForm({ ...commentForm, suggested_center_name: e.target.value })} />
                  : <select required={!suggestingNewCenter} value={commentForm.center_id} onChange={e => setCommentForm({ ...commentForm, center_id: e.target.value })}>
                      <option value="">Merkez seçin...</option>
                      {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                }
                <textarea placeholder="Yorumunuz" rows={3} required value={commentForm.content} onChange={e => setCommentForm({ ...commentForm, content: e.target.value })} />
                <button type="submit" className="btn-red" style={{ alignSelf: 'flex-start' }}>Gönder</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section id="kulup" style={{ background: '#111', borderTop: '2px solid #E8000D' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Montserrat'", fontWeight: 900, fontSize: 36, letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' }}>Kulübe Katıl</h2>
          <p style={{ color: '#aaa', fontSize: 14, marginBottom: 28, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 28px' }}>Mini Electric Türkiye topluluğunun bir parçası ol.</p>
          <a href="https://www.jotform.com/form/251503841296053" target="_blank" rel="noreferrer" className="btn-red">Başvuru Formunu Doldur</a>
        </div>
      </section>

      <footer style={{ background: '#050505', borderTop: '1px solid #1a1a1a' }}>
        <div className="footer-inner">
          © 2026 <span style={{ color: '#E8000D' }}>Mini Electric Türkiye</span> Fan Kulübü — Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  )
}

function SectionHeader({ tag, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
      <div style={{ fontFamily: "'Inter'", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#E8000D', fontWeight: 700, border: '1px solid #E8000D', padding: '3px 8px', flexShrink: 0 }}>{tag}</div>
      <div style={{ fontFamily: "'Montserrat'", fontSize: 26, fontWeight: 900, letterSpacing: 1 }}>{title}</div>
      <div style={{ flex: 1, height: 1, background: '#222', minWidth: 20 }} />
    </div>
  )
}

function CampaignCard({ campaign, active }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ background: '#1A1A1A', border: '1px solid #333', borderTop: `3px solid ${active ? '#E8000D' : '#444'}`, opacity: active ? 1 : 0.8 }}>
      {/* Kart Başlığı - tıklanabilir */}
      <div onClick={() => setOpen(!open)} style={{ padding: 20, cursor: 'pointer', userSelect: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Montserrat'", fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{campaign.title}</div>
            <div style={{ color: '#aaa', fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{campaign.description}</div>
            <div style={{ fontSize: 11, color: '#666', fontFamily: "'Inter'", letterSpacing: 0.5 }}>
              <span style={{ color: '#E8000D', fontWeight: 600 }}>Başlangıç:</span> {new Date(campaign.start_at).toLocaleDateString('tr-TR')}
              &nbsp;|&nbsp;
              <span style={{ color: '#E8000D', fontWeight: 600 }}>Bitiş:</span> {new Date(campaign.end_at).toLocaleDateString('tr-TR')}
            </div>
          </div>
          <div style={{ color: '#E8000D', fontSize: 20, fontWeight: 300, flexShrink: 0, marginTop: 2 }}>
            {open ? '−' : '+'}
          </div>
        </div>
      </div>

      {/* Detaylar - açılır kapanır */}
      {open && (
        <div style={{ borderTop: '1px solid #2a2a2a', padding: 20 }}>
          {campaign.details && (
            <div style={{ color: '#ccc', fontSize: 14, lineHeight: 1.8, marginBottom: campaign.images?.length > 0 ? 20 : 0, whiteSpace: 'pre-wrap' }}>
              {campaign.details}
            </div>
          )}
          {!campaign.details && (!campaign.images || campaign.images.length === 0) && (
            <div style={{ color: '#555', fontSize: 13 }}>Detay eklenmemiş.</div>
          )}
          {campaign.images && campaign.images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {campaign.images.map((url, i) => (
                <img key={i} src={url} alt={`Kampanya görseli ${i + 1}`} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', border: '1px solid #333', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); window.open(url, '_blank') }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Empty({ text }) {
  return <div style={{ color: '#555', fontSize: 13, fontFamily: "'Inter'", padding: '20px 0' }}>{text}</div>
}


function RenderText({ text }) {
  if (!text) return null
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return (
    <div style={{ color: '#aaa', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {text.split('\n').map((line, i) => (
        <span key={i}>
          {line.split(urlRegex).map((part, j) =>
            urlRegex.test(part)
              ? <a key={j} href={part} target="_blank" rel="noreferrer" style={{ color: '#E8000D', textDecoration: 'underline', wordBreak: 'break-all' }}>{part}</a>
              : part
          )}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      ))}
    </div>
  )
}