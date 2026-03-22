'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

export default function PatchNotes() {
  const patches = [
    {
      version: '2.0',
      date: 'Februari 2026',
      highlights: [
        { icon: '🎮', text: 'Tambahkan Jakbar Adventure Mode - jelajahi 5 zona interaktif' },
        { icon: '❓', text: 'Tambahkan Quiz World dengan 15 soal mendidik' },
        { icon: '⏱️', text: 'Countdown timer per soal untuk meningkatkan adrenaline' },
        { icon: '🏆', text: 'Sistem badge dan achievement untuk motivasi belajar' },
        { icon: '📊', text: 'Progress tracker dengan poin dan statistik' },
        { icon: '🎨', text: 'UI upgrade dengan gradient dan animasi modern' },
        { icon: '⚡', text: 'Respons cepat - optimasi performa loading' }
      ]
    },
    {
      version: '1.5',
      date: 'Januari 2026',
      highlights: [
        { icon: '✅', text: 'Perbaiki navigasi mobile' },
        { icon: '✅', text: 'Tambahkan budget calculator' },
        { icon: '✅', text: 'Tingkatkan kecepatan gallery' },
        { icon: '✅', text: 'Fix bug pada transport filter' }
      ]
    },
    {
      version: '1.0',
      date: 'Desember 2025',
      highlights: [
        { icon: '✅', text: 'Launching aplikasi Jakbar Tourism' },
        { icon: '✅', text: 'Konten kuliner, sejarah, dan transport' },
        { icon: '✅', text: 'Galeri foto lokasi wisata' },
        { icon: '✅', text: 'Fitur favorit dan search' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🔥</span>
            <h1 className="text-4xl md:text-5xl font-bold">
              Patch Notes
            </h1>
            <span className="text-5xl">✨</span>
          </div>
          <p className="text-gray-400 text-lg">
            Lihat apa yang baru dalam versi terbaru Jakbar Tourism
          </p>
        </motion.div>

        {/* Patch History */}
        <div className="space-y-8">
          {patches.map((patch, index) => (
            <motion.div
              key={patch.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-2 ${
                index === 0 
                  ? 'border-purple-500 bg-gradient-to-r from-purple-950 to-slate-900' 
                  : 'border-slate-700 bg-slate-900/50'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? 'default' : 'secondary'} className="text-lg px-4 py-2">
                        v{patch.version}
                      </Badge>
                      {index === 0 && (
                        <Badge variant="outline" className="border-green-600 text-green-400 font-bold">
                          ⭐ LATEST
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">{patch.date}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {patch.highlights.map((highlight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-700/30 transition-colors"
                      >
                        <span className="text-xl mt-0.5 flex-shrink-0">{highlight.icon}</span>
                        <div className="flex-1">
                          <p className="text-gray-200">{highlight.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="border-2 border-dashed border-gray-600 bg-slate-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🚀</span>
                Coming Soon in v3.0
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg">🌍</span>
                  <div>
                    <p className="font-semibold text-gray-200">Map Interaktif</p>
                    <p className="text-sm text-gray-400">Jelajahi lokasi dengan peta real-time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">👥</span>
                  <div>
                    <p className="font-semibold text-gray-200">Multiplayer Quiz</p>
                    <p className="text-sm text-gray-400">Kompetisi dengan teman sekelasmu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">🎥</span>
                  <div>
                    <p className="font-semibold text-gray-200">Video Content</p>
                    <p className="text-sm text-gray-400">Dokumenter perjalanan Jakarta Barat</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">🎁</span>
                  <div>
                    <p className="font-semibold text-gray-200">Daily Rewards</p>
                    <p className="text-sm text-gray-400">Login harian dengan bonus poin</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
