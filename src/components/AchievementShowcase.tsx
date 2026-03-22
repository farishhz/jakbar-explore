'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameContext } from '@/contexts/GameContext'
import BadgesDisplay from './BadgesDisplay'
import { Trophy, Zap, Target } from 'lucide-react'
import Link from 'next/link'

export default function AchievementShowcase() {
  const { progress } = useGameContext()
  const completionPercentage = (progress.completedZones.size / 5) * 100 // 5 zones total

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl">🏆</span>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Pencapaianmu
            </h2>
            <span className="text-4xl">✨</span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kumpulkan badge dan raih poin dengan menyelesaikan quiz di Jakbar Adventure Mode
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-500/10 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Total Poin</p>
                    <p className="text-3xl font-bold text-purple-600">{progress.totalScore}</p>
                  </div>
                  <Zap className="h-10 w-10 text-purple-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-500/10 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Quiz Selesai</p>
                    <p className="text-3xl font-bold text-pink-600">{progress.quizzesCompleted}</p>
                  </div>
                  <Trophy className="h-10 w-10 text-pink-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-500/10 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Badge Terkumpul</p>
                    <p className="text-3xl font-bold text-cyan-600">{progress.unlockedBadges.size}</p>
                  </div>
                  <Target className="h-10 w-10 text-cyan-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Progress Bar */}
        {progress.totalScore > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span>🗺️</span>
                    Progress Jelajah Jakbar
                  </CardTitle>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {progress.completedZones.size}/5 Zona
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${completionPercentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-full"
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center font-semibold">
                    {Math.round(completionPercentage)}% Selesai
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Badges Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-6 text-center">🎖️ Badge Achievements</h3>
          <BadgesDisplay />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          {progress.totalScore === 0 ? (
            <p className="text-gray-600 mb-4">Belum ada pencapaian? Mulai Adventure Mode sekarang!</p>
          ) : (
            <p className="text-gray-600 mb-4">Terus kumpulkan poin dan badge baru!</p>
          )}
          <Link href="/#home" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all">
            🎮 Buka Adventure Mode
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
