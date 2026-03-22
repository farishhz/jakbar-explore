// Game Data - Jakbar Adventure Mode

export interface Zone {
  id: string
  name: string
  emoji: string
  description: string
  color: string
}

export interface Question {
  id: string
  zoneId: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface Badge {
  id: string
  name: string
  emoji: string
  description: string
  requirement: string // e.g., "complete_zone_kota_tua", "score_100", "complete_all"
}

// Zones untuk Adventure Mode
export const ZONES: Zone[] = [
  {
    id: 'kota-tua',
    name: 'Kota Tua',
    emoji: '🏛',
    description: 'Jelajahi warisan bersejarah Jakarta Barat',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'kuliner',
    name: 'Zona Kuliner',
    emoji: '🍜',
    description: 'Cita rasa autentik Jakarta Barat',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'taman',
    name: 'Ruang Terbuka',
    emoji: '🌳',
    description: 'Taman dan destinasi hijau',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'sejarah',
    name: 'Tempat Bersejarah',
    emoji: '🕌',
    description: 'Situs bersejarah dan budaya',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'budaya',
    name: 'Warisan Budaya',
    emoji: '🎭',
    description: 'Tradisi dan seni lokal',
    color: 'from-purple-500 to-pink-600'
  }
]

// Quiz Questions per Zone
export const QUIZ_QUESTIONS: Question[] = [
  // Kota Tua Zone
  {
    id: 'q1-kota-tua',
    zoneId: 'kota-tua',
    question: 'Kota Tua Jakarta dibangun pada masa apa?',
    options: [
      'Masa Kerajaan Sunda Kelapa',
      'Masa Penjajahan Belanda',
      'Masa Kemerdekaan',
      'Masa Modern'
    ],
    correctAnswer: 1,
    explanation: 'Kota Tua dibangun oleh pemerintah Belanda pada abad ke-17 sebagai pusat pemerintahan Batavia.'
  },
  {
    id: 'q2-kota-tua',
    zoneId: 'kota-tua',
    question: 'Berapa jumlah arsitektur bersejarah di Kota Tua yang masih terjaga?',
    options: [
      'Kurang dari 10',
      'Lebih dari 50',
      'Kurang dari 5',
      'Tidak ada yang terjaga'
    ],
    correctAnswer: 1,
    explanation: 'Kota Tua memiliki lebih dari 50 bangunan bersejarah yang masih terawat dengan baik.'
  },
  {
    id: 'q3-kota-tua',
    zoneId: 'kota-tua',
    question: 'Apa nama museum terbesar di Kota Tua?',
    options: [
      'Museum Fatahillah',
      'Museum Tekstil',
      'Museum Wayang',
      'Semua benar'
    ],
    correctAnswer: 3,
    explanation: 'Kota Tua memiliki beberapa museum terkenal termasuk Museum Fatahillah, Museum Tekstil, dan Museum Wayang.'
  },

  // Kuliner Zone
  {
    id: 'q1-kuliner',
    zoneId: 'kuliner',
    question: 'Makanan tradisional Jakarta Barat yang paling terkenal adalah?',
    options: [
      'Soto Betawi',
      'Gado-gado Premium',
      'Soto Ayam Bogor',
      'Lumpia Goreng'
    ],
    correctAnswer: 0,
    explanation: 'Soto Betawi adalah makanan khas Betawi yang terkenal khususnya di Jakarta Barat.'
  },
  {
    id: 'q2-kuliner',
    zoneId: 'kuliner',
    question: 'Pasar tradisional Blok A terkenal dengan produk apa?',
    options: [
      'Ikan segar',
      'Sayuran',
      'Buah-buahan',
      'Semua bahan makanan'
    ],
    correctAnswer: 3,
    explanation: 'Pasar Blok A adalah pasar tradisional lengkap dengan berbagai kategori bahan makanan.'
  },
  {
    id: 'q3-kuliner',
    zoneId: 'kuliner',
    question: 'Makanan ringan khas Jakarta Barat yang menggunakan terigu adalah?',
    options: [
      'Gorengan',
      'Perkedel',
      'Tahu Goreng',
      'Semua benar'
    ],
    correctAnswer: 3,
    explanation: 'Jakarta Barat memiliki berbagai gorengan tradisional yang populer di kalangan penduduk lokal.'
  },

  // Taman Zone
  {
    id: 'q1-taman',
    zoneId: 'taman',
    question: 'Taman hijau terbesar di Jakarta Barat adalah?',
    options: [
      'Taman Seribu Wisata',
      'Taman Pik 2',
      'Taman Bundaran HI',
      'Taman Remaja'
    ],
    correctAnswer: 0,
    explanation: 'Taman Seribu Wisata adalah destinasi taman terbesar dan paling lengkap di Jakarta Barat.'
  },
  {
    id: 'q2-taman',
    zoneId: 'taman',
    question: 'Aktivitas apa yang bisa dilakukan di Taman Kota Jakarta Barat?',
    options: [
      'Jogging dan bersepeda',
      'Piknik keluarga',
      'Bermain olahraga',
      'Semua aktivitas di atas'
    ],
    correctAnswer: 3,
    explanation: 'Taman-taman Jakarta Barat menyediakan berbagai fasilitas untuk aktivitas outdoor yang beragam.'
  },
  {
    id: 'q3-taman',
    zoneId: 'taman',
    question: 'Kapan adalah waktu terbaik mengunjungi taman?',
    options: [
      'Pagi hari',
      'Siang hari',
      'Sore hari',
      'Malam hari'
    ],
    correctAnswer: 0,
    explanation: 'Pagi hari adalah waktu terbaik untuk menjelajahi taman dengan udara yang segar dan pemandangan indah.'
  },

  // Sejarah Zone
  {
    id: 'q1-sejarah',
    zoneId: 'sejarah',
    question: 'Masjid tertua di Jakarta Barat adalah?',
    options: [
      'Masjid Jakarta',
      'Masjid Al-Azhar',
      'Masjid Agung',
      'Masjid Raya'
    ],
    correctAnswer: 1,
    explanation: 'Masjid Al-Azhar adalah salah satu masjid tertua dan terkenal di Jakarta Barat.'
  },
  {
    id: 'q2-sejarah',
    zoneId: 'sejarah',
    question: 'Tahun berapa Jakarta Barat resmi menjadi wilayah administratif?',
    options: [
      '1960-an',
      '1970-an',
      '1980-an',
      '1990-an'
    ],
    correctAnswer: 1,
    explanation: 'Jakarta Barat resmi menjadi wilayah administratif pada tahun 1970-an sebagai bagian dari reorganisasi Jakarta.'
  },
  {
    id: 'q3-sejarah',
    zoneId: 'sejarah',
    question: 'Situs purbakala apa saja yang ada di Jakarta Barat?',
    options: [
      'Peninggalan Kerajaan Hindu',
      'Peninggalan Kerajaan Islam',
      'Peninggalan Kolonial Belanda',
      'Semua periode sejarah'
    ],
    correctAnswer: 3,
    explanation: 'Jakarta Barat memiliki peninggalan dari berbagai periode sejarah termasuk Hindu, Islam, dan Kolonial.'
  },

  // Budaya Zone
  {
    id: 'q1-budaya',
    zoneId: 'budaya',
    question: 'Tari tradisional Betawi yang paling terkenal adalah?',
    options: [
      'Tari Japin',
      'Tari Legong',
      'Tari Kecak',
      'Tari Serimpi'
    ],
    correctAnswer: 0,
    explanation: 'Tari Japin adalah tari tradisional Betawi yang kaya akan makna dan gerakan yang indah.'
  },
  {
    id: 'q2-budaya',
    zoneId: 'budaya',
    question: 'Alat musik tradisional Betawi yang menggunakan kulit adalah?',
    options: [
      'Gambang Kromong',
      'Bonang',
      'Rebab',
      'Beduk'
    ],
    correctAnswer: 0,
    explanation: 'Gambang Kromong adalah orkestra tradisional Betawi yang terkenal dengan suara dan iramanya.'
  },
  {
    id: 'q3-budaya',
    zoneId: 'budaya',
    question: 'Festival budaya Betawi yang paling meriah adalah?',
    options: [
      'Festival Garuda',
      'Festival Seni Jakarta',
      'Jakarta Fair',
      'Semua yang benar'
    ],
    correctAnswer: 2,
    explanation: 'Jakarta Fair adalah festival tahunan yang menampilkan budaya, seni, dan tradisi Betawi dengan spektakuler.'
  }
]

// Badges - Achievement System
export const BADGES: Badge[] = [
  {
    id: 'explorer-jakbar',
    name: 'Penjelajah Jakbar',
    emoji: '🗺️',
    description: 'Buka semua zona', 
    requirement: 'complete_all_zones'
  },
  {
    id: 'master-kota-tua',
    name: 'Master Kota Tua',
    emoji: '🏛️',
    description: 'Jawab 3 soal Kota Tua dengan benar',
    requirement: 'complete_zone_kota_tua'
  },
  {
    id: 'culinary-expert',
    name: 'Ahli Kuliner',
    emoji: '🍜',
    description: 'Kuasai semua pertanyaan Zona Kuliner',
    requirement: 'complete_zone_kuliner'
  },
  {
    id: 'nature-lover',
    name: 'Pecinta Alam',
    emoji: '🌳',
    description: 'Jelajahi Ruang Terbuka dengan sempurna',
    requirement: 'complete_zone_taman'
  },
  {
    id: 'history-scholar',
    name: 'Sarjana Sejarah',
    emoji: '📚',
    description: 'Menguasai soal Tempat Bersejarah',
    requirement: 'complete_zone_sejarah'
  },
  {
    id: 'culture-enthusiast',
    name: 'Penggemar Budaya',
    emoji: '🎭',
    description: 'Ekspor di zona Warisan Budaya',
    requirement: 'complete_zone_budaya'
  },
  {
    id: 'perfect-score',
    name: 'Skor Sempurna',
    emoji: '⭐',
    description: 'Dapatkan skor 100 dalam quiz',
    requirement: 'score_100'
  },
  {
    id: 'quiz-champion',
    name: 'Juara Quiz',
    emoji: '🏆',
    description: 'Selesaikan 5 quiz dengan total skor > 400',
    requirement: 'total_score_400'
  }
]
