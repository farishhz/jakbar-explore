'use client'

import { useMemo, useState, useEffect } from 'react'
import { krlOrigins } from '@/data/krlOrigins'
import { krlRoutes, getKrlRoutesByOrigin } from '@/data/krlRoutes'
import { getKrlLineColor } from '@/data/krlLineColors'
import { ChevronDown } from 'lucide-react'
import { saveRoute, getLastRoute } from '@/utils/routeHistory'

export default function KRLRouteSelector() {
  const [selectedOrigin, setSelectedOrigin] = useState('bogor')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const availableRoutes = useMemo(() => getKrlRoutesByOrigin(selectedOrigin), [selectedOrigin])
  const [selectedRouteId, setSelectedRouteId] = useState(availableRoutes[0]?.id || 'langsung')

  // Update selectedRouteId when availableRoutes change
  if (!availableRoutes.find(r => r.id === selectedRouteId)) {
    setSelectedRouteId(availableRoutes[0]?.id || 'langsung')
  }

  const selectedRoute = useMemo(() => availableRoutes.find(r => r.id === selectedRouteId) || availableRoutes[0], [availableRoutes, selectedRouteId])
  const selectedOriginLabel = krlOrigins.find(o => o.id === selectedOrigin)?.label || 'Bogor'

  // Auto-load last saved route on mount
  useEffect(() => {
    const lastRoute = getLastRoute()
    if (lastRoute && lastRoute.transport === 'krl') {
      setSelectedOrigin(lastRoute.origin)
      setSelectedRouteId(lastRoute.routeId)
    }
  }, [])

  // Save route to history whenever origin or routeId changes
  useEffect(() => {
    saveRoute({
      transport: 'krl',
      origin: selectedOrigin,
      routeId: selectedRouteId,
      label: `KRL • ${selectedOriginLabel} → Jakarta Kota (${selectedRoute?.title})`
    })
  }, [selectedOrigin, selectedRouteId, selectedRoute, selectedOriginLabel])

  const handleOriginChange = (id: string) => {
    setSelectedOrigin(id)
    setDropdownOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-900 mb-2">Saya naik KRL dari:</label>
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer">
          <div className="text-left">
            <p className="font-medium text-gray-900">{krlOrigins.find(o => o.id === selectedOrigin)?.label}</p>
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-600 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-56 overflow-y-auto">
            {krlOrigins.map(o => (
              <button key={o.id} onClick={() => handleOriginChange(o.id)} className={`w-full text-left px-4 py-3 hover:bg-blue-50 cursor-pointer ${selectedOrigin === o.id ? 'bg-blue-100' : ''}`}>
                <div className="font-medium">{o.label}</div>
                <div className="text-xs text-gray-600">{o.routes.join(', ')}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Pilih Rute</label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {availableRoutes.map(route => (
            <button key={route.id} onClick={() => setSelectedRouteId(route.id)} className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 whitespace-nowrap cursor-pointer ${selectedRouteId === route.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300'}`}>
              <div className="text-sm font-medium">{route.title}</div>
              <div className="text-xs text-gray-600">{route.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex gap-2 flex-wrap mt-2">
          {selectedRoute?.lines?.map(line => (
            <span key={line} className={`px-3 py-1 rounded-full text-xs text-white ${getKrlLineColor(line)}`}>
              {line}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 text-sm mb-2">Langkah Perjalanan</h4>
        <ol className="space-y-1 text-sm text-gray-700">
          {selectedRoute?.steps?.map((s, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">{idx + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mb-4 h-48 rounded-lg overflow-hidden">
        <iframe key={selectedRoute?.id} src={`https://www.google.com/maps?q=${selectedRoute?.mapQuery}&output=embed`} className="w-full h-full border-0" loading="lazy" title={`Peta ${selectedRoute?.title}`} />
      </div>

      <a href="https://commuterline.id/rute" target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline inline-block">Lihat rute resmi KRL Commuter Line →</a>
    </div>
  )
}
