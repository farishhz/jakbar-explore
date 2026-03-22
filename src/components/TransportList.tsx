'use client'

import { useState } from 'react'
import { transports } from '@/data/transport'
import TransportModal from './TransportModal'

export default function TransportList() {
  const [active, setActive] = useState<any>(null)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {transports.map((t) => (
          <div
            key={t.id}
            onClick={() => setActive(t)}
            className="cursor-pointer rounded-2xl border p-4 hover:shadow-md transition bg-white"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{t.icon}</span>
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-sm text-gray-600">{t.desc}</p>
              </div>
            </div>

            <div className="mt-3 text-sm">
              <p>💰 {t.cost}</p>
              <p>⏱️ {t.time}</p>
            </div>

            <p className="mt-2 text-blue-600 text-sm font-medium">
              Lihat Rute →
            </p>
          </div>
        ))}
      </div>

      {active && (
        <TransportModal data={active} onClose={() => setActive(null)} />
      )}
    </>
  )
}
