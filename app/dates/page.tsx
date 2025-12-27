'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { generatePersonalizedDates } from '@/lib/dateTemplates'
import AppLayout from '@/components/navigation/AppLayout'
import DateGeneratorInput from '@/components/dates/DateGeneratorInput'
import GeneratedDateCard from '@/components/dates/GeneratedDateCard'
import type { DateGeneratorInput as GeneratorInput, GeneratedDate, SavedDate } from '@/types'
import { Bookmark, Sparkles } from 'lucide-react'

export default function DatesPage() {
  const { profiles, savedDates, lastGeneratedDates, setLastGeneratedDates } = useAppStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGenerator, setShowGenerator] = useState(true)

  const profileIds = Object.keys(profiles)
  const hasProfiles = profileIds.length >= 2

  const handleGenerate = async (input: GeneratorInput) => {
    if (!hasProfiles) return

    setIsGenerating(true)

    // Simulate generation delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const profile1 = profiles[profileIds[0]]
    const profile2 = profiles[profileIds[1]]

    // Get recently used template IDs
    const recentlyUsedIds = (savedDates || [])
      .filter((d) => {
        const savedDate = new Date(d.savedAt)
        const daysSince = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60 * 24)
        return daysSince < 14 // Last 2 weeks
      })
      .map((d) => d.templateId)

    const generatedDates = generatePersonalizedDates(input, profile1, profile2, recentlyUsedIds)

    setLastGeneratedDates(generatedDates)
    setIsGenerating(false)
    setShowGenerator(false)
  }

  const handleSave = (savedDate: SavedDate) => {
    console.log('Date saved:', savedDate.title)
  }

  return (
    <AppLayout>
      <div className="pb-24 px-4 pt-8 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Date Ideas</h1>
          <p className="text-gray-600">Personalized dates designed just for you two</p>
        </motion.div>

        {/* Saved Dates Summary */}
        {(savedDates?.length || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-6 flex items-center gap-3"
          >
            <Bookmark className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-purple-900">
                {savedDates?.length || 0} saved {(savedDates?.length || 0) === 1 ? 'date' : 'dates'}
              </p>
              <p className="text-xs text-purple-700">Access your saved dates anytime</p>
            </div>
          </motion.div>
        )}

        {/* Generator Input */}
        <AnimatePresence mode="wait">
          {showGenerator ? (
            <motion.div
              key="generator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DateGeneratorInput onGenerate={handleGenerate} isLoading={isGenerating} />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">Your Personalized Dates</h2>
                </div>
                <button
                  onClick={() => setShowGenerator(true)}
                  className="text-purple-600 text-sm font-semibold hover:text-purple-700 transition-colors"
                >
                  Generate New
                </button>
              </div>

              {/* Generated Date Cards */}
              <div className="space-y-6">
                {(lastGeneratedDates || []).map((date, index) => (
                  <motion.div
                    key={date.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <GeneratedDateCard date={date} onSave={handleSave} />
                  </motion.div>
                ))}
              </div>

              {/* Generate More Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowGenerator(true)}
                className="w-full py-4 rounded-2xl text-purple-600 bg-purple-50 hover:bg-purple-100 font-semibold text-sm transition-colors active:scale-[0.98]"
              >
                Try Different Preferences
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!hasProfiles && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Complete your profiles to get started</p>
            <button className="text-purple-600 font-semibold hover:text-purple-700">
              Set Up Profiles →
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

