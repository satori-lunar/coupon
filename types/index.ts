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
  responses?: Record<string, string> // userId -> their own answer
  guesses?: Record<string, string> // userId -> their guess of partner's answer
  guessRevealed?: Record<string, boolean> // userId -> whether they've seen the feedback
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

// Enhanced types for new comprehensive spec

export interface DateTemplate {
  id: string
  title: string
  description: string // 1-2 lines
  category: 'quick' | 'medium' | 'special' // 30m-45m, 1.5-2h, 3+ hours
  duration: string // e.g., "30-45 minutes", "1.5-2 hours"
  tags: {
    interests: string[] // art, cooking, movies, hiking, etc.
    energy: 'low' | 'medium' | 'high'
    budget: 'free' | 'low' | 'medium' | 'high'
    mode: 'in-person' | 'virtual' | 'both'
    loveLanguages: string[] // QualityTime, Acts, Gifts, etc.
  }
  weights: Record<string, number> // for algorithm scoring
  steps: Array<{
    number: number
    text: string
    icon?: string
  }>
  virtualAdaptation?: string
  giftIdea?: string
  playlistSuggestion?: string
}

export interface GeneratedDate extends DateTemplate {
  whyItFits: string // Personalized explanation referencing partner traits
  score: number // Algorithm score (for debugging)
}

export interface SavedDate {
  id: string
  coupleId: string
  templateId: string
  title: string
  description: string
  whyItFits: string
  steps: Array<{ number: number; text: string; icon?: string }>
  virtualAdaptation?: string
  savedAt: string
  scheduledFor?: string
  status: 'saved' | 'scheduled' | 'in-progress' | 'completed'
  completedAt?: string
  rating?: number
  notes?: string
  photos?: string[]
}

export interface AdventureBookEntry {
  id: string
  coupleId: string
  title: string
  description: string
  date: string
  location?: string
  photos: string[]
  tags?: string[]
  participants: string[]
  relatedDateId?: string
  relatedMomentId?: string
  createdAt: string
}

export interface Game {
  id: string
  name: string
  description: string // one-line
  icon: string
  type: 'memory' | 'tap-to-fly' | 'trivia' | 'cooperative'
  isMultiplayer: boolean
  rewardCoins: number
  estimatedTime: string // e.g., "5 minutes"
}

export interface DateGeneratorInput {
  interests: string[]
  energy: 'low' | 'medium' | 'high'
  budget: 'free' | 'low' | 'medium' | 'high'
  mode: 'in-person' | 'virtual'
  duration?: '30m' | '1h' | '3h' | 'day'
}

export interface OnboardingProgress {
  userId: string
  step: number
  completed: boolean
  data: {
    name?: string
    avatar?: string
    loveLanguages?: string[] // up to 2
    interests?: string[] // up to 5
    energy?: 'low' | 'medium' | 'high'
    budget?: 'free' | 'low' | 'medium' | 'high'
    distance?: 'local' | 'long-distance'
    whatMakesYouFeelLoved?: string
  }
}

export interface GiftSuggestion {
  id: string
  category: 'physical' | 'virtual' | 'experience'
  title: string
  description: string
  why: string // Why this fits
  howToPresent: string // How to give it
  budget: 'free' | 'low' | 'medium' | 'high'
  link?: string
  vendorSuggestion?: string
}

export interface WeeklySuggestion {
  id: string
  userId: string // The user receiving the suggestion
  partnerId: string // The partner they're loving
  weekOf: string // ISO date string for the week
  loveLanguage: string // The primary love language this addresses
  suggestions: Array<{
    id: string
    title: string
    description: string
    category: 'action' | 'words' | 'gift' | 'time' | 'touch'
    effort: 'low' | 'medium' | 'high'
    selected?: boolean
    completedAt?: string
  }>
  createdAt: string
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
  savedDates: SavedDate[]
  adventureBook: AdventureBookEntry[]
  onboarding?: OnboardingProgress
  lastGeneratedDates?: GeneratedDate[]
  weeklySuggestions: WeeklySuggestion[]
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

