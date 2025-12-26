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
  addConversationStarter: (starter: ConversationStarter) => void
  addMoment: (moment: Moment) => void
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
      scheduledDates: [],
    })
  },
}))

