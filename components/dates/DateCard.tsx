'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Calendar, MapPin, Video } from 'lucide-react'
import type { DateNight } from '@/types'

interface DateCardProps {
  date: DateNight
  why?: string[]
  accessibilityNotes?: string[]
  budgetTier?: 'low' | 'medium' | 'high'
}

export default function DateCard({ date, why = [], accessibilityNotes = [], budgetTier }: DateCardProps) {
  const { addScheduledDate, coupleId, profiles } = useAppStore()
  const [isVirtual, setIsVirtual] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  // Get current user profile for long distance check
  const currentUserId = Object.keys(profiles)[0]
  const currentUser = currentUserId ? profiles[currentUserId] : null
  const isLongDistance = currentUser?.isLongDistance || false

  const handleSchedule = () => {
    if (coupleId) {
      addScheduledDate({
        id: `${date.id}-${Date.now()}`,
        coupleId,
        dateNightId: date.id,
        title: date.title,
        scheduledFor: new Date().toISOString(),
        status: 'scheduled',
      })
      setShowSchedule(false)
    }
  }

  return (
    <div className="ios-card p-5 space-y-4">
      <div>
        <h2 className="ios-text-title-2 mb-2">{date.title}</h2>
        <p className="ios-text-body text-text-secondary">{date.description}</p>
      </div>

      {/* Why it matches */}
      {why.length > 0 && (
        <div className="p-3 rounded-xl bg-accent-light">
          <p className="ios-text-subhead font-medium mb-2">Why this fits you:</p>
          <ul className="space-y-1">
            {why.map((reason, index) => (
              <li key={index} className="ios-text-body text-text-secondary text-sm">
                • {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Budget info */}
      {budgetTier && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200">
          <p className="ios-text-subhead font-medium text-green-800">
            Budget: {budgetTier.charAt(0).toUpperCase() + budgetTier.slice(1)}
          </p>
        </div>
      )}

      {/* Accessibility notes */}
      {accessibilityNotes.length > 0 && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
          <p className="ios-text-subhead font-medium text-blue-800 mb-1">Accessibility Notes:</p>
          <ul className="space-y-1">
            {accessibilityNotes.map((note, index) => (
              <li key={index} className="ios-text-body text-blue-700 text-sm">
                • {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Virtual/In-person toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsVirtual(false)}
          className={`flex-1 ios-button ${!isVirtual ? 'ios-button-primary' : 'ios-button-secondary'}`}
          disabled={isLongDistance && !date.virtualAdaptation}
        >
          <MapPin size={16} className="inline mr-2" />
          In Person
          {isLongDistance && !date.virtualAdaptation && (
            <span className="block text-xs opacity-75">Not available</span>
          )}
        </button>
        <button
          onClick={() => setIsVirtual(true)}
          className={`flex-1 ios-button ${isVirtual ? 'ios-button-primary' : 'ios-button-secondary'}`}
        >
          <Video size={16} className="inline mr-2" />
          Virtual
          {date.virtualAdaptation && <span className="block text-xs opacity-75">Available</span>}
        </button>
      </div>

      {/* Steps */}
      <div>
        <h3 className="ios-text-title-3 mb-3">Steps:</h3>
        <ol className="space-y-2">
          {(isVirtual ? date.virtualAdaptation?.split('\n') : date.steps) ?.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center ios-text-caption-1 font-medium">
                {index + 1}
              </span>
              <span className="ios-text-body flex-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Virtual adaptation */}
      {isVirtual && date.virtualAdaptation && (
        <div className="p-3 rounded-xl bg-background border border-separator">
          <p className="ios-text-subhead font-medium mb-2">Virtual Adaptation:</p>
          <p className="ios-text-body">{date.virtualAdaptation}</p>
        </div>
      )}

      {/* Creative prompts for creative dates */}
      {date.category === 'creative' && date.prompts && (
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
          <p className="ios-text-subhead font-medium text-purple-800 mb-2">Creative Prompts:</p>
          <ul className="space-y-1">
            {date.prompts.map((prompt, index) => (
              <li key={index} className="ios-text-body text-purple-700 text-sm">
                • {prompt}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="flex-1 ios-button-secondary"
        >
          <Calendar size={16} className="inline mr-2" />
          Schedule
        </button>
        <button className="flex-1 ios-button-primary">
          Save to Favorites
        </button>
      </div>

      {showSchedule && (
        <div className="p-3 rounded-xl bg-background border border-separator">
          <label className="block ios-text-body font-medium mb-2">
            When would you like to do this date?
          </label>
          <input
            type="datetime-local"
            className="w-full p-3 rounded-lg border border-separator bg-card ios-text-body"
            min={new Date().toISOString().slice(0, 16)}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setShowSchedule(false)}
              className="flex-1 ios-button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              className="flex-1 ios-button-primary"
            >
              Schedule Date
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

