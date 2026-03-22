export const krlRoutes = [
  {
    id: 'langsung',
    title: 'Langsung ke Jakarta Kota',
    desc: 'Tanpa transit',
    lines: ['Bogor Line'],
    steps: [
      'Naik KRL Bogor Line',
      'Turun di Stasiun Jakarta Kota',
      'Jalan kaki ±10 menit ke Pecinan Glodok'
    ],
    mapQuery: 'Stasiun+Jakarta+Kota'
  },
  {
    id: 'transit-manggarai',
    title: 'Transit di Manggarai',
    desc: '1x transit',
    lines: ['Cikarang Line', 'Bogor Line'],
    steps: [
      'Naik KRL Cikarang Line',
      'Transit di Stasiun Manggarai',
      'Lanjut KRL Bogor Line tujuan Jakarta Kota',
      'Turun di Stasiun Jakarta Kota'
    ],
    mapQuery: 'Stasiun+Jakarta+Kota'
  },
  {
    id: 'transit-duri',
    title: 'Transit di Duri',
    desc: 'Via Duri',
    lines: ['Tangerang Line'],
    steps: [
      'Naik KRL Tangerang Line',
      'Turun di Stasiun Duri',
      'Lanjut KRL tujuan Jakarta Kota',
      'Turun di Stasiun Jakarta Kota'
    ],
    mapQuery: 'Stasiun+Jakarta+Kota'
  }
]

export const getKrlRoutesByOrigin = (originId: string) => {
  if (originId === 'lainnya') return krlRoutes
  const origin = require('./krlOrigins').krlOrigins.find((o: any) => o.id === originId)
  if (!origin) return krlRoutes
  return krlRoutes.filter(r => origin.routes.includes(r.id))
}
