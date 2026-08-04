const footerLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/kampanyalar', label: 'Kampanyalar' },
  { href: '/yikama', label: 'Yıkama Merkezleri' },
  { href: '/sss', label: 'Sık Sorulan Sorular' },
  { href: '/kurallar', label: 'Topluluk Kuralları' },
  { href: '/iletisim', label: 'İletişim' },
]

export default function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid #222', color: '#888', marginTop: 'auto' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '36px 20px 28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 24px', justifyContent: 'center', marginBottom: 22 }}>
          {footerLinks.map(l => (
            <a key={l.href} href={l.href} style={{ color: '#aaa', textDecoration: 'none', fontSize: 13, fontFamily: "'Inter', sans-serif" }}>{l.label}</a>
          ))}
        </div>
        <div style={{ textAlign: 'center', color: '#555', fontSize: 12, letterSpacing: 0.5 }}>
          © {year} <span style={{ color: '#E8000D', fontFamily: "'Montserrat'", fontWeight: 700 }}>Mini Electric Türkiye</span> Fan Kulübü — Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
