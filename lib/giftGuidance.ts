import type { Profile, GiftSuggestion } from '@/types'

// Gift suggestion banks organized by love language
const GIFT_BANKS = {
  wordsOfAffirmation: [
    {
      category: 'physical' as const,
      title: 'Handwritten love letter journal',
      description: 'A beautiful journal filled with handwritten notes about why you love them',
      why: 'They value words of affirmation and will treasure your written expressions',
      howToPresent: 'Leave it somewhere they will find it, with a note to read one page each day',
      budget: 'low' as const,
    },
    {
      category: 'physical' as const,
      title: 'Custom book of compliments',
      description: 'Create a small book with 52 compliments - one for each week',
      why: 'Words of affirmation are their love language, and personalized compliments show thoughtfulness',
      howToPresent: 'Gift it with the first week already bookmarked',
      budget: 'free' as const,
    },
    {
      category: 'virtual' as const,
      title: 'Daily affirmation texts for a month',
      description: 'Commit to sending them a thoughtful compliment every morning for 30 days',
      why: 'Consistent words of affirmation fill their emotional tank',
      howToPresent: 'Tell them about it on day 1 and follow through every morning',
      budget: 'free' as const,
    },
  ],
  qualityTime: [
    {
      category: 'experience' as const,
      title: 'Surprise day trip adventure',
      description: 'Plan a full day exploring a nearby town or nature spot together',
      why: 'Quality time is their love language - uninterrupted time together means everything',
      howToPresent: 'Create a simple itinerary card and present it at breakfast',
      budget: 'medium' as const,
    },
    {
      category: 'experience' as const,
      title: 'Monthly date night subscription',
      description: 'Commit to one special date night every month for the next year',
      why: 'They value dedicated time together, and consistency shows commitment',
      howToPresent: 'Create a calendar with the first 3 dates already planned',
      budget: 'low' as const,
    },
    {
      category: 'physical' as const,
      title: 'Phone-free evening kit',
      description: 'A box with candles, a playlist, and conversation cards for distraction-free time',
      why: 'Quality time means being fully present - this creates the perfect environment',
      howToPresent: 'Set it up one evening and invite them to unplug with you',
      budget: 'low' as const,
    },
  ],
  receivingGifts: [
    {
      category: 'physical' as const,
      title: 'Subscription box in their interest area',
      description: 'Monthly surprise related to something they love (coffee, books, plants, etc.)',
      why: 'They love receiving gifts, and monthly surprises keep the joy going',
      howToPresent: 'Wrap the first box beautifully with a card explaining the subscription',
      budget: 'medium' as const,
    },
    {
      category: 'physical' as const,
      title: 'Thoughtful "just because" gift',
      description: 'Something small they mentioned wanting weeks ago',
      why: 'Remembering small details shows you listen, and surprise gifts delight them',
      howToPresent: 'Leave it somewhere they will discover it unexpectedly',
      budget: 'low' as const,
    },
    {
      category: 'physical' as const,
      title: 'Custom photo album or scrapbook',
      description: 'A handmade collection of your favorite memories together',
      why: 'Tangible gifts they value, especially when personalized with care',
      howToPresent: 'Present it during a quiet moment together',
      budget: 'low' as const,
    },
  ],
  actsOfService: [
    {
      category: 'experience' as const,
      title: 'Complete their chore list for a week',
      description: 'Take over all their least favorite tasks for 7 days',
      why: 'Acts of service is their love language - actions speak louder than words',
      howToPresent: 'Create a certificate promising the week of service',
      budget: 'free' as const,
    },
    {
      category: 'experience' as const,
      title: 'Meal prep their favorites',
      description: 'Spend a Sunday making their favorite meals for the week ahead',
      why: 'Practical help that saves them time shows you care about their wellbeing',
      howToPresent: 'Stock the fridge and leave sticky notes on each container with sweet messages',
      budget: 'low' as const,
    },
    {
      category: 'experience' as const,
      title: 'Handle their dreaded errand',
      description: 'Take care of that task they have been putting off',
      why: 'Removing stress from their life is how they feel most loved',
      howToPresent: 'Just do it, then tell them it is done',
      budget: 'free' as const,
    },
  ],
  physicalTouch: [
    {
      category: 'experience' as const,
      title: 'Couples massage class',
      description: 'Learn massage techniques together in a class',
      why: 'Physical touch is their love language, and this is a gift that keeps giving',
      howToPresent: 'Book it and tell them about the date',
      budget: 'medium' as const,
    },
    {
      category: 'physical' as const,
      title: 'Cozy comfort items',
      description: 'Soft blanket, fuzzy socks, or weighted blanket for cuddling',
      why: 'Creates opportunities for physical closeness and comfort',
      howToPresent: 'Set up a cozy space and invite them to snuggle',
      budget: 'medium' as const,
    },
    {
      category: 'experience' as const,
      title: 'Dance lesson date',
      description: 'Take a couples dance class (salsa, swing, ballroom)',
      why: 'Combines physical touch with a fun shared activity',
      howToPresent: 'Surprise them with the first class booked',
      budget: 'medium' as const,
    },
  ],
}

export function generateGiftSuggestions(
  partnerId: string,
  partnerProfile: Profile,
  occasion?: 'birthday' | 'anniversary' | 'just-because'
): GiftSuggestion[] {
  if (!partnerProfile) return []

  // Find partner's primary and secondary love languages
  const loveLanguageScores = Object.entries(partnerProfile.loveLanguages).sort(
    (a, b) => b[1] - a[1]
  )
  const primaryLanguage = loveLanguageScores[0][0] as keyof typeof GIFT_BANKS
  const secondaryLanguage = loveLanguageScores[1][0] as keyof typeof GIFT_BANKS

  // Get gift suggestions from both love languages
  const primaryGifts = GIFT_BANKS[primaryLanguage] || []
  const secondaryGifts = GIFT_BANKS[secondaryLanguage] || []

  // Combine and shuffle
  const allGifts = [...primaryGifts, ...secondaryGifts.slice(0, 2)]
    .map((gift, index) => ({
      id: `gift-${partnerId}-${Date.now()}-${index}`,
      ...gift,
    }))
    .sort(() => Math.random() - 0.5)

  // Return top 3-5 suggestions
  return allGifts.slice(0, occasion === 'birthday' || occasion === 'anniversary' ? 5 : 3)
}
