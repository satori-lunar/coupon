'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Profile } from '@/types'

interface ProfileStepProps {
  profileNumber: 1 | 2
  onComplete: (profile: Profile) => void
}

export default function ProfileStep({ profileNumber, onComplete }: ProfileStepProps) {
  const [name, setName] = useState('')
  const [pronouns, setPronouns] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [favoriteDateTypes, setFavoriteDateTypes] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [personality, setPersonality] = useState({
    introvertExtrovert: 'ambivert' as 'introvert' | 'extrovert' | 'ambivert',
    indoorsOutdoors: 'both' as 'indoors' | 'outdoors' | 'both',
    budget: 'medium' as 'low' | 'medium' | 'high',
    pace: 'balanced' as 'relaxed' | 'adventurous' | 'balanced',
  })

  const availableInterests = [
    'art', 'music', 'cooking', 'reading', 'movies', 'games', 'nature',
    'travel', 'fitness', 'photography', 'writing', 'dancing', 'crafts',
  ]

  const availableDateTypes = [
    'creative', 'cozy', 'adventure', 'romantic', 'playful',
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

  const handleSubmit = () => {
    if (isSubmitting) return
    
    console.log('handleSubmit called', { name, interests: interests.length, profileNumber })
    
    if (!name || interests.length === 0) {
      console.log('Validation failed', { name, interests: interests.length })
      alert('Please enter your name and select at least one interest.')
      return
    }

    setIsSubmitting(true)
    
    try {
      const profile: Profile = {
        id: `profile-${profileNumber}-${Date.now()}`,
        name,
        pronouns: pronouns || undefined,
        interests: interests.slice(0, 5),
        favoriteDateTypes,
        personality,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log('Calling onComplete with profile:', profile)
      onComplete(profile)
    } catch (error) {
      console.error('Error in handleSubmit:', error)
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

