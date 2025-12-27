import type { Profile, WeeklySuggestion } from '@/types'

// Love language suggestion banks
const WORDS_OF_AFFIRMATION_SUGGESTIONS = [
  {
    id: 'words-1',
    title: 'Write a short love letter',
    description: 'Pen a heartfelt note expressing what you appreciate about them',
    category: 'words' as const,
    effort: 'low' as const,
  },
  {
    id: 'words-2',
    title: 'Create a scavenger hunt with affirming notes',
    description: 'Hide 5 notes around the house, each highlighting something you love about them',
    category: 'words' as const,
    effort: 'medium' as const,
  },
  {
    id: 'words-3',
    title: 'Send a thoughtful text each morning',
    description: 'Start their day with a compliment or affirmation for 7 days',
    category: 'words' as const,
    effort: 'low' as const,
  },
  {
    id: 'words-4',
    title: 'Record a voice note sharing memories',
    description: 'Record a 2-minute voice note about your favorite memories together',
    category: 'words' as const,
    effort: 'low' as const,
  },
  {
    id: 'words-5',
    title: 'Write why you are grateful for them',
    description: 'List 10 specific reasons you are grateful they are in your life',
    category: 'words' as const,
    effort: 'medium' as const,
  },
]

const QUALITY_TIME_SUGGESTIONS = [
  {
    id: 'time-1',
    title: 'Plan a phone-free evening',
    description: 'Dedicate 2 hours to being fully present together without devices',
    category: 'time' as const,
    effort: 'low' as const,
  },
  {
    id: 'time-2',
    title: 'Cook a new recipe together',
    description: 'Choose a cuisine neither of you has tried and cook it together',
    category: 'time' as const,
    effort: 'medium' as const,
  },
  {
    id: 'time-3',
    title: 'Take a sunset walk',
    description: 'Go for a 30-minute walk together during golden hour',
    category: 'time' as const,
    effort: 'low' as const,
  },
  {
    id: 'time-4',
    title: 'Have a morning coffee date',
    description: 'Wake up 30 minutes early to enjoy coffee and conversation',
    category: 'time' as const,
    effort: 'low' as const,
  },
  {
    id: 'time-5',
    title: 'Plan a surprise day adventure',
    description: 'Organize a full day exploring somewhere new together',
    category: 'time' as const,
    effort: 'high' as const,
  },
]

const RECEIVING_GIFTS_SUGGESTIONS = [
  {
    id: 'gifts-1',
    title: 'Give flowers with a handwritten note',
    description: 'Pick up their favorite flowers and attach a personal message',
    category: 'gift' as const,
    effort: 'low' as const,
  },
  {
    id: 'gifts-2',
    title: 'Create a custom playlist',
    description: 'Curate 15 songs that remind you of them with a sweet title',
    category: 'gift' as const,
    effort: 'low' as const,
  },
  {
    id: 'gifts-3',
    title: 'Buy their favorite snack',
    description: 'Surprise them with that treat they have been mentioning',
    category: 'gift' as const,
    effort: 'low' as const,
  },
  {
    id: 'gifts-4',
    title: 'Frame a favorite photo together',
    description: 'Print and frame a meaningful photo from your relationship',
    category: 'gift' as const,
    effort: 'medium' as const,
  },
  {
    id: 'gifts-5',
    title: 'Send them a book you think they would love',
    description: 'Choose a book that matches their interests with a note inside',
    category: 'gift' as const,
    effort: 'medium' as const,
  },
]

const ACTS_OF_SERVICE_SUGGESTIONS = [
  {
    id: 'acts-1',
    title: 'Take care of their least favorite chore',
    description: 'Do that task they always put off without being asked',
    category: 'action' as const,
    effort: 'medium' as const,
  },
  {
    id: 'acts-2',
    title: 'Make their favorite breakfast',
    description: 'Wake up early and prepare breakfast exactly how they like it',
    category: 'action' as const,
    effort: 'low' as const,
  },
  {
    id: 'acts-3',
    title: 'Organize something for them',
    description: 'Tidy up their workspace or a cluttered area they have been meaning to fix',
    category: 'action' as const,
    effort: 'medium' as const,
  },
  {
    id: 'acts-4',
    title: 'Run an errand they have been putting off',
    description: 'Take care of that task on their to-do list',
    category: 'action' as const,
    effort: 'medium' as const,
  },
  {
    id: 'acts-5',
    title: 'Prepare their favorite meal',
    description: 'Cook their comfort food and handle all the cleanup',
    category: 'action' as const,
    effort: 'medium' as const,
  },
]

const PHYSICAL_TOUCH_SUGGESTIONS = [
  {
    id: 'touch-1',
    title: 'Give them a 15-minute massage',
    description: 'Set up a relaxing space and give them a shoulder or foot massage',
    category: 'touch' as const,
    effort: 'low' as const,
  },
  {
    id: 'touch-2',
    title: 'Initiate more physical affection',
    description: 'Make an effort to hug, hold hands, or cuddle more throughout the week',
    category: 'touch' as const,
    effort: 'low' as const,
  },
  {
    id: 'touch-3',
    title: 'Plan a cozy movie night',
    description: 'Set up blankets and pillows for a cuddly movie marathon',
    category: 'touch' as const,
    effort: 'low' as const,
  },
  {
    id: 'touch-4',
    title: 'Dance together in the kitchen',
    description: 'Put on your song and slow dance for a few minutes',
    category: 'touch' as const,
    effort: 'low' as const,
  },
  {
    id: 'touch-5',
    title: 'Give them a head scratch while relaxing',
    description: 'Offer a soothing head massage while watching TV or reading',
    category: 'touch' as const,
    effort: 'low' as const,
  },
]

export function generateWeeklySuggestions(
  userId: string,
  partnerProfile: Profile
): WeeklySuggestion | null {
  if (!partnerProfile) return null

  // Find partner's primary love language
  const loveLanguages = partnerProfile.loveLanguages
  const primaryLoveLanguage = Object.entries(loveLanguages).reduce((a, b) =>
    loveLanguages[a[0] as keyof typeof loveLanguages] >
    loveLanguages[b[0] as keyof typeof loveLanguages]
      ? a
      : b
  )[0]

  // Select suggestion bank based on primary love language
  let suggestionBank
  let loveLanguageName = ''

  switch (primaryLoveLanguage) {
    case 'wordsOfAffirmation':
      suggestionBank = WORDS_OF_AFFIRMATION_SUGGESTIONS
      loveLanguageName = 'Words of Affirmation'
      break
    case 'qualityTime':
      suggestionBank = QUALITY_TIME_SUGGESTIONS
      loveLanguageName = 'Quality Time'
      break
    case 'receivingGifts':
      suggestionBank = RECEIVING_GIFTS_SUGGESTIONS
      loveLanguageName = 'Receiving Gifts'
      break
    case 'actsOfService':
      suggestionBank = ACTS_OF_SERVICE_SUGGESTIONS
      loveLanguageName = 'Acts of Service'
      break
    case 'physicalTouch':
      suggestionBank = PHYSICAL_TOUCH_SUGGESTIONS
      loveLanguageName = 'Physical Touch'
      break
    default:
      suggestionBank = QUALITY_TIME_SUGGESTIONS
      loveLanguageName = 'Quality Time'
  }

  // Get current week (Monday of the current week)
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(now)
  monday.setDate(now.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)
  const weekOf = monday.toISOString().split('T')[0]

  // Randomly select 3 suggestions from the bank
  const shuffled = [...suggestionBank].sort(() => Math.random() - 0.5)
  const selectedSuggestions = shuffled.slice(0, 3)

  return {
    id: `suggestion-${userId}-${weekOf}`,
    userId,
    partnerId: partnerProfile.id,
    weekOf,
    loveLanguage: loveLanguageName,
    suggestions: selectedSuggestions,
    createdAt: new Date().toISOString(),
  }
}
