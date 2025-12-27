import { DateTemplate, Profile, GeneratedDate, DateGeneratorInput } from '@/types'

// Sample date templates with tags and weights for algorithm
export const dateTemplates: DateTemplate[] = [
  // QUICK DATES (30-45 minutes)
  {
    id: 'coffee-3-questions',
    title: 'Coffee & 3 Questions',
    description: 'Perfect for busy days — a warm drink and meaningful conversation.',
    category: 'quick',
    duration: '30-45 minutes',
    tags: {
      interests: ['conversation', 'cozy'],
      energy: 'low',
      budget: 'free',
      mode: 'both',
      loveLanguages: ['QualityTime'],
    },
    weights: {
      conversation: 2,
      cozy: 1,
      QualityTime: 2,
    },
    steps: [
      { number: 1, text: 'Make your favorite warm drink', icon: '☕' },
      { number: 2, text: 'Answer these 3 gentle questions (app supplies them)', icon: '💬' },
      { number: 3, text: 'Share one small plan for your week', icon: '📝' },
    ],
    virtualAdaptation: 'Use video call and the app shared timer.',
  },
  {
    id: 'sunset-walk',
    title: 'Sunset Stroll & Share',
    description: 'A brief walk outdoors to reconnect and breathe together.',
    category: 'quick',
    duration: '30 minutes',
    tags: {
      interests: ['outdoors', 'nature'],
      energy: 'medium',
      budget: 'free',
      mode: 'in-person',
      loveLanguages: ['QualityTime', 'PhysicalTouch'],
    },
    weights: {
      outdoors: 2,
      nature: 2,
      QualityTime: 2,
    },
    steps: [
      { number: 1, text: 'Choose a favorite nearby spot', icon: '🚶' },
      { number: 2, text: 'Walk without phones for 20 minutes', icon: '📵' },
      { number: 3, text: 'Share one thing you're grateful for today', icon: '💭' },
    ],
    virtualAdaptation: 'Take parallel walks while on a call, describing what you see.',
  },

  // MEDIUM DATES (1.5-2 hours)
  {
    id: 'mini-home-gallery',
    title: 'Mini Home Gallery Night',
    description: 'Curate and share art that speaks to your souls.',
    category: 'medium',
    duration: '1.5-2 hours',
    tags: {
      interests: ['art', 'cozy', 'creative'],
      energy: 'low',
      budget: 'free',
      mode: 'both',
      loveLanguages: ['QualityTime'],
    },
    weights: {
      art: 3,
      cozy: 2,
      creative: 2,
      QualityTime: 2,
    },
    steps: [
      { number: 1, text: 'Curate 6 images (from web or phone) into a slideshow', icon: '🎨' },
      { number: 2, text: 'Dim lights, light candles, play the suggested playlist', icon: '🕯️' },
      { number: 3, text: 'Walk through each image and share why it resonates', icon: '💫' },
    ],
    virtualAdaptation: 'Share screen and use the play button to sync viewing.',
    giftIdea: 'Send a small art print link as a surprise.',
    playlistSuggestion: 'Ambient instrumental (Nils Frahm, Ólafur Arnalds)',
  },
  {
    id: 'cooking-together',
    title: 'Cook Something New Together',
    description: 'Pick a recipe neither of you has tried and create together.',
    category: 'medium',
    duration: '1.5 hours',
    tags: {
      interests: ['cooking', 'food', 'creative'],
      energy: 'medium',
      budget: 'low',
      mode: 'in-person',
      loveLanguages: ['Acts', 'QualityTime'],
    },
    weights: {
      cooking: 3,
      food: 2,
      creative: 1,
      Acts: 2,
    },
    steps: [
      { number: 1, text: 'Choose a recipe together (Italian, Asian, or comfort food)', icon: '📖' },
      { number: 2, text: 'Shop for ingredients as a mini adventure', icon: '🛒' },
      { number: 3, text: 'Cook together with music, share tastes as you go', icon: '👨‍🍳' },
    ],
    virtualAdaptation: 'Cook the same recipe on video call, share tips in real-time.',
  },
  {
    id: 'movie-cozy-night',
    title: 'Movie Night with a Twist',
    description: 'Watch a film neither has seen, then discuss with prompts.',
    category: 'medium',
    duration: '2-3 hours',
    tags: {
      interests: ['movies', 'cozy'],
      energy: 'low',
      budget: 'free',
      mode: 'both',
      loveLanguages: ['QualityTime'],
    },
    weights: {
      movies: 3,
      cozy: 2,
      QualityTime: 2,
    },
    steps: [
      { number: 1, text: 'Pick a film using a coin flip between your two picks', icon: '🎬' },
      { number: 2, text: 'Prepare cozy setup: blankets, snacks, dim lights', icon: '🍿' },
      { number: 3, text: 'After the film, discuss using these prompts from the app', icon: '💬' },
    ],
    virtualAdaptation: 'Use screen share or a sync extension like Teleparty.',
  },
  {
    id: 'game-night',
    title: 'Board Game Championship',
    description: 'Play your favorite board game or try a new one together.',
    category: 'medium',
    duration: '1-2 hours',
    tags: {
      interests: ['games', 'playful'],
      energy: 'medium',
      budget: 'low',
      mode: 'in-person',
      loveLanguages: ['QualityTime'],
    },
    weights: {
      games: 3,
      playful: 2,
      QualityTime: 2,
    },
    steps: [
      { number: 1, text: 'Pick a game: cooperative or competitive', icon: '🎲' },
      { number: 2, text: 'Set up snacks and drinks', icon: '🥤' },
      { number: 3, text: 'Play! Loser makes breakfast tomorrow', icon: '🏆' },
    ],
    virtualAdaptation: 'Use online board game platforms like Board Game Arena.',
  },

  // SPECIAL DATES (3+ hours)
  {
    id: 'date-theyll-remember',
    title: 'A Date They'll Remember',
    description: 'An elevated evening of connection, gratitude, and celebration.',
    category: 'special',
    duration: '3-4 hours',
    tags: {
      interests: ['romantic', 'food', 'celebratory'],
      energy: 'high',
      budget: 'medium',
      mode: 'in-person',
      loveLanguages: ['Gifts', 'Acts', 'QualityTime'],
    },
    weights: {
      romantic: 3,
      food: 2,
      celebratory: 2,
      Gifts: 2,
      Acts: 2,
    },
    steps: [
      { number: 1, text: 'Dress up and take a photo together', icon: '📸' },
      { number: 2, text: 'Cook or order a meal with flavors they love (we suggest dishes)', icon: '🍽️' },
      { number: 3, text: 'Finish with a 15-minute gratitude exchange (app-guided prompts)', icon: '💝' },
    ],
    giftIdea: 'Leave a handwritten note they can keep.',
  },
  {
    id: 'outdoor-adventure',
    title: 'Outdoor Adventure Day',
    description: 'Explore nature together with a hike, picnic, and quality time.',
    category: 'special',
    duration: '4-6 hours',
    tags: {
      interests: ['outdoors', 'nature', 'adventure'],
      energy: 'high',
      budget: 'low',
      mode: 'in-person',
      loveLanguages: ['QualityTime', 'Acts'],
    },
    weights: {
      outdoors: 3,
      nature: 3,
      adventure: 2,
      QualityTime: 2,
    },
    steps: [
      { number: 1, text: 'Pack a picnic with favorite snacks', icon: '🧺' },
      { number: 2, text: 'Choose a trail or outdoor spot to explore', icon: '🥾' },
      { number: 3, text: 'Find a scenic spot to eat and talk about dreams', icon: '🌄' },
    ],
    virtualAdaptation: 'Plan a future trip together using maps and Pinterest.',
  },
  {
    id: 'creative-project',
    title: 'Create Something Together',
    description: 'Spend an afternoon making art, music, or a craft project.',
    category: 'special',
    duration: '3 hours',
    tags: {
      interests: ['creative', 'art', 'music'],
      energy: 'medium',
      budget: 'low',
      mode: 'in-person',
      loveLanguages: ['QualityTime', 'Gifts'],
    },
    weights: {
      creative: 3,
      art: 2,
      music: 2,
      QualityTime: 2,
    },
    steps: [
      { number: 1, text: 'Pick a project: painting, pottery, music, scrapbook', icon: '🎨' },
      { number: 2, text: 'Gather materials (or use what you have)', icon: '✂️' },
      { number: 3, text: 'Create together, helping and encouraging each other', icon: '🖌️' },
    ],
    virtualAdaptation: 'Create separate projects and show progress on video call.',
    giftIdea: 'Frame or keep the creation as a memento.',
  },
]

/**
 * Date-matching algorithm with tag-based scoring
 * Returns top 3 varied dates (one quick, one medium, one special)
 */
export function generatePersonalizedDates(
  input: DateGeneratorInput,
  profile1: Profile,
  profile2: Profile,
  recentlyUsedTemplateIds: string[] = []
): GeneratedDate[] {
  // Filter templates by mode and budget
  let candidates = dateTemplates.filter((template) => {
    const modeMatch = template.tags.mode === 'both' || template.tags.mode === input.mode
    const budgetMatch = compareBudget(template.tags.budget, input.budget) <= 0
    const notRecentlyUsed = !recentlyUsedTemplateIds.includes(template.id)

    return modeMatch && budgetMatch && notRecentlyUsed
  })

  // Score each template
  const scoredTemplates = candidates.map((template) => {
    let score = 0

    // Match interests
    const combinedInterests = [...profile1.interests, ...profile2.interests]
    template.tags.interests.forEach((interest) => {
      const matchCount = combinedInterests.filter((i) => i.toLowerCase() === interest.toLowerCase()).length
      const weight = template.weights[interest] || 1
      score += matchCount * weight
    })

    // Match energy level
    if (template.tags.energy === input.energy) {
      score += 3
    } else if (
      (template.tags.energy === 'medium' && input.energy !== 'low') ||
      (input.energy === 'medium' && template.tags.energy !== 'high')
    ) {
      score += 1
    }

    // Match love languages
    const profile1LoveLanguages = getLoveLanguages(profile1)
    const profile2LoveLanguages = getLoveLanguages(profile2)
    const combinedLoveLanguages = [...profile1LoveLanguages, ...profile2LoveLanguages]

    template.tags.loveLanguages.forEach((lang) => {
      if (combinedLoveLanguages.includes(lang)) {
        const weight = template.weights[lang] || 2
        score += weight
      }
    })

    // Preference for templates that match selected interests
    input.interests.forEach((interest) => {
      if (template.tags.interests.some((ti) => ti.toLowerCase() === interest.toLowerCase())) {
        score += 2
      }
    })

    return {
      template,
      score,
    }
  })

  // Sort by score
  scoredTemplates.sort((a, b) => b.score - a.score)

  // Select top 3: one from each category
  const result: GeneratedDate[] = []

  const quickDate = scoredTemplates.find((s) => s.template.category === 'quick')
  const mediumDate = scoredTemplates.find((s) => s.template.category === 'medium')
  const specialDate = scoredTemplates.find((s) => s.template.category === 'special')

  if (quickDate) {
    result.push(createGeneratedDate(quickDate.template, quickDate.score, profile1, profile2))
  }
  if (mediumDate) {
    result.push(createGeneratedDate(mediumDate.template, mediumDate.score, profile1, profile2))
  }
  if (specialDate) {
    result.push(createGeneratedDate(specialDate.template, specialDate.score, profile1, profile2))
  }

  // If we don't have 3, add highest scoring remaining
  while (result.length < 3 && scoredTemplates.length > result.length) {
    const next = scoredTemplates.find(
      (s) => !result.some((r) => r.id === s.template.id)
    )
    if (next) {
      result.push(createGeneratedDate(next.template, next.score, profile1, profile2))
    } else {
      break
    }
  }

  return result
}

function createGeneratedDate(
  template: DateTemplate,
  score: number,
  profile1: Profile,
  profile2: Profile
): GeneratedDate {
  const whyItFits = generateWhyItFits(template, profile1, profile2)

  return {
    ...template,
    whyItFits,
    score,
  }
}

function generateWhyItFits(
  template: DateTemplate,
  profile1: Profile,
  profile2: Profile
): string {
  const reasons: string[] = []

  // Match interests
  const matchedInterests = template.tags.interests.filter(
    (interest) =>
      profile1.interests.some((i) => i.toLowerCase() === interest.toLowerCase()) ||
      profile2.interests.some((i) => i.toLowerCase() === interest.toLowerCase())
  )

  if (matchedInterests.length > 0) {
    const name = profile1.interests.some((i) =>
      matchedInterests.includes(i.toLowerCase())
    )
      ? profile1.name
      : profile2.name
    reasons.push(`${name} loves ${matchedInterests[0]}`)
  }

  // Match energy level
  if (template.tags.energy === 'low') {
    reasons.push('perfect for cozy, low-pressure time')
  } else if (template.tags.energy === 'high') {
    reasons.push('matches your high-energy preferences')
  }

  // Match budget
  if (template.tags.budget === 'free') {
    reasons.push('no cost required')
  }

  // Default
  if (reasons.length === 0) {
    reasons.push('a great fit for you both')
  }

  return `Because ${reasons.join(' + ')}.`
}

function getLoveLanguages(profile: Profile): string[] {
  const languages: string[] = []
  const scores = profile.loveLanguages

  // Get top 2 love languages
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a)

  sorted.slice(0, 2).forEach(([lang]) => {
    if (lang === 'wordsOfAffirmation') languages.push('Words')
    if (lang === 'qualityTime') languages.push('QualityTime')
    if (lang === 'receivingGifts') languages.push('Gifts')
    if (lang === 'actsOfService') languages.push('Acts')
    if (lang === 'physicalTouch') languages.push('PhysicalTouch')
  })

  return languages
}

function compareBudget(
  a: 'free' | 'low' | 'medium' | 'high',
  b: 'free' | 'low' | 'medium' | 'high'
): number {
  const order = { free: 0, low: 1, medium: 2, high: 3 }
  return order[a] - order[b]
}
