'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Profile } from '@/types'
import { Heart, Users, MapPin, Shield, DollarSign } from 'lucide-react'

interface ProfileStepProps {
  profileNumber: 1 | 2
  onComplete: (profile: Profile) => void
}

export default function ProfileStep({ profileNumber, onComplete }: ProfileStepProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Basic Info
  const [name, setName] = useState('')
  const [pronouns, setPronouns] = useState('')

  // Interests & Preferences
  const [interests, setInterests] = useState<string[]>([])
  const [favoriteDateTypes, setFavoriteDateTypes] = useState<string[]>([])
  const [personality, setPersonality] = useState({
    introvertExtrovert: 'ambivert' as 'introvert' | 'extrovert' | 'ambivert',
    indoorsOutdoors: 'both' as 'indoors' | 'outdoors' | 'both',
    budget: 'medium' as 'low' | 'medium' | 'high',
    pace: 'balanced' as 'relaxed' | 'adventurous' | 'balanced',
  })

  // Love Languages (1-5 scale)
  const [loveLanguages, setLoveLanguages] = useState({
    wordsOfAffirmation: 3,
    qualityTime: 3,
    receivingGifts: 3,
    actsOfService: 3,
    physicalTouch: 3,
  })

  // Relationship Insights
  const [triggers, setTriggers] = useState<string[]>([])
  const [sensitivities, setSensitivities] = useState<string[]>([])
  const [issues, setIssues] = useState<string[]>([])
  const [hopes, setHopes] = useState<string[]>([])
  const [goals, setGoals] = useState<string[]>([])

  // Practical Details
  const [location, setLocation] = useState({ city: '', country: '' })
  const [isLongDistance, setIsLongDistance] = useState(false)

  // Accessibility & Preferences
  const [socialAbility, setSocialAbility] = useState<'very-shy' | 'shy' | 'moderate' | 'outgoing' | 'very-outgoing'>('moderate')
  const [disabilities, setDisabilities] = useState<string[]>([])
  const [mobilityLevel, setMobilityLevel] = useState<'full' | 'limited' | 'wheelchair' | 'other'>('full')

  // Enhanced Budget
  const [budget, setBudget] = useState({
    low: 25,
    medium: 75,
    high: 150,
  })

  const sections = [
    { id: 'basic', title: 'Basic Info', icon: Users },
    { id: 'preferences', title: 'Interests & Preferences', icon: Heart },
    { id: 'love-languages', title: 'Love Languages', icon: Heart },
    { id: 'insights', title: 'Relationship Insights', icon: Shield },
    { id: 'practical', title: 'Location & Distance', icon: MapPin },
    { id: 'accessibility', title: 'Accessibility', icon: Shield },
    { id: 'budget', title: 'Budget Preferences', icon: DollarSign },
  ]

  const availableInterests = [
    'art', 'music', 'cooking', 'reading', 'movies', 'games', 'nature',
    'travel', 'fitness', 'photography', 'writing', 'dancing', 'crafts',
  ]

  const availableDateTypes = [
    'creative', 'cozy', 'adventure', 'romantic', 'playful',
  ]

  const commonTriggers = [
    'loud noises', 'crowds', 'public speaking', 'heights', 'spiders',
    'conflict', 'criticism', 'abandonment', 'rejection', 'failure',
  ]

  const commonSensitivities = [
    'political discussions', 'religious topics', 'money conversations',
    'family issues', 'past relationships', 'future planning',
  ]

  const commonDisabilities = [
    'vision impairment', 'hearing impairment', 'mobility impairment',
    'chronic pain', 'mental health conditions', 'learning disabilities',
  ]

  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest))
    } else if (interests.length < 5) {
      setInterests([...interests, interest])
    }
  }

  const handleDateTypeToggle = (type: string) => {
    if (favoriteDateTypes.includes(type)) {
      setFavoriteDateTypes(favoriteDateTypes.filter(t => t !== type))
    } else {
      setFavoriteDateTypes([...favoriteDateTypes, type])
    }
  }

  const handleLoveLanguageChange = (language: keyof typeof loveLanguages, value: number) => {
    setLoveLanguages(prev => ({ ...prev, [language]: value }))
  }

  const handleArrayToggle = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item))
    } else {
      setArray([...array, item])
    }
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    } else {
      handleComplete()
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleComplete = () => {
    if (isSubmitting) return

    if (!name) {
      alert('Please enter your name.')
      return
    }

    setIsSubmitting(true)

    try {
      const profile: Profile = {
        id: `profile-${profileNumber}-${Date.now()}`,
        name,
        pronouns: pronouns || undefined,
        interests,
        favoriteDateTypes,
        personality,
        loveLanguages,
        triggers,
        sensitivities,
        issues,
        hopes,
        goals,
        location: location.city ? location : undefined,
        isLongDistance,
        socialAbility,
        disabilities,
        mobilityLevel,
        budget,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      onComplete(profile)
    } catch (error) {
      console.error('Error creating profile:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg"
    >
      <h2 className="text-3xl font-serif text-rose mb-6 text-center">
        {profileNumber === 1 ? "Tell us about you" : "Tell us about your partner"}
      </h2>

      <div 
        className="space-y-6"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            e.stopPropagation()
            if (name && interests.length > 0 && !isSubmitting) {
              handleSubmit()
            }
          }
        }}
      >
        <div>
          <label className="block text-warm-gray mb-2 font-serif">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            className="w-full px-4 py-3 rounded-lg border border-soft-gray focus:border-rose focus:outline-none text-lg"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-warm-gray mb-2 font-serif">Pronouns (optional)</label>
          <input
            type="text"
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-soft-gray focus:border-rose focus:outline-none text-lg"
            placeholder="e.g., she/her, he/him, they/them"
          />
        </div>

        <div>
          <label className="block text-warm-gray mb-2 font-serif">
            Top 5 Interests ({interests.length}/5)
          </label>
          <div className="flex flex-wrap gap-2">
            {availableInterests.map(interest => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  interests.includes(interest)
                    ? 'bg-rose text-white'
                    : 'bg-cream text-warm-gray hover:bg-blush'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-warm-gray mb-2 font-serif">Favorite Date Types</label>
          <div className="flex flex-wrap gap-2">
            {availableDateTypes.map(type => (
              <button
                key={type}
                onClick={() => handleDateTypeToggle(type)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  favoriteDateTypes.includes(type)
                    ? 'bg-rose text-white'
                    : 'bg-cream text-warm-gray hover:bg-blush'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-warm-gray mb-2 font-serif">Personality</label>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-soft-gray">Introvert / Extrovert</label>
              <select
                value={personality.introvertExtrovert}
                onChange={(e) => setPersonality({ ...personality, introvertExtrovert: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg border border-soft-gray focus:border-rose focus:outline-none"
              >
                <option value="introvert">Introvert</option>
                <option value="extrovert">Extrovert</option>
                <option value="ambivert">Ambivert</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-soft-gray">Indoors / Outdoors</label>
              <select
                value={personality.indoorsOutdoors}
                onChange={(e) => setPersonality({ ...personality, indoorsOutdoors: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg border border-soft-gray focus:border-rose focus:outline-none"
              >
                <option value="indoors">Indoors</option>
                <option value="outdoors">Outdoors</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-soft-gray">Budget Preference</label>
              <select
                value={personality.budget}
                onChange={(e) => setPersonality({ ...personality, budget: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg border border-soft-gray focus:border-rose focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-soft-gray">Pace Preference</label>
              <select
                value={personality.pace}
                onChange={(e) => setPersonality({ ...personality, pace: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg border border-soft-gray focus:border-rose focus:outline-none"
              >
                <option value="relaxed">Relaxed</option>
                <option value="adventurous">Adventurous</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>
          </div>
        </div>

        <div
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (!name || interests.length === 0 || isSubmitting) return
            console.log('Button clicked', { name, interests: interests.length, isSubmitting })
            handleSubmit()
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          role="button"
          tabIndex={0}
          className={`w-full px-8 py-4 bg-rose text-white rounded-full text-lg font-serif hover:bg-muted-rose transition-colors text-center cursor-pointer select-none ${
            (!name || interests.length === 0 || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              if (name && interests.length > 0 && !isSubmitting) {
                handleSubmit()
              }
            }
          }}
        >
          {isSubmitting ? 'Processing...' : 'Continue'}
        </div>
      </div>
    </motion.div>
  )
}

