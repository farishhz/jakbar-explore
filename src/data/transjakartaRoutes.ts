export const transjakartaRoutes = [
  {
    id: 'langsung',
    title: '🚌 Rute Langsung',
    subtitle: 'Koridor 1',
    description: 'Naik langsung ke Halte Glodok via Koridor 1',
    corridors: ['1'],
    steps: [
      'Naik TransJakarta Koridor 1 ke arah Kalideres/Kota',
      'Turun di Halte Glodok',
      'Jalan kaki ±5 menit ke kawasan Pecinan'
    ],
    mapQuery: 'Halte+Glodok+Jakarta+Koridor+1',
    tips: [
      '⏱️ Waktu: 30-45 menit dari pusat kota',
      '💰 Biaya: Rp 3.500 (satu kali bayar)',
      '🚏 Halte Glodok berada di Jalan Pancoran',
      '🎫 Bayar di loket sebelum masuk'
    ],
    origins: ['harmoni', 'monas', 'bundaran-hi', 'lainnya']
  },
  {
    id: 'transit-harmoni',
    title: '🔄 Rute Transit Harmoni',
    subtitle: 'Koridor A→C via Harmoni',
    description: 'Dari berbagai koridor, transit di Harmoni untuk Koridor C',
    corridors: ['A', 'C'],
    steps: [
      'Naik TransJakarta dari titik asal Anda (Koridor A atau sesuai)',
      'Turun di Halte Harmoni untuk transit',
      'Pindah ke TransJakarta Koridor C menuju Glodok',
      'Turun di Halte Glodok',
      'Jalan kaki ±5 menit ke Pecinan'
    ],
    mapQuery: 'Harmoni+Jakarta+ke+Glodok',
    tips: [
      '⏱️ Waktu: 45-60 menit (termasuk transit)',
      '💰 Biaya: Rp 7.000 (transit + Koridor C)',
      '🔄 Transit gratis jika dalam 30 menit',
      '📍 Halte Harmoni adalah pusat pertemuan utama'
    ],
    origins: ['pulo-gadung', 'kalideres', 'pluit', 'lainnya']
  },
  {
    id: 'transit-blok-m',
    title: '🛣️ Rute Alternatif via Blok M',
    subtitle: 'Koridor 1 dari Selatan',
    description: 'Dari daerah Blok M dan selatan, naik Koridor 1 langsung',
    corridors: ['1'],
    steps: [
      'Dari Blok M, cari halte terdekat (Halte Blok M)',
      'Naik TransJakarta Koridor 1 arah Kota',
      'Perjalanan melewati Jalan Sudirman-Thamrin',
      'Turun di Halte Glodok',
      'Jalan kaki ±5 menit ke kawasan Pecinan'
    ],
    mapQuery: 'Blok+M+ke+Glodok+Koridor+1',
    tips: [
      '⏱️ Waktu: 35-50 menit dari Blok M',
      '💰 Biaya: Rp 3.500',
      '🚏 Halte Blok M di Jalan Sudirman, dekat Bundaran Senayan',
      '⚠️ Hindari jam sibuk pagi (6-9 pagi) & sore (17-19)'
    ],
    origins: ['blok-m', 'lainnya']
  },
  {
    id: 'dari-kota-tua',
    title: '🏛️ Rute dari Kota Tua',
    subtitle: 'Koridor 1 dari Utara',
    description: 'Dari area Kota Tua, naik Koridor 1 menuju Glodok',
    corridors: ['1'],
    steps: [
      'Dari Kota Tua, menuju halte terdekat',
      'Naik TransJakarta Koridor 1 arah Kalideres/Kota',
      'Turun langsung di Halte Glodok',
      'Jalan kaki masuk ke kawasan Pecinan Glodok'
    ],
    mapQuery: 'Kota+Tua+Jakarta+ke+Glodok',
    tips: [
      '⏱️ Waktu: 10-20 menit (sangat dekat)',
      '💰 Biaya: Rp 3.500',
      '👍 Ini adalah rute terdekat dari Kota Tua',
      '🎯 Akses langsung, tidak perlu transit'
    ],
    origins: ['kota-tua', 'lainnya']
  },
  {
    id: 'terpadu',
    title: '✨ Panduan Terpadu',
    subtitle: 'Semua Rute & Tips',
    description: 'Rangkuman lengkap semua rute ke Pecinan Glodok',
    corridors: ['1', 'A', 'C'],
    steps: [
      'Pilih lokasi awal Anda',
      'Gunakan rute yang paling sesuai (lihat tab di atas)',
      'Ikuti langkah-langkah sesuai rute pilihan',
      'Bayar tarifnya (Rp 3.500-7.000)',
      'Nikmati perjalanan ke Pecinan Glodok!'
    ],
    mapQuery: 'Pecinan+Glodok+Jakarta',
    tips: [
      '🎫 Aplikasi resmi: TransJakarta Mobile App',
      '📲 Cek jadwal & posisi bus real-time',
      '🚨 Laporkan masalah via customer service',
      '🌐 Website resmi: www.transjakarta.co.id'
    ],
    origins: ['harmoni', 'kota-tua', 'blok-m', 'pulo-gadung', 'kalideres', 'pluit', 'monas', 'bundaran-hi', 'lainnya']
  }
]

export const getRoutesByOrigin = (originId: string) => {
  if (originId === 'lainnya') {
    return transjakartaRoutes
  }
  return transjakartaRoutes.filter(route => route.origins.includes(originId))
}
