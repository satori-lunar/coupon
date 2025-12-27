// Profile matching utilities for enhanced personalization

export interface CompatibilityScore {
  overall: number // 0-100
  loveLanguageMatch: number
  interestOverlap: number
  personalityMatch: number
  triggerWarnings: string[]
  recommendations: string[]
}

/**
 * Calculate compatibility score between two profiles
 */
export function calculateCompatibility(profile1: any, profile2: any): CompatibilityScore {
  let score = 0
  let loveLanguageScore = 0
  let interestScore = 0
  let personalityScore = 0
  const warnings: string[] = []
  const recommendations: string[] = []

  // Love Language Compatibility (40% of score)
  const loveLanguageCompatibility = calculateLoveLanguageCompatibility(profile1.loveLanguages, profile2.loveLanguages)
  loveLanguageScore = loveLanguageCompatibility.score
  score += loveLanguageCompatibility.score * 0.4

  // Interest Overlap (20% of score)
  const interestOverlap = calculateInterestOverlap(profile1.interests, profile2.interests)
  interestScore = interestOverlap.score
  score += interestOverlap.score * 0.2

  // Personality Compatibility (20% of score)
  const personalityMatch = calculatePersonalityMatch(profile1.personality, profile2.personality)
  personalityScore = personalityMatch.score
  score += personalityMatch.score * 0.2

  // Trigger/Sensitivity Warnings (doesn't affect score but provides warnings)
  const triggerAnalysis = analyzeTriggers(profile1, profile2)
  warnings.push(...triggerAnalysis.warnings)
  recommendations.push(...triggerAnalysis.recommendations)

  // Long Distance Considerations (20% of score if applicable)
  if (profile1.isLongDistance || profile2.isLongDistance) {
    const longDistanceScore = calculateLongDistanceCompatibility(profile1, profile2)
    score += longDistanceScore * 0.2
  } else {
    score += 20 // Full points if not long distance
  }

  return {
    overall: Math.min(100, Math.max(0, Math.round(score))),
    loveLanguageMatch: loveLanguageScore,
    interestOverlap: interestScore,
    personalityMatch: personalityScore,
    triggerWarnings: warnings,
    recommendations: recommendations
  }
}

/**
 * Calculate love language compatibility
 */
function calculateLoveLanguageCompatibility(loveLang1: any, loveLang2: any) {
  const languages = ['wordsOfAffirmation', 'qualityTime', 'receivingGifts', 'actsOfService', 'physicalTouch']
  let totalCompatibility = 0
  let maxPossible = 0

  languages.forEach(lang => {
    const score1 = loveLang1[lang] || 0
    const score2 = loveLang2[lang] || 0

    // Higher compatibility if both value the same language highly
    const compatibility = Math.min(score1, score2) / 5 * 100
    totalCompatibility += compatibility
    maxPossible += 100
  })

  return {
    score: Math.round((totalCompatibility / maxPossible) * 100)
  }
}

/**
 * Calculate interest overlap
 */
function calculateInterestOverlap(interests1: string[], interests2: string[]) {
  const set1 = new Set(interests1.map(i => i.toLowerCase()))
  const set2 = new Set(interests2.map(i => i.toLowerCase()))

  const overlap = new Set([...set1].filter(x => set2.has(x)))
  const maxInterests = Math.max(set1.size, set2.size)

  return {
    score: maxInterests > 0 ? Math.round((overlap.size / maxInterests) * 100) : 0
  }
}

/**
 * Calculate personality compatibility
 */
function calculatePersonalityMatch(personality1: any, personality2: any) {
  let score = 0

  // Introvert/Exrovert compatibility
  if (personality1.introvertExtrovert === personality2.introvertExtrovert) {
    score += 25
  } else if (personality1.introvertExtrovert === 'ambivert' || personality2.introvertExtrovert === 'ambivert') {
    score += 20 // Ambiverts are more flexible
  }

  // Indoors/Outdoors compatibility
  if (personality1.indoorsOutdoors === personality2.indoorsOutdoors) {
    score += 25
  } else if (personality1.indoorsOutdoors === 'both' || personality2.indoorsOutdoors === 'both') {
    score += 20
  }

  // Pace compatibility
  if (personality1.pace === personality2.pace) {
    score += 25
  } else {
    // Some pace differences are okay
    score += 15
  }

  // Budget compatibility (rough estimate)
  const budget1 = personality1.budget
  const budget2 = personality2.budget
  if (budget1 === budget2) {
    score += 25
  } else if (Math.abs(['low', 'medium', 'high'].indexOf(budget1) - ['low', 'medium', 'high'].indexOf(budget2)) === 1) {
    score += 20 // Adjacent budget levels are okay
  } else {
    score += 10 // Large budget differences might cause issues
  }

  return { score }
}

/**
 * Analyze triggers and sensitivities
 */
function analyzeTriggers(profile1: any, profile2: any) {
  const warnings: string[] = []
  const recommendations: string[] = []

  const allTriggers = [...(profile1.triggers || []), ...(profile2.triggers || [])]
  const allSensitivities = [...(profile1.sensitivities || []), ...(profile2.sensitivities || [])]

  // Check for overlapping triggers/sensitivities
  const triggerSet = new Set(allTriggers.map(t => t.toLowerCase()))
  const sensitivitySet = new Set(allSensitivities.map(s => s.toLowerCase()))

  if (triggerSet.size > 0) {
    warnings.push(`Be mindful of these potential triggers: ${Array.from(triggerSet).join(', ')}`)
  }

  if (sensitivitySet.size > 0) {
    warnings.push(`These topics may be sensitive: ${Array.from(sensitivitySet).join(', ')}`)
  }

  // Generate recommendations based on issues and goals
  const issues = [...(profile1.issues || []), ...(profile2.issues || [])]
  const goals = [...(profile1.goals || []), ...(profile2.goals || [])]

  if (issues.length > 0) {
    recommendations.push(`Consider working on these areas together: ${issues.slice(0, 3).join(', ')}`)
  }

  if (goals.length > 0) {
    recommendations.push(`Shared goals to work toward: ${goals.slice(0, 3).join(', ')}`)
  }

  return { warnings, recommendations }
}

/**
 * Calculate long distance compatibility
 */
function calculateLongDistanceCompatibility(profile1: any, profile2: any) {
  // Both need to be comfortable with long distance
  const bothComfortable = profile1.isLongDistance && profile2.isLongDistance

  if (bothComfortable) {
    // Check if they have similar social abilities for when they do meet
    const socialMatch = profile1.socialAbility === profile2.socialAbility ? 50 : 30
    return socialMatch
  } else {
    // If one isn't comfortable with long distance, penalty
    return 10
  }
}

/**
 * Get personalized recommendations based on profiles
 */
export function getPersonalizedRecommendations(profile1: any, profile2: any): string[] {
  const recommendations: string[] = []

  // Love language based recommendations
  const primaryLoveLang1 = getPrimaryLoveLanguage(profile1.loveLanguages)
  const primaryLoveLang2 = getPrimaryLoveLanguage(profile2.loveLanguages)

  recommendations.push(`Focus on ${primaryLoveLang1} for ${profile1.name} and ${primaryLoveLang2} for ${profile2.name}`)

  // Activity recommendations based on personality
  if (profile1.personality.indoorsOutdoors === 'outdoors' && profile2.personality.indoorsOutdoors === 'outdoors') {
    recommendations.push('Try outdoor activities together')
  } else if (profile1.personality.indoorsOutdoors === 'indoors' && profile2.personality.indoorsOutdoors === 'indoors') {
    recommendations.push('Plan cozy indoor dates')
  }

  // Budget considerations
  const avgBudget = (profile1.budget.medium + profile2.budget.medium) / 2
  recommendations.push(`Average comfortable budget: $${avgBudget.toFixed(0)} per date`)

  return recommendations
}

/**
 * Get primary love language for a profile
 */
function getPrimaryLoveLanguage(loveLanguages: any): string {
  const languages = Object.entries(loveLanguages) as [string, number][]
  const sorted = languages.sort((a, b) => b[1] - a[1])

  const langMap: Record<string, string> = {
    wordsOfAffirmation: 'Words of Affirmation',
    qualityTime: 'Quality Time',
    receivingGifts: 'Receiving Gifts',
    actsOfService: 'Acts of Service',
    physicalTouch: 'Physical Touch'
  }

  return langMap[sorted[0][0]] || 'Quality Time'
}