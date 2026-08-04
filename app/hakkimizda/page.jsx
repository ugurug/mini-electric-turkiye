import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

export const metadata = {
  title: 'Hakkımızda — MINI Electric Türkiye',
  description: "MINI Electric Türkiye Minifestosu — Birlikte Yolda, Birlikte Hayatta. Türkiye'nin dört bir yanından elektrikli MINI tutkunlarını bir araya getiren topluluğun değerleri ve varoluş nedeni.",
}

const intro = "Bizler yalnızca birer araç sahibi değiliz. Biz bir fikrin, bir duruşun ve bir yaşam biçiminin gönüllüleriyiz. Elektrikli MINI Countryman'lerimizle çıktığımız bu yol, sadece bireysel bir sürüş değil, kolektif bir dönüşüm yolculuğudur. Her biri farklı şehirlerden, farklı hikâyelerden gelen, giderek büyüyen bir topluluğuz. Ama biz bir araya geldiğimizde bir oluruz. Birbirimizi tanımasak bile aynı frekanstayız. Çünkü biliyoruz: Yalnız yola çıkılır ama birlikte varılır."

const sections = [
  {
    h: 'Ortak Tutkumuz: MINI',
    p: "Bir aracın ötesinde, MINI bizim ortak noktamızdır. Paylaştığımız şey sadece model, batarya ya da tasarım değil; paylaştığımız şey yaşamın kendisidir. Her kapı açıldığında başka bir hikâye başlar. Her sürüş, yeni ilhamlar doğurur. Biz MINI'ye binerken aslında birbirimize yaklaşırız. Tanımadığımız insanların dostumuz olması bir tesadüf değil; bu, bu kültürün bir parçası.",
  },
  {
    h: 'Ekosistemimizin Kalbindeyiz: Sadece Kullanıcı Değil, Katılımcıyız',
    p: "Her üyemiz, MINI Electric Türkiye ekosisteminin canlı bir parçasıdır. Kimimiz teknik bilgi sunar, kimimiz tecrübeyi paylaşır, kimimiz sadece gülümsemesiyle atmosferi güzelleştirir. Ama herkes katkıda bulunur. İşte bu yüzden bizim grubumuz bir “kullanıcı grubu” değil, yaşayan bir organizmadır. Bu organizma; bilgiyle beslenir, yardımla büyür, dostlukla nefes alır.",
  },
  {
    h: 'Dayanışma: Enerjimiz Hiç Bitmesin!',
    p: "Soruların cevapsız kalmadığı, sorunların ortak çözüldüğü bir yer burası. Yolda kalan tek bir MINI varsa, aslında hepimiz durmuş sayarız. Birimizin başarısı, hepimizin ilhamıdır. Birimizin morali bozuksa, hepimiz onun arkasında dururuz. Çünkü biz sadece elektrikle değil, birbirimizle de besleniyoruz.",
  },
  {
    h: 'Anahtarımız Sohbetimiz',
    p: "Konuşmak, dinlemek, anlamak... Sadece sürüşe değil, sohbete de yer açıyoruz. Grubun içindeki her selam, her emoji, her soru: Bir bağın ipucu, bir arkadaşlığın kıvılcımıdır.",
  },
  {
    h: 'Topluluğumuz, Hayatın Ta Kendisi',
    p: "MINI Electric Türkiye, sadece MINI için değil, yaşamın her alanı için bir paylaşımdır. Yeni insanlarla tanışmak, farklı şehirlerde konvoy yapmak, birlikte kahvaltı etmek, servis tavsiyesi paylaşmak, zor zamanında bir üyenin elinden tutmak... Bunların her biri bizim için birer sosyal sermaye. Daha iyi bir çevre, daha sağlıklı ilişkiler ve daha kaliteli bir yaşam için bu topluluk vardır.",
  },
  {
    h: 'Gelecek İçin Bugün Yola Çıkıyoruz',
    p: "Elektrikli araçlarımızı tercih etmek, sadece konfor değil büyük bir sorumluluktur. Daha temiz bir çevre, daha az karbon salımı, daha yaşanabilir şehirler... Biz geleceğe sadece umutla değil, fiilen katkıyla bakıyoruz. Ve bu yolda yalnız değiliz. Her bir üye, doğanın yanında. Her bir paylaşım, doğaya saygı. Her MINI, daha yeşil bir dünya için atılmış bir adımdır.",
  },
  {
    h: 'MINI Electric Türkiye: Bir Araçtan Daha Fazlası',
    p: "Bu topluluk; güçlü bir sosyal ağdır, doğaya duyarlı bir harekettir, teknik bir bilgi havuzudur, samimi bir arkadaşlıktır, ortak bir yaşam vizyonudur. Bu yüzden biz, birbirimizin MINI'sini de, duygusunu da önemseriz. Çünkü MINI Electric Türkiye, “bana ne” değil, “birlikte nasıl daha iyi oluruz?” diyenlerin yeridir.",
  },
]

export default function Hakkimizda() {
  return (
    <div style={{ background: '#f8f8f8', color: '#111', fontFamily: "'Inter', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@300;400;500;600&display=swap');`}</style>

      <SiteHeader active="/hakkimizda" />

      {/* HERO */}
      <section style={{ background: '#111', color: '#fff', padding: '72px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(232,0,13,0.16) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', padding: '3px 12px', borderRadius: 20, marginBottom: 20 }}>Minifesto</span>
          <h1 style={{ fontFamily: "'Montserrat'", fontWeight: 900, fontSize: 'clamp(30px, 5.5vw, 48px)', lineHeight: 1.12, marginBottom: 22 }}>
            Birlikte Yolda,<br /><span style={{ color: '#E8000D' }}>Birlikte Hayatta</span>
          </h1>
          <p style={{ color: '#bbb', fontSize: 15.5, lineHeight: 1.85, maxWidth: 620, margin: '0 auto' }}>{intro}</p>
        </div>
      </section>

      {/* MİNİFESTO BÖLÜMLERİ */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '64px 20px' }}>
          <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#E8000D', border: '1.5px solid #E8000D', padding: '3px 10px', borderRadius: 20, marginBottom: 28 }}>Değerlerimiz</span>
          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: i === sections.length - 1 ? 0 : 34, paddingLeft: 22, borderLeft: '3px solid #E8000D' }}>
              <h2 style={{ fontFamily: "'Montserrat'", fontSize: 19, fontWeight: 800, color: '#111', marginBottom: 10, letterSpacing: -0.2 }}>{s.h}</h2>
              <p style={{ color: '#555', fontSize: 15.5, lineHeight: 1.85 }}>{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#111', color: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '64px 20px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Montserrat'", fontWeight: 900, fontSize: 32, marginBottom: 14 }}>Sen de aramıza katıl</h2>
          <p style={{ color: '#bbb', fontSize: 15, lineHeight: 1.7, maxWidth: 460, margin: '0 auto 28px' }}>
            "Bana ne" değil, "birlikte nasıl daha iyi oluruz?" diyenlerin yeri burası.
          </p>
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
