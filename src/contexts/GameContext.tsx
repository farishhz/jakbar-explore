'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface GameProgress {
  completedZones: Set<string>
  unlockedBadges: Set<string>
  totalScore: number
  quizzesCompleted: number
  zoneScores: Record<string, number[]> // zoneId -> array of scores
}

interface GameContextType {
  progress: GameProgress
  completeZone: (zoneId: string) => void
  addScore: (zoneId: string, score: number) => void
  unlockBadge: (badgeId: string) => void
  resetProgress: () => void
  getZoneScore: (zoneId: string) => number | null
  getTotalScore: () => number
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const STORAGE_KEY = 'jakbar_game_progress'

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<GameProgress>({
    completedZones: new Set(),
    unlockedBadges: new Set(),
    totalScore: 0,
    quizzesCompleted: 0,
    zoneScores: {}
  })
  const [isMounted, setIsMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setProgress({
          completedZones: new Set(parsed.completedZones || []),
          unlockedBadges: new Set(parsed.unlockedBadges || []),
          totalScore: parsed.totalScore || 0,
          quizzesCompleted: parsed.quizzesCompleted || 0,
          zoneScores: parsed.zoneScores || {}
        })
      }
    } catch (error) {
      console.error('Failed to load game progress:', error)
    }
    setIsMounted(true)
  }, [])

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (!isMounted) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        completedZones: Array.from(progress.completedZones),
        unlockedBadges: Array.from(progress.unlockedBadges),
        totalScore: progress.totalScore,
        quizzesCompleted: progress.quizzesCompleted,
        zoneScores: progress.zoneScores
      }))
    } catch (error) {
      console.error('Failed to save game progress:', error)
    }
  }, [progress, isMounted])

  const completeZone = (zoneId: string) => {
    setProgress(prev => ({
      ...prev,
      completedZones: new Set([...prev.completedZones, zoneId])
    }))
  }

  const addScore = (zoneId: string, score: number) => {
    setProgress(prev => {
      const newZoneScores = { ...prev.zoneScores }
      newZoneScores[zoneId] = [...(newZoneScores[zoneId] || []), score]
      
      const newProgress = {
        ...prev,
        zoneScores: newZoneScores,
        totalScore: prev.totalScore + score,
        quizzesCompleted: prev.quizzesCompleted + 1,
        unlockedBadges: new Set(prev.unlockedBadges)
      }

      // Auto-unlock achievement badges
      // Quiz Champion badge: total score >= 400 (4 perfect quizzes)
      if (newProgress.totalScore >= 400) {
        newProgress.unlockedBadges.add('quiz-champion')
      }

      // Explorer badge: all 5 zones completed
      if (newProgress.completedZones.size === 5) {
        newProgress.unlockedBadges.add('explorer-jakbar')
      }

      return newProgress
    })
  }

  const unlockBadge = (badgeId: string) => {
    setProgress(prev => {
      const newBadges = new Set(prev.unlockedBadges)
      newBadges.add(badgeId)
      return {
        ...prev,
        unlockedBadges: newBadges
      }
    })
  }

  const resetProgress = () => {
    setProgress({
      completedZones: new Set(),
      unlockedBadges: new Set(),
      totalScore: 0,
      quizzesCompleted: 0,
      zoneScores: {}
    })
  }

  const getZoneScore = (zoneId: string): number | null => {
    const scores = progress.zoneScores[zoneId]
    if (!scores || scores.length === 0) return null
    return scores[scores.length - 1] // Return latest score
  }

  const getTotalScore = () => progress.totalScore

  const value: GameContextType = {
    progress,
    completeZone,
    addScore,
    unlockBadge,
    resetProgress,
    getZoneScore,
    getTotalScore
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGameContext must be used within GameProvider')
  }
  return context
}
