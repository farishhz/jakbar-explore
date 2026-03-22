'use client'

import { useState, useMemo, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { transjakartaOrigins } from '@/data/transjakartaOrigins'
import { transjakartaRoutes, getRoutesByOrigin } from '@/data/transjakartaRoutes'
import { getCorridorColor } from '@/data/corridorColors'
import { saveRoute, getLastRoute } from '@/utils/routeHistory'

export default function TransJakartaRouteSelector() {
  const [selectedOrigin, setSelectedOrigin] = useState('harmoni')
  const [selectedRouteId, setSelectedRouteId] = useState('langsung')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const availableRoutes = useMemo(() => {
    return getRoutesByOrigin(selectedOrigin)
  }, [selectedOrigin])

  const selectedRoute = useMemo(() => {
    return availableRoutes.find(r => r.id === selectedRouteId) || availableRoutes[0]
  }, [availableRoutes, selectedRouteId])

  const selectedOriginData = transjakartaOrigins.find(o => o.id === selectedOrigin)

  // Auto-load last saved route on mount
  useEffect(() => {
    const lastRoute = getLastRoute()
    if (lastRoute && lastRoute.transport === 'transjakarta') {
      setSelectedOrigin(lastRoute.origin)
      setSelectedRouteId(lastRoute.routeId)
    }
  }, [])

  // Save route to history whenever origin or routeId changes
  useEffect(() => {
    if (selectedOriginData && selectedRoute) {
      saveRoute({
        transport: 'transjakarta',
        origin: selectedOrigin,
        routeId: selectedRouteId,
        label: `TJ • ${selectedOriginData.name} → Glodok (${selectedRoute.title})`
      })
    }
  }, [selectedOrigin, selectedRouteId, selectedOriginData, selectedRoute])

  const handleOriginChange = (originId: string) => {
    setSelectedOrigin(originId)
    setDropdownOpen(false)
    const routes = getRoutesByOrigin(originId)
    if (!routes.find(r => r.id === selectedRouteId)) {
      setSelectedRouteId(routes[0].id)
    }
  }

  return (
    <div className="space-y-4">
      {/* Origin Dropdown */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Saya naik dari mana?
        </label>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition cursor-pointer"
        >
          <div className="text-left">
            <p className="font-medium text-gray-900">{selectedOriginData?.name}</p>
            <p className="text-xs text-gray-600">{selectedOriginData?.description}</p>
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-600 transition ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {transjakartaOrigins.map(origin => (
              <button
                key={origin.id}
                onClick={() => handleOriginChange(origin.id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition cursor-pointer ${selectedOrigin === origin.id ? 'bg-blue-100' : ''
                  }`}
              >
                <p className="font-medium text-gray-900">{origin.name}</p>
                <p className="text-xs text-gray-600">{origin.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Route Tabs */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Pilih Rute
        </label>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-min">
            {availableRoutes.map(route => (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 transition whitespace-nowrap cursor-pointer ${selectedRouteId === route.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
              >
                <p className="text-sm font-medium">{route.title}</p>
                <p className="text-xs text-gray-600">{route.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Route Details */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{selectedRoute.title}</h3>
            <p className="text-sm text-gray-600">{selectedRoute.description}</p>
          </div>
        </div>

        {/* Corridor Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedRoute.corridors.map(corridor => {
            const colors = getCorridorColor(corridor)
            return (
              <div key={corridor} className={`px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border} text-xs font-semibold flex items-center gap-1`}>
                <div className={`w-2 h-2 rounded-full ${colors.badge}`} />
                Koridor {corridor}
              </div>
            )
          })}
        </div>

        {/* Steps */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 text-sm mb-2">Langkah Perjalanan:</h4>
          <ol className="space-y-1">
            {selectedRoute.steps.map((step, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Maps Embed */}
        <div className="mb-4 rounded-lg overflow-hidden h-48">
          <iframe
            src={`https://www.google.com/maps?q=${selectedRoute.mapQuery}&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            title={`Peta ${selectedRoute.title}`}
          />
        </div>

        {/* Tips */}
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <h4 className="font-semibold text-gray-900 text-sm mb-2">💡 Tips Perjalanan:</h4>
          <ul className="space-y-1">
            {selectedRoute.tips.map((tip, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Link to Official */}
      <div className="text-center pt-2">
        <a
          href="https://www.transjakarta.co.id"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Cek rute lengkap di website resmi TransJakarta →
        </a>
      </div>
    </div>
  )
}
