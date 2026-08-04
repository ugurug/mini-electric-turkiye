'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { iller } from '../lib/iller'

function Empty({ text }) {
  return <div style={{ color: '#bbb', fontSize: 13, fontFamily: "'Inter'", padding: '24px 0' }}>{text}</div>
}

export default function WashClient({ centers = [], comments = [] }) {
  const [filterIl, setFilterIl] = useState('')
  const [filterIlce, setFilterIlce] = useState('')
  const [openCenterComments, setOpenCenterComments] = useState({})
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentForm, setCommentForm] = useState({ isim: '', soyisim: '', plaka: '', content: '', center_id: '', il: '', ilce: '', rating: 0, new_center_name: '', is_new_center: false })
  const [commentSubmitted, setCommentSubmitted] = useState(false)

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
    <>
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
          ? 'Türkiye genelinde en yüksek puanlı 5 merkez gösteriliyor. Bir il seçerek o bölgedeki tüm merkezleri görebilirsin.'
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
                  {[1, 2, 3, 4, 5].map(n => (
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
    </>
  )
}
