'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DateNightCard from '@/components/DateNightCard'
import DateNightMemoryJournal from '@/components/DateNightMemoryJournal'
import { dateNights, DateNight } from '@/data/dateNights'

interface DateNightPageProps {
  onBack: () => void
  onViewAdventureBook?: () => void
}

export default function DateNightPage({ onBack, onViewAdventureBook }: DateNightPageProps) {
  const [currentDateNight, setCurrentDateNight] = useState<DateNight | null>(null)
  const [usedDateNights, setUsedDateNights] = useState<string[]>([])
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    // Load used date nights from localStorage
    const stored = localStorage.getItem('book-of-moments-used-dates')
    if (stored) {
      setUsedDateNights(JSON.parse(stored))
    }
  }, [])

  const getRandomDateNight = (): DateNight => {
    const available = dateNights.filter(d => !usedDateNights.includes(d.id))
    const pool = available.length > 0 ? available : dateNights
    
    const random = pool[Math.floor(Math.random() * pool.length)]
    return random
  }


  const handleReveal = () => {
    if (currentDateNight) {
      setIsRevealed(true)
      const newUsed = [...usedDateNights, currentDateNight.id]
      setUsedDateNights(newUsed)
      localStorage.setItem('book-of-moments-used-dates', JSON.stringify(newUsed))
    }
  }

  const handleGenerate = () => {
    setIsRevealed(false)
    const newDateNight = getRandomDateNight()
    setCurrentDateNight(newDateNight)
  }

  const handleReset = () => {
    if (confirm('Reset all used date nights? You can generate them again.')) {
      setUsedDateNights([])
      localStorage.removeItem('book-of-moments-used-dates')
      setCurrentDateNight(null)
    }
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-8 md:px-16 pb-24 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8 text-center"
      >
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
                Date Night Generator
              </h2>
              <p className="text-xl md:text-2xl text-warm-gray leading-relaxed mt-2" style={{ fontFamily: 'var(--font-body)' }}>
                Let serendipity choose your next moment together
              </p>
            </div>
            {onViewAdventureBook && (
              <button
                onClick={onViewAdventureBook}
                className="px-4 py-2 bg-rose/20 hover:bg-rose/30 text-rose rounded-full transition-all duration-300 font-handwritten text-lg"
                style={{ fontFamily: 'var(--font-handwritten)' }}
              >
                📖 Adventure Book
              </button>
            )}
          </div>
        </div>

        {/* Generate Button */}
        {!currentDateNight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleGenerate}
            className="px-12 py-5 bg-rose/25 hover:bg-rose/35 text-rose rounded-full transition-all duration-300 font-handwritten text-2xl md:text-3xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ fontFamily: 'var(--font-handwritten)' }}
          >
            Generate Date Night
          </motion.button>
        )}

        {/* Date Night Card */}
        {currentDateNight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <DateNightCard dateNight={currentDateNight} onReveal={handleReveal} />
            
            {/* Memory Journal - Show when revealed */}
            {isRevealed && currentDateNight && (
              <DateNightMemoryJournal dateNightId={currentDateNight.id} dateNightTitle={currentDateNight.title} />
            )}
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleGenerate}
                className="px-6 py-3 bg-rose/20 hover:bg-rose/30 text-rose rounded-full transition-all duration-300 font-handwritten text-lg"
                style={{ fontFamily: 'var(--font-handwritten)' }}
              >
                Generate Another
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-warm-gray/20 hover:bg-warm-gray/30 text-warm-gray rounded-full transition-all duration-300 font-handwritten text-lg"
                style={{ fontFamily: 'var(--font-handwritten)' }}
              >
                ← Back
              </button>
            </div>
          </motion.div>
        )}

        {/* Reset Button */}
        {usedDateNights.length > 0 && (
          <button
            onClick={handleReset}
            className="mt-8 text-warm-gray/60 hover:text-warm-gray text-sm underline"
          >
            Reset used date nights
          </button>
        )}
      </motion.div>
    </div>
  )
}

