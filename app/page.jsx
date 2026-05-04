'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [campaigns, setCampaigns] = useState([])
  const [news, setNews] = useState([])
  const [faqs, setFaqs] = useState([])
  const [issues, setIssues] = useState([])
  const [centers, setCenters] = useState([])
  const [comments, setComments] = useState([])
  const [openFaq, setOpenFaq] = useState(null)

  // Comment form state
  const [commentForm, setCommentForm] = useState({ author_name: '', content: '', center_id: '', suggested_center_name: '' })
  const [commentSubmitted, setCommentSubmitted] = useState(false)
  const [suggestingNewCenter, setSuggestingNewCenter] = useState(false)

  useEffect(() => {
    const fetchAll = async () => {
      const now = new Date().toISOString()
      const [c, n, f, i, wc, wcom] = await Promise.all([
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('faq').select('*').eq('enabled', true).order('display_order'),
        supabase.from('known_issues').select('*').order('created_at', { ascending: false }),
        supabase.from('washing_centers').select('*').eq('approved', true),
        supabase.from('washing_comments').select('*').eq('approved', true),
      ])
      setCampaigns(c.data || [])
      setNews(n.data || [])
      setFaqs(f.data || [])
      setIssues(i.data || [])
      setCenters(wc.data || [])
      setComments(wcom.data || [])
    }
    fetchAll()
  }, [])

  const activeCampaigns = campaigns.filter(c => new Date(c.start_at) <= new Date() && new Date(c.end_at) >= new Date())
  const finalizedCampaigns = campaigns.filter(c => new Date(c.end_at) < new Date())

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

  const statusLabel = (s) => ({ open: 'Açık', in_progress: 'İnceleniyor', resolved: 'Çözüldü' }[s] || s)
  const statusColor = (s) => ({ open: '#E8000D', in_progress: '#F5A623', resolved: '#27AE60' }[s] || '#aaa')

  const formatDate = (d) => {
    const date = new Date(d)
    return { day: date.getDate(), month: date.toLocaleString('tr-TR', { month: 'short' }) }
  }

  return (
    <div style={{ background: '#0A0A0A', color: '#fff', fontFamily: "'Barlow', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .nav-link { color: #aaa; text-decoration: none; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; padding: 6px 12px; border-left: 1px solid #1f1f1f; transition: color 0.2s, background 0.2s; }
        .nav-link:hover { color: #E8000D; background: #1a1a1a; }
        .btn-red { display: inline-block; background: #E8000D; color: #fff; font-family: 'Barlow Condensed', sans-serif; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; padding: 14px 36px; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s; }
        .btn-red:hover { background: #c00; }
        .btn-outline { background: transparent; color: #fff; font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; padding: 10px 20px; border: 1px solid #444; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
        .btn-outline:hover { border-color: #E8000D; color: #E8000D; }
        .faq-q { padding: 14px 18px; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 600; color: #fff; display: flex; justify-content: space-between; align-items: center; background: #1A1A1A; user-select: none; }
        .faq-q:hover { background: #1f1f1f; }
        input, textarea, select { background: #1a1a1a; border: 1px solid #333; color: #fff; padding: 10px 14px; font-family: 'Barlow', sans-serif; font-size: 14px; width: 100%; outline: none; }
        input:focus, textarea:focus, select:focus { border-color: #E8000D; }
        select option { background: #1a1a1a; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: '#0A0A0A', borderBottom: '2px solid #E8000D', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 24px', maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44 }}>
              <img src="/logo.png" alt="Mini Electric Türkiye" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: 20, letterSpacing: 2 }}>MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span></span>
          </div>
          <div style={{ display: 'flex' }}>
            {[['#kampanyalar','Kampanyalar'],['#haberler','Haberler'],['#sss','SSS'],['#sorunlar','Sorunlar'],['#yikama','Yıkama'],['#kulup','Kulüp']].map(([href, label]) => (
              <a key={href} href={href} className="nav-link">{label}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: '#111', borderBottom: '1px solid #222', padding: '60px 24px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(139,0,0,0.04) 40px, rgba(139,0,0,0.04) 80px)', pointerEvents: 'none' }} />
        <div style={{ width: 140, height: 140, margin: '0 auto 24px' }}>
          <img src="/logo.png" alt="Mini Electric Türkiye" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 52, letterSpacing: 4, lineHeight: 1 }}>MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span></h1>
        <p style={{ color: '#aaa', fontSize: 14, marginTop: 10, letterSpacing: 1, fontFamily: "'Barlow Condensed'", textTransform: 'uppercase' }}>Türkiye'nin Mini Electric Sahiplerinin Fan Kulübü</p>
        <div style={{ width: 60, height: 3, background: '#E8000D', margin: '16px auto 0' }} />
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* ACTIVE CAMPAIGNS */}
        <section id="kampanyalar" style={{ padding: '48px 24px', borderBottom: '1px solid #1f1f1f' }}>
          <SectionHeader tag="Aktif" title="Kampanyalar" />
          {activeCampaigns.length === 0 ? <Empty text="Şu an aktif kampanya bulunmuyor." /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {activeCampaigns.map(c => <CampaignCard key={c.id} campaign={c} active />)}
            </div>
          )}
        </section>

        {/* FINALIZED CAMPAIGNS */}
        {finalizedCampaigns.length > 0 && (
          <section style={{ padding: '48px 24px', borderBottom: '1px solid #1f1f1f' }}>
            <SectionHeader tag="Tamamlandı" title="Geçmiş Kampanyalar" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {finalizedCampaigns.map(c => <CampaignCard key={c.id} campaign={c} active={false} />)}
            </div>
          </section>
        )}

        {/* NEWS */}
        <section id="haberler" style={{ padding: '48px 24px', borderBottom: '1px solid #1f1f1f' }}>
          <SectionHeader tag="Güncel" title="Haberler" />
          {news.length === 0 ? <Empty text="Henüz haber eklenmedi." /> : news.map(n => {
            const { day, month } = formatDate(n.created_at)
            return (
              <div key={n.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', borderBottom: '1px solid #1a1a1a', padding: '20px 0' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: '#E8000D', paddingRight: 20, borderRight: '2px solid #222', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
                  {day}
                  <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, letterSpacing: 2, color: '#aaa', textTransform: 'uppercase', fontWeight: 600 }}>{month}</span>
                </div>
                <div style={{ paddingLeft: 20 }}>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{n.title}</div>
                  <div style={{ color: '#aaa', fontSize: 13, lineHeight: 1.5 }}>{n.content}</div>
                </div>
              </div>
            )
          })}
        </section>

        {/* FAQ */}
        <section id="sss" style={{ padding: '48px 24px', borderBottom: '1px solid #1f1f1f' }}>
          <SectionHeader tag="Bilgi" title="Sık Sorulan Sorular" />
          {faqs.length === 0 ? <Empty text="Henüz SSS eklenmedi." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {faqs.map(f => (
                <div key={f.id} style={{ border: '1px solid #222' }}>
                  <div className="faq-q" onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}>
                    {f.question}
                    <span style={{ color: '#E8000D', fontSize: 20, fontWeight: 300 }}>{openFaq === f.id ? '−' : '+'}</span>
                  </div>
                  {openFaq === f.id && <div style={{ padding: '14px 18px', color: '#aaa', fontSize: 13, borderTop: '1px solid #222', background: '#111', lineHeight: 1.6 }}>{f.answer}</div>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* KNOWN ISSUES */}
        <section id="sorunlar" style={{ padding: '48px 24px', borderBottom: '1px solid #1f1f1f' }}>
          <SectionHeader tag="Takip" title="Bilinen Sorunlar" />
          {issues.length === 0 ? <Empty text="Bilinen sorun bulunmuyor." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {issues.map(i => (
                <div key={i.id} style={{ background: '#1A1A1A', border: '1px solid #2a2a2a', padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor(i.status), marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{i.title}</div>
                    <div style={{ color: '#aaa', fontSize: 13 }}>{i.description}</div>
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 8px', fontWeight: 600, flexShrink: 0, color: statusColor(i.status), border: `1px solid ${statusColor(i.status)}` }}>{statusLabel(i.status)}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* WASHING CENTERS */}
        <section id="yikama" style={{ padding: '48px 24px', borderBottom: '1px solid #1f1f1f' }}>
          <SectionHeader tag="Topluluk" title="Araç Yıkama Merkezleri" />
          {centers.length === 0 ? <Empty text="Henüz yıkama merkezi eklenmedi." /> : centers.map(center => (
            <div key={center.id} style={{ background: '#1A1A1A', border: '1px solid #2a2a2a', marginBottom: 16 }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: '#E8000D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🚿</div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 16, fontWeight: 700, color: '#fff' }}>{center.name}</div>
                  <div style={{ fontSize: 12, color: '#aaa' }}>{center.address}</div>
                </div>
              </div>
              <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {comments.filter(c => c.center_id === center.id).length === 0
                  ? <div style={{ color: '#555', fontSize: 13 }}>Henüz yorum yok.</div>
                  : comments.filter(c => c.center_id === center.id).map(c => (
                    <div key={c.id} style={{ borderLeft: '3px solid #8B0000', paddingLeft: 12 }}>
                      <div style={{ fontSize: 12, color: '#E8000D', fontWeight: 600, fontFamily: "'Barlow Condensed'", marginBottom: 2 }}>{c.author_name}</div>
                      <div style={{ fontSize: 13, color: '#aaa' }}>{c.content}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {/* COMMENT FORM */}
          <div style={{ background: '#111', border: '1px solid #222', padding: 24, marginTop: 8 }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 2, marginBottom: 16 }}>Yorum Ekle / Merkez Öner</div>
            {commentSubmitted ? (
              <div style={{ color: '#27AE60', fontFamily: "'Barlow Condensed'", fontSize: 15, letterSpacing: 1 }}>✓ Yorumunuz alındı. Admin onayından sonra yayınlanacak.</div>
            ) : (
              <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input placeholder="Adınız" required value={commentForm.author_name} onChange={e => setCommentForm({ ...commentForm, author_name: e.target.value })} />
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#aaa' }}>
                    <input type="radio" name="centerType" style={{ width: 'auto' }} checked={!suggestingNewCenter} onChange={() => setSuggestingNewCenter(false)} />
                    Mevcut merkez seç
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#aaa' }}>
                    <input type="radio" name="centerType" style={{ width: 'auto' }} checked={suggestingNewCenter} onChange={() => setSuggestingNewCenter(true)} />
                    Yeni merkez öner
                  </label>
                </div>
                {suggestingNewCenter ? (
                  <input placeholder="Yıkama merkezi adı" value={commentForm.suggested_center_name} onChange={e => setCommentForm({ ...commentForm, suggested_center_name: e.target.value })} />
                ) : (
                  <select required value={commentForm.center_id} onChange={e => setCommentForm({ ...commentForm, center_id: e.target.value })}>
                    <option value="">Merkez seçin...</option>
                    {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
                <textarea placeholder="Yorumunuz" rows={3} required value={commentForm.content} onChange={e => setCommentForm({ ...commentForm, content: e.target.value })} />
                <button type="submit" className="btn-red" style={{ alignSelf: 'flex-start' }}>Gönder</button>
              </form>
            )}
          </div>
        </section>

        {/* JOIN CTA */}
        <section id="kulup" style={{ padding: '64px 24px', textAlign: 'center', background: '#111', borderTop: '2px solid #E8000D' }}>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 40, letterSpacing: 3, marginBottom: 10 }}>KULÜBE KATIL</h2>
          <p style={{ color: '#aaa', fontSize: 14, marginBottom: 28 }}>Mini Electric Türkiye topluluğunun bir parçası ol.</p>
          <a href="https://www.jotform.com/form/251503841296053" target="_blank" rel="noreferrer" className="btn-red">Başvuru Formunu Doldur</a>
        </section>
      </div>

      <footer style={{ background: '#050505', borderTop: '1px solid #1a1a1a', padding: 24, textAlign: 'center', color: '#444', fontSize: 12, fontFamily: "'Barlow Condensed'", letterSpacing: 1 }}>
        © 2026 <span style={{ color: '#E8000D' }}>Mini Electric Türkiye</span> Fan Kulübü — Tüm hakları saklıdır.
      </footer>
    </div>
  )
}

function SectionHeader({ tag, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#E8000D', fontWeight: 600, border: '1px solid #E8000D', padding: '3px 8px' }}>{tag}</div>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 2 }}>{title}</div>
      <div style={{ flex: 1, height: 1, background: '#222' }} />
    </div>
  )
}

function CampaignCard({ campaign, active }) {
  return (
    <div style={{ background: '#1A1A1A', border: '1px solid #333', borderTop: `3px solid ${active ? '#E8000D' : '#444'}`, padding: 20, opacity: active ? 1 : 0.7 }}>
      <span style={{ display: 'inline-block', fontFamily: "'Barlow Condensed'", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600, padding: '3px 8px', marginBottom: 10, background: active ? '#E8000D' : '#333', color: active ? '#fff' : '#aaa' }}>{active ? 'Aktif' : 'Tamamlandı'}</span>
      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{campaign.title}</div>
      <div style={{ color: '#aaa', fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>{campaign.description}</div>
      <div style={{ fontSize: 11, color: '#666', fontFamily: "'Barlow Condensed'", letterSpacing: 1 }}>
        <span style={{ color: '#E8000D' }}>Başlangıç:</span> {new Date(campaign.start_at).toLocaleDateString('tr-TR')} &nbsp;|&nbsp; <span style={{ color: '#E8000D' }}>Bitiş:</span> {new Date(campaign.end_at).toLocaleDateString('tr-TR')}
      </div>
    </div>
  )
}

function Empty({ text }) {
  return <div style={{ color: '#555', fontSize: 14, fontFamily: "'Barlow Condensed'", letterSpacing: 1, padding: '20px 0' }}>{text}</div>
}