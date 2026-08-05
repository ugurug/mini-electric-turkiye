const JOTFORM = 'https://www.jotform.com/form/251503841296053'
const INSTAGRAM = 'https://instagram.com/minielectricturkiye'

const columns = [
  {
    title: 'Topluluk',
    links: [
      { href: '/', label: 'Ana Sayfa' },
      { href: '/hakkimizda', label: 'Hakkımızda' },
      { href: '/etkinlikler', label: 'Etkinlikler' },
      { href: '/topluluk', label: 'Topluluk Rakamları' },
      { href: '/isbirlikleri', label: 'İş Birlikleri' },
      { href: '/kurallar', label: 'Topluluk Kuralları' },
    ],
  },
  {
    title: 'Kaynaklar',
    links: [
      { href: '/teknik', label: 'Teknik Kütüphane' },
      { href: '/kampanyalar', label: 'Kampanyalar' },
      { href: '/yikama', label: 'Yıkama Merkezleri' },
      { href: '/sss', label: 'Sık Sorulan Sorular' },
    ],
  },
  {
    title: 'İletişim',
    links: [
      { href: '/iletisim', label: 'İletişim' },
      { href: INSTAGRAM, label: 'Instagram', external: true },
      { href: JOTFORM, label: 'Kulübe Katıl', external: true },
    ],
  },
]

export default function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid #222', color: '#888', marginTop: 'auto' }}>
      <style>{`
        .sf-grid {
          display: grid;
          grid-template-columns: minmax(220px, 1.4fr) repeat(3, minmax(140px, 1fr));
          gap: 40px 32px;
          margin-bottom: 36px;
        }
        @media (max-width: 760px) {
          .sf-grid { grid-template-columns: 1fr 1fr; gap: 32px 24px; }
          .sf-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 430px) {
          .sf-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 20px 28px' }}>
        <div className="sf-grid">
          {/* Marka sütunu */}
          <div className="sf-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <img src="/logo.png" alt="Mini Electric Türkiye" style={{ width: 40, height: 40, objectFit: 'contain' }} />
              <span style={{ fontFamily: "'Montserrat'", fontSize: 14, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
                MINI ELECTRIC <span style={{ color: '#E8000D' }}>TÜRKİYE</span>
              </span>
            </div>
            <p style={{ color: '#888', fontSize: 13, lineHeight: 1.7, fontFamily: "'Inter', sans-serif", margin: 0, maxWidth: 260 }}>
              Elektrikli MINI tutkunlarının buluştuğu Türkiye topluluğu. Birlikte sürüyor, paylaşıyor, büyüyoruz.
            </p>
          </div>

          {/* Bağlantı sütunları */}
          {columns.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "'Montserrat'",
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  marginBottom: 16,
                }}
              >
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    style={{ color: '#aaa', textDecoration: 'none', fontSize: 13.5, fontFamily: "'Inter', sans-serif", lineHeight: 1.3 }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #1c1c1c', paddingTop: 22, textAlign: 'center', color: '#555', fontSize: 12, letterSpacing: 0.5 }}>
          © {year} <span style={{ color: '#E8000D', fontFamily: "'Montserrat'", fontWeight: 700 }}>Mini Electric Türkiye</span> Topluluğu — Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
