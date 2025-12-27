'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { findGiftSuggestions, getGiftsByCategory, getSurpriseGifts } from '@/lib/giftMatcher'
import { Gift, Sparkles, DollarSign, Heart, Package, Gamepad2, Headphones } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface GiftCardProps {
  gift: any
  score: number
  reasons: string[]
  onSelect: () => void
}

function GiftCard({ gift, score, reasons, onSelect }: GiftCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical': return <Package size={20} />
      case 'experience': return <Gamepad2 size={20} />
      case 'digital': return <Headphones size={20} />
      case 'handmade': return <Heart size={20} />
      default: return <Gift size={20} />
    }
  }

  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <motion.div
      layout
      className="ios-card p-4 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getCategoryIcon(gift.category)}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="ios-text-title-3 mb-1">{gift.title}</h3>
              <p className="ios-text-secondary text-sm mb-2">{gift.description}</p>
            </div>

            <div className="flex items-center gap-2 ml-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBudgetColor(gift.budget)}`}>
                <DollarSign size={12} className="inline mr-1" />
                {gift.budget}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Heart size={14} className="text-red-400" />
              <span className="text-sm font-medium">{score}% match</span>
            </div>

            {gift.longDistance && (
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                Long Distance
              </span>
            )}
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-3 border-t border-separator"
              >
                <div>
                  <h4 className="ios-text-body font-medium mb-2">Why this gift?</h4>
                  <ul className="space-y-1">
                    {reasons.map((reason, index) => (
                      <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-text-secondary">
                    ${gift.estimatedCost.low} - ${gift.estimatedCost.high}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect()
                    }}
                    className="ios-button-primary text-sm px-4 py-2"
                  >
                    Choose Gift
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default function GiftSuggester() {
  const { coupleId, profiles, currentUserId } = useAppStore()
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [budgetFilter, setBudgetFilter] = useState<'low' | 'medium' | 'high' | undefined>()

  const profileIds = Object.keys(profiles)
  const currentProfile = currentUserId ? profiles[currentUserId] : null
  const partnerProfile = profileIds.find(id => id !== currentUserId)
    ? profiles[profileIds.find(id => id !== currentUserId)!]
    : null

  useEffect(() => {
    if (currentProfile && partnerProfile) {
      loadSuggestions()
    }
  }, [currentProfile, partnerProfile, selectedCategory, budgetFilter])

  const loadSuggestions = async () => {
    if (!currentProfile || !partnerProfile) return

    setLoading(true)

    try {
      let giftMatches

      if (selectedCategory === 'all') {
        giftMatches = findGiftSuggestions(currentProfile, partnerProfile, budgetFilter, 12)
      } else if (selectedCategory === 'surprise') {
        giftMatches = getSurpriseGifts(currentProfile, partnerProfile, 6)
      } else {
        giftMatches = getGiftsByCategory(currentProfile, partnerProfile, selectedCategory as any)
      }

      setSuggestions(giftMatches)
    } catch (error) {
      console.error('Error loading gift suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGiftSelect = (gift: any) => {
    // TODO: Implement gift selection logic
    alert(`Selected: ${gift.title}`)
  }

  const categories = [
    { id: 'all', label: 'All Gifts', icon: Gift },
    { id: 'surprise', label: 'Surprises', icon: Sparkles },
    { id: 'physical', label: 'Physical', icon: Package },
    { id: 'experience', label: 'Experiences', icon: Gamepad2 },
    { id: 'digital', label: 'Digital', icon: Headphones },
    { id: 'handmade', label: 'Handmade', icon: Heart },
  ]

  if (!currentProfile || !partnerProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Gift size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="ios-text-body text-text-secondary">
            Complete your profiles to get personalized gift suggestions
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="text-accent" size={28} />
          <h1 className="ios-text-large-title">Gift Ideas</h1>
        </div>
        <p className="ios-text-secondary text-subhead">
          Personalized suggestions for {partnerProfile.name}
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <label className="block ios-text-body font-medium mb-3">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 rounded-xl border transition-colors flex flex-col items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-accent text-white border-accent'
                      : 'bg-card text-text-secondary border-separator hover:bg-accent/5'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm">{category.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Budget Filter */}
        <div>
          <label className="block ios-text-body font-medium mb-3">Budget</label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((budget) => (
              <button
                key={budget}
                onClick={() => setBudgetFilter(budgetFilter === budget ? undefined : budget)}
                className={`flex-1 p-3 rounded-xl border transition-colors ${
                  budgetFilter === budget
                    ? 'bg-accent text-white border-accent'
                    : 'bg-card text-text-secondary border-separator hover:bg-accent/5'
                }`}
              >
                <DollarSign size={16} className="inline mr-2" />
                {budget.charAt(0).toUpperCase() + budget.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gift Suggestions */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="ios-text-secondary">Finding perfect gifts...</p>
          </div>
        ) : suggestions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.gift.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GiftCard
                  gift={suggestion.gift}
                  score={suggestion.score}
                  reasons={suggestion.reasons}
                  onSelect={() => handleGiftSelect(suggestion.gift)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <Gift size={48} className="text-text-secondary mx-auto mb-4" />
            <p className="ios-text-secondary">No gift suggestions found for these filters</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setBudgetFilter(undefined)
              }}
              className="ios-button-secondary mt-4"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
