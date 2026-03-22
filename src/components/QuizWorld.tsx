'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { QUIZ_QUESTIONS, ZONES, BADGES } from '@/data/gameData'
import { useGameContext } from '@/contexts/GameContext'
import { CheckCircle2, XCircle, Clock, Zap } from 'lucide-react'

interface QuizWorldProps {
  zoneId: string
  onClose: () => void
}

export default function QuizWorld({ zoneId, onClose }: QuizWorldProps) {
  const zone = ZONES.find(z => z.id === zoneId)
  
  // Memoize shuffled questions to prevent re-rendering changes
  const questions = useMemo(() => 
    QUIZ_QUESTIONS.filter(q => q.zoneId === zoneId).sort(() => Math.random() - 0.5),
    [zoneId]
  )
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [answered, setAnswered] = useState<Set<number>>(new Set())
  
  const { addScore, completeZone, unlockBadge, progress } = useGameContext()

  // Countdown timer
  useEffect(() => {
    if (showResult || quizComplete) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp()
          return 10
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, showResult])

  const handleTimeUp = () => {
    if (!showResult) {
      setShowResult(true)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer

  const handleAnswerClick = (optionIndex: number) => {
    if (showResult || answered.has(currentQuestionIndex)) return
    
    setSelectedAnswer(optionIndex)
    setShowResult(true)
    setAnswered(new Set([...answered, currentQuestionIndex]))
    
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + (timeLeft > 5 ? 100 : 50)) // Bonus untuk menjawab cepat
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(curr => curr + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(10)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = () => {
    setQuizComplete(true)
    addScore(zoneId, score)
    completeZone(zoneId)
    
    // Calculate perfect score dynamically
    const totalPossible = questions.length * 100
    const isPerfectScore = score === totalPossible
    
    // Check and unlock badges
    if (isPerfectScore) {
      unlockBadge('perfect-score')
    }
    
    // Zone completion badges
    if (zoneId === 'kota-tua') {
      unlockBadge('master-kota-tua')
    } else if (zoneId === 'kuliner') {
      unlockBadge('culinary-expert')
    } else if (zoneId === 'taman') {
      unlockBadge('nature-lover')
    } else if (zoneId === 'sejarah') {
      unlockBadge('history-scholar')
    } else if (zoneId === 'budaya') {
      unlockBadge('culture-enthusiast')
    }
  }

  if (quizComplete) {
    return <QuizResult zoneId={zoneId} score={score} totalPossible={questions.length * 100} onClose={onClose} />
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="min-h-screen flex items-center justify-center p-4"
        >
          <Card className="w-full max-w-2xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 border-0 shadow-2xl">
            {/* Header */}
            <CardHeader className="relative bg-white/10 backdrop-blur-sm border-b border-white/20">
              <div className="absolute right-4 top-4">
                <button
                  onClick={onClose}
                  className="text-white hover:text-yellow-300 transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl drop-shadow-lg">{zone?.emoji}</div>
                <div>
                  <CardTitle className="text-3xl font-bold text-white drop-shadow-md">{zone?.name}</CardTitle>
                  <CardDescription className="text-white/90 font-semibold">
                    Jakbar Quiz World
                  </CardDescription>
                </div>
              </div>

              {/* Progress and Stats */}
              <div className="space-y-4 bg-white/5 rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white/90">
                    Soal {currentQuestionIndex + 1} dari {questions.length}
                  </span>
                  <span className="text-lg font-bold text-yellow-300 drop-shadow-md bg-black/30 px-3 py-1 rounded-full">{score} Poin</span>
                </div>
                <div className="space-y-2">
                  <Progress 
                    value={((currentQuestionIndex + 1) / questions.length) * 100} 
                    className="h-3 bg-white/30"
                  />
                  <div className="text-xs text-white/80 text-center">Progress Quiz</div>
                </div>

                {/* Timer */}
                <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                  <div className={`flex items-center gap-2 font-bold text-lg ${
                    timeLeft <= 3 ? 'text-red-300 animate-pulse' : 'text-white'
                  }`}>
                    <Clock className="h-5 w-5" />
                    <span>{timeLeft}s</span>
                  </div>
                  <div className="text-xs text-white/80">
                    ⚡ Jawab cepat = bonus poin!
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-8 pb-6">
              {/* Question */}
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-xl p-6 mb-8 shadow-lg">
                  <h3 className="text-xl font-bold text-white leading-relaxed drop-shadow-md">
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const isAnswerShown = showResult
                    const isCorrectAnswer = index === currentQuestion.correctAnswer
                    
                    let buttonClass = 'bg-white/20 border-2 border-white/40 hover:bg-white/30 hover:border-white/60 text-white'

                    if (isAnswerShown) {
                      if (isCorrectAnswer) {
                        buttonClass = 'bg-green-500/30 border-2 border-green-400 text-white shadow-lg shadow-green-500/50'
                      } else if (isSelected && !isCorrect) {
                        buttonClass = 'bg-red-500/30 border-2 border-red-400 text-white shadow-lg shadow-red-500/50'
                      }
                    }

                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswerClick(index)}
                        disabled={showResult || answered.has(currentQuestionIndex)}
                        className={`w-full p-4 text-left border-2 rounded-lg transition-all font-medium ${
                          buttonClass
                        } ${
                          answered.has(currentQuestionIndex) ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold flex-shrink-0 ${
                            isAnswerShown && isCorrectAnswer ? 'border-green-400 bg-green-500/40 text-white' : ''
                          }${
                            isAnswerShown && isSelected && !isCorrect ? 'border-red-400 bg-red-500/40 text-white' : ''
                          }${
                            !isAnswerShown ? 'border-white/60 bg-white/20 text-white' : ''
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1 text-base leading-relaxed">{option}</span>
                          {isAnswerShown && isCorrectAnswer && (
                            <CheckCircle2 className="h-6 w-6 text-green-300 flex-shrink-0 drop-shadow-lg" />
                          )}
                          {isAnswerShown && isSelected && !isCorrect && (
                            <XCircle className="h-6 w-6 text-red-300 flex-shrink-0 drop-shadow-lg" />
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Explanation */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-lg border-2 backdrop-blur-sm ${
                      isCorrect
                        ? 'bg-green-500/20 border-green-400 shadow-lg shadow-green-500/30'
                        : 'bg-yellow-500/20 border-yellow-400 shadow-lg shadow-yellow-500/30'
                    }`}
                  >
                    <div className="flex gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-green-300 flex-shrink-0 drop-shadow-md mt-0.5" />
                      ) : (
                        <XCircle className="h-6 w-6 text-yellow-300 flex-shrink-0 drop-shadow-md mt-0.5" />
                      )}
                      <div>
                        <p className={`font-bold mb-2 text-lg ${
                          isCorrect ? 'text-green-200' : 'text-yellow-200'
                        }`}>
                          {isCorrect ? '✅ Jawaban Tepat!' : '❌ Jawaban Kurang Tepat'}
                        </p>
                        <p className="text-white/90 leading-relaxed">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Button */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    {currentQuestionIndex < questions.length - 1 ? '→ Soal Berikutnya' : '🏁 Lihat Hasil'}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function QuizResult({
  zoneId,
  score,
  totalPossible,
  onClose
}: {
  zoneId: string
  score: number
  totalPossible: number
  onClose: () => void
}) {
  const zone = ZONES.find(z => z.id === zoneId)
  const percentage = Math.round((score / totalPossible) * 100)
  const rank = percentage >= 90 ? '🏆 Master' : percentage >= 70 ? '⭐ Expert' : percentage >= 50 ? '🎯 Learner' : '📚 Novice'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-md bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 border-0 shadow-2xl overflow-hidden">
          <CardContent className="pt-12 pb-8 text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.8 }}
              className="text-7xl mb-6 drop-shadow-lg"
            >
              🎉
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">QUIZ COMPLETE!</h2>
            <p className="text-white/90 mb-8 text-lg font-semibold">{zone?.name}</p>

            <div className="bg-white/15 backdrop-blur-sm border-2 border-white/30 rounded-xl p-8 mb-8">
              <div className="text-6xl font-bold text-yellow-300 mb-3 drop-shadow-md drop-shadow-lg">
                {score}
              </div>
              <div className="text-white/90 mb-6 font-semibold">dari {totalPossible} poin</div>
              
              <div className="mb-6 space-y-3">
                <Progress value={percentage} className="h-4 bg-white/30 rounded-full" />
                <div className="text-2xl font-bold text-yellow-300 drop-shadow-md">{percentage}%</div>
              </div>

              <div className="bg-white/20 rounded-lg p-4 mb-2">
                <div className="text-4xl mb-2">{rank.split(' ')[0]}</div>
                <div className="text-xl font-bold text-white">{rank.split(' ')[1]}</div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {percentage >= 90 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Badge className="bg-yellow-400 text-black font-bold text-sm py-2 px-4 drop-shadow-lg">⭐ Master Sempurna!</Badge>
                </motion.div>
              )}
              {percentage >= 70 && percentage < 90 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Badge className="bg-blue-400 text-black font-bold text-sm py-2 px-4 drop-shadow-lg">✨ Luar Biasa!</Badge>
                </motion.div>
              )}
              {percentage >= 50 && percentage < 70 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Badge className="bg-green-400 text-black font-bold text-sm py-2 px-4 drop-shadow-lg">✅ Bagus!</Badge>
                </motion.div>
              )}
              {percentage < 50 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Badge className="bg-orange-400 text-black font-bold text-sm py-2 px-4 drop-shadow-lg">💪 Terus Belajar!</Badge>
                </motion.div>
              )}
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-white text-black hover:bg-yellow-100 font-bold py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              🎮 Kembali ke Adventure Mode
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
