// Teknik Kütüphane içeriği. Şimdilik kod içinde; ileride Supabase'e taşınıp
// panelden düzenlenebilir hale getirilebilir.
// NOT: İçerikler genel elektrikli araç bilgisidir; modele özel spesifik
// değerleri (kWh, km, garanti şartları) üreticiden doğrulayıp güncelleyin.

export const articles = [
  {
    slug: 'menzili-etkileyen-faktorler',
    title: 'Elektrikli MINI’de Menzili Etkileyen Faktörler',
    category: 'Menzil',
    summary: 'Gerçek menzil neden WLTP değerinden farklı olur? Hız, sıcaklık, sürüş tarzı ve daha fazlası.',
    updated: '2026-08',
    intro: 'Bir elektrikli aracın kataloğunda yazan WLTP menzili ideal koşullarda ölçülür. Gerçek hayatta menzili birçok faktör etkiler. Bunları bilmek, hem daha isabetli planlama yapmanı hem de menzilinden en iyi verimi almanı sağlar.',
    sections: [
      { h: 'Hız ve Aerodinamik', p: 'Menzili en çok etkileyen faktör hızdır. Hava direnci hızın karesiyle arttığından, 110-120 km/s üzerinde tüketim belirgin şekilde yükselir. Otoyolda sabit ve makul bir hız, menzili ciddi biçimde uzatır.' },
      { h: 'Dış Sıcaklık', p: 'Soğuk hava menzili düşürür: batarya kimyası yavaşlar ve kabini ısıtmak enerji ister. Kışın menzilde %20-30 düşüş görülebilir. Aracı şarjdayken ön ısıtma (preconditioning) ile çalıştırmak, yola menzil kaybetmeden başlamana yardım eder.' },
      { h: 'Klima ve Kabin Isıtması', p: 'Özellikle kabin ısıtması yüksek enerji tüketir. Isı pompalı sistemler klasik rezistanslı ısıtmaya göre çok daha verimlidir. Koltuk/direksiyon ısıtması, tüm kabini ısıtmaya göre daha az enerjiyle konfor sağlar.' },
      { h: 'Sürüş Tarzı', p: 'Sert hızlanma ve ani frenleme tüketimi artırır. Yumuşak gaz ve öngörülü sürüş verimi yükseltir. Rejeneratif frenleme, yavaşlarken enerjinin bir kısmını geri kazandırır; şehir içinde bu katkı belirgindir.' },
      { h: 'Lastik, Jant ve Yük', p: 'Düşük lastik basıncı yuvarlanma direncini artırıp menzili düşürür; basınçları düzenli kontrol et. Büyük jant ve geniş lastikler bir miktar daha fazla tüketime yol açar. Araçtaki fazla yük de menzili azaltır.' },
      { h: 'Rota ve Rakım', p: 'Yokuş yukarı tırmanışta tüketim artar; inişte rejeneratif frenleme ile enerjinin bir kısmı geri gelir. Dağlık rotalarda menzil tahminini buna göre yap.' },
    ],
  },
  {
    slug: 'batarya-sagligi',
    title: 'Batarya Sağlığını Korumanın Yolları',
    category: 'Pil',
    summary: 'Şarj aralığı, sıcaklık ve alışkanlıklar bataryanın uzun ömürlü kalmasını nasıl etkiler?',
    updated: '2026-08',
    intro: 'Elektrikli aracın bataryası zamanla bir miktar kapasite kaybeder — bu normaldir. Ancak doğru alışkanlıklarla bu süreç belirgin şekilde yavaşlatılabilir. İşte bataryanı uzun ömürlü tutmanın temel yolları.',
    sections: [
      { h: 'Günlük Şarj Aralığı: %20-80', p: 'Günlük kullanımda şarjı yaklaşık %20 ile %80 arasında tutmak batarya ömrü için idealdir. Bataryayı sürekli %100’de veya çok düşük seviyelerde bırakmak yıpratır. %100’ü yalnızca uzun yolculuk öncesi, yola çıkmadan hemen önce yap.' },
      { h: 'Hızlı Şarjı (DC) Dengeli Kullan', p: 'DC hızlı şarj pratiktir ama ısı üretir ve sık kullanımda bataryayı daha çok yıpratabilir. Ara sıra kullanmak sorun değildir; günlük şarj için ev/iş yerindeki AC şarjı tercih et.' },
      { h: 'Sıcaklığa Dikkat', p: 'Aşırı sıcak ve aşırı soğuk bataryanın en büyük düşmanıdır. Mümkünse aracı gölgede veya kapalı otoparkta tut. Çok sıcak günlerde aracı sürüşün hemen ardından hızlı şarja sokmaktan kaçınmak faydalı olabilir.' },
      { h: 'Uzun Süre Park Edilecekse', p: 'Aracı uzun süre (ör. tatil) kullanmayacaksan bataryayı %100 veya %0’da değil, yaklaşık %50 civarında bırak. Bu, batarya için en az stresli seviyedir.' },
      { h: 'Degradasyon Normaldir', p: 'Yıllar içinde kapasitede kademeli bir azalma (degradasyon) beklenir ve bu normaldir. İyi alışkanlıklar bunu yavaşlatır. Üreticinin batarya garantisi genellikle belirli bir kapasite eşiğini kapsar — kendi modelinizin garanti şartlarını üreticiden doğrulayın.' },
    ],
  },
  {
    slug: 'sarj-rehberi',
    title: 'Şarj Rehberi: AC, DC ve Şarj Hızı',
    category: 'Şarj',
    summary: 'AC ile DC şarj arasındaki fark, şarj eğrisi ve uzun yolda verimli şarj planlaması.',
    updated: '2026-08',
    intro: 'Elektrikli araç şarjı ilk bakışta kafa karıştırıcı görünebilir ama mantığı basittir. İki temel şarj türü ve şarj hızını belirleyen faktörleri bilmek, hem evde hem yolda işini kolaylaştırır.',
    sections: [
      { h: 'AC Şarj (Tip 2)', p: 'Ev, iş yeri ve çoğu şehir içi istasyonda kullanılan yavaş-orta hızlı şarjdır. Bir wallbox (duvar şarj ünitesi) ile genellikle 7-11 kW arası güçle şarj olur. Yavaştır ama batarya dostudur ve günlük şarj için idealdir.' },
      { h: 'DC Hızlı Şarj (CCS)', p: 'Otoyol ve hızlı şarj istasyonlarında bulunan yüksek güçlü şarjdır. Dakikalar içinde ciddi menzil ekleyebilir; uzun yolculuklar için tasarlanmıştır. Bataryaya AC’ye göre daha çok yük bindirdiğinden günlük değil, gerektiğinde kullanılması önerilir.' },
      { h: 'Şarj Eğrisi Neden Yavaşlar?', p: 'DC hızlı şarjda batarya doldukça şarj hızı düşer. En hızlı bölge genellikle %10-80 aralığıdır; %80’den sonra araç, bataryayı korumak için hızı belirgin şekilde azaltır. Bu yüzden uzun yolda %80’de fişi çekip yola devam etmek, %100’ü beklemekten çoğu zaman daha verimlidir.' },
      { h: 'Uzun Yolda Şarj Planlama', p: 'Uzun rotalarda bataryayı sıfıra kadar tüketmeye çalışma. %10 civarına inip %80’e kadar hızlı şarj yapmak, hem süre hem batarya açısından en verimli yaklaşımdır. Rota üzerindeki şarj istasyonlarını önceden planla.' },
      { h: 'Evde Şarj', p: 'Düzenli kullanım için en pratik çözüm evde bir wallbox’tır. Gece düşük elektrik tarifesinden yararlanarak şarj etmek maliyeti ciddi biçimde düşürür. Prizden (normal ev prizi) şarj mümkündür ama çok yavaştır; acil durum çözümü olarak düşünülmelidir.' },
    ],
  },
]

export const getArticle = (slug) => articles.find((a) => a.slug === slug)
