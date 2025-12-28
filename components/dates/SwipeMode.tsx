'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Clock, Sparkles } from 'lucide-react'
import type { GeneratedDate } from '@/types'

interface SwipeModeProps {
  dates: GeneratedDate[] // 30 dates
  onComplete: (matches: GeneratedDate[]) => void
  onCancel: () => void
}

export default function SwipeMode({ dates, onComplete, onCancel }: SwipeModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mySwipes, setMySwipes] = useState<Record<string, boolean>>({}) // dateId -> yes/no
  const [partnerSwipes, setPartnerSwipes] = useState<Record<string, boolean>>({}) // Simulated for demo
  const [timeRemaining, setTimeRemaining] = useState(120) // 2 minutes
  const [isComplete, setIsComplete] = useState(false)
  const [matches, setMatches] = useState<GeneratedDate[]>([])

  const currentDate = dates[currentIndex]
  const progressPercent = ((currentIndex + 1) / dates.length) * 100

  // 2-minute timer
  useEffect(() => {
    if (timeRemaining <= 0 || isComplete) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, isComplete])

  const handleTimeUp = () => {
    finishSwiping()
  }

  const handleSwipe = (liked: boolean) => {
    if (!currentDate) return

    // Record swipe
    setMySwipes(prev => ({ ...prev, [currentDate.id]: liked }))

    // Simulate partner swipe (in real app, this would be real-time)
    const partnerLiked = Math.random() > 0.4 // 60% chance partner also likes it
    setPartnerSwipes(prev => ({ ...prev, [currentDate.id]: partnerLiked }))

    // Move to next
    if (currentIndex < dates.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      finishSwiping()
    }
  }

  const finishSwiping = () => {
    // Find matches (both swiped yes)
    const matchedDates = dates.filter(date =>
      mySwipes[date.id] && partnerSwipes[date.id]
    )

    // Take first 3 matches
    const topMatches = matchedDates.slice(0, 3)
    setMatches(topMatches)
    setIsComplete(true)
  }

  const handleSelectWinner = () => {
    if (matches.length === 0) {
      onComplete([])
      return
    }

    // Randomly select 1 winning date from matches
    const randomIndex = Math.floor(Math.random() * matches.length)
    const winner = matches[randomIndex]
    onComplete([winner])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isComplete) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {matches.length > 0 ? `You matched on ${matches.length} dates!` : 'No matches yet'}
          </h2>
          <p className="text-gray-600">
            {matches.length > 0
              ? "Here are your top picks. We'll randomly select one for you!"
              : "Try swiping again with different preferences"}
          </p>
        </div>

        {matches.length > 0 && (
          <div className="space-y-3 mb-6">
            {matches.map((date, index) => (
              <motion.div
                key={date.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-purple-50 rounded-2xl border border-purple-200"
              >
                <p className="font-semibold text-gray-900 mb-1">{date.title}</p>
                <p className="text-sm text-gray-600">{date.description}</p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          {matches.length > 0 && (
            <button
              onClick={handleSelectWinner}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold hover:from-purple-600 hover:to-violet-700 transition-all shadow-md"
            >
              Pick One For Us!
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!currentDate) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No dates available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-purple-100">
      {/* Header with Timer */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-semibold text-purple-600">
            {currentIndex + 1} of {dates.length}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
          <Clock className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-bold text-purple-900">{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          className="bg-gradient-to-r from-purple-500 to-violet-600 h-full rounded-full"
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Date Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDate.id}
          initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.95, rotateY: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 mb-6 border-2 border-purple-200"
        >
          <div className="mb-4">
            <div className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full mb-3">
              {currentDate.category === 'quick' && '⚡ Quick'}
              {currentDate.category === 'medium' && '💝 Intentional'}
              {currentDate.category === 'special' && '✨ Special'}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentDate.title}</h3>
            <p className="text-gray-700 leading-relaxed">{currentDate.description}</p>
          </div>

          <div className="bg-white/60 rounded-2xl p-4">
            <p className="text-sm font-semibold text-purple-900 mb-2">Why it fits:</p>
            <p className="text-sm text-gray-700">{currentDate.whyItFits}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swipe Buttons */}
      <div className="flex gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe(false)}
          className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          <X className="w-5 h-5" />
          Pass
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe(true)}
          className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold hover:from-purple-600 hover:to-violet-700 transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5" />
          Love It
        </motion.button>
      </div>

      {/* Cancel Button */}
      <button
        onClick={onCancel}
        className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        Cancel Session
      </button>
    </div>
  )
}
