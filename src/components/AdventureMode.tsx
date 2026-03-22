'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ZONES, QUIZ_QUESTIONS } from '@/data/gameData'
import { useGameContext } from '@/contexts/GameContext'
import QuizWorld from './QuizWorld'
import { Zap, Trophy, Target } from 'lucide-react'

interface AdventureModeProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdventureMode({ isOpen, onClose }: AdventureModeProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const { progress } = useGameContext()

  const completionPercentage = (progress.completedZones.size / ZONES.length) * 100

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId)
    setShowQuiz(true)
  }

  const handleQuizClose = () => {
    setShowQuiz(false)
    setSelectedZone(null)
  }

  if (showQuiz && selectedZone) {
    return <QuizWorld zoneId={selectedZone} onClose={handleQuizClose} />
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-auto"
          onClick={onClose}
        >
          {/* Close on backdrop click, but not on content click */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-4xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-purple-500">
              {/* Header dengan close button */}
              <CardHeader className="relative pb-2">
                <div className="absolute right-4 top-4">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🎮</span>
                  <div>
                    <CardTitle className="text-3xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Jakbar Adventure Mode
                    </CardTitle>
                    <CardDescription className="text-purple-200">
                      Jelajahi Jakarta Barat dengan cara yang menyenangkan
                    </CardDescription>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-300">
                      Progress Jelajah
                    </span>
                    <span className="text-sm font-bold text-purple-400">
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>
                  <Progress value={completionPercentage} className="h-3" />
                  <p className="text-xs text-gray-400">
                    {progress.completedZones.size} dari {ZONES.length} zona dikuasai
                  </p>
                </div>

                {/* Stats Row */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="bg-purple-900/30 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-purple-400">
                      {progress.totalScore}
                    </div>
                    <div className="text-xs text-gray-400">Total Poin</div>
                  </div>
                  <div className="bg-pink-900/30 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-pink-400">
                      {progress.quizzesCompleted}
                    </div>
                    <div className="text-xs text-gray-400">Quiz Selesai</div>
                  </div>
                  <div className="bg-cyan-900/30 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-cyan-400">
                      {progress.unlockedBadges.size}
                    </div>
                    <div className="text-xs text-gray-400">Badge</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Zone Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ZONES.map((zone) => {
                    const isCompleted = progress.completedZones.has(zone.id)
                    const qCount = QUIZ_QUESTIONS.filter(q => q.zoneId === zone.id).length
                    const zoneScore = progress.zoneScores[zone.id]
                    const hasScore = zoneScore && zoneScore.length > 0

                    return (
                      <motion.div
                        key={zone.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => handleZoneClick(zone.id)}
                          className={`w-full h-auto p-4 text-left justify-start flex-col items-start gap-2 border-2 transition-all ${
                            isCompleted
                              ? 'bg-gradient-to-r ' + zone.color + ' border-green-400'
                              : 'bg-slate-800 border-slate-600 hover:border-purple-500'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{zone.emoji}</span>
                              <div>
                                <div className="font-bold text-lg">{zone.name}</div>
                                <div className="text-xs opacity-75">
                                  {qCount} soal
                                </div>
                              </div>
                            </div>
                            {isCompleted && (
                              <Trophy className="h-5 w-5 text-yellow-300" />
                            )}
                          </div>
                          <p className="text-sm opacity-80">{zone.description}</p>
                          
                          {/* Score indicator if available */}
                          {hasScore && (
                            <div className="mt-2 flex items-center gap-2">
                              <Zap className="h-3 w-3 text-yellow-300" />
                              <span className="text-xs font-bold">
                                Skor: {zoneScore[zoneScore.length - 1]}
                              </span>
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Tips Section */}
                <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <div className="flex gap-2">
                    <Target className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-semibold text-blue-300 mb-1">💡 Tips</div>
                      <p className="text-blue-200 text-xs">
                        Jawab semua soal di setiap zona untuk mendapatkan badge eksklusif! 
                        Semakin banyak poin, semakin lanjar peringkatmu.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
