// Gift matching logic for personalized gift suggestions

import { GiftIdea, giftIdeas } from '@/data/giftIdeas'
import type { Profile } from '@/types'

export interface GiftMatch {
  gift: GiftIdea
  score: number
  reasons: string[]
  compatibility: {
    loveLanguageMatch: boolean
    budgetMatch: boolean
    triggerSafe: boolean
    longDistanceSuitable: boolean
    accessibilityCompatible: boolean
  }
}

/**
 * Find personalized gift suggestions for a couple
 */
export function findGiftSuggestions(
  giverProfile: Profile,
  receiverProfile: Profile,
  budget?: 'low' | 'medium' | 'high',
  maxResults: number = 5
): GiftMatch[] {
  const matches: GiftMatch[] = []

  for (const gift of giftIdeas) {
    const match = calculateGiftMatch(gift, giverProfile, receiverProfile, budget)
    if (match.score > 0) {
      matches.push(match)
    }
  }

  // Sort by score (highest first)
  matches.sort((a, b) => b.score - a.score)

  return matches.slice(0, maxResults)
}

/**
 * Calculate how well a gift matches the couple's profiles
 */
function calculateGiftMatch(
  gift: GiftIdea,
  giverProfile: Profile,
  receiverProfile: Profile,
  budgetFilter?: 'low' | 'medium' | 'high'
): GiftMatch {
  let score = 0
  const reasons: string[] = []

  const compatibility = {
    loveLanguageMatch: false,
    budgetMatch: false,
    triggerSafe: false,
    longDistanceSuitable: false,
    accessibilityCompatible: false
  }

  // Love Language Matching (40% of score)
  const loveLanguageScore = calculateLoveLanguageGiftScore(gift, receiverProfile)
  score += loveLanguageScore.score * 0.4
  if (loveLanguageScore.score > 0) {
    compatibility.loveLanguageMatch = true
    reasons.push(...loveLanguageScore.reasons)
  }

  // Budget Matching (30% of score)
  const budgetScore = calculateBudgetGiftScore(gift, giverProfile, budgetFilter)
  score += budgetScore.score * 0.3
  if (budgetScore.score > 0) {
    compatibility.budgetMatch = true
    reasons.push(...budgetScore.reasons)
  }

  // Trigger Safety (20% of score)
  const triggerScore = calculateTriggerGiftScore(gift, receiverProfile)
  score += triggerScore.score * 0.2
  if (triggerScore.score > 0) {
    compatibility.triggerSafe = true
    reasons.push(...triggerScore.reasons)
  }

  // Long Distance Compatibility (10% of score)
  const longDistanceScore = calculateLongDistanceGiftScore(gift, giverProfile, receiverProfile)
  score += longDistanceScore.score * 0.1
  if (longDistanceScore.score > 0) {
    compatibility.longDistanceSuitable = true
    reasons.push(...longDistanceScore.reasons)
  }

  // Accessibility Compatibility (bonus points)
  const accessibilityScore = calculateAccessibilityGiftScore(gift, receiverProfile)
  score += accessibilityScore.score
  if (accessibilityScore.score > 0) {
    compatibility.accessibilityCompatible = true
    reasons.push(...accessibilityScore.reasons)
  }

  return {
    gift,
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasons,
    compatibility
  }
}

/**
 * Calculate love language compatibility for gifts
 */
function calculateLoveLanguageGiftScore(gift: GiftIdea, receiverProfile: Profile) {
  let score = 0
  const reasons: string[] = []

  // Find the receiver's top love languages (score >= 4)
  const topLoveLanguages = Object.entries(receiverProfile.loveLanguages)
    .filter(([_, value]) => value >= 4)
    .map(([key, _]) => key)

  // Check if gift matches any top love languages
  const matchingLanguages = gift.loveLanguages.filter(lang =>
    topLoveLanguages.includes(lang)
  )

  if (matchingLanguages.length > 0) {
    score = 100
    reasons.push(`Matches ${receiverProfile.name}'s love language: ${matchingLanguages.join(', ')}`)
  } else {
    // Check if gift matches secondary love languages (score >= 3)
    const secondaryLanguages = Object.entries(receiverProfile.loveLanguages)
      .filter(([_, value]) => value >= 3 && value < 4)
      .map(([key, _]) => key)

    const secondaryMatches = gift.loveLanguages.filter(lang =>
      secondaryLanguages.includes(lang)
    )

    if (secondaryMatches.length > 0) {
      score = 70
      reasons.push(`Complements ${receiverProfile.name}'s interests in ${secondaryMatches.join(', ')}`)
    } else {
      // Universal gifts get moderate score
      score = 40
      reasons.push('A thoughtful universal gift')
    }
  }

  return { score, reasons }
}

/**
 * Calculate budget compatibility for gifts
 */
function calculateBudgetGiftScore(
  gift: GiftIdea,
  giverProfile: Profile,
  budgetFilter?: 'low' | 'medium' | 'high'
) {
  let score = 0
  const reasons: string[] = []

  // If specific budget filter is set, check against it
  if (budgetFilter) {
    if (gift.budget === budgetFilter) {
      score = 100
      reasons.push(`Fits your ${budgetFilter} budget preference`)
    } else {
      // Allow some flexibility for adjacent budget levels
      const budgetLevels = ['low', 'medium', 'high']
      const giftLevel = budgetLevels.indexOf(gift.budget)
      const filterLevel = budgetLevels.indexOf(budgetFilter)

      if (Math.abs(giftLevel - filterLevel) === 1) {
        score = 60
        reasons.push(`Close to your ${budgetFilter} budget range`)
      } else {
        score = 0
        return { score, reasons }
      }
    }
  } else {
    // Use giver's general budget preference
    const giverBudget = giverProfile.personality.budget
    if (gift.budget === giverBudget) {
      score = 100
      reasons.push(`Matches your ${giverBudget} spending comfort`)
    } else {
      // Allow flexibility
      score = 70
      reasons.push('Reasonable cost for the value')
    }
  }

  return { score, reasons }
}

/**
 * Check if gift avoids triggers
 */
function calculateTriggerGiftScore(gift: GiftIdea, receiverProfile: Profile) {
  let score = 0
  const reasons: string[] = []

  const receiverTriggers = receiverProfile.triggers || []
  const giftTriggers = gift.triggers || []

  // Check if gift contains any trigger words/concepts
  const hasTriggers = giftTriggers.some(trigger =>
    receiverTriggers.some(receiverTrigger =>
      receiverTrigger.toLowerCase().includes(trigger.toLowerCase()) ||
      trigger.toLowerCase().includes(receiverTrigger.toLowerCase())
    )
  )

  if (hasTriggers) {
    score = 0
    reasons.push('May contain triggering elements')
  } else {
    score = 100
    reasons.push('Avoids known triggers')
  }

  return { score, reasons }
}

/**
 * Calculate long distance suitability
 */
function calculateLongDistanceGiftScore(
  gift: GiftIdea,
  giverProfile: Profile,
  receiverProfile: Profile
) {
  let score = 0
  const reasons: string[] = []

  const isLongDistance = giverProfile.isLongDistance || receiverProfile.isLongDistance

  if (isLongDistance) {
    if (gift.longDistance) {
      score = 100
      reasons.push('Perfect for long distance relationships')
    } else {
      score = 20
      reasons.push('May be challenging for long distance')
    }
  } else {
    // For non-long distance couples, both types work
    score = 80
    reasons.push('Suitable for your relationship type')
  }

  return { score, reasons }
}

/**
 * Check accessibility compatibility
 */
function calculateAccessibilityGiftScore(gift: GiftIdea, receiverProfile: Profile) {
  let score = 0
  const reasons: string[] = []

  const receiverDisabilities = receiverProfile.disabilities || []
  const receiverMobility = receiverProfile.mobilityLevel

  if (receiverDisabilities.length === 0 && receiverMobility === 'full') {
    // No accessibility concerns
    score = 10
    reasons.push('Generally accessible')
    return { score, reasons }
  }

  // Check for specific accessibility features
  const giftAccessibility = gift.accessibility || []

  // Mobility considerations
  if (receiverMobility !== 'full' || receiverDisabilities.includes('mobility')) {
    if (gift.category === 'experience' && !gift.longDistance) {
      score = 0
      reasons.push('May require mobility for in-person experience')
    } else {
      score += 20
      reasons.push('Doesn\'t require physical presence')
    }
  }

  // Visual accessibility
  if (receiverDisabilities.includes('visual')) {
    if (gift.category === 'digital' || gift.tags.includes('audio')) {
      score += 30
      reasons.push('Accessible for visual impairments')
    }
  }

  // Hearing accessibility
  if (receiverDisabilities.includes('hearing')) {
    if (gift.category === 'physical' || gift.tags.includes('visual')) {
      score += 30
      reasons.push('Accessible for hearing impairments')
    }
  }

  if (score === 0) {
    score = 10
    reasons.push('Check accessibility requirements')
  }

  return { score, reasons }
}

/**
 * Get gift suggestions by category
 */
export function getGiftsByCategory(
  giverProfile: Profile,
  receiverProfile: Profile,
  category: GiftIdea['category']
): GiftMatch[] {
  const categoryGifts = giftIdeas.filter(gift => gift.category === category)
  return categoryGifts.map(gift =>
    calculateGiftMatch(gift, giverProfile, receiverProfile)
  ).filter(match => match.score > 0)
  .sort((a, b) => b.score - a.score)
}

/**
 * Get surprise gift suggestions (avoiding obvious patterns)
 */
export function getSurpriseGifts(
  giverProfile: Profile,
  receiverProfile: Profile,
  count: number = 3
): GiftMatch[] {
  const allMatches = findGiftSuggestions(giverProfile, receiverProfile, undefined, 20)

  // Filter for less obvious gifts
  const surpriseGifts = allMatches.filter(match => {
    const gift = match.gift
    // Prefer handmade, experience, and unique gifts over generic ones
    return gift.category === 'handmade' ||
           gift.category === 'experience' ||
           gift.tags.includes('unique') ||
           gift.tags.includes('personalized')
  })

  return surpriseGifts.slice(0, count)
}
