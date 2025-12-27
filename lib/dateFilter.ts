// Date filtering and validation utilities

import type { Profile, DateNight } from '@/types'

export interface DateFilter {
  maxBudget?: number
  isLongDistance?: boolean
  location?: {
    city: string
    country: string
  }
  socialAbility?: 'very-shy' | 'shy' | 'moderate' | 'outgoing' | 'very-outgoing'
  mobilityLevel?: 'full' | 'limited' | 'wheelchair' | 'other'
  disabilities?: string[]
  triggers?: string[]
  sensitivities?: string[]
}

export interface FilteredDateResult {
  date: DateNight
  compatible: boolean
  score: number
  reasons: string[]
  accessibilityNotes: string[]
  budgetTier: 'low' | 'medium' | 'high' | null
}

/**
 * Filter dates based on couple compatibility and preferences
 */
export function filterDates(
  dates: DateNight[],
  profile1: Profile,
  profile2: Profile,
  filters?: Partial<DateFilter>
): FilteredDateResult[] {
  return dates.map(date => {
    const result: FilteredDateResult = {
      date,
      compatible: true,
      score: 0,
      reasons: [],
      accessibilityNotes: [],
      budgetTier: null
    }

    // Check budget compatibility
    const budgetResult = checkBudgetCompatibility(date, profile1, profile2)
    result.budgetTier = budgetResult.tier

    if (!budgetResult.compatible) {
      result.compatible = false
      result.reasons.push('Budget may be too high')
    }

    // Check accessibility
    const accessibilityResult = checkAccessibility(date, profile1, profile2)
    result.accessibilityNotes = accessibilityResult.notes

    if (!accessibilityResult.compatible) {
      result.compatible = false
      result.reasons.push('May not be accessible')
    }

    // Check triggers and sensitivities
    if (!checkTriggers(date, profile1, profile2)) {
      result.compatible = false
      result.reasons.push('Contains potential triggers')
    }

    // Check location compatibility
    if (!checkLocationCompatibility(date, profile1, profile2, filters)) {
      result.compatible = false
      result.reasons.push('Not suitable for location')
    }

    // Check social ability
    if (!checkSocialCompatibility(date, profile1, profile2)) {
      result.compatible = false
      result.reasons.push('Social requirements don\'t match')
    }

    // Calculate overall score
    result.score = calculateCompatibilityScore(result)

    return result
  })
}

/**
 * Check if date fits within couple's budget
 */
function checkBudgetCompatibility(
  date: DateNight,
  profile1: Profile,
  profile2: Profile
): { compatible: boolean; tier: 'low' | 'medium' | 'high' | null } {
  // Estimate cost based on date category and tags
  let estimatedCost = 50 // Base cost

  if (date.tags.budget === 'high') estimatedCost = 150
  else if (date.tags.budget === 'medium') estimatedCost = 80

  // Adjust for specific activities
  const description = date.description.toLowerCase()
  if (description.includes('restaurant') || description.includes('dinner')) estimatedCost += 50
  if (description.includes('show') || description.includes('concert')) estimatedCost += 100
  if (description.includes('travel') || description.includes('trip')) estimatedCost += 200

  // Check against both profiles' budgets
  const maxLow = Math.max(profile1.budget.low, profile2.budget.low)
  const maxMedium = Math.max(profile1.budget.medium, profile2.budget.medium)
  const maxHigh = Math.max(profile1.budget.high, profile2.budget.high)

  if (estimatedCost <= maxLow) return { compatible: true, tier: 'low' }
  if (estimatedCost <= maxMedium) return { compatible: true, tier: 'medium' }
  if (estimatedCost <= maxHigh) return { compatible: true, tier: 'high' }

  return { compatible: false, tier: null }
}

/**
 * Check accessibility requirements
 */
function checkAccessibility(
  date: DateNight,
  profile1: Profile,
  profile2: Profile
): { compatible: boolean; notes: string[] } {
  const notes: string[] = []
  let compatible = true

  const allDisabilities = [...profile1.disabilities, ...profile2.disabilities]
  const mobilityIssues = [profile1, profile2].filter(p => p.mobilityLevel !== 'full')

  // Check for physical activity requirements
  const description = date.description.toLowerCase()
  const requiresPhysical = description.includes('hiking') ||
                          description.includes('sports') ||
                          description.includes('dance') ||
                          description.includes('walking') ||
                          date.tags?.pace === 'adventurous'

  if (requiresPhysical && mobilityIssues.length > 0) {
    const hasWheelchair = mobilityIssues.some(p => p.mobilityLevel === 'wheelchair')
    if (hasWheelchair) {
      compatible = false
      notes.push('This activity requires mobility that may not be wheelchair accessible')
    } else {
      notes.push('Consider mobility limitations when planning this activity')
    }
  }

  // Check for social anxiety considerations
  const requiresSocial = description.includes('crowd') ||
                        description.includes('party') ||
                        description.includes('group')

  const socialIssues = [profile1, profile2].filter(p =>
    p.socialAbility === 'very-shy' || p.socialAbility === 'shy'
  )

  if (requiresSocial && socialIssues.length > 0) {
    notes.push('This activity may be challenging for those with social anxiety')
  }

  // General accessibility note
  if (allDisabilities.length > 0) {
    notes.push('Review specific accessibility needs before booking')
  }

  return { compatible, notes }
}

/**
 * Check for trigger and sensitivity conflicts
 */
function checkTriggers(date: DateNight, profile1: Profile, profile2: Profile): boolean {
  const allTriggers = [...profile1.triggers, ...profile2.triggers]
  const allSensitivities = [...profile1.sensitivities, ...profile2.sensitivities]

  const content = [
    date.title,
    date.description,
    date.longDescription,
    ...(date.steps || []),
    ...(date.prompts || [])
  ].join(' ').toLowerCase()

  return !allTriggers.concat(allSensitivities).some(avoided =>
    content.includes(avoided.toLowerCase())
  )
}

/**
 * Check location compatibility
 */
function checkLocationCompatibility(
  date: DateNight,
  profile1: Profile,
  profile2: Profile,
  filters?: Partial<DateFilter>
): boolean {
  // Check if it's a long distance relationship
  const isLongDistance = profile1.isLongDistance || profile2.isLongDistance

  // Virtual dates are always compatible for long distance
  if (date.virtualAdaptation) return true

  // Physical dates need location consideration
  if (isLongDistance) {
    // Only virtual or location-independent dates
    return !date.tags.outdoors || date.tags.indoors
  }

  // Same location - check if activity makes sense
  if (filters?.location) {
    const location = filters.location
    // Could add location-specific filtering here
    // For now, assume all locations work
  }

  return true
}

/**
 * Check social ability compatibility
 */
function checkSocialCompatibility(
  date: DateNight,
  profile1: Profile,
  profile2: Profile
): boolean {
  const socialLevels = {
    'very-shy': 1,
    'shy': 2,
    'moderate': 3,
    'outgoing': 4,
    'very-outgoing': 5
  }

  const level1 = socialLevels[profile1.socialAbility]
  const level2 = socialLevels[profile2.socialAbility]
  const avgLevel = (level1 + level2) / 2

  // Very social activities need outgoing people
  const description = date.description.toLowerCase()
  const isVerySocial = description.includes('party') ||
                      description.includes('crowd') ||
                      description.includes('networking') ||
                      description.includes('performance')

  if (isVerySocial && avgLevel < 3) {
    return false
  }

  // Very quiet activities need at least moderate social ability
  const isVeryQuiet = description.includes('silent') ||
                     description.includes('alone') ||
                     date.tags.indoors && !description.includes('conversation')

  if (isVeryQuiet && Math.min(level1, level2) < 2) {
    return false
  }

  return true
}

/**
 * Calculate overall compatibility score
 */
function calculateCompatibilityScore(result: FilteredDateResult): number {
  let score = 100

  // Deduct for incompatibility
  if (!result.compatible) score -= 50

  // Bonus for accessibility notes (shows consideration)
  if (result.accessibilityNotes.length > 0) score += 10

  // Bonus for budget fit
  if (result.budgetTier) score += 10

  return Math.max(0, Math.min(100, score))
}
