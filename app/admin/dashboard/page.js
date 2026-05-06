'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const TABS = ['Kampanyalar', 'Haberler', 'SSS', 'Bilinen Sorunlar', 'Yıkama Merkezleri', 'Yıkama Yorumları', 'Kullanıcılar']

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
            <span style={{ fontFamily: "'Inter'", fontSize: 18, letterSpacing: 2 }}>MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span></span>
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
        {activeTab === 3 && <IssuesTab />}
        {activeTab === 4 && <CentersTab />}
        {activeTab === 5 && <CommentsTab />}
        {activeTab === 6 && role === 'super_admin' && <UsersTab />}
      </div>
    </div>
  )
}

/* ─── CAMPAIGNS ─── */
function CampaignsTab() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', description: '', start_at: '', end_at: '' })
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
    setForm({ title: item.title, description: item.description || '', start_at: item.start_at?.slice(0, 16) || '', end_at: item.end_at?.slice(0, 16) || '' })
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
              <label className="form-label">Açıklama</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
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

/* ─── KNOWN ISSUES ─── */
function IssuesTab() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', description: '', status: 'open' })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchItems() }, [])
  const fetchItems = async () => {
    const { data } = await supabase.from('known_issues').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await supabase.from('known_issues').update(form).eq('id', editing) }
    else { await supabase.from('known_issues').insert([form]) }
    setForm({ title: '', description: '', status: 'open' }); setEditing(null); setShowForm(false); fetchItems()
  }
  const handleEdit = (item) => { setForm({ title: item.title, description: item.description || '', status: item.status }); setEditing(item.id); setShowForm(true) }
  const handleDelete = async (id) => { if (confirm('Bu sorunu silmek istiyor musunuz?')) { await supabase.from('known_issues').delete().eq('id', id); fetchItems() } }

  const statusLabel = (s) => ({ open: 'Açık', in_progress: 'İnceleniyor', resolved: 'Çözüldü' }[s])
  const statusColor = (s) => ({ open: '#E8000D', in_progress: '#F5A623', resolved: '#27AE60' }[s])

  return (
    <TabLayout title="Bilinen Sorunlar" onAdd={() => { setForm({ title: '', description: '', status: 'open' }); setEditing(null); setShowForm(!showForm) }}>
      {showForm && (
        <FormBox title={editing ? 'Sorunu Düzenle' : 'Yeni Sorun'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group"><label className="form-label">Başlık</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Açıklama</label><textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Durum</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="open">Açık</option><option value="in_progress">İnceleniyor</option><option value="resolved">Çözüldü</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}><button type="submit" className="btn-red">{editing ? 'Güncelle' : 'Kaydet'}</button><button type="button" className="btn-gray" onClick={() => { setShowForm(false); setEditing(null) }}>İptal</button></div>
          </form>
        </FormBox>
      )}
      <table>
        <thead><tr><th>Başlık</th><th>Açıklama</th><th>Durum</th><th>İşlemler</th></tr></thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={4} style={{ color: '#555', textAlign: 'center' }}>Henüz sorun yok.</td></tr>}
          {items.map(item => (
            <tr key={item.id}>
              <td style={{ color: '#fff', fontWeight: 600 }}>{item.title}</td>
              <td style={{ maxWidth: 300 }}>{item.description}</td>
              <td><span className="badge" style={{ color: statusColor(item.status), border: `1px solid ${statusColor(item.status)}` }}>{statusLabel(item.status)}</span></td>
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
  const [form, setForm] = useState({ name: '', address: '', notes: '' })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchItems() }, [])
  const fetchItems = async () => {
    const { data } = await supabase.from('washing_centers').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) { await supabase.from('washing_centers').update(form).eq('id', editing) }
    else { await supabase.from('washing_centers').insert([{ ...form, approved: true, source: 'admin' }]) }
    setForm({ name: '', address: '', notes: '' }); setEditing(null); setShowForm(false); fetchItems()
  }
  const handleEdit = (item) => { setForm({ name: item.name, address: item.address || '', notes: item.notes || '' }); setEditing(item.id); setShowForm(true) }
  const handleDelete = async (id) => { if (confirm('Bu merkezi silmek istiyor musunuz?')) { await supabase.from('washing_centers').delete().eq('id', id); fetchItems() } }
  const toggleApprove = async (item) => { await supabase.from('washing_centers').update({ approved: !item.approved }).eq('id', item.id); fetchItems() }

  return (
    <TabLayout title="Yıkama Merkezleri" onAdd={() => { setForm({ name: '', address: '', notes: '' }); setEditing(null); setShowForm(!showForm) }}>
      {showForm && (
        <FormBox title={editing ? 'Merkezi Düzenle' : 'Yeni Merkez'}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group"><label className="form-label">Merkez Adı</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Adres</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Notlar</label><textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: 8 }}><button type="submit" className="btn-red">{editing ? 'Güncelle' : 'Kaydet'}</button><button type="button" className="btn-gray" onClick={() => { setShowForm(false); setEditing(null) }}>İptal</button></div>
          </form>
        </FormBox>
      )}
      <table>
        <thead><tr><th>Merkez Adı</th><th>Adres</th><th>Kaynak</th><th>Durum</th><th>İşlemler</th></tr></thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={5} style={{ color: '#555', textAlign: 'center' }}>Henüz merkez yok.</td></tr>}
          {items.map(item => (
            <tr key={item.id}>
              <td style={{ color: '#fff', fontWeight: 600 }}>{item.name}</td>
              <td>{item.address}</td>
              <td><span className="badge" style={{ color: item.source === 'admin' ? '#aaa' : '#F5A623', border: `1px solid ${item.source === 'admin' ? '#444' : '#F5A623'}` }}>{item.source === 'admin' ? 'Admin' : 'Kullanıcı'}</span></td>
              <td><button onClick={() => toggleApprove(item)} className="badge" style={{ color: item.approved ? '#27AE60' : '#E8000D', border: `1px solid ${item.approved ? '#27AE60' : '#E8000D'}`, background: 'none', cursor: 'pointer' }}>{item.approved ? 'Onaylı' : 'Beklemede'}</button></td>
              <td><div style={{ display: 'flex', gap: 8 }}><button className="btn-gray" onClick={() => handleEdit(item)}>Düzenle</button><button className="btn-danger" onClick={() => handleDelete(item.id)}>Sil</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </TabLayout>
  )
}

/* ─── WASHING COMMENTS ─── */
function CommentsTab() {
  const [items, setItems] = useState([])
  const [centers, setCenters] = useState([])

  useEffect(() => { fetchItems() }, [])
  const fetchItems = async () => {
    const [c, wc] = await Promise.all([
      supabase.from('washing_comments').select('*').order('created_at', { ascending: false }),
      supabase.from('washing_centers').select('id, name')
    ])
    setItems(c.data || [])
    setCenters(wc.data || [])
  }
  const toggleApprove = async (item) => { await supabase.from('washing_comments').update({ approved: !item.approved }).eq('id', item.id); fetchItems() }
  const handleDelete = async (id) => { if (confirm('Bu yorumu silmek istiyor musunuz?')) { await supabase.from('washing_comments').delete().eq('id', id); fetchItems() } }
  const centerName = (id) => centers.find(c => c.id === id)?.name || '—'

  return (
    <TabLayout title="Yıkama Yorumları" showAdd={false}>
      <table>
        <thead><tr><th>Yazar</th><th>Merkez</th><th>Yorum</th><th>Tarih</th><th>Durum</th><th>İşlemler</th></tr></thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={6} style={{ color: '#555', textAlign: 'center' }}>Henüz yorum yok.</td></tr>}
          {items.map(item => (
            <tr key={item.id}>
              <td style={{ color: '#fff', fontWeight: 600 }}>{item.author_name}</td>
              <td>{item.center_id ? centerName(item.center_id) : <span style={{ color: '#F5A623' }}>Öneri: {item.suggested_center_name}</span>}</td>
              <td style={{ maxWidth: 280 }}>{item.content}</td>
              <td>{new Date(item.created_at).toLocaleDateString('tr-TR')}</td>
              <td><button onClick={() => toggleApprove(item)} className="badge" style={{ color: item.approved ? '#27AE60' : '#E8000D', border: `1px solid ${item.approved ? '#27AE60' : '#E8000D'}`, background: 'none', cursor: 'pointer' }}>{item.approved ? 'Onaylı' : 'Beklemede'}</button></td>
              <td><button className="btn-danger" onClick={() => handleDelete(item.id)}>Sil</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </TabLayout>
  )
}

/* ─── USERS (Super Admin only) ─── */
function UsersTab() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ email: '', password: '', role: 'admin' })
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => { fetchUsers() }, [])
  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*')
    setUsers(data || [])
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password })
    if (error) { setMessage('Hata: ' + error.message); return }
    await supabase.from('profiles').insert([{ id: data.user.id, role: form.role }])
    setMessage('Admin başarıyla oluşturuldu.')
    setForm({ email: '', password: '', role: 'admin' }); setShowForm(false); fetchUsers()
  }

  return (
    <TabLayout title="Kullanıcı Yönetimi" onAdd={() => setShowForm(!showForm)}>
      {message && <div style={{ background: '#111', border: '1px solid #27AE60', color: '#27AE60', padding: '10px 16px', marginBottom: 16, fontFamily: "'Barlow Condensed'", fontSize: 13, letterSpacing: 1 }}>{message}</div>}
      {showForm && (
        <FormBox title="Yeni Admin Oluştur">
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group"><label className="form-label">E-posta</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Şifre</label><input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Rol</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Admin</option><option value="super_admin">Süper Admin</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}><button type="submit" className="btn-red">Oluştur</button><button type="button" className="btn-gray" onClick={() => setShowForm(false)}>İptal</button></div>
          </form>
        </FormBox>
      )}
      <table>
        <thead><tr><th>Kullanıcı ID</th><th>Rol</th><th>Oluşturulma</th></tr></thead>
        <tbody>
          {users.length === 0 && <tr><td colSpan={3} style={{ color: '#555', textAlign: 'center' }}>Henüz kullanıcı yok.</td></tr>}
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ color: '#aaa', fontSize: 11 }}>{u.id}</td>
              <td><span className="badge" style={{ color: u.role === 'super_admin' ? '#E8000D' : '#aaa', border: `1px solid ${u.role === 'super_admin' ? '#E8000D' : '#444'}` }}>{u.role === 'super_admin' ? 'Süper Admin' : 'Admin'}</span></td>
              <td>{new Date(u.created_at).toLocaleDateString('tr-TR')}</td>
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
        <div style={{ fontFamily: "'Inter'", fontSize: 28, letterSpacing: 2 }}>{title}</div>
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