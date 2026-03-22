'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MapPin,
  Clock,
  Star,
  Utensils,
  Camera,
  Calendar,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Heart,
  Eye,
  BookOpen,
  Footprints,
  Bus,
  Train,
  DollarSign,
  Coffee,
  ScrollText,
  Users,
  Landmark,
  Sparkles,
  Award,
  Route,
  Wallet,
  GraduationCap,
  ChevronDown,
  Home,
  Compass,
  Search,
  Sun,
  CloudSun,
  Moon,
  Newspaper
} from 'lucide-react'
import TransportList from '@/components/TransportList'
import BudgetCalculator from '@/components/BudgetCalculator'
import AdventureMode from '@/components/AdventureMode'
import AchievementShowcase from '@/components/AchievementShowcase'
import Link from 'next/link'


export default function JakartaWestTourism() {
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [adventureModeOpen, setAdventureModeOpen] = useState(false)
  const [expandedTimelineId, setExpandedTimelineId] = useState<number | null>(null)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isCarouselHovered, setIsCarouselHovered] = useState(false)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0])
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'museum-hidup', 'jejak-masa-lalu', 'peta-rasa', 'wajah-jakarta', 'panduan-jelajah', 'kamus', 'budget', 'gallery', 'contact']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-play effect and current slide tracking for Carousel
  useEffect(() => {
    if (!carouselApi) return

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap())
    }

    carouselApi.on("select", onSelect)

    // Auto-play
    const interval = setInterval(() => {
      if (!isCarouselHovered) {
        carouselApi.scrollNext()
      }
    }, 1500) // Change slide every 3 seconds

    return () => {
      carouselApi.off("select", onSelect)
      clearInterval(interval)
    }
  }, [carouselApi, isCarouselHovered])

  // Grouped navigation structure
  const navGroups = [
    {
      type: 'single' as const,
      id: 'home',
      label: 'Beranda',
      icon: <Home className="h-4 w-4" />
    },
    {
      type: 'dropdown' as const,
      label: 'Jelajahi',
      icon: <Compass className="h-4 w-4" />,
      items: [
        { id: 'museum-hidup', label: 'Museum Hidup', icon: <Landmark className="h-4 w-4" /> },
        { id: 'jejak-masa-lalu', label: 'Jejak Masa Lalu', icon: <ScrollText className="h-4 w-4" /> },
        { id: 'wajah-jakarta', label: 'Wajah Jakarta', icon: <Users className="h-4 w-4" /> },
      ]
    },
    {
      type: 'link' as const,
      label: 'Kuliner',
      icon: <Utensils className="h-4 w-4" />,
      href: '/kuliner'
    },
    {
      type: 'dropdown' as const,
      label: 'Panduan',
      icon: <Route className="h-4 w-4" />,
      items: [
        { id: 'panduan-jelajah', label: 'Panduan Jelajah', icon: <Route className="h-4 w-4" /> },
        { id: 'kamus', label: 'Kamus Budaya', icon: <BookOpen className="h-4 w-4" /> },
        { id: 'budget', label: 'Estimasi Budget', icon: <Wallet className="h-4 w-4" /> },
      ]
    },
    {
      type: 'single' as const,
      id: 'gallery',
      label: 'Galeri',
      icon: <Camera className="h-4 w-4" />
    },
    {
      type: 'link' as const,
      label: 'Berita',
      icon: <Newspaper className="h-4 w-4" />,
      href: '/berita'
    },
    {
      type: 'single' as const,
      id: 'contact',
      label: 'Kontak',
      icon: <Phone className="h-4 w-4" />
    },
  ]

  // Keep original navLinks for mobile menu (flattened)
  const navLinks = [
    { id: 'home', label: 'Beranda', icon: <Home /> },
    { id: 'museum-hidup', label: 'Museum Hidup', icon: <Landmark /> },
    { id: 'jejak-masa-lalu', label: 'Jejak Masa Lalu', icon: <ScrollText /> },
    { id: 'peta-rasa', label: 'Kuliner', icon: <Utensils />, href: '/kuliner' },
    { id: 'wajah-jakarta', label: 'Wajah Jakarta', icon: <Users /> },
    { id: 'panduan-jelajah', label: 'Panduan Jelajah', icon: <Route /> },
    { id: 'kamus', label: 'Kamus Budaya', icon: <BookOpen /> },
    { id: 'budget', label: 'Estimasi Budget', icon: <Wallet /> },
    { id: 'gallery', label: 'Galeri', icon: <Camera /> },
    { id: 'berita', label: 'Berita', icon: <Newspaper />, href: '/berita' },
    { id: 'contact', label: 'Kontak', icon: <Phone /> },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setSelectedImage(null)
  }

  // Data Timeline Sejarah
  const timelineData = [
    {
      year: '1610',
      title: 'Awal Mula',
      description: 'Pertama kali dikunjungi pedagang Tiongkok di Batavia',
      details: 'Pada masa ini, pelabuhan Sunda Kelapa mulai ramai dikunjungi oleh pedagang Tiongkok yang membawa keramik, sutra, dan teh untuk diperdagangkan dengan rempah-rempah Nusantara. Interaksi awal ini menjadi cikal bakal terbentuknya komunitas Tionghoa di Batavia.'
    },
    {
      year: '1740',
      title: 'Pembentukan Glodok',
      description: 'Kawasan Glodok resmi menjadi pemukiman warga Tionghoa',
      details: 'Setelah peristiwa Geger Pacinan, pemerintah kolonial Belanda melokalisir warga Tionghoa di luar tembok kota Batavia, tepatnya di kawasan yang sekarang dikenal sebagai Glodok. Inilah awal mula terbentuknya Pecinan (Chinatown) yang terpusat.'
    },
    {
      year: '1820',
      title: 'Masa Keemasan',
      description: 'Pusat perdagangan dan budaya Tionghoa berkembang pesat',
      details: 'Glodok tumbuh menjadi pusat ekonomi utama di Batavia. Rumah-rumah toko (ruko) bergaya arsitektur gabungan Tiongkok-Eropa mulai dibangun, dan berbagai kelenteng didirikan sebagai pusat kegiatan sosial dan spiritual masyarakat.'
    },
    {
      year: '1950',
      title: 'Pasca Kemerdekaan',
      description: 'Integrasi budaya dan munculnya kuliner fusion',
      details: 'Setelah Indonesia merdeka, terjadi proses asimilasi budaya yang lebih dalam. Kuliner peranakan seperti Lontong Cap Go Meh dan penggunaan kecap manis dalam masakan lokal semakin populer, menandakan perpaduan harmonis budaya Tionghoa dan Betawi.'
    },
    {
      year: '1970',
      title: 'Modernisasi',
      description: 'Pengembangan kawasan dan pelestarian warisan budaya',
      details: 'Pembangunan infrastruktur modern mulai masuk ke kawasan kota tua. Pasar Glodok dibangun menjadi pusat elektronik legendaris. Meskipun modernisasi terjadi, upaya pelestarian bangunan bersejarah dan tradisi leluhur tetap dipertahankan oleh komunitas lokal.'
    },
    {
      year: '2000',
      title: 'Era Wisata',
      description: 'Glodok menjadi destinasi wisata budaya internasional',
      details: 'Pemerintah menetapkan kawasan Kota Tua dan Glodok sebagai destinasi wisata unggulan. Gapura Chinatown Jakarta diresmikan, dan festival-festival budaya seperti Cap Go Meh menjadi agenda wisata tahunan yang menarik wisatawan domestik maupun mancanegara.'
    },
  ]

  // Data Arsitektur
  const architectureData = [
    {
      title: 'Atap Melengkung',
      description: 'Gaya arsitektur Tiongkok Selatan yang melambangkan kemakmuran dan perlindungan',
      image: '/images/lengkung.png'
    },
    {
      title: 'Gaya Indische',
      description: 'Perpaduan arsitektur Eropa kolonial dengan elemen Tionghoa yang unik',
      image: '/images/indische.png'
    },
    {
      title: 'Ornamen Merah & Emas',
      description: 'Warna simbolis keberuntungan dan kemakmuran dalam budaya Tionghoa',
      image: '/images/toasebio3.png'
    },
  ]

  // Data Fakta Unik
  const factsData = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'Kenapa disebut Glodok?',
      description: 'Konon dari bunyi air pancuran "grojok-grojok" (onomatopoeia) di area tersebut pada masa lalu'
    },
    {
      icon: <Landmark className="h-6 w-6" />,
      title: 'Kuil Tertua',
      description: 'Vihara Dharma Bhakti dibangun tahun 1650, adalah kuil tertua di Jakarta'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: '50+ Klenteng',
      description: 'Terdapat lebih dari 50 klenteng dan vihara di kawasan Jakarta Barat'
    },
    {
      icon: <Utensils className="h-6 w-6" />,
      title: '200+ Kuliner Legendaris',
      description: 'Lebih dari 200 tempat makan legendaris dengan resep turun-temurun'
    },
  ]

  // Data Kuliner Halal & Autentik
  const halalFood = [
    {
      id: 'h1',
      name: 'Cempedak Goreng Petak Sembilan',
      description: 'Cempedak segar digoreng crispy dengan taburan gula halus, legendaris sejak 1960-an',
      price: 15000,
      rating: 4.8,
      location: 'Petak Sembilan',
      image: '/images/cempedak.png',
      isHalal: true,
      story: 'Resep turun-temurun dari keluarga pedagang Betawi-Tionghoa, simbol akulturasi budaya'
    },
    {
      id: 'h2',
      name: 'Gado-Gado Direksi',
      description: 'Sayuran segar dengan bumbu kacang kental yang gurih dan kaya rempah',
      price: 20000,
      rating: 4.9,
      location: 'Jalan Perniagaan',
      image: '/images/gado.png',
      isHalal: true,
      story: 'Sering dikunjungi pejabat dan artis pada era 1970-80an'
    },
    {
      id: 'h3',
      name: 'Rujak Shanghai',
      description: 'Buah-buahan segar dengan bumbu kacang pedas manis yang khas',
      price: 18000,
      rating: 4.7,
      location: 'Pancoran',
      image: '/images/rujak.png',
      isHalal: true,
      story: 'Unik karena namanya Shanghai tapi bumbunya khas Indonesia'
    },
    {
      id: 'h4',
      name: 'Kopi Es Tak Kie',
      description: 'Kopi susu kental dengan es serut, berdiri sejak 1927',
      price: 25000,
      rating: 4.9,
      location: 'Gang Gloria',
      image: '/images/eskopi.png',
      isHalal: true,
      story: 'Saksi bisu perubahan Jakarta selama hampir satu abad'
    },
  ]

  // Data Kuliner The Old Masters (Non-Halal)
  const oldMastersFood = [
    {
      id: 'o1',
      name: 'Nasi Campur Kuno',
      description: 'Nasi dengan berbagai lauk pauk khas Tionghoa, resep 4 generasi',
      price: 35000,
      rating: 4.9,
      location: 'Pecinan Glodok',
      image: '/images/nasicampur.png',
      isHalal: false,
      generations: 4,
      story: 'Berjualan sejak 1950, resep asli dari leluhur di Fujian'
    },
    {
      id: 'o2',
      name: 'Sekba Komplet',
      description: 'Aneka olahan babi dengan bumbu rahasia keluarga',
      price: 40000,
      rating: 4.8,
      location: 'Gang Gloria',
      image: '/images/sekba1.png',
      isHalal: false,
      generations: 3,
      story: 'Makanan favorit para pedagang tua Glodok sejak 1960'
    },
  ]

  // Data Profil Pedagang
  const vendorProfiles = [
    {
      name: 'Opa Ahong',
      age: 78,
      occupation: 'Penjual Bakmi',
      years: 52,
      quote: 'Saya berharap anak muda tetap mencintai masakan tradisional kita. Jangan sampai resep leluhur punah.',
      image: '/images/bakmiahong.png',
      shop: 'Bakmi Ahong'
    },
    {
      name: 'Oma Siti',
      age: 72,
      occupation: 'Penjual Gado-Gado',
      years: 45,
      quote: 'Glodok itu rumah kedua saya. Di sini kita semua satu keluarga, beda agama tapi satu tujuan.',
      image: '/images/gadoomah.png',
      shop: 'Gado-Gado Oma'
    },
    {
      name: 'Opa Budi',
      age: 68,
      occupation: 'Penjual Kopi',
      years: 38,
      quote: 'Setiap cangkir kopi punya cerita. Saya senang melihat generasi baru datang dan dengarkan kisah Jakarta.',
      image: '/images/budi.png',
      shop: 'Kopi Opa Budi'
    },
  ]

  // Data Rute Jalan Kaki
  const walkingRoutes = [
    {
      id: 1,
      name: 'Rute 1 Jam - Heritage Walk',
      duration: '60 menit',
      distance: '2 km',
      stops: [
        'Pantjoran Tea House',
        'Gang Gloria',
        'Petak Sembilan',
        'Vihara Dharma Bhakti',
        'Pasar Glodok'
      ],
      highlights: ['Arsitektur kolonial', 'Kuliner legendaris', 'Tokoh sejarah'],
      bestTime: '07:00 - 08:00',
      image: '/images/heritage.png'
    },
    {
      id: 2,
      name: 'Rute 2 Jam - Culinary Adventure',
      duration: '120 menit',
      distance: '3 km',
      stops: [
        'Pasar Glodok',
        'Gang Gloria',
        'Petak Sembilan',
        'Jalan Perniagaan',
        'Gang Ketapang'
      ],
      highlights: ['Street food hunting', 'By-oleh manisan', 'Coffee tasting'],
      bestTime: '15:00 - 17:00',
      image: '/images/petak.png'
    },
  ]

  // Data Kamus Kecil
  const glossaryTerms = [
    {
      term: 'Ciam Si',
      meaning: 'Ramalan bambu tradisional di kelenteng, cara mencari petunjuk nasib dengan mengocok bambu',
      context: 'Biasanya dilakukan di Vihara Dharma Bhakti saat Imlek',
      image: '/images/ciam-si.png'
    },
    {
      term: 'Pecinan',
      meaning: 'Pemukiman atau kawasan komersial masyarakat Tionghoa',
      context: 'Glodok adalah Pecinan terbesar di Indonesia',
      image: '/images/pecinan.png'
    },
    {
      term: 'Cap Go Meh',
      meaning: 'Perayaan hari ke-15 setelah Tahun Baru Imlek, menandai akhir perayaan Imlek',
      context: 'Dirayakan dengan parade barongsai dan lampion di Glodok',
      image: '/images/cap-go-meh.png'
    },
    {
      term: 'Sekba',
      meaning: 'Aneka olahan daging babi dengan cara memasak khusus',
      context: 'Makanan tradisional Tionghoa yang legendaris di Glodok',
      image: '/images/sekba.png'
    },
    {
      term: 'Petak Sembilan',
      meaning: 'Kawasan kuliner legendaris di Glodok',
      context: 'Pusat jajanan dan kuliner yang wajib dikunjungi',
      image: '/images/petak-sembilan.png'
    },
    {
      term: 'Gang Gloria',
      meaning: 'Jalanan sempit bersejarah dengan toko-toko tua',
      context: 'Favorit untuk wisata kuliner dan belanja oleh-oleh',
      image: '/images/gang-gloria.png'
    },
    {
      term: 'Pantjoran',
      meaning: 'Nama jalan bersejarah di kawasan Glodok',
      context: 'Ada Pantjoran Tea House yang jadi ikon wisata',
      image: '/images/pantjoran.png'
    },
    {
      term: 'Vihara',
      meaning: 'Tempat ibadah umat Buddha',
      context: 'Vihara Dharma Bhakti adalah vihara tertua di Jakarta',
      image: '/images/vihara.png'
    },
  ]

  // Data Gallery
  const galleryImages = [
    '/images/bungapink.png',
    '/images/petak.png',
    '/images/festival.png',
    '/images/pasarglodok1.png',
    '/images/gate-glodok.png',
    '/images/lampulampu.png',
    '/images/merah-glodok.png',
    '/images/toasebio.png',
    '/images/pasarglodok.png',
    '/images/pth.png'
  ]

  // Data Transportasi

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-red-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => scrollToSection('home')}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                <Landmark className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent hidden sm:block">
                Jakarta Barat Kelompok 4
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2 text-xs">
              {navGroups.map((group, index) => (
                group.type === 'single' ? (
                  <button
                    key={group.id}
                    onClick={() => scrollToSection(group.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer ${activeSection === group.id
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-orange-100'
                      }`}
                  >
                    {group.icon}
                    <span className="font-medium">{group.label}</span>
                  </button>
                ) : group.type === 'link' ? (
                  <Link
                    key={index}
                    href={group.href}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 text-gray-700 hover:bg-orange-100 hover:text-orange-700 font-medium"
                  >
                    {group.icon}
                    <span>{group.label}</span>
                  </Link>
                ) : (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer ${group.items.some(item => activeSection === item.id)
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-orange-100'
                          }`}
                      >
                        {group.icon}
                        <span className="font-medium">{group.label}</span>
                        <ChevronDown className="h-3 w-3 ml-0.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {group.items.map((item) => (
                        <DropdownMenuItem
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`flex items-center gap-2 cursor-pointer ${activeSection === item.id ? 'bg-orange-50' : ''
                            }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-orange-200 bg-white"
            >
              <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
                {navLinks.map((link) => (
                  link.href ? (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-700 hover:bg-orange-100 hover:text-orange-700"
                    >
                      {link.icon}
                      <span className="font-medium text-sm">{link.label}</span>
                    </Link>
                  ) : (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${activeSection === link.id
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                        : 'text-gray-700 hover:bg-orange-100'
                        }`}
                    >
                      {link.icon}
                      <span className="font-medium text-sm">{link.label}</span>
                    </button>
                  )
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <img
            src="/images/glodok-05.png"
            alt="Jakarta Barat Chinatown"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-block mb-4"
          >
            <Badge className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 shadow-lg">
              🏮 Museum Hidup Jakarta Barat
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
          >
            Jakarta Barat
            <br />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Chinatown & Kuliner Legendaris
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto"
          >
            Jelajahi lebih dari sekadar tempat makan. Temukan kisah akulturasi budaya, toleransi, dan warisan yang hidup di setiap sudut Glodok
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap"
          >
            <Button
              onClick={() => scrollToSection('museum-hidup')}
              size="lg"
              className="px-6 py-5 text-base bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-2xl rounded-full cursor-pointer"
            >
              Mulai Eksplorasi
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => scrollToSection('peta-rasa')}
              size="lg"
              variant="outline"
              className="px-6 py-5 text-base border-2 border-white text-gray-200 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full cursor-pointer"
            >
              <Utensils className="mr-2 h-5 w-5" />
              Temukan Kuliner
            </Button>
            <Button
              onClick={() => setAdventureModeOpen(true)}
              size="lg"
              className="px-6 py-5 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl rounded-full cursor-pointer font-bold"
            >
              🎮 Adventure Mode
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >

          </motion.div>
        </motion.div>
      </section>

      {/* Achievement Showcase Section */}
      <AchievementShowcase />

      {/* Museum Hidup Section - Konsep Utama */}
      <section id="museum-hidup" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 bg-red-100 text-red-700 font-semibold text-sm">
              Konsep Utama
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Museum Hidup Jakarta Barat
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Jangan hanya anggap Glodok sebagai tempat makan, tapi anggap sebagai museum yang hidup
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Akulturasi Budaya */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Akulturasi Budaya</h3>
              </div>
              <p className="text-gray-700 text-lg mb-4">
                Bagaimana makanan Cina (mie, kecap, tahu) bercampur dengan rempah Indonesia menciptakan kuliner fusion yang unik.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Coffee className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Mie & Kecap</h4>
                    <p className="text-sm text-gray-600">Bahan dasar Tionghoa yang menjadi dasar masakan Indonesia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Utensils className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Rempah Nusantara</h4>
                    <p className="text-sm text-gray-600">Bumbu khas Indonesia yang menghidangkan cita rasa baru</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Fusion Perpaduan</h4>
                    <p className="text-sm text-gray-600">Lahirnya masakan baru seperti Bakmi, Tahu Goreng, dan Gado-Gado</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Toleransi */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Toleransi & Harmoni</h3>
              </div>
              <p className="text-gray-700 text-lg mb-4">
                Bagaimana Kelenteng Jin De Yuan bisa berdampingan damai dengan masyarakat sekitar dari berbagai latar belakang.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Landmark className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Kelenteng Jin De Yuan</h4>
                    <p className="text-sm text-gray-600">Tempat ibadah yang terbuka untuk semua, simbol toleransi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Interaksi Harian</h4>
                    <p className="text-sm text-gray-600">Warga Betawi dan Tionghoa berinteraksi di pasar dan tempat makan</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Perayaan Bersama</h4>
                    <p className="text-sm text-gray-600">Festival Cap Go Meh dirayakan oleh semua kalangan</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Jejak Masa Lalu Section */}
      <section id="jejak-masa-lalu" className="py-16 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 bg-orange-100 text-orange-700 font-semibold text-sm">
              Sisi Akademis/Sejarah - Materi Muatan Lokal
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Jejak Masa Lalu
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Menelusuri sejarah panjang Glodok dari era Batavia hingga menjadi pusat budaya modern
            </p>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ScrollText className="h-6 w-6 text-orange-600" />
              Timeline Sejarah Glodok
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-600 to-red-600 transform md:-translate-x-1/2" />

              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="hidden md:block md:w-1/2"></div>
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-orange-600 rounded-full border-4 border-white shadow-lg" />
                  <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                    <motion.div
                      layout
                      onClick={() => setExpandedTimelineId(expandedTimelineId === index ? null : index)}
                      className="cursor-pointer"
                    >
                      <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 border-orange-200 ${expandedTimelineId === index ? 'ring-2 ring-orange-500 scale-[1.02]' : ''}`}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="text-3xl font-bold text-orange-600 mb-1">{item.year}</div>
                            <motion.div
                              animate={{ rotate: expandedTimelineId === index ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            </motion.div>
                          </div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600">{item.description}</p>
                          <AnimatePresence>
                            {expandedTimelineId === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <Separator className="mb-4 bg-orange-100" />
                                <div className="bg-orange-50/50 p-4 rounded-lg">
                                  <p className="text-gray-700 text-sm leading-relaxed">
                                    {item.details}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Arsitektur */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Landmark className="h-6 w-6 text-orange-600" />
              Arsitektur Unik
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {architectureData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all border-orange-200 h-full">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Fakta Unik */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-orange-600" />
              Fakta Unik & Menarik
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {factsData.map((fact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-all border-orange-200 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600">{fact.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{fact.title}</h4>
                        <p className="text-sm text-gray-600">{fact.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Peta Rasa Legendaris Section */}
      <section id="peta-rasa" className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 bg-red-100 text-red-700 font-semibold text-sm">
              Sisi Wisata/Kuliner
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Peta Rasa Legendaris
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Jelajahi kuliner otentik dengan cerita dan sejarah di setiap suapan
            </p>
          </motion.div>

          {/* Halal & Autentik */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Kategori: Halal & Autentik</h3>
              <Badge className="bg-green-100 text-green-700 border-green-300">Muslim Friendly</Badge>
            </div>
            <p className="text-gray-600 mb-6">
              Kurasi khusus makanan Chinatown yang aman untuk teman-teman muslim tanpa mengurangi keaslian rasa.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {halalFood.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-green-200 overflow-hidden group">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 cursor-pointer"
                      >
                        <Heart
                          className={`h-4 w-4 ${favorites.has(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                            }`}
                        />
                      </button>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-600 text-white border-0 text-xs">HALAL</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base text-gray-900 leading-tight">{item.name}</CardTitle>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold text-yellow-600">{item.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <CardDescription className="text-gray-600 text-xs mb-2 min-h-[40px]">
                        {item.description}
                      </CardDescription>
                      <div className="bg-green-50 p-2 rounded-lg mb-2">
                        <p className="text-xs text-green-700 italic">"{item.story}"</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span className="text-xs">{item.location}</span>
                        </div>
                        <div className="text-sm font-bold text-orange-600">{formatPrice(item.price)}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* The Old Masters */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Kategori: The Old Masters</h3>
              <Badge className="bg-orange-100 text-orange-700 border-orange-300">Non-Halal</Badge>
            </div>
            <p className="text-gray-600 mb-6">
              Makanan legendaris non-halal yang telah menjadi warisan kuliner selama beberapa generasi.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {oldMastersFood.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-300 border-orange-200 overflow-hidden group">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/2 h-48 md:h-auto overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="md:w-1/2 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg text-gray-900">{item.name}</CardTitle>
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-600">{item.rating}</span>
                          </div>
                        </div>
                        <CardDescription className="text-gray-600 text-sm mb-3">
                          {item.description}
                        </CardDescription>
                        <div className="bg-orange-50 p-3 rounded-lg mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Coffee className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-semibold text-orange-700">
                              {item.generations} Generasi
                            </span>
                          </div>
                          <p className="text-xs text-orange-600 italic">"{item.story}"</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{item.location}</span>
                          </div>
                          <div className="text-lg font-bold text-orange-600">
                            {formatPrice(item.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wajah Jakarta Barat Section */}
      <section id="wajah-jakarta" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 bg-teal-100 text-teal-700 font-semibold text-sm">
              Sisi Sosiologis - Riset Primer
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Wajah Jakarta Barat
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Mengenal sosok di balik kelezatan kuliner dan keharmonisan budaya
            </p>
          </motion.div>

          {/* Profil Pedagang */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-teal-600" />
              Profil Pedagang Legendaris
            </h3>
            <p className="text-gray-600 mb-6">
              Wawancara langsung dengan Opa/Oma penjual tentang harapan mereka untuk Jakarta Barat. Nilai plus untuk tugas sekolah karena menunjukkan riset primer.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {vendorProfiles.map((vendor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-teal-200 overflow-hidden">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="text-xl font-bold">{vendor.name}</h4>
                        <p className="text-sm opacity-90">{vendor.shop}</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4 text-teal-600" />
                          <span className="text-gray-600">{vendor.age} tahun</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-teal-600" />
                          <span className="text-gray-600">{vendor.years} tahun berjualan</span>
                        </div>
                      </div>
                      <div className="bg-teal-50 p-4 rounded-lg">
                        <p className="text-sm text-teal-800 italic">"{vendor.quote}"</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">Ocupation: {vendor.occupation}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Potret Toleransi */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Heart className="h-6 w-6 text-teal-600" />
              Potret Toleransi & Harmoni
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-teal-200 overflow-hidden">
                <div className="h-56 overflow-hidden">
                  <img
                    src="/images/pasarglodok1.png"
                    alt="Interaksi di Pasar"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Interaksi di Pasar Glodok</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Foto kegiatan warga asli Betawi yang berinteraksi dengan warga Tionghoa di pasar. Transaksi jual-beli, percakapan santai, dan saling membantu menjadi bukti harmoni yang hidup sehari-hari.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-teal-200 overflow-hidden">
                <div className="h-56 overflow-hidden">
                  <img
                    src="/images/festival.png"
                    alt="Festival Bersama"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Perayaan Bersama</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Festival Cap Go Meh tidak hanya dirayakan oleh etnis Tionghoa, tetapi juga dihadiri oleh warga dari berbagai latar belakang. Ini adalah manifestasi toleransi dalam bentuk perayaan budaya.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Panduan Jelajah Section */}
      <section id="panduan-jelajah" className="py-16 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 bg-blue-100 text-blue-700 font-semibold text-sm">
              Sisi Utilitas/Tips Praktis
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Panduan Jelajah
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Semua yang perlu Anda ketahui untuk menjelajahi Glodok dengan nyaman
            </p>
          </motion.div>

          {/* Cara ke Sana */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Route className="h-6 w-6 text-blue-600" />
              Cara ke Sana
            </h3>
            <TransportList />
          </motion.div>

          {/* Rute Jalan Kaki */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Footprints className="h-6 w-6 text-blue-600" />
              Rute Jalan Kaki (Walking Map)
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {walkingRoutes.map((route, index) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className={`h-full cursor-pointer transition-all duration-300 ${selectedRoute === route.id ? 'shadow-2xl ring-2 ring-blue-500' : 'shadow-lg hover:shadow-xl'
                      } border-blue-200`}
                    onClick={() => setSelectedRoute(route.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={route.image}
                        alt={route.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <CardTitle className="text-xl mb-1">{route.name}</CardTitle>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {route.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Route className="h-4 w-4" />
                            {route.distance}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          Titik Kunjungan:
                        </h4>
                        <div className="space-y-1">
                          {route.stops.map((stop, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                                {idx + 1}
                              </div>
                              {stop}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Waktu Terbaik</p>
                          <p className="text-sm font-semibold text-blue-700">{route.bestTime}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Highlights</p>
                          <p className="text-xs text-orange-700">{route.highlights.join(', ')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Waktu Terbaik */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              Waktu Terbaik Berkunjung
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-lg border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                      <Sun className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>Pagi (07:00 - 09:00)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Kalau mau lihat pasar basah yang ramai dan suasana aktivitas pagi hari. Pasar Glodok paling hidup dengan transaksi dan persediaan segar.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <CloudSun className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>Siang (10:00 - 14:00)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Waktu terbaik untuk berbelanja oleh-oleh dan menjelajahi toko-toko. Cuaca cukup panas, jadi siapkan payung atau topi.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <Moon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>Sore (15:00 - 17:00)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Untuk suasana santai dan kuliner sore hari. Suhu mulai turun, pas untuk jalan-jalan dan menikmati street food.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Kamus Kecil Section */}
      <section id="kamus" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 bg-red-100 text-red-700 font-semibold text-sm">
              Materi Muatan Lokal
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Kamus Kecil
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Istilah-istilah unik yang perlu Anda ketahui saat menjelajahi Glodok
            </p>

            <div className="max-w-md mx-auto relative mb-12">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Cari istilah..."
                className="pl-10 border-red-200 focus:border-red-500 focus:ring-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {glossaryTerms
              .filter(term =>
                term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                term.meaning.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="h-64 [perspective:1000px]"
                >
                  <motion.div
                    className="relative w-full h-full [transform-style:preserve-3d] cursor-pointer shadow-xl rounded-xl transition-all duration-500 border-purple-200 border"
                    animate={{ rotateY: flippedCards.has(index) ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    onClick={() => {
                      const newFlipped = new Set(flippedCards)
                      if (newFlipped.has(index)) {
                        newFlipped.delete(index)
                      } else {
                        newFlipped.add(index)
                      }
                      setFlippedCards(newFlipped)
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Front Side */}
                    <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col items-center justify-center p-6 bg-white rounded-xl overflow-hidden border border-purple-100 shadow-sm">
                      {term.image ? (
                        <>
                          <img
                            src={term.image}
                            alt={term.term}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          <div className="relative z-10 flex flex-col items-center justify-end h-full w-full pb-4">
                            <h3 className="text-xl font-bold text-white text-center mb-1 drop-shadow-md">{term.term}</h3>
                            <p className="text-[10px] text-gray-300 font-medium tracking-wider uppercase">Klik untuk info</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="h-8 w-8 text-purple-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 text-center">{term.term}</h3>
                          <div className="mt-auto">
                            <span className="text-xs text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full">
                              Klik untuk melihat arti
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Back Side */}
                    <div
                      className="absolute inset-0 [backface-visibility:hidden] flex flex-col justify-center p-6 bg-red-600 rounded-xl text-white"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <h3 className="text-lg font-bold mb-2 border-b border-purple-400 pb-2">{term.term}</h3>
                      <p className="text-sm mb-3 font-medium">{term.meaning}</p>
                      <div className="bg-red-700/50 p-2 rounded-lg">
                        <p className="text-xs italic opacity-90">{term.context}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Budget Calculator Section */}
      <BudgetCalculator />

      {/* Gallery Section */}
      <section id="gallery" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 bg-pink-100 text-pink-700 font-semibold text-sm">
              Galeri Visual
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Keindahan Jakarta Barat
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Menangkap momen indah dari budaya, kuliner, dan suasana di kawasan Chinatown Glodok
            </p>
          </motion.div>

          <div
            className="w-full px-4 md:px-12"
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
          >
            <Carousel
              setApi={setCarouselApi}
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {galleryImages.map((image, index) => {
                  const isActive = index === currentSlide
                  return (
                    <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 py-8">
                      <motion.div
                        animate={{
                          scale: isActive ? 1.15 : 0.9,
                          opacity: isActive ? 1 : 0.6,
                          zIndex: isActive ? 10 : 0,
                          y: isActive ? -10 : 0
                        }}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                        className="p-2 h-full"
                      >
                        <Card
                          className={`overflow-hidden shadow-xl cursor-pointer h-full border-none transition-all duration-500 ${isActive ? 'ring-4 ring-orange-400 shadow-2xl' : 'grayscale'}`}
                          onClick={() => openLightbox(image)}
                        >
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                            <img
                              src={image}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <div className="flex items-center gap-2 text-white">
                                <Eye className="h-5 w-5" />
                                <span className="font-semibold">Lihat Detail</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="left-0 md:-left-12 lg:-left-16 bg-white/80 hover:bg-white text-orange-600 border-orange-200" />
              <CarouselNext className="right-0 md:-right-12 lg:-right-16 bg-white/80 hover:bg-white text-orange-600 border-orange-200" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 bg-orange-100 text-orange-700 font-semibold text-sm">
              Informasi Wisata
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Hubungi Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dapatkan informasi lebih lanjut tentang wisata dan budaya Jakarta Barat
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 md:p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Alamat</h4>
                      <p className="text-gray-600 text-sm">Pecinan Glodok, Jakarta Barat<br />DKI Jakarta, Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Telepon</h4>
                      <p className="text-gray-600 text-sm">+62 21 1234 5678</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600 text-sm">info@jakartabarat.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Jam Operasional</h4>
                      <p className="text-gray-600 text-sm">Senin - Minggu: 09:00 - 21:00</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-orange-200">
                  <h4 className="font-semibold text-gray-900 mb-4 text-sm">Ikuti Kami</h4>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <Facebook className="h-4 w-4 text-blue-600" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <Instagram className="h-4 w-4 text-pink-600" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <Twitter className="h-4 w-4 text-sky-600" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <Youtube className="h-4 w-4 text-red-600" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="/images/jakarta-skyline.jpg"
                alt="Jakarta Skyline"
                className="rounded-2xl shadow-2xl w-full h-full min-h-[350px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-2xl flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Kunjungi Kami</h3>
                  <p className="text-base opacity-90">
                    Datang dan rasakan langsung keindahan budaya dan kelezatan kuliner di kawasan Chinatown Glodok
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                  <Landmark className="h-6 w-6 text-white" />
                </div>
                <span className="text-lg font-bold">Museum Hidup Jakarta Barat</span>
              </div>
              <p className="text-gray-400 text-sm">
                Menjelajahi dan melestarikan warisan budaya Chinatown terbesar di Indonesia
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Navigasi</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><a href="#home" className="hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#museum-hidup" className="hover:text-white transition-colors">Museum Hidup</a></li>
                <li><a href="#jejak-masa-lalu" className="hover:text-white transition-colors">Jejak Masa Lalu</a></li>
                <li><a href="#peta-rasa" className="hover:text-white transition-colors">Peta Rasa</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Fitur</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><a href="#wajah-jakarta" className="hover:text-white transition-colors">Wajah Jakarta</a></li>
                <li><a href="#panduan-jelajah" className="hover:text-white transition-colors">Panduan Jelajah</a></li>
                <li><a href="#kamus" className="hover:text-white transition-colors">Kamus Kecil</a></li>
                <li><a href="#budget" className="hover:text-white transition-colors">Budget Calculator</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Bantuan</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><a href="#contact" className="hover:text-white transition-colors">Kontak</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
              </ul>
            </div>
          </div>
          <Separator className="bg-gray-700 mb-6" />
          <div className="text-center text-gray-400 text-sm">
            <p>© 2024 Museum Hidup Jakarta Barat. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Gallery image"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors cursor-pointer"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adventure Mode Modal */}
      <AdventureMode isOpen={adventureModeOpen} onClose={() => setAdventureModeOpen(false)} />
    </div>
  )
}

// Helper icons

