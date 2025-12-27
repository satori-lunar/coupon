// Zustand store for app state management

import { create } from 'zustand'
import { persistence } from '@/persistence/localStorageAdapter'
import type {
  Profile,
  Couple,
  Pet,
  AppState,
  MoodCheckIn,
  ScheduledDate,
  DailyPrompt,
  ConversationStarter,
  Moment,
  SavedDate,
  AdventureBookEntry,
  GeneratedDate,
  OnboardingProgress,
  DateGeneratorInput,
} from '@/types'

interface AppStore extends AppState {
  scheduledDates: ScheduledDate[]
  // Actions
  setCurrentUser: (userId: string) => void
  setCouple: (couple: Couple) => void
  setProfiles: (profiles: Record<string, Profile>) => void
  addProfile: (profile: Profile) => Promise<void>
  setPet: (pet: Pet) => void
  setCoins: (coins: number) => void
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean
  addMoodCheckIn: (checkIn: MoodCheckIn) => void
  addScheduledDate: (date: ScheduledDate) => void
  addDailyPrompt: (prompt: DailyPrompt) => void
  addDailyPromptResponse: (date: string, question: string, userId: string, response: string) => Promise<void>
  addDailyPromptGuess: (date: string, userId: string, guess: string) => Promise<void>
  markGuessRevealed: (date: string, userId: string) => Promise<void>
  addConversationStarter: (starter: ConversationStarter) => void
  addMoment: (moment: Moment) => void
  // New actions for enhanced features
  saveDate: (date: SavedDate) => void
  updateSavedDate: (id: string, updates: Partial<SavedDate>) => void
  addAdventureBookEntry: (entry: AdventureBookEntry) => void
  setLastGeneratedDates: (dates: GeneratedDate[]) => void
  updateOnboarding: (progress: OnboardingProgress) => void
  completeOnboarding: () => void
  updateSettings: (settings: Partial<AppState['settings']>) => void
  loadAppState: () => Promise<void>
  saveAppState: () => Promise<void>
  reset: () => void
}


export const useAppStore = create<AppStore>((set, get) => ({
  profiles: {},
  coins: 0,
  moodCheckIns: [],
  dailyPrompts: [],
  conversationStarters: [],
  moments: [],
  scheduledDates: [],
  savedDates: [],
  adventureBook: [],
  lastGeneratedDates: [],
  settings: {
    fontSize: 'normal',
    notifications: true,
    reducedMotion: false,
    highContrast: false,
    privacy: {
      shareData: false,
      exportData: false,
    },
  },

  setCurrentUser: (userId: string) => {
    set({ currentUserId: userId })
    get().saveAppState()
  },

  setCouple: (couple: Couple) => {
    set({ coupleId: couple.id, couple })
    get().saveAppState()
  },

  setProfiles: (profiles: Record<string, Profile>) => {
    set({ profiles })
  },

  addProfile: async (profile: Profile) => {
    await persistence.saveProfile(profile)
    set((state) => ({
      profiles: { ...state.profiles, [profile.id]: profile },
    }))
    get().saveAppState()
  },

  setPet: (pet: Pet) => {
    set({ pet })
    get().saveAppState()
  },

  setCoins: (coins: number) => {
    set({ coins })
    get().saveAppState()
  },

  addCoins: (amount: number) => {
    const current = get().coins
    set({ coins: current + amount })
    get().saveAppState()
  },

  spendCoins: (amount: number): boolean => {
    const current = get().coins
    if (current >= amount) {
      set({ coins: current - amount })
      get().saveAppState()
      return true
    }
    return false
  },

  addMoodCheckIn: (checkIn: MoodCheckIn) => {
    set((state) => ({
      moodCheckIns: [...(state.moodCheckIns || []), checkIn],
    }))
    get().saveAppState()
  },

  addScheduledDate: (date: ScheduledDate) => {
    set((state) => ({
      scheduledDates: [...(state.scheduledDates || []), date],
    }))
    get().saveAppState()
  },

  addDailyPrompt: (prompt: DailyPrompt) => {
    set((state) => ({
      dailyPrompts: [...(state.dailyPrompts || []), prompt],
    }))
    get().saveAppState()
  },

  addDailyPromptResponse: async (date: string, question: string, userId: string, response: string) => {
    set((state) => {
      const existingPrompts = state.dailyPrompts || []
      const existingPromptIndex = existingPrompts.findIndex(p => p.date === date)

      if (existingPromptIndex >= 0) {
        // Update existing prompt with new response
        const updatedPrompts = [...existingPrompts]
        updatedPrompts[existingPromptIndex] = {
          ...updatedPrompts[existingPromptIndex],
          responses: {
            ...updatedPrompts[existingPromptIndex].responses,
            [userId]: response,
          },
        }
        return { dailyPrompts: updatedPrompts }
      } else {
        // Create new prompt with response
        const newPrompt: DailyPrompt = {
          id: `prompt-${date}-${Date.now()}`,
          question,
          category: 'daily',
          date,
          responses: { [userId]: response },
        }
        return { dailyPrompts: [...existingPrompts, newPrompt] }
      }
    })
    await get().saveAppState()
  },

  addDailyPromptGuess: async (date: string, userId: string, guess: string) => {
    set((state) => {
      const existingPrompts = state.dailyPrompts || []
      const existingPromptIndex = existingPrompts.findIndex(p => p.date === date)

      if (existingPromptIndex >= 0) {
        const updatedPrompts = [...existingPrompts]
        updatedPrompts[existingPromptIndex] = {
          ...updatedPrompts[existingPromptIndex],
          guesses: {
            ...updatedPrompts[existingPromptIndex].guesses,
            [userId]: guess,
          },
        }
        return { dailyPrompts: updatedPrompts }
      }
      return state
    })
    await get().saveAppState()
  },

  markGuessRevealed: async (date: string, userId: string) => {
    set((state) => {
      const existingPrompts = state.dailyPrompts || []
      const existingPromptIndex = existingPrompts.findIndex(p => p.date === date)

      if (existingPromptIndex >= 0) {
        const updatedPrompts = [...existingPrompts]
        updatedPrompts[existingPromptIndex] = {
          ...updatedPrompts[existingPromptIndex],
          guessRevealed: {
            ...updatedPrompts[existingPromptIndex].guessRevealed,
            [userId]: true,
          },
        }
        return { dailyPrompts: updatedPrompts }
      }
      return state
    })
    await get().saveAppState()
  },

  addConversationStarter: (starter: ConversationStarter) => {
    set((state) => ({
      conversationStarters: [...(state.conversationStarters || []), starter],
    }))
    get().saveAppState()
  },

  addMoment: (moment: Moment) => {
    set((state) => ({
      moments: [...(state.moments || []), moment],
    }))
    get().saveAppState()
  },

  // New action implementations
  saveDate: (date: SavedDate) => {
    set((state) => ({
      savedDates: [...(state.savedDates || []), date],
    }))
    get().saveAppState()
  },

  updateSavedDate: (id: string, updates: Partial<SavedDate>) => {
    set((state) => ({
      savedDates: (state.savedDates || []).map((date) =>
        date.id === id ? { ...date, ...updates } : date
      ),
    }))
    get().saveAppState()
  },

  addAdventureBookEntry: (entry: AdventureBookEntry) => {
    set((state) => ({
      adventureBook: [...(state.adventureBook || []), entry],
    }))
    get().saveAppState()
  },

  setLastGeneratedDates: (dates: GeneratedDate[]) => {
    set({ lastGeneratedDates: dates })
    get().saveAppState()
  },

  updateOnboarding: (progress: OnboardingProgress) => {
    set({ onboarding: progress })
    get().saveAppState()
  },

  completeOnboarding: () => {
    set((state) => ({
      onboarding: state.onboarding ? { ...state.onboarding, completed: true } : undefined,
    }))
    get().saveAppState()
  },

  updateSettings: (newSettings: Partial<AppState['settings']>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }))
    get().saveAppState()
  },

  loadAppState: async () => {
    const state = await persistence.getAppState()
    if (state) {
      // Load scheduled dates separately
      const scheduledDates = state.coupleId
        ? await persistence.getScheduledDates(state.coupleId)
        : []

      set({
        ...state,
        moodCheckIns: state.moodCheckIns || [],
        dailyPrompts: state.dailyPrompts || [],
        conversationStarters: state.conversationStarters || [],
        moments: state.moments || [],
        scheduledDates: scheduledDates,
        savedDates: state.savedDates || [],
        adventureBook: state.adventureBook || [],
        lastGeneratedDates: state.lastGeneratedDates || [],
        onboarding: state.onboarding,
        settings: {
          fontSize: state.settings?.fontSize || 'normal',
          notifications: state.settings?.notifications !== false,
          reducedMotion: state.settings?.reducedMotion || false,
          highContrast: state.settings?.highContrast || false,
          privacy: state.settings?.privacy || {
            shareData: false,
            exportData: false,
          },
        },
      })
    }
  },

  saveAppState: async () => {
    const state = get()
    const appState: AppState = {
      currentUserId: state.currentUserId,
      coupleId: state.coupleId,
      profiles: state.profiles,
      couple: state.couple,
      pet: state.pet,
      coins: state.coins,
      moodCheckIns: state.moodCheckIns || [],
      dailyPrompts: state.dailyPrompts || [],
      conversationStarters: state.conversationStarters || [],
      moments: state.moments || [],
      settings: state.settings,
      scheduledDates: state.scheduledDates || [],
      savedDates: state.savedDates || [],
      adventureBook: state.adventureBook || [],
      lastGeneratedDates: state.lastGeneratedDates,
      onboarding: state.onboarding,
    }
    await persistence.saveAppState(appState)
  },

  reset: () => {
    set({
      currentUserId: undefined,
      coupleId: undefined,
      profiles: {},
      couple: undefined,
      pet: undefined,
      coins: 0,
      moodCheckIns: [],
      dailyPrompts: [],
      conversationStarters: [],
      moments: [],
      scheduledDates: [],
      savedDates: [],
      adventureBook: [],
      lastGeneratedDates: [],
      onboarding: undefined,
      settings: {
        fontSize: 'normal',
        notifications: true,
        reducedMotion: false,
        highContrast: false,
        privacy: {
          shareData: false,
          exportData: false,
        },
      },
    })
  },
}))

