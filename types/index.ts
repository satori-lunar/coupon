// Core Types for Couples App

export interface Profile {
  id: string
  name: string
  pronouns?: string
  interests: string[] // Top 5 interests/hobbies
  favoriteDateTypes: string[]
  personality: {
    introvertExtrovert: 'introvert' | 'extrovert' | 'ambivert'
    indoorsOutdoors: 'indoors' | 'outdoors' | 'both'
    budget: 'low' | 'medium' | 'high'
    pace: 'relaxed' | 'adventurous' | 'balanced'
  }

  // Love Languages (1-5 scale for each)
  loveLanguages: {
    wordsOfAffirmation: number
    qualityTime: number
    receivingGifts: number
    actsOfService: number
    physicalTouch: number
  }

  // Relationship Insights
  triggers: string[] // Things to avoid
  sensitivities: string[] // Sensitive topics
  issues: string[] // Things to work on
  hopes: string[] // Dreams and aspirations
  goals: string[] // Relationship goals

  // Practical Details
  location?: {
    city: string
    country: string
    coordinates?: { lat: number; lng: number }
  }
  isLongDistance: boolean

  // Accessibility & Preferences
  socialAbility: 'very-shy' | 'shy' | 'moderate' | 'outgoing' | 'very-outgoing'
  disabilities: string[] // Accessibility needs
  mobilityLevel: 'full' | 'limited' | 'wheelchair' | 'other'

  // Budget (enhanced)
  budget: {
    low: number // Max per date
    medium: number
    high: number
  }

  createdAt: string
  updatedAt: string
}

export interface Couple {
  id: string
  partner1Id: string
  partner2Id: string
  pairCode: string
  createdAt: string
  updatedAt: string
}

export interface DateNight {
  id: string
  title: string
  description: string
  shortDescription: string
  mediumDescription: string
  longDescription: string
  tags: {
    indoors: boolean
    outdoors: boolean
    budget: 'low' | 'medium' | 'high'
    pace: 'relaxed' | 'adventurous' | 'balanced'
    interests: string[]
  }
  steps: string[]
  shoppingList?: string[]
  soundtrack?: string
  moodLighting?: string
  virtualAdaptation?: string
  category: 'creative' | 'cozy' | 'adventure' | 'romantic' | 'playful'
  prompts?: string[]
}

export interface Coupon {
  id: string
  title: string
  description: string
  icon?: string
  category?: string
}

export interface RedeemedCoupon {
  couponId: string
  redeemedAt: string
  redeemedBy: string
  location?: string
  note?: string
}

export interface VirtualGift {
  id: string
  type: 'flower' | 'playlist' | 'voice-note' | 'recipe' | 'video' | 'coupon' | 'animation'
  title: string
  description: string
  cost: number
  from: string
  to: string
  sentAt: string
  redeemedAt?: string
  data?: any // Type-specific data (e.g., playlist URL, voice note blob)
}

export interface Pet {
  id: string
  coupleId: string
  species: 'cat' | 'dog' | 'rabbit' | 'bird' | 'hamster'
  name: string
  level: number
  experience: number
  hunger: number // 0-100
  happiness: number // 0-100
  lastFedAt: string
  lastPlayedAt: string
  unlockedAnimations: string[]
  unlockedBackgrounds: string[]
  createdAt: string
  updatedAt: string
}

export interface GameScore {
  gameId: string
  playerId: string
  score: number
  playedAt: string
  metadata?: any
}

export interface JournalEntry {
  id: string
  coupleId: string
  authorId: string
  content: string
  mood?: string
  photos?: string[]
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

export interface Memory {
  id: string
  coupleId: string
  type: 'date' | 'gift' | 'game' | 'journal' | 'pet-milestone'
  title: string
  description: string
  photos?: string[]
  videos?: string[]
  date: string
  participants: string[]
  metadata?: any
}

export interface Achievement {
  id: string
  coupleId: string
  type: string
  title: string
  description: string
  unlockedAt: string
  icon?: string
}

export interface Streak {
  coupleId: string
  currentStreak: number
  longestStreak: number
  lastActivityDate: string
  type: 'dates' | 'journal' | 'games' | 'gifts'
}

export interface DailyPrompt {
  id: string
  question: string
  category: string
  date: string
}

export interface ScheduledDate {
  id: string
  coupleId: string
  dateNightId?: string
  title: string
  scheduledFor: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  completedAt?: string
}

export interface VirtualDateRoom {
  id: string
  coupleId: string
  shareCode: string
  status: 'waiting' | 'active' | 'ended'
  startedAt?: string
  endedAt?: string
  participants: string[]
}

export interface MoodCheckIn {
  id: string
  userId: string
  coupleId: string
  mood: 'connected' | 'okay' | 'distant'
  note?: string
  date: string
}

export interface RelationshipPulse {
  coupleId: string
  lastCheckIn: string
  averageMood: number // 0-100
  connectionStreak: number
}

export interface ConversationStarter {
  id: string
  question: string
  category: 'deep' | 'gentle' | 'fun' | 'reflection'
  used: boolean
  usedAt?: string
}

export interface Moment {
  id: string
  coupleId: string
  title: string
  description: string
  category: 'coupon' | 'surprise' | 'gesture'
  from: string
  to: string
  createdAt: string
  redeemedAt?: string
}

export interface AppState {
  currentUserId?: string
  coupleId?: string
  profiles: Record<string, Profile>
  couple?: Couple
  pet?: Pet
  coins: number
  moodCheckIns: MoodCheckIn[]
  relationshipPulse?: RelationshipPulse
  dailyPrompts: DailyPrompt[]
  conversationStarters: ConversationStarter[]
  moments: Moment[]
  scheduledDates: ScheduledDate[]
  settings: {
    fontSize: 'normal' | 'large'
    notifications: boolean
    reducedMotion: boolean
    highContrast: boolean
    privacy: {
      shareData: boolean
      exportData: boolean
    }
  }
}

