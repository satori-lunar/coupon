'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { persistence } from '@/persistence/localStorageAdapter'
import { calculateHunger, calculateHappiness, getPetStatus } from '@/lib/petSystem'
import { getStreak } from '@/lib/streaks'
import { getCoins } from '@/lib/coins'
import PetDisplay from './PetDisplay'
import QuickActions from './QuickActions'
import DailyPrompt from './DailyPrompt'
import UpcomingDates from './UpcomingDates'
import type { Streak, ScheduledDate } from '@/types'

export default function Dashboard() {
  const { coupleId, pet, profiles, currentUserId } = useAppStore()
  const [streaks, setStreaks] = useState<Record<string, Streak>>({})
  const [coins, setCoins] = useState(0)
  const [upcomingDates, setUpcomingDates] = useState<ScheduledDate[]>([])

  useEffect(() => {
    if (!coupleId) return

    const loadData = async () => {
      // Load streaks
      const dateStreak = await getStreak(coupleId, 'dates')
      const journalStreak = await getStreak(coupleId, 'journal')
      setStreaks({
        dates: dateStreak || { coupleId, currentStreak: 0, longestStreak: 0, lastActivityDate: '', type: 'dates' },
        journal: journalStreak || { coupleId, currentStreak: 0, longestStreak: 0, lastActivityDate: '', type: 'journal' },
      })

      // Load coins
      const coinBalance = await getCoins(coupleId)
      setCoins(coinBalance)

      // Load upcoming dates
      const dates = await persistence.getScheduledDates(coupleId)
      setUpcomingDates(dates.filter(d => d.status === 'scheduled' && new Date(d.scheduledFor) >= new Date()))
    }

    loadData()
  }, [coupleId])

  if (!coupleId || !pet) {
    return <div>Loading...</div>
  }

  const currentProfile = profiles[currentUserId || '']
  const partnerId = coupleId === currentUserId ? Object.keys(profiles).find(id => id !== currentUserId) : currentUserId
  const partner = partnerId ? profiles[partnerId] : null

  const petHunger = calculateHunger(pet)
  const petHappiness = calculateHappiness(pet)
  const petStatus = getPetStatus(pet)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-blush p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-serif text-rose mb-2">
            Welcome back, {currentProfile?.name}!
          </h1>
          <p className="text-warm-gray">
            {partner && `Together with ${partner.name}`}
          </p>
        </motion.div>

        {/* Coins Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md text-center"
        >
          <p className="text-2xl font-serif text-rose">
            💰 {coins} Coins
          </p>
        </motion.div>

        {/* Pet Display */}
        <PetDisplay
          pet={pet}
          hunger={petHunger}
          happiness={petHappiness}
          status={petStatus}
        />

        {/* Streaks */}
        {(streaks.dates?.currentStreak > 0 || streaks.journal?.currentStreak > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md"
          >
            <h2 className="text-2xl font-serif text-rose mb-4">Streaks 🔥</h2>
            <div className="grid grid-cols-2 gap-4">
              {streaks.dates?.currentStreak > 0 && (
                <div>
                  <p className="text-soft-gray">Date Streak</p>
                  <p className="text-3xl font-bold text-rose">{streaks.dates.currentStreak} days</p>
                </div>
              )}
              {streaks.journal?.currentStreak > 0 && (
                <div>
                  <p className="text-soft-gray">Journal Streak</p>
                  <p className="text-3xl font-bold text-rose">{streaks.journal.currentStreak} days</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Upcoming Dates */}
        {upcomingDates.length > 0 && (
          <UpcomingDates dates={upcomingDates} />
        )}

        {/* Daily Prompt */}
        <DailyPrompt />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  )
}

