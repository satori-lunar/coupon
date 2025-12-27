'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { generateWeeklySuggestions } from '@/lib/weeklySuggestions'
import { Heart, Check, Bookmark, Sparkles } from 'lucide-react'

export default function WeeklySuggestions() {
  const {
    currentUserId,
    couple,
    profiles,
    weeklySuggestions,
    addWeeklySuggestion,
    selectSuggestion,
    completeSuggestion,
  } = useAppStore()

  const [isGenerating, setIsGenerating] = useState(false)

  // Get current week
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(now)
  monday.setDate(now.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)
  const weekOf = monday.toISOString().split('T')[0]

  // Get partner info
  const partnerId = couple
    ? couple.partner1Id === currentUserId
      ? couple.partner2Id
      : couple.partner1Id
    : null
  const partnerProfile = partnerId ? profiles[partnerId] : null

  // Get this week's suggestions
  const thisWeekSuggestions = weeklySuggestions?.find(
    (s) => s.userId === currentUserId && s.weekOf === weekOf
  )

  // Generate suggestions if they don't exist
  useEffect(() => {
    if (!thisWeekSuggestions && currentUserId && partnerProfile && !isGenerating) {
      setIsGenerating(true)
      const newSuggestions = generateWeeklySuggestions(currentUserId, partnerProfile)
      if (newSuggestions) {
        addWeeklySuggestion(newSuggestions)
      }
      setIsGenerating(false)
    }
  }, [currentUserId, partnerProfile, thisWeekSuggestions, addWeeklySuggestion, isGenerating])

  if (isGenerating || !thisWeekSuggestions) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-purple-100/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-md">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Weekly Love Suggestions</h3>
            <p className="text-sm text-gray-500">Generating ideas...</p>
          </div>
        </div>
      </div>
    )
  }

  const partnerName = partnerProfile?.name || 'your partner'

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-purple-100/50">
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">Ways to Love {partnerName} This Week</h3>
          <p className="text-sm text-purple-600 font-medium">
            Based on their love language: {thisWeekSuggestions.loveLanguage}
          </p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {thisWeekSuggestions.suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl border-2 transition-all ${
              suggestion.completedAt
                ? 'bg-green-50 border-green-200'
                : suggestion.selected
                ? 'bg-purple-50 border-purple-300'
                : 'bg-gray-50 border-gray-200 hover:border-purple-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  {suggestion.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      suggestion.effort === 'low'
                        ? 'bg-green-100 text-green-700'
                        : suggestion.effort === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {suggestion.effort === 'low'
                      ? '🌱 Easy'
                      : suggestion.effort === 'medium'
                      ? '⚡ Moderate'
                      : '💪 High effort'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {!suggestion.completedAt && !suggestion.selected && (
                  <button
                    onClick={() => selectSuggestion(weekOf, suggestion.id)}
                    className="p-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                    title="Choose this one"
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                )}
                {suggestion.selected && !suggestion.completedAt && (
                  <button
                    onClick={() => completeSuggestion(weekOf, suggestion.id)}
                    className="p-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    title="Mark as done"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
                {suggestion.completedAt && (
                  <div className="p-2 rounded-xl bg-green-100 text-green-600">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-5 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
        <p className="text-xs text-gray-700 text-center">
          <span className="font-semibold">💜 No pressure:</span> Choose one, save for later, or
          skip. There is no penalty!
        </p>
      </div>
    </div>
  )
}
