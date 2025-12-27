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

  // Get couple profiles for accessibility recommendations
  const profileIds = Object.keys(profiles)
  const profile1 = profileIds.length > 0 ? profiles[profileIds[0]] : null
  const profile2 = profileIds.length > 1 ? profiles[profileIds[1]] : null

  const accessibilityRecommendations = profile1 && profile2
    ? getAccessibilityRecommendations(date, profile1, profile2)
    : []

  const handleSchedule = () => {
    if (coupleId) {
      addScheduledDate({
        id: date.id,
        coupleId,
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
        <div className="flex items-center gap-2 mt-2">
          <span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
            {date.category || 'General'}
          </span>
          {date.tags?.budget && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
              <span>$</span>
              {date.tags.budget}
            </span>
          )}
        </div>
      </div>

      {why.length > 0 && (
        <div className="p-3 rounded-xl bg-accent-light">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-accent">💝</span>
            <p className="ios-text-subhead font-medium">Why this fits you:</p>
          </div>
          <p className="ios-text-body text-text-secondary">{why.join(', ')}</p>
        </div>
      )}

      {/* Accessibility Notes */}
      {accessibilityNotes.length > 0 && (
        <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-600">⚠️</span>
            <p className="ios-text-subhead font-medium text-yellow-800">Accessibility Notes</p>
          </div>
          <ul className="space-y-1">
            {accessibilityNotes.map((note, index) => (
              <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Virtual/Physical Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsVirtual(false)}
          className={`flex-1 ios-button ${!isVirtual ? 'ios-button-primary' : 'ios-button-secondary'}`}
        >
          <MapPin size={16} className="inline mr-2" />
          In Person
        </button>
        <button
          onClick={() => setIsVirtual(true)}
          className={`flex-1 ios-button ${isVirtual ? 'ios-button-primary' : 'ios-button-secondary'}`}
        >
          <Video size={16} className="inline mr-2" />
          Virtual
        </button>
      </div>

      {/* Show Details Toggle */}
      {!showDetails ? (
        <button
          onClick={() => setShowDetails(true)}
          className="ios-button-secondary w-full"
        >
          View Details & Steps
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="ios-text-title-3 mb-3 flex items-center gap-2">
              <span>👥</span>
              Steps:
            </h3>
            <ol className="space-y-2">
              {date.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center ios-text-caption-1 font-medium">
                    {index + 1}
                  </span>
                  <span className="ios-text-body flex-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Creative Prompts */}
          {date.prompts && date.prompts.length > 0 && (
            <div>
              <h3 className="ios-text-title-3 mb-3 flex items-center gap-2">
                💡 Creative Prompts:
              </h3>
              <ul className="space-y-2">
                {date.prompts.map((prompt, index) => (
                  <li key={index} className="flex gap-3 p-3 rounded-lg bg-background border border-separator">
                    <span className="text-accent">•</span>
                    <span className="ios-text-body flex-1">{prompt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Virtual Alternative */}
          {isVirtual && date.virtualAdaptation && (
            <div className="p-3 rounded-xl bg-background border border-separator">
              <h4 className="ios-text-body font-medium mb-2 flex items-center gap-2">
                <Video size={14} className="text-accent" />
                Virtual Alternative:
              </h4>
              <p className="ios-text-body">{date.virtualAdaptation}</p>
            </div>
          )}

          <button
            onClick={() => setShowDetails(false)}
            className="ios-button-secondary w-full"
          >
            Hide Details
          </button>
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

// Helper function for accessibility recommendations
function getAccessibilityRecommendations(date: DateNight, profile1: any, profile2: any): string[] {
  const recommendations: string[] = []
  const allDisabilities = [...(profile1.disabilities || []), ...(profile2.disabilities || [])]

  if (allDisabilities.length === 0) {
    return recommendations
  }

  // Mobility considerations
  if (allDisabilities.includes('mobility')) {
    if (date.tags?.outdoors) {
      recommendations.push('Choose venues with ramps and elevators')
    }
    recommendations.push('Consider transportation accessibility')
  }

  // Visual accessibility
  if (allDisabilities.includes('visual')) {
    recommendations.push('Choose well-lit venues')
    recommendations.push('Consider audio descriptions or familiar venues')
  }

  // Hearing accessibility
  if (allDisabilities.includes('hearing')) {
    recommendations.push('Choose quieter venues when possible')
    recommendations.push('Consider visual communication aids')
  }

  if (profile1.mobilityLevel === 'wheelchair' || profile2.mobilityLevel === 'wheelchair') {
    recommendations.push('Verify wheelchair accessibility in advance')
    recommendations.push('Check parking and entrance accessibility')
  }

  return recommendations
}