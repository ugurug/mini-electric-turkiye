'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { iller } from '../../lib/iller'


const TABS = ['Kampanyalar', 'Haberler', 'SSS', 'Yıkama Merkezleri', 'Yıkama Yorumları', 'Kullanıcılar']

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/admin/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (!profile) { router.push('/admin/login'); return }
      setUser(user)
      setRole(profile.role)
      setLoading(false)
    }
    init()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontFamily: 'Barlow Condensed', letterSpacing: 2 }}>
      YÜKLENİYOR...
    </div>
  )

  const visibleTabs = role === 'super_admin' ? TABS : TABS.slice(0, 6)

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', fontFamily: "'Barlow', sans-serif", color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600&family=Barlow+Condensed:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, textarea, select { background: #1a1a1a; border: 1px solid #333; color: #fff; padding: 10px 14px; font-family: 'Barlow', sans-serif; font-size: 14px; width: 100%; outline: none; border-radius: 0; }
        input:focus, textarea:focus, select:focus { border-color: #E8000D; }
        select option { background: #1a1a1a; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1a1a1a; color: #aaa; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; padding: 10px 14px; text-align: left; border-bottom: 1px solid #333; }
        td { padding: 12px 14px; border-bottom: 1px solid #1a1a1a; font-size: 13px; color: #ccc; vertical-align: top; }
        tr:hover td { background: #111; }
        .btn-red { background: #E8000D; color: #fff; border: none; padding: 8px 16px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 700; cursor: pointer; }
        .btn-red:hover { background: #c00; }
        .btn-gray { background: #222; color: #aaa; border: 1px solid #333; padding: 8px 16px; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; cursor: pointer; }
        .btn-gray:hover { border-color: #555; color: #fff; }
        .btn-green { background: #27AE60; color: #fff; border: none; padding: 6px 12px; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; font-weight: 700; cursor: pointer; }
        .btn-danger { background: transparent; color: #E8000D; border: 1px solid #E8000D; padding: 6px 12px; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; cursor: pointer; }
        .btn-danger:hover { background: #E8000D; color: #fff; }
        .form-label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 2px; color: #aaa; text-transform: uppercase; margin-bottom: 6px; display: block; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .badge { display: inline-block; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 8px; font-weight: 600; }
      `}</style>

      {/* TOP BAR */}
      <div style={{ background: '#0A0A0A', borderBottom: '2px solid #E8000D', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36 }}>
              <img src="/logo.png" alt="Mini Electric Türkiye" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span style={{ fontFamily: "'Montserrat'", fontSize: 16, fontWeight: 800, letterSpacing: 1, color: '#fff' }}> MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span></span>
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: 11, letterSpacing: 2, color: '#555', textTransform: 'uppercase', borderLeft: '1px solid #222', paddingLeft: 12 }}>Admin Paneli</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: '#555', fontFamily: "'Barlow Condensed'", letterSpacing: 1 }}>
              {user?.email} &nbsp;
              <span style={{ color: role === 'super_admin' ? '#E8000D' : '#aaa', border: `1px solid ${role === 'super_admin' ? '#E8000D' : '#444'}`, padding: '2px 6px', fontSize: 10, letterSpacing: 1.5 }}>
                {role === 'super_admin' ? 'SÜPER ADMİN' : 'ADMİN'}
              </span>
            </span>
            <a href="/" style={{ color: '#555', fontSize: 12, fontFamily: "'Barlow Condensed'", letterSpacing: 1, textDecoration: 'none' }}>← Site</a>
            <button onClick={handleLogout} className="btn-gray">Çıkış</button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: '#111', borderBottom: '1px solid #222' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', overflowX: 'auto' }}>
          {visibleTabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{ background: 'none', border: 'none', borderBottom: activeTab === i ? '2px solid #E8000D' : '2px solid transparent', color: activeTab === i ? '#fff' : '#555', fontFamily: "'Barlow Condensed'", fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, padding: '14px 20px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {activeTab === 0 && <CampaignsTab />}
        {activeTab === 1 && <NewsTab />}
        {activeTab === 2 && <FaqTab />}
        {activeTab === 3 && <CentersTab />}
        {activeTab === 4 && <CommentsTab />}
        {activeTab === 5 && role === 'super_admin' && <UsersTab />}
      </div>
    </div>
  )
}

/* ─── CAMPAIGNS ─── */
function CampaignsTab() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', description: '', details: '', start_at: '', end_at: '', images: [] })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchItems() }, [])
  const fetchItems = async () => {
    const { data } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await supabase.from('campaigns').update(form).eq('id', editing)
    } else {
      await supabase.from('campaigns').insert([form])
    }
    setForm({ title: '', description: '', start_at: '', end_at: '' })
    setEditing(null); setShowForm(false); fetchItems()
  }
  const handleEdit = (item) => {
    setForm({ title: item.title, description: item.description || '', details: item.details || '', start_at: item.start_at?.slice(0, 16) || '', end_at: item.end_at?.slice(0, 16) || '', images: item.images || [] })
    setEditing(item.id); setShowForm(true)
  }
  const handleDelete = async (id) => {
    if (confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) {
      await supabase.from('campaigns').delete().eq('id', id); fetchItems()
    }
  }

  const now = new Date()
  const statusOf = (item) => {
    if (new Date(item.start_at) > now) return { label: 'Yaklaşan', color: '#F5A623' }
    if (new Date(item.end_at) < now) return { label: 'Tamamlandı', color: '#555' }
    return { label: 'Aktif', color: '#27AE60' }
  }

  return (
    <TabLayout title="Kampanyalar" onAdd={() => { setForm({ title: '', description: '', start_at: '', end_at: '' }); setEditing(null); setShowForm(!showForm) }}>
      {showForm && (
        <FormBox title={editing ? 'Kampanyayı Düzenle' : 'Yeni Kampanya'}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Başlık</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Açıklama (Kart özeti)</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Detaylar (Açılır kısım)</label>
              <textarea rows={5} value={form.details || ''} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="Kampanya detayları, koşullar, açıklamalar..." />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Görseller</label>
              <ImageUploader
                images={form.images || []}
                onChange={(images) => setForm({ ...form, images })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Başlangıç Tarihi</label>
              <input type="datetime-local" required value={form.start_at} onChange={e => setForm({ ...form, start_at: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Bitiş Tarihi</label>
              <input type="datetime-local" required value={form.end_at} onChange={e => setForm({ ...form, end_at: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-red">{editing ? 'Güncelle' : 'Kaydet'}</button>
              <button type="button" className="btn-gray" onClick={() => { setShowForm(false); setEditing(null) }}>İptal</button>
            </div>
          </form>
        </FormBox>
      )}
      <table>
        <thead><tr><th>Başlık</th><th>Başlangıç</th><th>Bitiş</th><th>Durum</th><th>İşlemler</th></tr></thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={5} style={{ color: '#555', textAlign: 'center' }}>Henüz kampanya yok.</td></tr>}
          {items.map(item => {
            const s = statusOf(item)
            return (
              <tr key={item.id}>
                <td style={{ color: '#fff', fontWeight: 600 }}>{item.title}</td>
                <td>{new Date(item.start_at).toLocaleDateString('tr-TR')}</td>
                <td>{new Date(item.end_at).toLocaleDateString('tr-TR')}</td>
                <td><span className="badge" style={{ color: s.color, border: `1px solid ${s.color}` }}>{s.label}</span></td>
                <td><div style={{ display: 'flex', gap: 8 }}><button className="btn-gray" onClick={() => handleEdit(item)}>Düzenle</button><button className="btn-danger" onClick={() => handleDelete(item.id)}>Sil</button></div></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </TabLayout>
  )
}

/* ─── NEWS ─── */
function NewsTab() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', content: '' })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchItems() }, [])
  const fetchItems = async () => {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await supabase.from('news').update(form).eq('id', editing) }
    else { await supabase.from('news').insert([form]) }
    setForm({ title: '', content: '' }); setEditing(null); setShowForm(false); fetchItems()
  }
  const handleEdit = (item) => { setForm({ title: item.title, content: item.content || '' }); setEditing(item.id); setShowForm(true) }
  const handleDelete = async (id) => { if (confirm('Bu haberi silmek istiyor musunuz?')) { await supabase.from('news').delete().eq('id', id); fetchItems() } }

  return (
    <TabLayout title="Haberler" onAdd={() => { setForm({ title: '', content: '' }); setEditing(null); setShowForm(!showForm) }}>
      {showForm && (
        <FormBox title={editing ? 'Haberi Düzenle' : 'Yeni Haber'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group"><label className="form-label">Başlık</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">İçerik</label><textarea rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: 8 }}><button type="submit" className="btn-red">{editing ? 'Güncelle' : 'Kaydet'}</button><button type="button" className="btn-gray" onClick={() => { setShowForm(false); setEditing(null) }}>İptal</button></div>
          </form>
        </FormBox>
      )}
      <table>
        <thead><tr><th>Başlık</th><th>İçerik</th><th>Tarih</th><th>İşlemler</th></tr></thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={4} style={{ color: '#555', textAlign: 'center' }}>Henüz haber yok.</td></tr>}
          {items.map(item => (
            <tr key={item.id}>
              <td style={{ color: '#fff', fontWeight: 600 }}>{item.title}</td>
              <td style={{ maxWidth: 300 }}>{item.content?.slice(0, 80)}{item.content?.length > 80 ? '...' : ''}</td>
              <td>{new Date(item.created_at).toLocaleDateString('tr-TR')}</td>
              <td><div style={{ display: 'flex', gap: 8 }}><button className="btn-gray" onClick={() => handleEdit(item)}>Düzenle</button><button className="btn-danger" onClick={() => handleDelete(item.id)}>Sil</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </TabLayout>
  )
}

/* ─── FAQ ─── */
function FaqTab() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ question: '', answer: '', enabled: true, display_order: 0 })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchItems() }, [])
  const fetchItems = async () => {
    const { data } = await supabase.from('faq').select('*').order('display_order')
    setItems(data || [])
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await supabase.from('faq').update(form).eq('id', editing) }
    else { await supabase.from('faq').insert([form]) }
    setForm({ question: '', answer: '', enabled: true, display_order: 0 }); setEditing(null); setShowForm(false); fetchItems()
  }
  const handleEdit = (item) => { setForm({ question: item.question, answer: item.answer, enabled: item.enabled, display_order: item.display_order }); setEditing(item.id); setShowForm(true) }
  const handleDelete = async (id) => { if (confirm('Bu SSS\'yi silmek istiyor musunuz?')) { await supabase.from('faq').delete().eq('id', id); fetchItems() } }
  const toggleEnabled = async (item) => { await supabase.from('faq').update({ enabled: !item.enabled }).eq('id', item.id); fetchItems() }

  return (
    <TabLayout title="Sık Sorulan Sorular" onAdd={() => { setForm({ question: '', answer: '', enabled: true, display_order: 0 }); setEditing(null); setShowForm(!showForm) }}>
      {showForm && (
        <FormBox title={editing ? 'SSS Düzenle' : 'Yeni SSS'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group"><label className="form-label">Soru</label><input required value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Cevap</label><textarea rows={4} value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group"><label className="form-label">Sıra</label><input type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) })} /></div>
              <div className="form-group"><label className="form-label">Durum</label>
                <select value={form.enabled ? 'true' : 'false'} onChange={e => setForm({ ...form, enabled: e.target.value === 'true' })}>
                  <option value="true">Aktif</option><option value="false">Pasif</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}><button type="submit" className="btn-red">{editing ? 'Güncelle' : 'Kaydet'}</button><button type="button" className="btn-gray" onClick={() => { setShowForm(false); setEditing(null) }}>İptal</button></div>
          </form>
        </FormBox>
      )}
      <table>
        <thead><tr><th>Soru</th><th>Cevap</th><th>Sıra</th><th>Durum</th><th>İşlemler</th></tr></thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={5} style={{ color: '#555', textAlign: 'center' }}>Henüz SSS yok.</td></tr>}
          {items.map(item => (
            <tr key={item.id}>
              <td style={{ color: '#fff', fontWeight: 600 }}>{item.question}</td>
              <td style={{ maxWidth: 260 }}>{item.answer?.slice(0, 60)}...</td>
              <td>{item.display_order}</td>
              <td><button onClick={() => toggleEnabled(item)} className="badge" style={{ color: item.enabled ? '#27AE60' : '#555', border: `1px solid ${item.enabled ? '#27AE60' : '#555'}`, background: 'none', cursor: 'pointer' }}>{item.enabled ? 'Aktif' : 'Pasif'}</button></td>
              <td><div style={{ display: 'flex', gap: 8 }}><button className="btn-gray" onClick={() => handleEdit(item)}>Düzenle</button><button className="btn-danger" onClick={() => handleDelete(item.id)}>Sil</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </TabLayout>
  )
}

/* ─── WASHING CENTERS ─── */
function CentersTab() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', il: '', ilce: '' })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedIl, setSelectedIl] = useState('')

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    const { data } = await supabase.from('washing_centers').select('*').order('il').order('ilce').order('name')
    setItems(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await supabase.from('washing_centers').update(form).eq('id', editing)
    } else {
      await supabase.from('washing_centers').insert([{ ...form, approved: true }])
    }
    setForm({ name: '', il: '', ilce: '' }); setEditing(null); setShowForm(false); setSelectedIl(''); fetchItems()
  }

  const handleEdit = (item) => {
    setForm({ name: item.name, il: item.il || '', ilce: item.ilce || '' })
    setSelectedIl(item.il || '')
    setEditing(item.id); setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Bu merkezi silmek istiyor musunuz?')) {
      await supabase.from('washing_centers').delete().eq('id', id); fetchItems()
    }
  }

  const ilceler = iller.find(i => i.il === (editing ? form.il : selectedIl))?.ilceler || []

  // İllere göre grupla
  const grouped = items.reduce((acc, item) => {
    const key = `${item.il || 'Belirtilmemiş'} / ${item.ilce || 'Belirtilmemiş'}`
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <TabLayout title="Yıkama Merkezleri" onAdd={() => { setForm({ name: '', il: '', ilce: '' }); setEditing(null); setSelectedIl(''); setShowForm(!showForm) }}>
      {showForm && (
        <FormBox title={editing ? 'Merkezi Düzenle' : 'Yeni Merkez Ekle'}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">İl</label>
              <select required value={form.il} onChange={e => { setForm({ ...form, il: e.target.value, ilce: '' }); setSelectedIl(e.target.value) }}>
                <option value="">İl seçin...</option>
                {iller.map(i => <option key={i.il} value={i.il}>{i.il}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">İlçe</label>
              <select required value={form.ilce} onChange={e => setForm({ ...form, ilce: e.target.value })} disabled={!form.il}>
                <option value="">İlçe seçin...</option>
                {ilceler.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Merkez Adı</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Yıkama merkezi adı" />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-red">{editing ? 'Güncelle' : 'Kaydet'}</button>
              <button type="button" className="btn-gray" onClick={() => { setShowForm(false); setEditing(null) }}>İptal</button>
            </div>
          </form>
        </FormBox>
      )}

      {Object.keys(grouped).length === 0 && <Empty text="Henüz yıkama merkezi yok." />}
      {Object.entries(grouped).map(([group, centers]) => (
        <div key={group} style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'Montserrat'", fontSize: 12, fontWeight: 700, color: '#E8000D', letterSpacing: 1, textTransform: 'uppercase', borderBottom: '1px solid #222', paddingBottom: 8, marginBottom: 12 }}>{group}</div>
          <table>
            <thead><tr><th>Merkez Adı</th><th>İşlemler</th></tr></thead>
            <tbody>
              {centers.map(item => (
                <tr key={item.id}>
                  <td style={{ color: '#fff', fontWeight: 600 }}>{item.name}</td>
                  <td><div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-gray" onClick={() => handleEdit(item)}>Düzenle</button>
                    <button className="btn-danger" onClick={() => handleDelete(item.id)}>Sil</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </TabLayout>
  )
}

/* ─── WASHING COMMENTS ─── */
function CommentsTab() {
  const [pending, setPending] = useState([])
  const [approved, setApproved] = useState([])
  const [centers, setCenters] = useState([])
  const [editingComment, setEditingComment] = useState(null)
  const [editForm, setEditForm] = useState({ isim: '', soyisim: '', plaka: '', content: '', rating: 5 })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    const [c, wc] = await Promise.all([
      supabase.from('washing_comments').select('*').order('created_at', { ascending: false }),
      supabase.from('washing_centers').select('id, name, il, ilce')
    ])
    setPending((c.data || []).filter(x => !x.approved))
    setApproved((c.data || []).filter(x => x.approved))
    setCenters(wc.data || [])
  }

  const centerLabel = (id) => {
    const c = centers.find(c => c.id === id)
    return c ? `${c.il} / ${c.ilce} — ${c.name}` : '—'
  }

  const toggleApprove = async (item) => {
    await supabase.from('washing_comments').update({ approved: !item.approved }).eq('id', item.id)
    fetchAll()
  }

  const handleDelete = async (id) => {
    if (confirm('Bu yorumu silmek istiyor musunuz?')) {
      await supabase.from('washing_comments').delete().eq('id', id); fetchAll()
    }
  }

  const handleEdit = (item) => {
    setEditingComment(item)
    setEditForm({ isim: item.isim || '', soyisim: item.soyisim || '', plaka: item.plaka || '', content: item.content || '', rating: item.rating || 5 })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    await supabase.from('washing_comments').update(editForm).eq('id', editingComment.id)
    setEditingComment(null); fetchAll()
  }

  const Stars = ({ rating }) => (
    <span style={{ color: '#F5A623', fontSize: 14 }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )

  const CommentRow = ({ item, isPending }) => (
    <tr>
      <td style={{ color: '#fff' }}>{item.isim} {item.soyisim}</td>
      <td style={{ color: '#aaa', fontSize: 12 }}>{item.plaka}</td>
      <td style={{ fontSize: 12 }}>{centerLabel(item.center_id)}</td>
      <td><Stars rating={item.rating || 0} /></td>
      <td style={{ maxWidth: 200, color: '#aaa', fontSize: 13 }}>{item.content}</td>
      <td style={{ fontSize: 11, color: '#666' }}>{new Date(item.created_at).toLocaleDateString('tr-TR')}</td>
      <td>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button className="btn-gray" onClick={() => handleEdit(item)}>Düzenle</button>
          <button onClick={() => toggleApprove(item)} style={{ background: 'none', border: `1px solid ${isPending ? '#27AE60' : '#F5A623'}`, color: isPending ? '#27AE60' : '#F5A623', padding: '6px 10px', fontFamily: "'Inter'", fontSize: 11, fontWeight: 600, cursor: 'pointer', letterSpacing: 0.5 }}>
            {isPending ? '✓ Onayla' : '↩ Beklet'}
          </button>
          <button className="btn-danger" onClick={() => handleDelete(item.id)}>Sil</button>
        </div>
      </td>
    </tr>
  )

  const tableHead = (
    <thead><tr><th>İsim Soyisim</th><th>Plaka</th><th>Merkez</th><th>Puan</th><th>Yorum</th><th>Tarih</th><th>İşlemler</th></tr></thead>
  )

  return (
    <TabLayout title="Yıkama Yorumları" showAdd={false}>
      {editingComment && (
        <FormBox title={`Yorumu Düzenle`}>
          <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group"><label className="form-label">İsim</label><input value={editForm.isim} onChange={e => setEditForm({ ...editForm, isim: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Soyisim</label><input value={editForm.soyisim} onChange={e => setEditForm({ ...editForm, soyisim: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Plaka</label><input value={editForm.plaka} onChange={e => setEditForm({ ...editForm, plaka: e.target.value })} /></div>
            <div className="form-group">
              <label className="form-label">Puan</label>
              <select value={editForm.rating} onChange={e => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Yıldız</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '2 / -1' }}><label className="form-label">Yorum</label><textarea rows={2} value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} /></div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-red">Güncelle</button>
              <button type="button" className="btn-gray" onClick={() => setEditingComment(null)}>İptal</button>
            </div>
          </form>
        </FormBox>
      )}

      {/* ONAY BEKLEYENLER */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'Montserrat'", fontSize: 16, fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          Onay Bekleyenler
          <span style={{ background: '#E8000D', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 0 }}>{pending.length}</span>
        </div>
        <table>
          {tableHead}
          <tbody>
            {pending.length === 0 && <tr><td colSpan={7} style={{ color: '#555', textAlign: 'center' }}>Onay bekleyen yorum yok.</td></tr>}
            {pending.map(item => <CommentRow key={item.id} item={item} isPending={true} />)}
          </tbody>
        </table>
      </div>

      {/* ONAYLANMIŞ YORUMLAR */}
      <div>
        <div style={{ fontFamily: "'Montserrat'", fontSize: 16, fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          Yayınlananlar
          <span style={{ background: '#27AE60', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px' }}>{approved.length}</span>
        </div>
        <table>
          {tableHead}
          <tbody>
            {approved.length === 0 && <tr><td colSpan={7} style={{ color: '#555', textAlign: 'center' }}>Yayınlanan yorum yok.</td></tr>}
            {approved.map(item => <CommentRow key={item.id} item={item} isPending={false} />)}
          </tbody>
        </table>
      </div>
    </TabLayout>
  )
}

/* ─── USERS (Super Admin only) ─── */
function UsersTab() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ email: '', password: '', role: 'admin' })
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({ password: '', role: 'admin' })
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [currentUserEmail, setCurrentUserEmail] = useState('')

  const PROTECTED_EMAIL = 'ugurug@gmail.com'

  useEffect(() => {
    fetchUsers()
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUserEmail(user?.email || '')
  }

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at')
    setUsers(data || [])
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password })
    if (error) { setMessage('Hata: ' + error.message); return }
    await supabase.from('profiles').insert([{ id: data.user.id, role: form.role, email: form.email }])
    setMessage('Admin başarıyla oluşturuldu.')
    setForm({ email: '', password: '', role: 'admin' })
    setShowForm(false)
    fetchUsers()
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setEditForm({ password: '', role: user.role })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (editingUser.email === PROTECTED_EMAIL && currentUserEmail !== PROTECTED_EMAIL) {
      setMessage('Bu kullanıcının bilgileri değiştirilemez.')
      return
    }
    const updates = { role: editForm.role }
    const { error: profileError } = await supabase.from('profiles').update(updates).eq('id', editingUser.id)
    if (profileError) { setMessage('Hata: ' + profileError.message); return }

    if (editForm.password) {
      const { error: passError } = await supabase.functions.invoke('update-user-password', {
        body: { userId: editingUser.id, password: editForm.password }
      })
      if (passError) {
        setMessage('Profil güncellendi fakat şifre değiştirilemedi. Supabase Edge Function gerekli.')
        setEditingUser(null)
        fetchUsers()
        return
      }
    }

    setMessage('Kullanıcı güncellendi.')
    setEditingUser(null)
    fetchUsers()
  }

  const handleDelete = async (user) => {
    if (user.email === PROTECTED_EMAIL) {
      setMessage('Bu kullanıcı silinemez.')
      return
    }
    if (!confirm(`${user.email} adlı kullanıcıyı silmek istediğinize emin misiniz?`)) return
    await supabase.from('profiles').delete().eq('id', user.id)
    setMessage('Kullanıcı silindi.')
    fetchUsers()
  }

  const isProtected = (user) => user.email === PROTECTED_EMAIL && currentUserEmail !== PROTECTED_EMAIL

  return (
    <TabLayout title="Kullanıcı Yönetimi" onAdd={() => setShowForm(!showForm)}>
      {message && (
        <div style={{ background: '#111', border: '1px solid #27AE60', color: '#27AE60', padding: '10px 16px', marginBottom: 16, fontFamily: "'Inter'", fontSize: 13 }}>
          {message}
          <button onClick={() => setMessage('')} style={{ float: 'right', background: 'none', border: 'none', color: '#27AE60', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
      )}

      {/* YENİ KULLANICI FORMU */}
      {showForm && (
        <FormBox title="Yeni Admin Oluştur">
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group"><label className="form-label">E-posta</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Şifre</label><input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
            <div className="form-group">
              <label className="form-label">Rol</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="super_admin">Süper Admin</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-red">Oluştur</button>
              <button type="button" className="btn-gray" onClick={() => setShowForm(false)}>İptal</button>
            </div>
          </form>
        </FormBox>
      )}

      {/* DÜZENLEME FORMU */}
      {editingUser && (
        <FormBox title={`Düzenle: ${editingUser.email}`}>
          <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Yeni Şifre <span style={{ color: '#555', fontWeight: 400 }}>(boş bırakılırsa değişmez)</span></label>
              <input type="password" placeholder="Yeni şifre..." value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} disabled={isProtected(editingUser)} style={{ opacity: isProtected(editingUser) ? 0.4 : 1 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Rol</label>
              <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} disabled={isProtected(editingUser)} style={{ opacity: isProtected(editingUser) ? 0.4 : 1 }}>
                <option value="admin">Admin</option>
                <option value="super_admin">Süper Admin</option>
              </select>
            </div>
            {isProtected(editingUser) && (
              <div style={{ gridColumn: '1 / -1', color: '#E8000D', fontSize: 12, fontFamily: "'Inter'" }}>⚠ Bu kullanıcının bilgileri yalnızca kendisi tarafından değiştirilebilir.</div>
            )}
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
              {!isProtected(editingUser) && <button type="submit" className="btn-red">Güncelle</button>}
              <button type="button" className="btn-gray" onClick={() => setEditingUser(null)}>İptal</button>
            </div>
          </form>
        </FormBox>
      )}

      {/* KULLANICI LİSTESİ */}
      <table>
        <thead>
          <tr>
            <th>E-posta</th>
            <th>Rol</th>
            <th>Oluşturulma</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr><td colSpan={4} style={{ color: '#555', textAlign: 'center' }}>Henüz kullanıcı yok.</td></tr>
          )}
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ color: '#fff' }}>
                {u.email || <span style={{ color: '#555' }}>—</span>}
                {u.email === PROTECTED_EMAIL && <span style={{ marginLeft: 8, fontSize: 10, color: '#E8000D', border: '1px solid #E8000D', padding: '2px 6px', fontFamily: "'Inter'", fontWeight: 600 }}>KORUNAN</span>}
              </td>
              <td>
                <span className="badge" style={{ color: u.role === 'super_admin' ? '#E8000D' : '#aaa', border: `1px solid ${u.role === 'super_admin' ? '#E8000D' : '#444'}` }}>
                  {u.role === 'super_admin' ? 'Süper Admin' : 'Admin'}
                </span>
              </td>
              <td>{new Date(u.created_at).toLocaleDateString('tr-TR')}</td>
              <td>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-gray" onClick={() => handleEdit(u)}>Düzenle</button>
                  {u.email !== PROTECTED_EMAIL && (
                    <button className="btn-danger" onClick={() => handleDelete(u)}>Sil</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TabLayout>
  )
}

/* ─── SHARED COMPONENTS ─── */
function TabLayout({ title, children, onAdd, showAdd = true }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ fontFamily: "'Montserrat'", fontSize: 28, letterSpacing: 2 }}>{title}</div>
        {showAdd && <button className="btn-red" onClick={onAdd}>+ Yeni Ekle</button>}
      </div>
      {children}
    </div>
  )
}

function FormBox({ title, children }) {
  return (
    <div style={{ background: '#111', border: '1px solid #222', borderTop: '3px solid #E8000D', padding: 24, marginBottom: 24 }}>
      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: 13, letterSpacing: 2, color: '#aaa', textTransform: 'uppercase', marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  )
}

function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    const uploaded = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage
        .from('campaign-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (!error) {
        const { data: urlData } = supabase.storage.from('campaign-images').getPublicUrl(fileName)
        uploaded.push(urlData.publicUrl)
      }
    }
    onChange([...images, ...uploaded])
    setUploading(false)
  }

  const handleRemove = async (url) => {
    const fileName = url.split('/').pop()
    await supabase.storage.from('campaign-images').remove([fileName])
    onChange(images.filter(u => u !== url))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
          {images.map((url, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={url} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', border: '1px solid #333' }} />
              <button onClick={() => handleRemove(url)} style={{ position: 'absolute', top: 4, right: 4, background: '#E8000D', border: 'none', color: '#fff', width: 22, height: 22, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
          ))}
        </div>
      )}
      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#222', border: '1px dashed #444', color: '#aaa', padding: '10px 16px', cursor: 'pointer', fontFamily: "'Inter'", fontSize: 13 }}>
        {uploading ? 'Yükleniyor...' : '+ Görsel Ekle'}
        <input type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
      </label>
    </div>
  )
}

function Empty({ text }) {
  return <div style={{ color: '#555', fontSize: 13, fontFamily: "'Inter'", padding: '20px 0' }}>{text}</div>
}