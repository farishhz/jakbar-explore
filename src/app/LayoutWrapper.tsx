'use client'

import { GameProvider } from '@/contexts/GameContext'
import { Toaster } from '@/components/ui/toaster'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
      {children}
      <Toaster />
    </GameProvider>
  )
}
