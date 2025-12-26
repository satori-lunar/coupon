'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { persistence } from '@/persistence/localStorageAdapter'
import { generateDateSuggestions } from '@/lib/dateGenerator'
import { recordActivity } from '@/lib/petSystem'
import { awardCoins, COIN_REWARDS } from '@/lib/coins'
import { updateStreak } from '@/lib/streaks'
import type { Profile, DateNight, ScheduledDate } from '@/types'
import Link from 'next/link'

export default function DateGeneratorPage() {
  const { coupleId, profiles, pet } = useAppStore()
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<any>(null)

  useEffect(() => {
    if (coupleId && Object.keys(profiles).length >= 2) {
      loadSuggestions()
    }
  }, [coupleId, profiles])

  const loadSuggestions = async () => {
    setLoading(true)
    const profileIds = Object.keys(profiles)
    if (profileIds.length < 2 || !coupleId) return

    const profile1 = profiles[profileIds[0]]
    const profile2 = profiles[profileIds[1]]

    // Get recently used dates
    const scheduledDates = await persistence.getScheduledDates(coupleId)
    const recentlyUsed = scheduledDates
      .filter(d => d.status === 'completed')
      .slice(-14)
      .map(d => d.dateNightId)

    const dateSuggestions = await generateDateSuggestions(profile1, profile2, recentlyUsed)
    setSuggestions(dateSuggestions)
    setLoading(false)
  }

  const handleScheduleDate = async (date: DateNight) => {
    const scheduledFor = prompt('Enter date (YYYY-MM-DD):')
    if (!scheduledFor) return

    const scheduledDate: ScheduledDate = {
      id: `date-${Date.now()}`,
      coupleId: coupleId!,
      dateNightId: date.id,
      scheduledFor: new Date(scheduledFor).toISOString(),
      status: 'scheduled',
    }

    await persistence.saveScheduledDate(scheduledDate)
    alert('Date scheduled!')
  }

  const handleCompleteDate = async (date: DateNight) => {
    if (!pet || !coupleId) return

    // Record activity
    await recordActivity(pet, 'date')
    
    // Award coins
    await awardCoins(coupleId, COIN_REWARDS.COMPLETE_DATE, 'Completed date')
    
    // Update streak
    await updateStreak(coupleId, 'dates')

    alert('Date completed! Your pet is happy and you earned coins!')
  }

  if (!coupleId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-blush flex items-center justify-center">
        <Link href="/" className="text-rose text-xl font-serif">
          Please complete onboarding first
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-blush p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-rose mb-4 inline-block font-serif">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-serif text-rose mb-8">Date Night Generator 💕</h1>

        {loading ? (
          <div className="text-center text-warm-gray">Generating perfect dates...</div>
        ) : (
          <div className="space-y-6">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.date.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md"
              >
                <h2 className="text-2xl font-serif text-rose mb-2">{suggestion.date.title}</h2>
                <p className="text-warm-gray mb-4">{suggestion.date.description}</p>

                {suggestion.reasons.length > 0 && (
                  <div className="bg-cream rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-soft-gray mb-2">Why this date?</p>
                    <ul className="list-disc list-inside text-sm text-warm-gray space-y-1">
                      {suggestion.reasons.map((reason: string, i: number) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedDate?.id === suggestion.date.id ? (
                  <div className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-serif text-rose mb-2">Steps:</h3>
                      <ol className="list-decimal list-inside text-warm-gray space-y-1">
                        {suggestion.date.steps.map((step: string, i: number) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {suggestion.date.shoppingList && (
                      <div>
                        <h3 className="font-serif text-rose mb-2">Shopping List:</h3>
                        <ul className="list-disc list-inside text-warm-gray">
                          {suggestion.date.shoppingList.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleScheduleDate(suggestion.date)}
                        className="px-6 py-3 bg-rose text-white rounded-full font-serif hover:bg-muted-rose transition-colors"
                      >
                        Schedule
                      </button>
                      <button
                        onClick={() => handleCompleteDate(suggestion.date)}
                        className="px-6 py-3 bg-muted-rose text-white rounded-full font-serif hover:bg-rose transition-colors"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedDate(selectedDate?.id === suggestion.date.id ? null : suggestion.date)}
                    className="px-6 py-3 bg-rose text-white rounded-full font-serif hover:bg-muted-rose transition-colors"
                  >
                    View Details
                  </button>
                )}
              </motion.div>
            ))}

            <motion.button
              onClick={loadSuggestions}
              className="w-full px-8 py-4 bg-muted-rose text-white rounded-full text-lg font-serif hover:bg-rose transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Generate New Dates
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}

