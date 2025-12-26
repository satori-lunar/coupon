// Zustand store for app state management

import { create } from 'zustand'
import { persistence } from '@/persistence/localStorageAdapter'
import type { Profile, Couple, Pet, AppState } from '@/types'

interface AppStore extends AppState {
  // Actions
  setCurrentUser: (userId: string) => void
  setCouple: (couple: Couple) => void
  setProfiles: (profiles: Record<string, Profile>) => void
  addProfile: (profile: Profile) => Promise<void>
  setPet: (pet: Pet) => void
  setCoins: (coins: number) => void
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean
  updateSettings: (settings: Partial<AppState['settings']>) => void
  loadAppState: () => Promise<void>
  saveAppState: () => Promise<void>
  reset: () => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  profiles: {},
  coins: 0,
  settings: {
    fontSize: 'normal',
    notifications: true,
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

  updateSettings: (newSettings: Partial<AppState['settings']>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }))
    get().saveAppState()
  },

  loadAppState: async () => {
    const state = await persistence.getAppState()
    if (state) {
      set(state)
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
      settings: state.settings,
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
      settings: {
        fontSize: 'normal',
        notifications: true,
        privacy: {
          shareData: false,
          exportData: false,
        },
      },
    })
  },
}))

