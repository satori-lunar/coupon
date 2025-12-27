'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { DateGeneratorInput } from '@/types'
import { Sparkles } from 'lucide-react'

interface DateGeneratorInputProps {
  onGenerate: (input: DateGeneratorInput) => void
  isLoading?: boolean
}

const INTERESTS = [
  { value: 'art', label: 'Art', emoji: '🎨' },
  { value: 'cooking', label: 'Cooking', emoji: '👨‍🍳' },
  { value: 'movies', label: 'Movies', emoji: '🎬' },
  { value: 'outdoors', label: 'Outdoors', emoji: '🌲' },
  { value: 'games', label: 'Games', emoji: '🎮' },
  { value: 'music', label: 'Music', emoji: '🎵' },
  { value: 'reading', label: 'Reading', emoji: '📚' },
  { value: 'cozy', label: 'Cozy', emoji: '🕯️' },
  { value: 'adventure', label: 'Adventure', emoji: '🗺️' },
  { value: 'food', label: 'Food', emoji: '🍕' },
]

const ENERGY_LEVELS = [
  { value: 'low', label: 'Low Energy', description: 'Relaxed & cozy' },
  { value: 'medium', label: 'Medium Energy', description: 'Balanced pace' },
  { value: 'high', label: 'High Energy', description: 'Active & adventurous' },
]

const BUDGET_OPTIONS = [
  { value: 'free', label: 'Free', emoji: '🎁' },
  { value: 'low', label: 'Low', emoji: '💵' },
  { value: 'medium', label: 'Medium', emoji: '💳' },
  { value: 'high', label: 'High', emoji: '💎' },
]

const MODE_OPTIONS = [
  { value: 'in-person', label: 'In-Person', emoji: '👥' },
  { value: 'virtual', label: 'Virtual', emoji: '💻' },
]

export default function DateGeneratorInput({ onGenerate, isLoading }: DateGeneratorInputProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [energy, setEnergy] = useState<'low' | 'medium' | 'high'>('medium')
  const [budget, setBudget] = useState<'free' | 'low' | 'medium' | 'high'>('low')
  const [mode, setMode] = useState<'in-person' | 'virtual'>('in-person')

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, interest])
      }
    }
  }

  const handleGenerate = () => {
    onGenerate({
      interests: selectedInterests,
      energy,
      budget,
      mode,
    })
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-purple-100/50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Perfect Date</h2>
        <p className="text-gray-600 text-sm">
          Tell us what you're in the mood for, and we'll generate personalized date ideas
        </p>
      </div>

      {/* Interests */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Interests <span className="text-gray-400 font-normal">(select up to 5)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <motion.button
              key={interest.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleInterest(interest.value)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedInterests.includes(interest.value)
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              <span className="mr-1.5">{interest.emoji}</span>
              {interest.label}
            </motion.button>
          ))}
        </div>
        {selectedInterests.length === 5 && (
          <p className="text-xs text-purple-600 mt-2">Maximum interests selected</p>
        )}
      </div>

      {/* Energy Level */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">Energy Level</label>
        <div className="grid grid-cols-3 gap-2">
          {ENERGY_LEVELS.map((level) => (
            <motion.button
              key={level.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEnergy(level.value as 'low' | 'medium' | 'high')}
              className={`p-4 rounded-2xl text-center transition-all ${
                energy === level.value
                  ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <p className="text-sm font-semibold mb-1">{level.label}</p>
              <p className="text-xs opacity-90">{level.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">Budget</label>
        <div className="grid grid-cols-4 gap-2">
          {BUDGET_OPTIONS.map((option) => (
            <motion.button
              key={option.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBudget(option.value as 'free' | 'low' | 'medium' | 'high')}
              className={`p-3 rounded-2xl text-center transition-all ${
                budget === option.value
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
              }`}
            >
              <div className="text-2xl mb-1">{option.emoji}</div>
              <p className="text-xs font-semibold">{option.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">Mode</label>
        <div className="grid grid-cols-2 gap-3">
          {MODE_OPTIONS.map((option) => (
            <motion.button
              key={option.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode(option.value as 'in-person' | 'virtual')}
              className={`p-4 rounded-2xl text-center transition-all ${
                mode === option.value
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg'
                  : 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200'
              }`}
            >
              <div className="text-3xl mb-2">{option.emoji}</div>
              <p className="text-sm font-semibold">{option.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerate}
        disabled={isLoading || selectedInterests.length === 0}
        className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Three Dates
          </>
        )}
      </motion.button>

      {selectedInterests.length === 0 && (
        <p className="text-xs text-gray-500 text-center mt-3">
          Select at least one interest to generate dates
        </p>
      )}
    </div>
  )
}
