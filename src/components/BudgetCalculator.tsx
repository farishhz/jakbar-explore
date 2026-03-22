'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Bus, Train, UtensilsCrossed, Camera, ShoppingBag, MapPin, Sparkles } from 'lucide-react'

interface BudgetPackage {
  name: string
  icon: React.ReactNode
  minBudget: number
  maxBudget: number
  description: string
  items: string[]
  color: {
    bg: string
    bgGradient: string
    accent: string
    text: string
    badge: string
  }
}

const budgetPackages: Record<string, BudgetPackage> = {
  pelajar: {
    name: 'Paket Pelajar',
    icon: <span className="text-2xl">🎒</span>,
    minBudget: 25000,
    maxBudget: 50000,
    description: 'Hemat dan realistis',
    items: [
      '🚌 Transportasi TJ / KRL',
      '🍜 Jajan kaki lima',
      '📸 Gratis foto spot',
      '🎫 Museum kecil (opsional)'
    ],
    color: {
      bg: 'bg-white',
      bgGradient: 'from-white to-green-50',
      accent: 'text-green-600',
      text: 'text-green-900',
      badge: 'bg-green-100 text-green-700'
    }
  },
  sultan: {
    name: 'Paket Sultan',
    icon: <span className="text-2xl">💎</span>,
    minBudget: 150000,
    maxBudget: 500000,
    description: 'Premium dan bebas',
    items: [
      '🚗 Transportasi online',
      '🍽️ Cafe & resto favorit',
      '🛍️ Oleh-oleh premium',
      '🎭 Aktivitas & hiburan'
    ],
    color: {
      bg: 'bg-gradient-to-br from-purple-900 to-purple-700',
      bgGradient: 'from-purple-900 to-purple-600',
      accent: 'text-purple-200',
      text: 'text-purple-50',
      badge: 'bg-purple-400/30 text-purple-100'
    }
  }
}

export default function BudgetCalculator() {
  const [budget, setBudget] = useState(40000)
  const [recommendedPackage, setRecommendedPackage] = useState<string>('pelajar')

  // Determine recommended package based on budget
  useEffect(() => {
    if (budget < 100000) {
      setRecommendedPackage('pelajar')
    } else {
      setRecommendedPackage('sultan')
    }
  }, [budget])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const getPackageMatch = (packageKey: string) => {
    const pkg = budgetPackages[packageKey]
    const isInRange = budget >= pkg.minBudget && budget <= pkg.maxBudget
    const isRecommended = packageKey === recommendedPackage

    if (isRecommended) return 'recommended' // Recommended
    if (isInRange) return 'suitable' // Suitable but not recommended
    return 'unsuitable' // Not suitable
  }

  return (
    <section id="budget" className="py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Badge className="mb-3 px-4 py-1 bg-yellow-100 text-yellow-700 font-semibold text-sm">
            💸 Fitur Unik
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Berapa Uang Saku Saya?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estimasi budget pelajar vs budget sultan untuk menjelajahi Glodok
          </p>
        </motion.div>

        {/* Budget Slider Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">💰</span>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Budget kamu</h3>
              <p className="text-sm text-gray-500">Geser slider untuk mengubah budget</p>
            </div>
          </div>

          {/* Budget Display */}
          <div className="text-center mb-8">
            <p className="text-5xl font-bold text-green-600">
              {formatCurrency(budget)}
            </p>
          </div>

          {/* Slider */}
          <div className="px-2">
            <Slider
              value={[budget]}
              onValueChange={(value) => setBudget(value[0])}
              min={20000}
              max={500000}
              step={10000}
              className="w-full"
            />
            <div className="flex justify-between mt-4 text-xs text-gray-500">
              <span>Rp 20.000</span>
              <span>Rp 500.000</span>
            </div>
          </div>
        </motion.div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {Object.entries(budgetPackages).map(([key, pkg], idx) => {
            const matchStatus = getPackageMatch(key)
            const isRecommended = matchStatus === 'recommended'
            const isVisible = matchStatus !== 'unsuitable' || true // Show all cards

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className={isRecommended ? 'md:col-span-1 md:scale-105' : ''}
              >
                <div className="relative h-full">
                  {/* Recommended Badge */}
                  {isRecommended && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                    >
                      <Badge className="bg-green-500 text-white font-bold px-4 py-1 text-sm">
                        ✅ DIREKOMENDASIKAN
                      </Badge>
                    </motion.div>
                  )}

                  {/* Card */}
                  <Card
                    className={`h-full transition-all duration-300 ${
                      key === 'pelajar'
                        ? 'border-green-200 shadow-md hover:shadow-lg'
                        : 'border-purple-300 shadow-lg hover:shadow-xl'
                    } ${isRecommended ? 'ring-2 ring-green-400' : ''}`}
                  >
                    {/* Header */}
                    <CardHeader
                      className={`${
                        key === 'pelajar'
                          ? 'bg-gradient-to-r from-white to-green-50'
                          : `bg-gradient-to-r ${pkg.color.bgGradient}`
                      } transition-all`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {pkg.icon}
                            <CardTitle
                              className={`text-2xl ${
                                key === 'pelajar'
                                  ? 'text-gray-900'
                                  : 'text-white'
                              }`}
                            >
                              {pkg.name}
                            </CardTitle>
                          </div>
                          <CardDescription
                            className={
                              key === 'pelajar'
                                ? 'text-gray-600 text-sm'
                                : 'text-purple-100 text-sm'
                            }
                          >
                            Rp {pkg.minBudget.toLocaleString()} – {pkg.maxBudget.toLocaleString()}+
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Content */}
                    <CardContent
                      className={`p-6 ${
                        key === 'pelajar' ? 'bg-white' : 'bg-purple-950'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Items */}
                        <div>
                          <h4
                            className={`font-semibold mb-3 ${
                              key === 'pelajar'
                                ? 'text-gray-900'
                                : 'text-purple-100'
                            }`}
                          >
                            Apa yang didapat:
                          </h4>
                          <div className="space-y-2">
                            {pkg.items.map((item, i) => (
                              <div
                                key={i}
                                className={`flex items-center gap-3 text-sm ${
                                  key === 'pelajar'
                                    ? 'text-gray-700'
                                    : 'text-purple-100'
                                }`}
                              >
                                <span className="text-lg">{item.split(' ')[0]}</span>
                                <span>{item.substring(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Divider */}
                        <div
                          className={`h-px ${
                            key === 'pelajar'
                              ? 'bg-gray-200'
                              : 'bg-purple-700'
                          }`}
                        />

                        {/* Vibe */}
                        <div>
                          <p
                            className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                              key === 'pelajar'
                                ? 'text-gray-500'
                                : 'text-purple-300'
                            }`}
                          >
                            Kesan
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              key === 'pelajar'
                                ? 'text-green-700'
                                : 'text-purple-200'
                            }`}
                          >
                            {key === 'pelajar'
                              ? '💚 Hemat, realistis & fun'
                              : '✨ Premium, bebas & berkesan'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Recommendation Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">💡</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">Rekomendasi untuk kamu:</h4>
                <p className="text-gray-700">
                  Dengan budget{' '}
                  <span className="font-bold text-green-600">{formatCurrency(budget)}</span>,
                  kami merekomendasikan{' '}
                  <span className="font-bold">
                    {budgetPackages[recommendedPackage].name}
                  </span>
                  . {
                    recommendedPackage === 'pelajar'
                      ? 'Hemat dan seru untuk dijelajahi dengan teman!'
                      : 'Nikmati pengalaman premium yang tak terlupakan!'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
