'use client'

import { useState } from 'react'
import { GeneratedDate, SavedDate } from '@/types'
import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Bookmark,
  Share2,
  Play,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
} from 'lucide-react'

interface GeneratedDateCardProps {
  date: GeneratedDate
  onSave?: (savedDate: SavedDate) => void
}

export default function GeneratedDateCard({ date, onSave }: GeneratedDateCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [saved, setSaved] = useState(false)
  const { saveDate, coupleId } = useAppStore()

  const handleSave = () => {
    if (saved || !coupleId) return

    const savedDate: SavedDate = {
      id: `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      coupleId,
      templateId: date.id,
      title: date.title,
      description: date.description,
      whyItFits: date.whyItFits,
      steps: date.steps,
      virtualAdaptation: date.virtualAdaptation,
      savedAt: new Date().toISOString(),
      status: 'saved',
    }

    saveDate(savedDate)
    setSaved(true)
    onSave?.(savedDate)
  }

  const handleSchedule = () => {
    // TODO: Open calendar picker modal
    console.log('Schedule date:', date.title)
  }

  const handleStart = () => {
    // TODO: Open date detail modal with timer
    console.log('Start date:', date.title)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: date.title,
          text: `${date.description}\n\n${date.whyItFits}`,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
  }

  const getCategoryColor = () => {
    switch (date.category) {
      case 'quick':
        return 'from-purple-500 to-violet-600'
      case 'medium':
        return 'from-pink-500 to-rose-600'
      case 'special':
        return 'from-amber-500 to-orange-600'
      default:
        return 'from-purple-500 to-violet-600'
    }
  }

  const getCategoryBadge = () => {
    switch (date.category) {
      case 'quick':
        return '⚡ Quick'
      case 'medium':
        return '💝 Intentional'
      case 'special':
        return '✨ Special'
      default:
        return date.category
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${getCategoryColor()} p-6 text-white`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                {getCategoryBadge()}
              </span>
              <span className="text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                {date.duration}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{date.title}</h3>
            <p className="text-white/90 text-sm leading-relaxed">{date.description}</p>
          </div>
        </div>

        {/* Why it fits */}
        <div className="flex items-start gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-4 mt-4">
          <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-semibold mb-1">Why this fits you</p>
            <p className="text-sm leading-relaxed">{date.whyItFits}</p>
          </div>
        </div>
      </div>

      {/* Steps preview */}
      <div className="p-6">
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Steps</h4>
          <div className="space-y-3">
            {date.steps.slice(0, showDetails ? undefined : 2).map((step) => (
              <div key={step.number} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                  {step.number}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-700 text-sm leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          {date.steps.length > 2 && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-purple-600 text-sm font-medium mt-4 hover:text-purple-700 transition-colors"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show all {date.steps.length} steps
                </>
              )}
            </button>
          )}
        </div>

        <AnimatePresence>
          {showDetails && date.virtualAdaptation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 bg-blue-50 border border-blue-100 rounded-2xl p-4"
            >
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💻 Virtual Version</h4>
              <p className="text-sm text-blue-700 leading-relaxed">{date.virtualAdaptation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all ${
              saved
                ? 'bg-green-100 text-green-700 cursor-default'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200 active:scale-[0.98]'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="w-5 h-5" />
                Save
              </>
            )}
          </button>

          <button
            onClick={handleSchedule}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm bg-pink-100 text-pink-700 hover:bg-pink-200 active:scale-[0.98] transition-all"
          >
            <Calendar className="w-5 h-5" />
            Schedule
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={handleStart}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 active:scale-[0.98] transition-all shadow-md"
          >
            <Play className="w-5 h-5" />
            Start Date
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-[0.98] transition-all"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>
      </div>
    </motion.div>
  )
}
