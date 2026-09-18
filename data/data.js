
function demoDate(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" });
}

function demoISO(days, hour = 19) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

window.DB = {

  teams: [
    { id: "t1",  name: "Kadıköy Kartalları",   city: "İstanbul", district: "Kadıköy",   players: 12, w: 34, l: 12, d: 6, gf: 148, ga: 92,  colors: ["#2ECC71", "#0B0F0D"], logo: "🦅", founded: 2021, verified: true,  premium: true,
      desc: "Kadıköy'ün en istikrarlı ekibi. Haftada 2 maç yaparız, pas oyununu severiz. Kadromuz geniş ama kaliteli oyuncuya her zaman kapımız açık." },
    { id: "t2",  name: "Beşiktaş Boğaları",     city: "İstanbul", district: "Beşiktaş",  players: 14, w: 41, l: 15, d: 4, gf: 176, ga: 104, colors: ["#E74C3C", "#FFFFFF"], logo: "🐂", founded: 2019, verified: true,  premium: false,
      desc: "2019'dan beri her çarşamba sahadayız. Sert ama centilmen futbol. Fiziği yerinde stoper arıyoruz." },
    { id: "t3",  name: "Çankaya Şimşekleri",    city: "Ankara",   district: "Çankaya",   players: 11, w: 22, l: 10, d: 5, gf: 98,  ga: 71,  colors: ["#F1C40F", "#2C3E50"], logo: "⚡", founded: 2022, verified: false, premium: false,
      desc: "Ankara'nın hızlı hücum futbolu oynayan genç ekibi. Ortalama yaş 24." },
    { id: "t4",  name: "Bornova Alevleri",      city: "İzmir",    district: "Bornova",   players: 13, w: 29, l: 14, d: 7, gf: 121, ga: 89,  colors: ["#E67E22", "#0B0F0D"], logo: "🔥", founded: 2020, verified: true,  premium: false,
      desc: "İzmir Bornova merkezli, turnuva tecrübesi yüksek takım. 2 kupa finali oynadık." },
    { id: "t5",  name: "Ümraniye United",       city: "İstanbul", district: "Ümraniye",  players: 10, w: 12, l: 8,  d: 3, gf: 54,  ga: 47,  colors: ["#3498DB", "#FFFFFF"], logo: "🌊", founded: 2023, verified: false, premium: false,
      desc: "Yeni kurulduk, hırslıyız. Düzenli kadro oluşturuyoruz — her pozisyona açığız." },
    { id: "t6",  name: "Nilüfer Yıldızları",    city: "Bursa",    district: "Nilüfer",   players: 12, w: 26, l: 11, d: 6, gf: 110, ga: 78,  colors: ["#9B59B6", "#F4F7F5"], logo: "⭐", founded: 2021, verified: false, premium: true,
      desc: "Bursa Nilüfer'in yıldızları. Disiplinli antrenman, ciddi maç temposu." },
    { id: "t7",  name: "Muratpaşa Panterleri",  city: "Antalya",  district: "Muratpaşa", players: 11, w: 18, l: 9,  d: 4, gf: 84,  ga: 66,  colors: ["#1ABC9C", "#0B0F0D"], logo: "🐆", founded: 2022, verified: false, premium: false,
      desc: "Antalya sahilinin en çevik takımı. Kanat oyununa önem veririz." },
    { id: "t8",  name: "Keçiören Kurtları",     city: "Ankara",   district: "Keçiören",  players: 14, w: 48, l: 18, d: 9, gf: 203, ga: 131, colors: ["#95A5A6", "#2C3E50"], logo: "🐺", founded: 2018, verified: true,  premium: true,
      desc: "6 yıllık köklü ekip. Ankara amatör liginin korkulu rüyası. Sadece ciddi oyuncular başvursun." },
    { id: "t9",  name: "Karşıyaka Marina FC",   city: "İzmir",    district: "Karşıyaka", players: 12, w: 31, l: 13, d: 5, gf: 132, ga: 95,  colors: ["#2ECC71", "#E74C3C"], logo: "⚓", founded: 2020, verified: false, premium: false,
      desc: "Karşıyaka sahilinde her cuma maç. Samimi ortam, rekabetçi futbol." },
    { id: "t10", name: "Pendik Fırtınası",      city: "İstanbul", district: "Pendik",    players: 13, w: 24, l: 12, d: 8, gf: 105, ga: 87,  colors: ["#34495E", "#F1C40F"], logo: "🌪️", founded: 2021, verified: false, premium: false,
      desc: "Pendik sahilinin fırtınası. Gece maçları bizim işimiz." },
    { id: "t11", name: "Seyhan Akrepleri",      city: "Adana",    district: "Seyhan",    players: 10, w: 9,  l: 6,  d: 2, gf: 41,  ga: 33,  colors: ["#E74C3C", "#0B0F0D"], logo: "🦂", founded: 2023, verified: false, premium: false,
      desc: "Adana sıcağında futbol bizden sorulur. Yeni ve aç bir ekibiz." },
    { id: "t12", name: "Moda United",           city: "İstanbul", district: "Kadıköy",   players: 12, w: 38, l: 14, d: 7, gf: 160, ga: 101, colors: ["#16A085", "#FFFFFF"], logo: "🎯", founded: 2019, verified: true,  premium: false,
      desc: "Moda'nın teknik takımı. Tiki-taka sevenler buraya. Seviye: iyi-çok iyi." },
    { id: "t13", name: "Selçuklu Sultanları",   city: "Konya",    district: "Selçuklu",  players: 11, w: 15, l: 9,  d: 4, gf: 68,  ga: 55,  colors: ["#D35400", "#F4F7F5"], logo: "👑", founded: 2022, verified: false, premium: false,
      desc: "Konya'nın sultanları. Dostluk ön planda, rekabet sahada." },
    { id: "t14", name: "Ortahisar Karadeniz",   city: "Trabzon",  district: "Ortahisar", players: 14, w: 27, l: 13, d: 6, gf: 118, ga: 94,  colors: ["#8E44AD", "#5DADE2"], logo: "🌊", founded: 2020, verified: false, premium: false,
      desc: "Karadeniz fırtınası. Yağmur çamur demeden her hafta sahadayız." },
    { id: "t15", name: "Bağcılar Aslanları",    city: "İstanbul", district: "Bağcılar",  players: 13, w: 20, l: 11, d: 5, gf: 89,  ga: 76,  colors: ["#F39C12", "#0B0F0D"], logo: "🦁", founded: 2021, verified: false, premium: false,
      desc: "Bağcılar'ın aslanları. Mahalle ruhu, profesyonel ciddiyet." }
  ],

  matches: [
    { id: "m1",  teamId: "t1",  team: "Kadıköy Kartalları",  venue: "Yıldız Arena",         venueId: "v1", city: "İstanbul", district: "Kadıköy",    date: demoDate(0), off: 0, time: "21:00", missing: 1, position: "Kaleci",     price: 90,  dist: 1.2 },
    { id: "m2",  teamId: "t2",  team: "Beşiktaş Boğaları",   venue: "Vadi Halı Saha",       venueId: "v2", city: "İstanbul", district: "Beşiktaş",   date: demoDate(0), off: 0, time: "22:00", missing: 1, position: "Stoper",     price: 100, dist: 8.4 },
    { id: "m3",  teamId: "t5",  team: "Ümraniye United",     venue: "Gol Park Tesisleri",   venueId: "v3", city: "İstanbul", district: "Ataşehir",   date: demoDate(0), off: 0, time: "20:30", missing: 2, position: "Fark Etmez", price: 85,  dist: 4.0 },
    { id: "m4",  teamId: "t12", team: "Moda United",         venue: "Moda Sahil Saha",      venueId: "v4", city: "İstanbul", district: "Kadıköy",    date: demoDate(0), off: 0, time: "23:00", missing: 1, position: "Kanat",      price: 100, dist: 2.1 },
    { id: "m5",  teamId: "t3",  team: "Çankaya Şimşekleri",  venue: "Başkent Spor Park",    venueId: "v5", city: "Ankara",   district: "Çankaya",    date: demoDate(1), off: 1, time: "20:00", missing: 3, position: "Forvet",     price: 80,  dist: 3.3 },
    { id: "m6",  teamId: "t4",  team: "Bornova Alevleri",    venue: "Ege Arena",            venueId: "v6", city: "İzmir",    district: "Bornova",    date: demoDate(1), off: 1, time: "21:30", missing: 2, position: "Defans",     price: 75,  dist: 5.6 },
    { id: "m7",  teamId: "t10", team: "Pendik Fırtınası",    venue: "Sahil Spor Kompleksi", venueId: "v3", city: "İstanbul", district: "Pendik",     date: demoDate(1), off: 1, time: "22:30", missing: 2, position: "Kaleci",     price: 95,  dist: 14.8 },
    { id: "m8",  teamId: "t6",  team: "Nilüfer Yıldızları",  venue: "Yeşil Vadi Saha",      venueId: "v6", city: "Bursa",    district: "Nilüfer",    date: demoDate(2), off: 2, time: "20:30", missing: 1, position: "Kanat",      price: 70,  dist: 2.9 },
    { id: "m9",  teamId: "t7",  team: "Muratpaşa Panterleri",venue: "Falez Halı Saha",      venueId: "v5", city: "Antalya",  district: "Muratpaşa",  date: demoDate(2), off: 2, time: "22:00", missing: 2, position: "Orta Saha",  price: 80,  dist: 6.2 },
    { id: "m10", teamId: "t8",  team: "Keçiören Kurtları",   venue: "Anadolu Spor Tesisi",  venueId: "v5", city: "Ankara",   district: "Keçiören",   date: demoDate(2), off: 2, time: "21:00", missing: 1, position: "Defans",     price: 75,  dist: 7.8 },
    { id: "m11", teamId: "t9",  team: "Karşıyaka Marina FC", venue: "Marina Arena",         venueId: "v6", city: "İzmir",    district: "Karşıyaka",  date: demoDate(3), off: 3, time: "20:00", missing: 3, position: "Forvet",     price: 90,  dist: 4.4 },
    { id: "m12", teamId: "t11", team: "Seyhan Akrepleri",    venue: "Çukurova Halı Saha",   venueId: "v5", city: "Adana",    district: "Seyhan",     date: demoDate(4), off: 4, time: "21:00", missing: 5, position: "Fark Etmez", price: 65,  dist: 3.1 },
    { id: "m13", teamId: "t13", team: "Selçuklu Sultanları", venue: "Mevlana Spor Park",    venueId: "v5", city: "Konya",    district: "Selçuklu",   date: demoDate(5), off: 5, time: "19:30", missing: 2, position: "Orta Saha",  price: 60,  dist: 5.0 },
    { id: "m14", teamId: "t14", team: "Ortahisar Karadeniz", venue: "Boztepe Arena",        venueId: "v6", city: "Trabzon",  district: "Ortahisar",  date: demoDate(5), off: 5, time: "21:00", missing: 3, position: "Defans",     price: 70,  dist: 8.9 },
    { id: "m15", teamId: "t15", team: "Bağcılar Aslanları",  venue: "Aslan Park Tesisleri", venueId: "v1", city: "İstanbul", district: "Bağcılar",   date: demoDate(6), off: 6, time: "22:30", missing: 2, position: "Forvet",     price: 85,  dist: 11.3 }
  ],

  goalkeepers: [
    { id: "g1",  name: "Burak Şahin",   trust: 4.9, matches: 142, cs: 58, fee: 300, city: "İstanbul", available: true,  today: true,  online: true,  verified: true,  last: "Şu an aktif" },
    { id: "g2",  name: "Emirhan Koç",   trust: 4.8, matches: 118, cs: 44, fee: 280, city: "İstanbul", available: true,  today: true,  online: true,  verified: true,  last: "Şu an aktif" },
    { id: "g3",  name: "Serkan Aydın",  trust: 4.7, matches: 96,  cs: 39, fee: 250, city: "Ankara",   available: false, today: false, online: false, verified: false, last: "2 saat önce" },
    { id: "g4",  name: "Umut Karaca",   trust: 4.6, matches: 87,  cs: 31, fee: 240, city: "İzmir",    available: true,  today: false, online: true,  verified: false, last: "Şu an aktif" },
    { id: "g5",  name: "Yasin Demirel", trust: 4.5, matches: 75,  cs: 28, fee: 220, city: "İstanbul", available: true,  today: true,  online: false, verified: false, last: "30 dk önce" },
    { id: "g6",  name: "Halil Öztürk",  trust: 4.5, matches: 68,  cs: 24, fee: 200, city: "Bursa",    available: false, today: false, online: false, verified: false, last: "Dün" },
    { id: "g7",  name: "Kaan Yılmazer", trust: 4.4, matches: 59,  cs: 19, fee: 200, city: "Antalya",  available: true,  today: true,  online: true,  verified: false, last: "Şu an aktif" },
    { id: "g8",  name: "Doruk Erten",   trust: 4.3, matches: 51,  cs: 17, fee: 180, city: "Ankara",   available: true,  today: false, online: false, verified: false, last: "1 saat önce" },
    { id: "g9",  name: "Alper Güneş",   trust: 4.2, matches: 44,  cs: 14, fee: 170, city: "İzmir",    available: true,  today: true,  online: false, verified: false, last: "3 saat önce" },
    { id: "g10", name: "Mert Kaplan",   trust: 4.0, matches: 32,  cs: 9,  fee: 150, city: "Adana",    available: false, today: false, online: false, verified: false, last: "2 gün önce" }
  ],

  players: [
    { id: "p1",  name: "Emre Yıldırım", pos: "Forvet",    city: "İstanbul", ovr: 82, matches: 47, g: 31, a: 18, w: 29, wg: 4, wa: 2, foot: "Sağ", h: 178, wt: 74, trust: 4.8, online: true,  last: "Şu an aktif",  premium: true,  verified: true,
      about: "Ceza sahası içinde bitiriciyim. Haftada en az 2 maç yaparım, takım oyununa önem veririm." },
    { id: "p2",  name: "Arda Çelik",    pos: "Orta Saha", city: "İstanbul", ovr: 79, matches: 63, g: 12, a: 34, w: 38, wg: 1, wa: 5, foot: "Sol", h: 175, wt: 70, trust: 4.9, online: true,  last: "Şu an aktif",  premium: false, verified: true,
      about: "Oyun kurucuyum, pas severim. Asist benim işim." },
    { id: "p3",  name: "Mehmet Duran",  pos: "Defans",    city: "Ankara",   ovr: 76, matches: 88, g: 4,  a: 6,  w: 51, wg: 0, wa: 1, foot: "Sağ", h: 185, wt: 84, trust: 4.7, online: false, last: "1 saat önce",  premium: false, verified: false,
      about: "Stoper. Hava toplarında güçlüyüm, sert ama temiz oynarım." },
    { id: "p4",  name: "Can Aksoy",     pos: "Kanat",     city: "İzmir",    ovr: 81, matches: 52, g: 19, a: 22, w: 30, wg: 3, wa: 3, foot: "Sol", h: 172, wt: 66, trust: 4.6, online: true,  last: "Şu an aktif",  premium: true,  verified: false,
      about: "Sol kanatta hız ve çalım. Orta kalitem yüksek." },
    { id: "p5",  name: "Baran Tekin",   pos: "Forvet",    city: "İstanbul", ovr: 77, matches: 41, g: 24, a: 9,  w: 22, wg: 2, wa: 0, foot: "Sağ", h: 180, wt: 78, trust: 4.4, online: false, last: "45 dk önce",   premium: false, verified: false,
      about: "Gol kokusu alırım. Fizik gücüme güvenirim." },
    { id: "p6",  name: "Onur Sezer",    pos: "Orta Saha", city: "Bursa",    ovr: 74, matches: 66, g: 9,  a: 21, w: 35, wg: 0, wa: 2, foot: "Sağ", h: 176, wt: 72, trust: 4.8, online: false, last: "2 saat önce",  premium: false, verified: false,
      about: "Box-to-box orta saha. 90 dakika koşarım." },
    { id: "p7",  name: "Efe Karadağ",   pos: "Defans",    city: "İstanbul", ovr: 72, matches: 35, g: 2,  a: 3,  w: 19, wg: 0, wa: 0, foot: "Sağ", h: 183, wt: 80, trust: 4.5, online: false, last: "Dün",          premium: false, verified: false,
      about: "Genç ve hırslı stoper. Gelişmeye açığım." },
    { id: "p8",  name: "Tolga Yaman",   pos: "Kaleci",    city: "Ankara",   ovr: 78, matches: 71, g: 0,  a: 2,  w: 40, wg: 0, wa: 0, foot: "Sağ", h: 188, wt: 85, trust: 4.9, online: true,  last: "Şu an aktif",  premium: false, verified: true,
      about: "Refleks kalecisiyim. Penaltı kurtarmak hobim." },
    { id: "p9",  name: "Berkay Uslu",   pos: "Kanat",     city: "Antalya",  ovr: 75, matches: 44, g: 14, a: 16, w: 24, wg: 2, wa: 1, foot: "Sağ", h: 174, wt: 69, trust: 4.3, online: false, last: "3 saat önce",  premium: false, verified: false,
      about: "Sağ kanat, bol depar. Antalya'nın en hızlısıyım derler." },
    { id: "p10", name: "Deniz Polat",   pos: "Forvet",    city: "İzmir",    ovr: 80, matches: 58, g: 36, a: 12, w: 33, wg: 5, wa: 1, foot: "Sol", h: 181, wt: 76, trust: 4.7, online: true,  last: "Şu an aktif",  premium: false, verified: true,
      about: "Sol ayaklı santrafor. Bu sezon 36 golüm var." },
    { id: "p11", name: "Kerem Aslan",   pos: "Orta Saha", city: "İstanbul", ovr: 83, matches: 92, g: 22, a: 41, w: 55, wg: 2, wa: 4, foot: "Sağ", h: 177, wt: 73, trust: 5.0, online: true,  last: "Şu an aktif",  premium: true,  verified: true,
      about: "Platformun en tecrübeli oyuncularından. 92 maç, 41 asist. Oyunu okurum." },
    { id: "p12", name: "Furkan Ateş",   pos: "Defans",    city: "Adana",    ovr: 71, matches: 29, g: 1,  a: 2,  w: 14, wg: 0, wa: 0, foot: "Sol", h: 182, wt: 79, trust: 4.2, online: false, last: "5 saat önce",  premium: false, verified: false,
      about: "Sol bek. Bindirmeyi severim." },
    { id: "p13", name: "Yiğit Kurt",    pos: "Kanat",     city: "İstanbul", ovr: 76, matches: 49, g: 15, a: 13, w: 27, wg: 1, wa: 2, foot: "Sağ", h: 173, wt: 68, trust: 4.6, online: false, last: "1 gün önce",   premium: false, verified: false,
      about: "İki kanadı da oynarım. Duran toplarda iyiyim." },
    { id: "p14", name: "Selim Erdem",   pos: "Forvet",    city: "Konya",    ovr: 73, matches: 38, g: 18, a: 7,  w: 20, wg: 1, wa: 0, foot: "Sağ", h: 179, wt: 77, trust: 4.4, online: false, last: "4 saat önce",  premium: false, verified: false,
      about: "Konya'nın golcüsü. Kafa golü spesiyalim." },
    { id: "p15", name: "Oğuz Şen",      pos: "Orta Saha", city: "Trabzon",  ovr: 77, matches: 55, g: 11, a: 19, w: 31, wg: 1, wa: 3, foot: "Sağ", h: 175, wt: 71, trust: 4.7, online: true,  last: "Şu an aktif",  premium: false, verified: false,
      about: "Karadeniz fırtınası. Uzaktan şut denerim, bazen girer." },
    { id: "p16", name: "Batuhan Ilgaz", pos: "Defans",    city: "İstanbul", ovr: 74, matches: 61, g: 3,  a: 5,  w: 34, wg: 0, wa: 0, foot: "Sağ", h: 186, wt: 86, trust: 4.8, online: false, last: "2 saat önce",  premium: false, verified: false,
      about: "Lider stoper. Savunmayı organize ederim." },
    { id: "p17", name: "Cem Toprak",    pos: "Kaleci",    city: "İzmir",    ovr: 75, matches: 47, g: 0,  a: 1,  w: 26, wg: 0, wa: 0, foot: "Sol", h: 190, wt: 88, trust: 4.5, online: false, last: "6 saat önce",  premium: false, verified: false,
      about: "Uzun boylu, ayağı iyi kaleci. Oyun kurulumuna katkı veririm." },
    { id: "p18", name: "Alp Doğan",     pos: "Kanat",     city: "Ankara",   ovr: 72, matches: 33, g: 8,  a: 11, w: 17, wg: 0, wa: 1, foot: "Sol", h: 171, wt: 65, trust: 4.3, online: false, last: "Dün",          premium: false, verified: false,
      about: "Çevik kanat oyuncusu. Bire birde etkiliyim." },
    { id: "p19", name: "Umutcan Barış", pos: "Forvet",    city: "Bursa",    ovr: 78, matches: 50, g: 27, a: 10, w: 28, wg: 3, wa: 1, foot: "Sağ", h: 182, wt: 79, trust: 4.6, online: true,  last: "Şu an aktif",  premium: false, verified: false,
      about: "Bursa'nın gol makinesi. Sol-sağ fark etmez, bitiririm." },
    { id: "p20", name: "Hakan Çetin",   pos: "Orta Saha", city: "İstanbul", ovr: 81, matches: 74, g: 16, a: 29, w: 43, wg: 2, wa: 3, foot: "Sağ", h: 178, wt: 75, trust: 4.9, online: false, last: "30 dk önce",   premium: true,  verified: false,
      about: "10 numara. Son pası ben atarım." }
  ],

  venues: [
    { id: "v1", name: "Yıldız Arena",         city: "İstanbul", district: "Kadıköy",   rating: 4.8, hourly: 1400, phone: "0216 555 01 01", dist: 1.2,  photo: "🏟️", grad: ["#1d3b2a", "#0e1f16"],
      amen: { shower: true,  cafe: true,  parking: true,  lights: true, turf: "Yeni nesil suni çim" },
      desc: "Kadıköy'ün en modern tesisi. FIFA onaylı zemin, tribün ve profesyonel aydınlatma." },
    { id: "v2", name: "Vadi Halı Saha",       city: "İstanbul", district: "Beşiktaş",  rating: 4.6, hourly: 1600, phone: "0212 555 02 02", dist: 8.4,  photo: "⛳", grad: ["#243b55", "#141e30"],
      amen: { shower: true,  cafe: true,  parking: false, lights: true, turf: "Suni çim (2023)" },
      desc: "Vadi manzaralı, kapalı tribünlü premium saha. Duş ve soyunma odaları sıcak sulu." },
    { id: "v3", name: "Gol Park Tesisleri",   city: "İstanbul", district: "Ataşehir",  rating: 4.4, hourly: 1200, phone: "0216 555 03 03", dist: 4.0,  photo: "🥅", grad: ["#3a2a1d", "#1f160e"],
      amen: { shower: true,  cafe: false, parking: true,  lights: true, turf: "Suni çim" },
      desc: "Ataşehir'in merkezi tesisi. 3 saha yan yana, geniş otopark." },
    { id: "v4", name: "Moda Sahil Saha",      city: "İstanbul", district: "Kadıköy",   rating: 4.7, hourly: 1500, phone: "0216 555 04 04", dist: 2.1,  photo: "🌊", grad: ["#1d2b3b", "#0e161f"],
      amen: { shower: false, cafe: true,  parking: false, lights: true, turf: "Hibrit çim" },
      desc: "Deniz kenarında maç yapmak isteyenlerin adresi. Gün batımı maçları efsanedir." },
    { id: "v5", name: "Başkent Spor Park",    city: "Ankara",   district: "Çankaya",   rating: 4.5, hourly: 1000, phone: "0312 555 05 05", dist: 3.3,  photo: "🏆", grad: ["#2d1d3b", "#160e1f"],
      amen: { shower: true,  cafe: true,  parking: true,  lights: true, turf: "Suni çim (2024)" },
      desc: "Ankara'nın en büyük halı saha kompleksi. 5 saha, kafeterya ve fitness alanı." },
    { id: "v6", name: "Ege Arena",            city: "İzmir",    district: "Bornova",   rating: 4.3, hourly: 950,  phone: "0232 555 06 06", dist: 5.6,  photo: "☀️", grad: ["#3b331d", "#1f1b0e"],
      amen: { shower: true,  cafe: false, parking: true,  lights: true, turf: "Suni çim" },
      desc: "Bornova'nın uygun fiyatlı, bakımlı sahası. Öğrenci dostu fiyatlar." }
  ],

  tournaments: [
    { id: "tr1", name: "İstanbul Yaz Kupası",       city: "İstanbul", startsAt: demoISO(12), teams: 32, prize: "50.000₺ + Kupa", format: "Grup + Eleme", venue: "Yıldız Arena", status: "soon" },
    { id: "tr2", name: "Anadolu Şampiyonlar Ligi",  city: "Ankara",   startsAt: demoISO(23), teams: 16, prize: "25.000₺ + Kupa", format: "Tek Eleme",    venue: "Başkent Spor Park", status: "soon" },
    { id: "tr3", name: "Ege Sahil Turnuvası",       city: "İzmir",    startsAt: demoISO(37), teams: 24, prize: "30.000₺ + Kupa", format: "Grup + Eleme", venue: "Ege Arena", status: "soon" }
  ],

  listings: [
    { id: "l1", position: "Kaleci",     date: demoDate(0), time: "21:00", city: "İstanbul", count: 1, note: "Vadi Halı Saha'da eksiğimiz var, seviye orta.", author: "Beşiktaş Boğaları" },
    { id: "l2", position: "Forvet",     date: demoDate(1), time: "20:00", city: "Ankara",   count: 2, note: "Hızlı ve bitirici forvet arıyoruz.",            author: "Çankaya Şimşekleri" },
    { id: "l3", position: "Defans",     date: demoDate(1), time: "21:30", city: "İzmir",    count: 1, note: "Stoper eksik, fizikli oyuncu tercihimiz.",       author: "Bornova Alevleri" },
    { id: "l4", position: "Orta Saha",  date: demoDate(2), time: "22:00", city: "İstanbul", count: 2, note: "Pas oyunu seven orta saha lazım.",               author: "Moda United" },
    { id: "l5", position: "Fark Etmez", date: demoDate(3), time: "19:00", city: "Bursa",    count: 3, note: "Dostluk maçı, herkes gelebilir.",                author: "Nilüfer Yıldızları" },
    { id: "l6", position: "Kanat",      date: demoDate(4), time: "20:30", city: "Antalya",  count: 1, note: "Sol kanat için hızlı oyuncu arıyoruz.",          author: "Muratpaşa Panterleri" }
  ],

  notifications: [
    { id: "n1", type: "success", text: "Takımın seni kabul etti: Kadıköy Kartalları 🎉",          time: "5 dk önce",   unread: true },
    { id: "n2", type: "success", text: "Kaleci rezervasyonun onaylandı: Burak Şahin 🧤",           time: "1 saat önce", unread: true },
    { id: "n3", type: "warn",    text: "Bugünkü maçına 2 saat kaldı! Yıldız Arena, 21:00 ⏰",      time: "2 saat önce", unread: true },
    { id: "n4", type: "info",    text: "Yeni maç ilanı: Ataşehir'de 2 oyuncu aranıyor (20:30)",    time: "3 saat önce", unread: false },
    { id: "n5", type: "success", text: "Moda United maç sonucu girdi: 7-5 kazandınız! +3 puan",    time: "Dün",         unread: false },
    { id: "n6", type: "info",    text: "Kerem Aslan seni favorilerine ekledi ⭐",                  time: "Dün",         unread: false },
    { id: "n7", type: "warn",    text: "Güven puanın 4.8'e yükseldi — dakikliğin ödüllendirildi",  time: "2 gün önce",  unread: false },
    { id: "n8", type: "info",    text: "İstanbul Yaz Kupası kayıtları yakında açılıyor 🏆",        time: "3 gün önce",  unread: false }
  ],

  chats: [
    { id: "c1", type: "team", name: "Kadıköy Kartalları", logo: "🦅", color: "#2ECC71", unread: 3, last: "Kaleci ayarlandı, 21:00'de sahadayız 🧤", time: "14:32",
      messages: [
        { me: false, who: "Kerem Aslan",  text: "Akşamki maç için herkes tamam mı?",            time: "13:05" },
        { me: false, who: "Arda Çelik",   text: "Ben varım. Kaleci durumu ne oldu?",             time: "13:12" },
        { me: true,  who: "Sen",          text: "Burak Şahin'i rezerve ettim, onaylandı ✅",     time: "13:20" },
        { me: false, who: "Kerem Aslan",  text: "Efsanesin 🔥",                                  time: "13:21" },
        { me: false, who: "Arda Çelik",   text: "Kaleci ayarlandı, 21:00'de sahadayız 🧤",       time: "14:32" }
      ] },
    { id: "c2", type: "dm", name: "Burak Şahin", unread: 1, last: "20:45'te sahada olurum, sorun yok 👍", time: "12:10",
      messages: [
        { me: true,  who: "Sen",         text: "Selam, bu akşam 21:00 Yıldız Arena maçı için rezervasyon yaptım.", time: "11:55" },
        { me: false, who: "Burak Şahin", text: "Selam! Gördüm, onayladım. Saha zemini nasıl?",                     time: "12:02" },
        { me: true,  who: "Sen",         text: "Yeni nesil çim, çok iyi. Eldivenini getir yeter 😄",               time: "12:05" },
        { me: false, who: "Burak Şahin", text: "20:45'te sahada olurum, sorun yok 👍",                             time: "12:10" }
      ] },
    { id: "c3", type: "team", name: "Moda United", logo: "🎯", color: "#16A085", unread: 0, last: "Cuma maçı için oylama açtım", time: "Dün",
      messages: [
        { me: false, who: "Hakan Çetin", text: "Cuma maçı için oylama açtım", time: "Dün" }
      ] },
    { id: "c4", type: "dm", name: "Kerem Aslan", unread: 0, last: "O maçtaki asist harikaydı 👏", time: "Salı",
      messages: [
        { me: false, who: "Kerem Aslan", text: "O maçtaki asist harikaydı 👏", time: "Salı" },
        { me: true,  who: "Sen",         text: "Sağol usta, senden öğrendik 😄", time: "Salı" }
      ] }
  ],

  user: {
    id: "p1",
    name: "Emre Yıldırım",
    city: "İstanbul",
    position: "Forvet",
    memberSince: "2024",
    foot: "Sağ",
    height: 178,
    weight: 74,
    trust: 4.8,
    premium: true,
    verified: true,
    about: "Ceza sahası içinde bitiriciyim. Haftada en az 2 maç yaparım, takım oyununa önem veririm.",
    stats: { matches: 47, goals: 31, assists: 18, wins: 29 },
    trustDetail: { attendance: 96, punctuality: 94, fairplay: 4.9, cancels: 1 },
    card: { overall: 82, pace: 86, shooting: 84, passing: 78, stamina: 80, defense: 56, physical: 74 },
    teams: ["Kadıköy Kartalları", "Moda United"]
  },

  cities:    ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Trabzon"],
  positions: ["Kaleci", "Defans", "Stoper", "Orta Saha", "Kanat", "Forvet", "Fark Etmez"]
};

(function enrichDB() {
  const P = DB.players;

  const RESULTS = [[7, 5], [4, 6], [8, 3], [5, 5], [6, 4], [3, 7], [9, 6]];
  DB.teams.forEach((t, i) => {
    t.squad = [0, 1, 2, 3, 4].map((k) => P[(i * 3 + k) % P.length].id);
    t.recent = [0, 1, 2, 3].map((k) => {
      const opp = DB.teams[(i + k + 1) % DB.teams.length];
      const [gf, ga] = RESULTS[(i + k) % RESULTS.length];
      return { opp: opp.name, oppLogo: opp.logo, gf, ga };
    });
  });

  const COMMENTS = [
    "Zemin çok iyiydi geçen hafta, tavsiye ederim 👍",
    "Kaç kişi eksik kaldı? Arkadaşımı da getirebilirim.",
    "Seviye nasıl? Orta üstü müdür?",
    "Otopark durumu nasıl oralarda?"
  ];
  DB.matches.forEach((m, i) => {
    const team = DB.teams.find((t) => t.id === m.teamId);
    m.squad = team ? team.squad.slice(0, 7 - m.missing > 4 ? 5 : 4) : [];
    m.comments = [0, 1].map((k) => {
      const author = P[(i * 2 + k + 3) % P.length];
      return { who: author.name, text: COMMENTS[(i + k) % COMMENTS.length], time: `${k + 1} saat önce` };
    });
  });
})();
