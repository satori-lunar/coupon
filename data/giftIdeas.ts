// Gift ideas database with love language matching

export interface GiftIdea {
  id: string
  title: string
  description: string
  category: 'physical' | 'experience' | 'digital' | 'handmade'
  loveLanguages: string[] // Primary love languages this gift serves
  budget: 'low' | 'medium' | 'high'
  triggers: string[] // Things to avoid (e.g., 'expensive', 'public', 'time-consuming')
  longDistance: boolean // Suitable for long distance
  accessibility: string[] // Accessibility considerations
  tags: string[]
  estimatedCost: {
    low: number
    high: number
  }
}

export const giftIdeas: GiftIdea[] = [
  // Words of Affirmation
  {
    id: 'love-letter',
    title: 'Personalized Love Letter',
    description: 'A handwritten letter expressing your deepest feelings and appreciation',
    category: 'handmade',
    loveLanguages: ['wordsOfAffirmation'],
    budget: 'low',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['romantic', 'personal', 'meaningful'],
    estimatedCost: { low: 0, high: 5 }
  },
  {
    id: 'affirmation-cards',
    title: 'Custom Affirmation Cards',
    description: 'A set of cards with personalized affirmations and compliments',
    category: 'handmade',
    loveLanguages: ['wordsOfAffirmation'],
    budget: 'low',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['encouraging', 'supportive', 'daily'],
    estimatedCost: { low: 10, high: 25 }
  },
  {
    id: 'voice-message-book',
    title: 'Voice Message Book',
    description: 'A collection of recorded messages expressing love and appreciation',
    category: 'digital',
    loveLanguages: ['wordsOfAffirmation'],
    budget: 'low',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['audio', 'personal', 'emotional'],
    estimatedCost: { low: 0, high: 10 }
  },

  // Quality Time
  {
    id: 'date-night-voucher',
    title: 'Date Night Experience Voucher',
    description: 'A promise for a special date night tailored to their preferences',
    category: 'experience',
    loveLanguages: ['qualityTime'],
    budget: 'medium',
    triggers: [],
    longDistance: false,
    accessibility: [],
    tags: ['planning', 'anticipation', 'personalized'],
    estimatedCost: { low: 0, high: 100 }
  },
  {
    id: 'shared-calendar',
    title: 'Couple\'s Shared Calendar',
    description: 'A beautifully designed calendar for planning quality time together',
    category: 'physical',
    loveLanguages: ['qualityTime'],
    budget: 'low',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['planning', 'organizational', 'decorative'],
    estimatedCost: { low: 15, high: 35 }
  },
  {
    id: 'memory-jar',
    title: 'Memory Jar Experience',
    description: 'A jar filled with notes of shared memories and future plans',
    category: 'handmade',
    loveLanguages: ['qualityTime'],
    budget: 'low',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['nostalgic', 'reflective', 'creative'],
    estimatedCost: { low: 10, high: 20 }
  },

  // Receiving Gifts
  {
    id: 'personalized-jewelry',
    title: 'Personalized Jewelry',
    description: 'Custom jewelry with meaningful engraving or birthstones',
    category: 'physical',
    loveLanguages: ['receivingGifts'],
    budget: 'high',
    triggers: ['expensive'],
    longDistance: true,
    accessibility: [],
    tags: ['luxury', 'sentimental', 'wearable'],
    estimatedCost: { low: 50, high: 300 }
  },
  {
    id: 'experience-box',
    title: 'Surprise Experience Box',
    description: 'A curated box of small gifts and experiences',
    category: 'physical',
    loveLanguages: ['receivingGifts'],
    budget: 'medium',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['surprise', 'variety', 'themed'],
    estimatedCost: { low: 30, high: 80 }
  },
  {
    id: 'memory-gift',
    title: 'Memory-Based Gift',
    description: 'A gift based on shared memories or inside jokes',
    category: 'physical',
    loveLanguages: ['receivingGifts'],
    budget: 'medium',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['personalized', 'nostalgic', 'meaningful'],
    estimatedCost: { low: 20, high: 100 }
  },

  // Acts of Service
  {
    id: 'chore-voucher',
    title: 'Chore-Free Day Voucher',
    description: 'A promise to handle all chores for a full day',
    category: 'experience',
    loveLanguages: ['actsOfService'],
    budget: 'low',
    triggers: [],
    longDistance: false,
    accessibility: [],
    tags: ['helpful', 'practical', 'relaxing'],
    estimatedCost: { low: 0, high: 10 }
  },
  {
    id: 'personalized-service',
    title: 'Personalized Service',
    description: 'A service tailored to their needs (massage, cooking their favorite meal, etc.)',
    category: 'experience',
    loveLanguages: ['actsOfService'],
    budget: 'medium',
    triggers: [],
    longDistance: false,
    accessibility: [],
    tags: ['caring', 'attentive', 'practical'],
    estimatedCost: { low: 20, high: 100 }
  },
  {
    id: 'help-book',
    title: 'Help & Support Book',
    description: 'A book of vouchers for various acts of service and support',
    category: 'physical',
    loveLanguages: ['actsOfService'],
    budget: 'low',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['practical', 'supportive', 'redeemable'],
    estimatedCost: { low: 5, high: 15 }
  },

  // Physical Touch
  {
    id: 'massage-kit',
    title: 'Home Massage Kit',
    description: 'Essential oils, lotions, and tools for at-home massages',
    category: 'physical',
    loveLanguages: ['physicalTouch'],
    budget: 'medium',
    triggers: ['intimate'],
    longDistance: false,
    accessibility: [],
    tags: ['relaxing', 'intimate', 'therapeutic'],
    estimatedCost: { low: 30, high: 80 }
  },
  {
    id: 'cuddly-blanket',
    title: 'Personalized Cuddly Blanket',
    description: 'A soft blanket for cozy cuddle sessions',
    category: 'physical',
    loveLanguages: ['physicalTouch'],
    budget: 'medium',
    triggers: [],
    longDistance: false,
    accessibility: [],
    tags: ['cozy', 'comfortable', 'shared'],
    estimatedCost: { low: 25, high: 60 }
  },
  {
    id: 'touch-voucher',
    title: 'Physical Affection Voucher',
    description: 'Vouchers for different types of physical affection and touch',
    category: 'handmade',
    loveLanguages: ['physicalTouch'],
    budget: 'low',
    triggers: ['intimate'],
    longDistance: false,
    accessibility: [],
    tags: ['intimate', 'playful', 'redeemable'],
    estimatedCost: { low: 0, high: 5 }
  },

  // Universal Gifts (suit multiple love languages)
  {
    id: 'photo-book',
    title: 'Personalized Photo Book',
    description: 'A beautiful book of your shared memories and photos',
    category: 'physical',
    loveLanguages: ['qualityTime', 'receivingGifts'],
    budget: 'medium',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['nostalgic', 'visual', 'keepsake'],
    estimatedCost: { low: 25, high: 75 }
  },
  {
    id: 'playlist',
    title: 'Personalized Playlist',
    description: 'A curated playlist of songs that represent your relationship',
    category: 'digital',
    loveLanguages: ['wordsOfAffirmation', 'qualityTime'],
    budget: 'low',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['music', 'emotional', 'shareable'],
    estimatedCost: { low: 0, high: 15 }
  },
  {
    id: 'promise-jar',
    title: 'Promise Jar',
    description: 'A jar filled with promises and commitments for the future',
    category: 'handmade',
    loveLanguages: ['wordsOfAffirmation', 'actsOfService'],
    budget: 'low',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['promises', 'commitment', 'future-oriented'],
    estimatedCost: { low: 5, high: 15 }
  },

  // Long Distance Specific
  {
    id: 'virtual-date-kit',
    title: 'Virtual Date Kit',
    description: 'Items to make virtual dates more special (matching pajamas, favorite snacks, etc.)',
    category: 'physical',
    loveLanguages: ['qualityTime', 'physicalTouch'],
    budget: 'medium',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['virtual', 'coordinating', 'special'],
    estimatedCost: { low: 30, high: 70 }
  },
  {
    id: 'mailbox-surprises',
    title: 'Mailbox Surprise Subscription',
    description: 'Regular small surprises sent through the mail',
    category: 'experience',
    loveLanguages: ['receivingGifts', 'wordsOfAffirmation'],
    budget: 'medium',
    triggers: [],
    longDistance: true,
    accessibility: [],
    tags: ['mail', 'surprise', 'ongoing'],
    estimatedCost: { low: 50, high: 150 }
  }
]
