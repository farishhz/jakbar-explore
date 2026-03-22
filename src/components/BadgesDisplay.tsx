'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameContext } from '@/contexts/GameContext'
import { BADGES, ZONES } from '@/data/gameData'
import { Lock, Star } from 'lucide-react'

export default function BadgesDisplay() {
  const { progress } = useGameContext()

  const getBadgeProgress = (badgeId: string): { current: number; target: number; text: string } => {
    switch (badgeId) {
      case 'explorer-jakbar':
        return {
          current: progress.completedZones.size,
          target: 5,
          text: `${progress.completedZones.size}/5 Zona`
        }
      case 'quiz-champion':
        return {
          current: progress.totalScore,
          target: 400,
          text: `${progress.totalScore}/400 Poin`
        }
      case 'perfect-score':
        return {
          current: Object.values(progress.zoneScores).filter(scores => scores.some(s => s === 300)).length,
          target: 1,
          text: 'Perfect Quiz'
        }
      case 'master-kota-tua':
      case 'culinary-expert':
      case 'nature-lover':
      case 'history-scholar':
      case 'culture-enthusiast':
        const zoneMap: Record<string, string> = {
          'master-kota-tua': 'kota-tua',
          'culinary-expert': 'kuliner',
          'nature-lover': 'taman',
          'history-scholar': 'sejarah',
          'culture-enthusiast': 'budaya'
        }
        const zoneId = zoneMap[badgeId]
        const completed = progress.completedZones.has(zoneId) ? 1 : 0
        return {
          current: completed,
          target: 1,
          text: completed ? 'Selesai' : 'Belum'
        }
      default:
        return { current: 0, target: 1, text: '0/1' }
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {BADGES.map((badge, index) => {
        const isUnlocked = progress.unlockedBadges.has(badge.id)
        const badgeProgress = getBadgeProgress(badge.id)
        
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="group"
          >
            <Card className={`relative overflow-hidden cursor-default transition-all h-full ${
              isUnlocked
                ? 'border-2 border-yellow-500 bg-gradient-to-br from-yellow-950 to-yellow-900 shadow-lg shadow-yellow-500/20'
                : 'border-2 border-gray-600 bg-slate-900/50 opacity-60 hover:opacity-75'
            }`}>
              <CardContent className="p-4 text-center">
                <motion.div
                  animate={isUnlocked ? { scale: [1, 1.2, 1] } : {}}
                  transition={{
                    duration: 2,
                    repeat: isUnlocked ? Infinity : 0,
                    repeatType: 'reverse'
                  }}
                  className="text-4xl mb-2"
                >
                  {isUnlocked ? badge.emoji : '🔒'}
                </motion.div>
                
                <h3 className="font-bold text-sm text-white mb-1">
                  {badge.name}
                </h3>
                
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                  {badge.description}
                </p>

                {/* Progress indicator */}
                <div className="bg-gray-700/50 rounded px-2 py-1 mb-2">
                  <p className={`text-xs font-semibold ${
                    isUnlocked ? 'text-yellow-300' : 'text-gray-400'
                  }`}>
                    {badgeProgress.text}
                  </p>
                </div>

                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex justify-center"
                  >
                    <Badge className="bg-yellow-500 text-yellow-900 font-bold text-xs">
                      <Star className="h-2.5 w-2.5 mr-1" />
                      Unlocked
                    </Badge>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
