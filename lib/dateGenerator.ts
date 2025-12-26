// Date night generator with preference matching algorithm

import type { Profile, DateNight } from '@/types'
import { dateTemplates } from '@/data/dateTemplates'

interface MatchingScore {
  date: DateNight
  score: number
  reasons: string[]
}

/**
 * Calculate compatibility score between a date template and couple profiles
 * Uses tag-based matching with weighted scoring
 */
export function calculateDateScore(
  date: DateNight,
  profile1: Profile,
  profile2: Profile
): MatchingScore {
  let score = 0
  const reasons: string[] = []

  // Check indoor/outdoor preference
  const bothLikeIndoors = profile1.personality.indoorsOutdoors !== 'outdoors' && 
                          profile2.personality.indoorsOutdoors !== 'outdoors'
  const bothLikeOutdoors = profile1.personality.indoorsOutdoors !== 'indoors' && 
                           profile2.personality.indoorsOutdoors !== 'indoors'
  
  if (date.tags.indoors && bothLikeIndoors) {
    score += 20
    reasons.push('You both enjoy indoor activities')
  } else if (date.tags.outdoors && bothLikeOutdoors) {
    score += 20
    reasons.push('You both love being outdoors')
  } else if ((date.tags.indoors && bothLikeOutdoors) || (date.tags.outdoors && bothLikeIndoors)) {
    score -= 10
  }

  // Budget matching
  if (date.tags.budget === profile1.personality.budget || 
      date.tags.budget === profile2.personality.budget) {
    score += 15
    reasons.push(`Fits your ${date.tags.budget} budget preference`)
  }

  // Pace matching
  const paceMatch = date.tags.pace === profile1.personality.pace || 
                    date.tags.pace === profile2.personality.pace ||
                    date.tags.pace === 'balanced'
  if (paceMatch) {
    score += 15
    reasons.push(`Matches your preferred ${date.tags.pace} pace`)
  }

  // Interest matching (weighted)
  const sharedInterests = profile1.interests.filter(interest => 
    profile2.interests.includes(interest)
  )
  const dateInterests = date.tags.interests
  
  // Check for shared interests that match date
  const matchingSharedInterests = sharedInterests.filter(interest => 
    dateInterests.includes(interest)
  )
  if (matchingSharedInterests.length > 0) {
    score += matchingSharedInterests.length * 25
    reasons.push(`You both love ${matchingSharedInterests.join(' and ')}`)
  }

  // Check for individual interests that match
  const profile1Matches = profile1.interests.filter(interest => 
    dateInterests.includes(interest) && !matchingSharedInterests.includes(interest)
  )
  const profile2Matches = profile2.interests.filter(interest => 
    dateInterests.includes(interest) && !matchingSharedInterests.includes(interest)
  )
  
  if (profile1Matches.length > 0 || profile2Matches.length > 0) {
    score += (profile1Matches.length + profile2Matches.length) * 10
    if (profile1Matches.length > 0) {
      reasons.push(`${profile1.name} loves ${profile1Matches[0]}`)
    }
    if (profile2Matches.length > 0) {
      reasons.push(`${profile2.name} loves ${profile2Matches[0]}`)
    }
  }

  // Category bonus
  const favoriteCategories = [...profile1.favoriteDateTypes, ...profile2.favoriteDateTypes]
  if (favoriteCategories.includes(date.category)) {
    score += 15
    reasons.push(`This ${date.category} date type is one of your favorites`)
  }

  return { date, score, reasons }
}

/**
 * Generate 3 tailored date suggestions for a couple
 * Avoids repeating dates within the last 14 days
 */
export async function generateDateSuggestions(
  profile1: Profile,
  profile2: Profile,
  recentlyUsedDateIds: string[] = []
): Promise<MatchingScore[]> {
  // Filter out recently used dates
  const availableDates = dateTemplates.filter(
    date => !recentlyUsedDateIds.includes(date.id)
  )

  // Calculate scores for all available dates
  const scoredDates = availableDates.map(date => 
    calculateDateScore(date, profile1, profile2)
  )

  // Sort by score (highest first)
  scoredDates.sort((a, b) => b.score - a.score)

  // Select top 3, but ensure variety
  const selected: MatchingScore[] = []
  const usedCategories: string[] = []

  for (const scored of scoredDates) {
    if (selected.length >= 3) break
    
    // Prefer variety in categories
    if (!usedCategories.includes(scored.date.category) || selected.length < 2) {
      selected.push(scored)
      usedCategories.push(scored.date.category)
    }
  }

  // If we don't have 3 yet, fill with highest remaining scores
  while (selected.length < 3 && scoredDates.length > selected.length) {
    const next = scoredDates.find(s => !selected.includes(s))
    if (next) selected.push(next)
    else break
  }

  return selected.slice(0, 3)
}

