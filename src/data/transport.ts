export const transports = [
  {
    id: 'transjakarta',
    title: 'TransJakarta',
    icon: '🚌',
    desc: 'Turun di Halte Glodok, jalan kaki ±5 menit',
    cost: 'Rp 3.500',
    time: '30–45 menit',
    mapsEmbed: 'https://www.google.com/maps?q=Halte+Glodok&output=embed',
    mapsUrl: 'https://www.google.com/maps/search/Halte+Glodok',
    steps: [
      'Naik TransJakarta menuju Halte Glodok',
      'Turun di Halte Glodok',
      'Jalan kaki ±5 menit ke kawasan Pecinan'
    ]
  },
  {
    id: 'krl',
    title: 'KRL Commuter Line',
    icon: '🚆',
    desc: 'Turun di Stasiun Jakarta Kota',
    cost: '± Rp 5.000',
    time: '35–50 menit',
    mapsEmbed: 'https://www.google.com/maps?q=Stasiun+Jakarta+Kota&output=embed',
    mapsUrl: 'https://www.google.com/maps/search/Stasiun+Jakarta+Kota',
    steps: [
      'Naik KRL tujuan Jakarta Kota',
      'Turun di Stasiun Jakarta Kota',
      'Jalan kaki ±10 menit ke Pecinan Glodok'
    ]
  },
  {
    id: 'motor',
    title: 'Motor / Ojol',
    icon: '🏍️',
    desc: 'Langsung ke area Pecinan Glodok',
    cost: '± Rp 15.000–25.000',
    time: '20–30 menit',
    mapsEmbed: 'https://www.google.com/maps?q=Pecinan+Glodok&output=embed',
    mapsUrl: 'https://www.google.com/maps/search/Pecinan+Glodok',
    steps: [
      'Masukkan tujuan Pecinan Glodok',
      'Ikuti rute tercepat ke lokasi'
    ]
  },
  {
    id: 'walk',
    title: 'Jalan Kaki',
    icon: '🚶',
    desc: 'Cocok kalau sudah di sekitar Kota Tua',
    cost: 'Gratis',
    time: '10–15 menit',
    mapsEmbed: 'https://www.google.com/maps?q=Pecinan+Glodok&output=embed',
    mapsUrl: 'https://www.google.com/maps/search/Pecinan+Glodok',
    steps: ['Ikuti petunjuk Google Maps']
  }
]
