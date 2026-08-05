'use client'
import { useState } from 'react'

const links = [
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/etkinlikler', label: 'Etkinlikler' },
  { href: '/kampanyalar', label: 'Kampanyalar' },
  { href: '/iletisim', label: 'İletişim' },
]

export default function HeaderInner({ active, joinEnabled = true, joinUrl = '#' }) {
  const [open, setOpen] = useState(false)
  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <style>{`
        .sh-link { color: #444; text-decoration: none; font-family: 'Inter', sans-serif; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600; padding: 8px 12px; transition: color 0.2s; display: block; }
        .sh-link:hover, .sh-link.active { color: #E8000D; }
        .sh-cta { display: inline-block; background: #E8000D; color: #fff; font-family: 'Inter', sans-serif; font-size: 12px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 700; padding: 8px 18px; border-radius: 4px; text-decoration: none; transition: background 0.2s; }
        .sh-cta:hover { background: #c00; }
        .sh-mobile { display: none; flex-direction: column; background: #fff; border-top: 1px solid #f0f0f0; padding: 8px 0; }
        .sh-mobile.open { display: flex; }
        .sh-mobile .sh-link { padding: 12px 24px; border-bottom: 1px solid #f5f5f5; font-size: 13px; }
        .sh-burger { display: none; background: none; border: none; cursor: pointer; padding: 8px; flex-direction: column; gap: 5px; }
        .sh-burger span { display: block; width: 24px; height: 2px; background: #333; transition: all 0.3s; }
        @media (max-width: 768px) { .sh-burger { display: flex; } .sh-desktop { display: none !important; } }
      `}</style>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="Mini Electric Türkiye" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          <span style={{ fontFamily: "'Montserrat'", fontSize: 15, fontWeight: 900, color: '#111' }}>
            MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span>
          </span>
        </a>
        <div className="sh-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {links.map(l => <a key={l.href} href={l.href} className={`sh-link${active === l.href ? ' active' : ''}`}>{l.label}</a>)}
          {joinEnabled && <a href={joinUrl} target="_blank" rel="noreferrer" className="sh-cta" style={{ marginLeft: 10 }}>Kulübe Katıl</a>}
        </div>
        <button className="sh-burger" onClick={() => setOpen(!open)} aria-label="Menü">
          <span style={{ transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ opacity: open ? 0 : 1 }} />
          <span style={{ transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>
      <div className={`sh-mobile${open ? ' open' : ''}`}>
        {links.map(l => <a key={l.href} href={l.href} className={`sh-link${active === l.href ? ' active' : ''}`} onClick={() => setOpen(false)}>{l.label}</a>)}
        {joinEnabled && <a href={joinUrl} target="_blank" rel="noreferrer" className="sh-link" style={{ color: '#E8000D', fontWeight: 700 }}>Kulübe Katıl</a>}
      </div>
    </nav>
  )
}
