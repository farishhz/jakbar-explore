export const kulinerData = [
  {
    id: 1,
    nama: "Kwetiau Sapi Mangga Besar",
    lokasi: "Tanjung Duren, Jakarta Barat",
    alamat: "Jl. Mangga Besar Raya No.45, Jakarta Barat",
    jamBuka: "17.00 – 23.00",
    harga: "Rp 28.000 - Rp 45.000",
    rating: 4.6,
    kategori: ["Tradisional", "Murah"],
    menuFavorit: "Kwetiau goreng sapi",
    foto: "https://images.unsplash.com/photo-1604908177224-2d5b9a6a3c9b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1",
    mapsEmbed: "https://www.google.com/maps?q=-6.1701,106.8086&z=16&output=embed",
    reviews: [
      { user: "Rafi", rating: 4.7, komentar: "Tempatnya nyaman banget buat nongkrong sore." }
    ]
  },
  {
    id: 2,
    nama: "Sate Taichan Kebon Jeruk",
    lokasi: "Kebon Jeruk, Jakarta Barat",
    alamat: "Jl. Kebon Jeruk Raya No.10",
    jamBuka: "18.00 – 00.00",
    harga: "Rp 18.000 - Rp 32.000",
    rating: 4.4,
    kategori: ["Street Food", "Murah"],
    menuFavorit: "Sate Taichan Original",
    foto: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2",
    mapsEmbed: "https://www.google.com/maps?q=-6.1963,106.8001&z=16&output=embed",
    reviews: [{ user: "Siti", rating: 4.5, komentar: "Pedasnya pas, recommended!" }]
  },
  {
    id: 3,
    nama: "Kopi & Nongkrong Senayan",
    lokasi: "Grogol, Jakarta Barat",
    alamat: "Jl. Panjang No.88",
    jamBuka: "07.00 – 22.00",
    harga: "Rp 22.000 - Rp 65.000",
    rating: 4.8,
    kategori: ["Cafe & Nongkrong"],
    menuFavorit: "Vanilla Latte",
    foto: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3",
    mapsEmbed: "https://www.google.com/maps?q=-6.1800,106.7883&z=16&output=embed",
    reviews: [{ user: "Dina", rating: 4.9, komentar: "Cozy dan WiFi kenceng." }]
  },
  {
    id: 4,
    nama: "Seafood Ancol Express",
    lokasi: "Ancol, Jakarta Utara",
    alamat: "Jl. Lodan No.5",
    jamBuka: "11.00 – 22.00",
    harga: "Rp 85.000 - Rp 180.000",
    rating: 4.2,
    kategori: ["Seafood"],
    menuFavorit: "Kepiting Saus Padang",
    foto: "https://images.unsplash.com/photo-1541542684-4f8b1e6f2b0e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=4",
    mapsEmbed: "https://www.google.com/maps?q=-6.1249,106.8310&z=15&output=embed",
    reviews: [{ user: "Budi", rating: 4.3, komentar: "Ikan segar dan view bagus." }]
  },
  {
    id: 5,
    nama: "Martabak Manis Puri",
    lokasi: "Puri Indah, Jakarta Barat",
    alamat: "Jl. Puri Indah Raya No.2",
    jamBuka: "15.00 – 02.00",
    harga: "Rp 22.000 - Rp 55.000",
    rating: 4.5,
    kategori: ["Street Food", "Tradisional"],
    menuFavorit: "Martabak coklat keju",
    foto: "https://images.unsplash.com/photo-1604908177110-2d5b9a6a3c9b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=5",
    mapsEmbed: "https://www.google.com/maps?q=-6.1730,106.7385&z=16&output=embed",
    reviews: [{ user: "Aulia", rating: 4.6, komentar: "Manisnya pas banget." }]
  }
];

export type KulinerItem = typeof kulinerData[number];


// tambahan data supaya tidak cuma 5
const more = [
  {
    id: 6,
    nama: "Nasi Uduk Ibu Sari",
    lokasi: "Grogol, Jakarta Barat",
    alamat: "Jl. Tomang Raya No.9",
    jamBuka: "06.00 – 20.00",
    harga: "Rp 12.000 - Rp 28.000",
    rating: 4.3,
    kategori: ["Tradisional", "Murah"],
    menuFavorit: "Nasi uduk lengkap",
    foto: "https://images.unsplash.com/photo-1601050690590-8b6b1d4d2c9f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=6",
    mapsEmbed: "https://www.google.com/maps?q=-6.1705,106.7940&z=16&output=embed",
    reviews: [{ user: "Rina", rating: 4.2, komentar: "Warm and comforting." }]
  },
  {
    id: 7,
    nama: "Bakso Pak Slamet",
    lokasi: "Taman Sari, Jakarta Barat",
    alamat: "Jl. Taman Sari No.6",
    jamBuka: "10.00 – 22.00",
    harga: "Rp 22.000 - Rp 45.000",
    rating: 4.5,
    kategori: ["Street Food", "Murah"],
    menuFavorit: "Bakso urat",
    foto: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=7",
    mapsEmbed: "https://www.google.com/maps?q=-6.1400,106.8000&z=16&output=embed",
    reviews: [{ user: "Tono", rating: 4.6, komentar: "Bumbunya nendang." }]
  },
  {
    id: 8,
    nama: "Ramen Kita",
    lokasi: "Palmerah, Jakarta Barat",
    alamat: "Jl. Palmerah Barat No.21",
    jamBuka: "11.00 – 23.00",
    harga: "Rp 75.000 - Rp 95.000",
    rating: 4.7,
    kategori: ["Cafe & Nongkrong"],
    menuFavorit: "Tonkotsu Ramen",
    foto: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=8",
    mapsEmbed: "https://www.google.com/maps?q=-6.1915,106.7902&z=16&output=embed",
    reviews: [{ user: "Iwan", rating: 4.8, komentar: "Brothnya kaya rasa." }]
  },
  {
    id: 9,
    nama: "Pecel Lele Pak Joko",
    lokasi: "Kembangan, Jakarta Barat",
    alamat: "Jl. Kembangan Raya No.11",
    jamBuka: "16.00 – 23.00",
    harga: "Rp 15.000 - Rp 35.000",
    rating: 4.1,
    kategori: ["Street Food", "Murah"],
    menuFavorit: "Pecel lele sambal terasi",
    foto: "https://images.unsplash.com/photo-1589308078050-969e2a3f7b0b?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=9",
    mapsEmbed: "https://www.google.com/maps?q=-6.1810,106.7400&z=16&output=embed",
    reviews: [{ user: "Nita", rating: 4.0, komentar: "Sambalnya oke." }]
  },
  {
    id: 10,
    nama: "Pizzeria Senayan",
    lokasi: "Senayan, Jakarta Barat",
    alamat: "Jl. Asia Afrika No.3",
    jamBuka: "12.00 – 23.00",
    harga: "Rp 110.000 - Rp 220.000",
    rating: 4.6,
    kategori: ["Cafe & Nongkrong"],
    menuFavorit: "Margherita Pizza",
    foto: "https://images.unsplash.com/photo-1548365328-9d7b6d4a4e86?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=10",
    mapsEmbed: "https://www.google.com/maps?q=-6.2010,106.7970&z=16&output=embed",
    reviews: [{ user: "Riska", rating: 4.7, komentar: "Pizza autentik." }]
  },
  {
    id: 11,
    nama: "Geprek Mantap",
    lokasi: "Kebayoran, Jakarta Selatan",
    alamat: "Jl. Kebayoran Lama No.7",
    jamBuka: "10.00 – 01.00",
    harga: "Rp 21.000 - Rp 42.000",
    rating: 4.4,
    kategori: ["Street Food"],
    menuFavorit: "Ayam geprek level 5",
    foto: "https://images.unsplash.com/photo-1601050690586-2d5b1d4d2c9f?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=11",
    mapsEmbed: "https://www.google.com/maps?q=-6.2210,106.7820&z=16&output=embed",
    reviews: [{ user: "Rudy", rating: 4.5, komentar: "Sambal mantap." }]
  },
  {
    id: 12,
    nama: "Sushi Corner",
    lokasi: "Pluit, Jakarta Utara",
    alamat: "Jl. Pluit Selatan No.20",
    jamBuka: "11.00 – 22.00",
    harga: "Rp 95.000 - Rp 350.000",
    rating: 4.6,
    kategori: ["Seafood", "Cafe & Nongkrong"],
    menuFavorit: "Salmon Nigiri",
    foto: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=12",
    mapsEmbed: "https://www.google.com/maps?q=-6.1300,106.7860&z=16&output=embed",
    reviews: [{ user: "Maya", rating: 4.7, komentar: "Ikan segar dan presentasi cantik." }]
  }
];

export const kulinerDataExtended = [...kulinerData, ...more];

