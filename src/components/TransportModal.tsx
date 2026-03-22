'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import TransJakartaRouteSelector from './transport/TransJakartaRouteSelector'
import KRLRouteSelector from './transport/KRLRouteSelector'
import LastRoutes from './LastRoutes'

interface TransportData {
  id: string
  title: string
  icon: string
  desc: string
  cost: string
  time: string
  mapsEmbed: string
  mapsUrl: string
  steps: string[]
}

export default function TransportModal({ data, onClose }: { data: TransportData | null; onClose: () => void }) {
  if (!data) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full md:max-w-xl rounded-t-3xl md:rounded-2xl p-5 max-h-[90vh] overflow-y-auto"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{data.icon}</span>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{data.title}</h2>
              <p className="text-sm text-gray-600">{data.desc}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Special handlers: TransJakarta & KRL */}
          {data.id === 'transjakarta' ? (
            <>
              <TransJakartaRouteSelector />
              <LastRoutes />
            </>
          ) : data.id === 'krl' ? (
            <>
              <KRLRouteSelector />
              <LastRoutes />
            </>
          ) : (
            <>
              {/* MAP */}
              <div className="w-full h-56 rounded-xl overflow-hidden my-4">
                <iframe
                  src={data.mapsEmbed}
                  className="w-full h-full border-0"
                  loading="lazy"
                  title={`Rute ${data.title}`}
                />
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Biaya</p>
                  <p className="font-semibold text-gray-900">{data.cost}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Waktu</p>
                  <p className="font-semibold text-gray-900">{data.time}</p>
                </div>
              </div>

              {/* STEP */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Langkah Perjalanan</h3>
                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                  {data.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-3">
                <a
                  href={data.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-blue-600 text-white text-center py-2 rounded-xl hover:bg-blue-700 transition"
                >
                  📍 Buka Google Maps
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 border py-2 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
