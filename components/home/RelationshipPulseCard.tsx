'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Heart, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RelationshipPulseCard() {
  const { currentUserId, coupleId, moodCheckIns, addMoodCheckIn } = useAppStore()
  const [selectedMood, setSelectedMood] = useState<'connected' | 'okay' | 'distant' | null>(null)
  const [showCheckIn, setShowCheckIn] = useState(false)

  const today = new Date().toDateString()
  const todayCheckIn = moodCheckIns?.find(
    checkIn => checkIn.date === today && checkIn.userId === currentUserId
  )

  const handleMoodSelect = (mood: 'connected' | 'okay' | 'distant') => {
    setSelectedMood(mood)
    if (currentUserId && coupleId) {
      addMoodCheckIn({
        id: Date.now().toString(),
        userId: currentUserId,
        coupleId,
        mood,
        date: today,
      })
      setShowCheckIn(false)
    }
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'connected': return '💚'
      case 'okay': return '💛'
      case 'distant': return '💙'
      default: return '💜'
    }
  }

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case 'connected': return 'Connected'
      case 'okay': return 'Okay'
      case 'distant': return 'Distant'
      default: return ''
    }
  }

  return (
    <div className="ios-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Heart size={20} className="text-accent" />
        <h2 className="ios-text-title-3">Relationship Pulse</h2>
      </div>

      {todayCheckIn ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getMoodEmoji(todayCheckIn.mood)}</span>
            <div>
              <p className="ios-text-body font-medium">Today I feel: {getMoodLabel(todayCheckIn.mood)}</p>
              {todayCheckIn.note && (
                <p className="ios-text-secondary text-subhead mt-1">{todayCheckIn.note}</p>
              )}
            </div>
            <CheckCircle2 size={20} className="text-accent ml-auto" />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="ios-text-body">How are you feeling today?</p>
          <div className="flex gap-2">
            {(['connected', 'okay', 'distant'] as const).map((mood) => (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className="flex-1 ios-card-interactive p-4 flex flex-col items-center gap-2"
              >
                <span className="text-3xl">{getMoodEmoji(mood)}</span>
                <span className="ios-text-subhead">{getMoodLabel(mood)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

