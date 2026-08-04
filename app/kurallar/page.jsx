import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

export const metadata = {
  title: 'Topluluk Kuralları — MINI Electric Türkiye',
  description: 'MINI Electric Türkiye topluluğunun katılım ve davranış kuralları. Herkesin kendini rahat ve güvende hissettiği bir topluluk için temel ilkeler.',
}

const rules = [
  { t: 'Saygı ve Nezaket Esastır', d: 'Herkesin fikirlerine saygılı olun, kışkırtıcı veya kırıcı ifadelerden kaçının. Herkesin kendini rahat hissedebileceği bir ortam yaratmaya özen gösterelim.' },
  { t: 'Sohbetler Samimi ve Yapıcı Olmalıdır', d: 'Günlük sohbetler, fikir alışverişleri ve keyifli paylaşımlar için buradayız. Tartışmalarda karşılıklı anlayış ve hoşgörüyü ön planda tutalım.' },
  { t: 'Kişisel Anlaşmazlıkları Grupta Tartışmayın', d: 'Bireysel meseleleri özel mesaj yoluyla çözmeye çalışın. Topluluğu gereksiz gerilimlere boğmayalım.' },
  { t: 'Spam ve Gereksiz Bildirimlerden Kaçının', d: 'Sürekli tek kelimelik mesajlar, zincir mesajlar, sürekli emoji göndermek veya gereksiz etiketlemeler yapmaktan kaçının.' },
  { t: 'Reklam ve Tanıtım Yapmak Yasaktır', d: 'Kendi işinizi, markanızı veya başka bir platformu tanıtmak için topluluğu kullanmayın. Özel bir duyuru yapmak istiyorsanız yöneticilere danışabilirsiniz.' },
  { t: 'Yanıltıcı veya Doğrulanmamış Bilgi Paylaşmayın', d: 'Haber, sağlık, finans veya benzeri konularda yanlış bilgilendirme yapmamaya özen gösterelim.' },
  { t: 'Özel Bilgileri Koruyun', d: 'Grup üyelerinin telefon numaraları, adresleri veya kişisel bilgilerini izin almadan paylaşmayın.' },
  { t: 'Herkese Açık ve Kapsayıcı Bir Ortam', d: 'Toplulukta herkes kendini rahat hissetmeli. Ayrımcılık, nefret söylemi, ırkçılık veya herhangi bir gruba yönelik olumsuz dil kullanılmamalıdır.' },
  { t: 'Şiddet, Politik ve Hassas Konulara Dikkat', d: 'Farklı görüşlere saygı duymak önemli; ancak politik ve hassas konulara aşırıya kaçmadan ve topluluğun sosyal ortamına zarar vermeyecek şekilde yaklaşılmalıdır.' },
  { t: 'Uygunsuz İçerik Paylaşımı Yasaktır', d: 'Müstehcen, şiddet içeren, yasa dışı veya ahlaki sınırları zorlayan içerikler paylaşmayın.' },
  { t: 'Topluluğun Amacına Uygun Konular Konuşulmalıdır', d: 'Günlük sohbet, sosyal aktiviteler, öneriler, fikir alışverişleri ve ortak ilgi alanlarıyla ilgili konuşmalar teşvik edilir.' },
  { t: 'Yetkililerin Yönlendirmelerine Uyulmalıdır', d: 'Grup yöneticileri topluluk düzenini sağlamak için burada. Yöneticilerin kararlarına saygı gösterelim ve gerektiğinde rehberliğine başvuralım.' },
  { t: 'Gereksiz Tartışmaları Uzatmayın', d: 'Fikir ayrılıkları olabilir, ancak bunları kibar ve kısa tutmaya özen gösterelim. Gereksiz yere grubu meşgul etmekten kaçınalım.' },
  { t: 'Sohbet Akışına Saygı Gösterin', d: 'Aynı konuyu sürekli gündeme getirmek veya sohbeti domine etmek yerine, herkesin konuşmaya katılabileceği bir ortam oluşturalım.' },
  {
    t: 'Gizlilik ve Kişisel Bilgiler',
    bullets: [
      'Topluluğa katılan üyeler, telefon numaralarının ve WhatsApp profil bilgilerinin (isim, profil fotoğrafı, hakkında kısmı vb.) diğer üyeler tarafından görülebileceğini kabul etmiş olur.',
      'WhatsApp’ın gizlilik ayarlarını kullanarak kişisel bilgilerinizi kimlerin görebileceğini sınırlandırabilirsiniz.',
      'Üyelerin izni olmadan telefon numaralarını veya diğer kişisel bilgilerini topluluk dışında paylaşmak yasaktır.',
    ],
  },
  {
    t: 'Türk Ceza Kanunu’na (TCK) Aykırı ve Suç Teşkil Eden İçerikler Yasaktır',
    bullets: [
      'Her türlü yasadışı içerik, nefret söylemi, terör propagandası, şiddet çağrısı, hakaret, dolandırıcılık, kişisel verilerin izinsiz paylaşımı veya TCK’ya aykırı herhangi bir paylaşım kesinlikle yasaktır.',
      'Suç teşkil eden herhangi bir içerik paylaşan üyeler önceden uyarılmaksızın gruptan çıkarılabilir ve gerekirse yetkililere bildirilebilir.',
    ],
  },
  { t: 'Kurallara Uymayanlar Hakkında Yaptırım Uygulanabilir', d: 'Sürekli kuralları ihlal eden üyeler önce uyarılabilir, ardından yöneticiler tarafından gruptan çıkarılabilir.' },
]

export default function Kurallar() {
  return (
    <div style={{ background: '#f8f8f8', color: '#111', fontFamily: "'Inter', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@300;400;500;600&display=swap');`}</style>

      <SiteHeader active="/kurallar" />

      <section style={{ maxWidth: 780, margin: '0 auto', padding: '56px 20px 24px' }}>
        <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#E8000D', border: '1.5px solid #E8000D', padding: '3px 10px', borderRadius: 20, marginBottom: 14 }}>Topluluk</span>
        <h1 style={{ fontFamily: "'Montserrat'", fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 900, color: '#111', letterSpacing: -0.5, marginBottom: 14 }}>Topluluk Kuralları</h1>
        <p style={{ color: '#555', fontSize: 16, lineHeight: 1.8, maxWidth: 640 }}>
          Herkesin kendini rahat ve güvende hissettiği, keyifli ve yapıcı bir topluluk için temel ilkelerimiz. Aramıza katılan herkesin bu kurallara uyması beklenir.
        </p>
      </section>

      <section style={{ maxWidth: 780, margin: '0 auto', padding: '0 20px 56px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rules.map((r, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', padding: '18px 20px 18px 18px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: 34, height: 34, background: '#E8000D', color: '#fff', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat'", fontWeight: 900, fontSize: 15 }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "'Montserrat'", fontSize: 16, fontWeight: 800, color: '#111', marginBottom: r.d || r.bullets ? 6 : 0 }}>{r.t}</h2>
              {r.d && <p style={{ color: '#666', fontSize: 14.5, lineHeight: 1.6 }}>{r.d}</p>}
              {r.bullets && (
                <ul style={{ margin: '2px 0 0', paddingLeft: 18, color: '#666', fontSize: 14.5, lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {r.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ background: '#111', color: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '56px 20px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Montserrat'", fontWeight: 900, fontSize: 28, marginBottom: 12 }}>Kuralları kabul ediyor musun?</h2>
          <p style={{ color: '#bbb', fontSize: 15, marginBottom: 26 }}>O halde aramıza katıl.</p>
          <a href="https://www.jotform.com/form/251503841296053" target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', background: '#E8000D', color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700, padding: '14px 32px', textDecoration: 'none', borderRadius: 4 }}>
            Kulübe Katıl
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
