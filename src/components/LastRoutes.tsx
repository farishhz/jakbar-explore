'use client'

import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { getRouteHistory, clearRouteHistory, type SavedRoute } from '@/utils/routeHistory'

export default function LastRoutes() {
  const [history, setHistory] = useState<SavedRoute[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load history when component mounts
    const saved = getRouteHistory()
    setHistory(saved)
    setIsLoading(false)
  }, [])

  if (isLoading || history.length === 0) {
    return null
  }

  const handleClear = () => {
    clearRouteHistory()
    setHistory([])
  }

  const getTransportEmoji = (transport: string) => {
    return transport === 'transjakarta' ? '🚌' : '🚆'
  }

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">⏱️ Terakhir Kamu Pilih</h3>
        <button
          onClick={handleClear}
          className="text-xs text-gray-500 hover:text-red-600 transition inline-flex items-center gap-1"
        >
          <Trash2 className="h-3 w-3" />
          Hapus
        </button>
      </div>

      <div className="space-y-2">
        {history.map((route, idx) => (
          <div
            key={`${route.timestamp}-${idx}`}
            className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
          >
            <span className="text-lg">{getTransportEmoji(route.transport)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{route.label}</p>
              <p className="text-xs text-gray-500">
                {new Date(route.timestamp).toLocaleDateString('id-ID', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
